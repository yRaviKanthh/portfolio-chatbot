import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

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

  const response =
    await axios.get(url);

  const $ =
    cheerio.load(response.data);

  $("script").remove();
  $("style").remove();

  const text =
    $("body").text();

  return text
    .replace(/\s+/g, " ")
    .trim();

};

const trainWebsites = async () => {

  try {

    console.log("Training websites...");

    let allText = "";

    for (const url of WEBSITE_URLS) {

      console.log(`Scraping: ${url}`);

      const text =
        await scrapeWebsite(url);

      allText += `\n\n${text}`;

    }

    fs.writeFileSync(
      "website-data.txt",
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

    // DELETE LOCAL FILE

    fs.unlinkSync("website-data.txt");

  }

  catch(error){

    console.log(
      "Website training error:"
    );

    console.log(error);

  }

};

trainWebsites();