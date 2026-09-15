---
name: PR Butler
description: Automate comprehensive pre-commit / PR preparation — translations, code cleanup, tests, documentation, and quality gates.
---

## Overview

The PR Butler automates the complete pre-commit checklist for web projects, ensuring code is ship-ready before PR submission. It orchestrates translation fixes, code cleanup, test generation, documentation updates, and quality validation in a single pass.

### When to Invoke

- User runs "prepare for PR" or "pre-commit check"
- User asks to "fix the scaffold" or "make this PR-ready"
- Before any pull request submission

---

## Instructions

<!-- 
  YOUR TASK: Fill in the detailed step-by-step instructions for each of the 6 steps below.
  Each step should tell the AI agent exactly what to do, what files to touch, 
  and what output to produce. Be specific — vague instructions produce vague results.
-->

### Step 1: Translation Detection & Fix

<!-- Describe how to detect missing French translations and generate them -->
1. Read `scaffold/website/src/translations/en.json` and `scaffold/website/src/translations/fr.json`.
2. Compare the 2 files to identify missing values
3. Add missing values in the `scaffold/website/src/translations/fr.json` file by translating values from `scaffold/website/src/translations/en.json` to french.
4. Update the translation loading and toggling mechanism inside `scaffold/website/src/main.ts` (with a helper `applyTranslations`) and `scaffold/website/src/taskManager.ts`. Clicking language switch buttons must dynamically update all hardcoded static labels and task priority badges in the DOM without requiring a full page refresh.
5. Inspect `*.html` and `*.ts` files in scaffold/website for hardcoded UI strings. Add or preserve translation hooks to allow switching between English and French. Update the static labels, placeholders, select options, filters, stats labels, footer text, task priority badges, and buttons.

### Step 2: Code Cleanup

<!-- Describe how to format code and fix lint violations -->
1. Apply consistent formatting to all source files under scaffold/website/src and scaffold/website/src/tests.
2. Repair obvious formatting and style issues in TypeScript files, even when no dedicated lint config is present.
3. If a linter or auto-fix tool is available, run it and apply auto-fixable changes.

### Step 3: Test Automation

<!-- Describe how to run tests, generate missing test cases, achieve >80% coverage -->
1. Change directory to scaffold/website and run the existing test suite with npm run test.
2. Review the test output and identify any failing cases.
3. Add or extend tests to cover all TypeScript source files under scaffold/website/src.

### Step 4: Documentation Updates

<!-- Describe how to add docstrings, update README.md, generate CHANGELOG.md and PR_REQUEST.md -->
1. Add JSDoc/TSDoc comments to all public functions in scaffold/website/src/.
2. Update scaffold/website/README.md by adding sections for:
   Features describing the app functionality
   Testing with install and command usage 
   Contributing with guidance for submitting fixes and PRs

### Step 5: Quality Gates

<!-- Describe the quality gates to enforce before proceeding -->
1. After completing Steps 1–4, evaluate the final output against the quality gates.
2. Run npm run test:coverage and verify that overall coverage is at least 80%.
3. Confirm that npm run test completes successfully and all tests pass.
4. Validate that there are no remaining critical lint or syntax issues. If no dedicated linter exists, ensure there are no obvious TypeScript or formatting problems.
5. If any gate fails, stop and report the failure immediately.
6. Document the failure reason clearly, including the failing tests, coverage percentage, or lint/syntax issues.
7. Only proceed to Step 6 after all quality gates pass.

### Step 6: PR Preparation

<!-- Describe how to generate the conventional commit message and finalize deliverables -->

---

## Examples

<!-- 
  YOUR TASK: Provide at least 2 example scenarios showing input and expected output.
  Example: "Make the scaffold PR-ready" → what the agent reports at each step.
-->

### Example 1: Full PR Preparation

**Input:** "Make the scaffold PR-ready"

**Expected output:**

```
<!-- Fill in the expected step-by-step output -->
```

### Example 2: Translation-Only Run

**Input:** "Fix the missing French translations"

**Expected output:**

```
<!-- Fill in the expected output -->
```

---

## Success Criteria

<!-- 
  YOUR TASK: Define the checklist the agent uses to verify everything passed.
  At minimum, cover all 6 steps.
-->

- [ ] All 14 French translation keys present in `fr.json`
- [ ] Code formatted consistently
- [ ] No lint violations
- [ ] Test coverage ≥ 80%
- [ ] All tests pass
- [ ] JSDoc/TSDoc on all public functions
- [ ] `README.md` has Features, Testing, and Contributing sections
- [ ] `CHANGELOG.md` generated
- [ ] `PR_REQUEST.md` generated with summary and checklist
- [ ] Conventional commit message prepared

---

<!-- ⚠️ DO NOT MODIFY ANYTHING BELOW THIS LINE ⚠️ -->
<!-- ================================================ -->
<!-- REPORT CARD — Auto-grading step                  -->
<!-- This step runs automatically after your Skill    -->
<!-- completes. It generates a progress report card   -->
<!-- so you can track how well your Skill is doing.   -->
<!-- ================================================ -->

## Step 7: Report Card (Do Not Modify)

After completing all steps above, generate a **Report Card** summarizing the results. Output the report card in the following exact format:

```
═══════════════════════════════════════════════
  PR BUTLER — REPORT CARD
═══════════════════════════════════════════════

  📋 Step 1: Translation Detection & Fix
     Status:  [PASS / FAIL]
     Details: [X of 14 French keys added to fr.json]

  📋 Step 2: Code Cleanup
     Status:  [PASS / FAIL]
     Details: [X files formatted, X lint violations fixed]

  📋 Step 3: Test Automation
     Status:  [PASS / FAIL]
     Details: [Coverage: X% → Y%, X new test cases added]

  📋 Step 4: Documentation Updates
     Status:  [PASS / FAIL]
     Details: [X functions documented, README updated: Y/N,
               CHANGELOG.md: Y/N, PR_REQUEST.md: Y/N]

  📋 Step 5: Quality Gates
     Status:  [PASS / FAIL]
     Details: [Coverage ≥ 80%: Y/N, Lint clean: Y/N,
               All tests pass: Y/N]

  📋 Step 6: PR Preparation
     Status:  [PASS / FAIL]
     Details: [Commit message: Y/N, PR_REQUEST.md finalized: Y/N]

  ─────────────────────────────────────────────
  OVERALL:   [X / 6 steps passed]
  GRADE:     [A / B / C / F]
             A = 6/6 passed
             B = 5/6 passed
             C = 4/6 passed
             F = 3 or fewer passed
═══════════════════════════════════════════════
```

**Grading rules:**
- A step passes only if ALL its success criteria are met
- Do not skip any step in the report — mark it FAIL if not attempted
- Be honest in the details — the evaluator will verify against actual file contents
- Output this report card as the very last thing your Skill does
