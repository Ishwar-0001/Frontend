import React, { useEffect, useState } from "react";
import api from "../../api/api";

const GAMES = [
  { key: "DESAWAR", gameId: "116", source: "SCRAPE" },
  { key: "DELHI BAZAR", gameId: "126", source: "SCRAPE" },
  { key: "NOIDA KING", gameId: "001", source: "NOIDA" },
];

const getTodayDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

function ResultBoard() {
  const [results, setResults] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayResults = async () => {
      try {
        const today = getTodayDate();

        // 1️⃣ Default output (all "-")
        const finalResults = GAMES.map((g) => ({
          name: g.key,
          number: "-",
        }));

        // 2️⃣ Fetch BOTH APIs
        const [scrapeRes, noidaRes] = await Promise.all([
          fetch(api.ReadScrapeData.totalData).then((r) => r.json()),
          fetch(api.GameResults.getAll).then((r) => r.json()),
        ]);

        /* ---------- SCRAPED DATA (DESAWAR, DELHI BAZAR) ---------- */
        const scrapedData = scrapeRes.data || [];

        scrapedData.forEach((item) => {
          if (item.date !== today) return;

          const index = GAMES.findIndex(
            (g) => g.source === "SCRAPE" && g.gameId === item.gameId
          );

          if (index !== -1) {
            finalResults[index].number =
              item.resultNumber ?? "-";
          }
        });

        /* ---------- NOIDA KING (DIFFERENT API) ---------- */
        const noidaGames = noidaRes.data || [];

        noidaGames.forEach((game) => {
          if (game.gameId !== "001") return;
          if (!Array.isArray(game.results)) return;

          const todayResult = game.results.find(
            (r) => r.date === today
          );

          if (todayResult) {
            const index = GAMES.findIndex(
              (g) => g.key === "NOIDA KING"
            );

            if (index !== -1) {
              finalResults[index].number =
                todayResult.resultNumber ?? "-";

              if (!dateTime && todayResult.time) {
                setDateTime(`${today} ${todayResult.time}`);
              }
            }
          }
        });

        setResults(finalResults);
      } catch (err) {
        console.error("❌ ResultBoard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayResults();
  }, [dateTime]);

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

        <div className="w-full h-1.5 border-t-4 border-dotted border-red-600 rounded-t-3xl"></div>

        <div className="rounded-3xl border-[3px] border-white p-10 text-center bg-[radial-gradient(circle,#7a0000,#1a0000,black)]">

          <h2 className="text-yellow-300 font-semibold text-xl mb-6">
            {dateTime || `${getTodayDate()} Results`}
          </h2>

          <div className="space-y-6">
            {results.map((item, index) => (
              <section key={index}>
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

export default ResultBoard;
