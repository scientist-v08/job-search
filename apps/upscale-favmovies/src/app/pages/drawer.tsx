import { Select, SimpleGrid, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { MovieFilterFormProps } from '../interfaces/movie-filter.interface';

export function DrawerForm({ onSubmit }: MovieFilterFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      pageSize: '5',
      sortOrder: 'desc',
      sortBy: 'id',
      searchByTitle: '',
      searchByDirector: '',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <SimpleGrid cols={2}>
        <Select
          label="Page Size"
          placeholder="Select page size"
          data={['5', '10', '15']}
          {...form.getInputProps('pageSize')}
        />
        <Select
          label="Sort Order"
          placeholder="Select sort order"
          data={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
          {...form.getInputProps('sortOrder')}
        />
      </SimpleGrid>
      <Select
        label="Sort By"
        placeholder="Select sort field"
        data={[
          { value: 'id', label: 'ID' },
          { value: 'title', label: 'Title' },
          { value: 'type', label: 'Type' },
          { value: 'director', label: 'Director' },
          { value: 'budget', label: 'Budget' },
          { value: 'location', label: 'Location' },
          { value: 'duration', label: 'Duration' },
          { value: 'year_of_release', label: 'Year of Release' },
        ]}
        {...form.getInputProps('sortBy')}
        mt="md"
      />
      <TextInput
        label="Search by Title"
        placeholder="Enter movie title"
        {...form.getInputProps('searchByTitle')}
        mt="md"
      />
      <TextInput
        label="Search by Director"
        placeholder="Enter director name"
        {...form.getInputProps('searchByDirector')}
        mt="md"
      />
      <button
        type="submit"
        className="font-inter w-[25%] text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
              focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-small py-1 rounded-md text-lg transition-colors mt-4"
      >
        Apply
      </button>
    </form>
  );
}
