import React from 'react';
import { ChatCompletionResponseMessage } from 'openai';

interface Props {
  message: ChatCompletionResponseMessage;
}

export const Messages: React.FC<Props> = ({ message }) => {
  const { role, content } = message;
  const messageClass = role === 'user' ? 'message__user' : 'message__assistant';

  return (
    <div className={`message ${messageClass}`}>
      <p className="message__text">{content}</p>
    </div>
  );
};
