class Base {
	_name = ``;
	_id = ``;
	constructor({ id, name }) {
		this._id = id || parseInt(Math.random() * Date.now());
		this._name = name || `element_${this._id}`;
	}
}

module.exports = Base;
