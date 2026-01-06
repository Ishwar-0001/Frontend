import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-300 mt-12 flex flex-col items-center text-center px-4 py-8">
      
      {/* Navigation Links */}
      <ul className="flex flex-wrap justify-center gap-4 text-[15px] font-semibold mb-4">
        <li><a href="#" className="text-purple-800 hover:text-blue-700 transition">HOME</a></li>
        <li>|</li>
        <li><a href="#" className="text-blue-700 hover:text-blue-900 transition">ABOUT</a></li>
        <li>|</li>
        <li><a href="#" className="text-blue-700 hover:text-blue-900 transition">CONTACT</a></li>
        <li>|</li>
        <li><a href="#" className="text-blue-700 hover:text-blue-900 transition">FAQ</a></li>
        <li>|</li>
        <li><a href="#" className="text-blue-700 hover:text-blue-900 transition">DISCLAIMER</a></li>
        <li>|</li>
        <li><a href="#" className="text-blue-700 hover:text-blue-900 transition">PRIVACY POLICY</a></li>
      </ul>

      {/* Divider Line */}
      <div className="w-3/4 max-w-175 border-t border-gray-300 my-4"></div>

      {/* Copyright */}
      <p className="text-[16px]">
        <span className="font-bold text-red-600">© 2024</span>
        <span className="font-bold text-purple-800 ml-1">MY WEBSITE</span>
      </p>


      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-6 bg-purple-800 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-purple-900 transition shadow-md"
      >
        ↑ Back to Top
      </button>

    </footer>
  ); 
}

export default Footer;
