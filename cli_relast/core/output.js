/*jshint esversion:8*/

const {Style} = require('./color');

module.exports.Print =
{
    cols: process.stdout.columns,
    _debug: false,
    _debugger: [],
    log: (txt) =>
    {
        if(!this.Print._debug) return;
        if(!this.Print._debugger)
            this.Print._debugger = [];
        this.Print._debugger.push(txt);
    },
    print_logged: () =>
    {
        if(!this.Print._debug) return;
        if(!this.Print._debugger) return;
        for(let l of this.Print._debugger)
            console.log(l);
    },
    clear: () =>
    {
        console.clear();
    },
    print_cols: (bg = Style.BgCyan) =>
    {
        let str = ``;
        for(let c = 0; c < this.Print.cols; c++)
            str += ` `;

        return `${  bg  }${ str }${ Style.Reset }`;
    },
    title: (txt, print=true) =>
    {
        let max_length = Math.min(txt.length, this.Print.cols - 10);
        let line = this.Print.print_cols(Style.BgCyan);
        let title = ``;
        let middle = Math.floor(this.Print.cols / 2 - max_length / 2);

        for(let c = 0; c < this.Print.cols; c++)
        {
            if(c > middle - 1 && c < max_length + middle)
                title += txt[c - middle];
            else
                title += ` `;
        }
        title = `${ Style.BgCyan }${ Style.FgBlack }${ title }${ Style.FgBlack }${ Style.Reset }`;
        let toprint = `${ Style.BgCyan }\n${ line }${ title }\n${ line }${ Style.Reset }`;
        if(!print) return toprint;
        console.log(toprint);
    },
    subtitle: (txt, print=true) =>
    {
        let pre = `${ Style.BgBlue }  ${ Style.FgCyan }冷 ${ Style.BgCyan }${ Style.FgBlue }`;

        title = `${ this.Print.end_of_line() }${pre} ${ Style.FgBlack }${ txt }${ Style.FgBlack }  ${ Style.Reset }${ Style.FgCyan }${ Style.Reset }${ this.Print.end_of_line() }`;
        if(!print) return title;
        console.log(title);
    },
    label: (txt) =>
    {
        let comps_match = txt.match(/\[\comp:[a-z|A-Z|0-9]+\]/g);
        console.log(txt);
    },
    end_of_line: () =>
    {
        return '%EOL%';
    },
    buttons: (btns) =>
    {
        console.log(btns);
    }
}
