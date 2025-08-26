import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFindClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setLoading(true);
    getMovie(query).then(data => {
      if ('Error' in data) {
        setError(true)
      } else {
        setError(false)
        const movie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID
        }

        setMovie(movie);
      }
    }).finally(() => setLoading(false));
  };

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (movie !== null) {
      onAdd(movie)
    }
    setQuery('');
    setMovie(null);
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value)
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames("button is-light", {'is-loading': loading})}
              onClick={handleFindClick}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {movie !== null &&
            <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddClick}
            >
              Add to the list
            </button>
          </div>}
        </div>
      </form>

      {movie !== null &&
        <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
         <MovieCard movie={movie} />
      </div>}
    </>
  );
};
