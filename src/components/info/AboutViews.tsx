import React, { useState } from "react";
import {
  ShieldCheck,
  BookOpen,
  Globe,
  Sparkles,
  User,
  Feather,
  Code2,
  Rocket,
  Compass,
  Heart,
  Crown,
  BookMarked,
  CheckCircle2,
  ExternalLink,
  Flame,
  Layers,
  FileCheck,
  Lock,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Skull,
  Eye,
  Cookie,
  Share2,
  Shield,
  HelpCircle,
  Scale,
  Zap,
  Info
} from "lucide-react";

export const AboutViews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"founder" | "about" | "sources" | "privacy" | "terms" | "brainrot">("founder");
  const [copied, setCopied] = useState(false);

  const handleCopyLegalText = () => {
    const legalText = `# Nutrimania Privacy Policy & Terms. The Brainrot Edition 🥦💀

## 🔐 PRIVACY POLICY: *We Are Not FBI Bro*

**Last updated:** August 2026

Welcome to Nutrimania. Before you start checking if a banana has energy than broccoli here is the boring legal stuff—but with less pain.

### 1. 👁️ What We Know About You
Basically we might gather things you give us on purpose, such as:
* Your name
* Your email
* Your food preferences
* Things you look for
* The fact that you looked up "is Maggi healthy at 3 AM" 💀

We do not gather your childhood trauma your relationship pictures or the secret way your grandma makes biryani.
Unless you send it to us. Then bro... Why? 😭

### 2. 🍪 Cookies
Yes, cookies.
Unfortunately not the kind you eat.
Our website might use cookies to help the site work and understand how people use Nutrimania.
You can change cookies through your browser settings if you're on your -cookie plan.

### 3. 📤 Do We Sell Your Data?
Absolutely not.
Your data is not going on Facebook Marketplace.
We don't sell your details to rich people, suspicious uncles or a guy named Rajesh offering ₹500 and "one business opportunity.”

### 4. 🤝 Third-Party Services
At times Nutrimania might use third-party services for things like tracking, hosting, login or other technical tricks.
Those services might have their privacy policies because apparently everyone needs their own Terms & Conditions universe.

### 5. 🔒 Security
We try our best to keep your information safe with security measures.
Lets be honest: nothing on the internet has a **100% unbreakable shield**.
So please don't use your password as:
**123456**
Because even the villain in a low-budget movie could guess that.

### 6. 🧒 Tiny Humans
If you are too young to use features or services please get approval from a parent or guardian where needed.
No shortcuts, please.

### 7. 🔄 Changes
We might change this policy when the law changes the website. The developer wakes up at 2 AM and says:
> "Wait... This section needs fixing.”
The recent version posted here is the one that counts.

---

# 📜 TERMS & CONDITIONS: *The Fine Print Nobody Reads*

Welcome to Nutrimania.
By using this website you are officially joining an agreement with us.
Don't worry there is **no boss battle**.

### 1. 🥗 Use Nutrimania Normally
Use Nutrimania to explore food and nutrition facts.
Please don't:
* Break the website.
* Try to hack it.
* Spam over.
* Upload stuff.
* Use the platform for actions.
* Blame us because broccoli didn't match the vibe.
Be normal-ish.

### 2. 🩣 Nutrition Information Disclaimer
Nutrimania gives ** food and nutrition information**.
We are a food-information platform.
We are **NOT** your doctor, nutritionist, emergency team, gym friend with a supplement deal or your mom shouting:
> "EAT YOUR VEGETABLES!”
For medical or dietary choices allergies, health issues or emergencies talk to a trained professional.
Please don't make health decisions because a website said:
“Almonds: 579 calories per 100g.”
That's not how the quest works. 💀

### 3. 🧠 Accuracy
We try to keep information correct and helpful.
Food facts can change based on brand, recipe, serving size, how it is made and the fact that people can't agree on what a "medium-sized banana" means.
So check details when needed.

### 4. 📸 Content & Copyright
The content, logos, design, branding and original material on Nutrimania belong to their owners.
Don't copy our website change one button from green to blue and say:
> “Guys I made a startup.”
Bro. We can see you. 😭

### 5. 🚫 Don't Be a Problem
You agree not to use Nutrimania in a way or interfere with its systems, users or services.
In words:
Don't become the final boss of our server logs.

### 6. 🔧 Website Changes
We might update, change, add, remove, fix, weaken, strengthen or take down features whenever needed.
The website is growing.
Character development takes time.

### 7. ⚖️ Legal Details
These Terms are controlled by the laws and rules that apply.
If something goes wrong we'll handle it through the legal steps—not through a Twitter/X cancel culture thread.

### 8. 🚪 Ending the Agreement
If you don't like these Terms you can stop using Nutrimania.
No hard feelings.
We hope you have a life and perfectly cooked Maggi. 🍜✨

---

## 🥦 THE FINAL WORD
By continuing to use Nutrimania you agree to these Privacy Policy and Terms & Conditions.
Thank you for reading this
Honestly?
You have focus, than 97% of the internet.

### 🫡 Respect.

Nutrimania
Discover Food. Understand Nutrition.
Created, Designed & Developed by Ansh Singh
Author of The Lost Soul of Throne. Until Death Found Us Again`;

    navigator.clipboard.writeText(legalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sources = [
    {
      name: "USDA FoodData Central (FDC)",
      region: "United States",
      scope: "Over 350,000 whole agricultural commodities and foundation food items with micronutrient spectroscopy.",
      badge: "Primary Reference",
    },
    {
      name: "ICMR - National Institute of Nutrition (IFCT)",
      region: "India & South Asia",
      scope: "Indian Food Composition Tables containing comprehensive bio-actives, regional spices, and lentils.",
      badge: "Regional Partner",
    },
    {
      name: "EFSA (European Food Safety Authority)",
      region: "European Union",
      scope: "Dietary Reference Values (DRV) and European food additive classifications.",
      badge: "Safety Standard",
    },
    {
      name: "MEXT Standard Tables of Food Composition",
      region: "Japan & East Asia",
      scope: "Calibrated nutritional data for fermented miso, sea vegetables, dashi broths, and green teas.",
      badge: "Regional Partner",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Brand, Legal &amp; Creator Center</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              About Nutrimania
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tagline: <em className="text-emerald-600 dark:text-emerald-400 font-bold not-italic">Discover Food. Understand Nutrition.</em>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("brainrot")}
            className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>🥦💀 Privacy &amp; Terms (Brainrot Edition)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs sm:text-sm font-bold">
        {[
          { id: "founder", label: "About the Founder (Ansh Singh)", icon: User, highlight: true },
          { id: "about", label: "Mission & Philosophy", icon: Globe },
          { id: "sources", label: "Scientific Data Sources", icon: BookOpen },
          { id: "privacy", label: "Privacy Policy (We Are Not FBI Bro 🔐)", icon: Lock },
          { id: "terms", label: "Terms & Conditions (The Fine Print 📜)", icon: FileText },
          { id: "brainrot", label: "Brainrot Edition (All-in-One 🥦💀)", icon: Skull, special: true },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? tab.special
                    ? "bg-slate-900 text-emerald-400 border border-emerald-500/50 shadow-md"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.highlight && activeTab !== "founder" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Founder Tab (Featured) */}
      {activeTab === "founder" && (
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Main Founder Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 mb-8 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
              {/* Profile Avatar / Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 p-1 shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center text-white relative overflow-hidden">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight font-serif bg-gradient-to-b from-white to-emerald-200 bg-clip-text text-transparent">
                      AS
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold mt-0.5">
                      Creator
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md border-2 border-white dark:border-slate-900" title="Verified Author & Developer">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Roles */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                    Founder &amp; Creator Profile
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Digital Architect
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Ansh Singh
                </h2>

                <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                  Author • Developer • Creator of Nutrimania
                </p>

                {/* Badges / Roles */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
                    <Feather className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>✍️ Fiction Author</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-xs font-bold">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>💻 Developer</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
                    <Rocket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>🚀 Digital Creator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Biography */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
              <p>
                <strong>Ansh Singh</strong> is an author, developer, and digital creator. He is the creator of <strong>Nutrimania</strong> and the author behind two fiction works: <strong>The Lost Soul of Throne</strong> and <strong>Until Death Found Us Again</strong>. His work combines storytelling, creativity, technology, and digital innovation.
              </p>
              <p>
                Alongside his work as a fiction author, Ansh Singh develops digital experiences and platforms with a focus on creativity, accessibility, and modern design. <strong>Nutrimania</strong> represents his vision of using technology to make food and nutrition information easier to explore and understand.
              </p>
            </div>

            {/* Vision Quote Box */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex-shrink-0 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Creator Vision &amp; Philosophy
                </p>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  “Nutrimania is built at the intersection of creative storytelling, accessible UI craft, and intelligent food science — empowering individuals worldwide to explore what they eat with clarity and confidence.”
                </p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                  — Ansh Singh
                </p>
              </div>
            </div>
          </div>

          {/* Published & Upcoming Fiction Works */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Published &amp; Upcoming Fiction by Ansh Singh
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">
                Literary Works
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Book 1: The Lost Soul of Throne */}
              <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/80 transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-sm flex-shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Fantasy Fiction
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Feather className="w-3.5 h-3.5 text-amber-500" />
                    <span>Novel by Ansh Singh</span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    The Lost Soul of Throne
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A fantasy fiction exploring kingdoms, power, politics, and legendary mysteries. Follow a sprawling narrative of ancient lineages, royal intrigue, forgotten prophecies, and the perilous price of ultimate sovereignty.
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Epic Fantasy</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Kingdoms &amp; Lore</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Political Intrigue</span>
                  </div>
                </div>
              </div>

              {/* Book 2: Until Death Found Us Again */}
              <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-700/80 transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-700 dark:text-rose-300 shadow-sm flex-shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Romance &amp; Tragedy
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Feather className="w-3.5 h-3.5 text-rose-500" />
                    <span>Novel by Ansh Singh</span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Until Death Found Us Again
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A romance and tragedy fiction about love, loss, death, and a connection that transcends another life. A deeply emotional journey navigating grief, fateful reincarnations, and enduring devotion.
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Romantic Tragedy</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Transcendent Love</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Emotional Depth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 border border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 font-mono">
              Official Platform Signature
            </p>
            <p className="text-base sm:text-xl font-extrabold tracking-tight">
              “Created, Designed &amp; Developed by Ansh Singh.”
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Nutrimania • Discover Food. Understand Nutrition.
            </p>
          </div>
        </div>
      )}

      {/* Mission Tab */}
      {activeTab === "about" && (
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Democratizing Food Intelligence for Everyone
            </h2>
            <p>
              Food is one of the most fundamental drivers of human longevity, vitality, and daily joy. Yet, nutritional information on restaurant menus, packaging, and home cooking has historically been opaque, fragmented, or difficult to calculate.
            </p>
            <p>
              <strong>Nutrimania</strong>, created by author and developer <strong>Ansh Singh</strong>, bridges this gap by marrying multimodal artificial intelligence with peer-reviewed food composition databases from leading global institutions.
            </p>
            <p>
              Whether you are scanning a photograph of a traditional South Indian Thali, reading an OCR nutrition label on a packaged granola bar, or analyzing a full dinner plate, Nutrimania translates visual inputs into actionable, evidence-based nutrition intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-base">
                1. Clear Labeling
              </span>
              <p className="text-slate-500 text-xs">
                We never pretend our system knows every food in existence. AI estimations are clearly badged with confidence scores and nutritional provenance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-teal-600 dark:text-teal-400 block text-base">
                2. Cultural Breadth
              </span>
              <p className="text-slate-500 text-xs">
                We actively expand beyond Western diets to include deep support for Asian, Middle Eastern, Latin American, and African culinary preparations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block text-base">
                3. Privacy First
              </span>
              <p className="text-slate-500 text-xs">
                Your food logs and dietary records remain stored locally on your device unless you explicitly choose to contribute to our open community index.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Grounded in Institutional Nutrition Science
            </h3>
            <p className="text-xs text-slate-500">
              Nutrimania cross-references real laboratory spectra, gas chromatography assays, and institutional tables:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {src.region}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {src.badge}
                  </span>
                </div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">{src.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{src.scope}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Policy Tab: We Are Not FBI Bro */}
      {activeTab === "privacy" && (
        <div className="space-y-6 text-slate-800 dark:text-slate-200">
          <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Official Policy Document
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
                  <span>🔐 PRIVACY POLICY:</span>
                  <em className="text-emerald-600 dark:text-emerald-400 font-serif not-italic font-bold">We Are Not FBI Bro</em>
                </h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Last updated:</strong> August 2026
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLegalText}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Legal Text!" : "Copy Policy"}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
              Welcome to <strong>Nutrimania</strong>. Before you start checking if a banana has energy than broccoli here is the boring legal stuff—but with less pain.
            </div>

            <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
              {/* Section 1 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>1. 👁️ What We Know About You</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Basically we might gather things you give us on purpose, such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                  <li>Your name</li>
                  <li>Your email</li>
                  <li>Your food preferences</li>
                  <li>Things you look for</li>
                  <li>The fact that you looked up <em>"is Maggi healthy at 3 AM"</em> 💀</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-300 pt-1">
                  We do not gather your childhood trauma your relationship pictures or the secret way your grandma makes biryani.
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  Unless you send it to us. Then bro... Why? 😭
                </p>
              </div>

              {/* Section 2 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>2. 🍪 Cookies</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, cookies.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Unfortunately not the kind you eat.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Our website might use cookies to help the site work and understand how people use Nutrimania.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  You can change cookies through your browser settings if you're on your -cookie plan.
                </p>
              </div>

              {/* Section 3 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>3. 📤 Do We Sell Your Data?</span>
                </h3>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                  Absolutely not.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Your data is not going on Facebook Marketplace.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  We don't sell your details to rich people, suspicious uncles or a guy named Rajesh offering ₹500 and "one business opportunity.”
                </p>
              </div>

              {/* Section 4 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>4. 🤝 Third-Party Services</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  At times Nutrimania might use third-party services for things like tracking, hosting, login or other technical tricks.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Those services might have their privacy policies because apparently everyone needs their own Terms &amp; Conditions universe.
                </p>
              </div>

              {/* Section 5 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>5. 🔒 Security</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We try our best to keep your information safe with security measures.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Lets be honest: nothing on the internet has a <strong>100% unbreakable shield</strong>.
                </p>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200">
                  <p className="font-bold">So please don't use your password as:</p>
                  <p className="text-base font-black font-mono tracking-widest my-1">123456</p>
                  <p className="text-xs">Because even the villain in a low-budget movie could guess that.</p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>6. 🧒 Tiny Humans</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  If you are too young to use features or services please get approval from a parent or guardian where needed.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-bold">
                  No shortcuts, please.
                </p>
              </div>

              {/* Section 7 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>7. 🔄 Changes</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We might change this policy when the law changes the website. The developer wakes up at 2 AM and says:
                </p>
                <blockquote className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-emerald-500 italic text-slate-800 dark:text-slate-200 font-bold">
                  “Wait... This section needs fixing.”
                </blockquote>
                <p className="text-slate-600 dark:text-slate-300">
                  The recent version posted here is the one that counts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Tab: The Fine Print Nobody Reads */}
      {activeTab === "terms" && (
        <div className="space-y-6 text-slate-800 dark:text-slate-200">
          <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Terms of Service Agreement
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
                  <span>📜 TERMS &amp; CONDITIONS:</span>
                  <em className="text-indigo-600 dark:text-indigo-400 font-serif not-italic font-bold">The Fine Print Nobody Reads</em>
                </h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Standard Agreement:</strong> August 2026 Edition
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLegalText}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Legal Text!" : "Copy Terms"}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
              Welcome to <strong>Nutrimania</strong>. By using this website you are officially joining an agreement with us. Don't worry there is <strong>no boss battle</strong>.
            </div>

            <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
              {/* Section 1 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>1. 🥗 Use Nutrimania Normally</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Use Nutrimania to explore food and nutrition facts.
                </p>
                <p className="font-bold text-slate-700 dark:text-slate-200">
                  Please don't:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                  <li>Break the website.</li>
                  <li>Try to hack it.</li>
                  <li>Spam over.</li>
                  <li>Upload stuff.</li>
                  <li>Use the platform for actions.</li>
                  <li>Blame us because broccoli didn't match the vibe.</li>
                </ul>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  Be normal-ish.
                </p>
              </div>

              {/* Section 2 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>2. 🩣 Nutrition Information Disclaimer</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Nutrimania gives <strong>food and nutrition information</strong>.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-semibold">
                  We are a food-information platform.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  We are <strong>NOT</strong> your doctor, nutritionist, emergency team, gym friend with a supplement deal or your mom shouting:
                </p>
                <blockquote className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border-l-4 border-amber-500 font-black text-amber-900 dark:text-amber-200">
                  “EAT YOUR VEGETABLES!”
                </blockquote>
                <p className="text-slate-600 dark:text-slate-300">
                  For medical or dietary choices allergies, health issues or emergencies talk to a trained professional.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-bold">
                  Please don't make health decisions because a website said:
                </p>
                <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg inline-block">
                  “Almonds: 579 calories per 100g.”
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  That's not how the quest works. 💀
                </p>
              </div>

              {/* Section 3 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>3. 🧠 Accuracy</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We try to keep information correct and helpful.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Food facts can change based on brand, recipe, serving size, how it is made and the fact that people can't agree on what a "medium-sized banana" means.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-bold">
                  So check details when needed.
                </p>
              </div>

              {/* Section 4 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>4. 📸 Content &amp; Copyright</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  The content, logos, design, branding and original material on Nutrimania belong to their owners.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Don't copy our website change one button from green to blue and say:
                </p>
                <blockquote className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-4 border-indigo-500 font-bold text-slate-900 dark:text-white">
                  “Guys I made a startup.”
                </blockquote>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  Bro. We can see you. 😭
                </p>
              </div>

              {/* Section 5 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>5. 🚫 Don't Be a Problem</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  You agree not to use Nutrimania in a way or interfere with its systems, users or services.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-bold">
                  In words:
                </p>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 font-black text-rose-900 dark:text-rose-200 text-sm">
                  Don't become the final boss of our server logs.
                </div>
              </div>

              {/* Section 6 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>6. 🔧 Website Changes</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We might update, change, add, remove, fix, weaken, strengthen or take down features whenever needed.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  The website is growing.
                </p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  Character development takes time.
                </p>
              </div>

              {/* Section 7 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>7. ⚖️ Legal Details</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  These Terms are controlled by the laws and rules that apply.
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  If something goes wrong we'll handle it through the legal steps—not through a Twitter/X cancel culture thread.
                </p>
              </div>

              {/* Section 8 */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>8. 🚪 Ending the Agreement</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  If you don't like these Terms you can stop using Nutrimania.
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  No hard feelings.
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  We hope you have a life and perfectly cooked Maggi. 🍜✨
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Brainrot Edition (All-In-One Unified View) */}
      {activeTab === "brainrot" && (
        <div className="space-y-8 text-slate-800 dark:text-slate-200">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                  <Skull className="w-3.5 h-3.5" />
                  <span>Unfiltered Legal Masterpiece</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Nutrimania Privacy Policy &amp; Terms. The Brainrot Edition 🥦💀
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Official Legal Documentation • <strong>Last updated:</strong> August 2026
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLegalText}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Markdown!" : "Copy Full Text"}</span>
              </button>
            </div>

            {/* PART 1: PRIVACY POLICY */}
            <div className="py-8 space-y-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">🔐</span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                  PRIVACY POLICY: <em className="text-white font-serif not-italic">We Are Not FBI Bro</em>
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Welcome to <strong>Nutrimania</strong>. Before you start checking if a banana has energy than broccoli here is the boring legal stuff—but with less pain.
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-slate-300">
                {/* 1. What We Know About You */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>1. 👁️ What We Know About You</span>
                  </h4>
                  <p>Basically we might gather things you give us on purpose, such as:</p>
                  <ul className="list-disc pl-5 space-y-1 text-emerald-300/90 font-medium">
                    <li>Your name</li>
                    <li>Your email</li>
                    <li>Your food preferences</li>
                    <li>Things you look for</li>
                    <li>The fact that you looked up "is Maggi healthy at 3 AM" 💀</li>
                  </ul>
                  <p className="pt-1">
                    We do not gather your childhood trauma your relationship pictures or the secret way your grandma makes biryani.
                  </p>
                  <p className="text-slate-400 italic">
                    Unless you send it to us. Then bro... Why? 😭
                  </p>
                </div>

                {/* 2. Cookies */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>2. 🍪 Cookies</span>
                  </h4>
                  <p>Yes, cookies.</p>
                  <p>Unfortunately not the kind you eat.</p>
                  <p>Our website might use cookies to help the site work and understand how people use Nutrimania.</p>
                  <p>You can change cookies through your browser settings if you're on your -cookie plan.</p>
                </div>

                {/* 3. Do We Sell Your Data? */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>3. 📤 Do We Sell Your Data?</span>
                  </h4>
                  <p className="text-emerald-400 font-extrabold text-base">Absolutely not.</p>
                  <p>Your data is not going on Facebook Marketplace.</p>
                  <p>We don't sell your details to rich people, suspicious uncles or a guy named Rajesh offering ₹500 and "one business opportunity.”</p>
                </div>

                {/* 4. Third-Party Services */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>4. 🤝 Third-Party Services</span>
                  </h4>
                  <p>At times Nutrimania might use third-party services for things like tracking, hosting, login or other technical tricks.</p>
                  <p>Those services might have their privacy policies because apparently everyone needs their own Terms &amp; Conditions universe.</p>
                </div>

                {/* 5. Security */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>5. 🔒 Security</span>
                  </h4>
                  <p>We try our best to keep your information safe with security measures.</p>
                  <p>Lets be honest: nothing on the internet has a <strong className="text-white">100% unbreakable shield</strong>.</p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300">
                    <p className="font-bold">So please don't use your password as:</p>
                    <p className="text-lg font-black font-mono tracking-widest text-white my-1">123456</p>
                    <p className="text-xs text-rose-400">Because even the villain in a low-budget movie could guess that.</p>
                  </div>
                </div>

                {/* 6. Tiny Humans */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>6. 🧒 Tiny Humans</span>
                  </h4>
                  <p>If you are too young to use features or services please get approval from a parent or guardian where needed.</p>
                  <p className="font-bold text-emerald-400">No shortcuts, please.</p>
                </div>

                {/* 7. Changes */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>7. 🔄 Changes</span>
                  </h4>
                  <p>We might change this policy when the law changes the website. The developer wakes up at 2 AM and says:</p>
                  <blockquote className="p-3 rounded-xl bg-slate-900 border-l-4 border-emerald-400 italic text-emerald-300 font-bold">
                    “Wait... This section needs fixing.”
                  </blockquote>
                  <p>The recent version posted here is the one that counts.</p>
                </div>
              </div>
            </div>

            {/* PART 2: TERMS & CONDITIONS */}
            <div className="py-8 space-y-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">📜</span>
                <h3 className="text-xl sm:text-2xl font-black text-indigo-400 tracking-tight">
                  TERMS &amp; CONDITIONS: <em className="text-white font-serif not-italic">The Fine Print Nobody Reads</em>
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Welcome to <strong>Nutrimania</strong>. By using this website you are officially joining an agreement with us. Don't worry there is <strong className="text-white">no boss battle</strong>.
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-slate-300">
                {/* 1. Use Nutrimania Normally */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>1. 🥗 Use Nutrimania Normally</span>
                  </h4>
                  <p>Use Nutrimania to explore food and nutrition facts.</p>
                  <p className="font-bold text-slate-200">Please don't:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300 font-medium">
                    <li>Break the website.</li>
                    <li>Try to hack it.</li>
                    <li>Spam over.</li>
                    <li>Upload stuff.</li>
                    <li>Use the platform for actions.</li>
                    <li>Blame us because broccoli didn't match the vibe.</li>
                  </ul>
                  <p className="font-bold text-emerald-400 pt-1">Be normal-ish.</p>
                </div>

                {/* 2. Nutrition Information Disclaimer */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>2. 🩣 Nutrition Information Disclaimer</span>
                  </h4>
                  <p>Nutrimania gives <strong>food and nutrition information</strong>.</p>
                  <p>We are a food-information platform.</p>
                  <p>We are <strong>NOT</strong> your doctor, nutritionist, emergency team, gym friend with a supplement deal or your mom shouting:</p>
                  <blockquote className="p-3 rounded-xl bg-amber-950/60 border-l-4 border-amber-400 text-amber-300 font-black">
                    “EAT YOUR VEGETABLES!”
                  </blockquote>
                  <p>For medical or dietary choices allergies, health issues or emergencies talk to a trained professional.</p>
                  <p className="font-bold text-slate-200">Please don't make health decisions because a website said:</p>
                  <p className="font-mono font-black text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg inline-block">
                    “Almonds: 579 calories per 100g.”
                  </p>
                  <p className="text-slate-400 italic">That's not how the quest works. 💀</p>
                </div>

                {/* 3. Accuracy */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>3. 🧠 Accuracy</span>
                  </h4>
                  <p>We try to keep information correct and helpful.</p>
                  <p>Food facts can change based on brand, recipe, serving size, how it is made and the fact that people can't agree on what a "medium-sized banana" means.</p>
                  <p className="font-bold text-emerald-400">So check details when needed.</p>
                </div>

                {/* 4. Content & Copyright */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>4. 📸 Content &amp; Copyright</span>
                  </h4>
                  <p>The content, logos, design, branding and original material on Nutrimania belong to their owners.</p>
                  <p>Don't copy our website change one button from green to blue and say:</p>
                  <blockquote className="p-3 rounded-xl bg-slate-900 border-l-4 border-indigo-400 font-black text-white">
                    “Guys I made a startup.”
                  </blockquote>
                  <p className="text-slate-400 italic">Bro. We can see you. 😭</p>
                </div>

                {/* 5. Don't Be a Problem */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>5. 🚫 Don't Be a Problem</span>
                  </h4>
                  <p>You agree not to use Nutrimania in a way or interfere with its systems, users or services.</p>
                  <p className="font-bold text-slate-200">In words:</p>
                  <p className="font-black text-rose-400 text-sm bg-rose-950/40 p-3 rounded-xl border border-rose-800/50">
                    Don't become the final boss of our server logs.
                  </p>
                </div>

                {/* 6. Website Changes */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>6. 🔧 Website Changes</span>
                  </h4>
                  <p>We might update, change, add, remove, fix, weaken, strengthen or take down features whenever needed.</p>
                  <p>The website is growing.</p>
                  <p className="font-bold text-emerald-400">Character development takes time.</p>
                </div>

                {/* 7. Legal Details */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>7. ⚖️ Legal Details</span>
                  </h4>
                  <p>These Terms are controlled by the laws and rules that apply.</p>
                  <p>If something goes wrong we'll handle it through the legal steps—not through a Twitter/X cancel culture thread.</p>
                </div>

                {/* 8. Ending the Agreement */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>8. 🚪 Ending the Agreement</span>
                  </h4>
                  <p>If you don't like these Terms you can stop using Nutrimania.</p>
                  <p className="font-bold text-slate-200">No hard feelings.</p>
                  <p className="text-emerald-400 font-bold text-sm">We hope you have a life and perfectly cooked Maggi. 🍜✨</p>
                </div>
              </div>
            </div>

            {/* PART 3: THE FINAL WORD */}
            <div className="pt-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 text-2xl">
                🥦
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                THE FINAL WORD
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                By continuing to use Nutrimania you agree to these Privacy Policy and Terms &amp; Conditions.
              </p>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto space-y-2">
                <p className="text-xs text-slate-400">Thank you for reading this</p>
                <p className="text-sm sm:text-base font-black text-emerald-400">
                  Honestly? You have focus, than 97% of the internet.
                </p>
                <p className="text-base font-bold text-white flex items-center justify-center gap-1.5 pt-1">
                  <span>🫡 Respect.</span>
                </p>
              </div>

              {/* Creator Signature Card */}
              <div className="pt-6 border-t border-slate-800 max-w-lg mx-auto space-y-2">
                <h4 className="text-lg font-black text-white">Nutrimania</h4>
                <p className="text-xs font-bold text-emerald-400 italic">
                  Discover Food. Understand Nutrition.
                </p>
                <p className="text-xs text-slate-300 font-bold">
                  Created, Designed &amp; Developed by <span className="text-white">Ansh Singh</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Author of <em>The Lost Soul of Throne</em> • <em>Until Death Found Us Again</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

