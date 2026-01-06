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
  "142": "NOIDA KING",
};

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeFetch = async (url) => {
      const res = await fetch(url);

      const text = await res.text(); // 👈 prevent JSON crash
      try {
        return JSON.parse(text);
      } catch (err) {
        console.error("❌ Invalid JSON response from:", url);
        console.error(text);
        throw err;
      }
    };

    const fetchAllData = async () => {
      try {
        console.log("MAIN API:", api.ResponseData.testing);
        console.log("NOIDA API:", api.GameResults.getAll);

        const [mainRes, noidaRes] = await Promise.all([
          safeFetch(api.ResponseData.testing),
          safeFetch(api.GameResults.getAll),
        ]);

        const table = {};

        /* ---------- MAIN API DATA ---------- */
        if (Array.isArray(mainRes?.results)) {
          mainRes.results.forEach((item) => {
            if (!item?.date || !item?.gameId) return;

            const columnName = GAME_MAP[item.gameId];
            if (!columnName) return;

            if (!table[item.date]) {
              table[item.date] = createEmptyRow(item.date);
            }

            table[item.date][columnName] = item.resultNumber ?? "-";
          });
        }

        /* ---------- NOIDA KING DATA ---------- */
        if (Array.isArray(noidaRes?.data)) {
          noidaRes.data.forEach((game) => {
            if (!Array.isArray(game?.results)) return;

            game.results.forEach((item) => {
              if (!item?.date) return;

              if (!table[item.date]) {
                table[item.date] = createEmptyRow(item.date);
              }

              table[item.date]["NOIDA KING"] = item.resultNumber ?? "-";
            });
          });
        }

        /* ---------- DATE SORT ---------- */
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(0);

          // YYYY-MM-DD
          if (dateStr.length === 10 && dateStr.indexOf("-") === 4) {
            return new Date(dateStr);
          }

          // DD-MM-YYYY
          const parts = dateStr.split("-");
          if (parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }

          return new Date(0);
        };

        const sortedRows = Object.values(table)
          .filter((row) => row?.date)
          .sort((a, b) => parseDate(a.date) - parseDate(b.date));

        setRows(sortedRows);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

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
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="date-cell">{row.date}</td>
                <td>{row.DESAWAR}</td>
                <td>{row["SHRI GANESH"]}</td>
                <td>{row["DELHI BAZAR"]}</td>
                <td>{row.GALI}</td>
                <td>{row.GHAZIABAD}</td>
                <td>{row.FARIDABAD}</td>
                <td>{row["NOIDA KING"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */
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
