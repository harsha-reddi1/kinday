import Link from "next/link";
import { Shield, Sparkles, CheckCircle2, Calendar, FileText } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-800">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-stone-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 tracking-wide">
          <Shield className="w-3.5 h-3.5 text-stone-600" />
          <span>Single Product • Two Calm Modules</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-900">
          kin<span className="text-orange-600">Day</span>
        </h1>
        <p className="text-stone-600 text-lg leading-relaxed max-w-lg mx-auto">
          Turn school circulars into a reliable family plan, and give children an age-appropriate routine board.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-6 text-left">
          {/* Module A: Parent Hub Card */}
          <Link
            href="/dashboard"
            className="group p-6 bg-white rounded-2xl border border-stone-200/80 hover:border-orange-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Parent Hub</h2>
              <p className="text-sm text-stone-500 mb-4">
                Scan school circulars with AI, approve tasks, and manage family calendar.
              </p>
            </div>
            <span className="text-xs font-semibold text-orange-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Parent Hub &rarr;
            </span>
          </Link>

          {/* Module B: Kids Zone Card */}
          <Link
            href="/kids"
            className="group p-6 bg-amber-50/60 rounded-2xl border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-700 mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Kids Zone (My Day)</h2>
              <p className="text-sm text-stone-600 mb-4">
                Picture-first routine board with big buttons, star rewards, and tablet-optimized grid.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Kids View &rarr;
            </span>
          </Link>
        </div>

        <div className="pt-8 text-xs text-stone-400 flex items-center justify-center gap-4">
          <span>✓ Zero Ads & No Tracking</span>
          <span>•</span>
          <span>✓ COPPA & Families Compliant</span>
          <span>•</span>
          <span>✓ Tablet & Web Optimized</span>
        </div>
      </div>
    </main>
  );
}
