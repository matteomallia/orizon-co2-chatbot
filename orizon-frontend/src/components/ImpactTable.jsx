import React from 'react';
import { Table } from 'lucide-react';

export default function ImpactTable({ data }) {
  if (!data) return null;

  return (
    <div className="table-container">
      <div className="table-header">
        <Table size={14} /> <span>Riepilogo Impatto Ambientale</span>
      </div>
      <table className="table">
        <tbody>
          <tr>
            <td className="td-label">Tratta:</td>
            <td className="td-value">{data.origin} ➔ {data.destination}</td>
          </tr>
          <tr>
            <td className="td-label">Dettagli:</td>
            <td className="td-value">{data.transport} ({data.weight} kg)</td>
          </tr>
          <tr className="row-highlight">
            <td className="td-label"><b>Emissioni:</b></td>
            <td className="td-value" style={{ color: '#1b5e20', fontWeight: 'bold' }}>
              {data.co2} kg CO₂
            </td>
          </tr>
          <tr>
            <td className="td-label">Compensazione:</td>
            <td className="td-value">🌳 {data.trees} alberi da piantare</td>
          </tr>
          {data.best_alternative && (
            <tr className="row-alternative">
              <td className="td-label">💡 Alternativa:</td>
              <td className="td-value" style={{ color: '#b78103', fontSize: '12px', lineHeight: '1.3' }}>
                {data.best_alternative}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}