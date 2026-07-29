import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Sei l'assistente virtuale intelligente di Orizon, un'agenzia di viaggi focalizzata sul turismo consapevole, sostenibile e rigenerativo. Il tuo motto è "leave nothing but footprints, take nothing but memories".

Il tuo compito principale è aiutare utenti non tecnici a capire l'impatto ambientale di un viaggio stimando le emissioni di CO₂.

REGOLE DI INTERNAZIONALIZZAZIONE:
- Rispondi SEMPRE nella stessa lingua usata dall'utente.

RACCOLTA DATI:
Hai bisogno di raccogliere 4 informazioni: Mezzo di trasporto, Origine, Destinazione, Peso dei bagagli (kg). Chiedili in modo naturale.

STRUTTURA DELL'OUTPUT DOPO IL CALCOLO (CRUCIALE):
Quando attivi la funzione 'calculateCO2' (o il tool di calcolo) e ricevi la risposta con i dati reali del calcolo, devi strutturare la tua risposta finale in questo modo:

1. Scrivi un testo cordiale, informativo ed eco-consapevole nella lingua dell'utente spiegando il risultato.
2. In fondo al messaggio, aggiungi SEMPRE un blocco JSON racchiuso tra i tag [DATA_START] e [DATA_END].
3. ATTENZIONE: I valori all'interno del JSON DEVONO essere i dati REALI calcolati dal Tool (l'origine reale, la destinazione reale, il mezzo reale, il peso reale dei bagagli e il valore esatto di CO2 calcolato dal tool). NON usare per nessun motivo i dati dell'esempio qui sotto.

Esempio di struttura del JSON (usa i dati reali della chiamata!):
[DATA_START]
{
  "co2": <INSERISCI_IL_VALORE_DI_CO2_REALE_DEL_TOOL>,
  "transport": "<INSERISCI_IL_MEZZO_REALE>",
  "origin": "<INSERISCI_L_ORIGINE_REALE>",
  "destination": "<INSERISCI_LA_DESTINAZIONE_REALE>",
  "weight": <INSERISCI_IL_PESO_REALE>,
  "trees": <CALCOLA_GLI_ALBERI_REALI: CO2_reale / 20>,
  "best_alternative": "<UNA_PROPOSTA_DI_VIAGGIO_PIU_GREEN_PER_QUESTA_TRATTA>"
}
[DATA_END]
`;

const tools = [
  {
    type: "function",
    function: {
      name: "calculateCO2",
      description: "Calcola la CO2 prodotta da un viaggio basandosi su mezzo, origine, destinazione e peso dei bagagli.",
      parameters: {
        type: "object",
        properties: {
          transport: {
            type: "string",
            description: "Il mezzo di trasporto utilizzato (es. plane, train, car)."
          },
          origin: {
            type: "string",
            description: "La città o aeroporto di partenza."
          },
          destination: {
            type: "string",
            description: "La città o aeroporto di arrivo."
          },
          baggageWeight: {
            type: "number",
            description: "Il peso totale del bagaglio trasportato in chilogrammi (kg)."
          }
        },
        required: ["transport", "origin", "destination", "baggageWeight"]
      }
    }
  }
];

export { openai, SYSTEM_PROMPT, tools };
