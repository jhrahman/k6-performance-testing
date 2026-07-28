import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    stages:[
        { duration: '20s', target: 5 },
        { duration: '20s', target: 5 },
        { duration: '20s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<100', 'p(99)<1000'], // 95% of requests should below 100ms
        http_req_failed: ['rate<0.01'] // error rate should below 1%
    }
    
}

export default function(){
    const response = http.get('https://jhrahman.github.io/')
    sleep(2) // think time

    check(response, {
        'Portfolio Status Validation':(response)=>response.status ===200
    })

    // print status error for any failed reqs

    if(response.status !== 200)
        console.log(`Unexpected Status: , ${response.status}`) //error 429 = too many requests

}