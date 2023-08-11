/* eslint-disable no-console */
import React, {
  ChangeEvent,
  useCallback,
  useState,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { ChatCompletionResponseMessage } from 'openai';
import axios from 'axios';
import { Messages } from '../message/message';
import { Form } from '../form/form';
import { Notification } from '../notification/notification';
import { Roles } from '../../types/messages';
import { Errors } from '../../types/errors';

interface Props {
  filters: string,
}

export const ChatWindow: React.FC<Props> = ({ filters }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([]);
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
  const messagesContainer = useRef<HTMLDivElement | null>(null);

  const isEmptyFilters = useMemo(() => {
    if (filters === '{}') {
      return false;
    }

    return true;
  }, [filters]);

  const requestMessage = useMemo(() => {
    if (promptMessage[0].content && !isEmptyFilters) {
      return promptMessage;
    }

    if (!promptMessage[0].content && isEmptyFilters) {
      return [{
        role: Roles.User,
        content: `Топ 5 фільмів ${filters}`,
      }];
    }

    if (promptMessage[0].content && isEmptyFilters) {
      return [{
        ...promptMessage[0],
        content: `${promptMessage[0].content}, ${filters}`,
      }];
    }

    return '';
  }, [promptMessage, filters]);

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
      setPrompt('');

      if (isLoading) {
        return;
      }

      if (!requestMessage) {
        setError(Errors.Empty);

        return;
      }

      if (promptMessage[0].content) {
        setMessages((prev) => [...prev, ...promptMessage]);
      }

      const requestMessages = [...messages, ...requestMessage];

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
          setIsLoading(false);

          if (promptMessage[0].content) {
            setPrompt(promptMessage[0].content);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnswer();
    },
    [messages, promptMessage, requestMessage],
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

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current
        .scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatWindow">
      <div className="chatWindow__messages" ref={messagesContainer}>
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
