import classNames from 'classnames';
import { ChangeEvent } from 'react';
import { MovieGenre } from '../../../../types/movieGenre';

interface Props {
  genre: MovieGenre;
  addGenre: (id: number, event: ChangeEvent<HTMLInputElement>) => void;
}

export const Genre: React.FC<Props> = ({ genre, addGenre }) => {
  const { id, genreName, checked } = genre;

  return (
    <div
      className={classNames('genres__item', { 'is-active-genre': checked })}
    >
      <label className="genres__label">
        <p className="genres__name">
          {genreName}
        </p>
        <input
          className="genres__checkbox"
          type="checkbox"
          name="genres"
          checked={checked}
          onChange={(event) => addGenre(id, event)}
        />
      </label>
    </div>
  );
};
