import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

/* ---------- CONFIG ---------- */
const GAMES = [
  { key: "DESAWAR", gameId: "116", source: "SCRAPE" },
  { key: "DELHI BAZAR", gameId: "126", source: "SCRAPE" },
  { key: "NOIDA KING", gameId: "001", source: "NOIDA" },
];

/* ---------- DATE ---------- */
const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

/* ---------- COMPONENT ---------- */
export default function ResultBoard() {
  const [results, setResults] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fast lookup maps
  const gameIndexById = useMemo(() => {
    const map = {};
    GAMES.forEach((g, i) => (map[g.gameId] = i));
    return map;
  }, []);

  // 🔹 Default output
  const defaultResults = useMemo(
    () =>
      GAMES.map((g) => ({
        name: g.key,
        number: "-",
      })),
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetchTodayResults = async () => {
      try {
        const today = getTodayDate();
        const finalResults = defaultResults.map((r) => ({ ...r }));
        let finalDateTime = "";

        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((r) => r.json()),
          fetch(api.GameResults.getAll).then((r) => r.json()),
        ]);

        /* ---------- SCRAPE DATA ---------- */
        scrapeRes?.data?.forEach(({ gameId, date, resultNumber }) => {
          if (date !== today) return;

          const index = gameIndexById[gameId];
          if (index !== undefined) {
            finalResults[index].number = resultNumber ?? "-";
          }
        });

        /* ---------- NOIDA KING ---------- */
        noidaRes?.data
          ?.find((g) => g.gameId === "001")
          ?.results?.forEach(({ date, resultNumber, time }) => {
            if (date !== today) return;

            const index = gameIndexById["001"];
            finalResults[index].number = resultNumber ?? "-";

            if (time) {
              finalDateTime = `${today} ${time}`;
            }
          });

        if (mounted) {
          setResults(finalResults);
          setDateTime(finalDateTime || `${today} Results`);
        }
      } catch (err) {
        console.error("❌ ResultBoard Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTodayResults();
    return () => (mounted = false);
  }, [defaultResults, gameIndexById]);

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="text-center text-yellow-300 text-xl my-10">
        Loading Today Results...
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-10">
      <div className="w-[95%] rounded-3xl border-[3px] border-white p-1 bg-black">
        <div className="w-full h-1.5 border-t-4 border-dotted border-red-600 rounded-t-3xl" />

        <div className="rounded-3xl border-[3px] border-white p-10 text-center bg-[radial-gradient(circle,#7a0000,#1a0000,black)]">
          <h2 className="text-yellow-300 font-semibold text-xl mb-6">
            {dateTime}
          </h2>

          <div className="space-y-6">
            {results.map((item) => (
              <section key={item.name}>
                <h3 className="text-3xl font-extrabold text-white tracking-wider">
                  {item.name}
                </h3>
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
