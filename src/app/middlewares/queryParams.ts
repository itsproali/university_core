/* eslint-disable @typescript-eslint/ban-types */
import { RequestHandler } from 'express';

const queryParams: RequestHandler = (req, res, next) => {
  const page: number = parseInt(req.query.page as string);
  const limit: number = parseInt(req.query.limit as string);
  const search: string = String(req.query.search) || '';
  const sortBy: string = req.query.sortBy
    ? String(req.query.sortBy)
    : 'createdAt';
  const sortOrder: 1 | -1 =
    String(req.query.sortOrder) === 'asc' ? 1 : -1 || -1;

  // setting up filters
  const query: object = req.query;
  const filters: { [key: string]: number | string | boolean } = {
    ...query,
  };

  const excludedFields = [
    'page',
    'sortBy',
    'sortOrder',
    'limit',
    'fields',
    'search',
  ];

  excludedFields.forEach(el => delete filters[el]);

  Object.keys(filters).forEach(key => {
    if (filters[key] === 'true') {
      filters[key] = true;
    } else if (filters[key] === 'false') {
      filters[key] = false;
    }
  });

  // Setting up fields
  const fieldsObj: { [key: string]: number } = {};

  if (req.query.fields) {
    let fields = String(req.query.fields);
    fields = fields.split(',').join(' ');

    // create fields object
    fields.split(' ').forEach(el => {
      fieldsObj[el] = 1;
    });
  }

  const modifiedQueries = {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    filters,
    fields: fieldsObj,
  };

  req.queryParams = modifiedQueries;

  next();
};
export default queryParams;
