import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-5-20250929";

const SYSTEM_BASE = `You are an operations assistant for an AfterQuery Strategic Projects Lead (SPL).

AfterQuery is an applied research lab curating data solutions to accelerate foundation model development. Tagline: "We teach machines how experts think." Customers are frontier AI labs: OpenAI, Anthropic, Google DeepMind, Meta AI, xAI, Microsoft, Apple, Nvidia, Amazon, Cohere, Mistral. AfterQuery has 100K+ verified professionals in its network (2,400+ active in the Experts community), raised a $30M Series A led by Altos Ventures at a $300M valuation with Y Combinator, BoxGroup, Raine Group, and angels from Anthropic, OpenAI, DeepMind, Meta, Microsoft, and hit $100M ARR in 14 months.

Product lineup the SPL runs: SFT + CoT Demonstrations, Rubric and Verifier-based RL, Tool-calling RL Environments (API/MCP), Computer-use and Browser-use Trajectories, RLHF Preference Pairs, Code Generation (tests + debugging traces), Deep Research, Custom Evals and Benchmarks, Multimodal Training, Loss Analyses.

Published benchmarks to reference when relevant: FinanceQA, IDE-Bench, Market-Bench, App-Bench, UI-Bench, Terminal-Bench 2.0, τ²-bench.

Operational surface: AfterQuery Experts Network (sourcing), Rubric Review (quality), Tooling Platform (in-house custom environments, built per-engagement using components like Harbor and Tinker), Docent (trajectory clustering), Vetting, Lab Success, Compliance.

Key methodological choice: AfterQuery uses per-test reward (fraction of verifier tests passing) instead of binary pass/fail as the primary training signal. Delta between per-test reward and binary pass rate is diagnostic: high per-test with low binary means the rubric is grading trajectory shape but the model can't finish; both low means rubric or pool is broken.

Tone: researcher to researcher. Concrete numbers, specific levers, no generic reassurance. No em dashes (use commas, semicolons, periods, or parentheses).`;

function projectContext(p) {
  const pct = ((p.completed / p.targetTasks) * 100).toFixed(0);
  const flagRate = ((p.rubricFlagCount / Math.max(1, p.completedOrFlagged)) * 100).toFixed(1);
  return `PROJECT
Lab: ${p.lab}
Project: ${p.project}
Capability gap: ${p.capabilityGap}
Product: ${p.productType}
Benchmark target: ${p.benchmarkTarget}
Credential bar: ${p.credentialBar}
Modality: ${p.modality}
Per-test reward: ${p.perTestRewardAvg.toFixed(2)}
Binary pass rate: ${p.binaryPassRate.toFixed(2)}
Tasks: ${p.completed} / ${p.targetTasks} (${pct}%)
Vetting pass rate: ${p.expertVettingPassRate}%
Rubric flags: ${p.rubricFlagCount} / ${p.completedOrFlagged} (${flagRate}%)
Experts: ${p.expertCount} active at $${p.avgHourlyRate}/hr median, source ${p.source}
Region: ${p.region} · ${p.language}
Deadline: ${p.deadlineSub} (${p.deadlineLabel} out)
Status: ${p.status}`;
}

function portfolioContext(projects) {
  const lines = projects.map(
    (p) =>
      `- ${p.lab}, ${p.project}: risk=${p.risk}, per-test=${p.perTestRewardAvg.toFixed(
        2
      )}, binary=${p.binaryPassRate.toFixed(2)}, tasks=${p.completed}/${
        p.targetTasks
      }, deadline=${p.deadlineSub}, experts=${p.expertCount}, bench=${p.benchmarkTarget}`
  );
  return `PORTFOLIO (${projects.length} engagements)\n${lines.join("\n")}`;
}

async function handleRiskJson(client, project) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: `${SYSTEM_BASE}

Return ONLY valid JSON of the form:
{"summary": "<1 to 2 sentence risk summary naming per-test reward, binary pass rate delta, or rubric flags as appropriate>", "action": "<1 sentence recommended action naming a specific AfterQuery lever (Docent pass, extend verifier, open L6+ wave, etc.)>"}

No prose outside the JSON. No code fences.`,
    messages: [
      {
        role: "user",
        content: `${projectContext(project)}\n\nReturn the JSON risk assessment now.`,
      },
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
          max_tokens: 1024,
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

  const body = await req.json().catch(() => ({}));
  const { type, project, projects } = body;
  const client = new Anthropic({ apiKey });

  try {
    if (type === "risk" && project) {
      return handleRiskJson(client, project);
    }

    if (type === "researcher" && project) {
      return streamAnthropic(client, {
        system: `${SYSTEM_BASE}\n\nYou are drafting a researcher-to-researcher status email from the AfterQuery SPL to the post-training lead at the client lab. Format: Subject line, then body. Lead with concrete numbers (per-test reward, binary pass rate, tasks, vetting, rubric flags, deadline). Name the specific AfterQuery lever being pulled (Docent pass, extend verifier test suite, open second cohort from Experts Network, escalate to Tooling Platform). Tone adapts to risk level. Sign off "AfterQuery SPL Team".`,
        user: `${projectContext(project)}\n\nDraft the email now.`,
      });
    }

    if (type === "slack" && project) {
      return streamAnthropic(client, {
        system: `${SYSTEM_BASE}\n\nYou are drafting an internal Slack alert for AfterQuery ops sub-teams. Format:

🟡 <lab>, <project> [Needs Attention / At Risk / On Track]
<one line: specific metric that triggered the alert>
→ @<channel>: <specific action>
→ @<channel>: <specific action>
→ @<channel>: <specific action>

Channels to choose from: @experts-ops, @rubric-review, @tooling-platform, @vetting, @lab-success, @research, @compliance. Pick 2 to 3 based on the actual failure mode. Use 🔴 for high risk, 🟡 for medium, 🟢 for low. No other commentary.`,
        user: `${projectContext(project)}\n\nDraft the Slack alert now.`,
      });
    }

    if (type === "weekly" && projects) {
      return streamAnthropic(client, {
        system: `${SYSTEM_BASE}\n\nYou are drafting the Monday-morning Weekly Founder Digest for Spencer and Carlos.

Hard rules:
- Total length under 180 words.
- Professional, operator-to-founder voice. Direct, no filler, no hedging, no adjectives like "great" or "excellent".
- Absolutely no em dashes. Use commas, semicolons, periods, or parentheses instead.
- No greetings like "Hope you had a great weekend". No sign-offs beyond the single line "AfterQuery SPL Team".
- Every bullet must name a specific lab, project, metric, and the specific AfterQuery lever (Docent pass, extend verifier, open Sr SWE L6+ wave, cohort from Experts Network, etc.).

Format exactly:

Subject: <one concrete line, e.g. "Portfolio, week of Apr 22. Two at risk, three shipping.">

State of the book. <One paragraph, 2 to 3 sentences max: total engagements, median per-test reward, count at risk, count shipping this week. Numbers first.>

Needs awareness (2 to 3 bullets):
• <Lab>, <project>. <One sentence: the metric that moved and the specific lever being pulled.>

Shipping this week:
• <Lab>, <project>. <One short clause.>

Incoming. <One sentence on next week's scoping or intake.>

AfterQuery SPL Team`,
        user: `${portfolioContext(projects)}\n\nDraft the weekly digest now.`,
      });
    }

    return Response.json({ error: "Unknown type or missing payload" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
