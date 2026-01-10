import axios from "axios";

const axiosData = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const useCallData = () => {
  return axiosData
};

export default useCallData;