import React from "react";

function ResultsTable() {
  // Data exactly as per the image
  const data = [
    { place: "FOOTPATH", time: "(01:00 AM)", last: "99", today: "56" },
    { place: "DESAWER", time: "(05:00 AM)", last: "29", today: "53" },
    { place: "KALYUG", time: "(02:20 PM)", last: "22", today: "49" },
    { place: "BOMBAY CITY", time: "(02:30 PM)", last: "87", today: "13" },
    { place: "DELHI BAZAR", time: "(03:00 PM)", last: "79", today: "69" },
    { place: "SHREE GANESH", time: "(04:30 PM)", last: "21", today: "62" },
    { place: "FARIDABAD", time: "(06:00 PM)", last: "75", today: "--" },
    { place: "GHAZIABAD", time: "(08:30 PM)", last: "55", today: "--" },
    { place: "NOIDA CITY", time: "(10:30 PM)", last: "12", today: "--" },
    { place: "GALI", time: "(11:30 PM)", last: "53", today: "--" },
  ];

  const mid = Math.ceil(data.length / 2);
  const left = data.slice(0, mid);
  const right = data.slice(mid);

  // ⭐ THE "PERFECT" ARROW BADGE
  // Technique: We layer two arrows.
  // 1. A larger Yellow one (acts as the border).
  // 2. A smaller Red one (acts as the fill) positioned absolutely on top.
  const ArrowBadge = () => {
    // Configuration for the arrow size
    const height = 18;
    const border = 2; // Thickness of the yellow border

    // Math for the CSS triangles
    const outerHalf = height / 2;
    const innerHalf = (height - border * 2) / 2;

    return (
      <div className="relative flex items-center mx-1" style={{ height: `${height}px` }}>
        
        {/* --- LAYER 1: BACKGROUND (Yellow Border) --- */}
        <div className="flex items-center">
          {/* Rect */}
          <div className="bg-yellow-300 h-full pl-2 pr-1 rounded-l-sm flex items-center">
            {/* Invisible text to prop open the width */}
            <span className="text-[10px] font-bold opacity-0 font-sans tracking-tighter">NEW</span>
          </div>
          {/* Triangle Tip */}
          <div
            className="w-0 h-0 border-t-transparent border-b-transparent border-l-yellow-300"
            style={{
              borderTopWidth: `${outerHalf}px`,
              borderBottomWidth: `${outerHalf}px`,
              borderLeftWidth: `${outerHalf}px`,
            }}
          ></div>
        </div>

        {/* --- LAYER 2: FOREGROUND (Red Fill) --- */}
        <div
          className="absolute flex items-center z-10"
          style={{ top: `${border}px`, left: `${border}px` }}
        >
          {/* Rect */}
          <div className="bg-[#d00000] h-full pl-1 pr-0.5 flex items-center justify-center rounded-l-sm">
            <span className="text-yellow-300 text-[10px] font-bold leading-none font-sans tracking-tighter">
              NEW
            </span>
          </div>
          {/* Triangle Tip */}
          <div
            className="w-0 h-0 border-t-transparent border-b-transparent border-l-[#d00000]"
            style={{
              borderTopWidth: `${innerHalf}px`,
              borderBottomWidth: `${innerHalf}px`,
              borderLeftWidth: `${innerHalf}px`,
            }}
          ></div>
        </div>

      </div>
    );
  };

  // Component for a single table row
  const RowItem = ({ row }) => (
    <div className="py-4 min-h-[110px] flex flex-col items-center justify-center border-b border-black last:border-b-0 w-full">
      <h2 className="text-white font-bold uppercase text-[15px] tracking-wide font-serif">{row.place}</h2>
      <h3 className="text-yellow-300 font-bold text-[13px] mb-1 font-serif">{row.time}</h3>

      <div className="flex items-center justify-center gap-4 w-full px-2 mt-1">
        {/* LAST Section */}
        <div className="flex flex-col items-center">
          <span className="text-white text-[12px] mb-0.5 leading-none font-serif">Last</span>
          <div className="bg-white min-w-[36px] h-[22px] rounded-[10px] flex items-center justify-center px-1 shadow-sm">
            <span className="text-[#d00000] font-bold text-[15px] leading-none font-serif">{row.last}</span>
          </div>
        </div>

        {/* ARROW Badge (Centered between them) */}
        <div className="pt-3">
          <ArrowBadge />
        </div>

        {/* TODAY Section */}
        <div className="flex flex-col items-center">
          <span className="text-white text-[12px] mb-0.5 leading-none font-serif">Today</span>
          <div className="bg-white min-w-[36px] h-[22px] rounded-[10px] flex items-center justify-center px-1 shadow-sm">
            <span className="text-[#d00000] font-bold text-[15px] leading-none font-serif">{row.today}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#002800] py-8 font-serif">
      <div className="max-w-4xl mx-auto border-2 border-black bg-[#002800]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">
          
          {/* Left Column */}
          <div className="flex flex-col">
            {left.map((row, i) => <RowItem key={i} row={row} />)}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {right.map((row, i) => <RowItem key={i} row={row} />)}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResultsTable;