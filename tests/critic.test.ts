// DemoPilot Grounding Critic & Claim Verification Test Suite
// Verifies Law 1: Principle of Evidence-Grounded Demonstrations

import { verifySceneWithCritic } from "../src/lib/ai/critic";
import { DemoScene, EvidenceItem } from "../src/types";

async function runCriticTests() {
  console.log("▶ Running Grounding Critic Test Suite...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  const validEvidence: EvidenceItem = {
    id: "evi-test-1",
    claim: "Create tasks instantly with keyboard shortcuts",
    pageUrl: "https://demo.app/tasks",
    pagePath: "/tasks",
    elementSelector: "button#create-task",
    elementText: "Create Task",
    confidenceScore: 0.96,
    verifiedAt: new Date().toISOString(),
  };

  const sceneWithEvidence: DemoScene = {
    id: "scene-test-1",
    planId: "plan-test",
    orderIndex: 0,
    title: "Instant Task Creation",
    purpose: "Demonstrate quick issue logging",
    pagePath: "/tasks",
    viewportWidth: 1920,
    viewportHeight: 1080,
    durationSec: 8.0,
    actions: [],
    evidence: validEvidence,
    narration: {
      id: "narr-test-1",
      sceneId: "scene-test-1",
      voice: "Puck (Gemini Studio)",
      text: "From the tasks view, users can create tasks instantly using keyboard shortcuts.",
      durationSec: 8.0,
      verifiedGrounding: true,
    },
  };

  // Test 1: Grounded scene with valid high-confidence evidence
  const report1 = await verifySceneWithCritic({
    scene: sceneWithEvidence,
    evidence: validEvidence,
  });

  assert(report1.isGrounded === true, "Approves narration backed by verified DOM evidence");
  assert(report1.confidenceScore >= 0.9, "Score reflects high evidentiary confidence");

  // Test 2: Ungrounded scene without evidence
  const sceneWithoutEvidence: DemoScene = {
    ...sceneWithEvidence,
    evidence: undefined,
  };

  const report2 = await verifySceneWithCritic({
    scene: sceneWithoutEvidence,
    evidence: undefined,
  });

  assert(report2.isGrounded === false, "Rejects or flags scenes lacking concrete DOM evidence");

  console.log(`\nCritic Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runCriticTests().catch((err) => {
  console.error("Critic test execution error:", err);
  process.exit(1);
});
