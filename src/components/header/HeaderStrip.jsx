import React from 'react'

function HeaderStrip() {
  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-scroll {
            display: inline-block;
            animation: scroll 18s linear infinite;
            white-space: nowrap;
          }
        `}
      </style>

      <div className="bg-black text-white text-sm py-2 border-b-4 border-dotted border-red-600 overflow-hidden">
        <h1 className="animate-scroll">
          Satta king, Sattaking, Satta king, Satta result, Satta king result, Satta king live,
          Satta king online, Desawar result, Gali result, Faridabad result, Gaziyabad result,
          Satta king chart, Desawar record chart, Gali record chart, Faridabad record chart,
          Gaziyabad record chart
        </h1>
      </div>
    </>
  )
}

export default HeaderStrip
