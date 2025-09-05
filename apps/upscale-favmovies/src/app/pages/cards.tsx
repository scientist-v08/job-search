import { useDisclosure } from '@mantine/hooks';
import { MovieInterface } from '../interfaces/movies.interface';
import { Modal } from '@mantine/core';
import { useState } from 'react';
import { ConfirmationBox } from '../util/confirmationBox';
import { EditBox } from '../util/editBox';

interface CardProps {
  movie: MovieInterface;
  index: number;
  isAdmin: boolean;
}

export function Cards({ movie, index, isAdmin }: CardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmationBoxState, setConfirmationBoxState] = useState<number>(0);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={confirmationBoxState !== 3 ? 'Confirm' : 'Edit'}
        centered
      >
        {confirmationBoxState !== 3 ? (
          <ConfirmationBox
            currentState={confirmationBoxState}
            obtainedMovie={movie}
            askParentToCloseModal={close}
          />
        ) : (
          <EditBox
            askParentToCloseModal={close}
            currentState={confirmationBoxState}
            movie={movie}
          />
        )}
      </Modal>
      <article
        className={`font-inter w-full max-w-[450px] border-2 border-black rounded-xl p-4 flex flex-col items-center bg-white dark:bg-gray-800 shadow ${
          index % 2 === 0 ? '' : 'md:justify-self-end'
        }`}
      >
        <figure className="flex flex-col items-center">
          <img
            src={`data:${movie.MimeType};base64,${movie.Image}`}
            alt={movie.Title}
            width="600"
            height="900"
            className="w-60 h-90 object-cover border-[5px] border-double border-gray-700 rounded-full"
          />
          <figcaption className="font-bold text-2xl my-4 text-center">
            {movie.Title}
          </figcaption>
        </figure>
        <div className="text-center space-y-1">
          <p className="italic">Type: {movie.Type}</p>
          <p className="italic">Director: {movie.Director}</p>
          <p className="italic">Budget: {movie.Budget}</p>
          <p className="italic">Location: {movie.Location}</p>
          <p className="italic">Duration: {movie.Duration}</p>
          <p className="italic">Year: {movie.YearOfRelease}</p>
        </div>
        {isAdmin ? (
          <div className="w-full flex justify-between mt-4 gap-4">
            <button
              onClick={() => {
                open();
                setConfirmationBoxState(1);
              }}
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Approve
            </button>
            <button
              onClick={() => {
                open();
                setConfirmationBoxState(2);
              }}
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-between mt-4 gap-4">
            <button
              onClick={() => {
                open();
                setConfirmationBoxState(3);
              }}
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Edit
            </button>
            <button
              onClick={() => {
                open();
                setConfirmationBoxState(4);
              }}
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Delete
            </button>
          </div>
        )}
      </article>
    </>
  );
}
