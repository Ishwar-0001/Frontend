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
  // "001" is handled specifically from the GameResults API
};

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both APIs simultaneously
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((res) => res.json()),
          fetch(api.GameResults.getAll).then((res) => res.json()),
        ]);

        const table = {};

        /* ---------- PROCESS SCRAPED DATA (Main Games) ---------- */
        const mainData = scrapeRes.data || [];
        mainData.forEach((item) => {
          if (!item?.date || !item?.gameId) return;
          const columnName = GAME_MAP[item.gameId];
          if (!columnName) return;

          if (!table[item.date]) table[item.date] = createEmptyRow(item.date);
          table[item.date][columnName] = item.resultNumber ?? "-";
        });

        /* ---------- PROCESS NOIDA KING DATA (Nested Structure) ---------- */
        const noidaDataList = noidaRes.data || [];
        noidaDataList.forEach((gameGroup) => {
          // Check if this group is Noida King (ID 001 or the one you mentioned)
          if (gameGroup.gameId === "001" || gameGroup.gameId === "1233333") {
            if (Array.isArray(gameGroup.results)) {
              gameGroup.results.forEach((res) => {
                if (!res.date) return;
                if (!table[res.date]) table[res.date] = createEmptyRow(res.date);
                table[res.date]["NOIDA KING"] = res.resultNumber ?? "-";
              });
            }
          }
        });

        /* ---------- DATE SORT (ASCENDING: 01, 02, 03...) ---------- */
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(0);
          const parts = dateStr.split("-"); // Expected DD-MM-YYYY
          if (parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
          return new Date(dateStr);
        };

        const sortedRows = Object.values(table).sort(
          (a, b) => parseDate(a.date) - parseDate(b.date)
        );

        setRows(sortedRows);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="loading">Loading Chart...</div>;

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
                  <td className="noida-cell">{row["NOIDA KING"]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No records available for this period.</td>
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