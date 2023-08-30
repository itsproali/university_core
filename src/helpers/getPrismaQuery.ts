import { IQueryParams } from "../interfaces/common";

const getPrismaQuery = (
  queries: Partial<IQueryParams>,
  searchFields: string[]
) => {
  const { page, limit, search, filters, fields, sortBy, sortOrder } = queries;

  const orSearch =
    search && search !== "" && search !== "undefined" && searchFields.length
      ? searchFields.map(field => {
          return {
            [field]: {
              contains: search,
              mode: "insensitive",
            },
          };
        })
      : undefined;

  const andSearch =
    filters && Object.keys(filters).length
      ? Object.entries(filters || {}).map(([key, value]) => ({
          [key]: {
            equals: value,
            mode: "insensitive",
          },
        }))
      : undefined;

  const where = {
    AND: andSearch,
    OR: orSearch,
  };
  // Reusable prisma query
  const prismaQuery = {
    where,
    skip: page && limit ? (page - 1) * limit : undefined,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    select: fields && Object.keys(fields).length ? fields : undefined,
  };

  return prismaQuery;
};
export default getPrismaQuery;
