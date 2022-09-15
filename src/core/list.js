const Node = require('../core/node.js');

class List extends Node {
	_buffer = [];
	constructor(props) { super(props); }
	check_buffer = () => {
		if (typeof this._buffer === 'undefined')
			this._buffer = [];
	}
	add = (item) => {
		this.check_buffer();
		this._buffer.push(item);
	}
}

module.exports = List;
