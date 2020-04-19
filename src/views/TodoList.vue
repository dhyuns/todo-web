<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-combobox
          v-model="condition.status"
          :items="['진행중', '완료']"
          label="상태"
          multiple
          small-chips
        ></v-combobox>
      </v-col>
      <v-col cols="2">
        <v-text-field label="검색어" v-model="condition.keyword"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-btn @click="getTodoList" color="primary">검색</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn @click="removeTodo">삭제</v-btn>
      </v-col>
      <v-col cols="6" key="end">
        <v-btn @click="addTodo" color="primary" class="float-lg-right">추가</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <TodoTable :todoList="todoList"></TodoTable> -->
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>내용</th>
                <th>상태</th>
                <th>참조Todo</th>
                <th>생성일자</th>
                <th>최종수정일자</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="todo in viewList" :key="todo.todoId">
                <td>
                  <v-checkbox v-model="todo.checked"></v-checkbox>
                </td>
                <td v-on:click="selectedTodo(todo.todoId)">{{todo.todoId}}</td>
                <td v-on:click="selectedTodo(todo.todoId)">{{todo.content}}</td>
                <td v-on:click="selectedTodo(todo.todoId)">{{todo.status}}</td>
                <td v-on:click="selectedTodo(todo.todoId)" v-if="!todo.referenceInfo.length">-</td>
                <td v-if="todo.referenceInfo.length">
                  <v-chip
                    v-for="reference in todo.referenceInfo"
                    :key="reference.todoId"
                    class="ma-2"
                    close
                    @click:close="removeReference(reference.todoReferenceInfoId)"
                    :color="reference.status == 'completed' ? 'primary': ''"
                    v-on:click="selectedTodo(reference.todoId)"
                  >{{reference.todoId}}</v-chip>
                </td>
                <td v-on:click="selectedTodo(todo.todoId)">{{todo.regDate}}</td>
                <td v-on:click="selectedTodo(todo.todoId)">{{todo.modifiedDate}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-pagination v-model="pageInfo.current" :length="pageInfo.total" @input="goPage"></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import router from "../router";
import { todoService } from "../services/TodoService";
import { todoReferenceService } from "../services/TodoReferenceService";

export interface TodoInfoDto {
  todoId?: number;
  content?: string;
  status?: string;
  checked?: boolean;
  modifiedDate?: string;
  regDate?: string;
  referenceInfo?: Array<ReferenceInfo>;
}

export interface ReferenceInfo {
  todoReferenceInfoId?: number;
  todoId?: number;
  content?: string;
  status?: string;
  checked?: boolean;
}

@Component
export default class TodoList extends Vue {
  searchKeyword = "";
  todoList: Array<TodoInfoDto> = [];
  viewList: Array<TodoInfoDto> = [];
  condition = {
    keyword: "",
    status: ["진행중", "완료"]
  };

  pageInfo = {
    current: 1,
    total: 0,
    pagePerCount: 5,
    totalVisible: 10
  };
  page = 1;

  constructor() {
    super();
  }

  mounted() {
    this.getTodoList();
  }

  async getTodoList() {
    this.pageInfo.current = 1;
    try {
      const result = await todoService.getTodoList(this.condition);
      if (result) {
        this.todoList = result.data;
        this.pageInfo.total = Math.ceil(
          this.todoList.length / this.pageInfo.pagePerCount
        );
        this.goPage(this.pageInfo.current);
      }
    } catch (error) {
      this.$toasted.error(error.response.data.message);
    }
  }

  addTodo() {
    router.push({ path: `/todo/edit` });
  }

  goPage(page: number) {
    this.pageInfo.current = page;
    const start = (page - 1) * this.pageInfo.pagePerCount;
    this.viewList = this.todoList.slice(
      start,
      start + this.pageInfo.pagePerCount
    );
    console.log(this.todoList);
    console.log(page);
  }

  selectedTodo(todoId: string) {
    this.$router.push({
      path: `/todo/edit`,
      query: { todoId: todoId }
    });
  }

  async removeTodo() {
    const todoIdList = this.todoList
      .filter((todo: TodoInfoDto) => todo.checked)
      .map((todo: TodoInfoDto) => todo.todoId);
    const param = {
      todoIdList: todoIdList
    };
    const result = await todoService.removeTodo(param);
    this.getTodoList();
  }

  async removeReference(todoReferenceInfoId: number) {
    // console.log(todoId, referenceTodoId);
    const param = {
      todoReferenceInfoId: todoReferenceInfoId
    };
    try {
      const result = await todoReferenceService.removeReference(param);
      this.$toasted.success("참조 TODO 삭제를 완료하였습니다.");
    } catch (error) {
      this.$toasted.error(error.response.data.message);
    }

    this.getTodoList();
  }
}
</script>
