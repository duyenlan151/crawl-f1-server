import express from 'express';
import { getMetadataAndRaceData } from '../controllers/f1Controller';

const router = express.Router();

router.get('/', (_, res) => {
  console.log('Route / hit');
  res.json({ message: 'Home page' });
});

router.get('/crawl', (_, res) => {
  console.log('Route /crawl hit');
  res.json({ message: 'Crawl initiated via WebSocket' });
});

router.get('/metadata', getMetadataAndRaceData);

export default router;
