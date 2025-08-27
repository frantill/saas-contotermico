import { DelegaPayload, DelegatoConfig } from "@/lib/types";

function formatDateToIT(input?: string): string {
  if (!input) return "";
  // Already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return input;
  // From YYYY-MM-DD
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return input;
}

function addrLine(i: { via: string; civico?: string }): string {
  return [i.via, i.civico].filter(Boolean).join(" ");
}

function comuneProv(comune?: string, provincia?: string): string {
  if (!comune && !provincia) return "";
  return `${comune || ""}${provincia ? ` (${provincia})` : ""}`.trim();
}

export function renderDelegaGSEHTML(payload: DelegaPayload, delegato: DelegatoConfig): string {
  const d = payload.delegante;
  const delNome = `${d.nome} ${d.cognome}`.trim();
  const delNascita = comuneProv(d.nascita?.comune, d.nascita?.provincia);
  const delDataNascita = formatDateToIT(d.data_nascita);
  const delIndirizzo = addrLine({ via: d.residenza.via, civico: d.residenza.civico });
  const delComuneRes = comuneProv(d.residenza.comune, d.residenza.provincia);

  const g = delegato;
  const gTitolo = g.titolo || "";
  const gNome = [g.nome, g.cognome].filter(Boolean).join(" ");
  const gNascita = comuneProv(g.nascita?.comune, g.nascita?.provincia);
  const gDataNascita = formatDateToIT(g.data_nascita);
  const gIndirizzo = addrLine({ via: g.indirizzo.via, civico: g.indirizzo.civico });
  const gComuneRes = comuneProv(g.indirizzo.comune, g.indirizzo.provincia);

  const htmlBody = `
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charSet="utf-8" />
    <title>Modello Delega GSE</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial; color: #111; font-size: 12pt; }
      .line { margin: 8px 0; }
      .spacer { height: 8px; }
      .dots { letter-spacing: 2px; }
      .block { margin: 14px 0; }
      .caps { font-weight: 700; }
      .pre { white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div class="block caps">MODELLO DELEGA DEL SOGGETTO RESPONSABILE<br/>AL SOGGETTO DELEGATO</div>

    <div class="block pre">
Il/la sottoscritto/a ${delNome} nato a ${delNascita}, il ${delDataNascita}, residente in ${delIndirizzo}, comune di ${delComuneRes}, codice fiscale ${d.codice_fiscale},

DELEGA

il/la ${gTitolo} ${gNome} nato a ${gNascita}, il ${gDataNascita}, residente in ${gIndirizzo}, comune di ${gComuneRes}, codice fiscale ${g.cf},

a operare in nome proprio e per proprio conto sul Portale del GSE (c.d. Portaltermico), al fine di richiedere gli incentivi per la produzione di energia termica da fonti rinnovabili e degli interventi di efficienza energetica di piccole dimensioni di cui al D.M. 16 febbraio 2016.

Luogo e data:__________/____/____/__
                                                                                             Il Soggetto Responsabile
                                                                                             ${delNome}
                                                                                             ……………………………………

Allegati:
- copia di un proprio documento d’identità in corso di validità.
    </div>
  </body>
</html>`;

  return htmlBody;
}
