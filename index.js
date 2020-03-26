const yaml = require('js-yaml');
const fs = require('fs');
const math = require('mathjs');
const color = require('colors')

try {
    global.config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))
}
catch (err) {
    console.log(err);
    throw new Error("Couldn't load the Config...", err);
}

var grid = math.matrix();
grid.resize([config.size.height, config.size.width]);
var newGrid = math.matrix();
newGrid.resize([config.size.height, config.size.width]);

//TESTING IF CUSTOM FILE SHOULD BE USED
if (config.custom.enabled) {

} else {
    grid.forEach((value, index, matrix) => {
        var chance = Math.floor(Math.random() * 101);
        if (chance <= config.custom.chance) {
            grid[index] = 2;
        } else {
            grid[index] = 0;
        }
    })
}

fs.writeFile('log.txt', '\n',()=>{});
const log = fs.createWriteStream('log.txt', 'utf8');

var iteration = 0;
var display = config.display;
var consoleOut = "";

function cycle() {
    var livingCells = 0;
    var consoleOut = "";
    iteration++;


    consoleOut += `Iteration: ${iteration}\n\r`.blue;
    var line = ""
    for (var i=0; i < config.size.width; i++) {
        line+= '-';
    }
    log.write(`Iteration: ${iteration}\n${line}\n`);
    
    for (var h=0; h<grid.size()[0]; h++) {
        for (var w=0; w<grid.size()[1]; w++) {
            //console.log(grid[[h,w]], grid.size(), h, w);
            var out;

            if (grid[[h,w]] == 0 && Math.random() <= config.custom.outbreaks.chance && config.custom.outbreaks.enabled) {
                grid[[h,w]] = 2;
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h-1,w-1]] != undefined) {
                        grid[[h-1,w-1]] = 2; 
                        newGrid[[h-1,w-1]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h-1,w]] != undefined) {
                        grid[[h-1,w]] = 2; 
                        newGrid[[h-1,w]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h-1,w+1]] != undefined) {
                        grid[[h-1,w+1]] = 2; 
                        newGrid[[h-1,w+1]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h,w-1]] != undefined) {
                        grid[[h,w-1]] = 2; 
                        newGrid[[h,w-1]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h,w+1]] != undefined) {
                        grid[[h,w+1]] = 2; 
                        newGrid[[h,w+1]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h+1,w-1]] != undefined) {
                        grid[[h+1,w-1]] = 2; 
                        newGrid[[h+1,w-1]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h+1,w]] != undefined) {
                        grid[[h+1,w]] = 2; 
                        newGrid[[h+1,w]] = 2;
                    }
                }
                if (Math.random() <= config.custom.outbreaks.neighbourChance) {
                    if (grid[[h+1,w+1]] != undefined) {
                        grid[[h+1,w+1]] = 2; 
                        newGrid[[h+1,w+1]] = 2;
                    }
                }
            }
            
            var livingAround = 0;
            if (grid[[h-1,w-1]] != undefined && grid[[h-1,w-1]] >= 1) livingAround++;
            if (grid[[h-1,w]] != undefined && grid[[h-1,w]] >= 1) livingAround++;
            if (grid[[h-1,w+1]] != undefined && grid[[h-1,w+1]] >= 1) livingAround++;
            if (grid[[h,w-1]] != undefined && grid[[h,w-1]] >= 1) livingAround++;
            if (grid[[h,w+1]] != undefined && grid[[h,w+1]] >= 1) livingAround++;
            if (grid[[h+1,w-1]] != undefined && grid[[h+1,w-1]] >= 1) livingAround++;
            if (grid[[h+1,w]] != undefined && grid[[h+1,w]] == 1) livingAround++;
            if (grid[[h+1,w+1]] != undefined && grid[[h+1,w+1]] >= 1) livingAround++;

            if (grid[[h,w]] == -1) {
                newGrid[[h,w]] = 0;
            }
            if (livingAround < 2 && grid[[h,w]] >= 1) {
                newGrid[[h,w]] = -1;
            }
            if (livingAround >= 2 && livingAround <= 3 && grid[[h,w]] >= 1) {
                newGrid[[h,w]] = 1;
            }
            if (livingAround == 3 && grid[[h,w]] == 0) {
                newGrid[[h,w]] = 2;
            }
            if (livingAround > 3 && grid[[h,w]] >= 1) {
                newGrid[[h,w]] = -1;
            }
            
            

            //SPREAD
            if (grid[[h,w]] == 2) {
                //STYLE CHECK
                if (display.ascii.enabled) {
                    if (display.ascii.color) {
                        if (display.showSpread) {
                            out = config.symbols.spread.toString().green;
                        } else {
                            out = config.symbols.living.toString();
                        }
                    } else {
                        if (display.showSpread) {
                            out = config.symbols.spread.toString();
                        } else {
                            out = config.symbols.living.toString();
                        }
                    }
                } else {
                    if (display.showSpread) {
                        out = ' '.bgGreen;
                    } else {
                        out = ' '.bgYellow;
                    }
                }
                if (!display.ascii.enabled) consoleOut +=out;
                consoleOut +=out;
                if (config.logging) log.write(config.symbols.spread.toString());
                livingCells++;
            }

            //LIVING
            if (grid[[h,w]] == 1) {
                //STYLE CHECK
                if (display.ascii.enabled) {
                    if (display.ascii.color) {
                        out = config.symbols.living.toString().white;
                    } else {
                        out = config.symbols.living.toString();
                    }
                } else {
                    out = ' '.bgYellow;
                }
                if (!display.ascii.enabled) consoleOut +=out;
                consoleOut +=out;
                if (config.logging) log.write(config.symbols.living.toString());
                livingCells++;
            }

            //NOTHING
            if (grid[[h,w]] == 0) {
                //STYLE CHECK
                if (display.ascii.enabled) {
                    if (display.ascii.color) {
                        out = config.symbols.nothing.toString().white;
                    } else {
                        out = config.symbols.nothing.toString();
                    }
                } else {
                    if (display.standardBackground) {
                        out = config.symbols.nothing.toString().black;
                    } else {
                        out = config.symbols.nothing.toString().grey;
                    }
                }
                if (!display.ascii.enabled) consoleOut +=out;
                consoleOut +=out;
                if (config.logging) log.write(config.symbols.nothing.toString());
            }

            //DIED
            if (grid[[h,w]] == -1) {
                if (display.ascii.enabled) {
                    if (display.ascii.color) {
                        if (display.showLoss) {
                            out = config.symbols.loss.toString().red;
                        } else {
                            out = config.symbols.nothing.toString();
                        }
                    } else {
                        if (display.showLoss) {
                            out = config.symbols.loss.toString();
                        } else {
                            out = config.symbols.nothing.toString();
                        }
                    }
                } else {
                    if (display.showLoss) {
                        out = ' '.bgRed;
                    } else {
                        if (display.standardBackground) {
                            out = ' '.bgBlack;
                        } else {
                            out = ' '.bgGrey;
                        }
                    }
                }
                if (!display.ascii.enabled) consoleOut +=out;
                consoleOut +=out;
                if (config.logging) log.write('-');
            }
        }
        consoleOut +='\x1b[0m\n\r';
        log.write('\n');
    }
    var compare = 0;
    newGrid.forEach((value, index) => {
        var a = grid[index];
        var b = newGrid[index];
        
        if (a == b) compare++;
        if (newGrid[index] != undefined) {
            grid[index] = newGrid[index];
        } else {
            grid[index] = 0;
            newGrid[index] = 0;
        }
    }, false)
    consoleOut +=`Living Cells: ${livingCells.toString().yellow} | ${compare.toString().yellow} Fields Stayed the same\r`.blue;
    console.clear();
    console.log(consoleOut);
    log.write(`${line}\nLiving Cells: ${livingCells}\n${line}\n\n`);
    if (livingCells === 0 || (compare == config.size.height * config.size.width && config.quitOnIdle)) {
        process.exit();
    }
}

var intvID = setInterval(cycle, config.delay);