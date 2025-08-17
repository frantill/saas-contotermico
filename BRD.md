# Business Requirements Document (Live)

Status: Draft
Owner: You (Product Owner)
Facilitator: Cascade (PM Assistant)
Last updated: 2025-08-17T08:39:37+02:00

Working name: ContoTermico

Note: This live doc will be updated continuously as we complete discovery Q&A.

## 1) Product Vision (1–2 sentences)
Per installatori e rivenditori di impianti termici (pompe di calore, condizionatori, caldaie a legna, ecc.), ContoTermico semplifica e automatizza la gestione delle pratiche per gli incentivi del Conto Termico, riducendo tempi ed errori.
A differenza delle soluzioni attuali che replicano processi burocratici macchinosi, offre un’esperienza ottimizzata sfruttando automazione, intelligenza artificiale e un design centrato sull’utente.

## 2) Target Users / Personas
- Installatori e rivenditori di impianti termici (pompe di calore, condizionatori, caldaie a legna, ecc.)
- PMI di installazione che gestiscono pratiche Conto Termico
- Amministrativi/tecnici che curano la documentazione per i clienti
- Clienti finali come firmatari (secondario)

## 3) Problem Statement
La gestione delle pratiche per gli incentivi del Conto Termico è complessa e manuale; raccolta documenti, estrazione dati e compilazione di moduli sono onerose e soggette a errori.
Le soluzioni attuali replicano il processo burocratico senza semplificarlo.

## 4) Goals and Non-Goals
- Goals: TBD
- Non-Goals (Out of scope): TBD

## 5) Value Proposition & Differentiation
- Automazione e AI per analisi immagini e estrazione dati da foto di documenti (es. carta d’identità).
- Precompilazione automatica dei moduli da far firmare a cliente o installatore.
- Esperienza utente e design ottimizzati, non mera copia del processo burocratico.

## 6) Key Use Cases / User Stories
- As a [persona], I want [capability] so that [outcome]. (TBD)

## 7) User Flows (high level)
- Flow 1: TBD

## 8) Features & Requirements
- Must-haves (MVP):
  - OCR da foto documenti (es. carta d’identità) con autocompilazione campi.
    - Documenti supportati: CIE e CI cartacea, fronte/retro. Formati: JPG/PNG, PDF singola pagina. Max 10MB per file.
    - Campi minimi estratti: Nome, Cognome, Data di nascita, Comune di nascita, Numero documento, Data rilascio, Scadenza, Indirizzo di residenza, Comune, CAP.
    - Accuratezza: ≥95% sui campi minimi; confidenza <0.90 richiede conferma manuale.
    - Tempo elaborazione: p50 ≤5s/pagina, p95 ≤10s/pagina.
    - UX correzioni: campi editabili con propagazione ai moduli precompilati.
    - Errori: immagini non leggibili o documenti non supportati → messaggio chiaro e retry.
    - Privacy/GDPR: cifratura in transito/a riposo; cancellazione immagini entro 30 giorni (configurabile).
    - Audit: log caricamento/correzioni con timestamp e utente.
  - Generazione e precompilazione automatica moduli Conto Termico (PDF).
    - Moduli supportati v1: Modello delega.
    - Sorgenti dati: OCR documenti + anagrafiche utente/cliente + dati impianto inseriti a form. Fallback manuale sempre possibile.
    - Copertura campi: ≥90% campi totali autopopolati; 100% campi obbligatori valorizzati o evidenziati come mancanti.
    - Validazioni: obbligatorietà, formati (date, CAP, numeri), coerenza cross-field (es. data rilascio < scadenza, codice fiscale lunghezza valida).
    - Anteprima ed editing: nessuna anteprima PDF; editing dei dati nella form online.
    - Tempo generazione: p50 ≤3s/modulo, p95 ≤7s/modulo.
    - Output: PDF compilato.
    - Nomenclatura file: CT-{Nome-CognomeCliente}-{idPratica}-{tipoModulo}-{YYYYMMDD}.pdf.
    - Tracciabilità: versione template e mapping salvate; audit di chi genera/esporta.
    - Error handling: se manca un dato obbligatorio o mapping, blocco con messaggio e link al campo sorgente.
    - Localizzazione: ITA v1.
    - Sicurezza: cifratura in transito/a riposo; retention documenti configurabile.
  - Tracciamento pratica e stato avanzamento.
    - Status v1: Bozza → Raccolta dati → In revisione → Pronto per firma → Firmato → Inviato GSE.
    - Transizioni: cambio stato consentito solo se i campi obbligatori della fase corrente sono completi; ogni transizione è loggata con utente, timestamp e note.
    - Checklist per fase: elenco attività per fase con completamento (%) e bloccanti evidenziati.
    - Timeline eventi: cronologia (creazione, upload docs, correzioni OCR, generazione PDF, firma, invio).
    - Assegnazione: 1 “owner” pratica (installatore) + 1 "editor" dati (cliente) + “watchers” opzionali; cambio owner tracciato.
    - Ricerca/filtri: per ID pratica, cliente (nome/CF), stato, periodo; ordinamento per creazione/ultimo aggiornamento.
    - Performance: p50 lista pratiche ≤1.5s, p95 ≤3s; dettaglio pratica p50 ≤1s.
    - Notifiche v1: badge nel listato per cambi stato.
    - Permessi: Installatore/Staff con pieno accesso; link con possibilità di editing dei dati raccolti per Cliente alla propria pratica.
    - Error handling: se passaggio di stato bloccato, messaggio con link ai campi/documenti mancanti.
- Should-haves: TBD
- Nice-to-haves: TBD

## 9) Non-Functional Requirements
- Performance: TBD
- Security/Compliance: TBD
- Reliability: TBD
- Scalability: TBD
- Accessibility: TBD
- Internationalization/Localization: TBD

## 10) Integrations & Data
- External services/APIs: TBD
- Data model (entities & relationships): TBD
- Data privacy & retention: TBD

## 11) AI Usage (if applicable)
- Model/Service: OCR e Document AI per analisi immagini ed estrazione dati strutturati da foto di documenti (es. carta d’identità). Fornitore TBD.
- Prompts/Guardrails: Precompilazione con convalide su campi obbligatori, controlli di coerenza e revisione prima dell’invio.
- Human-in-the-loop: Revisione e approvazione umana dell’estrazione/compilazione prima della firma e dell’invio.

## 12) Analytics & Success Metrics
- North Star Metric: TBD
- KPIs: TBD
- Instrumentation plan: TBD

## 13) Release Plan
- v0 (Prototype): TBD
- v1 (MVP): TBD
- Future: TBD

## 14) Risks, Assumptions, Constraints
- Risks: TBD
- Assumptions: TBD
- Constraints: TBD

## 15) Open Questions
- Q1: Confermare criteri di accettazione per tracciamento pratica. (Pending)

## 16) Decisions Log
- 2025-08-16: Visione definita; nome di lavoro impostato a ContoTermico.
- 2025-08-16: MVP must-haves definiti: OCR documenti con autocompilazione; generazione/precompilazione moduli PDF; tracciamento pratica e stato avanzamento.
- 2025-08-16: Criteri di accettazione OCR definiti.
- 2025-08-17: Criteri di accettazione precompilazione PDF definiti (Modello delega).
- TBD

---

## Lovable.dev Prompt (working draft)
TBD

## Appendix
- Glossary: TBD

