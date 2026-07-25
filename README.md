# k6 Performance Testing

A collection of [k6](https://k6.io/) scripts exploring different flavors of API load and performance testing — GET/POST requests, dynamic payloads, faker-generated test data, and staged stress tests against a couple of public sandbox APIs ([restful-booker](https://restful-booker.herokuapp.com/), [gorest.co.in](https://gorest.co.in/), and Grafana's [QuickPizza](https://quickpizza.grafana.com/)).

## What's in here

| Script | What it does |
|---|---|
| `get.js` / `test1.js` | Authenticated GET requests against gorest.co.in with fixed VUs and iterations |
| `post.js` | POST requests using a JSON payload template (`payload.json`), with a unique email generated per request |
| `post2.js` | POST requests reading the payload straight from an external JSON file (`payload2.json`) |
| `dynamic-post.js` | POST requests with dynamically generated fake data via the [xk6-faker](https://github.com/grafana/xk6-faker) extension |
| `stress-test.js` | A staged load test that ramps virtual users up, holds, then ramps down |

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

For example:

```bash
./run-test.sh get.js
```

Scripts that don't need the gorest token (`post2.js`, `dynamic-post.js`, `stress-test.js`) can also be run directly with plain `k6 run <script-name>.js`.

Scripts that import `k6/x/faker` (like `dynamic-post.js`) rely on k6's automatic extension resolution — the first run will provision a custom binary in the background before executing the test.

> Note: `run-test.sh` is a bash script. Run it from Git Bash (or `bash run-test.sh <script-name>.js` from PowerShell) — it won't execute directly in PowerShell or cmd.

## What each test checks

Every script uses k6's `check()` to validate at least the response status code, and the POST scripts additionally verify the response body contains an expected ID field. Results (pass/fail rate, response times, throughput) print to the terminal as a summary once the test run finishes.

## Notes

- These scripts target public sandbox/demo APIs meant for testing — not production services.
- Payloads for POST requests live in separate JSON files (`payload.json`, `payload2.json`) to keep scripts readable and to demonstrate a couple of different ways k6 can source request data.
- Secrets (API tokens) are kept out of scripts and out of git via `.env.local` + `__ENV`, loaded through `run-test.sh`.

## License

MIT — see [LICENSE](LICENSE) for details.
