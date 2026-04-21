# CLAUDE.md — Ferdy Coach

> Instructions for Claude Code. Read at every session. Do not delete or move.

---

## Project Overview

**Ferdy Coach** is a heartbreak coaching web platform.
Stack: Next.js (App Router) · Stripe · Resend · `.md` files as documental database.
The codebase was started by an external developer. Existing code must be respected.

---

## Core Principles

- **Simplicity First** — Make every change as simple as possible. Impact minimal code.
- **No Laziness** — Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact** — Changes should only touch what is necessary. Avoid introducing bugs.

---

## Golden Rules

**1. Never break what works**
- Do not modify existing functionality, design, styles or logic unless explicitly part of the current task.
- If unsure whether a change affects something existing: ask before executing.
- Spotted an improvement not in scope? Report it as a suggestion. Never implement silently.

**2. Reuse before creating**
- Before creating any component, hook, function or utility: search for an existing one first.
- If something partially solves the problem: extend or adapt it. Never duplicate.

**3. One task, one scope**
- Every task has a defined scope. Do not expand it without explicit confirmation.
- If a task requires touching more than 3 unrelated files: stop and report before continuing.

---

## Workflow Orchestration

### 1. Plan First
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- Write the plan to `tasks/todo.md` with checkable items before touching any code.
- Check in and get confirmation before starting implementation.
- If something goes sideways: STOP and re-plan immediately. Do not keep pushing.

### 2. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern learned.
- Write rules that prevent the same mistake from happening again.
- Review `tasks/lessons.md` at the start of each session.

### 3. Verification Before Done
- Never mark a task complete without proving it works.
- Ask yourself: *"Would a staff engineer approve this?"*
- Diff behavior between main and your changes when relevant.
- Run tests, check logs, demonstrate correctness.

### 4. Demand Elegance
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: implement the elegant solution instead.
- Skip this for simple, obvious fixes — do not over-engineer.

### 5. Autonomous Bug Fixing
- When given a bug report: just fix it. Do not ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching required from the user.

---

## Code Standards

### Next.js App Router
- **Server Components by default.** Use `"use client"` only for interactivity, local state or browser APIs.
- Business logic goes in: `lib/` · `services/` · `hooks/` · `app/api/` or Server Actions.
- UI components are dumb: receive props, render, emit events. Nothing else.

### SOLID — all five, always

- **S — Single Responsibility:** Every function, component and module does exactly one thing. If you need "and" to describe it, split it.
- **O — Open/Closed:** Extend behavior by composition or new abstractions. Never modify working code to add a feature — add alongside it.
- **L — Liskov Substitution:** Subtypes and variants must be drop-in replacements. A component variant must honor the same contract as the base. Never narrow what a parent accepts or widen what it returns.
- **I — Interface Segregation:** Props, types and interfaces must be minimal and specific. No component should receive props it does not use. Split large interfaces into focused ones.
- **D — Dependency Inversion:** Depend on abstractions, not concretions. External services (Stripe, Resend, etc.) are always wrapped in a service layer — never called directly from components or pages.

### DRY
- No logic block repeated more than once without abstracting into a shared function or hook.
- Repeated string literals → `lib/constants.ts`. Shared types → `types/`. Shared logic → `lib/` or `services/`.

### Clean Code
- **Names are documentation:** variables, functions and components must reveal intent. No abbreviations, no generic names (`data`, `handleClick`, `item`).
- **Functions do one thing** at one level of abstraction. If a function mixes high-level orchestration with low-level detail, extract the detail.
- **No magic numbers or strings** inline. Every literal with meaning gets a named constant.
- **Positive conditionals first:** prefer `if (isValid)` over `if (!isInvalid)`.
- **Early returns over nesting:** flatten logic with guard clauses. Max 2 levels of nesting inside a function.
- **Comments explain why, not what.** If the code needs a comment to explain what it does, rewrite the code.
- **Dead code is deleted**, not commented out. Git tracks history.

### Size limits
- Functions: 40 lines max · Components: 150 lines max · Files: 300 lines max.

### TypeScript
- `any` is forbidden without a comment explaining why it cannot be typed.
- Explicit types on all function parameters and non-trivial return values.
- Never use `as` to force types without runtime validation on external data.

### Error handling
- Empty catch blocks are forbidden. `console.log` as sole error handling is forbidden.

```ts
try {
  // logic
} catch (error) {
  console.error('[context][function]', error)
  throw new Error('Descriptive message for the client')
}
```

---

## Security

- Zero secrets in source code. Always `process.env.VARIABLE_NAME`.
- Always validate on the server. Client-side validation is UX, not security.
- Stripe webhooks must verify signature before any logic runs:

```ts
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
```

---

## .MD Files — Documental Database

ome `.md` files act as the project's content database.

- **Do not delete, overwrite or move** any `.md` file without explicit confirmation.
- Before any operation affecting the root or `/public`: check which `.md` files exist.

---

## Task Management Files

- `tasks/todo.md` — active task plan with checkable items. Updated as work progresses.
- `tasks/lessons.md` — lessons learned from corrections. Reviewed each session.

---

## Git

- Commit prefix: `feat:` · `fix:` · `refactor:` · `docs:` · `chore:`
- Do not mix functional and formatting changes in the same commit.

---

## Business Context

- End user: a person going through a breakup. UX must be empathetic and clear.
- Critical flow: **visit → purchase → confirmation → onboarding**. Any break here is high priority.
- Transactional emails (Resend) are part of the product, not an afterthought.

---

_Update this file when conventions, structure or project context change._

---

## Memory Vault

Path: ~/claude-memory/

At session start: read ~/claude-memory/Index.md and relevant files in ~/claude-memory/Context/ferdy-coach/ for project context.

When you learn something reusable:
- Decision made → ~/claude-memory/Decisions/ferdy-coach/YYYY-MM-DD-topic.md
- Pattern discovered → ~/claude-memory/Patterns/topic.md
- Mistake to avoid → ~/claude-memory/Mistakes/topic.md
- At session end → ~/claude-memory/Sessions/ferdy-coach/YYYY-MM-DD.md with a summary of what was done

After writing to the vault: cd ~/claude-memory && git add . && git commit -m "memory: update" && git push
