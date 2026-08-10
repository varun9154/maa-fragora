import api from "@/lib/api";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(
  data: LoginData
) {
  const response =
    await api.post(
      "/auth/login",
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export async function registerUser(
  data: RegisterData
) {
  const response =
    await api.post(
      "/auth/register",
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export async function logoutUser() {
  try {
    await api.post(
      "/auth/logout"
    );
  } finally {
    if (
      typeof window !==
      "undefined"
    ) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );
    }
  }
}