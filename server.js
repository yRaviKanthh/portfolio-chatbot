import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("temp"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    // IMAGE REQUEST
    if (
      message.toLowerCase().includes("image") ||
      message.toLowerCase().includes("generate")
    ) {

      const image = await client.images.generate({
        model: "gpt-image-1",
        prompt: message,
        size: "1024x1024"
      });

      return res.json({
        image: image.data[0].b64_json
      });

    }

    // NORMAL CHAT
    const response =
      await client.responses.create({

        model: "gpt-4o-mini",

        input: message

      });

    res.json({
      reply: response.output_text
    });

  }

  catch(error){

    console.log(error);

    res.json({
      error: "Something went wrong"
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});