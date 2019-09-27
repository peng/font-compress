import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

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
