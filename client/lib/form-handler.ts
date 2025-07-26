import { toast } from 'sonner';

export interface ResponseData<T> {
    status: "success" | "fail";
    data?: T;
    message?: string;
}

/* The `UtilityHandler` class provides utility methods for handling POST, PUT, and DELETE requests with
toast notifications in TypeScript. */
export class FormHandler {

    /**
     * Sends a GET request to the given URL and returns the parsed JSON response.
     * Displays toast notifications for loading, success, and error states.
     * @param {string} url - The URL to fetch data from.
     * @param {string} [loadingText=Loading] - Message shown while the request is in progress.
     * @param {string} [successText=Loaded] - Message shown when the data is successfully fetched.
     * @returns {Promise<T | null>} - The parsed JSON response, or null if there was an error.
     */
    static async onSubmitGet<T>(
        url: string,
        loadingText: string = 'Loading...',
    ): Promise<T | null> {
        const toastId = toast.loading(loadingText);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result: ResponseData<T> = await response.json();
            if (!response.ok) {
                toast.error(result.message || 'Failed to fetch data.');
                return null;
            }
            return result as T;
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : error));
            return null;
        } finally {
            toast.dismiss(toastId);
        }
    }


    /**
     * The function `onSubmitPost` is an asynchronous function in TypeScript that handles submitting data
     * via a POST request, displaying loading and success messages using a toast notification library.
     * @param {string} url - The `url` parameter is a string that represents the endpoint where the POST
     * request will be sent to. It typically includes the full URL of the server endpoint where the data
     * will be submitted.
     * @param {T} data - The `data` parameter in the `onSubmitPost` function represents the data that you
     * want to send in the POST request to the specified URL. This data should be of type `T`, which is a
     * generic type that can be specified when calling the function. The function will convert this data to
     * @param {string} [submitText=Submitting] - The `submitText` parameter is a string that represents the
     * message displayed to the user when the form submission is in progress. In the `onSubmitPost`
     * function, this message is shown as a loading toast using the `toast.loading` method before the form
     * data is sent to the server.
     * @param {string} [successText=Submitted] - The `successText` parameter in the `onSubmitPost` function
     * is a string that represents the message to be displayed in a toast notification when the form
     * submission is successful. In the provided code snippet, it defaults to `'Submitted'` if not
     * explicitly provided when calling the function. This message is
     * @returns The `onSubmitPost` function returns a Promise that resolves to void.
     */
    static async onSubmitPost<T>(
        url: string,
        data: T,
        submitText: string = 'Submitting',
        successText: string = 'Submitted'
    ): Promise<void> {
        const toastId = toast.loading(submitText);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result: ResponseData<T> = await response.json();
            if (!response.ok) {
                toast.error("Server error");
                return;
            } else {
                toast.success(successText);
            }
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : error));
        } finally {
            toast.dismiss(toastId);
        }
    }


    /**
     * The function onSubmitPut sends a PUT request to a specified URL with data, displaying loading
     * and success messages using a toast notification system.
     * @param {string} url - The `url` parameter is a string that represents the endpoint where the PUT
     * request will be sent to update data. It typically includes the protocol (e.g., https://) and the
     * specific path to the resource on the server.
     * @param {T} data - The `data` parameter in the `onSubmitPut` function represents the payload or
     * data that you want to send in the PUT request to the specified `url`. This data will be
     * serialized to JSON format using `JSON.stringify(data)` before being sent in the request body. It
     * typically contains the information
     * @param {string} [submitText=Updating] - The `submitText` parameter in the `onSubmitPut` function
     * is a string that represents the message displayed to the user when the form submission is in
     * progress. In this case, it is set to 'Updating', indicating to the user that the data is being
     * updated.
     * @param {string} [successText=Updated] - The `successText` parameter in the `onSubmitPut`
     * function is a string that represents the message to be displayed when the PUT request is
     * successfully completed. In the provided code snippet, the default value for `successText` is set
     * to 'Updated'. This message will be shown as a success
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result: ResponseData<T> = await response.json();

            if (!response.ok) {
                toast.error("Server error");
                return;
            } else {
                toast.success(successText);
            }
        } catch (error) {
            toast.error('An error occurred: ' + (error instanceof Error ? error.message : error));
        } finally {
            toast.dismiss(toastId);
        }
    }

    /**
     * The `onSubmitDelete` function in TypeScript sends a DELETE request to a specified URL, displays
     * loading and success messages using a toast notification library, and handles errors
     * appropriately.
     * @param {string} url - The `url` parameter in the `onSubmitDelete` function is a string that
     * represents the URL to which the DELETE request will be sent. This URL typically points to the
     * resource that needs to be deleted on the server.
     * @param {string} [submitText=Deleting] - The `submitText` parameter is a string that represents
     * the text displayed in a loading toast message while the deletion operation is in progress. By
     * default, it is set to 'Deleting'.
     * @param {string} [successText=Deleted] - The `successText` parameter in the `onSubmitDelete`
     * function is a string that represents the message to be displayed in a toast notification when
     * the deletion operation is successful. In the provided code snippet, the default value for
     * `successText` is set to 'Deleted'. This message will be shown
     * @returns The `onSubmitDelete` function returns a Promise that resolves to void (undefined).
     */
    static async onSubmitDelete(
        url: string,
        submitText: string = 'Deleting',
        successText: string = 'Deleted'
    ): Promise<void> {
        const toastId = toast.loading(submitText);

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                console.error('Server error:', result);
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