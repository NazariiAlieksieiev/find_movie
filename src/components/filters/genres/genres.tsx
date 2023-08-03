import {
  ChangeEvent, useCallback, useEffect, useMemo, useState,
} from 'react';
import { MovieGenre } from '../../../types/movieGenre';
import { Genre } from './genre/genre';
import { movieGenres } from '../../../resources/movieGenres';
import { FiltersTypes } from '../../../types/filters';

interface Props {
  setFilters: (filters: FiltersTypes | {}) => void
}

export const Genres: React.FC<Props> = ({ setFilters }) => {
  const [genres, setGenres] = useState<MovieGenre[]>(movieGenres);

  const selectedGenres = useMemo(() => {
    const selected = genres.filter(genre => genre.checked === true);

    return selected.map(genre => genre.genreName);
  }, [genres]);

  const addGenre = useCallback((
    id: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;

    setGenres(prevGenres => prevGenres.map(genre => {
      if (genre.id === id) {
        return {
          ...genre,
          checked,
        };
      }

      return genre;
    }));
  }, []);

  useEffect(() => {
    setFilters((prev: FiltersTypes) => {
      const newFilters = {
        ...prev,
      };

      if (selectedGenres.length > 0) {
        newFilters.genre = [...selectedGenres];
      } else if ('genre' in newFilters && !selectedGenres.length) {
        delete newFilters.genre;
      }

      return newFilters;
    });
  }, [selectedGenres]);

  return (
    <div className="genre">
      {genres.map(
        genre => (
          <Genre
            genre={genre}
            addGenre={addGenre}
            key={genre.id}
          />
        ),
      )}
    </div>
  );
};
