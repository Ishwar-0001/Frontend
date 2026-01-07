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
};

const NOIDA_IDS = new Set(["001", "1233333"]);

const COLUMNS = [
  "DESAWAR",
  "SHRI GANESH",
  "DELHI BAZAR",
  "GALI",
  "GHAZIABAD",
  "FARIDABAD",
  "NOIDA KING",
];

const parseDate = (date) => {
  const [d, m, y] = date.split("-");
  return new Date(`${y}-${m}-${d}`);
};

const createRow = (date) =>
  COLUMNS.reduce((a, c) => ({ ...a, [c]: "-" }), { date });

export default function GameChartTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((r) => r.json()),
          fetch(api.GameResults.getAll).then((r) => r.json()),
        ]);

        const table = new Map();

        scrapeRes?.data?.forEach(({ date, gameId, resultNumber }) => {
          const col = GAME_MAP[gameId];
          if (!date || !col) return;

          if (!table.has(date)) table.set(date, createRow(date));
          table.get(date)[col] = resultNumber ?? "-";
        });

        noidaRes?.data?.forEach((group) => {
          if (!NOIDA_IDS.has(group.gameId)) return;

          group.results?.forEach(({ date, resultNumber }) => {
            if (!date) return;

            if (!table.has(date)) table.set(date, createRow(date));
            table.get(date)["NOIDA KING"] = resultNumber ?? "-";
          });
        });

        if (mounted) {
          setRows(
            [...table.values()].sort(
              (a, b) => parseDate(a.date) - parseDate(b.date)
            )
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="table-wrapper fade-in">
      <div className="table-container">
        <table className="game-table">
          <thead>
            <tr>
              <th>DATE</th>
              {COLUMNS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td className="date-cell">{row.date}</td>
                {COLUMNS.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Skeleton = () => (
  <div className="skeleton-wrapper">
    <div className="skeleton-row" />
    <div className="skeleton-row" />
    <div className="skeleton-row" />
  </div>
);
