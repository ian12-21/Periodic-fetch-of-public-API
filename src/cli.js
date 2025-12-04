import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config } from './config.js';

// parsiraj argumente naredbenog retka
const argv = yargs(hideBin(process.argv))
  .option('from', {
    type: 'string',
    describe: 'Početni datum (YYYY-MM-DD)'
  })
  .option('to', {
    type: 'string',
    describe: 'Završni datum (YYYY-MM-DD)'
  })
  .option('symbol', {
    type: 'string',
    describe: 'Simbol (npr. BTC)'
  })
  .option('out', {
    type: 'string',
    describe: 'Opcionalna izlazna CSV datoteka'
  })
  .help()
  .alias('h', 'help').argv;

// generira datume u rasponu
function* dateRange(from, to) {
  const cur = new Date(from);
  const end = new Date(to);
  while (cur <= end) {
    yield cur.toISOString().slice(0, 10);
    cur.setDate(cur.getDate() + 1);
  }
}

// čita zapise iz datoteke za određeni datum
function readRecordsForDate(dateStr) {
  const ext = config.outputFormat === 'csv' ? 'csv' : 'jsonl';
  const filePath = path.join(config.outputDir, `${dateStr}.${ext}`);
  if (!fs.existsSync(filePath)) return [];

  const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  if (config.outputFormat === 'csv') {
    // preskoči header ako ga kasnije dodaš; ovdje je bez headera
    return lines.map(parseCsvLine);
  }
  return lines.map((l) => JSON.parse(l));
}

// parsira CSV liniju u zapis
function parseCsvLine(line) {
  const parts = line.split(',');
  return {
    timestamp: parts[0].replace(/"/g, ''),
    source: parts[1].replace(/"/g, ''),
    symbol: parts[2].replace(/"/g, ''),
    currency: parts[3].replace(/"/g, ''),
    price: Number(parts[4])
  };
}

function main() {
  const from = argv.from || new Date().toISOString().slice(0, 10);
  const to = argv.to || from;

  let all = [];
  for (const d of dateRange(from, to)) {
    all = all.concat(readRecordsForDate(d));
  }

  if (argv.symbol) {
    all = all.filter((r) => r.symbol === argv.symbol);
  }

  if (all.length === 0) {
    console.log('Nema podataka za zadani raspon.');
    return;
  }

  // ispis u konzolu
  console.table(
    all.map((r) => ({
      timestamp: r.timestamp,
      source: r.source,
      symbol: r.symbol,
      currency: r.currency,
      price: r.price
    }))
  );
  // opcional
}

main();
