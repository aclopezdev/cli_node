const { Comp } = require('../cli_relast/comp.js');

function bread_crumb(txt, item)
{
	let _txt = txt;
	let _item = item;

	let _public =
	{
		label: _txt,
		item: _item
	};

	return _public;
};

class Nav_Path extends Comp
{
	_buffer = [];

	constructor(props)
	{
		super(props);
	}

	add_crumb = (txt, item) =>
	{
		if(!txt || !item) return;
		this._buffer.push(new bread_crumb(txt, item));
	}

	draw = () =>
	{
		return ``;
	}
}

class Body extends Comp
{
	_buffer = [];

	constructor(props)
	{
		super(props);
	}

	states = () =>
	{
		this.state(`head`, ``);
	}

	actions = () =>
	{
		this.action(`add`, data =>
		{
			if(!data) return;
			if(!data.name || !data.item) return;
			this._buffer[data.name] = data.item;		
		});

		this.action(`change`, data =>
		{
			if(!data) return;
			if(!data.name) return;
			this.state(`head`, data.name);
		});
	}

	draw = () =>
	{
		let head = this.state(`head`);
		let item = this._buffer[ head ] || { draw: () => { return `404`; } };
		return `${ item.draw() }`;
	}
}

module.exports =
{
	Nav_Path: Nav_Path,
	Body: Body
};