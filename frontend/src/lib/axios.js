// import axios from 'axios';

// export const axiosInstance = axios.create({
//     baseURL: 'http://localhost:5001/api' ,
//     withCredentials: true,//send cookies with requests
// });

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});
