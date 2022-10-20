class Base {
	_name = ``;
	_id = ``;
	_props = {};
	constructor(props) {
		this._id = props.id || parseInt(Math.random() * Date.now());
		this._name = props.name || `element_${this._id}`;
		this.set_props(props);
	}
	set_props = (props) => {
		for (let p in props)
			if (p !== `id` && p !== `name`)
				this._props[p] = props[p];
	}
}

module.exports = Base;
