import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VECTOR_STORE_ID =
  process.env.VECTOR_STORE_ID;

const WEBSITE_URLS = [
  "https://bondvue.com/",
  "https://portfolio-eo7x.onrender.com/"
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

    await client.vectorStores.files.create(
      VECTOR_STORE_ID,
      {
        file_id: file.id
      }
    );

    console.log(
      "Website training completed."
    );

  }

  catch(error){

    console.log(
      "Website training error:"
    );

    console.log(error);

  }

};

app.post("/chat", async (req, res) => {

  try {

    const message =
      req.body.message;

    // IMAGE GENERATION

    if (
      message.toLowerCase().includes("image") ||
      message.toLowerCase().includes("generate")
    ) {

      const image =
        await client.images.generate({

          model: "gpt-image-1",

          prompt: message,

          size: "1024x1024"

        });

      return res.json({
        image: image.data[0].b64_json
      });

    }

    // ASSISTANT CHAT

    const thread =
      await client.beta.threads.create();

    await client.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: message
      }
    );

    await client.beta.threads.runs.createAndPoll(
      thread.id,
      {
        assistant_id:
          process.env.ASSISTANT_ID
      }
    );

    const messages =
      await client.beta.threads.messages.list(
        thread.id
      );

    let reply =
      messages.data[0]
      .content[0]
      .text.value;

    reply =
      reply.replace(/【.*?】/g, "");

    res.json({
      reply
    });

  }

  catch(error){

    console.log(error);

    res.json({
      error: "Something went wrong"
    });

  }

});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, async () => {

  console.log("Server running");

  await trainWebsites();

});