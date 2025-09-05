import { showNotification } from '@mantine/notifications';
import { MovieInterface } from '../interfaces/movies.interface';
import { useCrudStore } from '../store/crudStore';
import { useAuthStore } from '../store/authStore';
import { useMemo } from 'react';

interface ConfirmationDialogProps {
  currentState: number;
  obtainedMovie: MovieInterface;
  askParentToCloseModal: () => void;
}

export function ConfirmationBox({
  currentState,
  obtainedMovie,
  askParentToCloseModal,
}: ConfirmationDialogProps) {
  const baseURl = import.meta.env.VITE_API_URL;
  const setCrud = useCrudStore((state) => state.incrementApprovedOrRejected);
  const setEditCrud = useCrudStore(
    (state) => state.incrementEditedOrDeletedOrAdded
  );
  const accessToken = useAuthStore((state) => state.access_token);
  const memoizedToken = useMemo(() => accessToken, [accessToken]);
  const getMessage = (): string => {
    switch (currentState) {
      case 1:
        return 'Are you sure you want to approve?';
      case 2:
        return 'Are you sure you want to reject?';
      case 3:
        return 'Are you sure you want to Edit?';
      case 4:
        return 'Are you sure you want to delete?';
      default:
        return '';
    }
  };

  const getProperApi = (): string => {
    switch (currentState) {
      case 1:
      case 3:
        return baseURl + '/update/movie';
      case 2:
      case 4:
        return baseURl + '/update/moviereject';
      default:
        return '';
    }
  };

  const handleConfirmation = async () => {
    if (currentState === 1) {
      try {
        const res = await fetch(getProperApi(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${memoizedToken}`,
          },
          body: JSON.stringify({
            id: obtainedMovie.ID, // Snake case to match BE
            title: obtainedMovie.Title, // Snake case
            type: obtainedMovie.Type, // Snake case
            director: obtainedMovie.Director, // Snake case
            budget: obtainedMovie.Budget, // Snake case
            location: obtainedMovie.Location, // Snake case
            duration: obtainedMovie.Duration, // Snake case
            year_of_release: obtainedMovie.YearOfRelease, // Snake case
            is_admin_approved: true, // Snake case
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          // Show notification with backend error message
          showNotification({
            title: 'Error',
            message: data.Error || data.error || 'Failed to add movie',
            color: 'red',
          });
          return; // Exit early to prevent further processing
        }

        // Save to Zustand
        setCrud();
        askParentToCloseModal();
      } catch (err: any) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch(getProperApi(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${memoizedToken}`,
          },
          body: JSON.stringify({
            ID: obtainedMovie.ID,
            Title: obtainedMovie.Title,
            Type: obtainedMovie.Type,
            Director: obtainedMovie.Director,
            Budget: obtainedMovie.Budget,
            Location: obtainedMovie.Location,
            Duration: obtainedMovie.Duration,
            YearOfRelease: obtainedMovie.YearOfRelease,
            IsAdminApproved: obtainedMovie.IsAdminApproved,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          // Show notification with backend error message
          showNotification({
            title: 'Error',
            message: data.Error || data.error || 'Failed to add movie',
            color: 'red',
          });
          return; // Exit early to prevent further processing
        }

        // Save to Zustand
        switch (currentState) {
          case 1:
          case 2:
            setCrud();
            break;
          case 3:
          case 4:
            setEditCrud();
            break;
        }
        askParentToCloseModal();
      } catch (err: any) {
        showNotification({
          title: 'Failed',
          message: 'Error',
          color: 'red',
        });
      }
    }
  };

  return (
    <div className="space-y-6 text-black dark:text-white">
      <p className="text-lg">{getMessage()}</p>

      <div className="flex justify-end">
        <div className="w-full md:w-1/2 flex flex-col md:flex-row justify-between gap-3">
          <button
            onClick={handleConfirmation}
            className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
          >
            Ok
          </button>
          <button
            onClick={askParentToCloseModal}
            className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
