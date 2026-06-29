import { useEffect, useState, useRef } from 'react';
import { useScroll, useSpring, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import FinPayServicesSection from './components/FinPayServicesSection';

const FRAME_COUNT = 192;

export default function App() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [globeImages, setGlobeImages] = useState<HTMLImageElement[]>([]);
  
  // Timer state for final UI reveal
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [showFinalUI, setShowFinalUI] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const endSectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Mappings for total document height
  const rawFrameIndex1 = useTransform(scrollYProgress, [0, 0.35], [1, FRAME_COUNT]);
  const smoothFrameIndex1 = useSpring(rawFrameIndex1, { stiffness: 400, damping: 40, restDelta: 0.5 });
  
  const rawFrameIndex2 = useTransform(scrollYProgress, [0.35, 0.65], [1, FRAME_COUNT]);
  const smoothFrameIndex2 = useSpring(rawFrameIndex2, { stiffness: 400, damping: 40, restDelta: 0.5 });

  const seq1Opacity = useTransform(scrollYProgress, [0.3, 0.35], [1, 0]);
  const seq2Opacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let loaded = 0;
    const totalToLoad = FRAME_COUNT * 2;
    const seq1: HTMLImageElement[] = [];
    const seq2: HTMLImageElement[] = [];

    const handleLoad = () => {
      loaded++;
      setLoadedCount(loaded);
      if (loaded === totalToLoad) {
        setImages(seq1);
        setGlobeImages(seq2);
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        requestAnimationFrame(() => renderCanvas(progress, seq1, seq2));
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img1 = new Image();
      img1.src = `/sequence/frame_${String(i).padStart(6, '0')}.webp`;
      img1.decode().then(handleLoad).catch(handleLoad);
      seq1.push(img1);

      const img2 = new Image();
      img2.src = `/globe-sequence/frame_${String(i).padStart(3, '0')}.webp`;
      img2.decode().then(handleLoad).catch(handleLoad);
      seq2.push(img2);
    }
  }, []);

  function renderCanvas(progress: number, arr1 = images, arr2 = globeImages) {
    if (!canvasRef.current || arr1.length === 0 || arr2.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let f1 = Math.round(smoothFrameIndex1.get()) - 1;
    let f2 = Math.round(smoothFrameIndex2.get()) - 1;
    
    // Safety fallback
    if (f1 < 0) f1 = progress <= 0.35 ? Math.round((progress / 0.35) * (FRAME_COUNT - 1)) : FRAME_COUNT - 1;
    if (f2 < 0) {
      if (progress >= 0.4 && progress <= 0.8) f2 = Math.round(((progress - 0.4) / 0.4) * (FRAME_COUNT - 1));
      else if (progress > 0.8) f2 = FRAME_COUNT - 1;
      else f2 = 0;
    }

    f1 = Math.min(Math.max(f1, 0), FRAME_COUNT - 1);
    f2 = Math.min(Math.max(f2, 0), FRAME_COUNT - 1);

    const alpha1 = progress > 0.4 ? 0 : (progress < 0.35 ? 1 : seq1Opacity.get());
    const alpha2 = progress < 0.35 ? 0 : (progress > 0.4 ? 1 : seq2Opacity.get());

    const img1 = arr1[0];
    if (img1 && canvas.width !== img1.width) {
      canvas.width = img1.width;
      canvas.height = img1.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (alpha1 > 0 && arr1[f1]) {
      ctx.globalAlpha = alpha1;
      ctx.drawImage(arr1[f1], 0, 0, canvas.width, canvas.height);
    }

    if (alpha2 > 0 && arr2[f2]) {
      ctx.globalAlpha = alpha2;
      ctx.drawImage(arr2[f2], 0, 0, canvas.width, canvas.height);
    }
    ctx.globalAlpha = 1.0;
  };

  useMotionValueEvent(smoothFrameIndex1, "change", () => renderCanvas(scrollYProgress.get()));
  useMotionValueEvent(smoothFrameIndex2, "change", () => renderCanvas(scrollYProgress.get()));
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    renderCanvas(latest);
    if (latest >= 0.7 && !hasReachedEnd) {
      setHasReachedEnd(true);
    } else if (latest < 0.7 && hasReachedEnd) {
      setHasReachedEnd(false);
      setShowFinalUI(false);
    }
  });

  // Handle 1-second pause before revealing UI
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (hasReachedEnd && !showFinalUI) {
      timer = setTimeout(() => {
        setShowFinalUI(true);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [hasReachedEnd, showFinalUI]);

  // Section 01
  const s1Opacity = useTransform(scrollYProgress, [0, 0.015, 0.045, 0.06], [0, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0, 0.015, 0.045, 0.06], [24, 0, 0, -24]);

  // Section 02
  const s2Opacity = useTransform(scrollYProgress, [0.06, 0.075, 0.12, 0.135], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.06, 0.075, 0.12, 0.135], [24, 0, 0, -24]);
  const s2Stat1Op = useTransform(scrollYProgress, [0.065, 0.08, 0.12, 0.135], [0, 1, 1, 0]);
  const s2Stat1Y = useTransform(scrollYProgress, [0.065, 0.08, 0.12, 0.135], [24, 0, 0, -24]);
  const s2Stat2Op = useTransform(scrollYProgress, [0.07, 0.085, 0.12, 0.135], [0, 1, 1, 0]);
  const s2Stat2Y = useTransform(scrollYProgress, [0.07, 0.085, 0.12, 0.135], [24, 0, 0, -24]);
  const s2Stat3Op = useTransform(scrollYProgress, [0.075, 0.09, 0.12, 0.135], [0, 1, 1, 0]);
  const s2Stat3Y = useTransform(scrollYProgress, [0.075, 0.09, 0.12, 0.135], [24, 0, 0, -24]);

  // Section 03
  const s3Opacity = useTransform(scrollYProgress, [0.135, 0.15, 0.2, 0.21], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.135, 0.15, 0.2, 0.21], [24, 0, 0, -24]);
  const s3LineHeight = useTransform(scrollYProgress, [0.135, 0.165, 0.2, 0.21], [0, 120, 120, 0]);

  // Section 04
  const s4Opacity = useTransform(scrollYProgress, [0.21, 0.225, 0.26, 0.27], [0, 1, 1, 0]);
  const s4Y = useTransform(scrollYProgress, [0.21, 0.225, 0.26, 0.27], [24, 0, 0, -24]);

  const { scrollYProgress: endScrollProgress } = useScroll({
    target: endSectionRef,
    offset: ["start end", "start start"]
  });
  
  const sceneY = useTransform(endScrollProgress, [0, 1], ["0vh", "-100vh"]);

  const nodes = [
    { code: 'AED', cx: '50%', cy: '0%' },        // 12:00
    { code: 'CNY', cx: '85.35%', cy: '14.65%' }, // 1:30
    { code: 'JPY', cx: '100%', cy: '50%' },      // 3:00
    { code: 'IDR', cx: '85.35%', cy: '85.35%' }, // 4:30
    { code: 'MYR', cx: '50%', cy: '100%' },      // 6:00
    { code: 'BDT', cx: '14.65%', cy: '85.35%' }, // 7:30
    { code: 'NPR', cx: '0%', cy: '50%' },        // 9:00
    { code: 'INR', cx: '14.65%', cy: '14.65%' }  // 10:30
  ];

  return (
    <>
      {/* Loading Overlay */}
      {loadedCount < FRAME_COUNT * 2 && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center overflow-hidden touch-none">
          <div className="loader-container">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">INITIALIZING EXPERIENCE</h1>
            <div className="text-xl text-zinc-400">Loading High-Fidelity Assets... {Math.round((loadedCount / (FRAME_COUNT * 2)) * 100)}%</div>
            <div className="loader-bar-bg">
              <div className="loader-bar-fill" style={{ width: `${(loadedCount / (FRAME_COUNT * 2)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Experience */}
      <div className="bg-[#050505] text-white w-full">
      
      {/* SCROLL-OUT WRAPPER: Moves up perfectly when the end section comes into view */}
      <motion.div style={{ y: sceneY }} className="fixed inset-0 w-full h-screen z-10 pointer-events-none">
        
        {/* Permanent Top Left Logo */}
        <div className="absolute top-6 left-6 z-50 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
          <img src="/logo.png" alt="Finpay Logo" style={{ width: '80px', height: 'auto', opacity: 0.95 }} />
        </div>

        {/* Canvas Background (Globe) */}
        <div className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${showFinalUI ? 'float-globe' : ''}`}>
          <canvas ref={canvasRef} className="w-full h-full object-cover block" />
        </div>

        {/* SECTION 01 */}
        <motion.div 
          className="absolute top-[10vh] left-[4vw] max-w-[600px] z-20 pointer-events-none"
          style={{ opacity: s1Opacity, y: s1Y }}
        >
          <motion.h1 className="shiny-text font-[800] text-[clamp(4rem,7vw,9rem)] leading-[0.9] tracking-[-0.06em] max-w-[800px]">
            THE NEW STANDARD<br />FOR DIGITAL PAYMENTS
          </motion.h1>
          <motion.p className="mt-6 max-w-[480px] text-[1.1rem] leading-[1.6] text-white/65 tracking-[-0.02em]">
            Built for businesses, designed for growth, and engineered for the future of financial connectivity.
          </motion.p>
          <div className="mt-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium tracking-wide">
            [ FINPAY ECOSYSTEM ]
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[5vh] right-[4vw] w-[280px] p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 z-20 pointer-events-none"
          style={{ opacity: s1Opacity, y: s1Y }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00E6A7] animate-pulse"></div>
            <span className="text-sm font-medium text-white/70">Transactions</span>
          </div>
          <div className="text-lg font-semibold text-white/95">24/7 Processing</div>
        </motion.div>

        {/* SECTION 02 */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 right-[4vw] max-w-[500px] z-20 pointer-events-none"
          style={{ opacity: s2Opacity, y: s2Y }}
        >
          <motion.h2 className="shiny-text font-[800] text-[clamp(3.5rem,6vw,7rem)] leading-[0.9] tracking-[-0.06em]">
            MOVE MONEY<br />AT THE SPEED<br />OF MODERN BUSINESS
          </motion.h2>
          <motion.p className="mt-6 text-[1.1rem] text-white/65 max-w-[400px]">
            Whether local or global, every transaction flows through a secure and intelligent payment infrastructure.
          </motion.p>
          <div className="mt-12 flex flex-col gap-6">
            <motion.div style={{ opacity: s2Stat1Op, y: s2Stat1Y }} className="flex gap-4 items-baseline">
              <span className="font-numbers text-[#00E6A7] font-bold text-xl">01</span>
              <span className="text-xl font-medium text-white/90">Instant Processing</span>
            </motion.div>
            <motion.div style={{ opacity: s2Stat2Op, y: s2Stat2Y }} className="flex gap-4 items-baseline">
              <span className="font-numbers text-[#00E6A7] font-bold text-xl">02</span>
              <span className="text-xl font-medium text-white/90">Enterprise Security</span>
            </motion.div>
            <motion.div style={{ opacity: s2Stat3Op, y: s2Stat3Y }} className="flex gap-4 items-baseline">
              <span className="font-numbers text-[#00E6A7] font-bold text-xl">03</span>
              <span className="text-xl font-medium text-white/90">Global Reach</span>
            </motion.div>
          </div>
        </motion.div>

        {/* SECTION 03 */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 left-[4vw] max-w-[600px] z-20 flex gap-8 items-start pointer-events-none"
          style={{ opacity: s3Opacity, y: s3Y }}
        >
          <motion.div className="w-[2px] bg-[#00E6A7]/40 rounded-full mt-2" style={{ height: s3LineHeight }} />
          <div>
            <motion.h2 className="shiny-text font-[800] text-[clamp(4rem,7vw,8rem)] leading-[0.9] tracking-[-0.06em]">
              FROM A SINGLE<br />TRANSACTION<br />TO A GLOBAL NETWORK
            </motion.h2>
            <motion.p className="mt-6 text-[1.2rem] text-white/65 max-w-[480px]">
              Every payment becomes part of a larger financial ecosystem connecting people, businesses, and opportunities.
            </motion.p>
          </div>
        </motion.div>

        {/* SECTION 04 */}
        <motion.div 
          className="absolute top-[15vh] right-[4vw] max-w-[600px] text-right z-20 pointer-events-none"
          style={{ opacity: s4Opacity, y: s4Y }}
        >
          <motion.h2 className="shiny-text font-[900] text-[clamp(4rem,7vw,9rem)] leading-[0.9] tracking-[-0.06em]">
            CONNECTED<br />WITHOUT BORDERS
          </motion.h2>
          <motion.p className="mt-6 text-[1.2rem] text-white/65 max-w-[480px] ml-auto">
            A unified infrastructure enabling secure financial interactions across markets, industries, and regions.
          </motion.p>
        </motion.div>

        <motion.div className="absolute top-[20vh] left-[4vw] z-20 pointer-events-none" style={{ opacity: s4Opacity, y: s4Y }}>
          <div className="shiny-text font-numbers text-4xl font-[700] mb-2">150+</div>
          <div className="text-white/70 text-sm tracking-wide uppercase">Countries Connected</div>
        </motion.div>
        
        <motion.div className="absolute bottom-[10vh] left-[4vw] z-20 pointer-events-none" style={{ opacity: s4Opacity, y: s4Y }}>
          <div className="shiny-text font-numbers text-4xl font-[700] mb-2">Millions</div>
          <div className="text-white/70 text-sm tracking-wide uppercase">Transactions Enabled</div>
        </motion.div>
        
        <motion.div className="absolute bottom-[15vh] right-[4vw] z-20 text-right pointer-events-none" style={{ opacity: s4Opacity, y: s4Y }}>
          <div className="shiny-text font-numbers text-4xl font-[700] mb-2">24/7</div>
          <div className="text-white/70 text-sm tracking-wide uppercase">Always Active</div>
        </motion.div>

        {/* FINAL SERVICES SECTION - Headline Layer */}
        <div className={`absolute inset-0 w-full h-full z-30 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none ${showFinalUI ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top Title strictly positioned */}
          <div className="absolute top-[3vh] md:top-[5vh] left-[50%] -translate-x-[50%] w-full max-w-[900px] text-center px-4 pointer-events-auto">
            <h2 className="font-['Outfit'] font-[700] text-[clamp(1.8rem,3vw,3rem)] text-white leading-tight tracking-tight">
              Global USDT Exchange Services
            </h2>
            <p className="mt-3 text-[rgba(255,255,255,0.65)] text-[1.05rem] font-['Sora'] leading-relaxed">
              Fast and reliable USDT exchange services with competitive market pricing and high-volume liquidity support.
            </p>
          </div>
        </div>

        {/* FINAL SERVICES SECTION - Orbit System Layer */}
        <div className={`absolute inset-0 w-full h-full z-30 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none ${showFinalUI ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[100vw] h-[100vw] max-w-[700px] max-h-[700px] md:w-[700px] md:h-[700px]">
            <div className="orbit-container w-full h-full">
              {/* SVG Connection Lines */}
              <svg className="absolute inset-0 w-full h-full">
                {nodes.map((n, idx) => (
                  <line 
                    key={`line-${idx}`}
                    x1="50%" y1="50%" 
                    x2={n.cx} y2={n.cy} 
                    stroke="rgba(0,230,167,0.25)" 
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    className="orbit-line-anim"
                  />
                ))}
              </svg>
              
              {/* Orbiting Nodes */}
              {nodes.map((n, idx) => (
                <div 
                  key={`node-${idx}`} 
                  className="orbit-node pointer-events-auto"
                  style={{ top: n.cy, left: n.cx }}
                >
                  <span className="font-['Space_Grotesk'] font-[700] text-[#00E6A7] text-[1.1rem] md:text-[1.2rem] tracking-widest">{n.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settlement Currencies TEXT LAYER - Positioned to the left of the globe */}
        <div className={`absolute top-1/2 -translate-y-1/2 left-[4vw] xl:left-[8vw] z-30 w-[300px] xl:w-[350px] pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${showFinalUI ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="font-['Outfit'] font-[800] text-[clamp(1.5rem,2vw,2rem)] text-white mb-4 tracking-tight leading-tight">
            Direct Settlements
          </h3>
          <div className="flex flex-col gap-3.5">
            {['USDT to INR', 'USDT to AED', 'USDT to MYR', 'USDT to CNY', 'USDT to BDT', 'USDT to JPY', 'USDT to NPR', 'USDT to IDR', 'Gulf currency settlements'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="shiny-text font-['Space_Grotesk'] font-[600] text-[1rem] uppercase tracking-wide">• {item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Built For High-Volume... TEXT LAYER - Positioned to the right of the globe */}
        <div className={`absolute top-1/2 -translate-y-1/2 right-[4vw] xl:right-[8vw] z-30 w-[300px] xl:w-[350px] pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${showFinalUI ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="font-['Outfit'] font-[800] text-[clamp(1.5rem,2vw,2rem)] text-white mb-3 tracking-tight leading-tight">
            Built For High-Volume Digital Asset Exchange
          </h3>
          <p className="text-[rgba(255,255,255,0.55)] text-[0.95rem] mb-8 leading-relaxed">
            Secure, reliable, and efficient USDT conversion services designed for traders, businesses, brokers, and liquidity partners.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E6A7]"></div>
              <div className="text-white/80 font-['Space_Grotesk'] font-[500] text-[0.85rem] uppercase tracking-wider">Competitive Market Pricing</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E6A7]"></div>
              <div className="text-white/80 font-['Space_Grotesk'] font-[500] text-[0.85rem] uppercase tracking-wider">Deep Liquidity Access</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E6A7]"></div>
              <div className="text-white/80 font-['Space_Grotesk'] font-[500] text-[0.85rem] uppercase tracking-wider">Fast Settlement</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E6A7]"></div>
              <div className="text-white/80 font-['Space_Grotesk'] font-[500] text-[0.85rem] uppercase tracking-wider">Secure Operations</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DUMMY SCROLL TRACK for the 3D Animation */}
      <div className="relative z-0 h-[1300vh] pointer-events-none"></div>      {/* ADDITIONAL SERVICES SECTION */}
      <div ref={endSectionRef} className="relative z-20 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <FinPayServicesSection />
      </div>
    </div>
    </>
  );
}

