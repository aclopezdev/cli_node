const Node = require('../core/node.js');

class Table extends Node {
	_buffer = [];
	constructor(props) { super(props); }
	check_buffer = () => {
		if (typeof this._buffer === 'undefined')
			this._buffer = [];
	}
	add = (k, item) => {
		if (typeof k !== 'string') return;
		this.check_buffer();
		this._buffer[k] = item;
	}
	find = (k) => {
		if (typeof this._buffer === 'undefined') return undefined;
		return this._buffer[k];
	}
}

module.exports = Table;
