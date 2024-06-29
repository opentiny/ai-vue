import { getCurrentInstance } from './instance.js';

const onBeforeMount = (callback) => (getCurrentInstance().$options.beforeMount = callback);
const onMounted = (callback) => (getCurrentInstance().$options.mounted = callback);
const onBeforeUpdate = (callback) => (getCurrentInstance().$options.beforeUpdate = callback);
const onUpdated = (callback) => (getCurrentInstance().$options.updated = callback);

export { onBeforeMount, onMounted, onBeforeUpdate, onUpdated };
