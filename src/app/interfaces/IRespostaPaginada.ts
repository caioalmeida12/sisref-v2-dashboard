export type IRespostaPaginada<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string,
  per_page: number,
  prev_page_url: string,
  to: number,
  total: number
};
