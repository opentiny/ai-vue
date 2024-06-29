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
 * 当对象 person 的属性 firstName 的值发生变化时，在控制台打印 firstName changed: 原值 -> 新值
 * 当对象 person 的属性 lastName 的值发生变化时，在控制台打印 lastName changed: 原值 -> 新值
 * 当输入框下方显示文字的标签 name 的内容发生变化时，在控制台打印 new name: 新值
 */

let firstName = '';
let lastName = '';

const setName = (name) => {
  $('#name').text(name);
};

const person = {};

Object.defineProperties(person, {
  name: {
    get() {
      return `${firstName} ${lastName}`;
    }
  },
  firstName: {
    get() {
      return firstName;
    },
    set(val) {
      const oldFirstName = firstName;
      firstName = val;

      $('#firstName').val(val);
      console.log(`firstName changed: ${oldFirstName} -> ${val}`);

      setName(this.name);
      console.log(`new name: ${this.name}`);
    }
  },
  lastName: {
    get() {
      return lastName;
    },
    set(val) {
      const oldLastName = lastName;
      lastName = val;

      $('#lastName').val(val);
      console.log(`lastName changed: ${oldLastName} -> ${val}`);

      setName(this.name);
      console.log(`new name: ${this.name}`);
    }
  }
});

$('#firstName').on('input', (e) => {
  person.firstName = e.target.value;
});

$('#lastName').on('input', (e) => {
  person.lastName = e.target.value;
});
