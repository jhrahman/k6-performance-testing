import http from 'k6/http'
import { check } from 'k6'

export const options = {
    stages: [
        {duration: '1m', target:50},
        {duration: '3m', target:50},
        {duration: '30s', target:0}
    ]
}

export default function(){
    const response = http.get("https://quickpizza.grafana.com/")
    check(response, {
        'status code validation':(response)=>response.status===200
    })
}