import React from 'react';
import { ChatCompletionResponseMessage } from 'openai';

interface Props {
  message: ChatCompletionResponseMessage
}

export const Messages: React.FC<Props> = ({ message }) => {
  const { role, content} = message;
  const messageClass = role === 'user' ? 'user-message' : 'assistant-message';

  return <div className={`message ${messageClass}`}>{content}</div>;
};
