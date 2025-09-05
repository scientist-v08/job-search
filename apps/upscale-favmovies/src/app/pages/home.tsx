import { useCallback, useEffect, useMemo, useState } from 'react';
import { Cards } from './cards';
import {
  MovieInterface,
  MoviesInterface,
} from '../interfaces/movies.interface';
import { useAuthStore } from '../store/authStore';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Modal, Pagination } from '@mantine/core';
import { DrawerForm } from './drawer';
import { MovieFiltersInterface } from '../interfaces/movie-filter.interface';
import { useCrudStore } from '../store/crudStore';
import { AddMovie } from '../util/addMovie';

export function Home() {
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentpage, setCurrentpage] = useState<number>(1);

  // Memoize access token to avoid infinite reads
  const accessToken = useAuthStore((state) => state.access_token);
  const memoizedToken = useMemo(() => accessToken, [accessToken]);
  const refetchMovies = useCrudStore((state) => state.isEditedOrDeletedOrAdded);
  const initialValues: MovieFiltersInterface = {
    pageSize: '5',
    sortOrder: 'desc',
    sortBy: 'id',
    searchByTitle: '',
    searchByDirector: '',
  };

  const [filters, setFilters] = useState<MovieFiltersInterface>(initialValues);
  const refreshValues = () => {
    setFilters(initialValues);
  };

  const fetchMovies = useCallback(async () => {
    try {
      const { pageSize, sortOrder, sortBy, searchByTitle, searchByDirector } =
        filters;
      const queryParams = new URLSearchParams({
        pageNumber: currentpage.toString(),
        pageSize,
        sortBy,
        order: sortOrder,
        ...(searchByTitle && { title: searchByTitle }),
        ...(searchByDirector && { director: searchByDirector }),
      }).toString();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get/allMovies?${queryParams}`,
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
      setTotalElements(Math.ceil(data.totalElements / data.pageSize));
      setMovies(data.movies);
    } catch (err) {
      console.error(err);
    }
  }, [filters, memoizedToken, currentpage, refetchMovies]);

  useEffect(() => {
    if (memoizedToken) fetchMovies();
  }, [memoizedToken, filters, currentpage, refetchMovies, fetchMovies]);

  const handleSearchFilters = (values: MovieFiltersInterface) => {
    setFilters(values);
    setCurrentpage(1);
  };
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened1} onClose={close1} title="Add" centered>
        <AddMovie signalParentComponentToClose={close1} />
      </Modal>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        title="Search & Filters"
        position="right"
      >
        <DrawerForm
          onSubmit={(values) => {
            handleSearchFilters(values);
            close();
          }}
        />
      </Drawer>
      <div className="flex gap-4 w-full md:justify-end md:items-center md:flex-row flex-col justify-center items-center">
        <button
          className="font-inter w-[60%] md:w-[18%] text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
              focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-small py-2 rounded-md text-lg transition-colors"
          onClick={refreshValues}
        >
          Refresh
        </button>
        <button
          className="font-inter w-[60%] md:w-[18%] text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
              focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-small py-2 rounded-md text-lg transition-colors"
          onClick={open}
        >
          Search & Filters
        </button>
        <button
          onClick={open1}
          className="font-inter w-[60%] md:w-[18%] text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
            focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-small py-2 rounded-md text-lg transition-colors"
        >
          Add new Movie +
        </button>
      </div>

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[100%] mt-8">
            {movies.map((movie, index) => (
              <Cards
                key={movie.ID}
                movie={movie}
                index={index}
                isAdmin={false}
              />
            ))}
          </div>

          <div className="flex justify-center items-center mt-4">
            <Pagination
              total={totalElements}
              value={currentpage}
              onChange={setCurrentpage}
              mt="md"
            />
          </div>
        </>
      ) : (
        <div>No Data</div>
      )}
    </>
  );
}
