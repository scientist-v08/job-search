export interface MovieFilterFormProps {
  onSubmit: (values: {
    pageSize: string;
    sortOrder: string;
    sortBy: string;
    searchByTitle: string;
    searchByDirector: string;
  }) => void;
}

export interface MovieFiltersInterface {
  pageSize: string;
  sortOrder: string;
  sortBy: string;
  searchByTitle: string;
  searchByDirector: string;
}
