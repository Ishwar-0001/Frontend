import React, { useEffect, useState } from "react";
import api from "../../api/api";

/* ---------- GAME CONFIG ---------- */
const GAMES = [
  { key: "DESAWAR", gameId: "116", source: "SCRAPE", time: "(05:00 AM)" },
  { key: "SHRI GANESH", gameId: "127", source: "SCRAPE", time: "(04:30 PM)" },
  { key: "DELHI BAZAR", gameId: "126", source: "SCRAPE", time: "(03:00 PM)" },
  { key: "GALI", gameId: "120", source: "SCRAPE", time: "(11:30 PM)" },
  { key: "GHAZIABAD", gameId: "119", source: "SCRAPE", time: "(08:30 PM)" },
  { key: "FARIDABAD", gameId: "117", source: "SCRAPE", time: "(06:00 PM)" },
  { key: "NOIDA KING", gameId: "001", source: "NOIDA", time: "(10:30 PM)" },
];

/* ---------- DATE HELPERS ---------- */
const formatDate = (d) => {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const getToday = () => formatDate(new Date());
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
};

function ResultsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const today = getToday();
      const yesterday = getYesterday();

      // 1️⃣ Default rows with "-"
      const rows = GAMES.map((g) => ({
        place: g.key,
        time: g.time,
        today: "-",
        last: "-",
      }));

      try {
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((r) => r.json()),
          fetch(api.GameResults.getAll).then((r) => r.json()),
        ]);

        /* ---------- SCRAPE API ---------- */
        (scrapeRes.data || []).forEach((item) => {
          const index = GAMES.findIndex(
            (g) => g.source === "SCRAPE" && g.gameId === item.gameId
          );
          if (index === -1) return;

          if (item.date === today) {
            rows[index].today = item.resultNumber ?? "-";
          }
          if (item.date === yesterday) {
            rows[index].last = item.resultNumber ?? "-";
          }
        });

        /* ---------- NOIDA KING API ---------- */
        (noidaRes.data || []).forEach((game) => {
          if (game.gameId !== "001") return;
          if (!Array.isArray(game.results)) return;

          const index = GAMES.findIndex((g) => g.key === "NOIDA KING");
          if (index === -1) return;

          game.results.forEach((r) => {
            if (r.date === today) {
              rows[index].today = r.resultNumber ?? "-";
            }
            if (r.date === yesterday) {
              rows[index].last = r.resultNumber ?? "-";
            }
          });
        });

        setData(rows);
      } catch (err) {
        console.error("❌ ResultsTable Error:", err);
      }
    };

    fetchResults();
  }, []);

  /* ---------- UI SPLIT ---------- */
  const mid = Math.ceil(data.length / 2);
  const left = data.slice(0, mid);
  const right = data.slice(mid);

  /* ---------- ARROW BADGE (UNCHANGED) ---------- */
  const ArrowBadge = () => {
    const height = 18;
    const border = 2;
    const outerHalf = height / 2;
    const innerHalf = (height - border * 2) / 2;

    return (
      <div className="relative flex items-center mx-1" style={{ height }}>
        <div className="flex items-center">
          <div className="bg-yellow-300 h-full pl-2 pr-1 rounded-l-sm flex items-center">
            <span className="opacity-0 text-[10px]">NEW</span>
          </div>
          <div
            className="w-0 h-0 border-t-transparent border-b-transparent border-l-yellow-300"
            style={{
              borderTopWidth: outerHalf,
              borderBottomWidth: outerHalf,
              borderLeftWidth: outerHalf,
            }}
          />
        </div>

        <div
          className="absolute flex items-center z-10"
          style={{ top: border, left: border }}
        >
          <div className="bg-[#d00000] pl-1 pr-0.5 rounded-l-sm">
            <span className="text-yellow-300 text-[10px] font-bold">NEW</span>
          </div>
          <div
            className="w-0 h-0 border-t-transparent border-b-transparent border-l-[#d00000]"
            style={{
              borderTopWidth: innerHalf,
              borderBottomWidth: innerHalf,
              borderLeftWidth: innerHalf,
            }}
          />
        </div>
      </div>
    );
  };

  const RowItem = ({ row }) => (
    <div className="py-4 min-h-[110px] flex flex-col items-center border-b border-black w-full">
      <h2 className="text-white font-bold uppercase text-[15px]">{row.place}</h2>
      <h3 className="text-yellow-300 text-[13px] mb-1">{row.time}</h3>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-white text-[12px]">Last</span>
          <div className="bg-white min-w-[36px] h-[22px] rounded-[10px] flex justify-center items-center">
            <span className="text-[#d00000] font-bold">{row.last}</span>
          </div>
        </div>

        <div className="pt-3">
          <ArrowBadge />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-white text-[12px]">Today</span>
          <div className="bg-white min-w-[36px] h-[22px] rounded-[10px] flex justify-center items-center">
            <span className="text-[#d00000] font-bold">{row.today}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#002800] py-8">
      <div className="max-w-4xl mx-auto border-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x divide-black">
          <div>{left.map((r, i) => <RowItem key={i} row={r} />)}</div>
          <div>{right.map((r, i) => <RowItem key={i} row={r} />)}</div>
        </div>
      </div>
    </div>
  );
}

export default ResultsTable;
