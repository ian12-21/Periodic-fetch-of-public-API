# Periodički Dohvat Podataka s Javnog API-ja

## Opis Projekta

Ovaj projekt omogućava periodički dohvat cijena kriptovaluta s CoinGecko API-ja i spremanje podataka u CSV format. Projekt se sastoji od dva glavna dijela:

1. **Scheduler** (`scheduler.js`) - Dohvaća podatke s API-ja u zadanom intervalu i sprema ih u datoteke
2. **CLI** (`cli.js`) - Omogućava filtriranje i pregled pohranjenih podataka te dohvat novih podataka na zahtjev

## Instalacija

```bash
npm install
```

## Pokretanje Projekta

### 1. Periodički Dohvat Podataka

Pokreni scheduler koji će automatski dohvaćati podatke s API-ja:

```bash
npm start
```

- Stvorit će se direktoriji `data/` i `logs/`
- Podatke će dohvaćati u intervalu definiranom u `.env` datoteci (`FETCH_INTERVAL_MINUTES`)
- Sve dohvate i greške će biti zabilježeni u `logs/app.log`
- Podaci se sprema u `data/YYYY-MM-DD.csv` datoteke

## Kako promijeniti par za dohvat (fetchOnce)

Ako želiš dohvaćati **drugi par** (drugu kriptovalutu ili drugu valutu), potrebno je promijeniti vrijednosti `symbol` i `currency` koje se prosljeđuju funkciji `fetchOnce` u `fetcher.js` (jer se API URL gradi iz ta dva parametra). [file:36]

- `symbol` = CoinGecko id kriptovalute (npr. `bitcoin`, `ethereum`, `solana`) [file:36]
- `currency` = valuta u kojoj želiš cijenu (npr. `eur`, `usd`, `gbp`) [file:36]

Primjer: umjesto default para BTC/EUR, postavi ETH/USD promjenom default vrijednosti:

```js
export async function fetchOnce(symbol = 'ethereum', currency = 'usd') {
```

### 2. CLI Filtriranje i Dohvat

Nakon što se skupi par snimaka, pokreni CLI za pregled podataka:

#### Osnovne Opcije

```bash
# Prikazi sve podatke za dan
npm run cli -- --from 2025-12-06 --to 2025-12-06

# Filtriraj po kriptovaluti
npm run cli -- --from 2025-12-06 --to 2025-12-06 --symbol BTC

# Filtriraj po valuti
npm run cli -- --from 2025-12-06 --to 2025-12-06 --currency EUR

# Kombiniraj filtere
npm run cli -- --from 2025-12-06 --to 2025-12-06 --symbol ETH --currency USD

# Dohvati podatke s API-ja umjesto čitanja iz datoteka
npm run cli -- --fetch --symbol bitcoin --currency eur

# Dohvati različite kriptovalute
npm run cli -- --fetch --symbol ethereum --currency usd
npm run cli -- --fetch --symbol cardano --currency gbp
```

#### Dostupne Opcije

```
  --from           Početni datum (YYYY-MM-DD)
  --to             Završni datum (YYYY-MM-DD)
  --symbol         Simbol kriptovalute (npr. bitcoin, ethereum, cardano, solana)
                   Kod --fetch koristi puni naziv (bitcoin, ethereum)
                   Kod filtriranja pohranjenih podataka koristi skraćenicu (BTC, ETH)
  --currency       Valuta (npr. eur, usd, gbp)
  --fetch          Dohvati podatke s API-ja umjesto čitanja iz datoteke [boolean]
  --out            Opcionalna izlazna CSV datoteka
  -h, --help       Prikaži pomoć
```

**Napomena o simbolima:**
- Kod dohvata (`--fetch`) koristi **puni naziv** kriptovalute: `bitcoin`, `ethereum`, `cardano`, `solana`
- Kod filtriranja pohranjenih podataka koristi **3-slovnu skraćenicu**: `BTC`, `ETH`, `CAR`, `SOL`

## Primjeri Korištenja

### Primjer 1: Periodički Dohvat Bitcoin Cijena

```bash
# Pokreni scheduler (dohvaća Bitcoin cijena u EUR svakih 12 sekundi po zadanoj konfiguraciji)
npm start
```

### Primjer 2: Dohvat Ethereum Cijena u USD-u

```bash
npm run cli -- --fetch --symbol ethereum --currency usd
```

### Primjer 3: Pregled Svih Bitcoin Podataka za Dan

```bash
npm run cli -- --from 2025-12-06 --to 2025-12-06 --symbol BTC
```

### Primjer 4: Dohvat Solana Cijena u EUR-u

```bash
npm run cli -- --fetch --symbol solana --currency eur
```

### Primjer 5: Pregled Samo ETH Podataka

```bash
npm run cli -- --symbol ETH
```

### Primjer 6: Pregled Samo GBP Transakcija

```bash
npm run cli -- --currency GBP
```

## Konfiguracija (.env)

```env
FETCH_INTERVAL_MINUTES=0.2
OUTPUT_DIR=./data
OUTPUT_FORMAT=csv
LOG_DIR=./logs
```

**Parametri:**
- `FETCH_INTERVAL_MINUTES` - Interval dohvata u minutama (0.2 = 12 sekundi)
- `OUTPUT_DIR` - Direktorij gdje se spremaju podatke
- `OUTPUT_FORMAT` - Format podataka (csv ili json)
- `LOG_DIR` - Direktorij gdje se spremaju logovi

**Napomena:** API URL se dinamički generira ovisno o kriptovaluti i valuti koje se dohvaćaju.

## Struktura Podataka

Svaki redak u CSV datoteci sadrži:

```csv
"timestamp","source","symbol","currency","price"
"2025-12-06T11:21:24.481Z","coingecko","ETH","USD",3035.38
"2025-12-06T11:50:12.346Z","coingecko","SOL","EUR",114.37
"2025-12-06T11:21:37.464Z","coingecko","CAR","GBP",0.309863
```

**Polja:**
- `timestamp` - ISO 8601 format vremena dohvata
- `source` - Izvor podataka (coingecko)
- `symbol` - 3-slovna skraćenica kriptovalute (BTC, ETH, SOL, CAR)
- `currency` - 3-slovna oznaka valute (EUR, USD, GBP)
- `price` - Cijena u odabranoj valuti

## Tehnologije

- **Node.js** - JavaScript runtime
- **node-fetch** - HTTP client
- **yargs** - CLI argument parser
- **dotenv** - Environment konfiguracija
- **CoinGecko API** - Izvor podataka o kriptovalutama
