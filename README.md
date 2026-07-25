# k6 Performance Testing

A collection of [k6](https://k6.io/) scripts exploring different flavors of API load and performance testing — GET/POST requests, dynamic payloads, faker-generated test data, and staged stress tests against a couple of public sandbox APIs ([restful-booker](https://restful-booker.herokuapp.com/), [gorest.co.in](https://gorest.co.in/), and Grafana's [QuickPizza](https://quickpizza.grafana.com/)).

## What's in here

| Script | What it does |
|---|---|
| `get.js` / `test1.js` | Basic authenticated GET requests with fixed VUs and iterations |
| `post.js` | POST requests using a JSON payload template (`payload.json`), with a unique email generated per request |
| `post2.js` | POST requests reading the payload straight from an external JSON file (`payload2.json`) |
| `dynamic-post.js` | POST requests with dynamically generated fake data via the [xk6-faker](https://github.com/grafana/xk6-faker) extension |
| `stress-test.js` | A staged load test that ramps virtual users up, holds, then ramps down |

## Running a script

Make sure you have the [k6 binary](https://k6.io/docs/get-started/installation/) installed, then run any script with:

```bash
k6 run <script-name>.js
```

For example:

```bash
k6 run stress-test.js
```

Scripts that import `k6/x/faker` (like `dynamic-post.js`) rely on k6's automatic extension resolution — the first run will provision a custom binary in the background before executing the test.

## What each test checks

Every script uses k6's `check()` to validate at least the response status code, and the POST scripts additionally verify the response body contains an expected ID field. Results (pass/fail rate, response times, throughput) print to the terminal as a summary once the test run finishes.

## Notes

- These scripts target public sandbox/demo APIs meant for testing — not production services.
- Payloads for POST requests live in separate JSON files (`payload.json`, `payload2.json`) to keep scripts readable and to demonstrate a couple of different ways k6 can source request data.
