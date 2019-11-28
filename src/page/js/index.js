import Vue from "vue";
import Element from "element-ui";
import "../css/index.less";
import "element-ui/lib/theme-chalk/index.css";
import App from "./app.vue";
import router from "./router";

// (function (comps) {
//   comps.forEach(item => {
//     Vue.use(Element[item]);
//   })
// })(['Form', 'FormItem', 'Input', 'Button']);

Vue.use(Element);

new Vue({
  components: { App },
  router,
  render(h) {
    return h("App");
  }
}).$mount("#root");
