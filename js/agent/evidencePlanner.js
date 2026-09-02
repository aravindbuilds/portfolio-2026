// js/agent/evidencePlanner.js
// Compares what was claimed (plan.claims_needed) against what was retrieved
// (evidence list). Returns a report the Reasoner and OutputGuard use to
// enforce grounding.

export function validate(plan, evidenceList) {
  const claimsNeeded = plan.claims_needed || [];
  const evidence = Array.isArray(evidenceList) ? evidenceList : [];

  // Heuristic: a claim is "satisfied" if at least one retrieved Evidence's
  // source_text or data contains at least one non-trivial token from the
  // claim text. This is a coarse check — the OutputGuard is the
  // strict line of defense for citation accuracy.
  const lower = (s) => String(s || "").toLowerCase();

  const satisfied = [];
  const missing = [];

  claimsNeeded.forEach((claim) => {
    const claimLower = lower(claim);
    const claimTokens = claimLower
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3);

    const matched = evidence.some((ev) => {
      const evidenceText = `${ev.source_text || ""} ${JSON.stringify(ev.data || {})}`;
      return claimTokens.some((t) => lower(evidenceText).includes(t));
    });

    if (matched) satisfied.push(claim);
    else missing.push(claim);
  });

  return {
    claims_needed: claimsNeeded,
    claims_satisfied: satisfied,
    missing_claims: missing,
    evidence_found: evidence,
    grounded: missing.length === 0,
    partial: missing.length > 0 && satisfied.length > 0,
  };
}
