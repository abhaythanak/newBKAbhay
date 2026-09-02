import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { authUtils } from '@/utils/auth';

function cleanPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const fieldsToFilterIfEmptyArray = [
    'preferredCities',
    'preferredCourses',
    'preferredInstitutes',
    'preferredStreams',
  ];

  const fieldsToForceEmptyString = [
    'companyName',
    'domain',
    'experienceYears',
    'alternatePhone',
    'jobRole',
  ];

  const cleaned: Record<string, unknown> = Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value)) {
        if (value.length === 0 && fieldsToFilterIfEmptyArray.includes(key)) return false;
      }
      return true;
    })
  );

  fieldsToForceEmptyString.forEach((field) => {
    if (
      !Object.prototype.hasOwnProperty.call(cleaned, field) ||
      cleaned[field] === undefined ||
      cleaned[field] === null
    ) {
      cleaned[field] = '';
    }
  });

  const ey = cleaned['experienceYears'];
  if (ey === '') {
    cleaned['experienceYears'] = 0;
  } else if (typeof ey === 'string') {
    const n = Number(ey);
    cleaned['experienceYears'] = Number.isFinite(n) ? n : 0;
  } else if (typeof ey !== 'number') {
    cleaned['experienceYears'] = 0;
  }

  return cleaned;
}

const API_BASE =
  typeof process.env.NEXT_PUBLIC_API_URL === 'string' &&
  process.env.NEXT_PUBLIC_API_URL.length > 0
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:5555/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method === 'patch' && config.data) {
      config.data = cleanPayload(config.data as Record<string, unknown>);
    }

    config.headers = config.headers ?? {};

    if (typeof window !== 'undefined') {
      const token = authUtils.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url;
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (requestUrl?.includes('/login') || requestUrl?.includes('/signup')) {
      return Promise.reject(error);
    }

    // Because DevTinder uses HttpOnly cookies, we handle 401 directly by logging out.
    // If a refresh endpoint is added later, the refresh logic below can be activated.
    if (status === 401 && typeof window !== 'undefined') {
      authUtils.logout();
      return Promise.reject(error);
    }

    const errorData = (error?.response?.data as Record<string, unknown>) || {};
    const errorMessage = (errorData['message'] || errorData['error'] || '') as string;
    
    const isSuspended =
      errorData['error'] === 'ACCOUNT_SUSPENDED' ||
      errorData['code'] === 'ACCOUNT_SUSPENDED' ||
      (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('suspend'));

    if (isSuspended && typeof window !== 'undefined') {
      toast.error(errorMessage || 'Your account has been suspended. You cannot perform this action.', {
        toastId: 'account-suspended-toast',
        autoClose: 5000,
      });
      return Promise.reject(error);
    }

    const isInactive =
      errorData['error'] === 'ACCOUNT_INACTIVE' ||
      errorData['code'] === 'ACCOUNT_INACTIVE' ||
      (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('inactive'));

    if (isInactive && typeof window !== 'undefined') {
      toast.error(errorMessage || 'Your account is currently inactive. Please contact support.', {
        toastId: 'account-inactive-toast',
        autoClose: 5000,
      });
      return Promise.reject(error);
    }

    // Default error toast for non-401s if desired, skipping for now
    return Promise.reject(error);
  }
);

export default api;
