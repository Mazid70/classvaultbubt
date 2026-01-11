import axios from "axios";

const axiosData = axios.create({
  baseURL: 'http://localhost:2003/api',
  withCredentials: true,
});

const useCallData = () => {
  return axiosData
};

export default useCallData;