const updateSlots = function() {
  const self = this;

  if (self.$slotContent) {
    self.$el?.querySelectorAll('slot').forEach((slot) => {
      slot.innerHTML = self.$slotContent;
    });
  }
  if (self.$parent) {
    self.$parent.innerHTML = '';
    self.$parent.appendChild(self.$el);
  }
};

const compileTemplate = function() {
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

  const setDataBind = (node) => {
    const recurse = (node) => {
      const text = node.nodeValue;
      if (node.nodeType === Node.TEXT_NODE && text.startsWith('{{') && text.endsWith('}}')) {
        const expression = text.substring(2, text.length - 2).trim();
        const value = evalExpression(expression);
        node.textContent = value !== undefined ? value : '';
      }
      node.childNodes.forEach((childNode) => recurse(childNode));
    };
    recurse(node);
  };

  const element = document.createElement('div');
  element.innerHTML = self.$options.template.trim();
  self.$el = element.childNodes[0];
  setDataBind(self.$el);

  const dom = document.querySelector(self.$options.el);
  if (dom) {
    dom.innerHTML = '';
    dom.appendChild(self.$el);
  }

  self._updateSlots();

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

const parseComponents = function() {
  const self = this;

  Object.keys(self._components).forEach((componentName) => {
    const component = self[componentName] || new self.constructor(self._components[componentName]);
    const isNewComponent = typeof self[componentName] === 'undefined';
    self[componentName] = component;

    self.$el.querySelectorAll(componentName).forEach((element) => {
      component.$parent = element;
      component.$slotContent = element.innerHTML;
      component._updateSlots();

      if (isNewComponent) {
        component.$options?.emits.forEach((event) => {
          const method = element.getAttribute('v-on:' + event);
          if (typeof self[method] === 'function') {
            component.$on(event, self[method]);
          }
        });
      }
    });
  });
};

export { updateSlots, compileTemplate, parseComponents };
