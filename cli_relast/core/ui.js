/*jshint esversion: 8*/
const Math = require('./math');
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
        let _Scroll = new Math.Vector2D(0, 0);
        let _opened = false;
        let _padding = null;
        let _margin = null;
        let _rect = null;

        let toggle = (value) =>
        {
            this._opened = value;
        }
;
        let resize = (w, h) =>
        {
            let new_w = w * 100 / UI.cols;
            let new_h = h * 100 / UI.rows;
            let new_x = (UI.cols / 2) - (new_w / 2);
            let new_y = (UI.rows / 2) - (new_h / 2);

            _rect = new Math.Rect2D(new_x, new_y, new_w, new_h);

            console.log(_rect);
            _padding = new Math.Rect2D(
                _rect._x + _padding_offset, 
                _rect._y + _padding_offset, 
                _rect._w - _padding_offset, 
                _rect._h - 1
            );

            _margin = new Math.Rect2D(
                _rect._x - _margin_offset, 
                _rect._y - _margin_offset, 
                _rect._w + _margin_offset, 
                _rect._h + _margin_offset
            );
        }

        const _public =
            {
                toggle: toggle,
                resize: resize
            }

        _public.resize(_w, _h);
        return _public;
    },
    Modal: function(props, content)
    {
        let _padding_offset = props.padding || 1;
        let _margin_offset = props.margin || 1;
        let _zindex = props.zindex || 100;
        let _border = props.border || 1;
        let _w = props.w || 90;
        let _h = props.h || 90;
        let _rect = this.resize(this._w, this._h);
        let _content = content;
        let _Scroll = new Math.vector2D(0, 0);
        let _opened = false;
        let _padding = null;
        let _margin = null;

        let toggle = (value) =>
        {
            this._opened = value;
        }

        this.resize = (w, h) =>
        {
            let new_w = w * 100 / UI.cols;
            let new_h = h * 100 / UI.rows;
            let new_x = (UI.cols / 2) - (new_w / 2);
            let new_y = (UI.rows / 2) - (new_h / 2);

            _padding = new Math.Rect2D(
                _rect._x + _padding_offset, 
                _rect._y + _padding_offset, 
                _rect._w - _padding_offset, 
                _rect._h - 1
            );

            _margin = new Math.Rect2D(
                _rect._x - _margin_offset, 
                _rect._y - _margin_offset, 
                _rect._w + _margin_offset, 
                _rect._h + _margin_offset
            );

            return new Math.Rect2D(new_x, new_y, new_w, new_h);
        }
    }
};

UI.WINDOW =
{
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
        BOTTOM: [" ", "─", "═", "▄", "▒", "░"],
        CORNER_TOP_LEFT: [" ", "┌", "╔", "▄", "▒", "░"],
        CORNER_TOP_RIGHT: [" ", "┐", "╗", "▄", "▒", "░"],
        CORNER_BOTTOM_LEFT: [" ", "└", "╚", "▄", "▒", "░"],
        CORNER_BOTTOM_RIGHT: [" ", "┘", "╝", "▄", "▒", "░"]
    }
}

module.exports = UI;

