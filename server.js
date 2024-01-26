import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

let corsOptions = {
  origin : '*',
}

app.use(cors(corsOptions))

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from LuciX New",
  });
});

app.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    // Ensure that messages is an array of message objects
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // create a new chat completion request with formatted messages
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are a Design GPT helpful assistant for giving answers as a professor",
        },
        ...formattedMessages,
      ],
    });

    // extract the bot response from the response data and send it back to the client
    const botResponse = response.data.choices[0].message;
    res.status(200).send({
      bot: botResponse,
    });
    console.log(botResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


app.listen(8000, () =>
  console.log("Server is running on port http://localhost:8000")
);
