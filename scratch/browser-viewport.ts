import {browser} from 'k6/browser'

export const options = {
    scenarios:{
        browser_test:{
            executor: 'constant-vus',
            vus: 2,
            duration: '5s',
            options:{
                browser:{
                    type: 'chromium'
                }
            }
        }
    }
}

export default async function (){
    const page = await browser.newPage()
    await page.setViewportSize({ //iphone 17 pro max viewport
        width: 440,
        height: 956
    })
    await page.goto('https://jhrahman.github.io/')
    await page.close()
}