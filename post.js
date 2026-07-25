import http from 'k6/http'
import { check } from 'k6'

export const options = {
    vus : 5,
    duration : '5s'
}

const params = {
    headers: {
        'Authorization' : `Bearer ${__ENV.GOREST_API_TOKEN}`,
        'Content-Type': 'application/json'

    }
}

const url = "https://gorest.co.in/public/v2/users"
const payloadTemplate = JSON.parse(open('./payload.json'))

export default function () {
    const payload = { ...payloadTemplate, email: `test${Date.now()}-${__VU}-${__ITER}@nhm.com` }
    const response = http.post(url, JSON.stringify(payload), params)
    // console.log('Payload: ', payload)
    // console.log('Response Body: ',response.body)
    check(response, {
        'status code validation':(response)=>response.status===201,
        'Response ID validation':(response)=>response.body.includes('id')
    })
}