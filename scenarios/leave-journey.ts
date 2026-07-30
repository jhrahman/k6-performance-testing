import http from 'k6/http'
import { check, sleep } from 'k6'
import { URLS } from '../config.ts'
import { login } from '../helpers/auth.ts'
import { group } from 'k6'

export const options ={
    scenarios:{
        employee_leave_journey:{
            executor: 'constant-vus',
            vus: 3,
            duration: '1m'
        }
    },
    thresholds:{
        'http_req_duration{endpoint:login}': ['p(95)<2000'],
        'http_req_duration{endpoint:leave}': ['p(95)<2000'],

        'http_req_failed{endpoint:login}': ['rate<0.03'],
        'http_req_failed{endpoint:leave}': ['rate<0.03']
    }
}

export default function(){
    let auth:any
    group('Employee Login', ()=>{
        auth = login()
        
    })


    group('Employee View Leave', ()=>{
        
        const params={
            headers:{
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            tags:{
                endpoint: 'leave'
            }
        }

        const response = http.get(URLS.leave, params)
        sleep(1)

        check(response, {
            "GET /api/leave returns 200":(r)=>r.status === 200,
            "GET /api/leave has data":(r)=> r.status !== undefined
        })
    })
}