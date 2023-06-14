var HelloComponent = {
  emits: ['greet'],
  setup: function(props, context) {
    const state = reactive({
      firstName: 'John',
      lastName: 'Doe'
    });

    const fullName = computed(function() {
      return state.firstName + ' ' + state.lastName;
    });

    onUpdated(function() {
      context.emit('greet', state.firstName);
    });

    return {
      state,
      fullName
    }
  },
  template: `
    <div>
      <h1>{{ fullName }}</h1>
      <slot></slot>
    </div>
  `
};

var app = new Vue({
  el: '#app',
  components: {
    HelloComponent
  },
  setup: function(props, context) {
    const state = reactive({
      message: 'Hello, Vue!',
      inputValue: 'ChatGPT'
    });

    watch(function() {
      return state.message;
    }, function(newValue, oldValue) {
      console.log('Message changed:', oldValue, ' -> ', newValue);
    });

    watch(function() {
      return state.inputValue;
    }, function(newValue, oldValue) {
      console.log('InputValue changed:', oldValue, ' -> ', newValue);
    });

    const greetMessage = function(message) {
      context.emit('greet', message);
    }

    const updateMessage = function(newMessage) {
      state.message = newMessage;
    }

    onBeforeUnmount(function() {
      console.log('beforeMount hook');
    });

    onMounted(function() {
      console.log('mounted hook');
    });

    onBeforeUpdate(function() {
      console.log('beforeUpdate hook');
    });

    onUpdated(function() {
      console.log('updated hook');
    });

    return {
      state,
      greetMessage,
      updateMessage
    }
  },
  template: `
    <div>
      <HelloComponent v-on:greet="greetMessage">
        <p>{{ message }}</p>
      </HelloComponent>
      <input v-model="inputValue" type="text">
      <p v-text="inputValue"></p>
    </div>
  `
});

app.$on('greet', function(message) {
  console.log('Greet:', message);
});

app.state.inputValue = 'OpenAI'
app.HelloComponent.state.firstName = 'Tom';
app.updateMessage('Hello, World!');
