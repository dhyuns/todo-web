import { httpService } from './HttpService';

class TodoReferenceService {
    async addReference(input: any) {
        const response = await httpService.post(`/reference/add`, input);
        return response;
    }

    async removeReference(input?: any) {
        const response = await httpService.get(`/reference/remove`, input);
        return response;
    }
}

export const todoReferenceService = new TodoReferenceService();