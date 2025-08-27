# Piano di lavoro per l'update del PDF della Delega

## Obiettivo

Aggiornare il PDF della Delega privato in base ai requisiti del GSE.it.

## Testo del documento
Il documento di delega fornito dal GSE.it per il privato è il seguente:

```
MODELLO DELEGA DEL SOGGETTO RESPONSABILE
AL SOGGETTO DELEGATO 


Il/la sottoscritto/a [inserire nome e cognome] nato a [inserire comune di nascita (provincia)], il [inserire data di nascita], residente in [inserire indirizzo della residenza], comune di [inserire comune di residenza (provincia)], codice fiscale [inserire codice fiscale],

DELEGA

il/la [TITOLO] [inserire nome e cognome] nato a [inserire comune di nascita (provincia)], il [inserire data di nascita], residente in [inserire indirizzo della residenza], comune di [inserire comune di residenza (provincia)], codice fiscale [inserire codice fiscale],

a operare in nome proprio e per proprio conto sul Portale del GSE (c.d. Portaltermico), al fine di richiedere gli incentivi per la produzione di energia termica da fonti rinnovabili e degli interventi di efficienza energetica di piccole dimensioni di cui al D.M. 16 febbraio 2016.

Luogo e data:__________/____/____/__
                                                                                            Il Soggetto Responsabile
	   							                                                                  [inserire nome]
							                                                                       ……………………………………

Allegati:
copia di un proprio documento d’identità in corso di validità.

```

Il  soggetto responsabile è il proprietario dell'edificio su cui viene fatto l'intervento. I suoi dati sono quelli estratti dal documento di identità attraverso il flusso di OCR.

Il sogetto delegato è, per ora, sempre lo stesso tecnico (Francesco Scandola) che segue la richiesta di incentivo. I suoi dati sono contenti nel file delegato.json.

## Acceptance Criteria

- [ ] Il documento PDF finale deve avere unicamente il testo del modello di delega, con i campi da riempire sostituiti con i dati estratti dal documento di identità e dal file delegato.json.

---
## Piano di lavoro operativo (secco)

- [ ] Allineare il template al testo GSE “as-is” (solo corpo testo, nessun header/logo):
  - Creare `docgenapp/lib/templates/delega-privato/template-gse.ts` con renderer HTML minimale che riproduce esattamente il testo GSE, sostituendo i placeholder.
  - Formattazioni minime: font di sistema, margini già gestiti da `htmlToPdf`.
- [ ] Mapping dei campi (delegante e delegato) e util di formattazione:
  - Implementare `formatDateToIT` che converte `YYYY-MM-DD -> DD/MM/YYYY` e lascia invariato se già in `DD/MM/YYYY`.
  - Comporre indirizzi come richiesto: `via + civico`, e `comune (provincia)`.
- [ ] Adeguare la route di generazione:
  - In `docgenapp/app/api/documenti/delega-privato/generate/route.ts` usare il nuovo `renderDelegaGSEHTML(...)` (versione template `GSE-1.0`).
  - Opzione di compatibilità: parametro `?template=gse|legacy` (default: `gse`).
  - “Luogo e data” senza default: lasciare campi vuoti nel documento (nessuna sostituzione automatica).
- [ ] Completare dati del delegato necessari al modello GSE:
  - Estendere `docgenapp/config/delegato.json` con i campi mancanti (vedi Domande aperte) o gestire fallback vuoti se confermato.
- [ ] Verifiche e QA visivo:
  - Generare PDF con dati di esempio; validare che il testo sia identico al modello GSE con soli placeholder sostituiti.
  - Controllare encoding/acentature, spazi non separabili su CAP/CF.
- [ ] Aggiornare `docs/ARCHITETTURA-MULTIDOCUMENTO.md` con il nuovo template `GSE-1.0` e le decisioni di mapping.

## Mappatura campi (sintesi)

- [delegante]
  - nome e cognome → `{{delegante.nome}} {{delegante.cognome}}`
  - nato a → `{{delegante.nascita.comune}} ({{delegante.nascita.provincia}})`
  - il (data nascita) → `formatDateISOtoIT({{delegante.data_nascita}})`
  - residente in (indirizzo) → `{{delegante.residenza.via}} {{delegante.residenza.civico}}`
  - comune di (residenza) → `{{delegante.residenza.comune}} ({{delegante.residenza.provincia}})`
  - codice fiscale → `{{delegante.codice_fiscale}}`
- [delegato]
  - titolo → `{{delegato.titolo}}` (impostato: `Ing.`)
  - nome e cognome → `{{delegato.nome}} {{delegato.cognome}}`
  - nato a → `{{delegato.nascita.comune}} ({{delegato.nascita.provincia}})`
  - il (data nascita) → `formatDateToIT({{delegato.data_nascita}})`
  - residente in (indirizzo) → `{{delegato.indirizzo.via}} {{delegato.indirizzo.civico}}`
  - comune di (residenza) → `{{delegato.indirizzo.comune}} ({{delegato.indirizzo.provincia}})`
  - codice fiscale → `{{delegato.cf}}`
- [firma]
  - Luogo e data → lasciare vuoti (nessun default).

Nota: se un campo del delegato non è disponibile e ci autorizzi a lasciarlo vuoto, sarà sostituito da stringa vuota per rispettare il testo GSE senza aggiunte.

## Decisioni confermate

- __Titolo delegato__: Ing.
- __Campi delegato__: aggiungere `data_nascita` (12/07/1988) e `nascita.{comune: Zevio, provincia: VR}` in `delegato.json`.
- __Formato date__: DD/MM/YYYY.
- __Luogo e data in calce__: lasciare vuoti (nessun default automatico).
- __Contenuto PDF__: solo corpo del testo GSE (nessun header/logo/clausole extra).

## Step successivo (post testuale) — Appendere immagini documento

- [ ] Estendere la generazione PDF per includere, in coda al documento, le immagini fronte e retro del documento d’identità del soggetto responsabile.
  - Opzioni di implementazione:
    - Estendere il payload di `/api/documenti/delega-privato/generate` per accettare `frontBase64` e `backBase64` (già disponibili lato client per l’OCR).
    - Includere le immagini come `<img>` a pagina 2–3, con titolo “Documento d’identità – Fronte/Retro”.
  - QA: verifica qualità di stampa, dimensioni e orientamento su A4.

## Tempistiche stimate

- Implementazione template GSE + mapping + route: ~0.5g
- Estensione config delegato + test: ~0.5g
- QA e rifiniture: ~0.5g
 - Step successivo (append immagini): ~0.5–1g (a parte)
