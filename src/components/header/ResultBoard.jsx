import React from 'react'

function ResultBoard() {
  return (
    <div className="w-full flex justify-center my-10">
      <div className="w-[95%] rounded-3xl border-[3px] border-white p-1 bg-black relative">

        {/* top dotted line */}
        <div className="w-full h-1.5 bg-transparent border-t-4 border-dotted border-red-600 rounded-t-3xl"></div>

        {/* inner container */}
        <div className="rounded-3xl border-[3px] border-white p-10 text-center bg-[radial-gradient(circle,#7a0000,#1a0000,black)]">

          {/* Date Time */}
          <h2 className="text-yellow-300 font-semibold text-xl mb-6 tracking-wide">
            December 29, 2025 05:52 PM
          </h2>

          {/* Result Sections */}
          <div className="space-y-6">

            <section>
              <h3 className="text-3xl font-extrabold text-white tracking-wider">SHREE GANESH</h3>
              <p className="text-yellow-300 text-5xl font-bold mt-1">62</p>
            </section>

            <section>
              <h3 className="text-3xl font-extrabold text-white tracking-wider">DELHI BAZAR</h3>
              <p className="text-yellow-300 text-5xl font-bold mt-1">69</p>
            </section>

            <section>
              <h3 className="text-3xl font-extrabold text-white tracking-wider">KALYUG</h3>
              <p className="text-yellow-300 text-5xl font-bold mt-1">49</p>
            </section>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ResultBoard
