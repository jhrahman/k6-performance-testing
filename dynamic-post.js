import http from 'k6/http'
import { check } from 'k6'
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
import faker from "k6/x/faker"


export const options ={
    vus: 5,
    duration: '3s'
}

const url = "https://restful-booker.herokuapp.com/booking"
const params = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const payload = {
    // "firstname": randomString(7),
    "firstname": faker.person.email(),
    "lastname": faker.person.lastName(),
    "totalprice": 222,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
    },
    "additionalneeds": "Breakfast"
}


export default function(){
    const response = http.post(url, JSON.stringify(payload), params)

    console.log("Print Payload: ", payload)
    console.log("Print Response: ", response.json())

    check(response, {
        'status code validation': (response)=>response.status === 200,
        'response booking ID validation': (response)=>response.json('bookingid')
    })
}