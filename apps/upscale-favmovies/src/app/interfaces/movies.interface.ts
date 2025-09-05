export interface MoviesInterface {
  movies: MovieInterface[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
}

export interface MovieInterface {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
  Title: string;
  Type: string;
  Director: string;
  Budget: string;
  Location: string;
  Duration: string;
  YearOfRelease: string;
  IsAdminApproved: boolean;
  Image: string;
  MimeType: string;
}
