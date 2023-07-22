import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from "openai";

const API_KEY = process.env.REACT_APP_API_KEY;
console.log(API_KEY)

const openai = new OpenAIApi(
  new Configuration({
    apiKey: `${API_KEY}`,
  })
);

export const getAnswer = async (
  messages: ChatCompletionResponseMessage[]
  ) => {
  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...messages],
      temperature: 0.75,
      max_tokens: 600,
    });
    const message = res.data.choices[0].message;

    return message ? message : null;
  } catch (error) {
    return null;
  }
};
