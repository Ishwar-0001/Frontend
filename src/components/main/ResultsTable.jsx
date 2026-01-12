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
      <path d="M0 0H35L42 9L35 18H0V0Z" fill="#FDE047" />
      <path d="M1.5 1.5H34.5L40 9L34.5 16.5H1.5V1.5Z" fill="#D00000" />
      <text x="5" y="12.5" fill="#FDE047" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">NEW</text>
    </svg>
  </div>
));

const ValueBox = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-white text-[11px] font-bold mb-1">{label}</span>
    <div className="bg-white min-w-10 px-1.5 h-6 rounded-full flex justify-center items-center shadow-md">
      <span className="text-[#D00000] font-black text-sm">{value}</span>
    </div>
  </div>
);

const RowItem = React.memo(({ row }) => (
  <div className="py-5 flex flex-col items-center border-b border-black/40 w-full hover:bg-black/5 transition-colors">
    <h2 className="text-white font-black uppercase text-[16px] tracking-tight">{row.place}</h2>
    <h3 className="text-yellow-300 text-[12px] font-bold mb-3">{row.time}</h3>
    <div className="flex items-end justify-center gap-1">
      <ValueBox label="Last" value={row.last} />
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
    let isMounted = true;

    const fetchResults = async () => {
      // Create a fresh copy of default rows
      const resultRows = defaultRows.map((r) => ({ ...r }));

      try {
        const response = await fetch(api.NewScrapeData.saveScrape);
        if (!response.ok) throw new Error("Network error");
        
        const resData = await response.json();

        if (resData?.success && resData?.data && isMounted) {
          resData.data.forEach(({ gameId, date, resultNumber }) => {
            const index = gameIndexById[gameId];
            
            // If the game exists in our UI list
            if (index !== undefined) {
              if (date === TODAY) {
                resultRows[index].today = resultNumber ?? "-";
              } else if (date === YESTERDAY) {
                resultRows[index].last = resultNumber ?? "-";
              }
            }
          });
          setRows(resultRows);
        }
      } catch (err) {
        console.error("API Error:", err);
        // Fallback to default rows on error
        if (isMounted) setRows(defaultRows);
      }
    };

    fetchResults();
    return () => { isMounted = false; };
  }, [defaultRows, gameIndexById]);

  // If data hasn't loaded yet, show default rows (the "-" marks)
  const displayRows = rows.length > 0 ? rows : defaultRows;

  const mid = Math.ceil(displayRows.length / 2);
  const left = displayRows.slice(0, mid);
  const right = displayRows.slice(mid);

  return (
    <div className="w-full min-h-screen bg-[#002e00] p-4 font-sans">
      <div className="max-w-4xl mx-auto border-2 border-black shadow-xl rounded-sm bg-[#003d00]">
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