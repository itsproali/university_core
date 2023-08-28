import { IPaginationOptions } from '../interfaces/pagination';

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

export const getPagination = (options: IOptions): IPaginationOptions => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder
    ? options.sortOrder === 'asc'
      ? 1
      : -1
    : -1;

  return { page, limit, skip, sortBy, sortOrder };
};
