import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const VALID_STATUSES = ['REVIEWING', 'APPROVED', 'FUNDING_ALLOCATED', 'ARCHIVED'];

// @desc Move idea through pipeline
// @route PATCH /api/admin/ideas/:id/status
// @access Admin
export const updateIdeaStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const idea = await prisma.idea.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.status(200).json({ success: true, data: idea });
});

// @desc Get engagement metrics across all ideas
// @route GET /api/admin/metrics
// @access Admin
export const getEngagementMetrics = asyncHandler(async (req, res) => {
  const ideas = await prisma.idea.findMany({
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  const metrics = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    status: idea.status,
    priority: idea.priority,
    voteCount: idea._count.votes,
    commentCount: idea._count.comments,
    engagementScore: idea._count.votes * 2 + idea._count.comments, // weighted: votes count more
  }));

  res.status(200).json({ success: true, data: metrics });
});

// @desc Get trending/high-interest ideas (last 7 days activity)
// @route GET /api/admin/trending
// @access Admin
export const getTrendingIdeas = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const ideas = await prisma.idea.findMany({
    include: {
      votes: { where: { createdAt: { gte: sevenDaysAgo } } },
      comments: { where: { createdAt: { gte: sevenDaysAgo } } },
    },
  });

  const trending = ideas
    .map((idea) => ({
      id: idea.id,
      title: idea.title,
      recentVotes: idea.votes.length,
      recentComments: idea.comments.length,
      trendScore: idea.votes.length * 2 + idea.comments.length,
    }))
    .filter((i) => i.trendScore > 0)
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 10);

  res.status(200).json({ success: true, data: trending });
});

// @desc Get all users (admin user management)
// @route GET /api/admin/users
// @access Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, department: true, createdAt: true },
  });
  res.status(200).json({ success: true, data: users });
});