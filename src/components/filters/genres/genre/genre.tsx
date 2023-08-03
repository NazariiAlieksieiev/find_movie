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
      className={classNames('genre__item', { 'is-active-genre': checked })}
    >
      <label className="genre__label">
        <p className="genre__name">
          {genreName}
        </p>
        <input
          className="genre__checkbox"
          type="checkbox"
          name="genre"
          checked={checked}
          onChange={(event) => addGenre(id, event)}
        />
      </label>
    </div>
  );
};
