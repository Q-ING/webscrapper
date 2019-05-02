const puppeteer = require('puppeteer');
const fs = require('fs-extra');
(async function main() {
	try{

		const browser = await puppeteer.launch({headless:true});
		const page = await browser.newPage();
		page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');

		
		await fs.writeFile('out.csv', 'section,name\n');
		

		for (let i = 0; i <5; i++){
			await page.goto('https://experts.shopify.com/');
			await page.waitForSelector('.section');
			const sections = await page.$$('.section');

			const section = sections[i];
			const button = await section.$('a.marketing-button');
			const buttonName = await page.evaluate(button => button.innerText,button);
			console.log('\n\n');
			console.log(buttonName);
			button.click();

			await page.waitForSelector('#ExpertsResults');
			const lis = await page.$$('#ExpertsResults > li');

			// loop over each li on the inner page

			for(const li of lis) {
				const name = await li.$eval('h2',h2 => h2.innerText);
				console.log('name', name);
				await fs.appendFile('out.csv'," "+buttonName+","+name+"\n");

			}

		}
		console.log('done');
		await browser.close();

	} catch(e){
		console.log('our error', e);

	}
})();

