import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./GameChartTable.css";

const GAME_MAP = {
  "116": "DESAWAR",
  "127": "SHRI GANESH",
  "126": "DELHI BAZAR",
  "120": "GALI",
  "119": "GHAZIABAD",
  "117": "FARIDABAD",
};

const COLUMNS = ["DESAWAR", "SHRI GANESH", "DELHI BAZAR", "GALI", "GHAZIABAD", "FARIDABAD"];

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(api.NewScrapeData.saveScrape);
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const result = await response.json();

        if (result.success && isMounted) {
          const tableMap = new Map();

          // Grouping flat data by date
          result.data.forEach(({ date, gameId, resultNumber }) => {
            const gameName = GAME_MAP[gameId];
            if (!gameName || !date) return;

            if (!tableMap.has(date)) {
              const row = { date };
              COLUMNS.forEach(col => row[col] = "-");
              tableMap.set(date, row);
            }
            tableMap.get(date)[gameName] = resultNumber || "-";
          });

          // Sorting: 01-01-2026 at the top, increasing to today
          const sortedData = Array.from(tableMap.values()).sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split("-").map(Number);
            const [dayB, monthB, yearB] = b.date.split("-").map(Number);
            
            return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
          });

          setRows(sortedData);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="loading">Loading 2026 Records...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="chart-wrapper">
      <div className="table-responsive">
        <table className="game-table">
          <thead>
            <tr>
              <th>DATE</th>
              {COLUMNS.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.date} className={index % 2 === 0 ? "even" : "odd"}>
                {/* Now shows the date string (e.g. 12-01-2026) directly */}
                <td className="date-cell">
                  {row.date}
                </td>
                {COLUMNS.map(col => (
                  <td key={col} className={row[col] !== "-" ? "has-data" : "no-data"}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}