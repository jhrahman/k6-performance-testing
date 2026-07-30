# Peoplix HR — k6 Performance Testing

A k6 test suite (TypeScript) for [peoplix-hr](https://peoplix-hr.vercel.app), an HR management app (leave, attendance, overtime, employee records). Also includes a folder of standalone scripts written while learning k6 against public sandbox APIs.

## Project layout

```
config.ts              Base URL + endpoint constants for peoplix-hr
helpers/auth.ts         Shared login helper — logs in once, returns the access token
scenarios/               The actual test suite against peoplix-hr
  leave-get.ts             Load test: GET /api/leave under constant virtual users
  leave-journey.ts         A realistic user journey: log in, then view leave — grouped and reported as one flow
api-endpoints/            API reference pulled from the peoplix-hr repo (documents every route these tests hit)
scratch/                 One-off scripts from learning core k6 concepts — not part of the framework, kept for reference
types/                   Type declarations for k6 extensions without official types (e.g. the faker module)
```

## k6 concepts used

What the `scenarios/`/`helpers/` framework actually exercises, and where:

| Concept | Where | What it's doing |
|---|---|---|
| **Scenarios & executors** | `options.scenarios` in both `scenarios/*.ts` | `constant-vus` — holds a fixed number of virtual users running the script on a loop for a set duration, rather than a one-shot run |
| **Thresholds** | `options.thresholds` | Pass/fail budgets per request, e.g. `p(95)<2000` (95% of requests under 2s) and `rate<0.03` (error rate under 3%) |
| **Tagged metrics** | `tags: { endpoint: 'login' \| 'leave' }` on request params | Scopes a threshold to one specific request type (`http_req_duration{endpoint:login}`) instead of the whole script's traffic |
| **Checks** | `check(response, {...})` | Assertions on a response (status code, expected body field) that report pass/fail without stopping the test |
| **Groups** | `group('Employee Login', ...)` in `leave-journey.ts` | Bundles related requests into one named block, so the summary reports them as a step in a user journey rather than flat, unrelated requests |
| **Environment variables & secrets** | `__ENV.EMPLOYEE_EMAIL` / `__ENV.EMPLOYEE_PASSWORD` in `helpers/auth.ts` | Credentials come from `.env.local` at run time, never hardcoded in the script |
| **Reusable helpers** | `helpers/auth.ts` → `login()` | Shared login logic imported by both scenarios, instead of duplicating the auth request in every test file |
| **Think time** | `sleep(...)` between requests | Mimics a real user pausing between actions instead of hammering the API back-to-back |
| **TypeScript** | all of the above | Scripts are type-checked (`@types/k6`), so a typo'd field or wrong argument shows up as an editor error, not a runtime surprise |

`scratch/` covers a few additional concepts not yet used in the main framework — staged ramp-up/ramp-down load profiles, browser automation (`k6/browser`), and faker-generated request payloads.

## Running the peoplix-hr tests

Requires:
- The [k6 binary](https://k6.io/docs/get-started/installation/) on your PATH (k6 v0.57+ for native TypeScript support — no build step needed)
- A `.env.local` file in the project root with valid peoplix-hr credentials:

```
EMPLOYEE_EMAIL=your.email@example.com
EMPLOYEE_PASSWORD=your-password
```

Then run a scenario directly:

```bash
k6 run scenarios/leave-journey.ts
```

Or use the wrapper script, which loads `.env.local` for you:

```bash
./run-test.sh scenarios/leave-journey.ts
```

> `run-test.sh` is a bash script — run it from Git Bash, or `bash run-test.sh ...` from PowerShell.

Each scenario sets thresholds (e.g. 95th-percentile response time under 2s, error rate under 3%) so a run reports pass/fail against real performance budgets, not just "did it 200."

## TypeScript setup

k6 transpiles `.ts` files itself at run time — `npm install` here is only for editor support (autocomplete, type errors) via `@types/k6`, not required to actually run tests:

```bash
npm install
```

## The `scratch/` folder

Scripts from working through individual k6 features one at a time — GET/POST requests, staged load profiles, thresholds, checks, grouped requests, browser automation, faker-generated payloads — run against public sandbox APIs ([restful-booker](https://restful-booker.herokuapp.com/), [gorest.co.in](https://gorest.co.in/), [QuickPizza](https://quickpizza.grafana.com/)). They're self-contained and don't share any code with `scenarios/`.

## API reference

[`api-endpoints/API-ENDPOINTS.md`](api-endpoints/API-ENDPOINTS.md) documents every peoplix-hr route — auth, request/response shapes, error codes — pulled from the main app's repo. Useful for writing new scenarios against endpoints not covered yet.

## Notes

- `.env.local` is gitignored — credentials never get committed.
- `scenarios/` targets a real in-progress app; `scratch/` targets public sandbox APIs meant for testing. Neither hits anything in production that isn't meant to be load tested.

## License

MIT — see [LICENSE](LICENSE) for details.
