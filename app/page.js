"use client";

import { useState, useMemo, useEffect, useRef } from "react";

/* AfterQuery SPL Ops Console.
   Two-project portfolio. Twelve-signal deterministic risk engine.
   Claude-drafted lab researcher updates, Slack alerts, calibration
   posts, war-room briefs, and a Monday founder digest. */

const TODAY = new Date("2026-04-22T10:14:00-07:00");

/* ────────────────────────────────────────────────────────────────────
   Tokens (sampled from afterquery.com)
   ──────────────────────────────────────────────────────────────────── */
const C = {
  cream: "#F6F5EE",
  cream2: "#EFEDE3",
  cream3: "#E8E5DC",
  ink: "#0A0A0A",
  inkSoft: "#1A1A19",
  muted: "#6B6A65",
  muted2: "#8D8C86",
  hair: "rgba(10,10,10,0.07)",
  hairStrong: "rgba(10,10,10,0.13)",
  amber: "#C08A3E",
  red: "#8B2E2E",
  green: "#2F6B3A",
  forest: "#026340",
};

const F = {
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

/* ────────────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────────────── */
const PRODUCT_TYPES = [
  "SFT + CoT Demonstrations",
  "Rubric & Verifier-based RL",
  "Tool-calling RL Env",
  "Computer-use Trajectories",
  "Browser-use Trajectories",
  "RLHF Preferences",
  "Code Generation",
  "Deep Research",
  "Custom Eval",
  "Multimodal Training",
  "Loss Analysis",
  "Trajectory Labeling",
];
const BENCHMARKS = ["Custom", "FinanceQA", "IDE-Bench", "Market-Bench", "App-Bench", "UI-Bench", "Terminal-Bench 2.0", "τ²-bench"];
const MODALITIES = ["Text", "Code", "Multi-turn Chat", "Tool-calling (API/MCP)", "Browser", "Desktop", "Image", "Audio", "Video"];
const STATUSES = ["Scoping", "Tooling Build", "Sourcing", "Onboarding", "In-Production", "Rubric Review", "Delivered"];
const SOURCES = ["AfterQuery Experts Network", "Community Referral", "Lab BYO Roster", "Partner Vendor", "Mixed"];
const PRICING_MODELS = [
  { key: "hourly", label: "Hourly", short: "/hr" },
  { key: "per_task", label: "Per task", short: "/task" },
];
const LABS = ["OpenAI", "Anthropic", "Google DeepMind", "Meta AI", "xAI", "Microsoft", "Apple", "Nvidia", "Amazon", "Cohere", "Mistral"];

/* ────────────────────────────────────────────────────────────────────
   Seeded portfolio (two engagements: one RED, one GREEN)
   ──────────────────────────────────────────────────────────────────── */
const DEFAULT_PROJECTS = [
  {
    id: "p1",
    lab: "OpenAI",
    project: "Terminal-Bench 2.0 Tool-calling RL Environment",
    capabilityGap:
      "Long-horizon terminal agent reasoning under filesystem and network state; the agent must complete multi-step CLI workflows that change world state at each step.",
    failureMode:
      "Agent loses state on multi-file refactors in large codebases; can't resume after a failing test without re-reading the whole tree.",
    productType: "Tool-calling RL Env",
    benchmarkTarget: "Terminal-Bench 2.0",
    domain: "Software Engineering",
    credentialBar: "FAANG L6+, 5+ yr infra, prior terminal-agent exposure preferred.",
    modality: "Tool-calling (API/MCP)",
    targetTasks: 500,
    completed: 184,
    rampPlan: [
      { week: 0, targetCumulative: 0 },
      { week: 1, targetCumulative: 60 },
      { week: 2, targetCumulative: 180 },
      { week: 3, targetCumulative: 320 },
      { week: 4, targetCumulative: 440 },
      { week: 5, targetCumulative: 500 },
    ],
    perTestRewardAvg: 0.31,
    binaryPassRate: 0.08,
    expertVettingPassRate: 8,
    rubricFlagCount: 31,
    expertCount: 14,
    team: { writers: 11, reviewers: 2, superReviewers: 1, teamLeads: 0 },
    kappa: 0.62,
    oneShotRate: 54,
    reviewsPerTask: 3.2,
    reviewQueueDepth: 19,
    aht: 9.4,
    ahtTarget: 7.0,
    onboardingFunnel: null,
    timeToFirstTask: 38,
    pricingModel: "hourly",
    avgHourlyRate: 145,
    taskRate: null,
    primaryResearcher: { name: "David Chen", role: "Research Lead, Agent Training" },
    lastUpdateAt: "2026-04-19T15:30:00-07:00",
    lastQBRAt: "2026-04-04",
    country: "United States",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    startDate: "2026-03-23",
    deadline: "2026-05-04",
  },
  {
    id: "p2",
    lab: "Anthropic",
    project: "Clinical Reasoning SFT with Chain-of-Thought",
    capabilityGap:
      "Stepwise differential diagnosis from patient history, with explicit uncertainty flags on vague presenting symptoms.",
    failureMode:
      "Model under-specifies differential diagnoses for vague presenting symptoms; defaults to the most-common condition without flagging uncertainty.",
    productType: "SFT + CoT Demonstrations",
    benchmarkTarget: "Custom",
    domain: "Medicine",
    credentialBar: "MD, US board certified, 3+ yr clinical.",
    modality: "Text",
    targetTasks: 600,
    completed: 516,
    rampPlan: [
      { week: 0, targetCumulative: 0 },
      { week: 1, targetCumulative: 80 },
      { week: 2, targetCumulative: 220 },
      { week: 3, targetCumulative: 380 },
      { week: 4, targetCumulative: 520 },
      { week: 5, targetCumulative: 600 },
    ],
    perTestRewardAvg: 0.74,
    binaryPassRate: 0.58,
    expertVettingPassRate: 26,
    rubricFlagCount: 14,
    expertCount: 28,
    team: { writers: 22, reviewers: 4, superReviewers: 1, teamLeads: 1 },
    kappa: 0.82,
    oneShotRate: 78,
    reviewsPerTask: 1.8,
    reviewQueueDepth: 4,
    aht: 4.2,
    ahtTarget: 4.5,
    onboardingFunnel: null,
    timeToFirstTask: 22,
    pricingModel: "hourly",
    avgHourlyRate: 210,
    taskRate: null,
    primaryResearcher: { name: "Dr. Priya Patel", role: "Research Scientist, Medical RL" },
    lastUpdateAt: "2026-04-21T09:00:00-04:00",
    lastQBRAt: "2026-03-30",
    country: "United States",
    language: "English",
    region: "NAMER",
    timezone: "ET",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    startDate: "2026-03-19",
    deadline: "2026-05-08",
  },
];

/* ────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────── */
function teamTotal(t) {
  if (!t) return 0;
  return (t.writers || 0) + (t.reviewers || 0) + (t.superReviewers || 0) + (t.teamLeads || 0);
}

function tasksPerWeekPlanned(p) {
  if (!p?.startDate || !p?.deadline || !p?.targetTasks) return 0;
  const weeks = Math.max(0.5, (new Date(p.deadline) - new Date(p.startDate)) / (7 * 864e5));
  return p.targetTasks / weeks;
}

function weeklyBurnUSD(p) {
  if (!p) return 0;
  if (p.pricingModel === "per_task") {
    return tasksPerWeekPlanned(p) * (Number(p.taskRate) || 0);
  }
  const team = teamTotal(p.team) || p.expertCount || 0;
  return team * (Number(p.avgHourlyRate) || 0) * 40;
}

function formatRate(p) {
  if (!p) return "—";
  if (p.pricingModel === "per_task") {
    return `$${(Number(p.taskRate) || 0).toLocaleString()}/task`;
  }
  return `$${Number(p.avgHourlyRate) || 0}/hr`;
}

function fmtMoney(n) {
  if (n == null || isNaN(n)) return "$0";
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M`;
  if (Math.abs(n) >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

function rampTargetAt(rampPlan, weeks) {
  if (!rampPlan || rampPlan.length === 0) return 0;
  const w = Math.max(0, weeks);
  const floor = Math.floor(w);
  const ceil = Math.ceil(w);
  if (ceil >= rampPlan.length) return rampPlan[rampPlan.length - 1].targetCumulative;
  if (floor === ceil) return rampPlan[floor]?.targetCumulative || 0;
  const a = rampPlan[floor]?.targetCumulative || 0;
  const b = rampPlan[ceil]?.targetCumulative || 0;
  return a + (b - a) * (w - floor);
}

function deadlineHours(p) {
  return Math.max(0, (new Date(p.deadline) - TODAY) / 36e5);
}

function deadlineLabelShort(p) {
  const h = deadlineHours(p);
  if (h < 48) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
}

function deadlineSub(p) {
  const d = new Date(p.deadline);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysAgo(iso) {
  if (!iso) return null;
  return Math.max(0, (TODAY - new Date(iso)) / 864e5);
}

/* ────────────────────────────────────────────────────────────────────
   Risk engine, twelve named signals, deterministic
   ──────────────────────────────────────────────────────────────────── */
function computeRisk(p) {
  const start = new Date(p.startDate);
  const end = new Date(p.deadline);
  const totalDays = Math.max(1, (end - start) / 864e5);
  const daysElapsed = Math.max(0, (TODAY - start) / 864e5);
  const hoursToDeadline = Math.max(0, (end - TODAY) / 36e5);
  const completionPct = (p.completed / p.targetTasks) * 100;
  const timelinePct = (daysElapsed / totalDays) * 100;

  const weeksElapsed = Math.max(0, daysElapsed / 7);
  const rampTargetNow = rampTargetAt(p.rampPlan, weeksElapsed);
  const rampDelta = Math.max(0, rampTargetNow - p.completed);
  const rampPctBehind = rampTargetNow > 0 ? (rampDelta / rampTargetNow) * 100 : 0;

  const totalAttempts = p.completed + (p.rubricFlagCount || 0);
  const flagRate = totalAttempts > 0 ? (p.rubricFlagCount || 0) / totalAttempts : 0;

  const hoursSinceUpdate = p.lastUpdateAt ? Math.max(0, (TODAY - new Date(p.lastUpdateAt)) / 36e5) : 0;
  const ahtOver = p.aht && p.ahtTarget ? (p.aht - p.ahtTarget) / p.ahtTarget : 0;

  const w = p.team?.writers || 0;
  const rev = (p.team?.reviewers || 0) + (p.team?.superReviewers || 0);
  const reviewerRatio = rev > 0 ? w / rev : Infinity;

  let level = "low";
  const reasons = [];
  const trip = (lvl, reason) => {
    if (lvl === "high") level = "high";
    else if (lvl === "medium" && level !== "high") level = "medium";
    reasons.push(reason);
  };

  // 1. Ramp-plan delta
  if (rampPctBehind > 30) trip("high", `Behind ramp plan by ${Math.round(rampDelta)} tasks (${Math.round(rampPctBehind)}% off the week-${Math.ceil(weeksElapsed)} target).`);
  else if (rampPctBehind > 15) trip("medium", `Behind ramp plan by ${Math.round(rampDelta)} tasks.`);

  // 2. Per-test reward (AfterQuery-specific headline)
  if (p.perTestRewardAvg < 0.2) trip("high", `Per-test reward at ${p.perTestRewardAvg.toFixed(2)}; rubric or tooling is broken.`);
  else if (p.perTestRewardAvg < 0.4) trip("medium", `Per-test reward at ${p.perTestRewardAvg.toFixed(2)}; below the 0.40 attention band.`);

  // 3. Vetting pass rate
  if (p.expertVettingPassRate < 10) trip("high", `Vetting pass rate at ${p.expertVettingPassRate}%; credential bar too tight for the sourcing pool.`);
  else if (p.expertVettingPassRate < 20) trip("medium", `Vetting pass rate at ${p.expertVettingPassRate}%; sourcing tightening.`);

  // 4. Rubric flag rate
  if (flagRate > 0.3) trip("high", `Rubric flag rate at ${Math.round(flagRate * 100)}%; rubric ambiguity or contributor caliber.`);
  else if (flagRate > 0.15) trip("medium", `Rubric flag rate at ${Math.round(flagRate * 100)}%; above the 15% band.`);

  // 5. Deadline pressure
  if (hoursToDeadline < 24 && completionPct < 80) trip("high", `Under 24h to deadline with ${Math.round(completionPct)}% delivered.`);
  else if (hoursToDeadline < 48 && completionPct < 60) trip("medium", `Under 48h to deadline with ${Math.round(completionPct)}% delivered.`);

  // 6. Tooling build stall (AfterQuery-specific)
  if (p.status === "Tooling Build" && daysElapsed > 3) trip("medium", `Tooling Build stalled at ${Math.round(daysElapsed)}d; custom env not yet shipped.`);

  // 7. Update cadence stale
  if (hoursSinceUpdate > 120) trip("high", `Last researcher update ${Math.round(hoursSinceUpdate / 24)}d ago; cadence has slipped.`);
  else if (hoursSinceUpdate > 72) trip("medium", `Last researcher update ${Math.round(hoursSinceUpdate / 24)}d ago.`);

  // 8. Kappa (rubric only)
  if (p.kappa != null) {
    if (p.kappa < 0.6) trip("high", `Kappa ${p.kappa.toFixed(2)} (below 0.6); rubric is ambiguous.`);
    else if (p.kappa < 0.7) trip("medium", `Kappa ${p.kappa.toFixed(2)} (below 0.7 target); calibration needed.`);
  }

  // 9. Review queue depth
  const q = p.reviewQueueDepth || 0;
  if (q > 30) trip("high", `Review queue ${q} tasks; reviewer bottleneck blocking writers.`);
  else if (q > 10) trip("medium", `Review queue ${q} tasks (above 10 bottleneck threshold).`);

  // 10. AHT over target
  if (ahtOver > 0.4) trip("high", `AHT ${p.aht}h is ${Math.round(ahtOver * 100)}% over ${p.ahtTarget}h target.`);
  else if (ahtOver > 0.2) trip("medium", `AHT ${p.aht}h is ${Math.round(ahtOver * 100)}% over ${p.ahtTarget}h target.`);

  // 11. One-shot rate low
  if (p.oneShotRate != null && p.oneShotRate < 50) trip("medium", `One-shot rate ${p.oneShotRate}%; well below the 70% writer-quality bar.`);

  // 12. Time-to-first-task (sourcing/onboarding only)
  if ((p.status === "Sourcing" || p.status === "Onboarding") && (p.timeToFirstTask || 0) > 48) {
    trip("medium", `Time-to-first-task ${p.timeToFirstTask}h; access delays bleeding the funnel.`);
  }

  let summary, action;
  if (level === "low") {
    summary = `Tracking to land. ${Math.round(completionPct)}% delivered with ${Math.max(0, Math.round(hoursToDeadline / 24))}d remaining; per-test reward ${p.perTestRewardAvg.toFixed(2)}, rubric flag rate ${Math.round(flagRate * 100)}%, ${p.kappa != null ? `kappa ${p.kappa.toFixed(2)}, ` : ""}AHT ${p.aht}h vs ${p.ahtTarget}h target.`;
    action = "No lever needed; continue monitoring.";
  } else {
    summary = reasons.join(" ");
    action = level === "high"
      ? (p.perTestRewardAvg < 0.4
          ? "Run a Docent pass over the last 48 failed trajectories, cluster on the dominant tool-selection error, extend the verifier test suite on that mode before opening a new sourcing wave."
          : p.expertVettingPassRate < 10
            ? "Widen the credential bar by one tier; open a Community Referral wave on adjacent seniority; stand up a tiered quality bonus for the first wave."
            : flagRate > 0.3
              ? "Pause intake; audit 30 flagged tasks with a Super-Reviewer; refine the rubric on the dominant failure mode; re-sequence QA into a two-tier review."
              : p.kappa != null && p.kappa < 0.6
                ? "Pause production; run a calibration batch on 20 borderline cases with all reviewers; rewrite the ambiguous criterion with three examples per score level; re-measure kappa before resuming."
                : q > 30
                  ? "Emergency-onboard 2 reviewers from top one-shot writers; simplify the review checklist to under 15 min/task; unblock writers to start next task while awaiting review."
                  : "Escalate to the Tooling Platform for a parallel pipeline; re-sequence authoring and review; negotiate a 48h deadline slip with the lab researcher.")
      : (p.perTestRewardAvg < 0.7
          ? "Run a Docent pass on failed trajectories to locate the dominant failure mode, then extend the verifier test suite on that one mode and re-measure per-test reward in 48h."
          : p.expertVettingPassRate < 20
            ? "Loosen one vetting criterion on the adjacent credential tier; open a targeted Community Referral wave."
            : p.kappa != null && p.kappa < 0.7
              ? "Run a calibration batch this week on 10 borderline items; tighten the ambiguous criterion with two examples per score level; target kappa ≥ 0.7 in 7 days."
              : (p.reviewsPerTask || 0) > 3
                ? "Audit reviewer disagreement patterns; update the top three disputed criteria with explicit examples; add a Super-Reviewer gate on the most-contested domain."
                : q > 10
                  ? "Promote 2 top one-shot writers to reviewers; simplify the review checklist; target a 1:5 reviewer-to-writer ratio."
                  : flagRate > 0.15
                    ? "Spot-audit 20 flagged tasks; refine instructions on the dominant failure mode; stand up a Super-Reviewer gate before delivery."
                    : hoursSinceUpdate > 72
                      ? "Send a researcher update today; schedule a standing Friday cadence going forward."
                      : "Monitor closely. Prepare contingent sourcing via Partner Vendor and a tiered bonus for the final push.");
  }

  return {
    level,
    summary,
    action,
    completionPct,
    timelinePct,
    hoursToDeadline,
    rampTargetNow,
    rampDelta,
    rampPctBehind,
    flagRate,
    hoursSinceUpdate,
    ahtOver,
    reviewerRatio,
    queueDepth: q,
  };
}

/* ────────────────────────────────────────────────────────────────────
   Top-level component
   ──────────────────────────────────────────────────────────────────── */
export default function Page() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [riskFilter, setRiskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [warRoom, setWarRoom] = useState(false);
  const [expandedId, setExpandedId] = useState("p1");
  const [aiState, setAiState] = useState({}); // { [id]: { loading, error, summary, action } }
  const [draft, setDraft] = useState(null); // { kind, label, text, loading, error }
  const [addOpen, setAddOpen] = useState(false);

  const withRisk = useMemo(
    () => projects.map((p) => ({ ...p, risk: computeRisk(p) })),
    [projects]
  );

  const counts = useMemo(() => {
    const c = { all: withRisk.length, high: 0, medium: 0, low: 0 };
    withRisk.forEach((p) => (c[p.risk.level] += 1));
    return c;
  }, [withRisk]);

  const rows = useMemo(() => {
    let r = withRisk;
    if (warRoom) r = r.filter((p) => p.risk.level !== "low");
    if (riskFilter !== "all") r = r.filter((p) => p.risk.level === riskFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((p) =>
        [p.lab, p.project, p.capabilityGap, p.credentialBar, p.country, p.language, p.productType, p.benchmarkTarget]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(q))
      );
    }
    return r;
  }, [withRisk, warRoom, riskFilter, search]);

  const ptrMedian = useMemo(() => {
    const arr = withRisk.map((p) => p.perTestRewardAvg).sort((a, b) => a - b);
    if (arr.length === 0) return 0;
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  }, [withRisk]);

  const shippingThisWeek = withRisk.filter((p) => p.risk.hoursToDeadline <= 7 * 24).length;
  const atRisk = counts.high + counts.medium;
  const critical = counts.high;

  /* AI */
  async function runAIAssessment(p) {
    setAiState((s) => ({ ...s, [p.id]: { loading: true } }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "risk", project: p, risk: p.risk }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setAiState((s) => ({ ...s, [p.id]: { loading: false, summary: data.summary, action: data.action } }));
    } catch (e) {
      setAiState((s) => ({ ...s, [p.id]: { loading: false, error: e.message } }));
    }
  }

  const draftLabels = {
    researcher: "Lab-researcher update",
    slack: "Slack alert",
    calibration: "Calibration batch post",
    weekly: "Weekly founder digest",
    warroom: "Daily war-room brief",
  };

  async function runDraft(kind, payload) {
    setDraft({ kind, label: draftLabels[kind], loading: true, text: "" });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, ...payload }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setDraft({ kind, label: draftLabels[kind], loading: true, text: acc });
      }
      setDraft({ kind, label: draftLabels[kind], loading: false, text: acc });
    } catch (e) {
      setDraft({ kind, label: draftLabels[kind], loading: false, error: e.message, text: "" });
    }
  }

  function toggleExpand(id) {
    setExpandedId((cur) => {
      const next = cur === id ? null : id;
      if (cur && cur !== next) {
        setAiState((s) => {
          const copy = { ...s };
          delete copy[cur];
          return copy;
        });
      }
      return next;
    });
  }

  function addProject(p) {
    const id = `p${Date.now()}`;
    setProjects((curr) => [{ ...p, id }, ...curr]);
    setExpandedId(id);
    setAddOpen(false);
  }

  function updateProject(id, field, value) {
    setProjects((curr) => curr.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function deleteProject(id) {
    setProjects((curr) => curr.filter((p) => p.id !== id));
    setExpandedId(null);
  }

  return (
    <div style={styles.page}>
      <ScenarioBanner />
      <Header
        critical={critical}
        warRoom={warRoom}
        setWarRoom={setWarRoom}
        onWeekly={() => runDraft("weekly", { projects: withRisk })}
        onWarRoomBrief={() => runDraft("warroom", { portfolio: withRisk })}
        onAddProject={() => setAddOpen(true)}
      />
      <MetricStrip
        active={withRisk.length}
        atRisk={atRisk}
        ptrMedian={ptrMedian}
        shipping={shippingThisWeek}
      />
      <Toolbar
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
        counts={counts}
        search={search}
        setSearch={setSearch}
      />
      <Table
        rows={rows}
        expandedId={expandedId}
        toggleExpand={toggleExpand}
        aiState={aiState}
        runAIAssessment={runAIAssessment}
        runDraft={runDraft}
        updateProject={updateProject}
        deleteProject={deleteProject}
      />
      <Footer />
      {draft && <DraftModal state={draft} close={() => setDraft(null)} />}
      {addOpen && <AddProjectModal close={() => setAddOpen(false)} onSave={addProject} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Scenario banner
   ──────────────────────────────────────────────────────────────────── */
function ScenarioBanner() {
  return (
    <div style={styles.banner}>
      <span style={styles.bannerDot} />
      <span>
        <strong style={{ fontWeight: 600 }}>Demo data, fabricated for interview purposes.</strong>{" "}
        No real AfterQuery projects, contributors, or lab data displayed.
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────────────── */
function Header({ critical, warRoom, setWarRoom, onWeekly, onWarRoomBrief, onAddProject }) {
  const dateStr = TODAY.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
  const timeStr = TODAY.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Los_Angeles" });
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoMark}>
          <i style={{ ...styles.logoBar, left: 0, height: 6 }} />
          <i style={{ ...styles.logoBar, left: 6, height: 10 }} />
          <i style={{ ...styles.logoBar, left: 12, height: 14 }} />
          <i style={{ ...styles.logoBar, left: 18, height: 16 }} />
        </span>
        <span>AfterQuery</span>
        <span style={styles.logoDivider} />
        <span style={styles.logoProduct}>SPL Ops Console</span>
      </div>
      <div style={styles.headerRight}>
        <span style={styles.liveStrip}>
          <span style={{ ...styles.livePulse, background: critical > 0 ? C.red : C.forest }} />
          {critical > 0 ? `WAR ROOM · ${critical} CRITICAL · ${dateStr}` : `LIVE · ${dateStr} · ${timeStr} PT`}
        </span>
        <button
          style={{ ...styles.btn, ...(warRoom ? styles.btnWarRoomActive : styles.btnSecondary) }}
          onClick={() => setWarRoom((w) => !w)}
          title="Filter to at-risk projects only, the shape of a daily standup"
        >
          {warRoom ? "Exit War Room" : "War Room"}
        </button>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onWarRoomBrief}>
          Daily brief
        </button>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onAddProject}>
          Add project
        </button>
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={onWeekly}>
          Weekly founder digest →
        </button>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Hero metric strip
   ──────────────────────────────────────────────────────────────────── */
function MetricStrip({ active, atRisk, ptrMedian, shipping }) {
  return (
    <section style={styles.metrics}>
      <Metric num={active} label="Live engagements" />
      <Metric num={atRisk} label="At risk" />
      <Metric num={ptrMedian.toFixed(2)} label="Per-test reward, median" />
      <Metric num={shipping} label="Shipping this week" last />
    </section>
  );
}

function Metric({ num, label, last }) {
  return (
    <div style={{ ...styles.metric, ...(last ? { borderRight: "none" } : {}) }}>
      <div style={styles.metricNum}>{num}</div>
      <div style={styles.metricLabel}>{label}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Toolbar (search + risk chips)
   ──────────────────────────────────────────────────────────────────── */
function Toolbar({ riskFilter, setRiskFilter, counts, search, setSearch }) {
  const chip = (val, label) => {
    const active = riskFilter === val;
    return (
      <button
        onClick={() => setRiskFilter(val)}
        style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
      >
        {label} <span style={{ ...styles.chipN, opacity: active ? 0.75 : 0.55 }}>{counts[val]}</span>
      </button>
    );
  };
  return (
    <section style={styles.toolbar}>
      <div style={styles.toolbarLeft}>
        <div style={styles.toolbarTitle}>Projects</div>
        <input
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lab, project, capability, credential…"
        />
      </div>
      <div style={styles.filters}>
        {chip("all", "All")}
        {chip("high", "High")}
        {chip("medium", "Medium")}
        {chip("low", "Low")}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Table
   ──────────────────────────────────────────────────────────────────── */
function Table({ rows, expandedId, toggleExpand, aiState, runAIAssessment, runDraft, updateProject, deleteProject }) {
  return (
    <section style={styles.table}>
      <div style={{ ...styles.row, ...styles.tableHead }}>
        <div />
        <div>Project</div>
        <div>Capability gap</div>
        <div>Product · benchmark</div>
        <div>Per-test reward</div>
        <div>Tasks</div>
        <div>Deadline</div>
        <div />
      </div>
      {rows.length === 0 ? (
        <div style={styles.emptyState}>No projects match the current filters.</div>
      ) : (
        rows.map((p) => {
          const expanded = expandedId === p.id;
          return (
            <RowGroup
              key={p.id}
              p={p}
              expanded={expanded}
              onToggle={() => toggleExpand(p.id)}
              ai={aiState[p.id]}
              runAIAssessment={runAIAssessment}
              runDraft={runDraft}
              updateProject={updateProject}
              deleteProject={deleteProject}
            />
          );
        })
      )}
    </section>
  );
}

function RowGroup({ p, expanded, onToggle, ai, runAIAssessment, runDraft, updateProject, deleteProject }) {
  const markerColor = p.risk.level === "high" ? C.red : p.risk.level === "medium" ? C.amber : C.green;
  const ptrColor =
    p.perTestRewardAvg < 0.4 ? C.red : p.perTestRewardAvg < 0.7 ? C.amber : C.green;
  const dLabel = deadlineLabelShort(p);
  const dSub = deadlineSub(p);
  return (
    <>
      <div
        onClick={onToggle}
        style={{
          ...styles.row,
          cursor: "pointer",
          background: expanded ? C.cream2 : "transparent",
          borderBottom: expanded ? `1px solid ${C.hairStrong}` : `1px solid ${C.hair}`,
        }}
      >
        <div style={{ ...styles.riskMarker, background: markerColor }} />
        <div>
          <div style={styles.cellLab}>{p.lab}</div>
          <div style={styles.cellTitle}>{p.project}</div>
        </div>
        <div style={styles.cellCapability}>{p.capabilityGap}</div>
        <div style={styles.cellProduct}>
          {p.productType}
          <div>
            <span
              style={{
                ...styles.bench,
                ...(p.benchmarkTarget !== "Custom" ? styles.benchPrimary : {}),
              }}
            >
              {p.benchmarkTarget}
            </span>
          </div>
        </div>
        <div style={{ ...styles.cellPtr, color: ptrColor }}>
          {p.perTestRewardAvg.toFixed(2)}
          <span style={styles.cellPtrBinary}>binary {p.binaryPassRate.toFixed(2)}</span>
        </div>
        <div style={styles.cellTasks}>
          <span>
            {p.completed.toLocaleString()} / {p.targetTasks.toLocaleString()}
          </span>
          <span style={styles.bar}>
            <i
              style={{
                ...styles.barFill,
                width: `${Math.min(100, (p.completed / p.targetTasks) * 100)}%`,
              }}
            />
          </span>
        </div>
        <div style={styles.cellDeadline}>
          {dLabel}
          <div style={styles.cellDeadlineSub}>{dSub}</div>
        </div>
        <div style={{ ...styles.cellCaret, transform: expanded ? "rotate(180deg)" : "none" }}>▾</div>
      </div>
      {expanded && (
        <DetailPanel
          p={p}
          ai={ai}
          runAIAssessment={runAIAssessment}
          runDraft={runDraft}
          updateProject={updateProject}
          deleteProject={deleteProject}
        />
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Detail panel (the heart of the depth port from Mercor)
   ──────────────────────────────────────────────────────────────────── */
function DetailPanel({ p, ai, runAIAssessment, runDraft, updateProject, deleteProject }) {
  const teamSize = teamTotal(p.team) || p.expertCount || 0;
  const burn = weeklyBurnUSD(p);
  const tasksPerWeek = Math.round(tasksPerWeekPlanned(p));
  const hoursToDeadline = p.risk.hoursToDeadline;
  const ptrColor = p.perTestRewardAvg < 0.4 ? C.red : p.perTestRewardAvg < 0.7 ? C.amber : C.green;
  const showFunnel = ["Scoping", "Sourcing", "Onboarding"].includes(p.status) && p.onboardingFunnel;
  const showQuality = p.kappa != null || p.status === "In-Production" || p.status === "Rubric Review";

  const lastUpdate = daysAgo(p.lastUpdateAt);
  const lastQBR = daysAgo(p.lastQBRAt);

  return (
    <div style={styles.detail}>
      <div style={styles.detailInner}>
        <PipelineStrip status={p.status} />

        {/* Capability + failure mode */}
        <div style={styles.contextGrid}>
          <div style={{ ...styles.contextCard, borderLeftColor: C.ink }}>
            <div style={styles.contextLabel}>Capability gap</div>
            <div style={styles.contextBody}>{p.capabilityGap}</div>
          </div>
          {p.failureMode && (
            <div style={{ ...styles.contextCard, borderLeftColor: C.red }}>
              <div style={{ ...styles.contextLabel, color: C.red }}>Failure mode</div>
              <div style={styles.contextBody}>{p.failureMode}</div>
            </div>
          )}
        </div>

        {/* Outcome strip: 6 tiles */}
        <div style={styles.outcomeStrip}>
          <OutcomeTile label="Projected" value={deadlineSub(p)} sub={`${Math.max(0, Math.round(hoursToDeadline / 24))}d remaining`} />
          <OutcomeTile
            label="Tasks"
            value={`${p.completed.toLocaleString()} / ${p.targetTasks.toLocaleString()}`}
            sub={`${Math.round(p.risk.completionPct)}% delivered`}
          />
          <OutcomeTile
            label="Per-test reward"
            value={p.perTestRewardAvg.toFixed(2)}
            sub={`Binary ${p.binaryPassRate.toFixed(2)}`}
            valueColor={ptrColor}
          />
          <OutcomeTile
            label="Vetting pass"
            value={`${p.expertVettingPassRate}%`}
            sub={p.expertVettingPassRate < 20 ? "below the 20% band" : "within band"}
            warn={p.expertVettingPassRate < 20}
          />
          <OutcomeTile
            label="Weekly burn"
            value={fmtMoney(burn)}
            sub={
              p.pricingModel === "per_task"
                ? `${tasksPerWeek}/wk · $${(p.taskRate || 0).toLocaleString()}/task`
                : `${teamSize} active · $${p.avgHourlyRate}/hr`
            }
            last
          />
        </div>

        {/* Team layer + ramp plan */}
        <TeamLayerBar team={p.team} risk={p.risk} />
        <RampPlanCard project={p} risk={p.risk} />
        {showQuality && <QualitySignalCard project={p} />}
        {showFunnel && <OnboardingFunnelCard project={p} />}

        {/* Body: AI panel + metadata */}
        <div style={styles.detailBody}>
          <AIPanel p={p} ai={ai} onGenerate={() => runAIAssessment(p)} />
          <div style={styles.metaCol}>
            <MetaRow k="Product" v={p.productType} />
            <MetaRow k="Benchmark" v={<code style={styles.code}>{p.benchmarkTarget}</code>} />
            <MetaRow k="Domain" v={p.domain} />
            <MetaRow k="Credential bar" v={p.credentialBar} />
            <MetaRow k="Modality" v={p.modality} />
            <MetaRow
              k="Status"
              v={
                <InlineSelect
                  value={p.status}
                  options={STATUSES}
                  onChange={(v) => updateProject(p.id, "status", v)}
                />
              }
            />
            <MetaRow
              k="Pricing"
              v={
                <InlineSelect
                  value={PRICING_MODELS.find((m) => m.key === (p.pricingModel || "hourly")).label}
                  options={PRICING_MODELS.map((m) => m.label)}
                  onChange={(v) => {
                    const m = PRICING_MODELS.find((x) => x.label === v);
                    updateProject(p.id, "pricingModel", m.key);
                    if (m.key === "per_task" && (p.taskRate == null || p.taskRate === 0)) {
                      updateProject(p.id, "taskRate", 1000);
                    }
                  }}
                />
              }
            />
            {p.pricingModel === "per_task" ? (
              <MetaRow
                k="Rate"
                v={
                  <InlineNumber
                    value={p.taskRate || 0}
                    onChange={(v) => updateProject(p.id, "taskRate", v)}
                    suffix=" $/task"
                  />
                }
              />
            ) : (
              <MetaRow
                k="Rate"
                v={
                  <InlineNumber
                    value={p.avgHourlyRate}
                    onChange={(v) => updateProject(p.id, "avgHourlyRate", v)}
                    suffix=" $/hr"
                  />
                }
              />
            )}
            <MetaRow
              k="Researcher"
              v={p.primaryResearcher ? `${p.primaryResearcher.name}, ${p.primaryResearcher.role}` : "—"}
            />
            <MetaRow
              k="Last QBR"
              v={lastQBR != null ? `${Math.round(lastQBR)}d ago` : "—"}
              warn={lastQBR != null && lastQBR > 30}
            />
            <MetaRow
              k="Last update"
              v={lastUpdate != null ? `${Math.round(lastUpdate)}d ago` : "—"}
              warn={lastUpdate != null && lastUpdate > 3}
            />
            <MetaRow k="Source" v={p.source} />
            <MetaRow k="Region" v={`${p.country} · ${p.region}`} />
            <MetaRow k="Language" v={p.language} />
            <MetaRow k="Timezone" v={p.timezone} />
          </div>
        </div>

        {/* Action bar */}
        <div style={styles.actionBar}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary, fontSize: 12.5, padding: "9px 16px" }}
              onClick={() => runDraft("researcher", { project: p, risk: p.risk })}
            >
              Draft lab-researcher update →
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary, fontSize: 12.5, padding: "9px 16px" }}
              onClick={() => runDraft("slack", { project: p, risk: p.risk })}
            >
              Draft Slack alert
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary, fontSize: 12.5, padding: "9px 16px" }}
              onClick={() => runDraft("calibration", { project: p, risk: p.risk })}
            >
              Calibration post
            </button>
          </div>
          <RemoveButton onConfirm={() => deleteProject(p.id)} />
        </div>
      </div>
    </div>
  );
}

function OutcomeTile({ label, value, sub, valueColor, warn, last }) {
  return (
    <div style={{ ...styles.outcomeTile, borderRight: last ? "none" : `1px solid ${C.hair}` }}>
      <div style={styles.tileLabel}>{label}</div>
      <div style={{ ...styles.tileVal, color: valueColor || (warn ? C.red : C.ink) }}>{value}</div>
      {sub && (
        <div style={{ ...styles.tileSub, color: warn ? C.red : C.muted }}>{sub}</div>
      )}
    </div>
  );
}

function MetaRow({ k, v, warn }) {
  return (
    <div style={styles.metaRow}>
      <div style={styles.metaK}>{k}</div>
      <div style={{ ...styles.metaV, color: warn ? C.red : C.ink }}>{v}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Pipeline stage strip
   ──────────────────────────────────────────────────────────────────── */
function PipelineStrip({ status }) {
  const idx = STATUSES.indexOf(status);
  return (
    <div style={styles.pipeline}>
      {STATUSES.map((s, i) => {
        const past = i < idx;
        const current = i === idx;
        const bg = current ? C.ink : past ? C.cream3 : "transparent";
        const color = current ? "#fff" : past ? C.ink : C.muted2;
        return (
          <div
            key={s}
            style={{
              ...styles.pipelineCell,
              background: bg,
              color,
              borderLeft: i > 0 ? `1px solid ${C.hair}` : "none",
              fontWeight: current ? 600 : 500,
            }}
          >
            <span style={{ marginRight: 6, fontFamily: F.mono, fontSize: 9, opacity: 0.7 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {s}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Team Layer bar
   ──────────────────────────────────────────────────────────────────── */
function TeamLayerBar({ team, risk }) {
  const w = team?.writers || 0;
  const r = team?.reviewers || 0;
  const sr = team?.superReviewers || 0;
  const tl = team?.teamLeads || 0;
  const total = w + r + sr + tl;
  if (total === 0) return null;

  const reviewerTotal = r + sr;
  const ratioLabel = reviewerTotal > 0 ? `1:${(w / reviewerTotal).toFixed(1)}` : "—";
  const ratioBad = risk.reviewerRatio > 6;
  const queueBad = risk.queueDepth > 10;

  const segs = [
    { key: "Writers", count: w, color: C.ink },
    { key: "Reviewers", count: r, color: C.muted },
    { key: "Super-reviewers", count: sr, color: C.amber },
    { key: "Team leads", count: tl, color: C.forest },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div style={styles.cardLabel}>Team layers</div>
        <div style={styles.cardMeta}>
          <span>
            REV:WRITER{" "}
            <strong style={{ color: ratioBad ? C.red : C.ink, fontFamily: F.mono }}>{ratioLabel}</strong>
            <span style={{ color: C.muted2 }}> (tgt 1:5)</span>
          </span>
          <span style={{ marginLeft: 18 }}>
            REVIEW QUEUE{" "}
            <strong style={{ color: queueBad ? C.red : C.ink, fontFamily: F.mono }}>{risk.queueDepth}</strong>
          </span>
        </div>
      </div>
      <div style={styles.teamBar}>
        {segs.map((s) =>
          s.count > 0 ? (
            <div key={s.key} style={{ flex: s.count, background: s.color, height: "100%" }} />
          ) : null
        )}
      </div>
      <div style={styles.teamLegend}>
        {segs.map((s) => (
          <div key={s.key} style={styles.teamLegendItem}>
            <span style={{ ...styles.teamLegendSwatch, background: s.color }} />
            <span>
              <strong style={{ fontFamily: F.mono, color: C.ink }}>{s.count}</strong> {s.key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Ramp Plan card
   ──────────────────────────────────────────────────────────────────── */
function RampPlanCard({ project, risk }) {
  if (!project.rampPlan || project.rampPlan.length === 0) return null;
  const start = new Date(project.startDate);
  const weeksElapsed = Math.max(0, (TODAY - start) / (7 * 864e5));
  const maxTarget = project.rampPlan[project.rampPlan.length - 1].targetCumulative;

  const expected = Math.round(risk.rampTargetNow);
  const actual = project.completed;
  const behind = expected - actual;
  const behindColor =
    behind <= 0 ? C.forest : risk.rampPctBehind > 30 ? C.red : risk.rampPctBehind > 15 ? C.amber : C.ink;

  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div style={styles.cardLabel}>Ramp plan · expected vs actual</div>
        <div style={styles.cardMeta}>
          WEEK <strong style={{ fontFamily: F.mono, color: C.ink }}>{Math.ceil(weeksElapsed)}</strong> /{" "}
          {project.rampPlan.length - 1}
        </div>
      </div>
      <div style={styles.rampBars}>
        {project.rampPlan.slice(1).map((wk, i) => {
          const past = i + 1 <= weeksElapsed;
          const current = Math.ceil(weeksElapsed) === i + 1;
          return (
            <div key={i} style={{ flex: 1 }}>
              <div
                style={{
                  ...styles.rampCell,
                  background: past ? C.cream3 : "transparent",
                  borderColor: current ? C.ink : C.hair,
                }}
              >
                <div
                  style={{
                    ...styles.rampFill,
                    width: `${Math.min(100, (wk.targetCumulative / maxTarget) * 100)}%`,
                    background: current ? C.ink : past ? C.muted : C.muted2,
                    opacity: past ? 0.55 : 0.3,
                  }}
                />
                <div style={styles.rampWeekLabel}>W{i + 1}</div>
                <div
                  style={{
                    ...styles.rampWeekVal,
                    color: current ? C.ink : C.inkSoft,
                  }}
                >
                  {wk.targetCumulative.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={styles.rampSummary}>
        <RampStat label="Expected" value={expected.toLocaleString()} />
        <RampStat label="Actual" value={actual.toLocaleString()} />
        <RampStat
          label={behind > 0 ? "Behind by" : "Ahead by"}
          value={
            <>
              {Math.abs(behind).toLocaleString()}
              <span style={styles.rampPct}>
                {" "}
                · {expected > 0 ? Math.round((actual / expected) * 100) : 100}%
              </span>
            </>
          }
          color={behindColor}
        />
      </div>
    </div>
  );
}

function RampStat({ label, value, color }) {
  return (
    <div>
      <div style={styles.rampStatLabel}>{label}</div>
      <div style={{ ...styles.rampStatVal, color: color || C.ink }}>{value}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Quality Signals card
   ──────────────────────────────────────────────────────────────────── */
function QualitySignalCard({ project }) {
  const k = project.kappa;
  const one = project.oneShotRate;
  const rpt = project.reviewsPerTask;
  const aht = project.aht;
  const ahtT = project.ahtTarget;
  const flagged = project.rubricFlagCount;
  const total = project.completed + (flagged || 0);
  const flagRate = total > 0 ? (flagged / total) * 100 : 0;

  const cell = (label, val, warn, sub, lastCell) => (
    <div
      style={{
        ...styles.qualCell,
        borderRight: lastCell ? "none" : `1px solid ${C.hair}`,
      }}
    >
      <div style={styles.tileLabel}>{label}</div>
      <div style={{ ...styles.tileVal, fontSize: 30, color: warn ? C.red : C.ink }}>{val}</div>
      {sub && <div style={{ ...styles.tileSub, color: C.muted }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ ...styles.card, padding: 0 }}>
      <div style={{ ...styles.cardHead, padding: "12px 18px" }}>
        <div style={styles.cardLabel}>Quality signals</div>
      </div>
      <div style={styles.qualGrid}>
        {cell(
          "Kappa (IAA)",
          k != null ? k.toFixed(2) : "—",
          k != null && k < 0.7,
          k != null ? (k >= 0.7 ? "above 0.7 target" : "below 0.7 target") : "n/a"
        )}
        {cell("One-shot", one != null ? `${one}%` : "—", one != null && one < 70, "70% bar")}
        {cell("Reviews/task", rpt != null ? rpt.toFixed(1) : "—", rpt > 3, "tgt ≤ 2")}
        {cell("AHT (hrs)", aht != null ? aht.toFixed(1) : "—", aht && ahtT && aht > ahtT * 1.2, `${ahtT}h target`)}
        {cell("Flag rate", `${Math.round(flagRate)}%`, flagRate > 15, `${flagged || 0} flagged`, true)}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Onboarding Funnel card
   ──────────────────────────────────────────────────────────────────── */
function OnboardingFunnelCard({ project }) {
  const f = project.onboardingFunnel;
  if (!f) return null;
  const stages = [
    { key: "Applicants", val: f.applicants },
    { key: "Approved", val: f.approved },
    { key: "Onboarded", val: f.onboarded },
    { key: "Active", val: f.active },
    { key: "QC-passed", val: f.qcPassed },
    { key: "Retained", val: f.retained },
  ];
  const ttft = project.timeToFirstTask || 0;
  const ttftBad = ttft > 48;

  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div style={styles.cardLabel}>Onboarding funnel</div>
        <div style={styles.cardMeta}>
          TIME-TO-FIRST-TASK{" "}
          <strong style={{ color: ttftBad ? C.red : C.ink, fontFamily: F.mono }}>{ttft}h</strong>
          <span style={{ color: C.muted2 }}> (tgt &lt; 48h)</span>
        </div>
      </div>
      <div style={styles.funnel}>
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].val : null;
          const conv = prev && prev > 0 ? (s.val / prev) * 100 : null;
          const convWarn = conv != null && conv < 55;
          const max = stages[0].val;
          const h = max > 0 ? (s.val / max) * 100 : 0;
          return (
            <div key={s.key} style={styles.funnelGroup}>
              <div style={styles.funnelStage}>
                <div
                  style={{
                    ...styles.funnelBar,
                    height: `${Math.max(20, h * 0.55 + 14)}px`,
                    background: i === stages.length - 1 ? C.ink : C.cream3,
                    color: i === stages.length - 1 ? "#fff" : C.ink,
                  }}
                >
                  {s.val.toLocaleString()}
                </div>
                <div style={styles.funnelLabel}>{s.key}</div>
              </div>
              {i < stages.length - 1 && (
                <div style={styles.funnelArrow}>
                  <div
                    style={{
                      fontFamily: F.mono,
                      fontSize: 10,
                      fontWeight: 600,
                      color: convWarn ? C.red : C.muted,
                    }}
                  >
                    {conv != null ? `${Math.round(conv)}%` : ""}
                  </div>
                  <div style={{ color: C.muted2 }}>→</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   AI panel
   ──────────────────────────────────────────────────────────────────── */
function AIPanel({ p, ai, onGenerate }) {
  const hasContent = !!(ai && ai.summary);
  const loading = !!(ai && ai.loading);
  const errored = !!(ai && ai.error);

  const placeholderBody = `Per-test reward at ${p.perTestRewardAvg.toFixed(2)} with binary pass rate at ${p.binaryPassRate.toFixed(2)} suggests the rubric is grading trajectory shape but not terminal state. Rubric-coverage problem, not a contributor problem.`;
  const placeholderAction =
    "Run Docent over last 48 failed trajectories, cluster on tool-selection errors, extend the verifier test suite before opening a new sourcing wave.";

  return (
    <div style={styles.aiPanel}>
      <div style={styles.aiPanelHeader}>
        <span style={styles.aiPanelHeaderLabel}>AI assessment</span>
        <span style={styles.aiPanelHeaderMeta}>Claude Sonnet 4.6</span>
      </div>
      <div style={styles.aiPanelInner}>
        <div
          style={{
            ...styles.aiContent,
            filter: hasContent ? "none" : "blur(5px)",
            opacity: hasContent ? 1 : 0.55,
          }}
        >
          <div style={styles.aiBody}>{hasContent ? ai.summary : placeholderBody}</div>
          <div style={styles.aiAction}>
            <strong style={{ color: C.ink, fontWeight: 500 }}>Recommended action. </strong>
            {hasContent ? ai.action : placeholderAction}
          </div>
        </div>
        {!hasContent && (
          <div style={styles.aiOverlay}>
            {errored ? (
              <>
                <div style={styles.aiOverlayError}>AI unavailable: {ai.error}</div>
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary, fontSize: 12.5 }}
                  onClick={onGenerate}
                >
                  Try again →
                </button>
              </>
            ) : (
              <button
                style={{ ...styles.btn, ...styles.btnPrimary, fontSize: 13 }}
                onClick={onGenerate}
                disabled={loading}
              >
                {loading ? "Generating…" : "Generate AI assessment →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Inline editing primitives
   ──────────────────────────────────────────────────────────────────── */
function InlineNumber({ value, onChange, suffix = "", min = 0, max = 99999, step = 1 }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.select();
  }, [editing]);

  if (!editing) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setDraft(value);
          setEditing(true);
        }}
        style={styles.inlineEditable}
        title="Click to edit"
      >
        {value}
        {suffix}
      </span>
    );
  }
  return (
    <input
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      value={draft}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(Number(e.target.value))}
      onBlur={() => {
        onChange(Math.max(min, Math.min(max, draft)));
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onChange(Math.max(min, Math.min(max, draft)));
          setEditing(false);
        }
        if (e.key === "Escape") setEditing(false);
      }}
      style={styles.inlineInput}
    />
  );
}

function InlineSelect({ value, options, onChange }) {
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        style={styles.inlineEditable}
        title="Click to edit"
      >
        {value}
      </span>
    );
  }
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        onChange(e.target.value);
        setEditing(false);
      }}
      onBlur={() => setEditing(false)}
      autoFocus
      style={styles.inlineInput}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Remove confirm
   ──────────────────────────────────────────────────────────────────── */
function RemoveButton({ onConfirm }) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setArmed(true);
        }}
        style={styles.removeGhost}
      >
        Remove project
      </button>
    );
  }
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: C.red, fontFamily: F.mono, letterSpacing: "0.04em" }}>
        Remove?
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onConfirm();
        }}
        style={{
          ...styles.btn,
          background: C.red,
          color: "#fff",
          fontSize: 11,
          padding: "5px 12px",
        }}
      >
        Delete
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setArmed(false);
        }}
        style={{
          ...styles.btn,
          ...styles.btnSecondary,
          fontSize: 11,
          padding: "5px 12px",
        }}
      >
        Cancel
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Add Project Modal
   ──────────────────────────────────────────────────────────────────── */
function AddProjectModal({ close, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    lab: "",
    project: "",
    capabilityGap: "",
    failureMode: "",
    productType: "SFT + CoT Demonstrations",
    benchmarkTarget: "Custom",
    domain: "Software Engineering",
    credentialBar: "",
    modality: "Text",
    targetTasks: 500,
    completed: 0,
    perTestRewardAvg: 0.6,
    binaryPassRate: 0.4,
    expertVettingPassRate: 22,
    rubricFlagCount: 0,
    expertCount: 0,
    writers: 0,
    reviewers: 0,
    superReviewers: 0,
    teamLeads: 0,
    kappa: 0.75,
    oneShotRate: 70,
    reviewsPerTask: 2,
    reviewQueueDepth: 0,
    aht: 5,
    ahtTarget: 5,
    timeToFirstTask: 24,
    pricingModel: "hourly",
    avgHourlyRate: 150,
    taskRate: 0,
    primaryName: "",
    primaryRole: "",
    country: "United States",
    language: "English",
    region: "NAMER",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "Sourcing",
    startDate: today,
    deadline: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.lab.trim() && form.project.trim() && form.deadline;

  function handleSave(e) {
    e.preventDefault();
    if (!valid) return;
    const t = Number(form.targetTasks) || 0;
    const isRubric = form.productType.includes("Rubric") || form.productType.includes("RLHF");
    onSave({
      lab: form.lab,
      project: form.project,
      capabilityGap: form.capabilityGap,
      failureMode: form.failureMode,
      productType: form.productType,
      benchmarkTarget: form.benchmarkTarget,
      domain: form.domain,
      credentialBar: form.credentialBar,
      modality: form.modality,
      targetTasks: t,
      completed: Number(form.completed) || 0,
      rampPlan: [
        { week: 0, targetCumulative: 0 },
        { week: 1, targetCumulative: Math.round(t * 0.1) },
        { week: 2, targetCumulative: Math.round(t * 0.35) },
        { week: 3, targetCumulative: Math.round(t * 0.7) },
        { week: 4, targetCumulative: t },
      ],
      perTestRewardAvg: Number(form.perTestRewardAvg) || 0,
      binaryPassRate: Number(form.binaryPassRate) || 0,
      expertVettingPassRate: Number(form.expertVettingPassRate) || 0,
      rubricFlagCount: Number(form.rubricFlagCount) || 0,
      expertCount: Number(form.expertCount) || 0,
      team: {
        writers: Number(form.writers) || 0,
        reviewers: Number(form.reviewers) || 0,
        superReviewers: Number(form.superReviewers) || 0,
        teamLeads: Number(form.teamLeads) || 0,
      },
      kappa: isRubric ? Number(form.kappa) : null,
      oneShotRate: Number(form.oneShotRate) || 0,
      reviewsPerTask: Number(form.reviewsPerTask) || 0,
      reviewQueueDepth: Number(form.reviewQueueDepth) || 0,
      aht: Number(form.aht) || 0,
      ahtTarget: Number(form.ahtTarget) || 0,
      onboardingFunnel: null,
      timeToFirstTask: Number(form.timeToFirstTask) || 0,
      pricingModel: form.pricingModel,
      avgHourlyRate: Number(form.avgHourlyRate) || 0,
      taskRate: form.pricingModel === "per_task" ? Number(form.taskRate) || 0 : null,
      primaryResearcher: form.primaryName.trim()
        ? { name: form.primaryName.trim(), role: form.primaryRole.trim() || "Researcher" }
        : null,
      lastUpdateAt: new Date().toISOString(),
      lastQBRAt: null,
      country: form.country,
      language: form.language,
      region: form.region,
      timezone: form.timezone,
      source: form.source,
      status: form.status,
      startDate: form.startDate,
      deadline: form.deadline,
    });
  }

  return (
    <div style={styles.modalScrim} onClick={close}>
      <form
        style={{ ...styles.modal, maxWidth: 920 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
      >
        <div style={styles.modalHead}>
          <div>
            <div style={styles.modalLabel}>NEW_PROJECT</div>
            <div style={styles.modalTitle}>Onboard a new engagement</div>
          </div>
          <button type="button" style={styles.modalClose} onClick={close}>✕</button>
        </div>

        <div style={styles.formGrid}>
          <Field label="Lab">
            <select style={styles.input} value={form.lab} onChange={(e) => update("lab", e.target.value)} required>
              <option value="">Select…</option>
              {LABS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select style={styles.input} value={form.status} onChange={(e) => update("status", e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Project name" full>
            <input
              style={styles.input}
              value={form.project}
              onChange={(e) => update("project", e.target.value)}
              placeholder="Copilot Enterprise Excel Custom Eval"
              required
            />
          </Field>

          <Field label="Capability gap" full>
            <textarea
              style={{ ...styles.input, minHeight: 56, resize: "vertical" }}
              value={form.capabilityGap}
              onChange={(e) => update("capabilityGap", e.target.value)}
              placeholder="What the data actually trains."
            />
          </Field>
          <Field label="Failure mode" full>
            <textarea
              style={{ ...styles.input, minHeight: 56, resize: "vertical" }}
              value={form.failureMode}
              onChange={(e) => update("failureMode", e.target.value)}
              placeholder="What the model can't do today."
            />
          </Field>

          <Field label="Product type">
            <select
              style={styles.input}
              value={form.productType}
              onChange={(e) => update("productType", e.target.value)}
            >
              {PRODUCT_TYPES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Benchmark target">
            <select
              style={styles.input}
              value={form.benchmarkTarget}
              onChange={(e) => update("benchmarkTarget", e.target.value)}
            >
              {BENCHMARKS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>

          <Field label="Domain">
            <input style={styles.input} value={form.domain} onChange={(e) => update("domain", e.target.value)} />
          </Field>
          <Field label="Modality">
            <select style={styles.input} value={form.modality} onChange={(e) => update("modality", e.target.value)}>
              {MODALITIES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>

          <Field label="Credential bar" full>
            <input
              style={styles.input}
              value={form.credentialBar}
              onChange={(e) => update("credentialBar", e.target.value)}
              placeholder="MD, US board certified, 3+ yr clinical"
            />
          </Field>

          <Field label="Target tasks">
            <input type="number" min="1" style={styles.input} value={form.targetTasks} onChange={(e) => update("targetTasks", e.target.value)} />
          </Field>
          <Field label="Completed">
            <input type="number" min="0" style={styles.input} value={form.completed} onChange={(e) => update("completed", e.target.value)} />
          </Field>

          <Field label="Per-test reward (0–1)">
            <input type="number" min="0" max="1" step="0.01" style={styles.input} value={form.perTestRewardAvg} onChange={(e) => update("perTestRewardAvg", e.target.value)} />
          </Field>
          <Field label="Binary pass rate (0–1)">
            <input type="number" min="0" max="1" step="0.01" style={styles.input} value={form.binaryPassRate} onChange={(e) => update("binaryPassRate", e.target.value)} />
          </Field>

          <Field label="Vetting pass rate (%)">
            <input type="number" min="0" max="100" style={styles.input} value={form.expertVettingPassRate} onChange={(e) => update("expertVettingPassRate", e.target.value)} />
          </Field>
          <Field label="Rubric flags">
            <input type="number" min="0" style={styles.input} value={form.rubricFlagCount} onChange={(e) => update("rubricFlagCount", e.target.value)} />
          </Field>

          <Field label="Writers">
            <input type="number" min="0" style={styles.input} value={form.writers} onChange={(e) => update("writers", e.target.value)} />
          </Field>
          <Field label="Reviewers">
            <input type="number" min="0" style={styles.input} value={form.reviewers} onChange={(e) => update("reviewers", e.target.value)} />
          </Field>
          <Field label="Super-reviewers">
            <input type="number" min="0" style={styles.input} value={form.superReviewers} onChange={(e) => update("superReviewers", e.target.value)} />
          </Field>
          <Field label="Team leads">
            <input type="number" min="0" style={styles.input} value={form.teamLeads} onChange={(e) => update("teamLeads", e.target.value)} />
          </Field>

          {(form.productType.includes("Rubric") || form.productType.includes("RLHF")) && (
            <Field label="Kappa (IAA)">
              <input type="number" min="0" max="1" step="0.01" style={styles.input} value={form.kappa} onChange={(e) => update("kappa", e.target.value)} />
            </Field>
          )}
          <Field label="One-shot %">
            <input type="number" min="0" max="100" style={styles.input} value={form.oneShotRate} onChange={(e) => update("oneShotRate", e.target.value)} />
          </Field>
          <Field label="Reviews/task">
            <input type="number" min="0" step="0.1" style={styles.input} value={form.reviewsPerTask} onChange={(e) => update("reviewsPerTask", e.target.value)} />
          </Field>
          <Field label="Review queue">
            <input type="number" min="0" style={styles.input} value={form.reviewQueueDepth} onChange={(e) => update("reviewQueueDepth", e.target.value)} />
          </Field>

          <Field label="AHT (hrs)">
            <input type="number" min="0" step="0.1" style={styles.input} value={form.aht} onChange={(e) => update("aht", e.target.value)} />
          </Field>
          <Field label="AHT target (hrs)">
            <input type="number" min="0" step="0.1" style={styles.input} value={form.ahtTarget} onChange={(e) => update("ahtTarget", e.target.value)} />
          </Field>

          <Field label="Pricing model">
            <select style={styles.input} value={form.pricingModel} onChange={(e) => update("pricingModel", e.target.value)}>
              {PRICING_MODELS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </Field>
          {form.pricingModel === "hourly" ? (
            <Field label="Hourly rate ($)">
              <input type="number" min="0" style={styles.input} value={form.avgHourlyRate} onChange={(e) => update("avgHourlyRate", e.target.value)} />
            </Field>
          ) : (
            <Field label="Rate ($/task)">
              <input type="number" min="0" style={styles.input} value={form.taskRate} onChange={(e) => update("taskRate", e.target.value)} />
            </Field>
          )}

          <Field label="Researcher name">
            <input style={styles.input} value={form.primaryName} onChange={(e) => update("primaryName", e.target.value)} placeholder="Maya Rao" />
          </Field>
          <Field label="Researcher role">
            <input style={styles.input} value={form.primaryRole} onChange={(e) => update("primaryRole", e.target.value)} placeholder="MTS, RL Trajectory" />
          </Field>

          <Field label="Source">
            <select style={styles.input} value={form.source} onChange={(e) => update("source", e.target.value)}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Region">
            <input style={styles.input} value={form.region} onChange={(e) => update("region", e.target.value)} />
          </Field>

          <Field label="Country">
            <input style={styles.input} value={form.country} onChange={(e) => update("country", e.target.value)} />
          </Field>
          <Field label="Language">
            <input style={styles.input} value={form.language} onChange={(e) => update("language", e.target.value)} />
          </Field>

          <Field label="Start date">
            <input type="date" style={styles.input} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
          </Field>
          <Field label="Deadline">
            <input type="date" style={styles.input} value={form.deadline} onChange={(e) => update("deadline", e.target.value)} required />
          </Field>
        </div>

        <div style={styles.formActions}>
          <button type="button" style={{ ...styles.btn, ...styles.btnSecondary }} onClick={close}>
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...styles.btn,
              ...(valid ? styles.btnPrimary : { background: C.cream3, color: C.muted2, cursor: "not-allowed" }),
            }}
            disabled={!valid}
          >
            Onboard project →
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Draft modal
   ──────────────────────────────────────────────────────────────────── */
function DraftModal({ state, close }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(state.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <div style={styles.modalScrim} onClick={close}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <div>
            <div style={styles.modalLabel}>{state.label}</div>
            <div style={styles.modalTitle}>
              {state.loading && !state.text ? "Drafting via Claude Sonnet 4.6" : state.label}
            </div>
          </div>
          <button style={styles.modalClose} onClick={close}>✕</button>
        </div>
        {state.error ? (
          <div style={styles.modalError}>AI unavailable: {state.error}</div>
        ) : (
          <pre style={styles.modalBody}>
            {state.text || (state.loading ? "Drafting…" : "")}
          </pre>
        )}
        {state.text && !state.error && (
          <div style={styles.modalFooter}>
            <button style={{ ...styles.btn, ...styles.btnSecondary, fontSize: 12 }} onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={styles.footer}>
      <div>AFTERQUERY SPL OPS CONSOLE · APPLICATION ARTIFACT · ZI</div>
      <div>Claude Sonnet 4.6 · 12-signal deterministic risk engine</div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    background: C.cream,
    color: C.ink,
    fontFamily: F.sans,
    fontSize: 14,
    lineHeight: 1.45,
    minHeight: "100vh",
    WebkitFontSmoothing: "antialiased",
  },
  banner: {
    background: C.cream2,
    borderBottom: `1px solid ${C.hair}`,
    padding: "8px 48px",
    fontSize: 11.5,
    color: C.inkSoft,
    fontFamily: F.mono,
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bannerDot: { width: 5, height: 5, borderRadius: "50%", background: C.ink },

  header: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    padding: "22px 48px 20px",
    gap: 24,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: F.serif,
    fontWeight: 500,
    fontSize: 19,
    letterSpacing: "-0.01em",
    fontVariationSettings: '"opsz" 36',
  },
  logoMark: { position: "relative", width: 22, height: 16, display: "inline-block" },
  logoBar: { position: "absolute", bottom: 0, width: 4, background: C.ink, borderRadius: 1 },
  logoDivider: { width: 1, height: 16, background: C.hairStrong, margin: "0 4px" },
  logoProduct: {
    fontFamily: F.sans,
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.muted,
  },
  headerRight: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  liveStrip: {
    fontFamily: F.mono,
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.04em",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    marginRight: 10,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  },

  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    borderRadius: 9999,
    fontSize: 13.5,
    fontWeight: 500,
    padding: "10px 18px",
    cursor: "pointer",
    fontFamily: F.sans,
    letterSpacing: "0.005em",
  },
  btnPrimary: { background: C.ink, color: "#fff" },
  btnSecondary: { background: C.cream3, color: C.ink },
  btnWarRoomActive: { background: C.red, color: "#fff" },

  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderTop: `1px solid ${C.hairStrong}`,
    borderBottom: `1px solid ${C.hairStrong}`,
    margin: "44px 48px 0",
  },
  metric: {
    padding: "44px 32px 40px 32px",
    borderRight: `1px solid ${C.hair}`,
  },
  metricNum: {
    fontFamily: F.serif,
    fontWeight: 400,
    fontSize: 88,
    lineHeight: 0.92,
    letterSpacing: "-0.035em",
    fontVariationSettings: '"opsz" 144',
  },
  metricLabel: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginTop: 22,
    fontWeight: 500,
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "44px 48px 16px",
    gap: 24,
    flexWrap: "wrap",
  },
  toolbarLeft: { display: "flex", alignItems: "center", gap: 22 },
  toolbarTitle: {
    fontFamily: F.serif,
    fontSize: 22,
    fontWeight: 400,
    fontVariationSettings: '"opsz" 36',
    letterSpacing: "-0.01em",
    color: C.ink,
  },
  search: {
    width: 320,
    background: C.cream,
    border: `1px solid ${C.hairStrong}`,
    borderRadius: 9999,
    padding: "8px 14px",
    fontFamily: F.sans,
    fontSize: 12.5,
    color: C.ink,
    outline: "none",
  },
  filters: { display: "flex", gap: 6 },
  chip: {
    fontSize: 12.5,
    padding: "6px 14px",
    borderRadius: 9999,
    border: `1px solid ${C.hairStrong}`,
    color: C.ink,
    background: "transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontFamily: F.sans,
    fontWeight: 500,
  },
  chipActive: { background: C.ink, color: "#fff", borderColor: C.ink },
  chipN: { fontFamily: F.mono, fontSize: 11 },

  table: { margin: "0 48px 48px" },
  row: {
    display: "grid",
    gridTemplateColumns: "3px 1.7fr 1.5fr 1fr 0.8fr 0.9fr 0.85fr 0.5fr",
    alignItems: "center",
    gap: 20,
    padding: "18px 0",
    borderBottom: `1px solid ${C.hair}`,
  },
  tableHead: {
    padding: "12px 0",
    borderBottom: `1px solid ${C.hairStrong}`,
    borderTop: `1px solid ${C.hairStrong}`,
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  riskMarker: { width: 3, height: 28, borderRadius: 2 },
  cellLab: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 3,
  },
  cellTitle: {
    fontFamily: F.serif,
    fontSize: 17,
    fontVariationSettings: '"opsz" 24',
    fontWeight: 400,
    letterSpacing: "-0.005em",
    lineHeight: 1.2,
  },
  cellCapability: { color: C.muted, fontSize: 13, lineHeight: 1.4 },
  cellProduct: { fontSize: 12.5, color: C.ink },
  bench: {
    display: "inline-block",
    marginTop: 5,
    fontFamily: F.mono,
    fontSize: 10.5,
    letterSpacing: "0.02em",
    padding: "2px 7px",
    border: `1px solid ${C.hairStrong}`,
    borderRadius: 9999,
    color: C.inkSoft,
  },
  benchPrimary: { background: C.ink, color: "#fff", borderColor: C.ink },
  cellPtr: { fontFamily: F.mono, fontSize: 18, fontWeight: 500, fontVariantNumeric: "tabular-nums" },
  cellPtrBinary: {
    display: "block",
    fontSize: 10.5,
    color: C.muted,
    marginTop: 2,
    fontWeight: 400,
  },
  cellTasks: { fontFamily: F.mono, fontSize: 12.5, display: "flex", flexDirection: "column", gap: 5 },
  bar: { width: "100%", height: 2, background: C.hair, overflow: "hidden" },
  barFill: { display: "block", height: "100%", background: C.ink },
  cellDeadline: { fontFamily: F.mono, fontSize: 12.5, lineHeight: 1.3 },
  cellDeadlineSub: { fontSize: 11, color: C.muted2, marginTop: 2 },
  cellCaret: {
    display: "flex",
    justifyContent: "flex-end",
    color: C.muted2,
    fontSize: 16,
    lineHeight: 1,
    transition: "transform 0.15s",
  },

  emptyState: {
    padding: "56px 24px",
    textAlign: "center",
    color: C.muted,
    fontSize: 13,
    borderBottom: `1px solid ${C.hair}`,
  },

  detail: {
    background: C.cream2,
    borderBottom: `1px solid ${C.hairStrong}`,
  },
  detailInner: { padding: "26px 48px 36px" },

  contextGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 14,
  },
  contextCard: {
    background: C.cream,
    border: `1px solid ${C.hair}`,
    borderLeft: `3px solid`,
    borderRadius: 3,
    padding: "12px 16px",
  },
  contextLabel: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 6,
    fontFamily: F.mono,
  },
  contextBody: { fontSize: 13.5, lineHeight: 1.55, color: C.ink },

  outcomeStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    background: C.cream,
    border: `1px solid ${C.hair}`,
    borderRadius: 3,
    marginBottom: 12,
  },
  outcomeTile: { padding: "16px 18px", borderRight: `1px solid ${C.hair}` },
  tileLabel: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 8,
    fontFamily: F.mono,
  },
  tileVal: {
    fontFamily: F.mono,
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1.05,
  },
  tileSub: { marginTop: 6, fontFamily: F.mono, fontSize: 11, color: C.muted },

  card: {
    background: C.cream,
    border: `1px solid ${C.hair}`,
    borderRadius: 3,
    padding: "14px 18px",
    marginBottom: 12,
  },
  cardHead: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: F.mono,
  },
  cardMeta: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.06em",
    fontFamily: F.mono,
    textTransform: "uppercase",
  },

  pipeline: {
    display: "flex",
    background: C.cream,
    border: `1px solid ${C.hair}`,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  pipelineCell: {
    flex: 1,
    padding: "10px 12px",
    fontSize: 10.5,
    fontFamily: F.mono,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textAlign: "center",
    transition: "background 0.15s",
  },

  teamBar: {
    display: "flex",
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
    background: C.cream2,
  },
  teamLegend: { display: "flex", gap: 22, flexWrap: "wrap" },
  teamLegendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted },
  teamLegendSwatch: { width: 8, height: 8, borderRadius: 1 },

  rampBars: { display: "flex", gap: 6, marginBottom: 12 },
  rampCell: {
    height: 38,
    background: C.cream,
    border: "1px solid",
    borderRadius: 2,
    padding: "5px 7px",
    position: "relative",
    overflow: "hidden",
  },
  rampFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
  },
  rampWeekLabel: { fontSize: 9.5, color: C.muted2, fontFamily: F.mono, letterSpacing: "0.04em" },
  rampWeekVal: { fontSize: 11.5, fontWeight: 600, fontFamily: F.mono, marginTop: 2 },
  rampSummary: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 14,
    paddingTop: 10,
    borderTop: `1px solid ${C.hair}`,
  },
  rampStatLabel: {
    fontSize: 9.5,
    color: C.muted,
    letterSpacing: "0.14em",
    fontFamily: F.mono,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rampStatVal: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: F.mono,
    letterSpacing: "-0.01em",
  },
  rampPct: { fontSize: 11, color: C.muted, fontWeight: 500 },

  qualGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderTop: `1px solid ${C.hair}` },
  qualCell: { padding: "14px 16px" },

  funnel: { display: "flex", alignItems: "flex-end" },
  funnelGroup: { flex: 1, display: "flex", alignItems: "flex-end" },
  funnelStage: { flex: 1, textAlign: "center" },
  funnelBar: {
    border: `1px solid ${C.hair}`,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: F.mono,
    marginBottom: 4,
  },
  funnelLabel: {
    fontSize: 9,
    color: C.muted,
    fontFamily: F.mono,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  funnelArrow: {
    padding: "0 6px",
    textAlign: "center",
    alignSelf: "center",
    minWidth: 38,
  },

  detailBody: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 18,
    marginBottom: 14,
  },

  metaCol: {
    background: C.cream,
    border: `1px solid ${C.hair}`,
    borderRadius: 3,
    overflow: "hidden",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 14px",
    borderBottom: `1px solid ${C.hair}`,
    minHeight: 32,
  },
  metaK: {
    fontSize: 10,
    color: C.muted,
    fontWeight: 500,
    letterSpacing: "0.12em",
    fontFamily: F.mono,
    textTransform: "uppercase",
  },
  metaV: {
    fontSize: 12.5,
    color: C.ink,
    textAlign: "right",
    maxWidth: "62%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  code: {
    fontFamily: F.mono,
    fontSize: 11.5,
    background: C.cream3,
    padding: "1px 6px",
    borderRadius: 3,
  },

  inlineEditable: {
    cursor: "text",
    borderBottom: `1px dashed ${C.hairStrong}`,
    paddingBottom: 1,
  },
  inlineInput: {
    padding: "2px 6px",
    border: `1px solid ${C.ink}`,
    borderRadius: 2,
    fontSize: 12.5,
    fontFamily: F.sans,
    background: C.cream,
    outline: "none",
    width: 90,
  },

  aiPanel: {
    border: `1px solid ${C.hairStrong}`,
    background: C.cream,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    minHeight: 220,
  },
  aiPanelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    borderBottom: `1px solid ${C.hair}`,
    background: C.cream2,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  aiPanelHeaderLabel: {
    fontFamily: F.serif,
    fontSize: 13,
    fontWeight: 500,
    fontVariationSettings: '"opsz" 14',
    letterSpacing: "-0.005em",
    color: C.ink,
  },
  aiPanelHeaderMeta: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
  },
  aiPanelInner: { position: "relative", padding: "22px 24px", flex: 1, overflow: "hidden" },
  aiContent: { transition: "filter 0.35s ease, opacity 0.35s ease" },
  aiOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background:
      "linear-gradient(180deg, rgba(246,245,238,0.10) 0%, rgba(246,245,238,0.45) 50%, rgba(246,245,238,0.65) 100%)",
  },
  aiOverlayError: {
    fontFamily: F.mono,
    fontSize: 11.5,
    color: C.red,
    maxWidth: 320,
    textAlign: "center",
    background: C.cream,
    padding: "6px 10px",
    borderRadius: 3,
    border: `1px solid ${C.hairStrong}`,
  },
  aiBody: {
    fontFamily: F.serif,
    fontVariationSettings: '"opsz" 14',
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  aiAction: {
    paddingTop: 14,
    borderTop: `1px dashed ${C.hairStrong}`,
    fontSize: 13,
    color: C.muted,
    lineHeight: 1.5,
  },

  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  removeGhost: {
    background: "transparent",
    border: "none",
    color: C.muted2,
    fontSize: 11.5,
    fontFamily: F.mono,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "6px 4px",
  },

  modalScrim: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,10,10,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 24,
  },
  modal: {
    background: C.cream,
    maxWidth: 720,
    width: "100%",
    maxHeight: "84vh",
    borderRadius: 4,
    border: `1px solid ${C.hairStrong}`,
    padding: "20px 24px 24px",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  modalLabel: {
    fontFamily: F.mono,
    fontSize: 10.5,
    letterSpacing: "0.14em",
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: F.serif,
    fontSize: 17,
    fontWeight: 500,
    fontVariationSettings: '"opsz" 24',
    letterSpacing: "-0.01em",
    color: C.ink,
  },
  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    color: C.muted,
    cursor: "pointer",
  },
  modalBody: {
    fontFamily: F.serif,
    fontVariationSettings: '"opsz" 14',
    fontSize: 14.5,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    color: C.ink,
    margin: 0,
    padding: "16px 18px",
    background: C.cream2,
    border: `1px solid ${C.hair}`,
    borderRadius: 3,
  },
  modalError: { fontFamily: F.mono, fontSize: 12.5, color: C.red, padding: "12px 0" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px 20px",
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 6,
    fontFamily: F.mono,
  },
  input: {
    width: "100%",
    background: C.cream,
    border: `1px solid ${C.hairStrong}`,
    borderRadius: 4,
    padding: "9px 11px",
    fontFamily: F.sans,
    fontSize: 13,
    color: C.ink,
    outline: "none",
    boxSizing: "border-box",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 16,
    borderTop: `1px solid ${C.hair}`,
  },

  footer: {
    padding: "32px 48px 40px",
    borderTop: `1px solid ${C.hair}`,
    fontSize: 11,
    color: C.muted,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: F.mono,
    letterSpacing: "0.08em",
  },
};
