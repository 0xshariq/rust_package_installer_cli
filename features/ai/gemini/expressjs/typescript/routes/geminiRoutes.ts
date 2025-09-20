import express from 'express';
import { generateResponse } from '../controllers/geminiController';

const router = express.Router();
router.post('/generate', generateResponse);

export default router;
