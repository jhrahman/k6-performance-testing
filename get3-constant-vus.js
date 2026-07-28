import { check, sleep } from 'k6'
import http from 'k6/http'


export const options = {
    scenarios: {
        default: {
            executor: 'constant-vus',
            vus: 5,
            duration: '20s'
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
        http_req_failed: ['rate<0.05']
    }
}
const params = {
    timeout: '10s'
}
export default function (){
    const response = http.get('https://peoplix-hr.vercel.app/', params)
    sleep(2)
    console.log(response.request.url);

    check(response,{
        'status validation':(response)=>response.status === 200
    })
}