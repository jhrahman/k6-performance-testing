import { browser } from 'k6/browser';

export const options ={
    scenarios:{
        browser_test:{
            executor: 'constant-vus',
            vus: 3,
            duration: '10s',
            options: {
                browser:{
                    type: 'chromium'
                }
            }
        }
    }
}

export default async function (){
    const page = await browser.newPage()
    await page.goto('https://www.google.com')
    await page.close()
}