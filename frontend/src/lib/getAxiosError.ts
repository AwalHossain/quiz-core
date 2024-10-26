import { AxiosError } from "axios";

export function getAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500, // Default status for non-Axios errors
    };
  }

  // Fallback for unknown error types
  return {
    message: "An unknown error occurred",
    status: 500,
  };
}
