import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

/* ---------- CONFIG ---------- */
const GAMES = [
  { key: "DESAWAR", gameId: "116" },
  { key: "DELHI BAZAR", gameId: "126" },
  { key: "NOIDA KING", gameId: "001" },
];

const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

export default function ResultBoard() {
  const today = useMemo(() => getTodayDate(), []);
  
  // 1. Set initial state to default results immediately (Removes the Loading Screen)
  const [results, setResults] = useState(
    GAMES.map((g) => ({ name: g.key, number: "-" }))
  );
  const [dateTime, setDateTime] = useState(`${today} Results`);

  const gameIndexById = useMemo(() => {
    const map = {};
    GAMES.forEach((g, i) => (map[g.gameId] = i));
    return map;
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchTodayResults = async () => {
      try {
        // Fetch happens in the background
        const response = await fetch(api.NewScrapeData.saveScrape);
        const resJson = await response.json();

        if (resJson?.success && resJson?.data && mounted) {
          // Create a copy of current state to update
          const updatedResults = GAMES.map((g) => ({ name: g.key, number: "-" }));
          
          resJson.data.forEach(({ gameId, date, resultNumber }) => {
            if (date === today) {
              const index = gameIndexById[gameId];
              if (index !== undefined) {
                updatedResults[index].number = resultNumber ?? "-";
              }
            }
          });

          setResults(updatedResults);
        }
      } catch (err) {
        console.error("❌ ResultBoard Background Fetch Error:", err);
      }
    };

    fetchTodayResults();
    return () => (mounted = false);
  }, [today, gameIndexById]);

  // 2. Removed the "if (loading)" block entirely for instant UI rendering

  return (
    <div className="w-full flex justify-center my-10">
      <div className="w-[95%] rounded-3xl border-[3px] border-white p-1 bg-black shadow-2xl">
        <div className="w-full h-1.5 border-t-4 border-dotted border-red-600 rounded-t-3xl" />

        <div className="rounded-3xl border-[3px] border-white p-10 text-center bg-[radial-gradient(circle,#7a0000,#1a0000,black)]">
          <h2 className="text-yellow-300 font-semibold text-xl mb-6 tracking-widest">
            {dateTime}
          </h2>

          <div className="space-y-6">
            {results.map((item) => (
              <section key={item.name}>
                <h3 className="text-3xl font-extrabold text-white tracking-wider uppercase">
                  {item.name}
                </h3>
                {/* Numbers will "pop" in once loaded */}
                <p className="text-yellow-300 text-5xl font-bold mt-1">
                  {item.number}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}