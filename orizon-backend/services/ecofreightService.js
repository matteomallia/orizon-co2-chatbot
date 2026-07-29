import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const fetchEcoFreightEmissions = async (data) => {
  const { transport, origin, destination, baggageWeight } = data;

  console.log(`📡 Invio richiesta reale a EcoFreight per: ${transport} da ${origin} a ${destination}`);

  const apiKey = process.env.ECOFREIGHT_API_KEY;
  
  if (!apiKey) {
    throw new Error("Chiave API di EcoFreight mancante nel file .env");
  }

  try {
    const response = await axios.post('https://api.ecofreight.io/v1/calculate', {
      transport_mode: transport, // es. "plane", "train", "car"
      origin: origin,
      destination: destination,
      cargo_weight_kg: baggageWeight
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      co2: response.data.total_co2_emissions, // Adatta queste chiavi in base al JSON restituito da EcoFreight
      unit: response.data.unit || "kg",
      transport,
      origin,
      destination,
      weight: baggageWeight
    };

  } catch (error) {
    console.error("❌ Errore durante la chiamata all'API di EcoFreight:", error.response?.data || error.message);
    
    return {
      co2: 142.5, 
      unit: "kg",
      transport,
      origin,
      destination,
      weight: baggageWeight,
      isFallback: true
    };
  }
};
