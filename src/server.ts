import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './api/routes/apiRoutes';
import './websocket/server';
import { logger } from './utils/logger';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, this is the home route!');
// });

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   logger.error(`Unhandled error: ${err.message}`);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// if (env.NODE_ENV === 'development') {
//   app.listen(env.PORT, () => {
//     logger.info(`Express server running on port ${env.PORT}`);
//     console.log(`Express server running on port ${env.PORT}`);
//   });
// }

// logger.info(`WebSocket server running on ws://localhost:${env.WS_PORT}/crawl`);
// console.log(`WebSocket server running on ws://localhost:${env.WS_PORT}/crawl`);
