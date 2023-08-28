import { PipelineStage } from 'mongoose';
import { IQueryParams } from '../interfaces/common';

const getAggregationStages = (
  queries: IQueryParams,
  searchFields: string[]
): PipelineStage[] => {
  // Select Which field want to get or remove
  const fieldSelection: PipelineStage =
    queries.fields && Object.keys(queries.fields).length > 0
      ? {
          $project: queries.fields,
        }
      : { $addFields: {} };

  // Searching stage to search in all fields
  const orSearch =
    queries.search &&
    queries.search !== '' &&
    queries.search !== 'undefined' &&
    searchFields.length
      ? searchFields.map(field => {
          return {
            [field]: {
              $regex: queries.search,
              $options: 'i',
            },
          };
        })
      : [{ _id: { $exists: true } }];

  // Searching stage to search in specific fields
  const andSearch =
    queries.filters && Object.keys(queries.filters).length
      ? Object.entries(queries.filters || {}).map(([key, value]) => ({
          [key]: {
            $regex: value,
            $options: 'i',
          },
        }))
      : [{ _id: { $exists: true } }];

  // Match stage to filter by field
  const matchStage: PipelineStage = {
    $match: { $or: orSearch, $and: andSearch },
  };

  // Sorting stage to sort by field
  const sortStage: PipelineStage =
    queries.sortBy && queries.sortOrder
      ? {
          $sort: {
            [queries.sortBy]: queries.sortOrder,
          },
        }
      : { $addFields: {} };

  // Pagination stage to limit and skip
  const paginationStage: PipelineStage = {
    $facet: {
      data: [
        queries.page && queries.limit
          ? { $skip: (queries.page - 1) * queries.limit }
          : { $addFields: {} },
        queries.limit ? { $limit: queries.limit } : { $addFields: {} },
      ],
      totalDocuments: [{ $count: 'total' }],
      totalResult: [matchStage, { $count: 'total' }],
    },
  };

  // Unwind stage to get data from array
  const unwindTotalDocument: PipelineStage = {
    $unwind: '$totalDocuments',
  };
  const unwindTotalResult: PipelineStage = {
    $unwind: '$totalResult',
  };

  // Project stage to get data from array
  const projectStage: PipelineStage = {
    $project: {
      data: 1,
      totalDocuments: '$totalDocuments.total',
      totalResult: '$totalResult.total',
    },
  };

  // Add all stages in array
  const stages: PipelineStage[] = [
    matchStage,
    sortStage,
    fieldSelection,
    paginationStage,
    unwindTotalDocument,
    unwindTotalResult,
    projectStage,
  ];

  return stages;
};

export default getAggregationStages;
