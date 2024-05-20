import { getCurrentInstance } from './instance.js';

const onBeforeUnmount = (callback) => (getCurrentInstance().$options.beforeMount = callback);
const onMounted = (callback) => (getCurrentInstance().$options.mounted = callback);
const onBeforeUpdate = (callback) => (getCurrentInstance().$options.beforeUpdate = callback);
const onUpdated = (callback) => (getCurrentInstance().$options.updated = callback);

export { onBeforeUnmount, onMounted, onBeforeUpdate, onUpdated };
