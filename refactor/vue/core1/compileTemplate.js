const compileTemplate = function () {
  const self = this;

  const getExpression = (expression) => {
    const keys = expression.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], self);
    return { target, lastKey };
  };

  const evalExpression = (expression) => {
    const { target, lastKey } = getExpression(expression);
    return target[lastKey];
  };

  const execExpression = (expression, value) => {
    const { target, lastKey } = getExpression(expression);
    target[lastKey] = value;
  };

  const el = document.createElement('div');
  el.innerHTML = self.$options.template.trim();
  self.$el = el.childNodes[0];

  const dom = document.querySelector(self.$options.el);
  if (dom) {
    dom.innerHTML = '';
    dom.appendChild(self.$el);
  }

  self.$el.querySelectorAll('[v-model]').forEach((element) => {
    const value = element.getAttribute('v-model');
    element.value = evalExpression(value);
    element.addEventListener('input', (event) => {
      execExpression(value, event.target.value);
      self.$emit(`update:${value}`, event.target.value);
    });
  });

  self.$el.querySelectorAll('[v-text]').forEach((element) => {
    const value = element.getAttribute('v-text');
    element.textContent = evalExpression(value);
    self.$on(`update:${value}`, (newValue) => {
      element.textContent = newValue;
    });
  });
};

export { compileTemplate };
