<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-text-field label="내용" v-model="todo.content"></v-text-field>
        <v-radio-group v-model="todo.status" row>
          <v-radio
            v-for="status in statusGroup"
            :key="status.key"
            :label="status.label"
            :value="status.key"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <header>참조 TODO</header>
        <span v-if="!todo.referenceInfo || !todo.referenceInfo.length">-</span>
        <v-chip
          v-for="reference in todo.referenceInfo"
          :key="reference.todoId"
          class="ma-2"
          close
          @click:close="removeReference(reference)"
          :color="reference.status == 'completed' ? 'primary': ''"
        >{{reference.content}}</v-chip>
      </v-col>
    </v-row>
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
        <v-btn @click="getTodoList()" color="primary">검색</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn @click="addTodo()">추가</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table :fixed-header="true">
          <template v-slot:default>
            <thead>
              <tr>
                <th></th>
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
                <td>{{todo.content}}</td>
                <td>{{todo.status}}</td>
                <td>
                  <v-chip
                    v-for="reference in todo.referenceInfo"
                    :key="reference.todoId"
                    class="ma-2"
                    :color="reference.status == 'completed' ? 'primary': ''"
                  >{{reference.todoId}}</v-chip>
                </td>
                <td>{{todo.regDate}}</td>
                <td>{{todo.modifiedDate}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-pagination v-model="pageInfo.current" :length="pageInfo.total" @input="goPage"></v-pagination>
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="1">
        <v-btn @click="cancel()">취소</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn @click="saveTodo()" color="primary">저장</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { TodoInfoDto, ReferenceInfo } from "./TodoList.vue";
import { todoService } from "../services/TodoService";
import { todoReferenceService } from "../services/TodoReferenceService";

@Component
export default class TodoEdit extends Vue {
  todo: TodoInfoDto = {
    content: "",
    status: "progress",
    referenceInfo: []
  };

  statusGroup = [
    {
      key: "progress",
      label: "진행중"
    },
    {
      key: "completed",
      label: "완료"
    }
  ];
  condition: any = {
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
  // content = "";
  todoList: Array<TodoInfoDto> = [];
  viewList: Array<TodoInfoDto> = [];
  mounted() {
    const query = this.$route.query;
    if (query.todoId) {
      const param = {
        todoId: query.todoId
      };
      this.condition.todoId = query.todoId;
      this.getTodoInfo(param);
    }
  }

  async getTodoInfo(param: any) {
    const result = await todoService.getTodoInfo(param);
    if (result) {
      this.todo = result.data;
    }
  }

  goPage(page: number) {
    this.pageInfo.current = page;
    const start = (page - 1) * this.pageInfo.pagePerCount;
    this.viewList = this.todoList.slice(
      start,
      start + this.pageInfo.pagePerCount
    );
  }

  async getTodoList() {
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
      this.$toasted.error("TODO 목록 조회에 실패하였습니다.");
    }
  }

  async removeReference(reference: ReferenceInfo) {
    console.log(reference);
    if (this.todo.todoId) {
      const param = {
        todoReferenceInfoId: reference.todoReferenceInfoId
      };
      try {
        const result = await todoReferenceService.removeReference(param);
        if (this.todo.referenceInfo) {
          this.todo.referenceInfo.forEach((v, i) => {
            if (reference.todoReferenceInfoId === v.todoReferenceInfoId) {
              if (this.todo.referenceInfo) {
                this.todo.referenceInfo.splice(i, 1);
              }
            }
          });
        }
        this.$toasted.success("참조 TODO 삭제를 완료하였습니다.");
      } catch (error) {
        this.$toasted.error(error.response.data.message);
      }
    } else {
      if (this.todo.referenceInfo) {
        console.log(this.todo.referenceInfo);
        this.todo.referenceInfo.forEach((v, i) => {
          if (reference.todoId === v.todoId) {
            if (this.todo.referenceInfo) {
              this.todo.referenceInfo.splice(i, 1);
            }
          }
        });
      }
    }
  }

  async addTodo() {
    console.log(this.todo);
    // if (this.todo.referenceInfo) {
    let referenceList = this.todoList.filter((el: ReferenceInfo) => el.checked);
    if (this.todo.todoId) {
      //바로 저장
      const param = {
        todoId: this.todo.todoId,
        referenceInfo: referenceList
      };
      try {
        const result = await todoReferenceService.addReference(param);
        this.$toasted.success("참조 TODO 추가를 완료하였습니다.");
        this.getTodoInfo({ todoId: this.todo.todoId });
      } catch (error) {
        this.$toasted.error(error.response.data.message);
      }
    } else {
      //리스트에 추가
      referenceList = referenceList.filter(add => {
        if (this.todo.referenceInfo) {
          return !this.todo.referenceInfo.some(
            org => add.todoId === org.todoId
          );
        } else {
          return true;
        }
      });
      if (this.todo.referenceInfo) {
        this.todo.referenceInfo = this.todo.referenceInfo.concat(referenceList);
      } else {
        this.todo.referenceInfo = referenceList;
      }
    }
  }

  cancel() {
    this.$router.go(-1);
  }

  async saveTodo() {
    try {
      const result = await todoService.saveTodo(this.todo);
      if (result) {
        this.$toasted.success("TODO 저장을 완료하였습니다.");
        this.$router.go(-1);
      }
    } catch (error) {
      this.$toasted.error(error.response.data.message);
    }
  }
}
</script>
