import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import {
  generateFeasibilityScore,
  generateThemeClusters,
  generateResourceSuggestions,
} from '../services/geminiService.js';

// @desc Generate feasibility/ROI score for one idea and store as Insight
// @route POST /api/admin/insights/feasibility/:id
// @access Admin
export const scoreIdeaFeasibility = asyncHandler(async (req, res) => {
  const idea = await prisma.idea.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { votes: true, comments: true } } },
  });

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const scoreData = await generateFeasibilityScore(idea);

  const insight = await prisma.insight.create({
    data: {
      content: JSON.stringify(scoreData),
      type: 'feasibility_roi_score',
      ideaId: idea.id,
    },
  });

  res.status(201).json({ success: true, data: { ...scoreData, insightId: insight.id } });
});

// @desc Generate theme clusters across all (or filtered) ideas
// @route POST /api/admin/insights/clusters
// @access Admin
export const clusterIdeaThemes = asyncHandler(async (req, res) => {
  const ideas = await prisma.idea.findMany({
    where: { status: { not: 'ARCHIVED' } },
    select: { id: true, title: true, pitch: true, category: true },
  });

  if (ideas.length === 0) {
    res.status(400);
    throw new Error('No ideas available to cluster');
  }

  const clusters = await generateThemeClusters(ideas);

  // Map ideaIds back to full idea info (title, status) so frontend can display them
  const ideaMap = new Map(ideas.map((i) => [i.id, i]));

  const enrichedClusters = clusters.map((cluster) => ({
    ...cluster,
    ideas: (cluster.ideaIds || [])
      .map((id) => ideaMap.get(id))
      .filter(Boolean) // drop any IDs the AI hallucinated that don't exist
      .map((i) => ({ id: i.id, title: i.title, category: i.category })),
  }));

  await prisma.insight.create({
    data: { content: JSON.stringify(enrichedClusters), type: 'theme_clusters' },
  });

  res.status(201).json({ success: true, data: enrichedClusters });
});


// @desc Generate resource allocation suggestions for a top-ranked idea
// @route POST /api/admin/insights/resources/:id
// @access Admin
export const suggestResources = asyncHandler(async (req, res) => {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });

  if (!idea) {
    res.status(404);
    throw new Error('Idea not found');
  }

  const suggestions = await generateResourceSuggestions(idea);

  const insight = await prisma.insight.create({
    data: {
      content: JSON.stringify(suggestions),
      type: 'resource_allocation',
      ideaId: idea.id,
    },
  });

  res.status(201).json({ success: true, data: { ...suggestions, insightId: insight.id } });
});

// @desc Get all stored insights (dashboard view)
// @route GET /api/admin/insights
// @access Admin
export const getAllInsights = asyncHandler(async (req, res) => {
  const insights = await prisma.insight.findMany({
    include: { idea: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const parsed = insights.map((i) => ({
    ...i,
    content: JSON.parse(i.content),
  }));

  res.status(200).json({ success: true, data: parsed });
});