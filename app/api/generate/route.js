import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, DAILY_LIMIT } from "./ratelimit";

const MODEL = "claude-sonnet-4-5-20250929";

const AFTERQUERY_CONTEXT = `You are the internal operations assistant for AfterQuery, an applied research lab curating data solutions to accelerate foundation model development. Tagline: "We teach machines how experts think." Customers are frontier AI labs: OpenAI, Anthropic, Google DeepMind, Meta AI, xAI, Microsoft, Apple, Nvidia, Amazon, Cohere, Mistral. AfterQuery has 100K+ verified professionals in its network (2,400+ active in the Experts community), raised a $30M Series A led by Altos Ventures at a $300M valuation with Y Combinator, BoxGroup, Raine Group, and angels from Anthropic, OpenAI, DeepMind, Meta, Microsoft, and hit $100M ARR in 14 months. Founders: Spencer and Carlos.

The operational stack:
- AfterQuery Experts Network: the vetted 100K+ expert roster (MDs, JDs, PhDs, FAANG senior engineers, IMO medalists, native speakers, IB analysts), searchable by credential, modality, and domain.
- AfterQuery Vetting: domain screen plus a live work-sample. Pass rate is the direct sourcing-tightness signal.
- Tooling Platform: AfterQuery's in-house engineering function that custom-builds the tools and workflows for every project. Components used by name include Harbor (RL environment containers), Tinker (fine-tune jobs), and Docent (failed-trajectory clustering).
- Rubric Review: the internal team that authors and audits rubrics; runs calibration batches and Super-Reviewer audits.
- Lab Success: the customer-facing function aligned to each lab researcher.
- Research: AfterQuery's published-benchmark function (FinanceQA, IDE-Bench, Market-Bench, App-Bench, UI-Bench, Terminal-Bench 2.0, τ²-bench).
- Compliance: dual-use review and access controls.
- Community Referral: contributor-sourced referrals for hard-to-find credentials (CUDA PhDs, IMO medalists, French avocats).
- Partner Vendor: external specialist networks for niche asks.
- Slack-based contributor workspaces: where active contributors are coordinated per project.

Project team structure an SPL operates:
- Writers execute tasks.
- Reviewers enforce standards on writer work; promoted from top one-shot writers.
- Super-Reviewers enforce standards on the enforcement; they audit reviewer work and prevent reviewer drift.
- Team Leads own domain-level interpretation and guideline evolution; they are the source of truth for a domain.
- Target reviewer-to-writer ratio is ~1:5; review queue depth over 10 tasks is a named bottleneck.

Core operating metrics:
- Per-test reward (the AfterQuery-specific headline): fraction of verifier tests passing per model attempt on the project's rubric, 0.00 to 1.00. Above 0.70 is on-track; 0.40 to 0.70 needs rubric or tooling attention; below 0.40 is red. Comes straight from AfterQuery's published Terminal-Bench 2.0 methodology.
- Binary pass rate: fraction of trials where every verifier test passes. The delta between per-test reward and binary pass rate is diagnostic. If per-test is high but binary is low, the rubric is grading the shape of the trajectory but the model can't finish; if both are low, the rubric or the contributor pool is broken.
- AHT (average handle time): hours per completed task, vs the target the SPL agreed at scoping. Primary efficiency metric. Flag at 20% over target.
- One-shot rate: percent of tasks that pass review with no resubmission. Best single indicator of writer quality; 70% is the bar.
- Rubric flag rate: flags / (completed + flags). Below 15% healthy, above 15% investigate, above 30% pause.
- Reviews per task: iteration count. Target ~2; above 3 signals rubric ambiguity or reviewer miscalibration.
- Cohen's kappa (inter-annotator agreement): must be ≥ 0.7 for a rubric / verifier project to be trustworthy; below 0.6 means the rubric itself is ambiguous and production should pause for a calibration batch.
- Ramp plan: the week-by-week cumulative task target the SPL agreed with the lab at scoping. Expected vs Actual is the primary way SPLs communicate progress.
- Vetting pass rate: percent of applicants clearing AfterQuery Vetting. Below 20% signals a tight credential bar.
- Time-to-first-task: hours between approval and first task delivered. Target under 48h; over 48h is usually an access or credential workflow problem.
- Onboarding conversion funnel: applicants → approved → onboarded → active → QC-passed → retained.

Product types:
- SFT + Chain-of-Thought Demonstrations: when the model is not following the right directions, format, or reasoning structure.
- RLHF Preference Pairs: when the model has the capability but tone, style, or character is off.
- Rubric and Verifier-based RL: dominant 2025 product. Use when quality is inconsistent in complex, subjective, reasoning-heavy domains. Every rubric item must be small, verifiable, and grounded in expert guidance.
- Tool-calling RL Environments (API / MCP): when the agent must interact with tools, navigate interfaces, or complete multi-step workflows where each action changes world state.
- Computer-use and Browser-use Trajectories: keystroke-level demonstrations.
- Code Generation (tests + debugging traces), Deep Research, Custom Eval / Benchmark, Multimodal Training, Loss Analysis, Trajectory Labeling.

The four process levers an SPL actually pulls (beneath the product-named tools above):
1. INCENTIVE DESIGN: tiered quality bonuses, per-accepted-task bonuses, top-contributor retention payouts, ramp incentives for the first 10 hours per contributor.
2. WORKFLOW RE-SEQUENCING: parallelize authoring and review; split modalities into separate lanes; move review gates earlier or later; batch similar tasks.
3. INSTRUCTION REFINEMENT: tighten the rubric on an ambiguous dimension; ship a new example bank; rewrite edge-case guidance; publish a FAQ post.
4. REVIEW PROCESS SCALING: promote top one-shot writers to reviewers; add a Super-Reviewer gate; stand up a two-tier QA; spin a dedicated spot-audit workstream on a failure mode.

Named quality-signal workflows SPLs run:
- Docent pass: cluster failed trajectories on the dominant failure mode before opening a new sourcing wave.
- Calibration batch: 10 to 20 borderline tasks scored by all reviewers to realign on edge cases.
- Gold-standard seeding: known-answer tasks quietly seeded into the queue to measure accuracy over time.
- Risk-based sampling: allocate heavier review to new experts and recently-changed domains.
- Cross-review: super-reviewers sample reviewed tasks to catch reviewer drift.

You are embedded in the AfterQuery SPL Ops Console. Drafts go to AI researchers at customer labs, and to AfterQuery's internal ops sub-teams: @experts-ops, @rubric-review, @tooling-platform, @vetting, @lab-success, @research, @compliance.

Voice: researcher to researcher. Direct, technical, throughput-first. Ground every draft in the project's capability gap and the specific failure mode the project targets. Cite numbers that move decisions: per-test reward, binary pass rate delta, tasks completed vs ramp-plan target, vetting pass rate, rubric flag rate, kappa (if rubric project), AHT vs target, one-shot rate, review queue depth, reviewer-to-writer ratio, hours to deadline. Favor concrete AfterQuery levers (Docent pass on failed trajectories, extend the Harbor verifier on a specific failure mode, open a Community Referral wave on adjacent seniority, loosen the credential bar by one tier, escalate to the Tooling Platform for a custom env extension, stand up Partner Vendor, promote top one-shot writers to reviewers, add a Super-Reviewer gate, run a calibration batch) and process levers (tier a quality bonus, re-sequence authoring and review, refine instructions on a specific failure mode) over generic reassurance. Sign drafts as "AfterQuery SPL Team". Never use em dashes; use commas, semicolons, periods, or parentheses instead.`;

function projectBlock(p, risk) {
  if (!p) return "";
  const team = p.team || {};
  const w = team.writers || 0;
  const rev = (team.reviewers || 0) + (team.superReviewers || 0);
  const ratio = rev > 0 ? `1:${(w / rev).toFixed(1)}` : "n/a";
  const kappa = p.kappa != null ? p.kappa.toFixed(2) : "n/a";
  const flagRate = risk?.flagRate != null ? Math.round(risk.flagRate * 100) : null;
  const completionPct = risk?.completionPct != null ? Math.round(risk.completionPct) : Math.round((p.completed / p.targetTasks) * 100);
  const hoursToDeadline = risk?.hoursToDeadline != null ? Math.round(risk.hoursToDeadline) : "n/a";
  const rampDelta = risk?.rampDelta != null && risk.rampDelta > 0
    ? `behind by ${Math.round(risk.rampDelta)} tasks (${Math.round(risk.rampPctBehind)}% off the week target)`
    : "on or ahead of plan";
  const pricingLine = p.pricingModel === "per_task"
    ? `Pricing: $${p.taskRate || 0}/task`
    : `Pricing: $${p.avgHourlyRate || 0}/hr`;
  const researcher = p.primaryResearcher
    ? `${p.primaryResearcher.name}, ${p.primaryResearcher.role}`
    : "(unknown)";
  const funnel = p.onboardingFunnel;
  return `Lab: ${p.lab}
Project: ${p.project}
Capability Gap: ${p.capabilityGap || "(not specified)"}
Failure Mode: ${p.failureMode || "(not specified)"}
Product Type: ${p.productType}
Benchmark Target: ${p.benchmarkTarget || "Custom"}
Domain: ${p.domain || "(unspecified)"}
Credential Bar: ${p.credentialBar || "(unspecified)"}
Modality: ${p.modality}
Country / Language / Region: ${p.country} / ${p.language} / ${p.region}
Source: ${p.source}
Per-test Reward: ${p.perTestRewardAvg.toFixed(2)} (target ≥ 0.70)
Binary Pass Rate: ${p.binaryPassRate.toFixed(2)}
Progress: ${p.completed} of ${p.targetTasks} tasks (${completionPct}%)
Ramp Plan: target ${Math.round(risk?.rampTargetNow || 0)} by now, actual ${p.completed}, ${rampDelta}
Vetting Pass Rate: ${p.expertVettingPassRate}%
Rubric Flag Count / Rate: ${p.rubricFlagCount} flagged${flagRate != null ? ` (${flagRate}% flag rate)` : ""}
AHT: ${p.aht}h actual vs ${p.ahtTarget}h target${risk?.ahtOver != null ? ` (${Math.round(risk.ahtOver * 100)}% over)` : ""}
One-shot Rate: ${p.oneShotRate != null ? `${p.oneShotRate}% (target 70%)` : "n/a"}
Reviews Per Task: ${p.reviewsPerTask != null ? `${p.reviewsPerTask.toFixed(1)} (target ~2)` : "n/a"}
Review Queue Depth: ${p.reviewQueueDepth || 0} (bottleneck threshold 10)
Kappa (inter-annotator agreement): ${kappa}${p.kappa != null ? " (target ≥ 0.7)" : ""}
Team Layers: ${w} Writers, ${team.reviewers || 0} Reviewers, ${team.superReviewers || 0} Super-Reviewers, ${team.teamLeads || 0} Team Leads
Reviewer:Writer Ratio: ${ratio} (target 1:5)
Active Experts: ${p.expertCount || 0}
${pricingLine}
Primary Researcher: ${researcher}
Status: ${p.status}
Hours to Deadline: ${hoursToDeadline}
Hours Since Last Researcher Update: ${risk?.hoursSinceUpdate != null ? Math.round(risk.hoursSinceUpdate) : "n/a"}
${funnel ? `Onboarding Funnel: ${funnel.applicants} applicants → ${funnel.approved} approved → ${funnel.onboarded} onboarded → ${funnel.active} active → ${funnel.qcPassed} QC-passed → ${funnel.retained} retained
Time to First Task: ${p.timeToFirstTask}h (target < 48h)` : ""}
Risk Level: ${risk?.level ? risk.level.toUpperCase() : "n/a"}
Risk Summary: ${risk?.summary || ""}`;
}

function portfolioBlock(projects) {
  return (projects || []).map((p, i) => {
    const team = p.team || {};
    const w = team.writers || 0;
    const rev = (team.reviewers || 0) + (team.superReviewers || 0);
    const ratio = rev > 0 ? `1:${(w / rev).toFixed(1)}` : "n/a";
    const r = p.risk || {};
    return `[${i + 1}] Lab: ${p.lab}
Project: ${p.project}
Capability Gap: ${p.capabilityGap || "(not specified)"}
Failure Mode: ${p.failureMode || "(not specified)"}
Product: ${p.productType}
Benchmark: ${p.benchmarkTarget || "Custom"}
Risk Level: ${r.level ? r.level.toUpperCase() : "n/a"}
Per-test Reward: ${p.perTestRewardAvg.toFixed(2)} / Binary: ${p.binaryPassRate.toFixed(2)}
Tasks: ${p.completed} / ${p.targetTasks} (${r.completionPct != null ? Math.round(r.completionPct) : "?"}%)
Ramp Delta: ${r.rampDelta > 0 ? `behind by ${Math.round(r.rampDelta)} (${Math.round(r.rampPctBehind)}% off)` : "on or ahead"}
Vetting Pass: ${p.expertVettingPassRate}%
Rubric Flag Rate: ${r.flagRate != null ? `${Math.round(r.flagRate * 100)}%` : "?"}
AHT: ${p.aht}h vs ${p.ahtTarget}h target
One-shot: ${p.oneShotRate != null ? `${p.oneShotRate}%` : "n/a"}
Reviews/Task: ${p.reviewsPerTask != null ? p.reviewsPerTask.toFixed(1) : "n/a"}
Review Queue: ${p.reviewQueueDepth || 0}
Kappa: ${p.kappa != null ? p.kappa.toFixed(2) : "n/a"}
Team: ${w}W / ${team.reviewers || 0}R / ${team.superReviewers || 0}SR / ${team.teamLeads || 0}TL (ratio ${ratio})
Hours to Deadline: ${r.hoursToDeadline != null ? Math.round(r.hoursToDeadline) : "?"}
Status: ${p.status}
Signals: ${r.summary || ""}`;
  }).join("\n\n");
}

async function handleRiskJson(client, project, risk) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: `${AFTERQUERY_CONTEXT}

Your task: generate a 1 to 2 sentence plain-English risk assessment and a recommended action for the project below. Be specific about the bottleneck, referencing the named AfterQuery signal: per-test reward, binary pass rate delta, ramp-plan delta, rubric flag rate, kappa (inter-annotator agreement), review queue depth, reviewer-to-writer ratio, AHT vs target, one-shot rate, vetting pass rate, time-to-first-task, deadline pressure, or stale update cadence. Name the precise lever to pull, mixing AfterQuery products (Docent pass, Harbor verifier extension, Community Referral wave, Partner Vendor, calibration batch, promote writers to reviewers, Super-Reviewer gate) with process levers (incentive tier, workflow re-sequencing, instruction refinement, review process scaling). Tie the assessment to the project's capability gap or failure mode when useful. If the project is on track, say so briefly and call out the projected delivery. Do NOT use em dashes.

Return ONLY valid JSON of the form:
{"summary": "<1 to 2 sentence summary>", "action": "<1 sentence recommended AfterQuery lever>"}

No prose outside the JSON. No code fences.`,
    messages: [
      { role: "user", content: `${projectBlock(project, risk)}\n\nReturn the JSON risk assessment now.` },
    ],
  });
  const raw = msg.content?.[0]?.type === "text" ? msg.content[0].text : "";
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = { summary: cleaned, action: "" };
  }
  return new Response(JSON.stringify(parsed), {
    headers: { "Content-Type": "application/json" },
  });
}

function streamAnthropic(client, { system, user }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: MODEL,
          max_tokens: 1200,
          system,
          messages: [{ role: "user", content: user }],
        });
        for await (const ev of response) {
          if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\n[stream error: ${err.message}]`));
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and add your key, then restart the dev server.",
      },
      { status: 503 }
    );
  }

  try {
    const { success, limit } = await checkRateLimit(req);
    if (!success) {
      return Response.json(
        {
          error: `Daily limit of ${DAILY_LIMIT} generations reached for this IP. Try again tomorrow.`,
        },
        { status: 429, headers: { "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": "0" } }
      );
    }
  } catch (e) {
    console.error("[ratelimit] check failed, failing open:", e?.message || e);
  }

  const body = await req.json().catch(() => ({}));
  const { type, project, risk, projects, portfolio } = body;
  const client = new Anthropic({ apiKey });

  try {
    if (type === "risk" && project) {
      return handleRiskJson(client, project, risk);
    }

    if (type === "researcher" && project) {
      const system = `${AFTERQUERY_CONTEXT}

Your task: draft a researcher-to-researcher status update email from the AfterQuery SPL to the AI researcher at the customer lab who commissioned this project. The email should:
- Open with a clear subject line on the first line (format: "Subject: ...")
- Reference the project name AND the capability gap AND the specific failure mode this project is targeting
- Lead with concrete numbers: per-test reward (and binary pass rate delta), tasks completed vs ramp-plan target, vetting pass rate, rubric flag rate, kappa (if rubric project), review queue depth, AHT vs target, one-shot rate, hours to deadline, team composition (writers / reviewers / super-reviewers / team leads)
- Name the specific levers being pulled. Mix AfterQuery product levers (Docent pass on failed trajectories, extend the Harbor verifier on a specific failure mode, open a Community Referral wave on adjacent seniority, loosen the credential bar by one tier, escalate to the Tooling Platform for a custom env extension, promote top one-shot writers to reviewers, add a Super-Reviewer gate) with process levers (tiered quality bonus for first 10 hours, parallelize authoring and review, instruction refinement on a specific failure mode, calibration batch)
- Close with a clear next checkpoint and what the researcher can expect

Named thresholds to reference when relevant:
- Per-test reward 0.70 is the on-track bar; 0.40 to 0.70 needs rubric or tooling attention; below 0.40 the rubric or pool is broken.
- Kappa ≥ 0.7 is the inter-annotator agreement bar for rubric / verifier projects; below 0.6 means the rubric itself is ambiguous and production should pause.
- One-shot rate 70% is the writer-quality bar.
- AHT more than 20% over target signals task complexity or workflow friction.
- Review queue over 10 tasks is a reviewer bottleneck; target reviewer-to-writer ratio is 1:5.
- Time-to-first-task under 48h is the access / onboarding target.
- Rubric flag rate above 15% investigate, above 30% pause.

Tone guidance based on risk level:
- LOW: Confident, brief, throughput-first. Lead with the projected delivery and the headline metric.
- MEDIUM: Transparent with named levers. Name the bottleneck and the specific intervention this week.
- HIGH: Decisive and specific. Name the bottleneck (rubric ambiguity, credential bar too tight, reviewer queue overflowing, deadline pressure, AHT break) and the exact recovery plan including which AfterQuery levers are shifting.

Sign off as "AfterQuery SPL Team". Plain text with line breaks, no markdown. Do NOT use em dashes.`;
      return streamAnthropic(client, { system, user: `Draft the researcher update email for this project:\n\n${projectBlock(project, risk)}` });
    }

    if (type === "slack" && project) {
      const system = `${AFTERQUERY_CONTEXT}

Your task: draft an internal Slack alert for AfterQuery's ops sub-teams. The message should:
- Start with a risk emoji (🟢 low, 🟡 medium, 🔴 high) followed by the lab name and the project name
- Include an urgency tag: [FYI] for low, [Needs Attention] for medium, [URGENT] for high
- State the specific bottleneck in one line, referencing the named signal: per-test reward, binary pass rate delta, ramp-plan delta, rubric flag rate, kappa, review queue depth, reviewer-to-writer ratio, AHT vs target, one-shot rate, reviews-per-task, vetting pass rate, time-to-first-task, or update cadence stale
- Tag two to three owners with concrete asks using the → @team: format. Channels:
  @experts-ops (sourcing, vetting flow, credential bar tuning)
  @rubric-review (calibration batches, rubric edits, kappa, Super-Reviewer audits, Docent passes)
  @tooling-platform (Harbor envs, Tinker jobs, custom verifier extensions)
  @vetting (live work-sample tuning, screen tightening or loosening)
  @lab-success (researcher updates, QBR scheduling, expansion conversations)
  @research (benchmark coverage, eval design, scoring methodology)
  @compliance (dual-use review, access controls)
  Examples:
  "→ @rubric-review: Docent pass on failed trajectories, cluster on tool-selection errors"
  "→ @tooling-platform: extend Harbor env with filesystem-state verifier"
  "→ @experts-ops: open Sr SWE L6+ Community Referral wave, loosen tenure to 4+ yr"
  "→ @vetting: retune work-sample on system-design depth"
  "→ @lab-success: send researcher update today; 4d since last touch"

Keep it under 8 lines. Plain text with emoji, no markdown, no commentary outside the format. Do NOT use em dashes.`;
      return streamAnthropic(client, { system, user: `Draft the Slack alert for this project:\n\n${projectBlock(project, risk)}` });
    }

    if (type === "calibration" && project) {
      const system = `${AFTERQUERY_CONTEXT}

Your task: draft a Calibration Batch Slack post that the SPL will publish in the project's contributor workspace. The post announces a calibration exercise to realign reviewers on ambiguous rubric criteria. Structure:

Line 1: 🎯 header with the project name and the calibration purpose, naming the specific signal (e.g. "kappa at 0.62" or "reviews-per-task at 3.4").
Then 2 to 3 lines explaining what you are doing and why, grounded in the model's failure mode.

Then a numbered list (3 items) of borderline cases included in the batch. These should be plausible, domain-specific edge cases derived from the project's capability gap and failure mode. Each item is one sentence describing the edge case being tested.

Then a clear deadline and tie-break rule: the Team Lead for the domain tie-breaks; the rubric will be updated with two examples per score level on the most-contested criterion.

Tone: operator to reviewer. Direct, specific to the domain, framed around making the rubric durable. Reference the named AfterQuery workflow (calibration batch, Docent pass, Super-Reviewer audit, gold-standard seeding) and the target outcome (kappa ≥ 0.7, reviews-per-task ≤ 2, agreement on borderline cases).

Plain text with emoji, no markdown, under 14 lines. Do NOT use em dashes.`;
      return streamAnthropic(client, { system, user: `Draft the calibration batch post for this project:\n\n${projectBlock(project, risk)}` });
    }

    if (type === "warroom" && portfolio) {
      const atRisk = (portfolio || []).filter((p) => p.risk && p.risk.level !== "low");
      const system = `${AFTERQUERY_CONTEXT}

Your task: draft the Daily War Room Brief. This is the message the SPL posts in the team's war-room Slack channel at the start of every day. It is read by other SPLs, the SSPL, and cross-functional ops leads. Structure:

Line 1: a header with the date and the critical / watch count, e.g. "🛎 War Room · Wed Apr 22 · 1 critical, 1 watch"
Then a blank line.

For each at-risk project (high first, then medium), a 2 to 4 line stanza:
🔴 <Lab> · <Project>
<one-line bottleneck naming the specific AfterQuery signal and number, e.g. "Per-test reward 0.31 on Terminal-Bench env; rubric grading shape but not terminal state." or "Kappa 0.62 on the avocat rubric; reviewers diverging on Criterion 3.">
→ <action today>, <named AfterQuery lever>
(owner or cross-functional tag if applicable, e.g. "@tooling-platform + @rubric-review")

Rules:
- Only cover at-risk projects (high + medium). Ignore low projects.
- Reference the named AfterQuery signal and threshold in the bottleneck line (per-test reward, binary pass delta, kappa, one-shot, flag rate, AHT, review queue, reviewer-to-writer, time-to-first-task, ramp-plan delta, vetting pass rate).
- Mix AfterQuery product levers (Docent pass, Harbor verifier extension, Community Referral wave, Partner Vendor, calibration batch, promote writers to reviewers, Super-Reviewer gate) and process levers (incentive tier, workflow re-sequencing, instruction refinement, review process scaling).
- Keep each stanza tight; no more than 4 lines per project.
- End with a single line summary of what "good" looks like by end of day, e.g. "EOD target: OpenAI per-test ≥ 0.45 on the next 20-trajectory batch, Mistral kappa ≥ 0.65."
- Plain text with emoji, no markdown. Do NOT use em dashes.`;
      const user = `Draft today's war-room brief for this SPL portfolio.

Portfolio size: ${(portfolio || []).length} projects.
At-risk: ${atRisk.length} (${atRisk.filter((p) => p.risk.level === "high").length} critical, ${atRisk.filter((p) => p.risk.level === "medium").length} watch).

At-risk projects:

${portfolioBlock(atRisk)}`;
      return streamAnthropic(client, { system, user });
    }

    if (type === "weekly" && projects) {
      const system = `${AFTERQUERY_CONTEXT}

Your task: draft the Monday-morning Weekly Founder Digest for Spencer and Carlos.

Hard rules:
- Total length under 180 words.
- Professional, operator-to-founder voice. Direct, no filler, no hedging, no adjectives like "great" or "excellent".
- Absolutely no em dashes. Use commas, semicolons, periods, or parentheses instead.
- No greetings like "Hope you had a great weekend". No sign-offs beyond the single line "AfterQuery SPL Team".
- Every bullet must name a specific lab, project, metric, and the specific AfterQuery lever (Docent pass, Harbor verifier extension, Community Referral wave, calibration batch, promote writers to reviewers, etc.).

Format exactly:

Subject: <one concrete line, e.g. "Portfolio, week of Apr 22. One at risk, one shipping.">

State of the book. <One paragraph, 2 to 3 sentences max: total engagements, median per-test reward, count at risk, count shipping this week. Numbers first.>

Needs awareness:
• <Lab>, <project>. <One sentence: the metric that moved and the specific AfterQuery lever being pulled.>

Shipping this week:
• <Lab>, <project>. <One short clause.>

Incoming. <One sentence on next week's scoping or intake.>

AfterQuery SPL Team`;
      return streamAnthropic(client, { system, user: `Draft the weekly founder digest now.\n\n${portfolioBlock(projects)}` });
    }

    return Response.json({ error: "Unknown type or missing payload" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
