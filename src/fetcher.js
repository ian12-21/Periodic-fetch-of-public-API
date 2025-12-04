import fetch from 'node-fetch';
import { config } from './config.js';
import { appendRecord, logMessage } from './storage.js';

// obavlja jedan dohvat podataka s API-ja i sprema ga
export async function fetchOnce() {
  const startedAt = new Date();
  try {
    // postavi timeout za fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(config.apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();
    const record = mapCoindeskResponse(json, startedAt);
    validateRecord(record);
    appendRecord(record);
    logMessage(`OK ${record.symbol} ${record.price}`);
  } catch (err) {
    logMessage(`ERROR fetchOnce: ${err.message}`);
  }
}

// mapira odgovor API-ja u standardni zapis
function mapCoindeskResponse(json, timestamp) {
  // primjer za Coindesk; ako mijenjaš API, prilagodi ovo
  const price = json?.bpi?.EUR?.rate_float;
  return {
    timestamp: timestamp.toISOString(),
    symbol: 'BTC',
    price
  };
}

// validira strukturu zapisa
function validateRecord(record) {
  if (!record.timestamp || typeof record.price !== 'number') {
    throw new Error('Invalid record structure');
  }
}
