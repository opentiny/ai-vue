/**
 * 需求一期：数据双向绑定
 *
 * 提供两个并排展示的输入框，分别让用户输入 First Name 和 Last Name
 * 在输入框下方显示文字：Hello {name}，当两个输入框内容发生变化时，对应 name 的内容为 First Name 和 Last Name 的组合
 * 页面脚本定义一个对象 person，包含两个属性 firstName、lastName，分别设置或返回 First Name 和 Last Name 的内容
 * person 的 firstName、lastName 对应两个输入框，读取该值时等于输入框的值，修改该值后同步影响输入框的值
 */

import { createApp, reactive, computed } from './core1/vue.js';

const app = createApp({
  el: '#app',
  setup() {
    const state = reactive({
      firstName: '',
      lastName: ''
    });

    const name = computed(() => `${state.firstName} ${state.lastName}`);

    return {
      state,
      name
    };
  },
  template: document.querySelector('#app').innerHTML
});

window.person = app.state;
