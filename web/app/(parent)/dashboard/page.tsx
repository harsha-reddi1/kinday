"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  UploadCloud,
  ChevronRight,
  AlertCircle,
  Plus,
  ArrowRight,
  Check,
  X,
  ExternalLink
} from "lucide-react";

interface DraftEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: "school" | "activity" | "homework" | "fee";
  child: string;
  flagged?: string;
  confirmed: boolean;
}

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState<"circulars" | "calendar" | "approvals">("circulars");
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [draftEvents, setDraftEvents] = useState<DraftEvent[]>([
    {
      id: "e1",
      title: "Science Fair Project Due",
      date: "Dec 12, 2026",
      time: "09:00 AM",
      category: "school",
      child: "Leo (Grade 2)",
      confirmed: false,
    },
    {
      id: "e2",
      title: "Annual Sports Day Uniform Check",
      date: "Dec 15, 2026",
      time: "All Day",
      category: "activity",
      child: "Whole Family",
      flagged: "Missing exact assembly time from circular",
      confirmed: false,
    },
    {
      id: "e3",
      title: "Term 2 Activity Fee Deadline",
      date: "Dec 20, 2026",
      time: "05:00 PM",
      category: "fee",
      child: "Whole Family",
      confirmed: false,
    },
  ]);

  const handleSimulateAiUpload = () => {
    setIsProcessingAi(true);
    setTimeout(() => {
      setIsProcessingAi(false);
    }, 1200);
  };

  const handleConfirmEvent = (id: string) => {
    setDraftEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, confirmed: true } : e))
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            kin<span className="text-orange-600">Day</span> <span className="text-xs font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full ml-1">Parent Hub</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("circulars")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "circulars" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              School Circulars (AI)
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "calendar" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Calendar & Agenda
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "approvals" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Approvals (2)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/kids"
            className="flex items-center gap-1.5 text-xs font-bold bg-amber-100/80 hover:bg-amber-200 text-amber-900 px-3.5 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Switch to Kids Zone</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
            H
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeTab === "circulars" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-stone-900">School Circular AI Extraction</h1>
                <p className="text-sm text-stone-500">
                  Drop school notice images or PDFs. Gemini structures events, ready for your side-by-side review.
                </p>
              </div>
              <div className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 self-start">
                <CheckCircle className="w-4 h-4" />
                <span>Zero child data sent to AI model</span>
              </div>
            </div>

            {/* Side-by-Side Review Workspace (Hero Feature for Tablets & Desktop Web) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Upload & Original Document Viewer */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-stone-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Original Document</span>
                  </h2>
                  <span className="text-xs text-stone-400">PDF, JPG, PNG (Max 5 pages)</span>
                </div>

                {/* Drag-and-Drop Zone */}
                <div
                  onClick={handleSimulateAiUpload}
                  className="border-2 border-dashed border-stone-300 hover:border-orange-500 rounded-2xl p-8 text-center bg-stone-50 hover:bg-orange-50/20 cursor-pointer transition-all space-y-3"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center mx-auto text-orange-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      {isProcessingAi ? "Gemini is extracting events..." : "Drop school circular here, or click to browse"}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">Supports WhatsApp screenshots, scanned PDFs, or email notices</p>
                  </div>
                </div>

                {/* Sample Document Render Simulation */}
                <div className="bg-stone-100 rounded-2xl p-4 text-xs font-mono text-stone-600 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-800 border-b pb-1 text-sm">
                    ST. JUDE'S ACADEMY — WINTER TERM NOTICE (Page 1)
                  </div>
                  <p>1. Science Fair Exhibition is scheduled for Dec 12 at 09:00 AM.</p>
                  <p>2. Annual Sports Day Practice runs Dec 15 to 18. Wear house shirts.</p>
                  <p>3. Please submit the term fee before Dec 20.</p>
                </div>
              </div>

              {/* Right Column: AI Extracted Draft Events */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-stone-800">Extracted Events (Drafts)</h2>
                    <p className="text-xs text-stone-500">Suggested by AI. Review and confirm to add to family calendar.</p>
                  </div>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                    {draftEvents.filter((e) => !e.confirmed).length} pending
                  </span>
                </div>

                <div className="space-y-3">
                  {draftEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        evt.confirmed
                          ? "bg-emerald-50/60 border-emerald-200 opacity-80"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{evt.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                            <span className="font-medium">{evt.date}</span>
                            <span>•</span>
                            <span>{evt.time}</span>
                            <span>•</span>
                            <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-semibold">{evt.child}</span>
                          </div>
                        </div>

                        {evt.confirmed ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5" /> Added
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConfirmEvent(evt.id)}
                            className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl transition-all shadow-sm"
                          >
                            Confirm
                          </button>
                        )}
                      </div>

                      {evt.flagged && !evt.confirmed && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{evt.flagged}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Pending Routine Approvals</h2>
            <p className="text-xs text-stone-500">Approving credits stars to your child's ledger atomically.</p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Leo — Tidy Up Toys</h4>
                  <p className="text-xs text-stone-500">Completed at 07:15 PM • Reward: 1 Star</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl">
                    Reject
                  </button>
                  <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm">
                    Approve (+1 ★)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-stone-900">Family Calendar & Agenda</h2>
            <p className="text-xs text-stone-500">All school events, routine reminders, and milestones in one calm timeline.</p>
            <div className="border border-stone-100 rounded-2xl p-8 text-center text-stone-400 text-sm">
              Full interactive calendar grid view connected to Supabase table `calendar_events`.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
