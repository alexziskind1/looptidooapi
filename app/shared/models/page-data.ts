export interface PageData<T> {
    currentPage: number;
    pageSize: number;
    totalItemCount: number;
    pageCount: number;
    data: T[]
}