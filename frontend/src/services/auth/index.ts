
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";

interface SignUpResponse {
  access_token: string;
}

export const SignUp = async (username: string, password: string) => {
  const url = `${ENDPOINTS["SIGNUP"]}`;
  const response = await clientFetch.post<SignUpResponse>(url, {
    username,
    password,
  });
  if (response.data) {
    return response.data;
  }
};

export const SignIn = async (username: string, password: string) => {
  const url = `${ENDPOINTS["SIGNIN"]}`;
  const response = await clientFetch.post<SignUpResponse>(url, {
    username,
    password,
  });
  if (response.data) {
    return response.data;
  }
};
