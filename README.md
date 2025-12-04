Pokretanje dohvaćanja i CLI‑ja
Pokreni periodički dohvat:
npm start
– stvorit će se data i logs, a u logu ćeš vidjeti zapise o dohvatima.​

Nakon što se skupi par snimaka, pokreni CLI filtriranje, npr.:
npm run cli -- --from 2025-12-01 --to 2025-12-04 --symbol BTC

Ako dodaš opciju --out report.csv, dobit ćeš i izdvojenu CSV datoteku.