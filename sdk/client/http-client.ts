import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  Error = 400,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

// We could use the following function to inject the JWT token through an interceptor
const injectConfig = (
  config: AxiosRequestConfig,
  injectConfigHeaders?: Record<string, string>,
): InternalAxiosRequestConfig => {
  try {
    if (config.headers) {
      config.headers = {
        ...config.headers,
        ...injectConfigHeaders,
      };
    }

    return config as InternalAxiosRequestConfig;
  } catch (error) {
    throw new Error((error as unknown as string)?.toString());
  }
};

export class HttpClient {
  private instance: AxiosInstance | null = null;
  private baseUrl: string;
  private headers: Record<string, string> | undefined;

  private get http(): AxiosInstance {
    return this.instance !== null ? this.instance : this.initHttp();
  }

  constructor(baseUrl?: string, constructorHeaders?: Record<string, string>) {
    if (baseUrl === null || baseUrl === undefined) {
      throw new Error('Missing base URL, please check your HttpClient init.');
    }

    this.baseUrl = baseUrl;
    this.headers = constructorHeaders || {};
  }

  initHttp() {
    const http = axios.create({
      baseURL: this.baseUrl,
      headers: headers,
      withCredentials: true,
    });

    http.interceptors.request.use(
      (config) => injectConfig(config, this.headers),
      (error) => Promise.reject(error),
    );

    http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;

        return this.handleError(response);
      },
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.get(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.post(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.put(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.delete(url, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: any) {
    if (!error) {
      return Promise.reject('Failed (CORS / Unspecified)');
    }

    const { status } = error;

    switch (status) {
      case StatusCode.Error: {
        break;
      }
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }
}
