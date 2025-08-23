# BRD-MVP (POC) – ContoTermico

Status: Draft
Owner: You (Product Owner)
Facilitator: Cascade (PM Assistant)
Last updated: 2025-08-21T15:06:06+02:00

Working name: ContoTermico – POC Generatore Delega (Privato, micro-OCR CIE/CI)

## 1) MVP Goal (1–2 frasi)
Dimostrare che un installatore può generare automaticamente il Modello di Delega per cliente Privato in <2 minuti, grazie al micro-OCR sulla carta d’identità (CIE/CI) in formato tessera, con conferma manuale dei campi. Nessuna gestione pratica o raccolta evidenze nel POC.

## 2) Scope (POC “in pochi giorni”)
- Form unico – Generatore Delega (Privato):
  - Campi minimi anagrafici Privato:
    - Nome, Cognome, Codice Fiscale, Data di nascita.
    - Luogo di nascita: Comune, Provincia.
    - Residenza: Via, Civico, CAP, Comune, Provincia.
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
- Campi target (best-effort): Nome, Cognome, Data nascita, Luogo di nascita (Comune, Provincia), Numero documento, Data rilascio, Scadenza, Indirizzo di residenza (via/civico), Comune, CAP.
- Comportamento:
  - L’utente carica fronte/retro; il sistema propone i campi estratti con highlight; tutti i campi sono sempre editabili.
  - Accuracy non garantita; se confidenza per un campo <0.90, evidenziare “Da confermare” (ma non blocca il salvataggio).
  - Tempo: obiettivo p95 ≤10s per documento; nessuna SLA formale nel POC.
- Error handling:
  - Documento non leggibile/non supportato → messaggio chiaro + possibilità di procedere manualmente senza OCR.
- Privacy/GDPR (POC):
  - Cifratura in transito e a riposo. Retention max 30 giorni (ambiente beta chiuso). Audit base di upload/correzioni.
- Provider: OpenRouter – default: gpt-4o-mini (vision). Fallback: claude-3.5-sonnet vision, llama-3.2-vision. Prompting per estrazione campi strutturati; sempre review manuale. Se indisponibile, fallback manuale.

## 3a) Micro‑OCR Spec (gpt‑4o‑mini)
- Obiettivo prompt: estrarre campi strutturati da CIE/CI fronte/retro; restituire JSON con `value` e `confidence [0..1]` per ciascun campo.
- Output JSON (schema sintetico):

```json
{
  "delegante": {
    "nome": {"value": "", "confidence": 0.0},
    "cognome": {"value": "", "confidence": 0.0},
    "codice_fiscale": {"value": "", "confidence": 0.0},
    "data_nascita": {"value": "YYYY-MM-DD", "confidence": 0.0},
    "nascita": {
      "comune": {"value": "", "confidence": 0.0},
      "provincia": {"value": "", "confidence": 0.0}
    },
    "residenza": {
      "via": {"value": "", "confidence": 0.0},
      "civico": {"value": "", "confidence": 0.0},
      "cap": {"value": "", "confidence": 0.0},
      "comune": {"value": "", "confidence": 0.0},
      "provincia": {"value": "", "confidence": 0.0}
    },
    "email": {"value": "", "confidence": 0.0}
  },
  "documento_identita": {
    "tipo": {"value": "CIE|CI", "confidence": 0.0},
    "numero": {"value": "", "confidence": 0.0},
    "rilascio": {"value": "YYYY-MM-DD", "confidence": 0.0},
    "scadenza": {"value": "YYYY-MM-DD", "confidence": 0.0}
  }
}
```

- Regole confidenza UX: <0.90 → etichetta “Da confermare”; non blocca salvataggio.
- Robustezza: se testo non presente/illeggibile, restituire `value = ""` e `confidence = 0`.

## 4) Criteri di accettazione (POC)
- Completamento form + review OCR in ≤2 minuti.
- Generazione Modello Delega in ≤3s p50 (≤7s p95); mappatura corretta dei campi obbligatori del Privato, incluso luogo di nascita (Comune, Provincia).
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
- SoggettoPrivato: nome, cognome, cf16, data_nascita, nascita_{comune,provincia}, residenza_{via,civico,cap,comune,provincia}, email.
- DocumentoIdentita: fronte/retro + metadati (tipo, numero, rilascio, scadenza) per micro-OCR.
- Delega (artefatto PDF) con metadati: template_version, generated_at, checksum/hash.

## 7a) Template & Mapping (Privato)
- Delegante:
  - nome → `{{delegante.nome}}`, cognome → `{{delegante.cognome}}`, codice fiscale → `{{delegante.codice_fiscale}}`
  - data di nascita → `{{delegante.data_nascita}}`
  - luogo di nascita → `{{nascita.comune}} ({{nascita.provincia}})`
  - residenza → `{{residenza.via}} {{residenza.civico}}, {{residenza.cap}} {{residenza.comune}} ({{residenza.provincia}})`
  - email → `{{delegante.email}}`
- Documento d’identità:
  - tipo → `{{documento.tipo}}`, numero → `{{documento.numero}}`, rilascio → `{{documento.rilascio}}`, scadenza → `{{documento.scadenza}}`
- Delegato (Installatore):
  - ragione sociale/nome e cognome → `{{delegato.nome}}`
  - P.IVA/CF → `{{delegato.piva_cf}}`
  - indirizzo → `{{delegato.indirizzo}}`
  - contatti → `{{delegato.contatti}}`
- Atto e firma:
  - luogo firma → `{{firma.luogo}}` (default = `{{residenza.comune}}`), data firma → `{{firma.data}}`
  - firma beneficiario → `{{firma.beneficiario}}`

Nota: il motore di template sostituisce placeholder mancanti con stringa vuota; validazioni lato form assicurano obbligatorietà.

## 7b) Validazioni
- Codice fiscale (16 char, check-digit): messaggio “Codice fiscale non valido”.
- CAP (regex 5 cifre): “CAP non valido”.
- Email (RFC-lite): “Email non valida”.
- Comune–Provincia coerenza: warning non bloccante.
 

## 7c) Contenuto legale (bozza)
- Oggetto: il/La sottoscritto/a delega l’Installatore individuato di seguito a rappresentarlo/a ai soli fini delle attività necessarie alla predisposizione e presentazione della domanda/istanza relativa al meccanismo Conto Termico, inclusi: reperimento/integrazione di informazioni e documenti; compilazione dei moduli; trasmissione telematica; ricezione delle comunicazioni inerenti.
- Limiti: sono esclusi incasso di somme, mandati all’incasso e qualunque
  atto non strettamente necessario alla presentazione della pratica.
- Durata: valida dalla data di sottoscrizione fino al completamento della presentazione, e comunque non oltre 90 giorni salvo rinnovo.
- Revoca: il/la delegante può revocare in qualunque momento mediante comunicazione scritta all’Installatore.
- Responsabilità: il/la delegante dichiara la veridicità dei dati forniti; il delegato opera con diligenza professionale. Restano salve le responsabilità previste dalla legge.
- Trattamento dati personali: i dati sono trattati nel rispetto del Reg. (UE) 2016/679 e normativa vigente, esclusivamente per le finalità sopra indicate. Nel POC: conservazione massima 30 giorni, accesso limitato, cifratura in transito e a riposo.
- Campi obbligatori Installatore (delegato): denominazione/nome e cognome; P.IVA o CF; indirizzo sede; contatti (email/telefono).
- Campi firma: luogo (default = Comune di residenza), data (default = data generazione), firma leggibile del delegante.
- Esempio testo fac‑simile (sintetico, per template):
```text
Io sottoscritto/a {{delegante.nome}} {{delegante.cognome}} (CF {{delegante.codice_fiscale}}), nato/a a {{nascita.comune}} ({{nascita.provincia}}) il {{delegante.data_nascita}},
residente in {{residenza.via}} {{residenza.civico}}, {{residenza.cap}} {{residenza.comune}} ({{residenza.provincia}}),

DELEGO
{{delegato.nome}} (P.IVA/CF {{delegato.piva_cf}}), con sede in {{delegato.indirizzo}},
a rappresentarmi ai soli fini della predisposizione, presentazione e gestione delle comunicazioni inerenti alla domanda relativa al meccanismo Conto Termico,
compresi la compilazione dei moduli, la trasmissione telematica e la ricezione di comunicazioni. Restano esclusi incasso di somme, mandati all’incasso e qualunque
atto non strettamente necessario alla presentazione della pratica.

Dichiaro di aver preso visione dell’informativa privacy e acconsento al trattamento dei dati per le finalità sopra indicate.

Luogo _____________   Data ___/___/_____
Firma __________________________
```
## 7d) Dettagli layout PDF (POC)
- Formato: A4, orientamento verticale; margini 20 mm.
- Font: corpo testo 11 pt (sans-serif leggibile es. Noto Sans/Source Sans), titoli 14 pt grassetto; interlinea 1.15.
- Intestazione: logo aziendale (placeholder `{{branding.logo}}`) a sinistra, titolo centrato “Delega per Conto Termico (Privato)”, sottotitolo con `template_version`.
- Sezioni: blocco “Delegante”, blocco “Delegato (Installatore)”, blocco “Oggetto e Clausole”, blocco “Firma”.
- Regole impaginazione:
  - Evitare spezzature di riga su CF, CAP e numeri documento; usare spazi non separabili dove opportuno.
  - Indirizzi su una riga se <= 80 caratteri, altrimenti a capo dopo la virgola.
  - Disabilitare sillabazione automatica.
- Campi calcolati/default: `{{firma.luogo}}` default = `{{residenza.comune}}`; `{{firma.data}}` default = data generazione.
- Box firma: area 70×25 mm con linea firma e label “Firma leggibile”.
- Footer: `Generated at {{generated_at}} • Template v{{template_version}} • Checksum {{checksum}}`.

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
3) Branding e testo del template: abbiamo già un fac-simile “ufficiale” o lo redigiamo in base alle procedure?

## Appendix A — Elenco Regioni (ISTAT)
Abruzzo; Basilicata; Calabria; Campania; Emilia-Romagna; Friuli-Venezia Giulia; Lazio; Liguria; Lombardia; Marche; Molise; Piemonte; Puglia; Sardegna; Sicilia; Toscana; Trentino-Alto Adige/Südtirol; Umbria; Valle d’Aosta/Vallée d’Aoste; Veneto.
