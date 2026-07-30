import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const fetchEcoFreightEmissions = async (data) => {
  const { transport, baggageWeight = 10 } = data;

  console.log(`📡 Chiamata API REALE (Carbon Interface) per trasporto: ${transport}`);

  const apiKey = process.env.CARBON_INTERFACE_API_KEY;
  if (!apiKey) {
    throw new Error("Chiave API di Carbon Interface mancante nelle variabili d'ambiente.");
  }

  try {
    // Esempio: Chiamata reale per stima emissioni veicolo/trasporto
    const response = await axios.post(
      'https://www.carboninterface.com/api/v1/estimates',
      {
        type: 'vehicle',
        distance_unit: 'km',
        distance_value: 500, // o calcolata dinamicamente
        vehicle_model_id: '7268a9b7-17e8-4c8d-aded-57059252daf6' // ID veicolo standard
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const attributes = response.data.data.attributes;

    return {
      co2: attributes.carbon_kg,
      unit: "kg",
      transport,
      distanceKm: attributes.distance_value,
      isRealData: true
    };

  } catch (error) {
    console.error("❌ Errore API Carbon Interface:", error.response?.data || error.message);
    throw new Error("Impossibile recuperare i dati reali sulle emissioni.");
  }
};