import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import TodoList from '../views/TodoList.vue'
import Todo from '../views/Todo.vue'
import TodoEdit from '../views/TodoEdit.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '*',
    redirect: { path: 'todo' }
  }, {
    path: '/todo',
    name: 'TodoList',
    component: Todo,
    children: [
      { path: '', component: TodoList },
      { path: 'edit', component: TodoEdit }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
