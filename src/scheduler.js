import { config } from './config.js';
import { fetchOnce } from './fetcher.js';
import { logMessage } from './storage.js';

async function start() {
  logMessage(`Scheduler starting: interval=${config.intervalMinutes}min url=${config.apiUrl}`);

  // odmah jedan dohvat
  await fetchOnce();

  const intervalMs = config.intervalMinutes * 60 * 1000;
  setInterval(fetchOnce, intervalMs);
}

start();
