import React from 'react'

function Navbar() {
  return (
    <nav className="w-full bg-black flex justify-center py-2">
      <div className="w-[95%] flex justify-between gap-2">
        
        <button className="w-1/3 bg-[#F5FFBD] text-red-600 font-bold text-center py-2 rounded-xl border border-black">
          HOME
        </button>
        
        <button className="w-1/3 bg-[#F5FFBD] text-red-600 font-bold text-center py-2 rounded-xl border border-black">
          SATTA KING
        </button>
        
        <button className="w-1/3 bg-[#F5FFBD] text-red-600 font-bold text-center py-2 rounded-xl border border-black">
          CHART
        </button>

      </div>
    </nav>
  )
}

export default Navbar
