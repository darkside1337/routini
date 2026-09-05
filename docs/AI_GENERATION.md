# AI Generation Flow

Guidelines for LLM integrations, habit suggestion generation, and failure states in Routini.

## Resilience & Timeouts

- **Explicit Timeouts:** Set explicit timeouts on all LLM generation calls (`generateHabits`, `regenerateHabits`). Never leave requests pending indefinitely.
- **Graceful Failure:** Return typed failure shapes (`{ success: false, error: string }`) instead of unhandled exceptions.
- **UI Failure States:** All AI-driven modal and review interfaces must implement visible retry and error states, not just loading spinners and success views.

## Output Validation & Throttling

- **Schema Validation:** Always parse and validate raw LLM outputs through a Zod schema before displaying them or saving to the database.
- **Rate Limiting:** Throttle generation and re-roll requests per user to manage API costs and prevent rapid repeat calls.
