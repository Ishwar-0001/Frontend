import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

/* ---------- CONFIG & HELPERS ---------- */
const GAMES = [
  { key: "DESAWAR", gameId: "116", time: "(05:00 AM)" },
  { key: "SHRI GANESH", gameId: "127", time: "(04:30 PM)" },
  { key: "DELHI BAZAR", gameId: "126", time: "(03:00 PM)" },
  { key: "GALI", gameId: "120", time: "(11:30 PM)" },
  { key: "GHAZIABAD", gameId: "119", time: "(08:30 PM)" },
  { key: "FARIDABAD", gameId: "117", time: "(06:00 PM)" },
  { key: "NOIDA KING", gameId: "001", time: "(10:30 PM)" },
];

const formatDate = (d) =>
  `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

const TODAY = formatDate(new Date());
const YESTERDAY = formatDate(new Date(Date.now() - 86400000));

/* ---------- REFINED COMPONENTS ---------- */

const ArrowBadge = React.memo(() => (
  <div className="flex items-center justify-center px-1">
    <svg width="42" height="18" viewBox="0 0 42 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Border (Yellow) */}
      <path d="M0 0H35L42 9L35 18H0V0Z" fill="#FDE047" />
      {/* Inner Fill (Red) */}
      <path d="M1.5 1.5H34.5L40 9L34.5 16.5H1.5V1.5Z" fill="#D00000" />
      <text x="5" y="12.5" fill="#FDE047" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">NEW</text>
    </svg>
  </div>
));

const ValueBox = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-white text-[11px] font-bold mb-1">{label}</span>
    <div className="bg-white min-w-[40px] px-1.5 h-6 rounded-full flex justify-center items-center shadow-md">
      <span className="text-[#D00000] font-black text-sm">{value}</span>
    </div>
  </div>
);

const RowItem = React.memo(({ row }) => (
  <div className="py-5 flex flex-col items-center border-b border-black/40 w-full hover:bg-black/5 transition-colors">
    <h2 className="text-white font-black uppercase text-[16px] tracking-tight">{row.place}</h2>
    <h3 className="text-yellow-300 text-[12px] font-bold mb-3">{row.time}</h3>

    {/* This container uses items-end to align the "Value Boxes" and "Arrow" perfectly in the middle */}
    <div className="flex items-end justify-center gap-1">
      <ValueBox label="Last" value={row.last} />
      
      {/* Wrapper to ensure the arrow sits at the same height as the white boxes */}
      <div className="pb-1"> 
        <ArrowBadge />
      </div>

      <ValueBox label="Today" value={row.today} />
    </div>
  </div>
));

/* ---------- MAIN COMPONENT ---------- */

export default function ResultsTable() {
  const [rows, setRows] = useState([]);

  const gameIndexById = useMemo(() => {
    const map = {};
    GAMES.forEach((g, i) => (map[g.gameId] = i));
    return map;
  }, []);

  const defaultRows = useMemo(
    () => GAMES.map((g) => ({ place: g.key, time: g.time, today: "-", last: "-" })),
    []
  );

  useEffect(() => {
    const fetchResults = async () => {
      const resultRows = defaultRows.map((r) => ({ ...r }));
      try {
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((r) => r.json()),
          fetch(api.GameResults.getAll).then((r) => r.json()),
        ]);

        scrapeRes?.data?.forEach(({ gameId, date, resultNumber }) => {
          const index = gameIndexById[gameId];
          if (index !== undefined) {
            if (date === TODAY) resultRows[index].today = resultNumber ?? "-";
            if (date === YESTERDAY) resultRows[index].last = resultNumber ?? "-";
          }
        });

        const noidaIdx = gameIndexById["001"];
        const noidaGame = noidaRes?.data?.find((g) => g.gameId === "001");
        noidaGame?.results?.forEach(({ date, resultNumber }) => {
          if (date === TODAY) resultRows[noidaIdx].today = resultNumber ?? "-";
          if (date === YESTERDAY) resultRows[noidaIdx].last = resultNumber ?? "-";
        });

        setRows(resultRows);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchResults();
  }, [defaultRows, gameIndexById]);

  const mid = Math.ceil(rows.length / 2);
  const left = rows.slice(0, mid);
  const right = rows.slice(mid);

  return (
    <div className="w-full min-h-screen bg-[#002e00] p-4 font-sans">
      <div className="max-w-4xl mx-auto border-[2px] border-black shadow-xl rounded-sm bg-[#003d00]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">
          <div className="flex flex-col">
            {left.map((r) => <RowItem key={r.place} row={r} />)}
          </div>
          <div className="flex flex-col">
            {right.map((r) => <RowItem key={r.place} row={r} />)}
          </div>
        </div>
      </div>
    </div>
  );
}