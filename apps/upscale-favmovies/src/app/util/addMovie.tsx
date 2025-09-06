import { Box, TextInput, NumberInput, Group, FileInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCrudStore } from '../store/crudStore';
import { showNotification } from '@mantine/notifications';

interface AddMovieProps {
  signalParentComponentToClose: () => void;
}

interface MovieFormValues {
  Title: string;
  Type: string;
  Director: string;
  Budget: string;
  Location: string;
  Duration: string;
  YearOfRelease: string;
  image: File | null;
}

export function AddMovie({ signalParentComponentToClose }: AddMovieProps) {
  const baseURL = import.meta.env.VITE_API_URL;

  const form = useForm({
    initialValues: {
      Title: '',
      Type: '',
      Director: '',
      Budget: '',
      Location: '',
      Duration: '',
      YearOfRelease: '',
      image: null,
    },
    validate: {
      Title: (value) => (String(value).trim() ? null : 'Title is required'),
      Type: (value) => (String(value).trim() ? null : 'Type is required'),
      Director: (value) =>
        String(value).trim() ? null : 'Director is required',
      Budget: (value) =>
        String(value).toString().trim() ? null : 'Budget is required',
      Location: (value) =>
        String(value).trim() ? null : 'Location is required',
      Duration: (value) =>
        String(value).toString().trim() ? null : 'Duration is required',
      YearOfRelease: (value) =>
        String(value).trim() ? null : 'Year of Release is required',
      image: (value: any) => {
        if (!value) return 'Image is required';
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(value.type)) {
          return 'Only .jpg, .jpeg, and .png files are allowed';
        }
        if (value.size > 1048576) {
          return 'File size must be less than 1MB';
        }
        return null;
      },
    },
  });

  const accessToken = useAuthStore((state) => state.access_token);
  const memoizedToken = useMemo(() => accessToken, [accessToken]);
  const setEditCrud = useCrudStore(
    (state) => state.incrementEditedOrDeletedOrAdded
  );

  const getProperApi = (): string => {
    return `${baseURL}/create/movie`;
  };

  const handleAddFormSubmission = async (values: MovieFormValues) => {
    try {
      const formData = new FormData();
      formData.append('Title', values.Title);
      formData.append('Type', values.Type);
      formData.append('Director', values.Director);
      formData.append('Budget', values.Budget);
      formData.append('Location', values.Location);
      formData.append('Duration', values.Duration);
      formData.append('Year of Release', values.YearOfRelease);
      if (values.image) {
        formData.append('image', values.image);
      }

      const res = await fetch(getProperApi(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${memoizedToken}`,
        },
        body: formData,
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
      setEditCrud();
      showNotification({
        title: 'Success',
        message: 'Movie added successfully!',
        color: 'green',
      });
      signalParentComponentToClose(); // Close the component after successful submission
    } catch (err: any) {
      console.error(err);
      showNotification({
        title: 'Error',
        message: err.message || 'Failed to add movie',
        color: 'red',
      });
    }
  };

  return (
    <>
      <Box>
        <form
          onSubmit={form.onSubmit(handleAddFormSubmission)}
          className="space-y-6"
        >
          <TextInput
            label="Title"
            placeholder="Enter movie title"
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
          <FileInput
            label="Upload image"
            description="Upload only jpg, jpeg, and png files that are less than 1MB in size"
            placeholder="Upload file"
            accept="image/jpeg,image/jpg,image/png"
            {...form.getInputProps('image')}
          />
          <Group mt="md">
            <button
              type="submit"
              className="flex-1 px-4 py-2 font-inter font-medium rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
            >
              Add
            </button>
          </Group>
        </form>
      </Box>
    </>
  );
}
