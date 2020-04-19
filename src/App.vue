<template>
  <v-app>
    <v-app-bar app color="primary" dark>TODO</v-app-bar>

    <v-content>
      <router-view></router-view>
      <!-- <HelloWorld /> -->
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>
