export const BACKEND_URL = process.env.NEXT_PUBLIC_IS_DEV
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL;
