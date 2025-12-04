import fs from 'fs';
import path from 'path';
import { config } from './config.js';

// pomaže osigurati da direktoriji postoje, kreira ih ako ne postoje
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// osiguraj da direktoriji postoje
ensureDir(config.outputDir);
ensureDir(config.logDir);

// vraća putanju do datoteke za pohranu podataka za dan iz timestampa
export function getDataFilePath(timestamp = new Date()) {
  const datePart = timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
  const ext = config.outputFormat === 'csv' ? 'csv' : 'jsonl';
  return path.join(config.outputDir, `${datePart}.${ext}`);
}

// dodaje zapis u datoteku podataka
export function appendRecord(record) {
  const filePath = getDataFilePath(new Date(record.timestamp));
  // formatiraj zapis ovisno o formatu
  const line = config.outputFormat === 'csv' ? toCsvLine(record) : JSON.stringify(record);
  // dodaj liniju u datoteku
  fs.appendFileSync(filePath, line + '\n', 'utf8');
}

// formatira zapis kao CSV liniju
function toCsvLine(record) {
  // vrlo jednostavan CSV: timestamp,symbol,price
  const { timestamp, symbol, price } = record;
  return `"${timestamp}","${symbol}",${price}`;
}

// zapisuje poruku u log datoteku
export function logMessage(message) {
  const logFile = path.join(config.logDir, 'app.log');
  const line = `[${new Date().toISOString()}] ${message}`;
  fs.appendFileSync(logFile, line + '\n', 'utf8');
}
