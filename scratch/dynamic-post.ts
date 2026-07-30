import http from 'k6/http'
import { check } from 'k6'
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
        'response booking ID validation': (response)=>Boolean(response.json('bookingid'))
    })
}