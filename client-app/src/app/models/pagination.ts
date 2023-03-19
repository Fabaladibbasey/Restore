export interface MetaData {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface Pagination<T> {
    items: T[];
    metaData: MetaData;
}