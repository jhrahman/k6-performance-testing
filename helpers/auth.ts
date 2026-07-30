import http from 'k6/http'
import { check, sleep } from 'k6'
import { URLS } from '../config.ts'

const payload = JSON.stringify({
    "email" : __ENV.EMPLOYEE_EMAIL,
    "password": __ENV.EMPLOYEE_PASSWORD
})

const params = {
    headers:{
        // 'apikey': __ENV.PEOPLIX_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    tags:{
        endpoint: 'login'
    }
}

export function login(){
    const response = http.post(URLS.login, payload, params)
    sleep(1)
    const body = (response.json() as any).data
    
    
    check(response, {
        'Login Status 200':(response)=>response.status === 200
    })

    if (response.status !== 200 )
        console.log(`Login Error: ${response.status}`)

    return {
        accessToken: body.access_token,
        loginResponse: response,
        refreshToken: body.refresh_token,
        user: body.user
    }
}