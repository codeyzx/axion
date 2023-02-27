import axios from "axios";

const axiosClient = axios.create();

const mapHeaders = {
  "Content-Type": "application/json",
  accept: "application/json",
  Authorization: "",
};

axios.interceptors.request.use(
  function (request) {
    request.headers["Content-Type"] = "multipart/form-data";
    return request;
  },
  null,
  { synchronous: true }
);

axios.interceptors.response.use(
  function (response) {
    //Dispatch any action on success
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      //Add Logic to
      //1. Redirect to login page or
      //2. Request refresh token
    }
    return Promise.reject(error);
  }
);

export function customAxios(method, url, data, headers) {
  if (headers !== null) {
    mapHeaders.Authorization = headers;
  }

  return axios({
    method: method,
    url: url,
    data: data,
    headers: mapHeaders,
    baseURL: "http://127.0.0.1:8080/",
    timeout: 2000,
    withCredentials: true,
  }).then((response) => response);
}

export function postRequest(URL, payload, headers) {
  return customAxios("POST", `/${URL}`, payload, headers);
}

export function getRequest(URL, headers) {
  return customAxios("GET", `/${URL}`, null, headers);
}

export function patchRequest(URL, payload, headers) {
  return customAxios("PATCH", `/${URL}`, payload, headers);
}

export function putRequest(URL, payload, headers) {
  return customAxios("PUT", `/${URL}`, payload, headers);
}

export function deleteRequest(URL, headers) {
  return customAxios("DELETE", `/${URL}`, null, headers);
}
export default axiosClient;
