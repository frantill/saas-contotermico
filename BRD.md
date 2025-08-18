# Business Requirements Document (Live)

Status: Draft
Owner: You (Product Owner)
Facilitator: Cascade (PM Assistant)
Last updated: 2025-08-18T19:56:54+02:00

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

### Form - Step 1 (Scelta soggetto: Privato o Azienda)
 - Selezione iniziale “Tipo soggetto” — obbligatoria; radio: Privato, Azienda. Governa visibilità campi e validazioni.

#### Step 1A — Privato (Persona fisica)
 - Campi e validazioni (v1):
   1. Nome — obbligatorio; 2–50 caratteri; lettere, spazi, apostrofo, trattino.
   2. Cognome — obbligatorio; 2–50 caratteri; lettere, spazi, apostrofo, trattino.
   3. Codice Fiscale — obbligatorio; 16 alfanumerici; controllo formale CF persona fisica.
   4. Data di nascita — obbligatoria; data nel passato; formato DD/MM/YYYY.
   5. Luogo di nascita — obbligatorio; Comune italiano o “Estero”.
   6. Provincia nascita — obbligatoria se Italia; selezione da elenco province.
   7. Residenza — obbligatoria: Indirizzo, Civico, CAP (5), Comune, Provincia, Nazione=Italia.
   8. Telefono/Cellulare — opzionale; formato +39, 8–15 cifre.
   9. Email — obbligatoria; formato email valido.
   10. Codice/ID GSE-GWA — opzionale (se già registrato).
   11. IBAN e Mandato all’incasso — in Step 1 (obbligatori). Validazioni: IBAN IT (27) con controllo modulo; Mandato all’incasso Sì/No; eventuale delega incasso gestita nei documenti correlati.
   12. Consensi — obbligatori: Privacy; Delega all’installatore per presentazione pratica (abilita generazione Modello delega).
   13. Allegati (v1) — Documento d’identità fronte/retro (CIE/CI); formati JPG/PNG/PDF; max 10MB/cad; OCR applicabile (vedi §8).
 - Regole UX/Dinamiche (Privato):
   - Autocomplete Comune/CAP e coerenza CAP↔Comune.
   - OCR su documento per autocompilazione (Nome, Cognome, Data/Luogo nascita, Indirizzo); conferma manuale.
   - Errori parlanti (es. “CF non valido”).

#### Step 1B — Azienda (con P.IVA)
- Tipologie supportate (incluse in "Azienda"):
  - Ditta individuale / Libero professionista
  - SNC
  - SRL / SRLS
  - SPA
  - Cooperativa
  - Esclusi: Condomini (gestiti separatamente)
 - Campi e validazioni (v1):
   1. Tipo soggetto giuridico — obbligatorio; enum: Ditta individuale/Libero professionista, SNC, SRL/SRLS, SPA, Cooperativa; governa logiche dinamiche per CF e LR.
   2. Ragione sociale / Denominazione — obbligatorio; 2–100 caratteri; ammessi lettere, numeri, &, ., -, ’, spazio.
   3. Partita IVA — obbligatoria; 11 cifre; checksum IT; univoca nel sistema.
   4. Codice Fiscale — obbligatorio; validazione dinamica:
      - Ditta individuale/Libero professionista: CF persona fisica (16 alfanumerico, con controllo formale).
      - Altri soggetti: CF numerico 11 cifre (può coincidere con P.IVA).
  5. PEC aziendale — opzionale.
  6. Email di contatto (ordinaria) — obbligatoria; formato email valido.
  7. Codice destinatario SDI — obbligatorio se PEC assente; altrimenti opzionale; 7 caratteri (A–Z0–9).
  8. Sede legale — obbligatoria: Indirizzo, Civico, CAP (5), Comune, Provincia, Nazione=Italia.
  9. Sede operativa — opzionale; toggle “Uguale a sede legale”; se diverso, stessi campi della sede legale.
   10. Referente aziendale — obbligatorio: Nome, Cognome, Ruolo, Email; Telefono opzionale (+39, 8–15 cifre).
   11. Legale rappresentante — obbligatorio: Nome, Cognome, CF (16), Data e Luogo di nascita; Documento (tipo, numero, rilascio, scadenza) + upload fronte/retro; toggle “Coincide con referente”.
   12. IBAN e Mandato all’incasso — obbligatori. Validazioni: IBAN IT (27) con controllo modulo; Mandato all’incasso Sì/No; eventuale delega incasso gestita nei documenti correlati.
   13. Consensi — obbligatori: Privacy; Delega all’installatore per presentazione pratica (per generare Modello delega).
   14. Allegati (v1) — Documento d’identità LR fronte/retro; Visura camerale non richiesta in v1 (opzionale); Attestazione P.IVA (opz).
 - Regole UX/Dinamiche:
   - Autocomplete Comune/CAP e coerenza CAP↔Comune.
   - “Copia indirizzo da sede legale” per sede operativa.
   - OCR su documento LR con conferma manuale (si applicano criteri OCR in §8).
   - Vincolo: Email obbligatoria; PEC opzionale; per SDI: obbligatorio se manca PEC, opzionale se PEC presente (messaggio dedicato).
   - Errori parlanti (es. “P.IVA non valida”, “CF non coerente con tipo soggetto”).

### Form - Step 2 (Ubicazione/Immobile — 1 per pratica)
- Opzione: 1 indirizzo di installazione per pratica (confermato).
- Campi e validazioni (v1):
  1. Indirizzo installazione — obbligatorio: Indirizzo, Civico, CAP (5), Comune, Provincia, Nazione=Italia.
     - Autocomplete Comune↔CAP; suggerisci via/toponimo.
  2. Geolocalizzazione — opzionale: lat/lon calcolate dall’indirizzo (per mappe, sopralluogo).
  3. Destinazione d’uso immobile — obbligatoria; enum: Commerciale, Industriale, Uffici, Agricolo, Altro. (valida per Aziende e Privati)
  4. Coincidenza/Prefill indirizzo — opzioni:
     - Opzione “Coincide con residenza/sede”: se attiva, l’indirizzo è sincronizzato con Step 1 (Privato: residenza; Azienda: sede operativa). Campi read-only; pulsante “Scollega e modifica” per rendere l’indirizzo indipendente.
     - Opzione “Copia da residenza/sede”: copia one-shot dai dati di Step 1; i campi restano poi indipendenti ed editabili.
  5. Dati catastali — obbligatori in Step 2: Comune catastale, Foglio, Particella/Mappale, Subalterno, Categoria catastale; validazioni di formato base.
  6. Dettagli accesso (opzionali) — Scala/Piano/Interno, Note accesso.
  7. Allegati (v1) — Visura catastale (upload o foto); formati: JPG/PNG/PDF; max 10MB; 1 file. Futuro: OCR per estrazione automatica.
- Regole UX/Dinamiche:
  - Autocomplete CAP/Comune; calcolo automatico zona climatica dal Comune (read-only, v1 opzionale).
  - Collegamento indirizzo: se “Coincide” è attivo, campi read-only e sincronizzati con Step 1; “Scollega e modifica” rende i campi indipendenti.
  - Se si usa “Copia”, i campi restano editabili e non si aggiornano al variare di Step 1.
  - Default “Coincide”: ON per Privato; OFF per Azienda (toggle modificabile).
  - In Step 2 non si raccolgono foto; le foto vengono raccolte nei passi successivi (es. Step 3 “Dati intervento”).

### Form - Step 3 (Dati intervento — Generale)
- Campi e validazioni (v1):
  1. Dati generali (generatore da sostituire/impianto esistente):
     - Tipologia di impianto — enum proposta: autonomo, centralizzato.
     - Luogo di installazione — enum proposta: all'interno, all'esterno, in centrale termica / locale tecnico.
     - Tipologia generatore — enum proposta: stufa, caldaia, pompa di calore, camino aperto, altro.
     - Potenza termica (kW) — obbligatoria; numero > 0; decimali ammessi (es. 0,1–200).
     - Tipologia terminali — enum proposta: radiatori, a pavimento, split, fan-coil, altro.
     - Tipologia combustibile — enum proposta: gasolio, metano, gpl, biomassa, altro.
  2. Generatori aggiuntivi — opzionale; pulsante “Aggiungi generatore” (ripete i campi di cui sopra).
  3. Foto intervento — obbligatorie: 2 foto totali
     - 1 Pre-intervento (stato prima)
     - 1 Post-intervento (stato dopo)
     - Formati: JPG/PNG; max 10MB/cad; compressione lato client e barre di progresso upload.
  4. Note operative — opzionali.
- Regole UX/Dinamiche:
  - Due dropzone distinte e chiaramente etichettate: “Foto PRE” e “Foto POST”.
  - Validazione: esattamente 1 foto per ciascuna categoria; blocco avanzamento se mancanti.
  - Futuro: controllo EXIF orario/scatto e guida in caso di incongruenze.

## 9) Non-Functional Requirements
- Performance: TBD
- Security/Compliance: TBD
- Reliability: TBD
- Scalability: TBD
- Accessibility: TBD
- Internationalization/Localization: TBD

## 10) Integrations & Data
- External services/APIs: TBD
- Data model (entities & relationships):
  - Soggetto (base) — campi comuni: id, tipo (PRIVATO|AZIENDA), email, telefono, consensi (privacy/delega), created_at/by.
  - Sottotipi (TPT — Table Per Type):
    - SoggettoPrivato: soggetto_id (FK), nome, cognome, cf16, data_nascita, luogo_nascita, provincia_nascita, residenza_indirizzo (via, civico, cap, comune, provincia, nazione).
    - SoggettoAzienda: soggetto_id (FK), ragione_sociale, piva (11), cf, tipo_giuridico (enum), pec, sdi, sede_legale (via, civico, cap, comune, provincia, nazione), sede_operativa (opzionale), referente_aziendale, legale_rappresentante (nome, cognome, cf16, nascita + documento), allegati.
      - Vincoli: cf length=11 per persone giuridiche; length=16 per Ditta individuale/Libero professionista (coerente con logiche Step 1).
  - Indirizzo (riusabile) — opzionale come tabella normalizzata; tipi: RESIDENZA, SEDE_LEGALE, SEDE_OPERATIVA.
  - DocumentoIdentita — upload fronte/retro con metadati (tipo, numero, rilascio, scadenza); collegato a Soggetto o anagrafiche LR.
  - IBANPagamento — tabella separata: pratica_id (FK), soggetto_id (FK), iban, mandato_incasso (bool), delega_upload (file), validazioni; raccolto in Step 1.
  - Pratica↔Soggetto (ParteCoinvolta) — relazione con ruolo: BENEFICIARIO (sempre il Soggetto Step 1), PROPRIETARIO (se diverso, da Step 2), INSTALLATORE, ecc.
  - Lookup — Comuni/Province (per CAP/Comune coerenti); categorie catastali; enum condivisi.
- Data privacy & retention: TBD

## 11) AI Usage (if applicable)
- Model/Service: OCR e Document AI per analisi immagini ed estrazione dati strutturati da foto di documenti (es. carta d’identità). Fornitore TBD.
- Prompts/Guardrails: Precompilazione con convalide su campi obbligatori, controlli di coerenza e revisione prima dell’invio.
- Human-in-the-loop: Revisione e approvazione umana dell’estrazione/compilazione prima della firma e dell’invio.
 - Futuro: OCR/estrazione da visura catastale per precompilare i Dati catastali (Step 2).

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
  - Q6 (Step 3): Confermare enum v1 per Dati intervento (Tipologia impianto, Luogo installazione, Tipologia generatore, Tipologia terminali, Tipologia combustibile).
  - Q7 (Step 3): Supportare “generatori aggiuntivi” in v1 (gruppo ripetibile) o rimandare?
  - Q8 (Step 3): Collocazione foto pre/post va bene in Step 3 “Dati intervento” o preferisci in una sezione dedicata “Evidenze”?
   - Q9 (Step 2): Reintrodurre “Titolo di possesso/disponibilità immobile” in una fase successiva? Quali campi/dichiarazioni servono (e.g. dati proprietario, consenso)?

## 16) Decisions Log
- 2025-08-16: Visione definita; nome di lavoro impostato a ContoTermico.
- 2025-08-16: MVP must-haves definiti: OCR documenti con autocompilazione; generazione/precompilazione moduli PDF; tracciamento pratica e stato avanzamento.
- 2025-08-16: Criteri di accettazione OCR definiti.
- 2025-08-17: Criteri di accettazione precompilazione PDF definiti (Modello delega).
- 2025-08-17: “Azienda” include soggetti con P.IVA (Ditta individuale/Libero professionista, SNC, SRL/SRLS, SPA, Cooperative); Condomini esclusi (gestiti separatamente).
- 2025-08-17: Step 1 “Azienda”: [SUPERSEDED 2025-08-18] almeno uno tra PEC ed Email è obbligatorio; Visura non richiesta (v1); IBAN raccolto in step successivo.
  - 2025-08-17: Step 1 “Azienda”: SDI obbligatorio se manca PEC; Regola CF dinamico confermata.
  - 2025-08-17: Step 2 “Ubicazione/Immobile”: 1 indirizzo di installazione per pratica (opzione A confermata).
  - 2025-08-17: Step 2 “Ubicazione/Immobile”: Destinazione d’uso = enum (Commerciale, Industriale, Uffici, Agricolo, Altro), valida per Aziende e Privati.
  - 2025-08-17: Step 2 “Ubicazione/Immobile”: Dati catastali obbligatori in Step 2; abilitato upload/foto della visura catastale; OCR di estrazione automatica pianificato per una release successiva.
  - 2025-08-17: Step 3 “Dati intervento”: Foto intervento obbligatorie = 2 (1 pre + 1 post); posizionamento proposto in Step 3.
  - 2025-08-17: Step 2 “Ubicazione/Immobile”: "Referente in loco" non previsto in v1.
  - 2025-08-17: Step 1: introdotta scelta “Privato” vs “Azienda”; definiti campi/validazioni per Privato; adeguata UX e OCR.
  - 2025-08-17: Step 2: Prefill indirizzo aggiornato per gestire Privato (Residenza) e Azienda (Sede operativa).
  - 2025-08-18: Modello dati confermato — Soggetto base con sottotipi TPT (Privato/Azienda).
  - 2025-08-18: Step 1: IBAN e Mandato all’incasso raccolti in Step 1 per Privato e Azienda.
  - 2025-08-18: Step 1: Email obbligatoria per Privato e Azienda; per Azienda: SDI obbligatorio se manca PEC.
  - 2025-08-18: Step 2: Aggiunta opzione “Coincide con residenza/sede” con sincronizzazione e possibilità di scollegare; rimosso temporaneamente “Titolo di possesso/disponibilità” e dati proprietario.
  - 2025-08-18: Step 2: Default “Coincide con residenza/sede”: ON per Privato; OFF per Azienda.
  - 2025-08-18: Step 2: Nessuna foto raccolta in Step 2; le foto saranno raccolte nei passi successivi (es. Step 3).
  - TBD

---

## Lovable.dev Prompt (working draft)
TBD

## Appendix
- Glossary: TBD

