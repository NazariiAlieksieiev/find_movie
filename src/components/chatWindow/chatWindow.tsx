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
  setResetFilters: (boolean: boolean) => void
}

export const ChatWindow: React.FC<Props> = ({ filters, setResetFilters }) => {
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
  const messagesContainer = useRef<HTMLDivElement | null>(null);

  const isEmptyFilters = useMemo(() => {
    if (filters === '{}') {
      return false;
    }

    return true;
  }, [filters]);

  const requestMessage = useMemo(() => {
    const initialMessage = promptMessage[0].content;

    if (initialMessage && !isEmptyFilters) {
      return promptMessage;
    }

    if (!initialMessage && isEmptyFilters) {
      return [{
        role: Roles.User,
        content: `Топ 5 фільмів ${filters}`,
      }];
    }

    if (initialMessage && isEmptyFilters) {
      return [{
        ...promptMessage[0],
        content: `${initialMessage}, ${filters}`,
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
            'https://calm-ruby-pronghorn-wrap.cyclic.app/find_movie',
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
          setResetFilters(false);
        } catch (innerError) {
          setMessages((current) => [...current.slice(0, -1)]);
          setError(Errors.Download);
          setIsLoading(false);

          if (promptMessage[0].content) {
            setPrompt(promptMessage[0].content);
          }
        } finally {
          setIsLoading(false);
          setResetFilters(true);
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
