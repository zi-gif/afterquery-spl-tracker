"use client";

import { useState, useMemo } from "react";

// ────────────────────────────────────────────────────────────────────
// Tokens
// ────────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────
// Seed data (12 projects, 2 RED / 4 YELLOW / 6 GREEN)
// ────────────────────────────────────────────────────────────────────
const DEFAULT_PROJECTS = [
  {
    id: "p1",
    lab: "OpenAI",
    project: "Terminal-Bench 2.0 Tool-calling RL Environment",
    capabilityGap: "Long-horizon terminal agent reasoning under filesystem and network state.",
    productType: "Tool-calling RL Env",
    benchmarkTarget: "Terminal-Bench 2.0",
    credentialBar: "FAANG L6+, 5+ yr infra, prior terminal-agent exposure preferred.",
    modality: "Code · Tool-calling (MCP)",
    targetTasks: 500,
    completed: 184,
    expertVettingPassRate: 8,
    perTestRewardAvg: 0.31,
    binaryPassRate: 0.08,
    rubricFlagCount: 31,
    completedOrFlagged: 215,
    expertCount: 14,
    avgHourlyRate: 145,
    country: "US/EU",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "42h",
    deadlineSub: "May 3 · 17:00 PT",
  },
  {
    id: "p2",
    lab: "Google DeepMind",
    project: "Olympiad Math Rubric & Verifier Authoring",
    capabilityGap: "Proof-level mathematical reasoning with stepwise verifier.",
    productType: "Rubric & Verifier-based RL",
    benchmarkTarget: "Custom",
    credentialBar: "IMO / USAMO medalists, or PhD pure math.",
    modality: "Text",
    targetTasks: 200,
    completed: 92,
    expertVettingPassRate: 11,
    perTestRewardAvg: 0.38,
    binaryPassRate: 0.12,
    rubricFlagCount: 24,
    completedOrFlagged: 116,
    expertCount: 9,
    avgHourlyRate: 180,
    country: "US/UK",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "Community Referral",
    status: "Rubric Review",
    deadlineLabel: "6d",
    deadlineSub: "Apr 28 · 09:00 PT",
  },
  {
    id: "p3",
    lab: "Anthropic",
    project: "Clinical Reasoning SFT with Chain-of-Thought",
    capabilityGap: "Stepwise differential diagnosis from patient history.",
    productType: "SFT + CoT Demonstrations",
    benchmarkTarget: "Custom",
    credentialBar: "MD, 3+ yr clinical, US board certified.",
    modality: "Text",
    targetTasks: 600,
    completed: 412,
    expertVettingPassRate: 22,
    perTestRewardAvg: 0.57,
    binaryPassRate: 0.41,
    rubricFlagCount: 42,
    completedOrFlagged: 454,
    expertCount: 28,
    avgHourlyRate: 210,
    country: "US",
    language: "English",
    region: "NAMER",
    timezone: "ET",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "11d",
    deadlineSub: "May 3 · 17:00 PT",
  },
  {
    id: "p4",
    lab: "xAI",
    project: "Market-Bench Trajectory Labeling",
    capabilityGap: "Introductory quantitative trading trajectories with outcome labels.",
    productType: "Trajectory Labeling",
    benchmarkTarget: "Market-Bench",
    credentialBar: "IB analyst or quant, CFA or MFE preferred.",
    modality: "Text · Code",
    targetTasks: 150,
    completed: 67,
    expertVettingPassRate: 18,
    perTestRewardAvg: 0.49,
    binaryPassRate: 0.28,
    rubricFlagCount: 9,
    completedOrFlagged: 76,
    expertCount: 11,
    avgHourlyRate: 165,
    country: "US",
    language: "English",
    region: "NAMER",
    timezone: "ET",
    source: "Lab BYO Roster",
    status: "In-Production",
    deadlineLabel: "9d",
    deadlineSub: "May 1 · 12:00 PT",
  },
  {
    id: "p5",
    lab: "Microsoft",
    project: "Copilot Enterprise Excel Custom Eval",
    capabilityGap: "M&A model stress-testing, three-statement integrity checks.",
    productType: "Custom Eval",
    benchmarkTarget: "Custom",
    credentialBar: "IB associate or VP, 3+ yr M&A modeling.",
    modality: "Code · Text",
    targetTasks: 450,
    completed: 318,
    expertVettingPassRate: 24,
    perTestRewardAvg: 0.61,
    binaryPassRate: 0.44,
    rubricFlagCount: 18,
    completedOrFlagged: 336,
    expertCount: 19,
    avgHourlyRate: 175,
    country: "US/UK",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "14d",
    deadlineSub: "May 6 · 17:00 PT",
  },
  {
    id: "p6",
    lab: "Amazon",
    project: "Bedrock Agent Tool-calling RL Environment on MCP",
    capabilityGap: "Multi-tool service workflows across AWS primitives.",
    productType: "Tool-calling RL Env",
    benchmarkTarget: "Custom",
    credentialBar: "AWS senior engineer, 4+ yr, MCP familiarity.",
    modality: "Tool-calling (API/MCP)",
    targetTasks: 400,
    completed: 201,
    expertVettingPassRate: 16,
    perTestRewardAvg: 0.54,
    binaryPassRate: 0.35,
    rubricFlagCount: 22,
    completedOrFlagged: 223,
    expertCount: 16,
    avgHourlyRate: 155,
    country: "US",
    language: "English",
    region: "NAMER",
    timezone: "PT",
    source: "Partner Vendor",
    status: "In-Production",
    deadlineLabel: "18d",
    deadlineSub: "May 10 · 17:00 PT",
  },
  {
    id: "p7",
    lab: "Meta AI",
    project: "Legal RLHF Preference Pairs on M&A Filings",
    capabilityGap: "Deal-document judgment, risk-factor disclosure calibration.",
    productType: "RLHF Preferences",
    benchmarkTarget: "Custom",
    credentialBar: "JD, 3+ yr M&A, big-law exposure.",
    modality: "Text",
    targetTasks: 3000,
    completed: 2410,
    expertVettingPassRate: 27,
    perTestRewardAvg: 0.78,
    binaryPassRate: 0.62,
    rubricFlagCount: 14,
    completedOrFlagged: 2424,
    expertCount: 44,
    avgHourlyRate: 225,
    country: "US",
    language: "English",
    region: "NAMER",
    timezone: "ET",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "4d",
    deadlineSub: "Apr 26 · 12:00 PT",
  },
  {
    id: "p8",
    lab: "Apple",
    project: "Consumer Computer-use Trajectories",
    capabilityGap: "Everyday desktop workflows captured as keystroke-level demonstrations.",
    productType: "Computer-use Trajectories",
    benchmarkTarget: "Custom",
    credentialBar: "Native English, power-user, broad app fluency.",
    modality: "Desktop",
    targetTasks: 1500,
    completed: 1120,
    expertVettingPassRate: 35,
    perTestRewardAvg: 0.74,
    binaryPassRate: 0.58,
    rubricFlagCount: 19,
    completedOrFlagged: 1139,
    expertCount: 62,
    avgHourlyRate: 65,
    country: "US/CA/UK",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "Mixed",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "5d",
    deadlineSub: "Apr 27 · 17:00 PT",
  },
  {
    id: "p9",
    lab: "Nvidia",
    project: "CUDA Kernel SFT with Tests & Debugging Traces",
    capabilityGap: "GPU kernel optimization under tight memory and warp constraints.",
    productType: "SFT + CoT · Code Gen",
    benchmarkTarget: "Custom",
    credentialBar: "CUDA / HPC PhD or equivalent industry.",
    modality: "Code",
    targetTasks: 400,
    completed: 288,
    expertVettingPassRate: 14,
    perTestRewardAvg: 0.82,
    binaryPassRate: 0.71,
    rubricFlagCount: 8,
    completedOrFlagged: 296,
    expertCount: 12,
    avgHourlyRate: 240,
    country: "US/EU",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "Community Referral",
    status: "In-Production",
    deadlineLabel: "16d",
    deadlineSub: "May 8 · 12:00 PT",
  },
  {
    id: "p10",
    lab: "Cohere",
    project: "Multilingual RLHF Preference Pairs",
    capabilityGap: "Cultural preference calibration across 12 languages.",
    productType: "RLHF Preferences",
    benchmarkTarget: "Custom",
    credentialBar: "Native speaker, college+, content/writing background.",
    modality: "Multi-turn Chat",
    targetTasks: 6000,
    completed: 4800,
    expertVettingPassRate: 31,
    perTestRewardAvg: 0.71,
    binaryPassRate: 0.55,
    rubricFlagCount: 28,
    completedOrFlagged: 4828,
    expertCount: 96,
    avgHourlyRate: 55,
    country: "Global (12 locales)",
    language: "12 languages",
    region: "Global",
    timezone: "Mixed",
    source: "Mixed",
    status: "In-Production",
    deadlineLabel: "23d",
    deadlineSub: "May 15 · 17:00 PT",
  },
  {
    id: "p11",
    lab: "Mistral",
    project: "French M&A Legal Corpus Annotation",
    capabilityGap: "French-language contract reasoning, deal-document judgment.",
    productType: "SFT + CoT",
    benchmarkTarget: "Custom",
    credentialBar: "French avocat, 3+ yr corporate/M&A.",
    modality: "Text",
    targetTasks: 1000,
    completed: 780,
    expertVettingPassRate: 21,
    perTestRewardAvg: 0.76,
    binaryPassRate: 0.6,
    rubricFlagCount: 11,
    completedOrFlagged: 791,
    expertCount: 22,
    avgHourlyRate: 195,
    country: "FR",
    language: "French",
    region: "EMEA",
    timezone: "CET",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "3d",
    deadlineSub: "Apr 25 · 17:00 CET",
  },
  {
    id: "p12",
    lab: "OpenAI",
    project: "Biosafety Deep Research Red Team",
    capabilityGap: "Long-horizon adversarial bio reasoning, dual-use review.",
    productType: "Deep Research · Red Team",
    benchmarkTarget: "Custom",
    credentialBar: "PhD biologist with dual-use review training.",
    modality: "Text",
    targetTasks: 200,
    completed: 118,
    expertVettingPassRate: 17,
    perTestRewardAvg: 0.69,
    binaryPassRate: 0.51,
    rubricFlagCount: 6,
    completedOrFlagged: 124,
    expertCount: 8,
    avgHourlyRate: 285,
    country: "US/UK",
    language: "English",
    region: "NAMER/EMEA",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "In-Production",
    deadlineLabel: "28d",
    deadlineSub: "May 20 · 17:00 PT",
  },
];

// ────────────────────────────────────────────────────────────────────
// Risk engine, deterministic six-signal
// ────────────────────────────────────────────────────────────────────
function computeRisk(p) {
  const levels = ["low"];
  const pct = (p.completed / p.targetTasks) * 100;
  // Pace gap is approximated from deadlineLabel parsing (hours/days remaining)
  // For seeded data we just use explicit signal cutoffs.
  if (p.perTestRewardAvg < 0.2) levels.push("high");
  else if (p.perTestRewardAvg < 0.4) levels.push("medium");

  if (p.expertVettingPassRate < 10) levels.push("high");
  else if (p.expertVettingPassRate < 20) levels.push("medium");

  const flagRate = p.rubricFlagCount / Math.max(1, p.completedOrFlagged);
  if (flagRate > 0.3) levels.push("high");
  else if (flagRate > 0.15) levels.push("medium");

  if (pct < 50 && p.deadlineLabel.endsWith("h")) levels.push("high");

  if (levels.includes("high")) return "high";
  if (levels.includes("medium")) return "medium";
  return "low";
}

// ────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────
export default function Page() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [riskFilter, setRiskFilter] = useState("all");
  const [expandedId, setExpandedId] = useState("p1");
  const [aiState, setAiState] = useState({}); // { [id]: { loading, error, text, action } }
  const [draftOpen, setDraftOpen] = useState(null); // { id, kind, text, loading, error }
  const [addOpen, setAddOpen] = useState(false);

  const withRisk = useMemo(
    () => projects.map((p) => ({ ...p, risk: computeRisk(p) })),
    [projects]
  );

  const counts = useMemo(() => {
    const c = { all: withRisk.length, high: 0, medium: 0, low: 0 };
    withRisk.forEach((p) => (c[p.risk] += 1));
    return c;
  }, [withRisk]);

  const rows = useMemo(() => {
    if (riskFilter === "all") return withRisk;
    return withRisk.filter((p) => p.risk === riskFilter);
  }, [withRisk, riskFilter]);

  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const ptrMedian = median(withRisk.map((p) => p.perTestRewardAvg));

  const shippingThisWeek = withRisk.filter((p) => {
    const m = p.deadlineLabel.match(/^(\d+)([hd])$/);
    if (!m) return false;
    const n = parseInt(m[1], 10);
    return m[2] === "h" ? true : n <= 7;
  }).length;

  async function runAIAssessment(p) {
    setAiState((s) => ({ ...s, [p.id]: { loading: true } }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "risk", project: p }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setAiState((s) => ({ ...s, [p.id]: { loading: false, text: data.summary, action: data.action } }));
    } catch (e) {
      setAiState((s) => ({ ...s, [p.id]: { loading: false, error: e.message } }));
    }
  }

  async function runDraft(p, kind) {
    setDraftOpen({ id: p.id, kind, loading: true, text: "" });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, project: p }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setDraftOpen({ id: p.id, kind, loading: true, text: acc });
      }
      setDraftOpen({ id: p.id, kind, loading: false, text: acc });
    } catch (e) {
      setDraftOpen({ id: p.id, kind, loading: false, error: e.message, text: "" });
    }
  }

  async function runWeeklyDigest() {
    setDraftOpen({ id: "portfolio", kind: "weekly", loading: true, text: "" });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly", projects: withRisk }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setDraftOpen({ id: "portfolio", kind: "weekly", loading: true, text: acc });
      }
      setDraftOpen({ id: "portfolio", kind: "weekly", loading: false, text: acc });
    } catch (e) {
      setDraftOpen({ id: "portfolio", kind: "weekly", loading: false, error: e.message, text: "" });
    }
  }

  function toggleExpand(id) {
    setExpandedId((cur) => {
      const next = cur === id ? null : id;
      // When a row closes (or a different one opens), clear the AI assessment for the row being closed
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

  return (
    <div style={styles.page}>
      <Header onWeekly={runWeeklyDigest} onAddProject={() => setAddOpen(true)} />
      <MetricStrip
        active={withRisk.length}
        atRisk={counts.high}
        ptrMedian={ptrMedian}
        shipping={shippingThisWeek}
      />
      <Toolbar riskFilter={riskFilter} setRiskFilter={setRiskFilter} counts={counts} />
      <Table
        rows={rows}
        expandedId={expandedId}
        toggleExpand={toggleExpand}
        aiState={aiState}
        runAIAssessment={runAIAssessment}
        runDraft={runDraft}
      />
      <Footer />
      {draftOpen && <DraftModal state={draftOpen} close={() => setDraftOpen(null)} />}
      {addOpen && <AddProjectModal close={() => setAddOpen(false)} onSave={addProject} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Pieces
// ────────────────────────────────────────────────────────────────────
function Header({ onWeekly, onAddProject }) {
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
      <nav style={styles.nav}>
        <a style={{ ...styles.navLink, ...styles.navActive }} href="#">Portfolio</a>
      </nav>
      <div style={styles.headerActions}>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onAddProject}>Add project</button>
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={onWeekly}>
          Weekly founder digest →
        </button>
      </div>
    </header>
  );
}

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
    <div style={{ ...styles.metric, ...(last ? { borderRight: "none", paddingRight: 0 } : {}) }}>
      <div style={styles.metricNum}>{num}</div>
      <div style={styles.metricLabel}>{label}</div>
    </div>
  );
}

function Toolbar({ riskFilter, setRiskFilter, counts }) {
  const chip = (val, label) => {
    const active = riskFilter === val;
    return (
      <button
        onClick={() => setRiskFilter(val)}
        style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
      >
        {label} <span style={{ ...styles.chipN, opacity: active ? 0.75 : 0.6 }}>{counts[val]}</span>
      </button>
    );
  };
  return (
    <section style={styles.toolbar}>
      <div style={styles.toolbarTitle}>Projects</div>
      <div style={styles.filters}>
        {chip("all", "All")}
        {chip("high", "High")}
        {chip("medium", "Medium")}
        {chip("low", "Low")}
      </div>
    </section>
  );
}

function Table({ rows, expandedId, toggleExpand, aiState, runAIAssessment, runDraft }) {
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
      {rows.map((p) => {
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
          />
        );
      })}
    </section>
  );
}

function RowGroup({ p, expanded, onToggle, ai, runAIAssessment, runDraft }) {
  const markerColor =
    p.risk === "high" ? C.red : p.risk === "medium" ? C.amber : C.green;
  const ptrColor =
    p.perTestRewardAvg < 0.4 ? C.red : p.perTestRewardAvg < 0.7 ? C.amber : C.green;
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
          {p.deadlineLabel}
          <div style={styles.cellDeadlineSub}>{p.deadlineSub}</div>
        </div>
        <div style={{ ...styles.cellCaret, transform: expanded ? "rotate(180deg)" : "none" }}>▾</div>
      </div>
      {expanded && <DetailPanel p={p} ai={ai} runAIAssessment={runAIAssessment} runDraft={runDraft} />}
    </>
  );
}

function DetailPanel({ p, ai, runAIAssessment, runDraft }) {
  const pct = (p.completed / p.targetTasks) * 100;
  const flagRate = (p.rubricFlagCount / Math.max(1, p.completedOrFlagged)) * 100;
  const ptrColor =
    p.perTestRewardAvg < 0.4 ? C.red : p.perTestRewardAvg < 0.7 ? C.amber : C.green;
  return (
    <div style={styles.detail}>
      <div style={styles.detailGrid}>
        <DetailTile label="Projected delivery" value={p.deadlineSub.split(" · ")[0]} sub="vs. target" />
        <DetailTile
          label="Tasks"
          value={
            <>
              {p.completed.toLocaleString()}
              <span style={styles.tileUnit}> / {p.targetTasks.toLocaleString()}</span>
            </>
          }
          sub={`${pct.toFixed(0)}% complete`}
        />
        <DetailTile
          label="Per-test reward"
          value={p.perTestRewardAvg.toFixed(2)}
          sub={`Binary ${p.binaryPassRate.toFixed(2)}`}
          subColor={ptrColor}
        />
        <DetailTile
          label="Vetting pass rate"
          value={
            <>
              {p.expertVettingPassRate}
              <span style={styles.tileUnit}>%</span>
            </>
          }
          sub={p.credentialBar}
          subColor={p.expertVettingPassRate < 20 ? C.red : C.muted}
        />
        <DetailTile
          label="Rubric flags"
          value={
            <>
              {p.rubricFlagCount}
              <span style={styles.tileUnit}> / {p.completedOrFlagged}</span>
            </>
          }
          sub={`${flagRate.toFixed(1)}% flag rate`}
          subColor={flagRate > 15 ? C.amber : C.muted}
          last
        />
      </div>

      <div style={styles.detailBody}>
        <div>
          <div style={styles.detailMeta}>
            <MetaRow k="Capability" v={p.capabilityGap} />
            <MetaRow k="Benchmark target" v={<code style={styles.code}>{p.benchmarkTarget}</code>} />
            <MetaRow k="Credential bar" v={p.credentialBar} />
            <MetaRow
              k="Experts"
              v={`${p.expertCount} active · $${p.avgHourlyRate}/hr median · ${p.source}`}
            />
            <MetaRow k="Modality" v={p.modality} />
            <MetaRow k="Status" v={<code style={styles.code}>{p.status}</code>} />
            <MetaRow k="Region" v={`${p.region} · ${p.language}`} />
            <MetaRow k="Deadline" v={p.deadlineSub} />
          </div>

          <div style={styles.draftActions}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary, fontSize: 12.5 }}
              onClick={() => runDraft(p, "researcher")}
            >
              Draft lab-researcher update →
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary, fontSize: 12.5 }}
              onClick={() => runDraft(p, "slack")}
            >
              Draft Slack alert
            </button>
          </div>
        </div>

        <AIPanel p={p} ai={ai} onGenerate={() => runAIAssessment(p)} />
      </div>
    </div>
  );
}

function DetailTile({ label, value, sub, subColor, last }) {
  return (
    <div
      style={{
        ...styles.detailTile,
        ...(last ? { borderRight: "none" } : {}),
      }}
    >
      <div style={styles.tileLabel}>{label}</div>
      <div style={styles.tileVal}>{value}</div>
      {sub && <div style={{ ...styles.tileSub, color: subColor || C.muted }}>{sub}</div>}
    </div>
  );
}

function MetaRow({ k, v }) {
  return (
    <div>
      <div style={styles.metaK}>{k}</div>
      <div style={styles.metaV}>{v}</div>
    </div>
  );
}

function AIPanel({ p, ai, onGenerate }) {
  const hasContent = !!(ai && ai.text);
  const loading = !!(ai && ai.loading);
  const errored = !!(ai && ai.error);

  // Realistic-looking placeholder content, blurred behind the generate pill.
  const placeholderBody = `Per-test reward at ${p.perTestRewardAvg.toFixed(
    2
  )} with binary pass rate at ${p.binaryPassRate.toFixed(
    2
  )} suggests the rubric is grading trajectory shape but not terminal state. Rubric-coverage problem, not a contributor problem.`;
  const placeholderAction =
    "Run Docent over last 48 failed trajectories, cluster on tool-selection errors, extend verifier test suite before opening a new sourcing wave.";

  return (
    <div style={styles.aiPanel}>
      <div style={styles.aiPanelBadge}>AI ASSESSMENT · CLAUDE SONNET 4.6</div>

      {/* Content layer, blurred until generated */}
      <div style={{ ...styles.aiContent, filter: hasContent ? "none" : "blur(5px)", opacity: hasContent ? 1 : 0.65 }}>
        <div style={styles.aiBody}>{hasContent ? ai.text : placeholderBody}</div>
        <div style={styles.aiAction}>
          <strong style={{ color: C.ink, fontWeight: 500 }}>Recommended action. </strong>
          {hasContent ? ai.action : placeholderAction}
        </div>
      </div>

      {/* Overlay pill, visible until content exists */}
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
  );
}

function AddProjectModal({ close, onSave }) {
  const [form, setForm] = useState({
    lab: "",
    project: "",
    capabilityGap: "",
    productType: "SFT + CoT Demonstrations",
    benchmarkTarget: "Custom",
    credentialBar: "",
    modality: "Text",
    targetTasks: 100,
    completed: 0,
    expertVettingPassRate: 20,
    perTestRewardAvg: 0.6,
    binaryPassRate: 0.4,
    rubricFlagCount: 0,
    completedOrFlagged: 0,
    expertCount: 0,
    avgHourlyRate: 100,
    country: "US",
    language: "English",
    region: "NAMER",
    timezone: "PT",
    source: "AfterQuery Experts Network",
    status: "Scoping",
    deadlineLabel: "14d",
    deadlineSub: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleSave(e) {
    e.preventDefault();
    if (!form.lab.trim() || !form.project.trim()) return;
    const normalized = {
      ...form,
      targetTasks: Number(form.targetTasks) || 0,
      completed: Number(form.completed) || 0,
      expertVettingPassRate: Number(form.expertVettingPassRate) || 0,
      perTestRewardAvg: Number(form.perTestRewardAvg) || 0,
      binaryPassRate: Number(form.binaryPassRate) || 0,
      rubricFlagCount: Number(form.rubricFlagCount) || 0,
      completedOrFlagged:
        Number(form.completedOrFlagged) || Number(form.completed) + Number(form.rubricFlagCount),
      expertCount: Number(form.expertCount) || 0,
      avgHourlyRate: Number(form.avgHourlyRate) || 0,
    };
    onSave(normalized);
  }

  return (
    <div style={styles.modalScrim} onClick={close}>
      <form
        style={{ ...styles.modal, maxWidth: 880 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
      >
        <div style={styles.modalHead}>
          <div style={styles.modalLabel}>New project</div>
          <button type="button" style={styles.modalClose} onClick={close}>
            ✕
          </button>
        </div>

        <div style={styles.formGrid}>
          <Field label="Lab" wide>
            <select style={styles.input} value={form.lab} onChange={(e) => update("lab", e.target.value)} required>
              <option value="">Select…</option>
              {["OpenAI", "Anthropic", "Google DeepMind", "Meta AI", "xAI", "Microsoft", "Apple", "Nvidia", "Amazon", "Cohere", "Mistral"].map(
                (l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                )
              )}
            </select>
          </Field>
          <Field label="Project name" wide>
            <input
              style={styles.input}
              value={form.project}
              onChange={(e) => update("project", e.target.value)}
              placeholder="e.g. Copilot Enterprise Excel Custom Eval"
              required
            />
          </Field>

          <Field label="Capability gap" wide full>
            <textarea
              style={{ ...styles.input, minHeight: 54, resize: "vertical" }}
              value={form.capabilityGap}
              onChange={(e) => update("capabilityGap", e.target.value)}
              placeholder="What the data actually trains."
            />
          </Field>

          <Field label="Product type">
            <select style={styles.input} value={form.productType} onChange={(e) => update("productType", e.target.value)}>
              {[
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
              ].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Benchmark target">
            <select style={styles.input} value={form.benchmarkTarget} onChange={(e) => update("benchmarkTarget", e.target.value)}>
              {["Custom", "FinanceQA", "IDE-Bench", "Market-Bench", "App-Bench", "UI-Bench", "Terminal-Bench 2.0", "τ²-bench"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Credential bar" wide full>
            <input
              style={styles.input}
              value={form.credentialBar}
              onChange={(e) => update("credentialBar", e.target.value)}
              placeholder="e.g. FAANG L6+, 5+ yr infra"
            />
          </Field>

          <Field label="Modality">
            <select style={styles.input} value={form.modality} onChange={(e) => update("modality", e.target.value)}>
              {["Text", "Code", "Multi-turn Chat", "Tool-calling (API/MCP)", "Browser", "Desktop", "Image", "Audio", "Video"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select style={styles.input} value={form.status} onChange={(e) => update("status", e.target.value)}>
              {["Scoping", "Tooling Build", "Sourcing", "Onboarding", "In-Production", "Rubric Review", "Delivered"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Target tasks">
            <input type="number" min="0" style={styles.input} value={form.targetTasks} onChange={(e) => update("targetTasks", e.target.value)} />
          </Field>
          <Field label="Completed">
            <input type="number" min="0" style={styles.input} value={form.completed} onChange={(e) => update("completed", e.target.value)} />
          </Field>

          <Field label="Per-test reward (0-1)">
            <input type="number" min="0" max="1" step="0.01" style={styles.input} value={form.perTestRewardAvg} onChange={(e) => update("perTestRewardAvg", e.target.value)} />
          </Field>
          <Field label="Binary pass rate (0-1)">
            <input type="number" min="0" max="1" step="0.01" style={styles.input} value={form.binaryPassRate} onChange={(e) => update("binaryPassRate", e.target.value)} />
          </Field>

          <Field label="Vetting pass rate (%)">
            <input type="number" min="0" max="100" style={styles.input} value={form.expertVettingPassRate} onChange={(e) => update("expertVettingPassRate", e.target.value)} />
          </Field>
          <Field label="Rubric flags">
            <input type="number" min="0" style={styles.input} value={form.rubricFlagCount} onChange={(e) => update("rubricFlagCount", e.target.value)} />
          </Field>

          <Field label="Experts active">
            <input type="number" min="0" style={styles.input} value={form.expertCount} onChange={(e) => update("expertCount", e.target.value)} />
          </Field>
          <Field label="Avg hourly rate ($)">
            <input type="number" min="0" style={styles.input} value={form.avgHourlyRate} onChange={(e) => update("avgHourlyRate", e.target.value)} />
          </Field>

          <Field label="Source">
            <select style={styles.input} value={form.source} onChange={(e) => update("source", e.target.value)}>
              {["AfterQuery Experts Network", "Community Referral", "Lab BYO Roster", "Partner Vendor", "Mixed"].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
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

          <Field label="Deadline label">
            <input style={styles.input} value={form.deadlineLabel} onChange={(e) => update("deadlineLabel", e.target.value)} placeholder="e.g. 14d or 42h" />
          </Field>
          <Field label="Deadline date">
            <input style={styles.input} value={form.deadlineSub} onChange={(e) => update("deadlineSub", e.target.value)} placeholder="e.g. May 6 · 17:00 PT" />
          </Field>
        </div>

        <div style={styles.formActions}>
          <button type="button" style={{ ...styles.btn, ...styles.btnSecondary }} onClick={close}>
            Cancel
          </button>
          <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
            Add project →
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

function DraftModal({ state, close }) {
  const label =
    state.kind === "researcher"
      ? "Lab-researcher update"
      : state.kind === "slack"
      ? "Slack alert"
      : state.kind === "weekly"
      ? "Weekly founder digest"
      : "Draft";
  return (
    <div style={styles.modalScrim} onClick={close}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <div style={styles.modalLabel}>{label}</div>
          <button style={styles.modalClose} onClick={close}>
            ✕
          </button>
        </div>
        {state.error ? (
          <div style={styles.modalError}>{state.error}</div>
        ) : (
          <pre style={styles.modalBody}>{state.text || (state.loading ? "Drafting…" : "")}</pre>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div>AFTERQUERY SPL OPS CONSOLE · APPLICATION ARTIFACT · ZI</div>
      <div>v0.2 · local</div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
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
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "22px 48px 20px",
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
  nav: { display: "flex", gap: 36, fontSize: 14, fontWeight: 500 },
  navLink: { color: C.ink, textDecoration: "none", position: "relative" },
  navActive: { borderBottom: `1px solid ${C.ink}`, paddingBottom: 2 },
  headerActions: { display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" },
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
  btnGhost: {
    background: "transparent",
    color: C.muted,
    padding: "9px 4px",
    borderRadius: 0,
    borderBottom: `1px solid ${C.hairStrong}`,
  },

  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderTop: `1px solid ${C.hairStrong}`,
    borderBottom: `1px solid ${C.hairStrong}`,
    margin: "56px 48px 0",
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
    padding: "56px 48px 18px",
    gap: 24,
  },
  toolbarTitle: {
    fontFamily: F.serif,
    fontSize: 20,
    fontWeight: 400,
    fontVariationSettings: '"opsz" 36',
    letterSpacing: "-0.01em",
    color: C.ink,
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

  detail: {
    padding: "28px 0 36px",
    borderBottom: `1px solid ${C.hairStrong}`,
    background: C.cream2,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    borderTop: `1px solid ${C.hair}`,
    borderBottom: `1px solid ${C.hair}`,
    marginBottom: 30,
  },
  detailTile: { padding: "20px 24px", borderRight: `1px solid ${C.hair}` },
  tileLabel: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 12,
  },
  tileVal: {
    fontFamily: F.serif,
    fontSize: 36,
    fontWeight: 400,
    fontVariationSettings: '"opsz" 72',
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },
  tileUnit: { fontFamily: F.mono, fontSize: 12, fontWeight: 500, color: C.muted, marginLeft: 3 },
  tileSub: { marginTop: 8, fontFamily: F.mono, fontSize: 11.5 },

  detailBody: { display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 36, padding: "0 48px" },
  detailMeta: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px", fontSize: 13 },
  metaK: {
    fontSize: 10.5,
    color: C.muted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
    marginBottom: 6,
  },
  metaV: { lineHeight: 1.45, color: C.ink },
  code: {
    fontFamily: F.mono,
    fontSize: 12,
    background: C.cream3,
    padding: "1px 6px",
    borderRadius: 3,
  },

  aiPanel: {
    border: `1px solid ${C.hairStrong}`,
    background: C.cream,
    padding: "22px 24px",
    borderRadius: 3,
    position: "relative",
    overflow: "hidden",
    minHeight: 180,
  },
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
      "linear-gradient(180deg, rgba(246,245,238,0.05) 0%, rgba(246,245,238,0.35) 40%, rgba(246,245,238,0.55) 100%)",
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
  aiPanelBadge: {
    position: "absolute",
    top: -9,
    left: 18,
    background: C.cream2,
    padding: "0 10px",
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: "0.14em",
    color: C.muted,
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
  aiError: { marginTop: 10, fontSize: 11.5, color: C.red, fontFamily: F.mono },

  draftActions: { display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" },

  footer: {
    padding: "36px 48px 40px",
    borderTop: `1px solid ${C.hair}`,
    fontSize: 11,
    color: C.muted,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: F.mono,
    letterSpacing: "0.08em",
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
    maxHeight: "80vh",
    borderRadius: 4,
    border: `1px solid ${C.hairStrong}`,
    padding: "20px 24px 24px",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalLabel: {
    fontFamily: F.mono,
    fontSize: 10.5,
    letterSpacing: "0.14em",
    color: C.muted,
    textTransform: "uppercase",
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
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    color: C.ink,
    margin: 0,
  },
  modalError: { fontFamily: F.mono, fontSize: 12.5, color: C.red },

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
};
