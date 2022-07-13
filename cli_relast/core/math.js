/*jshint esversion: 8*/

const Math2D =
{
    Vector2D: function(x, y)
    {
        this._x = x;
        this._y = y;
    },
    Rect2D: function(x, y, w, h)
    {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        this.top = () => { return this._y; }
        this.bottom = () => { return this._y + this._h; }
        this.left = () => { return this._x; }
        this.right = () => { return this._x + this._w; }
    }
};

module.exports = Math2D;
