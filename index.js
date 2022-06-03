/*jshint esversion:8*/

const {Relast, Comp, Controls } = require('./cli_relast/index');
const { Nav_Path } = require('./comps/index');

class App extends Comp
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`Navigation`, Nav_Path, {title: 'Navigation'});
    }
    states = () =>
    {
        this.state(`main_pointer`, 0);
        this.state(`key`, '');
    }
    actions = () =>
    {
        this.action(`key_input`, (key) =>
        {
            this.state(`key`, key);
        });
    }
    nav = (data) =>
    {
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
    }
    draw = () =>
    {
        return `Hello Key: ${ this.state(`key`) } - Pointer: ${ this.state(`main_pointer`) } [comp:Navigation]`;
    }
}


Relast.run({
    name: 'Testing 1',
    title: 'Testing 1'
}, App);



/*
const readline = require('readline');
const stdin = process.stdin;
const stdout = process.stdout;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');


const textColor = 
{
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m"
};





let track = 0;
let options = [
	`option 1`,
	`option 2`,
	`option 3`,
	`option 4`,
	`option 5`
];


const clear = () =>
{
	console.clear();
};

const print_options = () =>
{
    let str_buffer = `Select an option:\n`;
    for(let o in options)
    {
    	let fore_color = `${parseInt(o) !== track ? TextColor.Reset : TextColor.FgGreen}`;
    	str_buffer += `${fore_color}-${parseInt(o) === track ? ` >>>` : ``} ${options[o]}\n`;
    }
    console.log(str_buffer);
    // rl.write(str_buffer);
};

stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        // stdout.write('up');
        track--;
    }else if (key == '\u001B\u005B\u0043') {
        // stdout.write('right'); 
    }else if (key == '\u001B\u005B\u0042') {
        // stdout.write('down'); 
        track++;
    }else if (key == '\u001B\u005B\u0044') {
        // stdout.write('left'); 
    }

    track = Math.min(Math.max(0, track), options.length - 1);
    clear();
    print_options();

    // if (key == '\u0003') { process.exit(); }    // ctrl-c
    if (key == '\u001B') { process.exit(); }    // esc
});
print_options();
*/
