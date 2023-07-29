import React from 'react';
import classnames from 'classnames';
import { Errors } from '../../types/errors';

interface Props {
  error: Errors | null;
  onClose: (value: Errors | null) => void;
}

export const Notification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div className={classnames('notification', { hidden: !error })}>
      {error}
      <button
        type="button"
        className={classnames('notification__close', { hidden: !error })}
        aria-label="button-delete"
        onClick={() => onClose(null)}
      />
    </div>
  );
};
