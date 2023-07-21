import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
} from "openai";

const API_KEY = "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";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: API_KEY,
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
