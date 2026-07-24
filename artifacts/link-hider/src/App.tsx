import { useEffect, useState, MouseEvent } from "react";
import { Link2, Globe, Lock, Users, User, Copy, Check } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

function Stars() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s infinite ${star.delay}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

const MODES = [
  { id: "PRIVATE", icon: Lock, label: "PRIVATE" },
  { id: "ALL_SITE", icon: Globe, label: "ALL SITE" },
  { id: "GROUP", icon: Users, label: "GROUP" },
  { id: "PROFILE", icon: User, label: "PROFILE" },
];

export default function App() {
  const [url, setUrl] = useState("");
  const [maskedUrl, setMaskedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState("PRIVATE");
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const r = searchParams.get("r");
    if (r) {
      try {
        const decoded = atob(r);
        window.location.replace(decoded);
      } catch (e) {
        // invalid param, stay on page
      }
    }
  }, []);

  const handleGenerate = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    if (!url.trim()) return;
    try {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      const encoded = btoa(finalUrl);
      const fullUrlObj = new URL("https://linkurl.pk/");
      fullUrlObj.searchParams.set("r", encoded);
      setMaskedUrl(fullUrlObj.toString());
      setCopied(false);
    } catch (err) {
      console.error("Failed to process URL", err);
    }
  };

  const handleCopy = () => {
    if (!maskedUrl) return;
    navigator.clipboard.writeText(maskedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black text-white font-mono relative flex flex-col selection:bg-[#00c8d4] selection:text-black">
      <Stars />
      
      {/* Header */}
      <header className="w-full flex items-center justify-between p-6 z-10 relative">
        <h1 className="text-xl font-bold tracking-[0.2em]">GHOST BEAM</h1>
        <a 
          href="https://discord.gg/Hz5ybrSTM"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-[0_0_15px_rgba(88,101,242,0.3)] hover:shadow-[0_0_25px_rgba(88,101,242,0.6)]"
          aria-label="Join Discord"
        >
          <FaDiscord className="w-6 h-6 text-white" />
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 shadow-2xl relative group">
          {/* Subtle glow behind card */}
          <div className="absolute inset-0 bg-[#00c8d4]/5 blur-[80px] rounded-2xl pointer-events-none transition-opacity duration-1000 opacity-50 group-hover:opacity-100" />

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center mb-8 relative">
            <div className="w-14 h-14 bg-[#00c8d4]/10 border border-[#00c8d4]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,200,212,0.15)] transition-transform duration-500 group-hover:scale-110">
              <Link2 className="w-7 h-7 text-[#00c8d4]" />
            </div>
            <h2 className="text-2xl font-bold tracking-[0.1em] mb-2">HIDE YOUR LINKS</h2>
            <p className="text-[#888888] text-sm tracking-wide">SECURELY MASK YOUR DESTINATION URLS.</p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    isSelected 
                      ? "border-[#00c8d4]/50 bg-[#00c8d4]/10 shadow-[0_0_15px_rgba(0,200,212,0.2)] text-white" 
                      : "border-white/5 bg-white/5 text-[#888888] hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#00c8d4]" : ""}`} />
                  <span className="text-xs tracking-wider font-bold">{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="mb-6 relative">
            <label className="block text-xs font-bold tracking-widest text-[#888888] mb-3">DESTINATION LINK</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="PASTE LINK HERE..."
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#00c8d4]/50 focus:ring-1 focus:ring-[#00c8d4]/50 transition-all duration-300"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-transparent hover:border-[#00c8d4]/50 text-white py-4 rounded-xl font-bold tracking-[0.2em] transition-all duration-300 relative overflow-hidden group/btn mb-4 shadow-[0_0_0_rgba(0,200,212,0)] hover:shadow-[0_0_20px_rgba(0,200,212,0.2)]"
          >
            <span className="relative z-10">GENERATE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00c8d4]/10 to-transparent translate-x-[-100%] group-hover/btn:animate-[shimmer_2s_infinite]" />
            {ripples.map(r => (
              <span key={r.id} className="ripple-effect" style={{ left: r.x, top: r.y }} />
            ))}
          </button>

          {/* Result Area */}
          {maskedUrl && (
            <div className="animate-fade-in-up mt-6">
              <label className="block text-xs font-bold tracking-widest text-[#00c8d4] mb-3">MASKED LINK</label>
              <div className="flex bg-[#0a0a0a] border-l-2 border-l-[#00c8d4] border-y border-r border-white/10 rounded-r-xl rounded-l-sm overflow-hidden group/result hover:border-white/20 transition-colors">
                <div className="flex-1 px-4 py-3 text-sm truncate text-white/90 font-mono flex items-center">
                  {maskedUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-5 py-3 flex items-center justify-center transition-all duration-300 border-l border-white/10 ${
                    copied ? "bg-[#00c8d4]/20 text-[#00c8d4]" : "bg-[#111] text-[#888888] hover:bg-[#222] hover:text-white active:scale-95"
                  }`}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center z-10 relative">
        <p className="text-[10px] text-[#444] tracking-[0.3em] font-bold">MADE BY @VICTORLOPYS</p>
      </footer>
    </div>
  );
}