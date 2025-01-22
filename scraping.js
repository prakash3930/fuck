const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const wait = ms => new Promise(value => setTimeout(value, ms));

exports.scraingPuppeteer = async(req,res)=>{

    const url = req?.query?.url || "https://api.ipify.org/";

    puppeteer.use(StealthPlugin())

    try {
       const browser = await puppeteer.launch({
            defaultViewport:null,
            headless:true,
            args: ['--no-sandbox','--disable-setuid-sandbox'],
            timeout: 2200000, // Increase timeout
            // executablePath:process.env.NODE_ENV === "production"?process.env.PUPPETEER_EXECUTABLE_PATH:puppeteer.executablePath()
        });
    
        const page = await browser.newPage();
    
        await page.goto(url,{waitUntil:"networkidle2",timeout:4500000})
    
        await wait(8000);
    
    
        if(url === "https://whatismyipaddress.com" || url === "https://whatismyipaddress.com/"){
            const ipAddress = await page.evaluate(() => {
                const element = document.querySelector("#fl-post-111 > div > div > div.fl-row.fl-row-fixed-width.fl-row-bg-none.fl-node-5db9cbe851c41 > div > div.fl-row-content.fl-row-fixed-width.fl-node-content > div > div > div > div > div > div.ip-detail.minified > div.left > div.ip-address-list");
                return element ? element.innerText : null;
            });
        
            const ipAddressInformation = await page.evaluate(() => {
                const element = document.querySelector("#fl-post-111 > div > div > div.fl-row.fl-row-fixed-width.fl-row-bg-none.fl-node-5db9cbe851c41 > div > div.fl-row-content.fl-row-fixed-width.fl-node-content > div > div > div > div > div > div.ip-detail.minified > div.left > div.ip-information")
                return element ? element.innerText : null;
            });
        
            const ipObject = {
                Ipaddress: ipAddress?.split("\n").map(line => line.trim()).join(" ") || "Not Found",
                IpInformation: ipAddressInformation?.split("\n").map(line => line.trim()).join(", ") || "Not Found",
            };
            res.send(ipObject)
        }else{
            const bodyData = await page.evaluate(() => {
                return document.body.innerHTML; // Body-এর HTML return করবে
            });
        
            res.send(bodyData)
        }
    } catch (err) {
        console.log(err.message)
    }
}
