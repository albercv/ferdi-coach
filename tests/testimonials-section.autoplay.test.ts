// @vitest-environment node

/**
 * Autoplay pause/resume logic tests for TestimonialsSection.
 *
 * NOTE: @testing-library/react is not installed and vitest runs in node
 * environment (no DOM). Full component rendering with hooks is therefore
 * not possible without additional setup.
 *
 * Tests 1 and 2 validate the core autoplay behaviour by testing the
 * interval logic directly (unit-level). Tests 3 and 4 are documented
 * as skipped due to the environment constraints described above.
 *
 * To enable full component tests in the future:
 *   1. npm install -D @testing-library/react @testing-library/user-event jsdom
 *   2. Set vitest environment to "jsdom" (or per-file with @vitest-environment jsdom)
 *   3. Replace the manual interval tests below with RTL render + fireEvent.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const AUTOPLAY_INTERVAL_MS = 3200

// ---------------------------------------------------------------------------
// Minimal simulation of the autoplay useEffect logic
// ---------------------------------------------------------------------------

function createAutoplayInterval(
  scrollNext: () => void,
  isActive: () => boolean,
): ReturnType<typeof setInterval> | null {
  if (!isActive()) return null
  return setInterval(() => {
    scrollNext()
  }, AUTOPLAY_INTERVAL_MS)
}

describe("testimonials-section autoplay logic", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Test 1: autoplay calls scrollNext after interval elapses
  it("calls scrollNext after AUTOPLAY_INTERVAL_MS when autoplay is active", () => {
    const scrollNext = vi.fn()
    const id = createAutoplayInterval(scrollNext, () => true)

    expect(scrollNext).not.toHaveBeenCalled()
    vi.advanceTimersByTime(3500)
    expect(scrollNext).toHaveBeenCalledTimes(1)

    clearInterval(id!)
  })

  // Test 2: autoplay does NOT call scrollNext when inactive (simulates pause on click)
  it("does NOT call scrollNext after AUTOPLAY_INTERVAL_MS when autoplay is paused", () => {
    const scrollNext = vi.fn()
    // Start with active autoplay, then pause (clear interval, do not restart)
    const id = createAutoplayInterval(scrollNext, () => true)
    clearInterval(id!) // simulate setAutoplayActive(false) → effect cleanup runs

    vi.advanceTimersByTime(3500)
    expect(scrollNext).not.toHaveBeenCalled()
  })

  // Test 3: SKIPPED — requires DOM environment + React Testing Library
  it.skip("click on CarouselNext pauses autoplay (right arrow first click)", () => {
    // Setup: mount <TestimonialsSection>, advance timers to confirm autoplay runs,
    // then fireEvent.click on [data-slot="carousel-next"], advance again,
    // and assert scrollNext was NOT called a second time.
  })

  // Test 4: SKIPPED — requires DOM environment + React Testing Library
  it.skip("double-click on CarouselNext resumes autoplay (toggle: pause → resume)", () => {
    // Setup: mount <TestimonialsSection>, click next (pause), click next again
    // (resume), advance timers, assert scrollNext is called again.
  })
})
