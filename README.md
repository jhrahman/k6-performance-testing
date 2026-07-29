# k6 Performance Testing

A collection of [k6](https://k6.io/) scripts exploring different flavors of API load and performance testing — GET/POST requests, dynamic payloads, faker-generated test data, and staged stress tests against a couple of public sandbox APIs ([restful-booker](https://restful-booker.herokuapp.com/), [gorest.co.in](https://gorest.co.in/), and Grafana's [QuickPizza](https://quickpizza.grafana.com/)).

## Topics covered so far

- **Basic HTTP requests** — GET and POST requests with fixed virtual users (VUs) and iteration counts
- **Request payloads** — sending JSON payloads built inline, loaded from an external JSON file, and generated dynamically per request
- **Fake test data** — generating realistic dummy data on the fly with the [xk6-faker](https://github.com/grafana/xk6-faker) extension
- **Load profiles** — staged tests that ramp virtual users up, hold steady, then ramp down, as well as constant-VU scenarios that hold a fixed number of users for a set duration
- **Thresholds** — pass/fail criteria for a test run, such as requiring 95th/99th percentile response times to stay under a limit, or the error rate to stay below a percentage
- **Checks** — validating responses (status codes, expected fields like an access token) and logging useful details when a check fails
- **Grouping requests** — using `group()` to organize related requests under a named block for clearer reporting
- **Environment variables & secrets** — reading tokens/credentials via `__ENV` instead of hardcoding them, loaded from a gitignored env file
- **Reusable helpers** — pulling shared logic (like a login/authentication step) into its own module so multiple test scripts can reuse it
- **Browser-based testing** — using k6's browser module to open a real browser, navigate pages, and emulate a specific device viewport size
- **Testing real vs. sandbox targets** — running the same techniques against public sandbox/demo APIs as well as a real in-progress application

## Setup

Make sure you have the [k6 binary](https://k6.io/docs/get-started/installation/) installed and available on your PATH.

Scripts that authenticate against gorest.co.in need an API token. Create a `.env.local` file in the project root (this file is gitignored, so it stays out of version control):

```
GOREST_API_TOKEN=your-token-here
```

Scripts read it via `__ENV.GOREST_API_TOKEN` rather than hardcoding it.

## Running a script

Use the included wrapper, which loads `.env.local` and runs k6 for you:

```bash
./run-test.sh <script-name>.js
```

Scripts that don't need the gorest token can also be run directly with plain `k6 run <script-name>.js`.

Scripts that import `k6/x/faker` rely on k6's automatic extension resolution — the first run will provision a custom binary in the background before executing the test.

Scripts that import `k6/browser` need a Chromium browser available and will open a real (headless) browser window while the test runs.

> Note: `run-test.sh` is a bash script. Run it from Git Bash (or `bash run-test.sh <script-name>.js` from PowerShell) — it won't execute directly in PowerShell or cmd.

## What each test checks

Every script uses k6's `check()` to validate at least the response status code, and some additionally verify the response body contains an expected field (e.g. an ID or an access token). Results (pass/fail rate, response times, throughput) print to the terminal as a summary once the test run finishes.

## Notes

- Some scripts target public sandbox/demo APIs meant for testing, others target a real app under development — none of these hit production services.
- Payloads for POST requests are sourced a few different ways (inline objects, external JSON files, faker-generated data) to demonstrate the different ways k6 can source request data.
- Secrets (API tokens, credentials) are kept out of scripts and out of git via `.env.local` + `__ENV`, loaded through `run-test.sh`.

## License

MIT — see [LICENSE](LICENSE) for details.
