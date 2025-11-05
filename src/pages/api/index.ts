import { AxiosResponse } from 'axios';

import { restDataRequest, restDataResponse } from '@app/src/types/api/AppHttpResponse';

import { rest } from './rest';

/**
 * Sends an API request to perform a specified action and returns the response.
 *
 * @param dataRequest - The request payload containing action and related data.
 * @param testError - Optional flag to simulate an error response for testing purposes. Defaults to `false`.
 * @returns A promise that resolves to a `restDataResponse` object containing the status, data, and optionally an ID.
 *
 * @throws Will throw an error if the response status is not 200.
 *
 * @remarks
 * - Uses Axios to send a POST request to `/actions/{action}` endpoint.
 * - If `testError` is true, the returned status will be 500 regardless of the actual response.
 * - On error, logs the error and returns a response with status 500 and error details.
 */
export const apiRequest = async (dataRequest: restDataRequest, testError = false): Promise<restDataResponse> => {
  try {
    const response: AxiosResponse = await rest.post(
      '/actions/' + dataRequest.action,
      dataRequest ? JSON.stringify(dataRequest) : null,
    );
    if (response.status !== 200) {
      throw new Error('Failed to create termination session');
    }
    return {
      status: testError ? 500 : 200,
      data: response.data.data,
      ...(response.data.id ? { id: response.data.id } : {}),
    } as any;
  } catch (error: any) {
    devlogger.error('Error creating empty termination request:', error);
    return {
      status: 500,
      success: false,
      error: error,
    };
  }
};
