import { toast } from 'sonner';

export interface ResponseData<T> {
    status: "success" | "fail";
    data?: T;
    message?: string;
}

/** 
 * Utility to generate headers with optional Authorization token.
 */
export class FormHandler {

    /**
     * The function `getHeaders` retrieves headers for API requests, including an Authorization header with
     * a Bearer token if available.
     * @returns The `getHeaders` function returns an object containing headers for an HTTP request. The
     * headers include a 'Content-Type' header with the value 'application/json', and if a token is present
     * in the localStorage, an 'Authorization' header with the token value prefixed by 'Bearer'.
     */
    private static getHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * The function `onSubmitGet` is an asynchronous method in TypeScript that sends a GET request to a
     * specified URL, displays a loading message, handles response data, and shows error messages using a
     * toast notification system.
     * @param {string} url - The `url` parameter is a string that represents the URL from which data will
     * be fetched using a GET request.
     * @param {string} [loadingText=Loading...] - The `loadingText` parameter in the `onSubmitGet` method
     * is a string that represents the text to display while the data is being loaded. By default, it is
     * set to 'Loading...'. This text is typically shown to the user as a loading indicator while the
     * request is being processed.
     * @returns The `onSubmitGet` method returns a Promise that resolves to either a value of type `T` or
     * `null`.
     */
    static async onSubmitGet<T>(
        url: string,
        loadingText: string = 'Loading...'
    ): Promise<T | null> {
        const toastId = toast.loading(loadingText);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result: ResponseData<T> = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Failed to fetch data.');
                return null;
            }

            return result as T;
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : String(error)));
            return null;
        } finally {
            toast.dismiss(toastId);
        }
    }

    /**
     * The function `onSubmitPost` is an asynchronous method in TypeScript that handles submitting POST
     * requests, displaying loading and success messages using a toast notification system.
     * @param {string} url - The `url` parameter in the `onSubmitPost` function is the endpoint URL where
     * the POST request will be sent to. It should be a string representing the URL of the server endpoint
     * that will handle the request.
     * @param {unknown} data - The `data` parameter in the `onSubmitPost` function represents the payload
     * or data that you want to send in the POST request to the specified `url`. This data can be of any
     * type (`unknown` in this case) and will be serialized to JSON using `JSON.stringify(data)` before
     * @param {string} [submitText=Submitting] - The `submitText` parameter in the `onSubmitPost` function
     * is a string that represents the message displayed to the user when the form is being submitted. By
     * default, it is set to 'Submitting'. This message is typically shown as a loading indicator to inform
     * the user that their request is being
     * @param {string} [successText=Submitted] - The `successText` parameter in the `onSubmitPost` function
     * is a string that represents the message to be displayed when the submission is successful. By
     * default, it is set to 'Submitted'. This message will be shown as a success toast after the data is
     * successfully submitted.
     * @returns The `onSubmitPost` function returns a Promise of type `T`, which is the type specified when
     * calling the function. The resolved value of the Promise will be the `data` property from the
     * response object, which is of type `T`.
     */
    static async onSubmitPost<T>(
        url: string,
        data: unknown,
        submitText: string = 'Submitting',
        successText: string = 'Submitted'
    ): Promise<T> {
        const toastId = toast.loading(submitText);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            const result: ResponseData<T> = await response.json();

            if (!response.ok || result.status === 'fail') {
                const errorMessage = result.message || 'Server error';
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }

            if (result.data === undefined || result.data === null) {
                result.data = "No data returned" as unknown as T;
            }

            toast.success(result.message || successText);
            return result.data;
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : String(error)));
            throw error;
        } finally {
            toast.dismiss(toastId);
        }
    }

    /**
     * The function `onSubmitPut` sends a PUT request to a specified URL with data, displaying loading and
     * success messages using a toast notification system.
     * @param {string} url - The `url` parameter is a string that represents the endpoint or URL where the
     * PUT request will be sent to update data. It typically includes the protocol (e.g., https://) and the
     * specific path to the resource on the server.
     * @param {T} data - The `data` parameter in the `onSubmitPut` function represents the data that you
     * want to send in the PUT request to the specified `url`. This data will be converted to a JSON string
     * using `JSON.stringify(data)` before being sent in the request body.
     * @param {string} [submitText=Updating] - The `submitText` parameter is a string that represents the
     * message displayed to the user when the form submission is in progress. In this case, it is set to
     * 'Updating' by default.
     * @param {string} [successText=Updated] - The `successText` parameter in the `onSubmitPut` function is
     * a string that represents the message to be displayed when the PUT request is successful. By default,
     * it is set to 'Updated'. You can customize this message to provide feedback to the user when the
     * update operation is successful.
     * @returns The `onSubmitPut` function returns a Promise that resolves to void (undefined).
     */
    static async onSubmitPut<T>(
        url: string,
        data: T,
        submitText: string = 'Updating',
        successText: string = 'Updated'
    ): Promise<void> {
        const toastId = toast.loading(submitText);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            const result: ResponseData<T> = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Server error');
                return;
            }

            toast.success(result.message || successText);
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            toast.dismiss(toastId);
        }
    }

    /* The `onSubmitDelete` method in the `FormHandler` class is responsible for handling a DELETE request
    to a specified URL. Here is a breakdown of what the method does: */
    static async onSubmitDelete(
        url: string,
        submitText: string = 'Deleting',
        successText: string = 'Deleted'
    ): Promise<void> {
        const toastId = toast.loading(submitText);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            let result: any = null;
            const text = await response.text();
            if (text) {
                try {
                    result = JSON.parse(text);
                } catch (err) {
                    console.warn('Failed to parse JSON:', err);
                }
            }

            if (!response.ok) {
                toast.error(result?.message || 'Server error');
                return;
            }

            toast.success(successText);
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            toast.dismiss(toastId);
        }
    }
}
