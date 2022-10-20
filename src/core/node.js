const { Render } = require('../flow/output.js');
const Base = require('./base.js');

class Node extends Base {
	_parent = null;
	_childs = [];
	_render = null;
	_rect = { x: 0, y: 0, w: 0, h: 0 };
	constructor(props) {
		super(props);
		this._render = new Render();
	}
	set_parent = (parent) => {
		if (typeof parent === 'undefined') return;
		this._parent = parent;
	}
	add_child = (child) => {
		if (typeof child === 'undefined') return;
		this._childs.push(child);
	}
	child_by_name = (name) => {
		if (typeof name !== 'string') return undefined;
		for (let c of this._childs)
			if (c._name === name) return c
		return undefined;
	}
}

module.exports = Node;
