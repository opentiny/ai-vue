const render = function () {
  this._compileTemplate();
};

const mount = async function () {
  this._render();
};

export { render, mount };
