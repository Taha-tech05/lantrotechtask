import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc Create idea
// @route POST /api/ideas
// @access Employee, Admin
export const createIdea = asyncHandler(async (req, res) => {
  const {
    title, pitch, estimatedBudget, requiredTeamSize,
    expectedImpact, category, priority, tags, attachments,
  } = req.body;

  if (!title || !pitch || !estimatedBudget || !requiredTeamSize || !expectedImpact) {
    res.status(400);
    throw new Error('Title, pitch, budget, team size, and expected impact are required');
  }

  const idea = await prisma.idea.create({
    data: {
      title,
      pitch,
      estimatedBudget,
      requiredTeamSize: Number(requiredTeamSize),
      expectedImpact,
      category,
      priority: priority || 'MEDIUM',
      authorId: req.user.id,
      tags: tags?.length
        ? {
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          }
        : undefined,
      attachments: attachments?.length
        ? { create: attachments.map((a) => ({ fileName: a.fileName, fileUrl: a.fileUrl, fileType: a.fileType })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } }, attachments: true, author: { select: { id: true, name: true } } },
  });

  res.status(201).json({ success: true, data: idea });
});

// @desc Get all ideas (feed) with vote/comment counts
// @route GET /api/ideas
// @access Employee, Admin
export const getIdeas = asyncHandler(async (req, res) => {
  const { status, category, priority, sortBy } = req.query;

  const ideas = await prisma.idea.findMany({
    where: {
      status: status || undefined,
      category: category || undefined,
      priority: priority || undefined,
    },
    include: {
      author: { select: { id: true, name: true, department: true } },
      tags: { include: { tag: true } },
      _count: { select: { votes: true, comments: true } },
    },
    orderBy: sortBy === 'votes' ? undefined : { submissionDate: 'desc' },
  });

  // manual sort by vote count if requested (Prisma can't orderBy relation count directly pre-aggregation)
  const sorted = sortBy === 'votes'
    ? ideas.sort((a, b) => b._count.votes - a._count.votes)
    : ideas;

  res.status(200).json({ success: true, count: sorted.length, data: sorted });
});

// @desc Get single idea with full detail
// @route GET /api/ideas/:id
export const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await prisma.idea.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { id: true, name: true, department: true } },
      tags: { include: { tag: true } },
      attachments: true,
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      votes: true,
      insights: true,
    },
  });

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  res.status(200).json({ success: true, data: idea });
});

// @desc Update own idea (only author, and only while in REVIEWING)
// @route PUT /api/ideas/:id
export const updateIdea = asyncHandler(async (req, res) => {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  if (idea.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to edit this idea');
  }

  if (idea.status !== 'REVIEWING' && req.user.role !== 'ADMIN') {
    res.status(400);
    throw new Error('Idea can only be edited while in REVIEWING status');
  }

  const { title, pitch, estimatedBudget, requiredTeamSize, expectedImpact, category, priority } = req.body;

  const updated = await prisma.idea.update({
    where: { id: req.params.id },
    data: { title, pitch, estimatedBudget, requiredTeamSize, expectedImpact, category, priority },
  });

  res.status(200).json({ success: true, data: updated });
});

// @desc Delete own idea
// @route DELETE /api/ideas/:id
export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  if (idea.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to delete this idea');
  }

  await prisma.idea.delete({ where: { id: req.params.id } });

  res.status(200).json({ success: true, message: 'Idea deleted' });
});

// @desc Vote (back) an idea — toggle on/off
// @route POST /api/ideas/:id/vote
// @access Employee, Admin
export const toggleVote = asyncHandler(async (req, res) => {
  const ideaId = req.params.id;

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const existingVote = await prisma.vote.findUnique({
    where: { ideaId_userId: { ideaId, userId: req.user.id } },
  });

  if (existingVote) {
    await prisma.vote.delete({ where: { id: existingVote.id } });
    return res.status(200).json({ success: true, message: 'Vote removed', voted: false });
  }

  await prisma.vote.create({ data: { ideaId, userId: req.user.id } });
  res.status(201).json({ success: true, message: 'Vote added', voted: true });
});

// @desc Add comment to idea
// @route POST /api/ideas/:id/comments
// @access Employee, Admin
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const ideaId = req.params.id;

  if (!content?.trim()) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const comment = await prisma.comment.create({
    data: { content, ideaId, authorId: req.user.id },
    include: { author: { select: { id: true, name: true } } },
  });

  res.status(201).json({ success: true, data: comment });
});