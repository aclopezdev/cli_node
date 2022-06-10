/*jshint esversion: 8*/

module.Reducer =
{
	_buffer: [],
	new: function(comp_name, state)
	{
		if(typeof comp_name !== 'string' || typeof k !== 'string' || !v) return;
		if(!this._buffer[`${ comp_name }`])
			this._buffer[`${ comp_name }`] = [];
		if(!this._buffer[`${ comp_name }`][`${ state }`])
			this._buffer[`${ comp_name }`][`${ state }`] = [];
	},
	add: function(comp_name, state, triggers)
	{
		this.new(comp_name, state);
		if(Array.isArray( triggers ))
		{

		}
		this._buffer[`${ comp_name }`][`${ state }`].push( trigger );
	},
	call: function(comp_name, state, args)
	{

	}
};