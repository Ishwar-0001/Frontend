import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Calendar, Table as TableIcon } from "lucide-react";
import "./GameChartTable.css";

const GAME_MAP = {
  "116": "DESAWAR",
  "127": "SHRI GANESH",
  "126": "DELHI BAZAR",
  "120": "GALI",
  "119": "GHAZIABAD",
  "117": "FARIDABAD",
};

const COLUMNS = ["DESAWAR", "SHRI GANESH", "DELHI BAZAR", "GALI", "GHAZIABAD", "FARIDABAD", "NOIDA KING"];

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.NewScrapeData.saveScrape),
          fetch(api.DateNumber.getAll),
        ]);

        if (!scrapeRes.ok || !noidaRes.ok) throw new Error("API Fetch failed");

        const scrapeResult = await scrapeRes.json();
        const noidaResult = await noidaRes.json();

        if (isMounted) {
          const tableMap = new Map();

          // Helper to create a fresh row with empty spaces
          const createEmptyRow = (date) => {
            const row = { date };
            COLUMNS.forEach(col => row[col] = ""); // Changed from "-" to ""
            return row;
          };

          // 1. Process Scrape Data
          scrapeResult.data.forEach(({ date, gameId, resultNumber }) => {
            const gameName = GAME_MAP[gameId];
            if (!gameName || !date) return;
            if (!tableMap.has(date)) tableMap.set(date, createEmptyRow(date));
            tableMap.get(date)[gameName] = resultNumber || "";
          });

          // 2. Process Noida King Data
          noidaResult.data.forEach(({ date, number }) => {
            if (!date) return;
            if (!tableMap.has(date)) tableMap.set(date, createEmptyRow(date));
            tableMap.get(date)["NOIDA KING"] = number || "";
          });

          // 3. Sorting: Ascending (01 to 31)
          const sortedData = Array.from(tableMap.values()).sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split("-").map(Number);
            const [dayB, monthB, yearB] = b.date.split("-").map(Number);
            // Sort from oldest date to newest date
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

    fetchAllData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="simple-loader">Loading records...</div>;
  if (error) return <div className="error-text">Error: {error}</div>;

  return (
    <div className="clean-container">
      <div className="table-outer">
        <table className="minimal-table">
          <thead>
            <tr>
              <th className="sticky-col">Date</th>
              {COLUMNS.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td className="date-col sticky-col">
                  {row.date}
                </td>
                {COLUMNS.map(col => (
                  <td key={col} className="data-cell">
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