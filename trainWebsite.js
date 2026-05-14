import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import puppeteer from "puppeteer";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VECTOR_STORE_ID =
  process.env.VECTOR_STORE_ID;

const WEBSITE_URLS = [
  "https://bondvue.com/",
  "https://portfolio-eo7x.onrender.com/",
  "https://www.rbi.org.in/scripts/bs_viewcontent.aspx?Id=1956"
];

const scrapeWebsite = async (url) => {

  const browser =
    await puppeteer.launch({
      headless: true
    });

  const page =
    await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0
  });

  // TEXT

  const text =
    await page.evaluate(() => {
      return document.body.innerText;
    });

  // IMAGE URLS

  const images =
    await page.evaluate(() => {

      return Array.from(
        document.images
      ).map(img => img.src);

    });

  // PDF LINKS

  const pdfs =
    await page.evaluate(() => {

      return Array.from(
        document.querySelectorAll("a")
      )
      .map(a => a.href)
      .filter(link =>
        link.endsWith(".pdf")
      );

    });

  // TABLE DATA

  const tables =
    await page.evaluate(() => {

      return Array.from(
        document.querySelectorAll("table")
      )
      .map(table => table.innerText);

    });

  await browser.close();

  return `
    
WEBSITE:
${url}

================ TEXT ================

${text}

================ IMAGES ================

${images.join("\n")}

================ PDF LINKS ================

${pdfs.join("\n")}

================ TABLE DATA ================

${tables.join("\n\n")}

========================================

`;

};

const trainWebsites = async () => {

  try {

    console.log(
      "Training websites..."
    );

    let allText = "";

    for (const url of WEBSITE_URLS) {

      console.log(
        `Scraping: ${url}`
      );

      const websiteData =
        await scrapeWebsite(url);

      allText +=
        websiteData;

    }

    console.log(
      "Creating file..."
    );

    fs.writeFileSync(
      "./website-data.txt",
      allText
    );

    console.log(
      "Uploading website data..."
    );

    const file =
      await client.files.create({
        file: fs.createReadStream(
          "website-data.txt"
        ),
        purpose: "assistants"
      });

    console.log(
      "Adding website to vector store..."
    );

    await client.beta.vectorStores.files.create(
      VECTOR_STORE_ID,
      {
        file_id: file.id
      }
    );

    console.log(
      "Website training completed."
    );

    fs.unlinkSync(
      "website-data.txt"
    );

  }

  catch(error){

    console.log(
      "Website training error:"
    );

    console.log(error);

  }

};

trainWebsites();