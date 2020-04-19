import { httpService } from './HttpService';

class TodoService {
    async getTodoList(input?: any) {
        const response = await httpService.get(`/todo`, input);
        return response;
    }

    async saveTodo(input: any) {
        const response = await httpService.post(`/todo`, input);
        return response;
    }

    async getTodoInfo(input?: any) {
        const response = await httpService.get(`/todo/detail`, input);
        return response;
    }

    async removeTodo(input: any) {
        const response = await httpService.get(`/todo/remove`, input);
        return response;
    }

    async status(input: any) {
        const response = await httpService.get(`/todo/status`, input);
        return response;
    }
}

export const todoService = new TodoService();