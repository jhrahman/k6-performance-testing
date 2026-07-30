import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 3,
    duration: "2s",
};

const url = "https://restful-booker.herokuapp.com/booking";
const params = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}
const data = open('./payload2.json')

export default function () {
    const response = http.post(url, data, params);

    console.log("Printing Payload: ", JSON.parse(data))
    console.log("Printing Response: ", response.json())

    check(response, {
        'status code validation': (response) => response.status === 200,
        'Response ID validation': (response) => Boolean(response.json('bookingid'))
    })
}
