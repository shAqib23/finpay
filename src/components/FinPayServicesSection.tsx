import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Galaxy from './Galaxy';

const exchangeCurrencies = [
  { code: "INR", name: "Indian Rupee" },
  { code: "AED", name: "UAE Dirham" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "NPR", name: "Nepalese Rupee" }
];

export default function FinPayServicesSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const bgX = useTransform(springX, [-0.5, 0.5], ["-2%", "2%"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["-2%", "2%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  return (
    <section 
      className="relative text-[#e8f0ee] py-32 md:py-48 selection:bg-[#00ff9d]/30 font-digital border-t border-[#00ff9d]/20 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      
      {/* 3D Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute w-[110%] h-[110%] -left-[5%] -top-[5%] bg-cover bg-center opacity-80"
          style={{ 
            backgroundImage: "url('/bg-3d.jpg')",
            x: bgX,
            y: bgY,
            scale: 1.05
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Galaxy Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.8}
          saturation={0}
          twinkleIntensity={0.8}
          transparent={true}
        />
      </div>
      <div className="absolute inset-0 scanline-overlay z-[5]"></div>
      
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 xl:px-16 relative z-10 flex flex-col gap-40 md:gap-52">
        
        {/* ========================================================= */}
        {/* 00 / SECTION HERO                                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center section-entrance">
          <div className="lg:col-span-7">
            <span className="font-digital text-[#00ff9d] text-[12px] uppercase tracking-[0.2em] font-bold block mb-8 terminal-text-glow">
              SERVICES
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[4rem] font-bold leading-[1.1] tracking-tight text-white mb-8 cyber-hero-glow">
              Financial Infrastructure for Cross-Border Payment Operations
            </h2>
            <p className="text-[1.1rem] md:text-[1.2rem] leading-[1.8] text-[#d8e2e0] max-w-[600px] mb-12 relative z-10">
              FinPay supports merchant collections, payment gateway onboarding, multi-currency USDT exchange, and business payment operations through a unified settlement infrastructure.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="font-digital text-[10px] uppercase tracking-[0.25em] text-[#00ff9d] bg-[#00ff9d]/5 border border-[#00ff9d]/30 px-5 py-2.5 hover:bg-[#00ff9d]/15 hover:shadow-[0_0_10px_rgba(0,255,157,0.3)] transition-all cursor-default terminal-text-glow flex items-center">
                <span className="w-2 h-2 bg-[#00ff9d] rounded-full blinking-cursor shadow-[0_0_5px_#00ff9d] mr-3"></span>
                HIGH-VOLUME SETTLEMENT | GATEWAY ENABLEMENT | MULTI-CURRENCY EXCHANGE
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN Diagram */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end py-10">
            <div className="relative w-full max-w-[340px] h-[340px] flex items-center justify-center">
              <div className="absolute inset-4 orbit-ring"></div>
              <svg className="w-full h-full overflow-visible absolute inset-0" viewBox="0 0 300 300">
                <defs>
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="brightGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Local Star Cluster */}
                <circle cx="30" cy="80" r="1" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" /></circle>
                <circle cx="280" cy="100" r="1.5" fill="#00d4ff" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" /></circle>
                <circle cx="220" cy="280" r="1" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.1;0.9;0.1" dur="5s" repeatCount="indefinite" /></circle>
                <circle cx="80" cy="240" r="1.5" fill="#00ff9d" opacity="0.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" /></circle>

                {/* Connecting Lines */}
                <path d="M 50 150 C 100 150, 150 50, 250 50" stroke="rgba(0,212,255,0.4)" strokeWidth="1" fill="none" />
                <path d="M 50 150 C 100 150, 150 250, 250 250" stroke="rgba(0,255,157,0.3)" strokeWidth="1" fill="none" />
                <path d="M 150 150 L 250 150" stroke="rgba(0,212,255,0.4)" strokeWidth="1" strokeDasharray="4 6" fill="none" />
                
                {/* Traveling Light Pulses */}
                <circle r="2.5" fill="#fff" filter="url(#brightGlow)">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M 50 150 C 100 150, 150 50, 250 50" />
                </circle>
                <circle r="2.5" fill="#fff" filter="url(#brightGlow)">
                  <animateMotion dur="4.2s" repeatCount="indefinite" path="M 50 150 C 100 150, 150 250, 250 250" />
                </circle>
                <circle r="2.5" fill="#fff" filter="url(#brightGlow)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 150 150 L 250 150" />
                </circle>

                {/* Nodes with pulsing outer rings */}
                {/* Node 1 */}
                <circle cx="50" cy="150" fill="none" stroke="#00d4ff" strokeWidth="1">
                  <animate attributeName="r" values="5; 15" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6; 0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="150" r="5" fill="#00d4ff" filter="url(#nodeGlow)" />
                
                {/* Node 2 */}
                <circle cx="150" cy="150" fill="none" stroke="#00ff9d" strokeWidth="1">
                  <animate attributeName="r" values="4; 12" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6; 0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="150" r="4" fill="#00ff9d" filter="url(#nodeGlow)" />
                
                {/* Node 3 */}
                <circle cx="250" cy="50" fill="none" stroke="#00d4ff" strokeWidth="1">
                  <animate attributeName="r" values="5; 15" dur="2.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6; 0" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="50" r="5" fill="#00d4ff" filter="url(#nodeGlow)" />
                
                {/* Node 4 */}
                <circle cx="250" cy="150" fill="none" stroke="#00d4ff" strokeWidth="1">
                  <animate attributeName="r" values="5; 15" dur="2.8s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6; 0" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="150" r="5" fill="#00d4ff" filter="url(#nodeGlow)" />
                
                {/* Node 5 */}
                <circle cx="250" cy="250" fill="none" stroke="#00ff9d" strokeWidth="1">
                  <animate attributeName="r" values="5; 15" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6; 0" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="250" r="5" fill="#00ff9d" filter="url(#nodeGlow)" />

                {/* Node Labels */}
                <text x="50" y="130" fill="#00d4ff" fontSize="10" fontFamily="monospace" textAnchor="middle" className="terminal-text-glow">GATEWAY</text>
                <text x="150" y="135" fill="#00ff9d" fontSize="10" fontFamily="monospace" textAnchor="middle" className="terminal-text-glow">MERCHANT_OPS</text>
                <text x="250" y="35" fill="#00d4ff" fontSize="10" fontFamily="monospace" textAnchor="middle" className="terminal-text-glow">FX_NODE</text>
                <text x="250" y="270" fill="#00ff9d" fontSize="10" fontFamily="monospace" textAnchor="middle" className="terminal-text-glow">SETTLEMENT</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full radar-divider"></div>

        {/* ========================================================= */}
        {/* 01 & 02 / DUAL SERVICE ROW                                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* SERVICE 01 */}
          <div className="relative section-entrance" style={{animationDelay: '100ms'}}>
            <div className="mb-10">
              <span className="font-digital text-[#00ff9d] text-[12px] uppercase tracking-[0.2em] font-bold block terminal-text-glow">
                01 / COLLECTION & SETTLEMENT
              </span>
              <div className="w-[50px] h-[1px] bg-[#00ff9d] mt-3 shadow-[0_0_5px_#00ff9d]"></div>
            </div>
            
            <h3 className="text-[2rem] md:text-[2.4rem] font-bold text-white leading-tight mb-6 cyber-headline-glow">
              Payment Collection & Settlement
            </h3>
            <p className="text-[1.1rem] leading-[1.7] text-[#d8e2e0] mb-10 max-w-[480px]">
              We help merchants collect payments and settle transactions securely using stable digital assets like USDT.
            </p>
            
            <div className="flex flex-col gap-3">
              {[
                "Real-time settlements",
                "Bulk payment processing",
                "Cross-border settlement support",
                "Stablecoin-based collection system",
                "Merchant settlement dashboard"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 terminal-row-panel feature-row-entrance group" style={{animationDelay: `${idx * 80 + 100}ms`}}>
                  <span className="font-digital text-[#00ff9d] font-bold tracking-widest text-[14px] group-hover:brightness-150 group-hover:drop-shadow-[0_0_8px_#00ff9d] transition-all">
                    {mounted ? "[✓]" : "[ ]"}
                  </span>
                  <span className="text-[0.95rem] text-[#d8e2e0]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SERVICE 02 */}
          <div className="flex flex-col lg:pl-12 lg:items-start relative section-entrance" style={{animationDelay: '200ms'}}>
            <div className="mb-10">
              <span className="font-digital text-[#00d4ff] text-[12px] uppercase tracking-[0.2em] font-bold block terminal-text-glow">
                02 / GATEWAY ONBOARDING
              </span>
              <div className="w-[50px] h-[1px] bg-[#00d4ff] mt-3 shadow-[0_0_5px_#00d4ff]"></div>
            </div>
            
            <h3 className="text-[2rem] md:text-[2.4rem] font-bold text-white leading-tight mb-6 cyber-headline-glow">
              Payment Gateway Onboarding
            </h3>
            <p className="text-[1.1rem] leading-[1.7] text-[#d8e2e0] mb-10 max-w-[480px]">
              End-to-end onboarding support for merchants requiring international payment gateway infrastructure and collection systems.
            </p>
            
            <div className="flex items-stretch gap-10 w-full max-w-[480px]">
              <div className="flex flex-col gap-3 flex-1">
                {[
                  "Merchant onboarding assistance",
                  "API integration support",
                  "Gateway consultation",
                  "High-volume merchant solutions",
                  "E-commerce payment setup"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 terminal-row-panel feature-row-entrance group" style={{animationDelay: `${idx * 80 + 200}ms`, borderLeftColor: 'rgba(0, 212, 255, 0.3)'}}>
                    <span className="font-digital text-[#00d4ff] font-bold text-lg group-hover:brightness-150 group-hover:drop-shadow-[0_0_8px_#00d4ff] transition-all">&gt;</span>
                    <span className="text-[0.95rem] text-[#d8e2e0]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Tiny Visual Diagram */}
              <div className="flex flex-col gap-8 pl-6 border-l border-[#00d4ff]/30 relative py-4">
                {["DISCOVER", "INTEGRATE", "GO LIVE"].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00d4ff] absolute -left-[4.5px] shadow-[0_0_8px_#00d4ff]"></div>
                    <span className="font-digital text-[10px] text-[#00d4ff] uppercase tracking-widest">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="w-full radar-divider"></div>

        {/* ========================================================= */}
        {/* 03 / MULTI-CURRENCY EXCHANGE                              */}
        {/* ========================================================= */}
        <div className="w-full relative py-12 px-6 md:px-12 rounded-[2rem] bg-[#050505]/40 backdrop-blur-md border border-[#ffffff10] shadow-[0_0_50px_rgba(0,0,0,0.8)] section-entrance" style={{animationDelay: '300ms'}}>
          <div className="relative z-10 flex flex-col items-center text-center">
            
            <div className="max-w-[700px] mb-14">
              <div className="flex flex-col items-center justify-center mb-10">
                <span className="font-digital text-[#00ff9d] text-[12px] uppercase tracking-[0.2em] font-bold block terminal-text-glow">
                  03 / MULTI-CURRENCY EXCHANGE
                </span>
                <div className="w-[50px] h-[1px] bg-[#00ff9d] mt-3 shadow-[0_0_5px_#00ff9d]"></div>
              </div>
              
              <h3 className="text-[2.2rem] md:text-[3rem] font-bold text-white leading-[1.1] mb-6 cyber-headline-glow">
                USDT Exchange Across Key Regional Corridors
              </h3>
              <p className="text-[1.1rem] leading-[1.7] text-[#d8e2e0] mx-auto">
                Exchange USDT into multiple international currencies with competitive rates and reliable processing.
              </p>
            </div>

            {/* Currency Chips Grid */}
            <div className="flex flex-wrap justify-center gap-5 max-w-[850px] breathing-grid">
              {exchangeCurrencies.map((c, i) => (
                <div 
                  key={i} 
                  className="currency-chip px-8 py-4 flex flex-col items-center justify-center gap-1.5 min-w-[130px]"
                  style={{animationDelay: `${-(Math.random() * 3).toFixed(2)}s`}}
                >
                  <span className="font-digital text-[#00ff9d] text-2xl font-bold tracking-wider terminal-text-glow">{c.code}</span>
                  <span className="font-digital text-[#8a9b97] text-[10px] uppercase tracking-widest">{c.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="w-full radar-divider"></div>

        {/* ========================================================= */}
        {/* 04 / BUSINESS SOLUTIONS                                   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center section-entrance" style={{animationDelay: '400ms'}}>
          
          <div className="lg:col-span-5 pl-6 md:pl-8 py-2">
            <div className="mb-10">
              <span className="font-digital text-[#00ff9d] text-[12px] uppercase tracking-[0.2em] font-bold block terminal-text-glow">
                04 / BUSINESS SOLUTIONS
              </span>
              <div className="w-[50px] h-[1px] bg-[#00ff9d] mt-3 shadow-[0_0_5px_#00ff9d]"></div>
            </div>
            
            <h3 className="text-[2rem] md:text-[2.4rem] font-bold text-white leading-tight mb-6 cyber-headline-glow">
              Operational Support for Cross-Border Businesses
            </h3>
            <p className="text-[1.1rem] leading-[1.7] text-[#d8e2e0]">
              Tailored financial infrastructure solutions for e-commerce businesses, digital merchants, international suppliers, and global payment operations.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {[
                "Merchant payment operations",
                "Supplier payout coordination",
                "International settlement workflows",
                "Cross-border payment infrastructure"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 terminal-row-panel feature-row-entrance group" style={{animationDelay: `${idx * 80 + 400}ms`}}>
                  <span className="font-digital text-[#00ff9d] font-bold text-lg group-hover:brightness-150 group-hover:drop-shadow-[0_0_8px_#00ff9d] transition-all">&gt;</span>
                  <span className="text-[0.95rem] text-[#e8f0ee] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}