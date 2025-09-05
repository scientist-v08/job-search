import { Box, Group, NumberInput, TextInput } from '@mantine/core';
import { MovieInterface } from '../interfaces/movies.interface';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../store/authStore';
import { useMemo } from 'react';
import { useCrudStore } from '../store/crudStore';
import { showNotification } from '@mantine/notifications';

export function EditBox({
  movie,
  currentState,
  askParentToCloseModal,
}: {
  movie: MovieInterface;
  currentState: number;
  askParentToCloseModal: () => void;
}) {
  const baseURl = import.meta.env.VITE_API_URL;
  const form = useForm({
    initialValues: {
      Title: movie.Title,
      Type: movie.Type,
      Director: movie.Director,
      Budget: movie.Budget,
      Location: movie.Location,
      Duration: movie.Duration,
      YearOfRelease: movie.YearOfRelease,
    },
    validate: {
      Title: (value) => (value.trim() ? null : 'Title is required'),
      Type: (value) => (value.trim() ? null : 'Type is required'),
      Director: (value) => (value.trim() ? null : 'Director is required'),
      Budget: (value) => (value.trim() ? null : 'Budget is required'),
      Location: (value) => (value.trim() ? null : 'Location is required'),
      Duration: (value) => (value.trim() ? null : 'Duration is required'),
      YearOfRelease: (value) =>
        value.trim() ? null : 'Year of Release is required',
    },
  });
  const accessToken = useAuthStore((state) => state.access_token);
  const memoizedToken = useMemo(() => accessToken, [accessToken]);
  const setEditCrud = useCrudStore(
    (state) => state.incrementEditedOrDeletedOrAdded
  );

  const getProperApi = (): string => {
    return baseURl + '/update/movie';
  };

  const handleEditFormSubmission = async (values: any) => {
    movie.Title = values.Title;
    movie.Type = values.Type;
    movie.Director = values.Director;
    movie.Budget = values.Budget;
    movie.Location = values.Location;
    movie.Duration = values.Duration;
    movie.YearOfRelease = values.YearOfRelease;
    try {
      const res = await fetch(getProperApi(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${memoizedToken}`,
        },
        body: JSON.stringify({
          id: movie.ID, // Snake case to match BE
          title: values.Title, // Snake case
          type: values.Type, // Snake case
          director: values.Director, // Snake case
          budget: values.Budget, // Snake case
          location: values.Location, // Snake case
          duration: values.Duration, // Snake case
          year_of_release: values.YearOfRelease, // Snake case
          is_admin_approved: movie.IsAdminApproved, // Snake case
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
        case 3:
        case 4:
          setEditCrud();
          break;
      }
      askParentToCloseModal();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <>
      <Box>
        <form
          onSubmit={form.onSubmit((values) => handleEditFormSubmission(values))}
          className="space-y-6"
        >
          <TextInput
            label="Title"
            placeholder="Enter movie Title"
            {...form.getInputProps('Title')}
          />
          <TextInput
            label="Type"
            placeholder="Enter movie type"
            {...form.getInputProps('Type')}
          />
          <TextInput
            label="Director"
            placeholder="Enter director's name"
            {...form.getInputProps('Director')}
          />
          <NumberInput
            label="Budget"
            placeholder="Enter budget"
            prefix="$"
            thousandSeparator=","
            {...form.getInputProps('Budget')}
          />
          <TextInput
            label="Location"
            placeholder="Enter filming location"
            {...form.getInputProps('Location')}
          />
          <NumberInput
            label="Duration (minutes)"
            placeholder="Enter duration"
            suffix=" min"
            {...form.getInputProps('Duration')}
          />
          <NumberInput
            label="Year"
            placeholder="Enter release year"
            {...form.getInputProps('YearOfRelease')}
          />
          <Group mt="md">
            <button
              type="submit"
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Edit
            </button>
          </Group>
        </form>
      </Box>
    </>
  );
}
