import http from 'k6/http'
import { check, sleep } from 'k6'
import { URLS } from '../config.ts'
import { login } from '../helpers/auth.ts'
import { group } from 'k6'

export const options = {
    scenarios: {
        employee_leave_journey: {
            executor: 'constant-vus',
            vus: 2,
            duration: '1m'
        }
    },
    thresholds: {
        'http_req_duration{endpoint:login}': ['p(95)<3000'],
        'http_req_duration{endpoint:leave_get}': ['p(95)<3000'],
        'http_req_duration{endpoint:leave_post}': ['p(95)<3000'],
        'http_req_duration{endpoint:leave_patch}': ['p(95)<3000'],
        'http_req_duration{endpoint:leave_delete}': ['p(95)<3000'],

        'http_req_failed{endpoint:login}': ['rate<0.03'],
        'http_req_failed{endpoint:leave_get}': ['rate<0.03'],
        'http_req_failed{endpoint:leave_post}': ['rate<0.03'],
        'http_req_failed{endpoint:leave_patch}': ['rate<0.03'],
        'http_req_failed{endpoint:leave_delete}': ['rate<0.03']

    }
}

export default function () {
    let auth!: ReturnType<typeof login>
    let leaveID: string
    group('Employee Login', () => {
        auth = login()

        check(auth.status, {
            'Employee Login Status is 200': (r) => r === 200
        })

    })

    if (auth.status !== 200) {
        console.log(`Employee Login Error: ${auth.status}`)
        return
    }

    group('Employee View Leave', () => {

        const params = {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            tags: {
                endpoint: 'leave_get'
            }
        }

        const response = http.get(URLS.leave, params)
        sleep(1)

        check(response, {
            "GET /api/leave returns 200": (r) => r.status === 200,
            "GET /api/leave has data": (r) => r.status !== undefined
        })
    })

    group('Employee Apply for Leave', () => {
        const startDate = `2026-08-${10 + __VU}`
        const endDate = `2026-08-${11 + __VU}`

        const payload = JSON.stringify({
            leave_type: "casual",
            start_date: startDate,
            end_date: endDate,
            reason: `Performance Testing | VU:${__VU} ITER: ${__ITER}`
        })

        const params = {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            tags: {
                endpoint: 'leave_post'
            }
        }

        const response = http.post(URLS.leave, payload, params,)

        const body = response.json() as any
        leaveID = body.data.id


        check(response, {
            "POST api/leave returns 201": (r) => r.status === 201,
            "Leave status is pending": () => body.data.status === 'pending',
            "Leave id exists": () => body.data.id !== undefined
        })

    })

    group('Employee Edit Pending Leave', () => {
        const params = {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            tags: {
                endpoint: 'leave_patch'
            }
        }
        const startDate = `2026-09-${10 + __VU}`
        const endDate = `2026-09-${11 + __VU}`

        const payload = JSON.stringify({
            leave_type: "casual",
            start_date: startDate,
            end_date: endDate,
            reason: `Updated via k6 | VU:${__VU} ITER: ${__ITER}`
        })

        const response = http.patch(`${URLS.leave}/${leaveID}`, payload, params)
        const body = response.json() as any

        check(response, {
            "Employee Update Leave status is 200": (r) => r.status === 200,
            "Leave reason updated": () => body.data.reason.includes("Updated via k6"),
            "Start dates updated": () => body.data.start_date === startDate,
            "End dates updated": () => body.data.end_date === endDate
        })
    })
    group('Employee Delete Pending Leave', () => {
        const params = {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            tags: {
                endpoint: 'leave_delete'
            }
        }
        const response = http.del(`${URLS.leave}/${leaveID}`, null, params)
        const body = response.json() as any

        check(response, {
            "DELETE api/leave returns 200": (r) => r.status === 200,
            "Deleted Correct leave": () => body.data.id === leaveID
        })
    })

}