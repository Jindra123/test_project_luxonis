import puppeteer from "puppeteer";
import fetch from 'node-fetch';

async function getSetupDatabase() {
    try {
        const response = await fetch('http://backend:3001/setup');

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function getData() {
    try {
        const response = await fetch('http://backend:3001/');

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function postFlats(flats) {
    //console.log(JSON.stringify(flats))
    try {
        const response = await fetch("http://backend:3001/", {
            method: "post",
            body: JSON.stringify(flats),
            headers: { "Content-Type": "application/json" }
        })
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
    }
}

let browser;
const products = [];

/**
 * Launches a new instance of Puppeteer and returns a new page object.
 * @returns {Promise<Page>} A new page object.
 */
const initializePuppeteer = async () => {
    browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'],});
    return await browser.newPage();
};

/**
 * Close the browser instance created by Puppeteer.
 */
const closePuppeteer = async () => await browser.close();

/**
 * Extract products information from the provided page
 * @param {Page} page
 * @returns {Promise<Array<Object>>} Array of product details
 */
const extractProducts = async (page) => {
    return page.evaluate(() => {
        let results = [];
        const items = document.querySelectorAll(".property");
        for (let i = items.length; i--; ) {
            const item = items[i];
            const title = item.querySelector(".name");
            const image = item.querySelector("img");
            if (!title || !image) continue;
            results = [
                ...results,
                {
                    title: title.innerText,
                    image: image.getAttribute("src"),
                },
            ];
        }
        return results;
    });
};

/**
 * Handles the pagination, checks if there's a next page, if yes it recurses over the next page.
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<Array<Object>>} - Array of all products from all pages
 */
const handlePagination = async (page) => {
    products.push(...await extractProducts(page));
    try {
        await page.waitForSelector(
            ".paging-next",
            {
                timeout: 4000,
            }
        );
        await page.click(".paging-next");
        await page.waitForTimeout(4000);
        if (products.length < 500) {
            await handlePagination(page);
        }
    } catch (err) {
        console.log("No more pages to load");
    }
    return products;
};

/**
 * Initialize Puppeteer, navigate to Amazon, search for a query, wait for the results to load,
 * then scrape the results and handle pagination
 */
const scrapeProducts = async () => {
    try {
        const page = await initializePuppeteer();
        await page.goto("https://www.sreality.cz/en/search/for-sale/apartments");

        const flats = await handlePagination(page);
        console.log(flats.length, "products found");
        console.log(flats, "products");
        if(flats.length > 0) {
            await getSetupDatabase();
            await postFlats(flats);
        }
        await closePuppeteer();
    } catch (err) {
        console.error(err);
        await closePuppeteer();
    }
};

scrapeProducts();