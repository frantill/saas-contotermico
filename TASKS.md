# POC Document Generator – Task Log

Stato branch: feat/delega-app-scaffolding
Ultimo aggiornamento: 2025-08-23T19:51:01+02:00

## Decisions
- Architettura multi-documento Next.js (App Router) in `docgenapp/`.
- URL base: `/documenti/[doc]`; primo documento: `delega-privato`.
- PDF v0: HTML → PDF (Puppeteer) secondo `BRD-MVP.md §7d`.
- Delegato (Delega): usare sempre CF e non P.IVA nel template.

## Backlog / In Progress / Done

- [x] Scaffold app Next.js in `docgenapp/` (TS, Tailwind, App Router)
- [x] Aggiungere `config/delegato.json` con i dati forniti
- [x] Endpoint OCR: `POST /api/ocr/identity` (OpenRouter gpt-4o-mini vision) – schema output `BRD-MVP.md §3a`
- [ ] UI documento `delega-privato`: upload fronte/retro, anteprima, campi editabili con badge confidenza e validazioni §7b (in corso)
- [x] Template HTML + mapping `§7a` per `delega-privato`
- [x] Endpoint PDF: `POST /api/documenti/delega-privato/generate` (HTML→PDF)
- [ ] Wiring, error handling e fallback manuale (bypass OCR) (in corso)
- [ ] Inserire `OPENROUTER_API_KEY` in `docgenapp/.env.local`
- [ ] Smoke test con 3–5 carte; misurare p95 OCR e PDF
- [ ] README usage (come lanciare, come generare PDF)

## Notes
- Provider OCR: OpenRouter (gpt-4o-mini vision; fallback: claude-3.5 sonnet vision, llama-3.2 vision) – vedi `BRD-MVP.md §3`.
- Privacy: nessuna persistenza server dei dati PII oltre la richiesta; log redatti.
