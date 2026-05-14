import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let threadId = null;

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    // CREATE THREAD ONCE

    if (!threadId) {

      const thread =
        await client.beta.threads.create();

      threadId = thread.id;
    }

    // IMAGE GENERATION

   const imageKeywords = [
  "image",
  "photo",
  "picture",
  "draw",
  "generate",
  "create",
  "illustration"
];

const isImageRequest =
  imageKeywords.some(word =>
    message.toLowerCase().includes(word)
  );

if (isImageRequest) {

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

    // USER MESSAGE

    await client.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: message
      }
    );

    // RUN ASSISTANT

    const run =
      await client.beta.threads.runs.createAndPoll(
        threadId,
        {
          assistant_id:
            process.env.ASSISTANT_ID
        }
      );

    // GET ALL MESSAGES

    const messages =
      await client.beta.threads.messages.list(
        threadId
      );

    // LATEST MESSAGE

    const latestMessage =
      messages.data[0];

    let reply = "";

    // HANDLE CONTENT BLOCKS

    let imageFileId = null;

for (const item of latestMessage.content) {

  if (item.type === "text") {

    reply += item.text.value;
  }

  if (item.type === "image_file") {

    imageFileId =
      item.image_file.file_id;
  }
}

if (imageFileId) {

  const imageFile =
    await client.files.content(
      imageFileId
    );

  const chunks = [];

  for await (const chunk of imageFile.body) {
    chunks.push(chunk);
  }

  const buffer =
    Buffer.concat(chunks);

  return res.json({
    reply,
    image:
      buffer.toString("base64")
  });
}

    reply =
      reply.replace(/【.*?】/g, "");

    return res.json({
      reply
    });

  }

  catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Something went wrong"
    });
  }

});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("Server running");
});