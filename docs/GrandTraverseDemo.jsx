import { useState, useEffect, useRef, useCallback } from "react";

const ANTHROPIC_SYSTEM_PROMPT = `You are the AI Project Advisor for Grand Traverse Home Co., a premium home renovation contractor in the Grand Traverse region of Michigan. Your name is simply "Project Advisor."

Your job is to help homeowners plan their renovation project. You are warm, knowledgeable, and genuinely helpful. You speak like an experienced contractor who actually cares — not a salesperson.

CRITICAL RULES:
1. Be conversational and human. Short paragraphs. No walls of text.
2. Ask ONE question at a time to gather info naturally.
3. Educate the homeowner — explain what things cost and why, what the process looks like, what surprises to expect.
4. Extract these data points conversationally (don't ask them all at once):
   - Room/area dimensions or approximate square footage
   - Current condition of the space
   - What they want changed (specific features, materials, style)
   - Budget range or comfort level
   - Timeline preferences
   - Any concerns or past bad experiences
   - Whether permits might be needed
5. After 4-6 exchanges, tell them you have enough to build their project plan and ask if they're ready to see it.
6. When they say yes, respond with EXACTLY this format (the app parses this):

---SOLUTION_SCHEDULE---
{
  "project_title": "Kitchen Renovation — Full Remodel",
  "estimated_range": "$28,000 – $38,000",
  "estimated_duration": "6–8 weeks",
  "phases": [
    {"name": "Phase name", "duration": "X days/weeks", "description": "What happens", "cost_range": "$X – $Y"},
  ],
  "key_decisions": ["Decision 1 the homeowner needs to make", "Decision 2"],
  "risk_flags": ["Any concerns or things to watch for"],
  "next_steps": ["Step 1", "Step 2", "Step 3"]
}
---END_SCHEDULE---

Make the plan realistic, detailed, and genuinely useful. This is the product — the plan itself sells the service.

The homeowner selected: PROJECT_TYPE = {projectType}, SCOPE = {scope}, TIMELINE = {timeline}`;

// ─── FONTS (loaded via link tags in the HTML) ───
// Yeseva One for display, Outfit for everything else

export default function GrandTraverseHomeCo() {
  const [currentView, setCurrentView] = useState("marketing"); // marketing | intake | chat | plan | portal
  const [scrollY, setScrollY] = useState(0);
  const [intakeStep, setIntakeStep] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "", projectType: "", scope: "", timeline: "" });
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [solutionSchedule, setSolutionSchedule] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [headerSolid, setHeaderSolid] = useState(false);
  const chatEndRef = useRef(null);
  const sectionRefs = useRef({});

  // Scroll tracking
  useEffect(() => {
    if (currentView !== "marketing") return;
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setHeaderSolid(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  // Intersection observer for scroll reveals
  useEffect(() => {
    if (currentView !== "marketing") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [currentView]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const registerSection = useCallback((id) => (el) => { sectionRefs.current[id] = el; }, []);
  const isVisible = (id) => visibleSections.has(id);

  // ─── AI CHAT ───
  const sendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const systemPrompt = ANTHROPIC_SYSTEM_PROMPT
        .replace("{projectType}", userData.projectType)
        .replace("{scope}", userData.scope)
        .replace("{timeline}", userData.timeline);

      const allMessages = [...messages, { role: "user", content: userMsg }].map(m => ({
        role: m.role, content: m.content
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: allMessages,
        }),
      });

      const data = await response.json();
      const assistantText = data.content?.[0]?.text || "I'd love to help — could you tell me more about what you're envisioning?";

      // Check for solution schedule
      if (assistantText.includes("---SOLUTION_SCHEDULE---")) {
        const jsonStr = assistantText.split("---SOLUTION_SCHEDULE---")[1].split("---END_SCHEDULE---")[0].trim();
        try {
          const plan = JSON.parse(jsonStr);
          setSolutionSchedule(plan);
          const cleanMsg = assistantText.split("---SOLUTION_SCHEDULE---")[0].trim();
          if (cleanMsg) setMessages((prev) => [...prev, { role: "assistant", content: cleanMsg }]);
          setTimeout(() => setCurrentView("plan"), 1500);
        } catch { setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]); }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Let me think about that... Could you tell me a bit more about the space you're working with?" }]);
    }
    setIsTyping(false);
  };

  const startChat = () => {
    setCurrentView("chat");
    setMessages([{
      role: "assistant",
      content: `Welcome, ${userData.name.split(" ")[0] || "there"}! I see you're thinking about a ${userData.projectType?.toLowerCase() || "home project"}${userData.scope ? ` — sounds like a ${userData.scope.toLowerCase()} project` : ""}.\n\nTell me about the space. What's it like right now, and what's the dream?`
    }]);
  };

  // ─── STYLES ───
  const fonts = `@import url('https://fonts.googleapis.com/css2?family=Yeseva+One&family=Outfit:wght@300;400;500;600;700&display=swap');`;

  const baseStyles = {
    fontFamily: "'Outfit', sans-serif",
    color: "#1A1A1A",
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: "antialiased",
  };

  // ─── MARKETING PAGE ───
  if (currentView === "marketing") {
    return (
      <div style={baseStyles}>
        <style>{fonts}{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { overflow-x: hidden; }
          .reveal { opacity: 0; transform: translateY(40px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
          .reveal.visible { opacity: 1; transform: translateY(0); }
          .reveal-delay-1 { transition-delay: 0.1s; }
          .reveal-delay-2 { transition-delay: 0.2s; }
          .reveal-delay-3 { transition-delay: 0.3s; }
          .reveal-delay-4 { transition-delay: 0.4s; }
          .gold-btn { background: #D4A84B; color: #000; border: none; padding: 18px 40px; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; }
          .gold-btn:hover { background: #C49A3F; transform: translateY(-1px); }
          .gold-btn::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s; }
          .gold-btn:active::after { width: 300px; height: 300px; }
          .outline-btn { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); padding: 18px 40px; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
          .outline-btn:hover { border-color: #fff; background: rgba(255,255,255,0.05); }
          .stat-number { font-family: 'Yeseva One', serif; font-size: 48px; color: #D4A84B; line-height: 1; }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,75,0.4); } 50% { box-shadow: 0 0 0 12px rgba(212,168,75,0); } }
          .pulse { animation: pulse-gold 2.5s ease-in-out infinite; }
          @keyframes grain { 0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); } 30% { transform: translate(3%, -15%); } 50% { transform: translate(12%, 9%); } 70% { transform: translate(9%, 4%); } 90% { transform: translate(-1%, 7%); } }
          .noise::before { content: ''; position: absolute; inset: -50%; width: 200%; height: 200%; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); animation: grain 8s steps(10) infinite; pointer-events: none; z-index: 1; }
        `}</style>

        {/* ─── HEADER ─── */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 48px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: headerSolid ? "rgba(0,0,0,0.95)" : "transparent",
          backdropFilter: headerSolid ? "blur(20px)" : "none",
          borderBottom: headerSolid ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Yeseva One', serif", fontSize: 22, color: "#fff", letterSpacing: "-0.02em" }}>Grand Traverse</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase" }}>Home Co.</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Process", "Work", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => e.target.style.color = "#fff"} onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.7)"}>
                {item}
              </a>
            ))}
            <button className="gold-btn pulse" onClick={() => setCurrentView("intake")} style={{ padding: "12px 28px", fontSize: 12 }}>
              Build Your Plan
            </button>
          </nav>
        </header>

        {/* ─── HERO ─── */}
        <section style={{
          height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          background: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80') center/cover`,
          position: "relative", overflow: "hidden", textAlign: "center", padding: "0 24px",
        }} className="noise">
          <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 24 }}>
              Grand Traverse Home Co.
            </p>
            <h1 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(40px, 6vw, 72px)", color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              You're Not Looking<br />for a Contractor.
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "rgba(255,255,255,0.7)", fontWeight: 300, lineHeight: 1.5, marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
              You're looking for a solution. One that starts with a plan,<br />not a pitch.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="gold-btn pulse" onClick={() => setCurrentView("intake")} style={{ fontSize: 14, padding: "20px 48px" }}>
                Build Your Free Project Plan
              </button>
              <button className="outline-btn" onClick={() => document.getElementById("problem").scrollIntoView({ behavior: "smooth" })}>
                See How It Works
              </button>
            </div>
          </div>
          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 3s ease-in-out infinite", zIndex: 2 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
          </div>
        </section>

        {/* ─── PROBLEM ─── */}
        <section id="problem" ref={registerSection("problem")} style={{ padding: "140px 24px", background: "#FAFAFA", position: "relative" }}>
          <div className={`reveal ${isVisible("problem") ? "visible" : ""}`} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 20 }}>The Problem</p>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.15, marginBottom: 32, color: "#1A1A1A" }}>
              Hiring a Contractor<br />Shouldn't Feel Like a Gamble.
            </h2>
            <p style={{ fontSize: 18, color: "#6B6560", lineHeight: 1.8, maxWidth: 640, margin: "0 auto" }}>
              You're about to hand someone the keys to your home and a check for tens of thousands of dollars. You don't know what things should cost. You don't know if the timeline is real. You don't know what questions to ask. And the horror stories? They're everywhere.
            </p>
          </div>
          <div className={`reveal reveal-delay-2 ${isVisible("problem") ? "visible" : ""}`} style={{ maxWidth: 1000, margin: "64px auto 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { number: "1 in 4", label: "homeowners report a negative contractor experience" },
              { number: "30%", label: "average budget overrun on home renovations" },
              { number: "67%", label: "of homeowners say lack of communication is their #1 frustration" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center", padding: 32 }}>
                <div className="stat-number">{stat.number}</div>
                <p style={{ fontSize: 14, color: "#A39E97", marginTop: 12, lineHeight: 1.6 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── AMPLIFY ─── */}
        <section id="amplify" ref={registerSection("amplify")} style={{ padding: "120px 24px", background: "#000", color: "#fff", position: "relative", overflow: "hidden" }} className="noise">
          <div className={`reveal ${isVisible("amplify") ? "visible" : ""}`} style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 20 }}>The Reality</p>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.2, marginBottom: 48 }}>
              "He took our deposit and vanished. Our kitchen was torn apart for three months."
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                  Half-finished bathrooms. Contractors who ghost after the deposit. "Small jobs" that uncover catastrophic surprises nobody warned you about. The emotional toll is real — your home is torn apart, you're living in chaos, and you have no idea when it ends.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                  It doesn't have to be this way. The problem isn't contractors — it's the process. No transparency. No plan. No accountability. You deserve to see exactly what's happening, when it's happening, and what it costs. Before you commit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STORY / SOLUTION ─── */}
        <section id="process" ref={registerSection("solution")} style={{ padding: "140px 24px", background: "#fff" }}>
          <div className={`reveal ${isVisible("solution") ? "visible" : ""}`} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 20 }}>The Solution</p>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.15, marginBottom: 24 }}>
              We Engineered a Better Way<br />to Renovate Your Home.
            </h2>
            <p style={{ fontSize: 18, color: "#6B6560", lineHeight: 1.8, marginBottom: 80, maxWidth: 620, margin: "0 auto 80px" }}>
              Before we swing a single hammer, our AI project planner maps out your entire renovation. You see the plan before you commit.
            </p>
          </div>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { step: "01", title: "Tell Us Your Vision", desc: "Our AI advisor asks the right questions and builds a complete picture of your project in minutes — not days.", icon: "💬" },
              { step: "02", title: "Get Your Solution Schedule", desc: "A detailed phase-by-phase plan with timelines, cost ranges, and key decisions — generated instantly. It's yours to keep, no obligation.", icon: "📋" },
              { step: "03", title: "Track Every Detail", desc: "Your personal portal shows real-time progress, daily photos, and a direct line to your project manager. No surprises. No guesswork.", icon: "📱" },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} ${isVisible("solution") ? "visible" : ""}`}
                style={{ padding: 40, border: "1px solid #F0EDEA", position: "relative", transition: "border-color 0.3s, transform 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4A84B"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#F0EDEA"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#D4A84B", letterSpacing: "0.15em" }}>{item.step}</span>
                <h3 style={{ fontFamily: "'Yeseva One', serif", fontSize: 22, marginTop: 8, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "#6B6560", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TRANSFORMATION / TESTIMONIALS ─── */}
        <section id="work" ref={registerSection("testimonials")} style={{ padding: "120px 24px", background: "#F9F7F5" }}>
          <div className={`reveal ${isVisible("testimonials") ? "visible" : ""}`} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 20 }}>Transformations</p>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.15, marginBottom: 64 }}>
              From Anxiety to Confidence.
            </h2>
          </div>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {[
              { quote: "I went from dreading our kitchen remodel to actually enjoying the process. I could see every phase on my phone, and the final cost was $200 under the estimate.", name: "Sarah & James M.", project: "Kitchen Remodel — Traverse City" },
              { quote: "The project plan sold me before I even met the crew. No other contractor showed me what the process would actually look like. It was a no-brainer.", name: "David K.", project: "Basement Finish — Elk Rapids" },
              { quote: "After two bad experiences with other contractors, I was terrified to try again. The transparency here is night and day. Daily photos, clear timelines, no surprises.", name: "Michelle T.", project: "Bathroom & Deck — Suttons Bay" },
              { quote: "The AI planner knew things I hadn't even thought of — lead paint testing for our 1960s home, permits for the electrical, timeline for cabinet lead times. Incredible.", name: "Robert & Lisa P.", project: "Whole Home Renovation — Leland" },
            ].map((t, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} ${isVisible("testimonials") ? "visible" : ""}`}
                style={{ background: "#fff", padding: 40, border: "1px solid #F0EDEA" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#D4A84B", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: "#3D3834", lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{t.quote}"</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{t.name}</p>
                <p style={{ fontSize: 12, color: "#A39E97", marginTop: 2 }}>{t.project}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── OFFER + RISK REVERSAL ─── */}
        <section ref={registerSection("offer")} style={{
          padding: "140px 24px", background: "#000", color: "#fff", textAlign: "center", position: "relative"
        }} className="noise">
          <div className={`reveal ${isVisible("offer") ? "visible" : ""}`} style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 20 }}>The Offer</p>
            <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.15, marginBottom: 24 }}>
              Your Project Plan is Free.<br />No Strings. No Sales Pitch.
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 24, maxWidth: 560, margin: "0 auto 24px" }}>
              Tell our AI advisor what you're building. In minutes, you'll have a detailed renovation roadmap with phases, timelines, and transparent pricing. Keep it whether you hire us or not.
            </p>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 48, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              <span>✓ No obligation</span>
              <span>✓ No hidden fees</span>
              <span>✓ No surprise change orders</span>
              <span>✓ Plan is yours to keep</span>
            </div>
            <button className="gold-btn pulse" onClick={() => setCurrentView("intake")} style={{ fontSize: 15, padding: "22px 56px" }}>
              Build Your Free Project Plan →
            </button>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>Takes about 5 minutes. Your project advisor is standing by.</p>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ padding: "48px 24px 32px", background: "#0A0A0A", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
          <div style={{ fontFamily: "'Yeseva One', serif", fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Grand Traverse Home Co.</div>
          <p style={{ fontSize: 12, marginBottom: 24 }}>Traverse City, MI · Licensed & Insured · (231) 555-0147</p>
          <div style={{ fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Powered by <span style={{ fontFamily: "'Yeseva One', serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>.win</span>
          </div>
        </footer>
      </div>
    );
  }

  // ─── INTAKE FLOW ───
  if (currentView === "intake") {
    const projectTypes = [
      { label: "Kitchen Remodel", icon: "🍳" },
      { label: "Bathroom Remodel", icon: "🛁" },
      { label: "Deck & Outdoor", icon: "🌲" },
      { label: "Basement Finish", icon: "🏠" },
      { label: "Addition", icon: "📐" },
      { label: "Whole Home", icon: "🔨" },
      { label: "Handyman", icon: "🔧" },
      { label: "Custom Project", icon: "✨" },
    ];
    const scopes = ["Quick refresh", "Full remodel", "Down to the studs", "Not sure yet"];
    const timelines = ["ASAP", "1–3 months", "3–6 months", "Just planning"];

    return (
      <div style={{ ...baseStyles, minHeight: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
        <style>{fonts}{`
          .pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 20px 24px; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; gap: 12px; font-family: 'Outfit', sans-serif; color: #fff; font-size: 15px; }
          .pill:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
          .pill.selected { background: rgba(212,168,75,0.12); border-color: #D4A84B; color: #D4A84B; }
          .scope-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 14px 24px; cursor: pointer; transition: all 0.25s ease; font-family: 'Outfit', sans-serif; color: rgba(255,255,255,0.7); font-size: 14px; text-align: center; font-weight: 500; }
          .scope-pill:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
          .scope-pill.selected { background: rgba(212,168,75,0.12); border-color: #D4A84B; color: #D4A84B; }
          .intake-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); padding: 16px 20px; color: #fff; font-family: 'Outfit', sans-serif; font-size: 16px; width: 100%; outline: none; transition: border-color 0.2s; }
          .intake-input:focus { border-color: #D4A84B; }
          .intake-input::placeholder { color: rgba(255,255,255,0.3); }
        `}</style>

        {/* Back button */}
        <button onClick={() => { setCurrentView("marketing"); setIntakeStep(0); }} style={{ position: "absolute", top: 24, left: 24, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          ← Back
        </button>

        {/* Progress */}
        <div style={{ position: "absolute", top: 24, right: 24, fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
          Step {intakeStep + 1} of 3
        </div>
        <div style={{ position: "absolute", top: 48, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: 2, background: "#D4A84B", width: `${((intakeStep + 1) / 3) * 100}%`, transition: "width 0.5s ease" }} />
        </div>

        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          {/* Step 0: Contact */}
          {intakeStep === 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 12 }}>Let's start with you</p>
              <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: 32, marginBottom: 40 }}>Who's building?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
                <input className="intake-input" placeholder="Full name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                <input className="intake-input" placeholder="Email" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                <input className="intake-input" placeholder="Phone" type="tel" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
              </div>
              <button className="gold-btn" onClick={() => setIntakeStep(1)} disabled={!userData.name || !userData.email}
                style={{ marginTop: 32, width: "100%", opacity: (!userData.name || !userData.email) ? 0.4 : 1 }}>
                Continue
              </button>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>We'll send your project plan to this email.</p>
            </div>
          )}

          {/* Step 1: Project Type */}
          {intakeStep === 1 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 12 }}>Your Project</p>
              <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: 32, marginBottom: 40 }}>What are we building?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {projectTypes.map((pt) => (
                  <div key={pt.label} className={`pill ${userData.projectType === pt.label ? "selected" : ""}`}
                    onClick={() => setUserData({ ...userData, projectType: pt.label })}>
                    <span style={{ fontSize: 22 }}>{pt.icon}</span>
                    <span>{pt.label}</span>
                  </div>
                ))}
              </div>
              <button className="gold-btn" onClick={() => setIntakeStep(2)} disabled={!userData.projectType}
                style={{ marginTop: 32, width: "100%", opacity: !userData.projectType ? 0.4 : 1 }}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Scope + Timeline */}
          {intakeStep === 2 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 12 }}>Scope & Timeline</p>
              <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: 32, marginBottom: 40 }}>How big is this project?</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16, fontWeight: 500 }}>SCOPE</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
                {scopes.map((s) => (
                  <div key={s} className={`scope-pill ${userData.scope === s ? "selected" : ""}`} onClick={() => setUserData({ ...userData, scope: s })}>
                    {s}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16, fontWeight: 500 }}>TIMELINE</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 32 }}>
                {timelines.map((t) => (
                  <div key={t} className={`scope-pill ${userData.timeline === t ? "selected" : ""}`} onClick={() => setUserData({ ...userData, timeline: t })}>
                    {t}
                  </div>
                ))}
              </div>
              <button className="gold-btn" onClick={startChat} disabled={!userData.scope}
                style={{ marginTop: 16, width: "100%", opacity: !userData.scope ? 0.4 : 1 }}>
                Talk to Your Project Advisor →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── AI CHAT ───
  if (currentView === "chat") {
    return (
      <div style={{ ...baseStyles, height: "100vh", background: "#0A0A0A", color: "#fff", display: "flex", flexDirection: "column" }}>
        <style>{fonts}{`
          .chat-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 16px 20px; color: #fff; font-family: 'Outfit', sans-serif; font-size: 15px; width: 100%; outline: none; resize: none; transition: border-color 0.2s; }
          .chat-input:focus { border-color: #D4A84B; }
          .chat-input::placeholder { color: rgba(255,255,255,0.25); }
          @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        `}</style>

        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #D4A84B, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏠</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Project Advisor</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Grand Traverse Home Co. · AI-Powered</p>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20 }}>
            {userData.projectType} · {userData.scope}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" , alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                padding: "14px 18px",
                background: msg.role === "user" ? "rgba(212,168,75,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${msg.role === "user" ? "rgba(212,168,75,0.25)" : "rgba(255,255,255,0.08)"}`,
                fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: 6, padding: "14px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4A84B", animation: `dot-bounce 1.4s infinite ease-in-out`, animationDelay: `${i * 0.16}s` }} />
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", gap: 12, maxWidth: 800, margin: "0 auto" }}>
            <textarea className="chat-input" rows={1} placeholder="Describe your project, ask questions, or tell us your vision..."
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              style={{ flex: 1 }} />
            <button onClick={sendMessage} disabled={!chatInput.trim() || isTyping}
              style={{ background: "#D4A84B", border: "none", padding: "0 24px", cursor: "pointer", fontSize: 16, color: "#000", fontWeight: 600, fontFamily: "'Outfit', sans-serif", opacity: (!chatInput.trim() || isTyping) ? 0.4 : 1, transition: "opacity 0.2s" }}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SOLUTION SCHEDULE / PLAN ───
  if (currentView === "plan" && solutionSchedule) {
    const plan = solutionSchedule;
    return (
      <div style={{ ...baseStyles, minHeight: "100vh", background: "#0A0A0A", color: "#fff", padding: "48px 24px" }}>
        <style>{fonts}</style>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 12 }}>Your Solution Schedule</p>
            <h1 style={{ fontFamily: "'Yeseva One', serif", fontSize: "clamp(28px, 4vw, 42px)", marginBottom: 16 }}>{plan.project_title}</h1>
            <div style={{ display: "flex", gap: 32, justifyContent: "center", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              <span>💰 {plan.estimated_range}</span>
              <span>🕐 {plan.estimated_duration}</span>
            </div>
          </div>

          {/* Phases */}
          <div style={{ marginBottom: 64 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 24 }}>Phase Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {plan.phases?.map((phase, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 20, alignItems: "start" }}>
                  <div style={{ width: 40, height: 40, border: "2px solid #D4A84B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Yeseva One', serif", fontSize: 16, color: "#D4A84B" }}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{phase.name}</h4>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{phase.description}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, color: "#D4A84B", fontWeight: 600 }}>{phase.duration}</p>
                    {phase.cost_range && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{phase.cost_range}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Decisions */}
          {plan.key_decisions?.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 16 }}>Decisions You'll Need to Make</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.key_decisions.map((d, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "rgba(212,168,75,0.06)", border: "1px solid rgba(212,168,75,0.15)", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                    ◆ {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Flags */}
          {plan.risk_flags?.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C1292E", marginBottom: 16 }}>Things to Watch For</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.risk_flags.map((r, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "rgba(193,41,46,0.06)", border: "1px solid rgba(193,41,46,0.15)", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                    ⚠ {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "64px 0 32px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 32 }}>
            <h3 style={{ fontFamily: "'Yeseva One', serif", fontSize: 28, marginBottom: 12 }}>Ready to Bring This to Life?</h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>Schedule your free on-site consultation. We'll walk the space together and finalize your plan.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="gold-btn pulse" onClick={() => setCurrentView("portal")} style={{ padding: "18px 40px" }}>
                Schedule Consultation
              </button>
              <button onClick={() => setCurrentView("portal")}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "18px 40px", fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                View in My Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PORTAL PREVIEW ───
  if (currentView === "portal") {
    const plan = solutionSchedule;
    return (
      <div style={{ ...baseStyles, minHeight: "100vh", background: "#FAFAFA" }}>
        <style>{fonts}</style>
        {/* Portal Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid #F0EDEA", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Yeseva One', serif", fontSize: 18 }}>Grand Traverse</span>
            <span style={{ fontSize: 11, color: "#A39E97", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" }}>Client Portal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "#6B6560" }}>Welcome, {userData.name.split(" ")[0]}</span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D4A84B", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 600, fontSize: 13 }}>
              {userData.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          {/* Status Banner */}
          <div style={{ background: "#fff", border: "1px solid #F0EDEA", padding: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#D4A84B", marginBottom: 4 }}>Active Project</p>
              <h2 style={{ fontFamily: "'Yeseva One', serif", fontSize: 24 }}>{plan?.project_title || userData.projectType}</h2>
              <p style={{ fontSize: 13, color: "#A39E97", marginTop: 4 }}>Consultation Pending · Created just now</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, color: "#A39E97", marginBottom: 4 }}>Estimated Range</p>
              <p style={{ fontFamily: "'Yeseva One', serif", fontSize: 22, color: "#D4A84B" }}>{plan?.estimated_range || "TBD"}</p>
            </div>
          </div>

          {/* Phase Timeline */}
          {plan?.phases && (
            <div style={{ background: "#fff", border: "1px solid #F0EDEA", padding: 32, marginBottom: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3D3834", marginBottom: 24 }}>Your Renovation Roadmap</h3>
              {plan.phases.map((phase, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: i < plan.phases.length - 1 ? "1px solid #F0EDEA" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#D4A84B" : "#F0EDEA", color: i === 0 ? "#000" : "#A39E97", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{phase.name}</h4>
                      <span style={{ fontSize: 12, color: i === 0 ? "#D4A84B" : "#A39E97", fontWeight: 500 }}>
                        {i === 0 ? "Up Next" : phase.duration}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B6560", lineHeight: 1.6, marginTop: 4 }}>{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "Messages", desc: "Chat with your team", icon: "💬" },
              { label: "Documents", desc: "Contracts & plans", icon: "📄" },
              { label: "Payments", desc: "Invoices & receipts", icon: "💳" },
            ].map((action, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #F0EDEA", padding: 24, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#D4A84B"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#F0EDEA"}>
                <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{action.icon}</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{action.label}</p>
                <p style={{ fontSize: 12, color: "#A39E97", marginTop: 2 }}>{action.desc}</p>
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div style={{ textAlign: "center", marginTop: 48, fontSize: 11, color: "#A39E97", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            Powered by <span style={{ fontFamily: "'Yeseva One', serif", fontSize: 13, color: "#6B6560" }}>.win</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
