# Architettura multi‑documento (POC)

Questo documento descrive l'architettura scalabile multi‑documento dell'app Next.js contenuta in `docgenapp/`. È pensata per aggiungere nuovi documenti con il minimo sforzo, mantenendo separati routing, template, OCR e configurazioni.

## Obiettivi

- Aggiungere facilmente nuovi documenti (es. `delega-privato`, `mandato-pagamento`, …).
- Separare responsabilità: routing, UI, OCR, template/renderer, config.
- Riutilizzare servizi (OCR, PDF) e pattern di mapping.

## Panoramica

- __App Next.js (App Router)__ in `docgenapp/`.
- __Routing dinamico__ per i documenti: `app/documenti/[doc]/page.tsx`.
- __Servizi condivisi__:
  - OCR: `lib/ocr/openrouter.ts` (OpenRouter gpt‑4o‑mini vision).
  - PDF: `lib/pdf/htmlToPdf.ts` (Puppeteer).
- __Template per documento__: `lib/templates/<doc>/` (renderer HTML e mapping).
- __Config delegato statico (POC)__: `config/delegato.json`.

## Routing

- Route dinamica: `docgenapp/app/documenti/[doc]/page.tsx`.
  - Esempio: chiave documento `delega-privato` → URL `/documenti/delega-privato`.
  - La pagina carica la UI specifica del documento (es. `DelegaPrivatoForm`).

## Registry documenti (da introdurre)

File proposto: `docgenapp/lib/documents/registry.ts`

Responsabilità:
- Definire per ogni `doc`:
  - schema dei campi del form (zod o simile)
  - pipeline OCR e mapping `OCRResult → Form`
  - template mapping e renderer PDF
- Consentire lookup centralizzato: dato `doc`, ottenere handler e metadati.

Esempio interfaccia (indicativa):
```ts
export type DocumentKey = "delega-privato" | string;

export interface DocumentDefinition {
  key: DocumentKey;
  title: string;
  formSchema: any; // zod schema
  ocr: {
    run: (input: { frontBase64?: string; backBase64?: string }) => Promise<OCRResult>;
    mapToForm: (ocr: OCRResult) => any; // valori default form
  };
  template: {
    renderHtml: (payload: any, delegato: DelegatoConfig, meta: TemplateMeta) => string;
  };
}

export const registry: Record<DocumentKey, DocumentDefinition> = {
  // "delega-privato": { ... }
};
```

## Layer servizi

- `docgenapp/lib/ocr/openrouter.ts`
  - Chiamata a OpenRouter (modello vision), schema multimodale compatibile OpenAI (`type: "text"` + `type: "image_url"`).
  - Output normalizzato in `OCRResult` con `{ value, confidence }` per campo.
- `docgenapp/lib/pdf/htmlToPdf.ts`
  - Converte HTML → PDF usando Puppeteer (A4, margini, background abilitato).

## Template e mapping

Documento: `delega-privato`
- Template renderer: `docgenapp/lib/templates/delega-privato/template.ts`
  - Input: `DelegaPayload` + `DelegatoConfig` + `TemplateMeta` → HTML.
  - Regola POC: __usare sempre il Codice Fiscale (CF) del delegato, non la P.IVA__.
- Endpoint PDF: `docgenapp/app/api/documenti/delega-privato/generate/route.ts`
  - `POST` con `DelegaPayload`, genera e ritorna PDF (`Content-Disposition: attachment`).

## Pipeline OCR e mapping

- Endpoint OCR: `docgenapp/app/api/ocr/identity/route.ts` (POST)
  - Input: `{ frontBase64?, backBase64? }`
  - Output: `OCRResult` con confidenza campo.
- UI mapping: `docgenapp/components/DelegaPrivatoForm.tsx`
  - Esegue OCR → popola form; evidenzia campi con bassa confidenza; valida CF, CAP, email.
  - Prepara `DelegaPayload` per la generazione PDF.

## Config delegato (POC)

- File: `docgenapp/config/delegato.json`
- Contiene dati statici dell'installatore/delegato per mapping template.
- Nota Delega: __visualizzare/usare sempre CF__, non P.IVA (altri documenti potranno differire).

## Struttura directory di riferimento

```
docgenapp/
  app/
    api/
      ocr/identity/route.ts
      documenti/delega-privato/generate/route.ts
    documenti/[doc]/page.tsx
    layout.tsx
    page.tsx
    globals.css
  components/
    DelegaPrivatoForm.tsx
  config/
    delegato.json
  lib/
    documents/registry.ts            # (da introdurre)
    ocr/openrouter.ts
    pdf/htmlToPdf.ts
    templates/
      delega-privato/template.ts
  public/
    branding/logo.png                # (opzionale)
```

## Convenzioni

- __Key documento__: kebab‑case (es. `delega-privato`).
- __Endpoint PDF__: `/api/documenti/[doc]/generate`.
- __OCR identità__: `/api/ocr/identity` (CIE/CI fronte+retro).

## Ambiente e segreti

- `docgenapp/.env.local` (non committare):
```
OPENROUTER_API_KEY=...        # richiesto per OCR
# OPENROUTER_API_BASE=...
# OPENROUTER_MODEL=gpt-4o-mini
```

## Evoluzione

- Introdurre `registry.ts` per centralizzare definizioni dei documenti.
- Aggiungere altri documenti mantenendo lo stesso pattern (UI, OCR mapping, template, endpoint PDF).
- Gestione multi‑installatore: spostare `delegato.json` in archivio/lookup e selettore UI.
