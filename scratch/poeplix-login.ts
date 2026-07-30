import http from 'k6/http'
import { check, sleep } from 'k6'
import { URLS } from '../config.ts'

export const options = {
    vus: 1,
    duration: '2s',
    thresholds:{
        http_req_duration: ['p(95)<500','p(99)<1000'],
        http_req_failed: ['rate<0.05']
    }
}

const payload = JSON.stringify({
    "email": __ENV.EMPLOYEE_EMAIL,
    "password": __ENV.EMPLOYEE_PASSWORD
})

const params ={
    headers: {
        'apikey': __ENV.PEOPLIX_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}


interface LoginResponseBody {
    access_token: string
}

export default function(){
    const response = http.post(URLS.login, payload, params)
    const body = response.json() as unknown as LoginResponseBody
    const accessToken = body.access_token
    

    check(response, {
        'Status is 200':(response)=>response.status === 200,
        'has access token':(response)=>body.access_token !== undefined
    })

    if( response.status !== 200)
        console.log(`Error Code: ${response.status}`)
}