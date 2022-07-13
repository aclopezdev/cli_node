/*jshint esversion: 8*/

const Screen = require('./screen');
const Math2D = require("./math");
const UI = require('./ui');

const Rendering =
{
    _buffering: [],
    _panels: [],
    _modals: [],
    add_panel: function(comp)
    {
        this._panels.push(comp);
    },
    add_modal: function(comp)
    {
        this._modals.push(comp);
    },
    rendering: function()
    {
        /*
        let nearest = null;
        for(let p of this._panels)
        {
            let window = p.get_window(); 
            let zindex = window.get_zindex();
            let rect = window.get_size();
            let p1 = new Math.Vector2D(rect._x, rect._y);
            let p2 = new Math.Vector2D(rect._w, rect._h);

            const aux = nearest || { get_zindex: () => { return 0; } };
            if(zindex >= aux.get_zindex())
                nearest = window;
        }
        console.log(nearest);
        */
        console.log(1111, this._modals[0].get_window());

        
        for(let x = 0; x < Screen._cols; x++)
        {
            let cols = [];
            for(let y = 0; y < Screen._rows; y++)
            {
                cols.push(` `);
            }
            this._buffering.push(cols);
        }

        for(let p of this._panels)
        {
            let window = p.get_window();
            let border = window.get_border();
            let rect = window.get_size();

            this._buffering[rect._x][rect._y] = UI.WINDOW.BORDERS.CORNER_TOP_LEFT[border];
            this._buffering[rect._x][rect._h - 1] = UI.WINDOW.BORDERS.CORNER_BOTTOM_LEFT[border];
            this._buffering[rect._w - 1][rect._y] = UI.WINDOW.BORDERS.CORNER_TOP_RIGHT[border];
            this._buffering[rect._w - 1][rect._h - 1] = UI.WINDOW.BORDERS.CORNER_BOTTOM_RIGHT[border];

            for(let x = rect._x + 1; x < rect._w - 1; x++)
            {
                this._buffering[x][rect._y] = UI.WINDOW.BORDERS.TOP[border];
                this._buffering[x][rect._h - 1] = UI.WINDOW.BORDERS.BOTTOM[border];
            }
            for(let y = rect._y + 1; y < rect._h - 1; y++)
            {
                this._buffering[rect._x][y] = UI.WINDOW.BORDERS.LEFT[border];
                this._buffering[rect._w - 1][y] = UI.WINDOW.BORDERS.RIGHT[border];
            }
        }

        for(let y = 0; y < Screen._rows; y++)
        {
            for(let x = 0; x < Screen._cols; x++)
            {
                //process.stdout.write(this._buffering[x][y]);
            }
        }
    }
};

module.exports = Rendering;
