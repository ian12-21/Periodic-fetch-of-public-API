import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  apiUrl: process.env.API_URL,
  intervalMinutes: Number(process.env.FETCH_INTERVAL_MINUTES || 5),
  outputDir: path.resolve(__dirname, '..', process.env.OUTPUT_DIR || 'data'),
  outputFormat: (process.env.OUTPUT_FORMAT || 'json').toLowerCase(),
  logDir: path.resolve(__dirname, '..', process.env.LOG_DIR || 'logs')
};
