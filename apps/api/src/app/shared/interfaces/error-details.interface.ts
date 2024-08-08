export interface ErrorDetails {
    [key: string]: string | number | boolean | null | ErrorDetails;
}
