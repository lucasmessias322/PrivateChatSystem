import axios from "axios";

export const BaseUrl = "http://192.168.0.3:8081";

const api = axios.create({
  baseURL: BaseUrl,
});

export async function postRegister(data: any) {
  return api
    .post("/auth/register", data)
    .then((response) => response)
    .catch((error) => console.log(error));
}

export async function postLogin(data: any) {
  return api
    .post("/auth/login", data)
    .then((response) => response)
    .catch((error) => console.log(error));
}

export async function getSingleUser(userId: string, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const get = api
    .get(`/api/user/${userId}`, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await get;
}

export async function getAllUsers(token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const get = api
    .get(`/api/user/`, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await get;
}

export async function postNewChat(data: any, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const post = api
    .post("/api/chats", data, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await post;
}

export async function putChat(combineId: string, data: any, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const put = api
    .put(`/api/chats/${combineId}`, data, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await put;
}

export async function getchat(combineId: string, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const get = api
    .get(`/api/chats/${combineId}`, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await get;
}

export async function getAllChats(userId: string, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.get(`/api/chats/userChats/${userId}`, config);
    return response.data; // Retorna os dados diretamente
  } catch (error) {
    console.error("Erro ao buscar chats:", error); // Log do erro
    throw new Error("Não foi possível buscar os chats."); // Lança um erro para tratamento posterior
  }
}

// export async function getAllChats(userId: string, token: string) {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const get = api
//     .get(`/api/chats/${userId}`, config)
//     .then((response) => response.data)
//     .catch((error) => console.log(error));

//   return await get;
// }

export async function searchForUser(username: string, token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const get = api
    .get(`/api/chats/search?search=${username}`, config)
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return await get;
}
