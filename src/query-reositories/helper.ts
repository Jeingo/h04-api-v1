import {PaginatedType} from "../models/main-models";

export const getPaginatedType = <T>(items: T[],
                             pageSize: number,
                             pageNumber: number,
                             countDoc: number) : PaginatedType<T> => {
    return {
        pagesCount: Math.ceil(countDoc/pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: countDoc,
        items: items
    }
}