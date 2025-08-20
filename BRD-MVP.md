# BRD-MVP (POC) – ContoTermico

Status: Draft
Owner: You (Product Owner)
Facilitator: Cascade (PM Assistant)
Last updated: 2025-08-20T22:48:18+02:00

Working name: ContoTermico – POC Generatore Delega (Privato, micro-OCR CIE/CI)

## 1) MVP Goal (1–2 frasi)
Dimostrare che un installatore può generare automaticamente il Modello di Delega per cliente Privato in <2 minuti, grazie al micro-OCR sulla carta d’identità (CIE/CI) in formato tessera, con conferma manuale dei campi. Nessuna gestione pratica o raccolta evidenze nel POC.

## 2) Scope (POC “in pochi giorni”)
- Form unico – Generatore Delega (Privato):
  - Campi minimi anagrafici Privato:
    - Nome, Cognome, Codice Fiscale, Data di nascita.
    - Luogo di nascita: Via, Civico, CAP, Comune, Provincia, Regione (campo strutturato).
    - Residenza: Via, Civico, CAP, Comune, Provincia, Regione (nuovo campo).
    - Email obbligatoria.
    - IBAN/Mandato all’incasso: fuori scope POC (documento separato dal Modello di Delega).
  - Upload Documento di identità (CIE/CI) fronte/retro per attivare micro-OCR; proposta campi con conferma manuale.
  - Output: generazione PDF del Modello di Delega; download immediato. Nessun upload richiesto nel POC.
  - Luogo firma: default = Comune di residenza (editabile dall’utente).
- Nessuno Step 2/3/4: ubicazione, intervento, evidenze e altri documenti sono fuori scope POC.
- Stato/Lista: nessun workflow di stato e nessuna lista pratiche nel POC.
- Auth: accesso beta semplice (utente invitato); ambiente chiuso.

## 3) Micro-OCR CIE/CI (POC)
- Obiettivo: best-effort estrazione dati da CIE/CI formato tessera per velocizzare Step 1, sempre con conferma manuale.
- Documenti supportati: CIE e CI cartacea, fronte/retro.
  - Formati file: JPG/PNG, PDF singola pagina per lato. Max 10 MB per file.
- Campi target (best-effort): Nome, Cognome, Data nascita, Luogo di nascita (via/civico, CAP, Comune, Provincia, Regione – spesso da inserire manualmente), Numero documento, Data rilascio, Scadenza, Indirizzo di residenza (via/civico), Comune, CAP.
- Comportamento:
  - L’utente carica fronte/retro; il sistema propone i campi estratti con highlight; tutti i campi sono sempre editabili.
  - Accuracy non garantita; se confidenza per un campo <0.90, evidenziare “Da confermare” (ma non blocca il salvataggio).
  - Tempo: obiettivo p95 ≤10s per documento; nessuna SLA formale nel POC.
- Error handling:
  - Documento non leggibile/non supportato → messaggio chiaro + possibilità di procedere manualmente senza OCR.
- Privacy/GDPR (POC):
  - Cifratura in transito e a riposo. Retention max 30 giorni (ambiente beta chiuso). Audit base di upload/correzioni.
- Provider: OpenRouter (vision-capable LLMs, es. gpt-4o/mini, claude-3.5-sonnet vision, llama-3.2-vision). Prompting per estrazione campi strutturati; sempre review manuale. Se indisponibile, fallback manuale.

## 4) Criteri di accettazione (POC)
- Completamento form + review OCR in ≤2 minuti.
- Generazione Modello Delega in ≤3s p50 (≤7s p95); mappatura corretta dei campi obbligatori del Privato, incluse Regione e luogo di nascita strutturato.
- Download del PDF immediato; nessun upload richiesto nel POC.
- Se OCR fallisce, compilazione manuale completa possibile senza blocchi.

## 5) Non-Funzionali (minimi POC)
- Performance: tempi come sopra, best-effort.
- Affidabilità: se OCR fallisce, sempre possibile compilazione manuale.
- Sicurezza: HTTPS obbligatorio; storage cifrato; accesso limitato ai tester.
- Accessibilità: form con validazioni chiare; messaggi di errore “parlanti”.

## 6) Out of Scope (POC)
- OCR avanzato/documenti diversi dalla CIE/CI; OCR Visura catastale.
- Dati catastali Step 2 e relative validazioni strutturate.
- Timeline eventi, checklist, watchers, permessi granulari.
- Ricerca/filtri avanzati, notifiche, analytics.
- Integrazioni esterne (firma elettronica, invio GSE, ecc.).
 - Stato pratica, lista pratiche, upload delega firmata, foto/evidenze.

## 7) Data Model (estratto per POC)
- Nessuna entità "Pratica" nel POC.
- SoggettoPrivato: nome, cognome, cf16, data_nascita, nascita_{via,civico,cap,comune,provincia,regione}, residenza_{via,civico,cap,comune,provincia,regione}, email.
- DocumentoIdentita: fronte/retro + metadati (tipo, numero, rilascio, scadenza) per micro-OCR.
- Delega (artefatto PDF) con metadati: template_version, generated_at, checksum/hash.

## 8) Beta Test Plan
- Campione: 3–5 installatori (1–2 pratiche reali ciascuno).
- Metriche:
  - Tempo “apertura form → delega generata e scaricata”.
  - % sessioni che completano la generazione senza assistenza.
  - Accuratezza percepita dell’OCR (rating 1–5) e n° correzioni manuali per campo.
  - Valutazione utilità (1–5) dopo 1 settimana.

## 9) Rischi e Mitigazioni (POC)
- OCR instabile su foto scadenti → fallback manuale; guidance su come fotografare.
- Dati sensibili → ambiente chiuso, retention 30 giorni, audit base.
- Cambi normativi → per POC focus su delega e evidenze generiche.

## 10) Open Questions
1) Quali campi legali minimi devono comparire nel Modello di Delega per cliente Privato? (es. dati installatore, P.IVA, luogo/data, firma)
2) Confermi che IBAN/Mandato all’incasso NON è parte del Modello di Delega e resta fuori POC?
3) Modello di default via OpenRouter per il micro-OCR? (es. gpt-4o-mini vs claude-3.5-sonnet vs llama-3.2-vision)
4) Branding e testo del template: abbiamo già un fac-simile “ufficiale” o lo redigiamo in base alle procedure?
5) Regione: vuoi un elenco enum fisso (Regioni italiane ISTAT) o campo libero con suggerimenti?
