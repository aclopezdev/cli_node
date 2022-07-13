/*jshint esversion: 8*/
const Math2D = require('./math');
const Screen = require('./screen');

const UI =
{
    Window: function(props)
    {
        let _padding_offset = props.padding || 0;
        let _margin_offset = props.margin || 1;
        let _zindex = props.zindex || 50;
        let _border = props.border || 1;
        let _w = props.w || Screen._cols;
        let _h = props.h || Screen._rows;
        let _Scroll = new Math2D.Vector2D(0, 0);
        let _padding = null;
        let _rect = null;

        let toggle = (value) =>
        {
            this._opened = value;
        }

        let resize = (w, h) =>
        {
            let new_w = Math.floor(w);
            let new_h = Math.floor(h);
            let new_x = Math.floor(props.x);
            let new_y = Math.floor(props.y);

            _rect = new Math2D.Rect2D(new_x, new_y, new_w, new_h);

            _padding = new Math2D.Rect2D(
                _rect._x + _padding_offset, 
                _rect._y + _padding_offset, 
                _rect._w - _padding_offset, 
                _rect._h - 1
            );
        }

        const _public =
            {
                get_border: () => { return _border; },
                toggle: toggle,
                resize: resize,
                get_size: () => { return _rect; },
                get_zindex: () => { return _zindex; }
            }

        _public.resize(_w, _h);
        return _public;
    },
    Modal: function(props)
    {
        let _padding_offset = props.padding || 1;
        let _zindex = props.zindex || 100;
        let _border = props.border || 1;
        let _w = props.w || 90;
        let _h = props.h || 90;
        let _rect = null;
        let _Scroll = new Math2D.Vector2D(0, 0);
        let _opened = false;
        let _padding = null;

        let toggle = (value) =>
        {
            this._opened = value;
        }

        let resize = (w, h) =>
        {
            let new_w = w * Screen._cols / 100;
            let new_h = h * Screen._rows / 100;
            let new_x = props.x || (Screen._cols / 2) - (new_w / 2);
            let new_y = props.y || (Screen._rows / 2) - (new_h / 2);

            _rect = new Math2D.Rect2D(new_x, new_y, new_w, new_h);
            console.log(_rect);
            console.log(_rect.top(), _rect.left(), _rect.right(), _rect.bottom());

            _padding = new Math2D.Rect2D(
                _rect._x + _padding_offset, 
                _rect._y + _padding_offset, 
                _rect._w - _padding_offset, 
                _rect._h - 1
            );
        }

        let _public =
            {
                get_border: () => { return _border; },
                resize: resize,
                toggle: toggle,
                get_size: () => { return _rect; },
                get_zindex: () => { return _zindex; }
            }

        _public.resize(_w, _h);

        return _public;
    }
};

UI.WINDOW =
{
    PANEL: 0,
    MODAL: 1,
    BORDERS_TYPE:{
        NONE: 0,
        LINE: 1,
        DOUBLE: 2,
        SOLID: 3,
        OPAQUE: 4,
        DOTTED: 5
    },
    BORDERS: {
        LEFT: [" ", "│", "║", "█", "▒", "░"],
        RIGHT: [" ", "│", "║", "█", "▒", "░"],
        TOP: [" ", "─", "═", "▄", "▒", "░"],
        BOTTOM: [" ", "─", "═", "▀", "▒", "░"],
        CORNER_TOP_LEFT: [" ", "┌", "╔", "▄", "▒", "░"],
        CORNER_TOP_RIGHT: [" ", "┐", "╗", "▄", "▒", "░"],
        CORNER_BOTTOM_LEFT: [" ", "└", "╚", "▀", "▒", "░"],
        CORNER_BOTTOM_RIGHT: [" ", "┘", "╝", "▀", "▒", "░"]
    }
}

module.exports = UI;

