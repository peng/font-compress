import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 使用 require 避免生成 0.js 1.js ......
const useComponent = component => () => import(`./pages/${component}.vue`);
const useHomeComp = component => () => import(`./pages/home/${component}.vue`);

const routes = [
  {
    name: "signIn",
    path: "/signin",
    component: useComponent("signin")
  },
  {
    path: "/home",
    name: "home",
    component: useComponent("home"),
    children: [
      {
        name: "homeFont",
        path: "font",
        component: useHomeComp("font")
      }
    ]
  },
  {
    name: "logIn",
    path: "/login",
    component: useComponent("login")
  },
  {
    name: "admin",
    path: "/admin",
    component: useComponent("admin")
  }
];
const router = new VueRouter({ routes });
export default router;
