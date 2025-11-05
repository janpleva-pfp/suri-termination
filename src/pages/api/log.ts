import { LoggingWinston } from '@google-cloud/logging-winston';
import { NextApiRequest, NextApiResponse } from 'next';
import winston from 'winston';
const loggingWinston = new LoggingWinston({});
export const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console(), loggingWinston],
});
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const route = req.headers.referer || 'unknown';
    const { logName, severity, labels, userData } = req.body;
    const logMessage = `[${labels.join(', ')}] - ${logName}`;
    logger.log(severity, logMessage, {
      labels,
      userData,
      route,
      additionalData: req.body.additionalData,
      version: process.env.npm_package_version || 'unknown',
    });
    res.status(200).json({ message: 'Data logged successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
export default handler;
