import React from 'react';

export default function Logo({ size = "md" }) {
  const dimensions = size === "lg" ? "w-16 h-16 text-3xl" : "w-10 h-10 text-xl";
  
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* App Icon Mark */}
      <div className={`${dimensions} bg-gradient-to-br from-orange-500 to-orange-600 text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-400 tracking-tighter`}>
        H
      </div>
      {/* Brand Name Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-xl font-black text-slate-900 tracking-tight">HNC</span>
          <span className="text-xl font-black text-orange-500 tracking-tight">Hub</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Marketplace</span>
      </div>
    </div>
  );
}
