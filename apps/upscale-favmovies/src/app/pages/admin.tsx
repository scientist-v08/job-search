import { Cards } from './cards';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MovieInterface,
  MoviesInterface,
} from '../interfaces/movies.interface';
import { useAuthStore } from '../store/authStore';
import { useCrudStore } from '../store/crudStore';

export function Admin() {
  const [movies, setMovies] = useState<MovieInterface[]>([]);

  // Memoize access token to avoid infinite reads
  const accessToken = useAuthStore((state) => state.access_token);
  const memoizedToken = useMemo(() => accessToken, [accessToken]);
  const refetchMovies = useCrudStore((state) => state.isApprovedOrRejected);
  const memoizedMovies = useMemo(() => refetchMovies, [refetchMovies]);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get/moviesToBeApproved`,
        {
          headers: {
            Authorization: `Bearer ${memoizedToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = (await response.json()) as MoviesInterface;
      setMovies(data.movies);
    } catch (err) {
      console.error(err);
    }
  }, [memoizedToken, memoizedMovies]);

  useEffect(() => {
    if (memoizedToken) fetchMovies();
  }, [memoizedToken, fetchMovies, memoizedMovies]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[100%] mt-8">
      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <Cards key={movie.ID} movie={movie} index={index} isAdmin={true} />
        ))
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}
