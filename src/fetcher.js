import fetch from 'node-fetch';
import { config } from './config.js';
import { appendRecord, logMessage } from './storage.js';

// obavlja jedan dohvat podataka s API-ja i sprema ga
export async function fetchOnce(symbol = 'bitcoin', currency = 'eur') {
  const startedAt = new Date();
  try {
    // konstruiraj dinamički API URL sa simbolom i valutom
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=${currency}`;
    
    // postavi timeout za fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const json = await resp.json();
    const record = mapResponse(json, startedAt, symbol, currency);
    validateRecord(record);
    appendRecord(record);
    logMessage(`OK ${record.symbol} ${record.currency} ${record.price}`);
  } catch (err) {
    logMessage(`ERROR fetchOnce: ${err.message}`);
  }
}

// mapira odgovor API-ja u standardni zapis
function mapResponse(json, timestamp, symbol = 'bitcoin', currency = 'eur') {
  // CoinGecko oblik:
  // { "bitcoin": { "eur": 79233 } }
  const price = json?.[symbol]?.[currency.toLowerCase()];
  const symbolUpper = symbol.slice(0, 3).toUpperCase(); // bitcoin -> BTC
  return {
    timestamp: timestamp.toISOString(),
    source: 'coingecko',
    symbol: symbolUpper,
    currency: currency.toUpperCase(),
    price: price
  };
}


// validira strukturu zapisa
function validateRecord(record) {
  if (!record.timestamp || typeof record.price !== 'number') {
    throw new Error('Invalid record structure');
  }
}
