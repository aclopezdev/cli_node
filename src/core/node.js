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
	set_rect = ({ x, y, w, h }) => {
		this._rect.x = x || this._rect.x;
		this._rect.y = y || this._rect.y;
		this._rect.w = w || this._rect.w;
		this._rect.h = h || this._rect.h;
	}
}

module.exports = Node;
