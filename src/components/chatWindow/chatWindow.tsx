import React from "react";

interface Props {
  answer: string
}

export const ChatWindow: React.FC<Props> = ({ answer }) => {
  return (
    <div className="chatWindow">
      <div className="chatWindow__item">
        <p className="chatWindow__text">
          {answer}
        </p>
      </div>
    </div>
  )
}