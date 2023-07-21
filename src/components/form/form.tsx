import React, { ChangeEvent, FormEvent, KeyboardEvent } from "react"

interface Props {
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  addPrompt: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  prompt: string
}

export const Form: React.FC<Props> = ({ prompt, onChange, onSubmit, addPrompt }) => {

  return (
    <form 
      className="form"
      onSubmit={onSubmit}
    >
      <textarea
        className="form__textarea"
        value={prompt}
        onChange={onChange}
        onKeyUp={addPrompt}
      />
      <button
        type="submit"
        className="from__button"
      >
        Enter
      </button>
    </form>
  )
}
