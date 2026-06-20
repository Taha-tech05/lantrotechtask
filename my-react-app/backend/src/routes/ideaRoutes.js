import express from 'express';
import {
  createIdea, getIdeas, getIdeaById, updateIdea, deleteIdea, toggleVote, addComment,
} from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all idea routes require authentication

router.route('/')
  .post(createIdea)
  .get(getIdeas);

router.route('/:id')
  .get(getIdeaById)
  .put(updateIdea)
  .delete(deleteIdea);

router.post('/:id/vote', toggleVote);
router.post('/:id/comments', addComment);

export default router;