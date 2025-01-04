require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');

const example = `

LINKEDIN_EMAIL=example@example.com
LINKEDIN_PASSWORD=your_password
LINKEDIN_SAVEDSEARCH_ID=take_this_from_your_url_in_sales_navigator

`;

if (!process.env.LINKEDIN_EMAIL ||
    !process.env.LINKEDIN_PASSWORD ||
    !process.env.LINKEDIN_SAVEDSEARCH_ID) {
    
    console.log(`Please ensure the following values are provided in your .env: ${example}`);
    
    if (!fs.existsSync('.env')) {
        fs.writeFileSync('.env', example);
    }
    
    process.exit(1);
}

const getUrl = (scrapeCount) => {
    if (scrapeCount > 0) {
        return `https://www.linkedin.com/sales/search/people?page=${scrapeCount}&savedSearchId=${process.env.LINKEDIN_SAVEDSEARCH_ID}`;
    }
    return `https://www.linkedin.com/sales/search/people?savedSearchId=${process.env.LINKEDIN_SAVEDSEARCH_ID}`;
}

const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const fileStamp = getTimestamp();

async function run() {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go to LinkedIn login page
    await page.goto('https://www.linkedin.com/login');

    // Fill in login credentials from env
    await page.fill('#username', process.env.LINKEDIN_EMAIL);
    await page.fill('#password', process.env.LINKEDIN_PASSWORD);
    await page.click('button[type="submit"]');

        
    // Wait for user to login manually
    await page.waitForURL('https://www.linkedin.com/feed/', { timeout: 300000 });
    console.log('Successfully logged in!');

    let leads = [];
    let leadsResult = [];
    let scrapeCount = 1;

    do {

        // Navigate to your specific URL
        await page.goto(getUrl(scrapeCount));
        
        // Also wait for the list to be loaded....
        await page.waitForSelector('.artdeco-list');
        await page.waitForTimeout(2000);

        // Extract leads' information
        leadsResult = await page.evaluate(async () => {
            const data = [];
        
            const leadItems = document.querySelectorAll('.artdeco-list__item');
            
            for (const item of leadItems) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 500));

                const name = item.querySelector('span[data-anonymize="person-name"]')?.textContent.trim();
                const linkedinProfileURL = item.querySelector('a[href]')?.href;
                const role = item.querySelector('span[data-anonymize="title"]')?.textContent.trim();
                const company = item.querySelector('a[data-anonymize="company-name"]')?.textContent.trim();
                //const innterText = item.innerText;

                data.push({
                    name,
                    linkedinProfileURL,
                    role,
                    company
                });
            }

            return data;
        });

        if (leadsResult.length > 0) {
            leads = [...leads, ...leadsResult];
        } else {
            console.log(`Exiting as no leads on page ${scrapeCount}`);
        }

        scrapeCount++;
    } while (leadsResult.length > 0)
    
    const csv = 'name,linkedinurl,role,company\n' + leads.map(lead =>
        `"${lead.name}","${lead.linkedinProfileURL}","${lead.role}","${lead.company}"`).join('\n');
    
    fs.writeFileSync(`results_${fileStamp}.csv`, csv);

}

run().catch(console.error); 