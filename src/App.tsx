import React, { ChangeEvent, useCallback, useState, FormEvent, KeyboardEvent } from 'react';
import './App.scss';
import { ChatWindow } from './components/chatWindow/chatWindow';
import { Form } from './components/form/form';
import { getAnswer } from './utils/openAiClient';
import { useDebounce } from './hooks/useDebounce';
import { Roles } from './types/messages';
import { ChatCompletionResponseMessage } from 'openai';
import { Messages } from './components/message/message';
import axios from 'axios';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([])
  const [promptMessage, setPromptMessage] = useState<ChatCompletionResponseMessage[]>([{
    role: Roles.User,
    content: ''
  }])

  const inputValue = useDebounce(prompt.trim(), 300)

  const handleTextareaValue = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setPrompt(value)
    setPromptMessage([{
      role: Roles.User,
      content: value.trim()
    }])
  }, [prompt])

  const handleSubmit = useCallback((
    event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setPrompt('')

    const request = messages ? promptMessage : messages;

    const fetchAnswer = async () => {
      try {
        const message = await axios.get('http://localhost:5000/find_movie');
        console.log(message)
       /*  if (message && message.content) {
          setMessages(current => [...current, message])
        } */
      } catch (error) {
        console.error('Error fetching answer:', error);
      } finally {
      }
    };

    fetchAnswer();
  }, [inputValue, messages]);

  const addPrompt = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && inputValue && !event.shiftKey) {
      setPrompt('');
      setMessages(prev => [...prev, { role: Roles.User, content: inputValue }]);
      handleSubmit(event);
    }
  }, [inputValue])

  return (
    <div className="app">
      <h1>Hello World</h1>

      {messages && messages.map((message, i) =>
        <Messages
          key={i}
          message={message}
        />
      )}

      {/* <ChatWindow
        answer={answer}
      /> */}
      <Form
        onChange={handleTextareaValue}
        addPrompt={addPrompt}
        onSubmit={handleSubmit}
        prompt={prompt}
      />
    </div>
  );
}

export default App;
