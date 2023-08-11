import { FiltersTypes } from '../../types/filters';
import { Genres } from './genres/genres';

interface Props {
  setFilters: (filters: FiltersTypes | {}) => void
  setResetFilters: (boolean: boolean) => void
  resetFilters: boolean,
}

export const Filters: React.FC<Props> = ({
  setFilters,
  resetFilters,
}) => {
  return (
    <div className="filters">
      <Genres
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
};
