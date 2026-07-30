import { check } from 'k6'
import http from 'k6/http'

export const options = {
    vus: 10,
    iterations: 20
}
const params ={
    headers: {
        'Authorization': `Bearer ${__ENV.GOREST_API_TOKEN}`
    }
}

export default function(){
    const response = http.get("https://gorest.co.in/public/v2/users", params)

    check(response, {
        'status code validation':(response)=>response.status===200
    })
}