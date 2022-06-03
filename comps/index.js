const { Comp } = require('../cli_relast/comp.js');

class Nav_Path extends Comp
{
	constructor(props)
	{
		super(props);
	}

	draw = () =>
	{
		return `reougreiugbe`;
	}
}

module.exports =
{
	Nav_Path: Nav_Path
};