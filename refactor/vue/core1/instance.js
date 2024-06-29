let instance = null;

const getCurrentInstance = () => instance;

const setCurrentInstance = (value) => (instance = value);

export { getCurrentInstance, setCurrentInstance };
