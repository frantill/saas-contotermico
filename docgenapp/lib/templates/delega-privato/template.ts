import { DelegaPayload, DelegatoConfig } from "@/lib/types";

function formatAddress(i: DelegatoConfig["indirizzo"]): string {
  const parts = [
    [i.via, i.civico].filter(Boolean).join(" "),
    [i.cap, i.comune].filter(Boolean).join(" "),
    i.provincia ? `(${i.provincia})` : "",
  ].filter(Boolean);
  return `${parts[0]}, ${parts[1]} ${parts[2]}`.trim();
}

function formatContatti(c?: DelegatoConfig["contatti"]): string {
  if (!c) return "";
  const parts = [] as string[];
  if (c.email) parts.push(c.email);
  if (c.telefono) parts.push(c.telefono);
  return parts.join(" – ");
}

function fullDelegatoName(d: DelegatoConfig): string {
  const parts = [d.nome, d.cognome].filter(Boolean) as string[];
  return parts.length ? parts.join(" ") : d.nome || d.cognome || "";
}

export type TemplateMeta = {
  templateVersion: string;
  generatedAt: string; // ISO
  checksum?: string;
};

export function renderDelegaHTML(payload: DelegaPayload, delegato: DelegatoConfig, meta: TemplateMeta): string {
  const delegante = payload.delegante;
  const doc = payload.documento_identita;
  const firmaLuogo = payload.firma?.luogo || delegante.residenza.comune;
  const firmaData = payload.firma?.data || new Date().toLocaleDateString("it-IT");

  const delegatoNome = fullDelegatoName(delegato);
  const delegatoPivaCf = delegato.cf; // Per Delega usare SEMPRE CF
  const delegatoIndirizzo = formatAddress(delegato.indirizzo);
  const delegatoContatti = formatContatti(delegato.contatti);

  const styles = `
    <style>
      * { box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: #111; }
      .title { font-weight: 700; font-size: 18px; text-align: center; margin: 0 0 4px; }
      .subtitle { font-size: 12px; text-align: center; color: #555; margin: 0 0 16px; }
      .section-title { font-weight: 600; font-size: 14px; margin: 16px 0 8px; }
      .row { margin: 6px 0; }
      .label { font-weight: 600; }
      .box-firma { border: 1px solid #333; height: 25mm; margin-top: 12px; position: relative; }
      .firma-label { position: absolute; top: -10px; left: 8px; background: #fff; padding: 0 4px; font-size: 10px; color: #555; }
      footer { position: fixed; bottom: 10mm; left: 20mm; right: 20mm; font-size: 10px; color: #666; text-align: center; }
    </style>
  `;

  const deleganteAddress = `${delegante.residenza.via} ${delegante.residenza.civico}, ${delegante.residenza.cap} ${delegante.residenza.comune} (${delegante.residenza.provincia})`;
  const nascita = `${delegante.nascita.comune} (${delegante.nascita.provincia})`;

  const header = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
      <div style="flex:1; font-weight:700;">Document Generator</div>
      <div style="font-size:12px; color:#555;">Template v${meta.templateVersion}</div>
    </div>
    <div class="title">Delega per Conto Termico (Privato)</div>
    <div class="subtitle">Generata il ${new Date(meta.generatedAt).toLocaleString("it-IT")}</div>
  `;

  const bloccoDelegante = `
    <div class="section">
      <div class="section-title">Delegante</div>
      <div class="row"><span class="label">Nome e Cognome:</span> ${delegante.nome} ${delegante.cognome} (CF ${delegante.codice_fiscale})</div>
      <div class="row"><span class="label">Nato/a a:</span> ${nascita} il ${delegante.data_nascita}</div>
      <div class="row"><span class="label">Residente in:</span> ${deleganteAddress}</div>
      <div class="row"><span class="label">Email:</span> ${delegante.email}</div>
    </div>
  `;

  const bloccoDelegato = `
    <div class="section">
      <div class="section-title">Delegato (Installatore)</div>
      <div class="row"><span class="label">Nome/Ragione sociale:</span> ${delegatoNome}</div>
      <div class="row"><span class="label">CF:</span> ${delegatoPivaCf}</div>
      <div class="row"><span class="label">Sede:</span> ${delegatoIndirizzo}</div>
      <div class="row"><span class="label">Contatti:</span> ${delegatoContatti}</div>
    </div>
  `;

  const bloccoDocumento = `
    <div class="section">
      <div class="section-title">Documento d'identità</div>
      <div class="row"><span class="label">Tipo/Numero:</span> ${doc.tipo} ${doc.numero}</div>
      <div class="row"><span class="label">Rilascio/Scadenza:</span> ${doc.rilascio} / ${doc.scadenza}</div>
    </div>
  `;

  const clausole = `
    <div class="section">
      <div class="section-title">Oggetto e Clausole</div>
      <div class="row">Io sottoscritto/a ${delegante.nome} ${delegante.cognome} (CF ${delegante.codice_fiscale}), nato/a a ${nascita} il ${delegante.data_nascita}, residente in ${deleganteAddress},</div>
      <div class="row" style="font-weight:700;">DELEGO</div>
      <div class="row">${delegatoNome} (CF ${delegatoPivaCf}), con sede in ${delegatoIndirizzo}, a rappresentarmi ai soli fini della predisposizione, presentazione e gestione delle comunicazioni inerenti alla domanda relativa al meccanismo Conto Termico, compresi la compilazione dei moduli, la trasmissione telematica e la ricezione di comunicazioni. Restano esclusi incasso di somme, mandati all’incasso e qualunque atto non strettamente necessario alla presentazione della pratica.</div>
      <div class="row">Dichiaro di aver preso visione dell’informativa privacy e acconsento al trattamento dei dati per le finalità sopra indicate.</div>
    </div>
  `;

  const firma = `
    <div class="section">
      <div class="row">Luogo ${firmaLuogo} &nbsp;&nbsp;&nbsp;&nbsp; Data ${firmaData}</div>
      <div class="box-firma"><div class="firma-label">Firma leggibile del delegante</div></div>
    </div>
  `;

  const footer = `
    <footer>Generated at ${new Date(meta.generatedAt).toLocaleString("it-IT")} • Template v${meta.templateVersion}${meta.checksum ? ` • Checksum ${meta.checksum}` : ""}</footer>
  `;

  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charSet="utf-8" />
    <title>Delega Conto Termico</title>
    ${styles}
  </head>
  <body>
    ${header}
    ${bloccoDelegante}
    ${bloccoDelegato}
    ${bloccoDocumento}
    ${clausole}
    ${firma}
    ${footer}
  </body>
</html>`;
}
