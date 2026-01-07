import React, { useEffect, useState } from "react";
import "./GameChartTable.css";
import api from "../../api/api";

const GAME_MAP = {
  "116": "DESAWAR",
  "127": "SHRI GANESH",
  "126": "DELHI BAZAR",
  "120": "GALI",
  "119": "GHAZIABAD",
  "117": "FARIDABAD",
  "001": "NOIDA KING", 
};

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(api.ReadScrapeData.totalData);
        const json = await response.json();

        const rawData = json.data || [];
        const table = {};

        rawData.forEach((item) => {
          // --- CASE 1: Nested Results (Noida King Structure) ---
          if (Array.isArray(item.results)) {
            item.results.forEach((res) => {
              // Force check for Noida King ID if the API sends a different one (like 1233333)
              // Or keep item.gameId if the API is corrected to '001'
              const gameId = item.gameId === "1233333" ? "001" : item.gameId;
              const columnName = GAME_MAP[gameId];
              
              if (columnName && res.date) {
                if (!table[res.date]) table[res.date] = createEmptyRow(res.date);
                table[res.date][columnName] = res.resultNumber ?? "-";
              }
            });
          } 
          // --- CASE 2: Flat Results (Main API Structure) ---
          else if (item.date && item.gameId) {
            const columnName = GAME_MAP[item.gameId];
            if (columnName) {
              if (!table[item.date]) table[item.date] = createEmptyRow(item.date);
              table[item.date][columnName] = item.resultNumber ?? "-";
            }
          }
        });

        /* ---------- DATE SORT (ASCENDING: 01, 02, 03...) ---------- */
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(0);
          const parts = dateStr.split("-"); 
          if (parts.length === 3) {
            // Converts DD-MM-YYYY to YYYY-MM-DD for reliable parsing
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
          return new Date(dateStr);
        };

        const sortedRows = Object.values(table).sort(
          (a, b) => parseDate(a.date) - parseDate(b.date)
        );

        setRows(sortedRows);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <p className="loading">Loading Results...</p>;

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className="game-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>DESAWAR</th>
              <th>SHRI GANESH</th>
              <th>DELHI BAZAR</th>
              <th>GALI</th>
              <th>GHAZIABAD</th>
              <th>FARIDABAD</th>
              <th>NOIDA KING</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index}>
                  <td className="date-cell">{row.date}</td>
                  <td>{row.DESAWAR}</td>
                  <td>{row["SHRI GANESH"]}</td>
                  <td>{row["DELHI BAZAR"]}</td>
                  <td>{row.GALI}</td>
                  <td>{row.GHAZIABAD}</td>
                  <td>{row.FARIDABAD}</td>
                  <td className="highlight-noida">{row["NOIDA KING"]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function createEmptyRow(date) {
  return {
    date,
    DESAWAR: "-",
    "SHRI GANESH": "-",
    "DELHI BAZAR": "-",
    GALI: "-",
    GHAZIABAD: "-",
    FARIDABAD: "-",
    "NOIDA KING": "-",
  };
}