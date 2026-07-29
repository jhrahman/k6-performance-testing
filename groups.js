import http from 'k6/http'
import { check, group, sleep } from 'k6'

export const options = {
    scenarios: {
        default: {
            executor: "constant-vus",
            vus: 3,
            duration: '5s'
        }
    },

    thresholds:{
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
        http_req_failed: ['rate<0.05']
    }
}

export default function (){
    group('Open Login Page', function(){
        const response = http.get('https://peoplix-hr.vercel.app/login')
        sleep(2)

        check(response, {
            'Status Code Validation':(response)=>response.status === 200
        })
    })
}