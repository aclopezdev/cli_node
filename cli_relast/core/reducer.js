/*jshint esversion: 8*/

const Reducer =
{
	_buffer: [],
	new_reducer: function(comp_name, state, action)
	{
		if(typeof comp_name !== 'string' || typeof state !== 'string' || typeof action !== 'function') return;
		if(!this._buffer[`${ comp_name }`])
			this._buffer[`${ comp_name }`] = [];
		if(!this._buffer[`${ comp_name }`][`${ state }`])
			this._buffer[`${ comp_name }`][`${ state }`] = action;
	},
    add: function(comp_name, state, action) 
    {
        if(typeof comp_name === 'undefined' || typeof state === 'undefined') return;
        this.new_reducer(comp_name, state, action);
    },
    call: function(comp_name, state, args = {})
    {
        if(typeof comp_name === 'undefined' || typeof state === 'undefined') return;
        if(typeof this._buffer[`${ comp_name }`] === 'undefined') return;
        if(typeof this._buffer[`${ comp_name }`][`${ state }`] === 'undefined' || typeof this._buffer[`${ comp_name }`][`${ state }`] !== 'function') return;
        return this._buffer[`${ comp_name }`][`${ state }`]( args );
    }
};

module.exports = Reducer;
