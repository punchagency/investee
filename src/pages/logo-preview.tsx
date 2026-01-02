export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Investee Logo Concepts</h1>
        <p className="text-center text-slate-600 mb-12">Click to select your preferred logo style</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Option A: Line-art building with ascending steps */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradA" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Ascending step frames */}
                <rect x="4" y="32" width="10" height="12" rx="1" stroke="url(#gradA)" strokeWidth="2.5" fill="none"/>
                <rect x="16" y="24" width="10" height="20" rx="1" stroke="url(#gradA)" strokeWidth="2.5" fill="none"/>
                <rect x="28" y="16" width="10" height="28" rx="1" stroke="url(#gradA)" strokeWidth="2.5" fill="none"/>
                {/* Connecting ascending line */}
                <path d="M9 28L21 20L33 12" stroke="url(#gradA)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3"/>
                <circle cx="33" cy="12" r="3" fill="#22c55e"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">A: Ascending Steps</h3>
            <p className="text-sm text-slate-500 text-center">Line-art buildings as staircase to success</p>
          </div>

          {/* Option B: Abstract "I" lettermark with growth curve */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradB" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Stylized "I" that curves upward */}
                <path d="M12 8H24M12 40H24M18 8V28Q18 36 26 32T38 20" stroke="url(#gradB)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="38" cy="20" r="3" fill="#22c55e"/>
                {/* Subtle arrow at end */}
                <path d="M34 16L38 20L34 24" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">B: Growth Lettermark</h3>
            <p className="text-sm text-slate-500 text-center">Stylized "I" transforming into growth curve</p>
          </div>

          {/* Option C: Interconnected nodes/network */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradC" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Connection lines */}
                <path d="M10 36L18 26L30 30L40 14" stroke="url(#gradC)" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M18 26L26 18" stroke="url(#gradC)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
                <path d="M30 30L36 24" stroke="url(#gradC)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
                {/* Nodes */}
                <circle cx="10" cy="36" r="5" fill="#1e88e5"/>
                <circle cx="18" cy="26" r="5" fill="url(#gradC)"/>
                <circle cx="30" cy="30" r="5" fill="url(#gradC)"/>
                <circle cx="40" cy="14" r="6" fill="#22c55e"/>
                {/* Secondary nodes */}
                <circle cx="26" cy="18" r="3" fill="url(#gradC)" fillOpacity="0.5"/>
                <circle cx="36" cy="24" r="3" fill="url(#gradC)" fillOpacity="0.5"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">C: Connected Network</h3>
            <p className="text-sm text-slate-500 text-center">Nodes representing investors, properties, lenders</p>
          </div>

          {/* Option D: Rising bars with negative space */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradD" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Three ascending strokes */}
                <path d="M8 42V30" stroke="#1e88e5" strokeWidth="6" strokeLinecap="round"/>
                <path d="M20 42V20" stroke="url(#gradD)" strokeWidth="6" strokeLinecap="round"/>
                <path d="M32 42V10" stroke="#22c55e" strokeWidth="6" strokeLinecap="round"/>
                {/* Roof line connecting tops */}
                <path d="M8 30L20 20L32 10L42 6" stroke="url(#gradD)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="42" cy="6" r="3" fill="#22c55e"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">D: Rising Bars</h3>
            <p className="text-sm text-slate-500 text-center">Growth bars with building silhouette</p>
          </div>

          {/* Option E: Geometric arrow/mountain peak */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradE" x1="0%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Main chevron/peak */}
                <path d="M6 32L24 10L42 32" stroke="url(#gradE)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Inner accent line */}
                <path d="M14 28L24 16L34 28" stroke="url(#gradE)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.5"/>
                {/* Peak dot */}
                <circle cx="24" cy="10" r="4" fill="#22c55e"/>
                {/* Base line */}
                <path d="M4 40H44" stroke="url(#gradE)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">E: Peak Chevron</h3>
            <p className="text-sm text-slate-500 text-center">Minimal rooftop/growth arrow</p>
          </div>

          {/* Option F: Circular growth spiral */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradF" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Spiral growth path */}
                <path d="M24 40C24 40 12 36 12 28C12 20 20 18 24 18C28 18 34 20 34 26C34 30 30 32 28 32" stroke="url(#gradF)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                {/* Upward arrow from center */}
                <path d="M24 28V8" stroke="url(#gradF)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M18 14L24 8L30 14" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Base dot */}
                <circle cx="24" cy="40" r="3" fill="#1e88e5"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">F: Growth Spiral</h3>
            <p className="text-sm text-slate-500 text-center">Circular path with upward momentum</p>
          </div>

          {/* Option G: Abstract house outline with chart */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradG" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Simple house outline */}
                <path d="M8 22L24 8L40 22V40H8V22Z" stroke="url(#gradG)" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                {/* Mini chart inside */}
                <path d="M14 36L20 30L26 33L34 24" stroke="url(#gradG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="34" cy="24" r="2.5" fill="#22c55e"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">G: House + Chart</h3>
            <p className="text-sm text-slate-500 text-center">Clean house outline with growth line inside</p>
          </div>

          {/* Option H: Stacked coins/layers rising */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradH" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Stacked ellipses (coins) */}
                <ellipse cx="16" cy="38" rx="10" ry="4" stroke="#1e88e5" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="32" rx="10" ry="4" stroke="url(#gradH)" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="26" rx="10" ry="4" stroke="url(#gradH)" strokeWidth="2" fill="none"/>
                {/* Rising arrow */}
                <path d="M28 34L36 18L42 12" stroke="url(#gradH)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M36 12H42V18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">H: Stacked Growth</h3>
            <p className="text-sm text-slate-500 text-center">Investment layers with upward arrow</p>
          </div>

          {/* Option I: Doorway/portal with light */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center justify-center h-32 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-24 h-24">
                <defs>
                  <linearGradient id="gradI" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                  <linearGradient id="gradI2" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#1e88e5" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4"/>
                  </linearGradient>
                </defs>
                {/* Door frame */}
                <path d="M12 44V12C12 8 16 6 24 6C32 6 36 8 36 12V44" stroke="url(#gradI)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                {/* Inner glow/gradient fill */}
                <path d="M16 44V14C16 11 19 9 24 9C29 9 32 11 32 14V44" fill="url(#gradI2)"/>
                {/* Keyhole or center element */}
                <circle cx="24" cy="28" r="3" fill="url(#gradI)"/>
                <path d="M24 31V38" stroke="url(#gradI)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">I: Opportunity Door</h3>
            <p className="text-sm text-slate-500 text-center">Gateway to investment opportunities</p>
          </div>

        </div>

        <p className="text-center text-slate-400 mt-12">Visit http://localhost:5001/logo-preview to see this page</p>
      </div>
    </div>
  );
}
