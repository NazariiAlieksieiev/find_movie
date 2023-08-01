import React, {
  ChangeEvent,
  useCallback,
  useState,
  FormEvent,
  KeyboardEvent,
  useEffect,
} from 'react';
import { ChatCompletionResponseMessage } from 'openai';
import axios from 'axios';
import { Messages } from '../message/message';
import { Form } from '../form/form';
import { Notification } from '../notification/notification';
import { Roles } from '../../types/messages';
import { Errors } from '../../types/errors';

export const ChatWindow: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([
    {
      role: Roles.User,
      content: 'Привіт',
    },
    {
      role: Roles.Assistant,
      content: 'Привіт',
    },
  ]);
  const [promptMessage, setPromptMessage] = useState<
  ChatCompletionResponseMessage[]
  >([
    {
      role: Roles.User,
      content: '',
    },
  ]);
  const [error, setError] = useState<Errors | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTextareaValue = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      event.preventDefault();

      const { value } = event.target;

      setPrompt(value);
      setPromptMessage([
        {
          role: Roles.User,
          content: value.trim(),
        },
      ]);
    },
    [prompt, promptMessage, messages],
  );

  const handleSubmit = useCallback(
    (
      event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>,
    ) => {
      event.preventDefault();
      if (isLoading) {
        return;
      }

      if (!promptMessage[0].content) {
        setError(Errors.Empty);

        return;
      }

      setPrompt('');
      setMessages((prev) => [...prev, ...promptMessage]);

      const requestMessages = [...messages, ...promptMessage];

      const fetchAnswer = async () => {
        try {
          setIsLoading(true);
          const response = await axios.post(
            'http://localhost:5000/find_movie',
            { sendedMessages: requestMessages },
          );

          const { data } = response;

          setMessages((current) => [...current, data]);
          setPromptMessage([
            {
              role: Roles.User,
              content: '',
            },
          ]);
        } catch (innerError) {
          setMessages((current) => [...current.slice(0, -1)]);
          setError(Errors.Download);

          if (promptMessage[0].content) {
            setPrompt(promptMessage[0].content);
            setIsLoading(false);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnswer();
    },
    [messages, promptMessage, prompt],
  );

  const addPrompt = useCallback(
    async (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === 'Enter'
        && promptMessage[0].content
        && !event.shiftKey
      ) {
        handleSubmit(event);
      }
    },
    [messages, promptMessage, prompt],
  );

  useEffect(() => {
    let timeout: number;

    if (error) {
      timeout = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  return (
    <div className="chatWindow">
      <div className="chatWindow__messages">
        {messages
          && messages.map(
            (message, i) => <Messages key={i} message={message} />,
          )}
      </div>

      <Form
        onChange={handleTextareaValue}
        addPrompt={addPrompt}
        onSubmit={handleSubmit}
        prompt={prompt}
      />

      <Notification error={error} onClose={setError} />
    </div>
  );
};
