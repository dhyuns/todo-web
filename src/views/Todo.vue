
<template>
  <v-container>
    <router-view></router-view>
    <!-- <v-row>
      <v-col cols="6">
        <v-text-field label="Search" v-model="searchKeyword"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-btn v-on:click="searchTodo()">Search</v-btn>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Todo extends Vue {
  // searchKeyword = "";
  // onClick() {
  //   console.log("home");
  // }

  // searchTodo() {
  //   console.log("click", this.searchKeyword);
  // }
}
</script>
