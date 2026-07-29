import http from 'k6/http'
import { check, sleep } from 'k6'
import { URLS } from '../config.js'

const payload = JSON.stringify({
    "email" : __ENV.EMPLOYEE_EMAIL,
    "password": __ENV.EMPLOYEE_PASSWORD
})

const params = {
    headers:{
        'apikey': __ENV.PEOPLIX_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    
    }
}

export function login(){
    const response = http.post(URLS.login, payload, params)
    const body = response.json()
    

    check(response, {
        'status code is 200':(response)=>response.status === 200
    })

    return {
        accessToken: body.access_token,
        loginResponse: response,
        refreshToken: body.refresh_token,
        user: body.user
    }
}