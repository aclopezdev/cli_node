/*jshint esversion:8*/

const gossipy =
{
    _gossips: [],
    get_gossips: function() {   return this._gossips;   },
    add_gossip: function(type=-1, args={})
    {
        this._gossips.push({type: type, args: args});
    },
    liberate_gossips: function(type=-1)
    {
        let buffer = [];
        for(let g of this._gossips)
        {
            if(g.type === type) continue;
            buffer.push(g);
        }
        this._gossips = buffer;
    }
};
gossipy.GOSSIP =
{
    NONE: -1,
    STATE_CHANGE: 0,
    INSERT_TXT: 1
};

module.exports =
{
    Gossipy: gossipy
}
