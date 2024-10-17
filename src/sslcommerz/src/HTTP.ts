import axios, { AxiosResponse } from "axios";

interface HTTPParams {
  url: string;
  method: string;
  data?: any;
}

const HTTP = async ({ url, method, data }: HTTPParams): Promise<any> => {
  const axiosResponse: AxiosResponse = await axios({
    method: method,
    url: url,
    data: data,
  });

  return axiosResponse.data;
};

export default HTTP;
