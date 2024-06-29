/**
 * 需求一期：数据双向绑定
 *
 * 提供两个并排展示的输入框，分别让用户输入 First Name 和 Last Name
 * 在输入框下方显示文字：Hello {name}，当两个输入框内容发生变化时，对应 name 的内容为 First Name 和 Last Name 的组合
 * 页面脚本定义一个对象 person，包含两个属性 firstName、lastName，分别设置或返回 First Name 和 Last Name 的内容
 * person 的 firstName、lastName 对应两个输入框，读取该值时等于输入框的值，修改该值后同步影响输入框的值
 *
 * 需求二期：监控修改变化
 *
 * 当两个输入框 First Name 和 Last Name 的值输入发生变化时，在控制台打印 input First Name/Last Name changed: 原值 -> 新值
 * 当输入框下方显示文字的标签 name 的内容发生变化时，在控制台打印 label name changed: 原值 -> 新值
 * 当对象 person 的两个属性 firstName、lastName 的值发生变化时，在控制台打印 person firstName/lastName changed: 原值 -> 新值
 *
 * 需求三期：模板动态替换
 *
 * 在页面加载完成前，调用 fetchTitle 方法，该异步方法模拟后端异步请求，三秒之后返回 title 字符串，默认为 Dr.
 * 调用 fetchTitle 异步方法之后，附加在标签 Hello {title} {name} 的中间位置，当 name 值发生变化时，title 保持不变
 * 位于标签 Hello {title} {name} 中间位置的 title，要求用蓝色字体展示
 *
 * 需求四期：组件事件冒泡
 *
 * 在页面加载完成前，子组件 FullName 调用 fetchTitle 方法之后，向上往父组件抛 greet 事件，将获取的 title 告知父组件
 * 父组件添加 greetMessage 方法，在其模板上监听子组件 FullName 的 greet 事件，并继续往外抛 greet 事件
 * 在应用层代码里，应用实例调用 $on 方法监听父组件的 greet 事件，控制台打印通过 fetchTitle 方法获取的 title
 */

import { createApp, reactive, computed, watch, onBeforeMount } from './core4/vue.js';

const fetchTitle = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve('Dr.'), 3000);
  });

const FullName = {
  emits: ['greet'],
  setup(props, context) {
    const state = reactive({
      title: ''
    });

    onBeforeMount(async () => {
      state.title = await fetchTitle();
      context.emit('greet', state.title);
    });

    return {
      state
    };
  },
  template: `
    <span>
      <font style="color:blue">{{ state.title }}</font>
      <slot></slot>
    </span>
  `
};

const app = createApp({
  el: '#app',
  components: {
    FullName
  },
  setup(props, context) {
    const state = reactive({
      firstName: '',
      lastName: ''
    });

    const name = computed(() => `${state.firstName} ${state.lastName}`);

    watch(
      () => state.firstName,
      (newValue, oldValue) => {
        console.log(`firstName changed: ${oldValue} -> ${newValue}`);
        console.log(`new name: ${name}`);
      }
    );

    watch(
      () => state.lastName,
      (newValue, oldValue) => {
        console.log(`lastName changed: ${oldValue} -> ${newValue}`);
        console.log(`new name: ${name}`);
      }
    );

    const greetMessage = (message) => context.emit('greet', message);

    return {
      state,
      name,
      greetMessage
    };
  },
  template: `
    <div>
      <div>First Name: <input v-model="state.firstName" /> Last Name: <input v-model="state.lastName" /></div>
      <h1>Hello <FullName v-on:greet="greetMessage">{{ name }}</FullName></h1>
    </div>
  `
});

app.$on('greet', (message) => {
  console.log('Welcome', message);
});

window.person = app.state;
