import express from 'express';
import { getMetadataAndRaceData } from '@/api/controllers/f1Controller';

const router = express.Router();

router.get('/crawl', (_, res) => res.json({ message: 'Crawl initiated via WebSocket' }));
router.get('/metadata', getMetadataAndRaceData);

export default router;