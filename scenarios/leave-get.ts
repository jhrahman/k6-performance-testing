import http from "k6/http";
import { check, sleep } from "k6";
import { login } from "../helpers/auth.ts";
import { URLS } from "../config.ts";

export const options = {
  scenarios: {
    employee_get_leave: {
      executor: "constant-vus",
      vus: 3,
      duration: "1m",
    },
  },
  thresholds: {
    'http_req_duration{endpoint:login}': ["p(95)<2000", "p(99)<2500"],
    'http_req_duration{endpoint:leave}': ["p(95)<2000", "p(99)<2500"],
    'http_req_failed{endpoint:leave}': ["rate<0.03"],
  },
};


export default function () {
  const auth = login();
  
  const params = {
    headers: {
      'Authorization': `Bearer ${auth.accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    tags:{
        endpoint: 'leave'
    }
  };

  const response = http.get(URLS.leave, params);
  sleep(2);

  check(response, {
    "GET /api/leave returns 200": (response) => response.status === 200,
    "GET /api/leave retunrs data":(response)=>(response.json() as { data: unknown }).data !== undefined
  });

  if (response.status !== 200) 
    console.log(`GET /api/leave failed: ${response.status}`);
}
