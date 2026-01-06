import React from 'react'

function HighlightBanner() {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[95%] bg-[#F5FFBD] rounded-full border-[3px] border-dotted border-red-600 px-4 py-2 text-center">

        {/* FIRST LINE */}
        <p className="text-black font-semibold text-sm tracking-wide">
          SATTA KING, SATTAKING, SATTA RESULT
        </p>

        {/* SECOND LINE */}
        <p className="text-red-600 font-bold text-xl tracking-wider mt-1">
          SATTA KING
        </p>

      </div>
    </div>
  )
}

export default HighlightBanner
 