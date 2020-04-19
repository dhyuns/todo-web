import axios from "axios";
import qs from 'qs';

class HttpService {
    private static BASE_URL = '/api';

    async get(url: string, input?: any) {
        // const qs = require('qs');
        const config = {
            params: input,
            paramsSerializer: (params: any) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        };
        const response = await axios.get(`${HttpService.BASE_URL}${url}`, config);
        return response;
    }

    async post(url: string, input?: any) {
        const response = await axios.post(`${HttpService.BASE_URL}${url}`, input);
        return response;
    }
}

export const httpService = new HttpService();