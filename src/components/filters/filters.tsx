import { FiltersTypes } from '../../types/filters';
import { Genres } from './genres/genres';

interface Props {
  setFilters: (filters: FiltersTypes | {}) => void
}

export const Filters: React.FC<Props> = ({ setFilters }) => {
  return (
    <div className="filters">
      <Genres setFilters={setFilters} />
    </div>
  );
};
