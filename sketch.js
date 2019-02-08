//Luke Poulter  -  Underage_Loli//
//JS && P5.JS - 2D SURVIVAL GAME//

//GAMEPLAY
var running = 1;


//Render Options
var ww = 20; wh = 20; //World Width/Height
var bw, bh; //World Width/Length/Height;


//Block Colours //In ID Order
var bc = [[0, 255, 255, 255], [0, 175, 0, 255], [100, 100, 100, 255], [139, 69, 19, 255],
[255, 215, 0, 255], [0, 0, 0, 255], [255, 255, 255, 100], [0, 100, 255, 255], [58, 95, 11, 255]];

//TransID
var transID = [0];


//World Gen
var world = [];
var maxBlockHeight = 7; // Lower = Higher Block Spawn Height
var chunkLimit = 100;
var currentChunk = 50;


//HOTBAR
var hb = new Hotbar;
var hbs = 50;
var hbl = 9;


//PLAYER
var p;
var pspawn = [0, maxBlockHeight-1];
var range = 2;

//ENEMY
var es = [];


function setup() {
	createCanvas(801, 851);
	bw = floor(width / ww);
	bh = floor((height - hbs) / wh);

	for (i = 0; i < chunkLimit; i++) {
		world.push(new Chunk());
		//console.log("Pushed Chunk");
	}

	p = new Player(pspawn[0], pspawn[1]);
	hb.create();

	//console.log(hb.i);
	//console.log(world);
}

function draw() {
	//Game Loop
	frameRate(15);
	if (running) {
		background(0);
		if (world[currentChunk].b == 0) {world[currentChunk].create();}
		
		//WORLD//
		world[currentChunk].render();

		//PLAYER//
		p.frame();
		p.render();

		if (es[currentChunk] != null) {
			es[currentChunk].frame(); es[currentChunk].render();
			if (es[currentChunk].stats.h <= 0) {
				es[currentChunk] = null;
			}
		}	

		//HOTBAR//
		hb.render();
	}
}

function Player(x, y) {
	//POS
	this.x = x;
	this.y = y;

	//JUMP
	this.m = 0;
	this.g = 1;
	this.jmpHeight = 2
	this.jmpDelay = 0;

	//Stats
	this.stats = {
		h: 100,
		d: 25,
	}

	//FUNCTIONS
	this.render = function() {
		fill(255, 255, 150);
		stroke(0);
		rect(this.x * bw, this.y * bh, bw, bh);

		//HP
		fill(255, 0, 0);
		rect(width-10, height-30, -this.stats.h * 2, 20);
	}

	this.frame = function() {
		this.move();
		this.grav();

		if (this.stats.h <= 0) {
			gameOver();
		}
	}

	this.grav = function() {
		//console.log(this.jmpDelay);
		//console.log(world[currentChunk].blocks[this.x][this.y+1].t);
		if (world[currentChunk].blocks[this.x][this.y+1].trans == true && this.jmpDelay <= 0) {
			this.y += this.g;
			this.g += 1;
			if (this.g > 1) {
				this.g = 1;
			}

			this.fallCounter+=1;

		} else {
			if(this.jmpDelay > 0) {this.jmpDelay -= 1;}
			this.g = 0;

			if (this.fallCounter >= 6) {
				this.stats.h -= (this.fallCounter-2)*10;
				console.log("DAMAGE");
			}
			this.fallCounter = 0;
		}
	}

	this.jump = function() {
		if (world[currentChunk].blocks[this.x][this.y+1].trans != true) {
			if (world[currentChunk].blocks[this.x][this.y-1].trans == true) {
				if (world[currentChunk].blocks[this.x][this.y-2].trans == true) {
					this.y -= 2;
					if (this.y <= -1) {
						this.y = 0;
					}
					this.jmpDelay = 2;
				} else {
					this.y -= 1;
					if (this.y <= -1) {
						this.y = 0;
					}
					this.jmpDelay = 2;
				}
			}
		}
	}

	this.move = function() {
		if (this.x+this.m >= 0 && this.x+this.m < ww) {
			if (world[currentChunk].blocks[this.x+this.m][this.y].trans == true) {
				this.x += this.m;
				if (this.x < 0) {
					currentChunk -= 1;
					this.x = ww;
				}
				if (es[currentChunk] != null) {
					if (this.x == es[currentChunk].x && this.y == es[currentChunk].y) {
						console.log("COLLISION");

						p.stats.h -= 10;
						this.x -= this.m;
					}
				}
			}
		} else {
			currentChunk += this.m;
			//TEST CREATE
			if (world[currentChunk].b == 0) {world[currentChunk].create();}
			if (this.m == 1) {
				this.x = 0;
			} else if (this.m == -1) {
				this.x = ww-1;
			}
		}
	}
}

function Enemy(x, y) {
	//POS
	this.x = x;
	this.y = y;

	//JUMP
	this.m = 0;
	this.g = 1;
	this.jmpHeight = 2
	this.jmpDelay = 0;

	//Stats
	this.stats = {
		h: 100, //Percentage ONLY
	}

	//FUNCTIONS
	this.render = function() {
		fill(255, 0, 0);
		stroke(0);
		rect(this.x * bw, this.y * bh, bw, bh);

		//HP
		
		fill(255, 0, 150);
		rect(this.x*bw, this.y*bw+bw, bw, -((this.stats.h/100)*bh));
	}

	this.frame = function() {
		//this.move();
		this.grav();
	}

	this.grav = function() {
		//console.log(this.jmpDelay);
		//console.log(world[currentChunk].blocks[this.x][this.y+1].t);
		if (world[currentChunk].blocks[this.x][this.y+1].trans == true && this.jmpDelay <= 0) {
			this.y += this.g;
			this.g += 1;
			if (this.g > 1) {
				this.g = 1;
			}

			this.fallCounter+=1;

		} else {
			if(this.jmpDelay > 0) {this.jmpDelay -= 1;}
			this.g = 0;

			if (this.fallCounter >= 4) {
				this.stats.h -= (this.fallCounter-2)*10;
				console.log("DAMAGE");
			}
			this.fallCounter = 0;
		}
	}

	this.jump = function() {
		if (world[currentChunk].blocks[this.x][this.y+1].trans != true) {
			if (world[currentChunk].blocks[this.x][this.y-1].trans == true) {
				if (world[currentChunk].blocks[this.x][this.y-2].trans == true) {
					this.y -= 2;
					if (this.y <= -1) {
						this.y = 0;
					}
					this.jmpDelay = 2;
				} else {
					this.y -= 1;
					if (this.y <= -1) {
						this.y = 0;
					}
					this.jmpDelay = 2;
				}
			}
		}
	}

	this.move = function() {
		if (this.x+this.m >= 0 && this.x+this.m < ww){
			if (world[currentChunk].blocks[this.x+this.m][this.y].trans == true) {
				this.x += this.m;
				if (this.x < 0) {
					currentChunk -= 1;
					this.x = ww;
				}
			}
		} else {
			currentChunk += this.m;
			//TEST CREATEION
			if (world[currentChunk].b == 0) {world[currentChunk].create();}
			if (this.m == 1) {
				this.x = 0;
			} else if (this.m == -1) {
				this.x = ww-1;
			}
		}
	}
}

function Block(x, y, t, tr) {
	this.x = x;
	this.y = y;

	this.t = t;
	this.trans = tr;
	this.breakable = true;
	this.drops = true;

	this.render = function() {
		fill (bc[this.t][0], bc[this.t][1], bc[this.t][2], bc[this.t][3])
		if (this.t == 0) {
			if (this.y >= maxBlockHeight) {
				fill(bc[this.t][0], bc[this.t][1]-(this.y-maxBlockHeight)*10, bc[this.t][2]-(this.y-maxBlockHeight)*10, bc[this.t][3]);
			}
			stroke(0, 0);
		} else {stroke(0, 200);}
		
		rect(this.x * bw, this.y * bh, bw, bh)
	}

	this.mine = function() {
		var foundslot = false;
		if (this.t != 0 && this.breakable) {
			if (this.drops) {
				for (i = 0; i < hb.i.length; i++) {
					if (hb.i[i].t != null) {
						if (hb.i[i].t == this.t) {
							hb.i[i].a += 1;
							foundslot = true;
							break;
						}
					}
				}
				if (foundslot == false) {
					for (i = 0; i < hb.i.length; i++) {
						if (hb.i[i].t == null) {
							hb.i[i].t = this.t;
							hb.i[i].trans = this.trans;
							hb.i[i].a += 1;
							foundslot = true;
							break;
						}
					}
				}
			}
		if (foundslot == false) {console.log("UNABLE TO PICK UP");}
		//console.log("mine");
		this.t = 0;
		this.trans = true;
		}
	}

	this.place = function() {
		this.t = hb.i[hb.s].t;
		this.trans = hb.i[hb.s].trans;
		hb.i[hb.s].a -= 1;

		if (hb.i[hb.s].a == 0) {
			hb.i[hb.s].t = null;
		}
	}
}

function keyPressed() {
	if (keyCode == UP_ARROW || key == 'w') {
		p.jump();
	} 

	if (keyCode == LEFT_ARROW || key == 'a') {
		p.m = -1;
	} else if (keyCode == RIGHT_ARROW || key == 'd') {
		p.m = 1;
	}
}

function keyReleased() {
	if (((keyCode == LEFT_ARROW || key == 'a') && p.m == -1) || 
		((keyCode == RIGHT_ARROW || key == 'd') && p.m == 1)) {p.m = 0;}
}

function mousePressed() {
	//console.log(floor(mouseX/bw), floor(mouseY/bh));
	click = [floor(mouseX/bw), floor(mouseY/bh)];
	//console.log(click);
	if (click[0] >= p.x-range && click[0] <= p.x+range) {
		//console.log("NEXT TO ON X AXIS");
		if (click[1] >= p.y-range && click[1] <= p.y+range) {
			//console.log("NEXT TO PLAYER");
			if (es[currentChunk] != null) {
				if (click[0] == es[currentChunk].x && click[1] == es[currentChunk].y) {
					es[currentChunk].stats.h -= p.stats.d;
				} else if (world[currentChunk].blocks[click[0]][click[1]].t == 0 
					&& hb.i[hb.s].a >= 1 && (p.x != click[0] || p.y != click[1])) {
					world[currentChunk].blocks[click[0]][click[1]].place();
				} else {
					world[currentChunk].blocks[click[0]][click[1]].mine();
				}
			} else if (world[currentChunk].blocks[click[0]][click[1]].t == 0 
				&& hb.i[hb.s].a >= 1 && (p.x != click[0] || p.y != click[1])) {
				world[currentChunk].blocks[click[0]][click[1]].place();
			} else {
				world[currentChunk].blocks[click[0]][click[1]].mine();
			}
		}
	}

	if (click[1] == wh) {
		hb.s = click[0];
		//console.log(hb.i[hb.s].t)
	}
}

function Chunk() {
	//CHUNK
	this.blocks = [];
	this.b = 0;

	//Max Ore Gen

	this.create = function() {
		//console.log("Creating Chunk");
		for (i = 0; i < ww; i++) {
			this.blocks.push([]);
			for (j = 0; j < wh; j++) {
				if (j == maxBlockHeight || j == maxBlockHeight+1) {this.blocks[i].push(new Block(i, j, 1, false));} // Grass
				else if (j > maxBlockHeight) {this.blocks[i].push(new Block(i, j, 2, false));} // Stone
				else {this.blocks[i].push(new Block(i, j, 0, true));} // Air
			}
		}

		//Ores
		for (i = 0; i < ww; i++) {
			for (j = maxBlockHeight+2; j < wh; j++) {
				this.temp = floor(random(1, 101));
				if (this.temp >=1 && this.temp <= 10) {this.blocks[i][j] = new Block(i, j, 5, false)} // Coal
				else if (this.temp >= 11 && this.temp <= 15) {this.blocks[i][j] = new Block(i, j, 4, false);} //Gold
				else if (this.temp >= 16 && this.temp <= 17) {this.blocks[i][j] = new Block(i, j, 7, false)} //Diamond
			}
		}

		//Trees
		this.tempVar = 0;
		while (this.tempVar < ww) {
			this.temp = floor(random(1,6));
			if (this.temp == 5 && (this.tempVar != 0 && this.tempVar != ww-1)) {
				this.temp2 = floor(random(4, 7));
				for (j = 1; j < this.temp2; j++) {
					this.blocks[this.tempVar][maxBlockHeight-j] = new Block(this.tempVar, maxBlockHeight-j, 3, false);
				}

				this.blocks[this.tempVar-1][maxBlockHeight-this.temp2] = new Block(this.tempVar-1, maxBlockHeight-this.temp2, 8, false);
				this.blocks[this.tempVar][maxBlockHeight-this.temp2] = new Block(this.tempVar, maxBlockHeight-this.temp2, 8, false);
				this.blocks[this.tempVar][maxBlockHeight-this.temp2-1] = new Block(this.tempVar, maxBlockHeight-this.temp2-1, 8, false);
				this.blocks[this.tempVar+1][maxBlockHeight-this.temp2] = new Block(this.tempVar+1, maxBlockHeight-this.temp2, 8, false);
				this.tempVar++;
			} //Build Tree
			this.tempVar++;
		}

		//Random Hills
		this.tempVar = 0;
		while (this.tempVar < ww) {
			this.temp = floor(random(0,5));
			if (this.temp == 4 && (this.tempVar != 0 && this.tempVar != ww-1)) {
				this.blocks[this.tempVar][maxBlockHeight-1] = new Block(this.tempVar, maxBlockHeight-1, 1, false);
			} else if (this.temp == 0 && (this.tempVar != 0 && this.tempVar != ww-1)) {
				this.blocks[this.tempVar][maxBlockHeight-1] = new Block(this.tempVar, maxBlockHeight-1, 1, false);
				this.blocks[this.tempVar-1][maxBlockHeight-1] = new Block(this.tempVar-1, maxBlockHeight-1, 1, false);
				this.blocks[this.tempVar+1][maxBlockHeight-1] = new Block(this.tempVar+1, maxBlockHeight-1, 1, false);
				this.blocks[this.tempVar][maxBlockHeight-2] = new Block(this.tempVar, maxBlockHeight-2, 1, false);
				this.tempVar += 2;
			} else if (this.temp == 2 && (this.tempVar != 0 && this.tempVar != ww-1) &&
					this.blocks[this.tempVar][maxBlockHeight-1].t != 3) {
				this.blocks[this.tempVar][maxBlockHeight] = new Block(this.tempVar, maxBlockHeight, 0, true);
				this.blocks[this.tempVar][maxBlockHeight+2] = new Block(this.tempVar, maxBlockHeight+2, 1, false);
				this.tempVar+=2;
			}
			this.tempVar++;
		}		

		//random Hole.
		this.holes = floor(random(0, 5));
		for (i = 0; i < this.holes; i++) {
			this.tempx = floor(random(2, ww-1)); this.tempy = floor(random(maxBlockHeight+2, wh-1));
			this.blocks[this.tempx][this.tempy] = new Block(this.tempx, this.tempy, 0, true);
			while(true) {
				rdir = floor(random(0, 4));
				if (rdir == 0) {
					this.tempx -= 1;
				} else if(rdir == 1) {
					this.tempy -= 1;
				} else if (rdir == 2) {
					this.tempx += 1;
				} else if(rdir == 3) {
					this.tempy += 1;
				}
				if (this.tempx < 2 || this.tempx > ww-2) {
					break;
				} else if (this.tempy < maxBlockHeight+2 || this.tempy > wh-2) {
					break;
				} else {
					this.blocks[this.tempx][this.tempy] = new Block(this.tempx, this.tempy, 0, true);
				if (floor(random(0, 6)) == 5) {break};
				}
			}
		}

		es[currentChunk] = new Enemy(floor(random(3, ww-3)), maxBlockHeight-1);
		while(true) {
			if (world[currentChunk].blocks[es[currentChunk].x][maxBlockHeight-1].trans == false) {
				es[currentChunk] = new Enemy(floor(random(3, ww-3)), maxBlockHeight-1);
			} else {
				break;
			}
		}

		//console.log("Chunk Created");
		this.b = 1; //CHUNK BUILT
	}

	this.render = function() {
		for (i = 0; i < this.blocks.length; i++) {
			for (j = 0; j < this.blocks[i].length; j++) {
				this.blocks[i][j].render();
			}
		}
	}
}

function Hotbar() {

	this.i = [];
	this.c = 0;
	this.s = 0;
	this.create = function() {
		for (i = 0; i < hbl; i++) {
			this.i.push(new hbslot());
		}
	}
	this.render = function() {
		for (i = 0; i < hbl; i++) {
			if (this.i[i].t == null) {
				fill(0);
				stroke(255);
			} else {
				fill(bc[this.i[i].t][0], bc[this.i[i].t][1], bc[this.i[i].t][2], bc[this.i[i].t][3]);
				stroke(0, 255, 0);
			}
			rect(i * bw, height-hbs-1, bw, bh);
			//console.log(this.i)
			//console.log(bc[this.i[i]][0], bc[this.i[i]][1], bc[this.i[i]][2]);
			//console.log(this.i[i])
		}
		//SELECTED
		if (this.s >= hbl) {this.s = 0;}
		noFill();
		strokeWeight(3);
		stroke(255, 0, 0);
		rect(this.s * bw, height-hbs-1, bw, bh);
		stroke(255);
		strokeWeight(1);
		//rect(width-bw, height-hbs-1, bw, bh);
	}
}

function hbslot() {
	this.t = null;
	this.trans = null;
	this.a = 0;
}

function gameOver() {
	running = false;
	fill(0);
	rect(0, 0, width, height);

	textAlign(CENTER); textSize(32); fill(255);
	text("Game Over", width/2, height/2);
}

//Cheats:
function give(id) {
	var foundslot = false;
	for (i = 0; i < hb.i.length; i++) {
		if (hb.i[i].t != null) {
			if (hb.i[i].t == id) {
				hb.i[i].a += 64;
				foundslot = true;
				break;
			}
		}
	}
	if (foundslot == false) {
		for (i = 0; i < hb.i.length; i++) {
			if (hb.i[i].t == null) {
				hb.i[i].t = this.t;
				hb.i[i].trans = this.trans;
				hb.i[i].a += 1;
				foundslot = true;
				break;
			}
		}
	}
} // Connot Be Activated Yet

//Luke Poulter  -  Underage_Loli//
//JS && P5.JS - 2D SURVIVAL GAME//