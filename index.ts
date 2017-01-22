let Colors = {
	Back: "#000",//#FFF
	Border: "#222",//#757575
	UI: "#777",
	Beam: "#F00",
	Text: "#CCC",
	Node: ["#333", "#242", "#422"],
	Filter: "#5F2",
	Shooter: "#888",
	Dropper: "#555",
	Shot: "#CCC",
	ShadowX: 0,
	ShadowY: 3,
	ShadowR: 5
}
let Settings = {
	BackDrawer: {
		Background: Colors.Back,
		Border: Colors.Border,
		TextColor: Colors.UI,
		MarginLeft: 0.5,
		MarginRight: 0.5
	},
	Dropper: {
		MoveSpeed: 3,// cellWidth/second
		TurnProbability: 0.4,// 線を超えるごとに
		DropProbability: 0.2,// 線を超えるごとに
		Color: Colors.Dropper
	},
	Shotter: {
		Beam: {
			BlinkSpeed: 100,// tick/count
			Color: Colors.Beam
		},
		Y: 28, //cellHeight
		MoveSpeed: 0.5,//cellWidth/tick
		Color: Colors.Shooter,
		Keymap: [37, 39, 38, 72],//Left Right Shot Help
		KeySleepMax1: [9, 9, 9, Infinity],
		KeySleepMax2: [6, 6, 3, Infinity]
	},
	Shots: {
		Radius: 0.2,
		Color: Colors.Shot,
		MoveSpeed: 0.3//cellHeight/tick
	},
	NumNodes: {
		LevelToMaxWeighting: 7,//Level/MaxNumber
		Colors: Colors.Node,//Default PrimeNumber CompositeNumber
		MaxFactCount: 6,
		MoveSpeed: 0.01,//cellHeight/tick
		TextColor: Colors.Text,
	},
	Filters: {
		Color: Colors.Filter,
	},
	ButtonNodes: {
		Color: Colors.Node[0],
		TextColor: Colors.Text
	},
	Fading: {
		Speed: 100,//count/tick
		Color: Colors.Back
	},
	onTick: {
		HintperLevel: 13,
		FilterperLevel: 97,
	},
	Game: {
		Wcount: 9,//CellWidth+BorderWidth
		Hcount: 32,//Dropper:1 Nodes:27 Shooter:1 Margin:1 UI:2 => sum:32
		Wcell: 34,
		Hcell: 20,
		Rcell: 5,
		FontName: "monospace",
		life: 20,
	},
	ResizingCanvas: {
		Margin: 10,
		shadowBlur: Colors.ShadowR,
		shadowColor: "#000",
		shadowOffsetX: Colors.ShadowX,
		shadowOffsetY: Colors.ShadowY
	},
	ScoreAndLevel: (Type: number, Num: number) => {
		let IsPrime = Factorization(Num)[0] == 0;
		switch (Type) {
			case 0://Filter
				Game.score += 7 * Num;
				Game.level += 7;
				break;
			case 1://Fall
				if (IsPrime) {
					Game.score += 11 * Num;
					Game.level += 11;
				} else {
					Game.score -= 17 * Num;
					Game.level -= 17;
					Game.life--;
				}
				break;
			case 2://Shots
				if (IsPrime) {
					Game.score -= 31 * Num;
					Game.level -= 31;
					Game.life -= 3;
				} else {
					Game.score += Num;
					Game.level++;
				}
				break;
		}
	}
}
namespace Polyfill {
	export function Do() {
		let timer: number = undefined;
		let polyfill = function (callback: any): any {
			if (typeof timer == "number") clearTimeout(timer);
			timer = setTimeout(callback, 1000 / 60);
		};
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || polyfill;
	}
}
function GetTime(): number {
	var now = window.performance && performance.now;
	return (now && now.call(performance)) || (new Date().getTime());
}
function Factorization(n: number): [number, number] {
	if (n % 2 == 0 && n != 2) return [2, n / 2];
	for (var i = 3; i < n; i += 2) {
		if (n % i === 0) {
			return [i, n / i];
		}
	}
	return [0, n];
}
class ResizingCanvas {
	Parent: Element;
	ctx: CanvasRenderingContext2D;
	readonly height: number;
	readonly width: number;
	scale: number;
	constructor(canvas: any, parent: Element, width: number, height: number) {
		this.Parent = parent;
		if (canvas.getContext) this.ctx = canvas.getContext('2d');
		else throw "Canvasが対応していないようです。ChromeやChromeなどのナウいブラウザーを使いなさい"
		var This = this;
		((Fn) => {
			let i: boolean | number = false;
			window.addEventListener("resize", () => {
				if (typeof i == "number")
					clearTimeout(i);
				i = setTimeout(Fn, 100);
			});
		})(() => this.OnResize.call(This));
		this.width = width;
		this.height = height;
		this.OnResize();
	}
	OnResize(dpr?: number) {
		let Canvas = this.ctx.canvas;
		let Scale = Math.min(
			(this.Parent.clientWidth - Settings.ResizingCanvas.Margin) / this.width, (this.Parent.clientHeight - Settings.ResizingCanvas.Margin) / this.height);
		Canvas.style.width = Scale * this.width + "px";
		Canvas.style.height = Scale * this.height + "px";
		Scale *= (dpr || window.devicePixelRatio || 1);
		Canvas.width = Scale * this.width;
		Canvas.height = Scale * this.height;
		this.ctx.lineWidth = (dpr || window.devicePixelRatio || 1);
		this.scale = Scale;
	}
	S(pos: number) {
		return pos * this.scale;
	}
	Line(x1: number, y1: number, x2: number, y2: number) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.S(x1 + 0.5), this.S(y1 + 0.5));
		this.ctx.lineTo(this.S(x2 + 0.5), this.S(y2 + 0.5));
		this.ctx.stroke();
	}
	Round(x: number, y: number, r: number) {
		this.ctx.arc(this.S(x), this.S(y), this.S(r), 0, 2 * Math.PI, false);
	}
	RoundedRect(x: number, y: number, w: number, h: number, r: number) {
		let pxX = this.S(x);
		let pxY = this.S(y);
		let pxW = this.S(w);
		let pxH = this.S(h);
		let pxR = this.S(r);

		this.ctx.moveTo(pxX, pxY + pxR);
		this.ctx.lineTo(pxX, pxY + pxH - pxR);
		this.ctx.quadraticCurveTo(pxX, pxY + pxH, pxX + pxR, pxY + pxH);
		this.ctx.lineTo(pxX + pxW - pxR, pxY + pxH);
		this.ctx.quadraticCurveTo(pxX + pxW, pxY + pxH, pxX + pxW, pxY + pxH - pxR);
		this.ctx.lineTo(pxX + pxW, pxY + pxR);
		this.ctx.quadraticCurveTo(pxX + pxW, pxY, pxX + pxW - pxR, pxY);
		this.ctx.lineTo(pxX + pxR, pxY);
		this.ctx.quadraticCurveTo(pxX, pxY, pxX, pxY + pxR);
	}
	TextCenter(Text: string, x: number, y: number, w: number) {
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	TextLeft(Text: string, x: number, y: number, w: number) {
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	TextRight(Text: string, x: number, y: number, w: number) {
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	Shadow() {
		this.ctx.shadowBlur = this.S(Settings.ResizingCanvas.shadowBlur);
		this.ctx.shadowColor = Settings.ResizingCanvas.shadowColor;
		this.ctx.shadowOffsetX = this.S(Settings.ResizingCanvas.shadowOffsetX);
		this.ctx.shadowOffsetY = this.S(Settings.ResizingCanvas.shadowOffsetY);
	}
}
interface Elm {
	Name: string
	Enabled: boolean
	Init?(...Args: any[]): void
	BeforeDraw?(Elms: Elm[], Span: number): void
	Draw?(c: ResizingCanvas, Span: number): void
	AfterDraw?(Elms: Elm[], Span: number): void
}
class BackDrawer implements Elm {
	Name = "Back";
	Enabled = true;
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = Settings.BackDrawer.Background;
		c.ctx.strokeStyle = Settings.BackDrawer.Border;
		c.ctx.fillRect(0, 0, c.S(Settings.Game.Wcell * (Settings.Game.Wcount + 1)), c.S(Settings.Game.Hcell * (Settings.Game.Hcount + 1)));
		for (let i = 1; i < Settings.Game.Wcount; i++) {
			c.Line(i * Settings.Game.Wcell - 1, 1 * Settings.Game.Hcell, i * Settings.Game.Wcell - 1, 30 * Settings.Game.Hcell);
		}
		c.ctx.fillStyle = Settings.BackDrawer.TextColor;
		c.ctx.font = `${c.S(Settings.Game.Hcell - 4) << 0}px ${Settings.Game.FontName}`;
		c.TextLeft("Life:  " + Game.life.toString(), Settings.BackDrawer.MarginLeft * Settings.Game.Wcell, Settings.Game.Hcell * (Settings.Game.Hcount - 2 + 0.5), Settings.Game.Wcell * Settings.Game.Wcount / 2);
		c.TextLeft("Score: " + Game.score.toString(), Settings.BackDrawer.MarginLeft * Settings.Game.Wcell, Settings.Game.Hcell * (Settings.Game.Hcount - 1 + 0.5), Settings.Game.Wcell * Settings.Game.Wcount / 2);
		c.TextRight("Hint: " + Game.hintCount.toString(), (Settings.Game.Wcount - Settings.BackDrawer.MarginRight) * Settings.Game.Wcell, Settings.Game.Hcell * (Settings.Game.Hcount - 1 + 0.5), Settings.Game.Wcell * Settings.Game.Wcount / 2);
		let lvText = (Game.level % Settings.NumNodes.LevelToMaxWeighting == 0 ? (Game.level / Settings.NumNodes.LevelToMaxWeighting).toString() : Game.level.toString() + "÷" + Settings.NumNodes.LevelToMaxWeighting.toString());
		c.TextRight("Lv." + lvText, (Settings.Game.Wcount - Settings.BackDrawer.MarginRight) * Settings.Game.Wcell, Settings.Game.Hcell * (Settings.Game.Hcount - 2 + 0.5), Settings.Game.Wcell * Settings.Game.Wcount / 2);
	}
}//Name:Back
class Dropper implements Elm {
	Name = "Dropper";
	Enabled = true;
	private dx = Settings.Dropper.MoveSpeed;// per 1sec
	private x = ((Settings.Game.Wcount - 1) / 2) << 0;
	BeforeDraw(Elms: Elm[], Span: number) {
		//this.dx = Math.sign(this.dx) * Math.min(9, 3 + (Math.max(Game.level / Settings.NumNodes.LevelToMaxWeighting, 200) - 200) / 31);
		if ((this.x << 0) != (this.x + this.dx * Span / 1000) << 0) {
			this.x = (this.x + this.dx * Span / 1000);
			if (Math.random() < Settings.Dropper.TurnProbability)
				this.dx *= -1;
			if (Math.random() < Settings.Dropper.DropProbability) {
				let numnode = Elms.find((v) => v.Name == "NumNodes");
				if (numnode instanceof NumNodes) {
					if (numnode.nums.some((v) => v[0] == Math.round(this.x + Settings.Game.Wcell) % Settings.Game.Wcell && v[1] < 1)) return;
					numnode.Add(Math.round(this.x + Settings.Game.Wcell) % Settings.Game.Wcell, 0);
				} else throw "ERROR";
			}
		}
	}
	Draw(c: ResizingCanvas, Span: number) {
		this.x += this.dx * Span / 1000;
		this.x = (this.x + Settings.Game.Wcount) % Settings.Game.Wcount;
		c.ctx.fillStyle = Settings.Dropper.Color;
		c.ctx.beginPath();
		c.RoundedRect(this.x * Settings.Game.Wcell, 0, Settings.Game.Wcell - 1, Settings.Game.Hcell, Settings.Game.Rcell);
		c.ctx.fill();
		if (this.x > Settings.Game.Wcount - 1) {
			c.ctx.beginPath();
			c.RoundedRect((this.x - Settings.Game.Wcount) * Settings.Game.Wcell, 0, Settings.Game.Wcell - 1, Settings.Game.Hcell, Settings.Game.Rcell);
			c.ctx.fill();
		}
	}
}//Name: Dropper
class Shooter implements Elm {
	Name = "Shooter";
	Enabled = true;
	private Keymap = Settings.Shotter.Keymap;
	private KeySleepMax1 = Settings.Shotter.KeySleepMax1;
	private KeySleepMax2 = Settings.Shotter.KeySleepMax2;
	private KeyMode = [0, 0, 0, 0]//0:Not pressed 1+:pressed tick count
	private dx = 0;//per tick
	private x = ((Settings.Game.Wcount - 1) / 2) << 0;
	private y = Settings.Shotter.Y;
	private BlinkCount = 0;
	Init() {
		let it = this;
		document.addEventListener("keydown", (e) => {
			if (e.repeat) return;
			let tmp = it.Keymap.findIndex((v) => v == e.keyCode);
			if (tmp < 0) return;
			e.preventDefault();
			it.KeyMode[tmp] = 1;
		});
		document.addEventListener("keyup", (e) => {
			let tmp = it.Keymap.findIndex((v) => v == e.keyCode);
			if (tmp < 0) return;
			e.preventDefault();
			it.KeyMode[tmp] = 0;
		});
		window.addEventListener("blur", (e) => {
			it.KeyMode = it.KeyMode.fill(0);
		});
		return this;
	}
	BeforeDraw(Elms: Elm[], Span: number) {
		this.KeyMode.forEach((v, i) => {
			if (v == 0) return;
			if (v == 1 || ((v - this.KeySleepMax1[i]) % this.KeySleepMax2[i] == 0 && v >= this.KeySleepMax1[i])) {
				switch (i) {
					case 0://Left
						this.dx = -Settings.Shotter.MoveSpeed;
						break;
					case 1://Right
						this.dx = Settings.Shotter.MoveSpeed;
						break;
					case 2://Shot
						Elms.find((v) => v.Name == "Shots").Add(Math.round(this.x + Settings.Game.Wcell) % Settings.Game.Wcell, this.y);
						break;
					case 3:
						Elms.find((v) => v.Name == "NumNodes").Hint();
				}
			}
		}, this);
		this.KeyMode = this.KeyMode.map((v) => v == 0 ? 0 : v + 1);
	}
	Draw(c: ResizingCanvas, Span: number) {
		if (this.dx > 0 && (this.x << 0) != (this.x + this.dx) << 0) {
			this.x = (this.x + this.dx) << 0;
			this.dx = 0;
		} else if (this.dx < 0 && Math.ceil(this.x) != Math.ceil(this.x + this.dx)) {
			this.x = Math.ceil(this.x + this.dx);
			this.dx = 0;
		}
		if (this.dx != 0) this.x += this.dx;
		this.x = (this.x + Settings.Game.Wcount) % Settings.Game.Wcount;
		c.ctx.save();
		this.BlinkCount = (this.BlinkCount + 1) % Settings.Shotter.Beam.BlinkSpeed;
		c.ctx.globalAlpha = Math.sin(Math.PI * 2 * (this.BlinkCount / Settings.Shotter.Beam.BlinkSpeed)) / 4 + 0.5;
		c.ctx.strokeStyle = Settings.Shotter.Beam.Color;
		c.Line((this.x + 0.5) * Settings.Game.Wcell - 1, 1 * Settings.Game.Hcell, (this.x + 0.5) * Settings.Game.Wcell - 1, this.y * Settings.Game.Hcell);
		c.ctx.stroke();
		c.ctx.restore();
		c.ctx.fillStyle = Settings.Shotter.Color;
		function DrawMe() {
			c.ctx.beginPath();
			c.ctx.moveTo(c.S((this.x + 0.5) * Settings.Game.Wcell - 0.5), c.S(this.y * Settings.Game.Hcell));
			c.ctx.lineTo(c.S((this.x + 0.5 - 0.3) * Settings.Game.Wcell - 0.5), c.S((this.y + 1) * Settings.Game.Hcell));
			c.ctx.lineTo(c.S((this.x + 0.5 + 0.3) * Settings.Game.Wcell - 0.5), c.S((this.y + 1) * Settings.Game.Hcell));
			c.ctx.fill();
		}
		DrawMe.apply(this);
		if (this.x > Settings.Game.Wcount - 1) {
			this.x -= Settings.Game.Wcount;
			DrawMe.apply(this);
			this.x += Settings.Game.Wcount;
		}
	}
}//Name; Shooter
class Shots implements Elm {
	Name = "Shots";
	Enabled = true;
	shots: [number, number][] = [];
	Add(x: number, y: number) {
		this.shots.push([x, y]);
	}
	Clear() {
		this.shots = [];
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = Settings.Shots.Color;
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.shots.forEach((v) => {
			v[1] -= Settings.Shots.MoveSpeed;
			c.Round((v[0] + 0.5) * Settings.Game.Wcell - 0.5, v[1] * Settings.Game.Hcell, Settings.Shots.Radius * Settings.Game.Hcell);
			c.ctx.closePath();
		});
		c.ctx.fill();
		c.ctx.restore();
	}
	AfterDraw(Elms: Elm[], Span: number) {
		this.shots = this.shots.filter((shot) => shot[1] > 0);
	}
}//Name: Shots
class NumNodes implements Elm {
	Name = "NumNodes";
	Enabled = true;
	nums: [number, number, number, number][] = [];//x,y,num,Color
	Add(x: number, y: number, num?: number) {
		if (!num) {
			while (true) {
				num = Math.max(2, (Math.random() * Game.level / Settings.NumNodes.LevelToMaxWeighting) << 0);
				let tmp = num;
				let i = 0;
				for (; i < Settings.NumNodes.MaxFactCount; i++) {
					let tmp2 = Factorization(tmp);
					if (tmp2[0] == 0) break;
					tmp = tmp2[1];
				}
				if (i != Settings.NumNodes.MaxFactCount) break;
			}
		}
		this.nums.push([x, y, num ? num : Math.max(2, (Math.random() * Game.level / Settings.NumNodes.LevelToMaxWeighting) << 0), 0]);
	}
	Hint() {
		if (Game.hintCount <= 0) return;
		Game.hintCount--;
		this.nums.forEach((num) => {
			if (Factorization(num[2])[0] == 0) {//Prime number
				num[3] = 1;
			} else {
				num[3] = 2;
			}
		});
	}
	Draw(c: ResizingCanvas, Span: number) {
		this.nums.forEach((v) => v[1] += Settings.NumNodes.MoveSpeed);
		c.ctx.save();
		c.Shadow();
		for (let tmp = 0; tmp < Settings.NumNodes.Colors.length; tmp++) {
			c.ctx.fillStyle = Settings.NumNodes.Colors[tmp];
			c.ctx.beginPath();
			this.nums.forEach((v) => {
				if (v[3] != tmp) return;
				c.RoundedRect(v[0] * Settings.Game.Wcell, v[1] * Settings.Game.Hcell, Settings.Game.Wcell - 1, Settings.Game.Hcell, Settings.Game.Rcell);
				c.ctx.closePath();
			});
			c.ctx.fill();
		}
		c.ctx.restore();
		c.ctx.fillStyle = Settings.NumNodes.TextColor;
		c.ctx.font = `${c.S(Settings.Game.Hcell - 4) << 0}px ${Settings.Game.FontName}`;
		this.nums.forEach((v) => {
			c.TextCenter(v[2].toString(), (v[0] + 0.5) * Settings.Game.Wcell, (v[1] + 0.5) * Settings.Game.Hcell, Settings.Game.Wcell - 4);
		});
	}
	AfterDraw(Elms: Elm[], Span: number) {
		this.nums = this.nums.filter((num) => {
			if (num[1] <= Settings.Game.Hcount - 3) return true;
			Settings.ScoreAndLevel(1, num[2]);
			return false;
		});
	}
}//Name: NumNodes
class Filters implements Elm {
	Name = "Filters";
	Enabled = true;
	filters: number[] = [];//y
	Add(y: number) {
		this.filters.push(y);
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.strokeStyle = Settings.Filters.Color;
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.filters.forEach((y) => {
			c.ctx.moveTo(0, c.S(Settings.Game.Hcell * y));
			c.ctx.lineTo(c.S(Settings.Game.Wcell * Settings.Game.Wcount), c.S(Settings.Game.Hcell * y));
		});
		c.ctx.stroke();
		c.ctx.restore();
	}
}//Name: Filters
class ButtonNodes implements Elm {
	Name = "ButtonNodes";
	Enabled = true;
	texts: { x: number, y: number, w: number, h: number, text: string, fontsize: number, fn: () => void }[] = [];//x,y,num
	Add(x: number, y: number, w: number, h: number, text: string, fontsize: number, fn: () => void) {
		this.texts.push({ x: x, y: y, w: w, h: h, text: text, fontsize: fontsize, fn: fn });
	}
	Clear() {
		this.texts = [];
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = Settings.ButtonNodes.Color;
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.texts.forEach((v) => {
			c.RoundedRect(v.x * Settings.Game.Wcell, v.y * Settings.Game.Hcell, v.w * Settings.Game.Wcell, v.h * Settings.Game.Hcell, Settings.Game.Rcell);
			c.ctx.closePath();
		});
		c.ctx.fill();
		c.ctx.restore();
		c.ctx.fillStyle = Settings.ButtonNodes.TextColor;
		this.texts.forEach((v) => {
			c.ctx.font = `${c.S(Settings.Game.Hcell * v.fontsize - 4) << 0}px ${Settings.Game.FontName}`;
			c.TextCenter(v.text, (v.x + v.w / 2) * Settings.Game.Wcell, (v.y + v.h / 2) * Settings.Game.Hcell, Settings.Game.Wcell * v.w - 4);
		});
	}
}//Name: ButtonNodes
class Fading implements Elm {
	Name = "Fading";
	Enabled = true;
	Finished = false;
	CurrentBrightness = 0;
	Draw(c: ResizingCanvas, Span: number) {
		if (this.CurrentBrightness > Settings.Fading.Speed) {
			c.ctx.fillStyle = Settings.Fading.Color;
			c.ctx.globalAlpha = 1 - this.CurrentBrightness;
			c.ctx.fillRect(0, 0, c.S(Settings.Game.Wcell * (Settings.Game.Wcount + 1)), c.S(Settings.Game.Hcell * (Settings.Game.Hcount + 1)));
			this.CurrentBrightness++;
		} else {
			this.Finished = true;
		}
	}
}//Name:Fading
function OnhitNumShots(num: NumNodes, shots: Shots, span: number) {
	let delNumI: number[] = [];
	let delShotI: number[] = [];
	for (let si = 0; si < shots.shots.length; si++) {
		if (delShotI.indexOf(si) >= 0) break;
		for (let ni = 0; ni < num.nums.length; ni++) {
			if (delNumI.indexOf(ni) >= 0) break;
			if (num.nums[ni][0] == shots.shots[si][0] && Math.abs(num.nums[ni][1] - shots.shots[si][1]) < (0.5 + Settings.Shots.Radius)) {
				delNumI.push(ni);
				delShotI.push(si);
			}
		}
	}
	while (delShotI.length > 0) shots.shots.splice(delShotI.pop(), 1);
	while (delNumI.length > 0) {
		let index = delNumI.pop();
		let tmp = Factorization(num.nums[index][2]);
		Settings.ScoreAndLevel(2, num.nums[index][2]);
		if (tmp[0] != 0) {//Not Prime number
			num.Add((num.nums[index][0] + Settings.Game.Wcount - 1) % Settings.Game.Wcount, num.nums[index][1] - 1, tmp[0]);
			num.Add((num.nums[index][0] + Settings.Game.Wcount + 1) % Settings.Game.Wcount, num.nums[index][1] - 1, tmp[1]);
		}
		num.nums.splice(index, 1);
	}
}
function OnhitNumNum(num: NumNodes, unused: NumNodes, span: Number) {
	let fusionNumI: number[] = [];
	for (let i1 = 0; i1 < num.nums.length; i1++) {
		if (fusionNumI.indexOf(i1) >= 0) break;
		for (let i2 = i1 + 1; i2 < num.nums.length; i2++) {
			if (fusionNumI.indexOf(i2) >= 0) break;
			if (num.nums[i1][0] == num.nums[i2][0] && Math.abs(num.nums[i1][1] - num.nums[i2][1]) < 1) {
				fusionNumI.push(i1);
				fusionNumI.push(i2);
			}
		}
	}
	if (fusionNumI.length == 0) return;
	for (let fusionI = 0; fusionI < fusionNumI.length; fusionI += 2) {
		num.Add(num.nums[fusionNumI[fusionI]][0], (num.nums[fusionNumI[fusionI]][1] + num.nums[fusionNumI[fusionI + 1]][1]) / 2, num.nums[fusionNumI[fusionI]][2] + num.nums[fusionNumI[fusionI + 1]][2]);
	}
	num.nums = num.nums.filter((v, i) => (fusionNumI.indexOf(i) < 0));
}
function OnhitFiltersNum(filter: Filters, num: NumNodes, span: number) {
	let delNumI: number[] = [];
	for (let fi = 0; fi < filter.filters.length; fi++) {
		for (let ni = 0; ni < num.nums.length; ni++) {
			if (delNumI.indexOf(ni) >= 0) break;
			if (Math.abs(num.nums[ni][1] - filter.filters[fi] + 0.5) < 0.5 && Factorization(num.nums[ni][2])[0] == 0) {
				delNumI.push(ni);
			}
		}
	}
	delNumI.sort((a, b) => a - b);
	while (delNumI.length > 0) {
		let index = delNumI.pop();
		Settings.ScoreAndLevel(0, num.nums[index][2]);
		num.nums.splice(index, 1);
	}
}
function OnhitBtnShots(btn: ButtonNodes, shots: Shots, span: number) {
	let delBtnI: number[] = [];
	let delShotI: number[] = [];
	for (let si = 0; si < shots.shots.length; si++) {
		if (delShotI.indexOf(si) >= 0) break;
		for (let bi = 0; bi < btn.texts.length; bi++) {
			if (delBtnI.indexOf(bi) >= 0) break;
			if (btn.texts[bi].y - Settings.Shots.Radius <= shots.shots[si][1] && btn.texts[bi].y + btn.texts[bi].h + Settings.Shots.Radius >= shots.shots[si][1])
				if (btn.texts[bi].x <= shots.shots[si][0] && btn.texts[bi].x + btn.texts[bi].w - 1 >= shots.shots[si][0]) {
					delBtnI.push(bi);
					delShotI.push(si);
				}
		}
	}
	while (delShotI.length > 0) shots.shots.splice(delShotI.pop(), 1);
	while (delBtnI.length > 0) {
		let index = delBtnI.pop();
		btn.texts[index].fn();
	}
}
function onLoad(Elms: Elm[]) {
	Elms.find((e) => e.Name == "Fading").Enabled = false;

	Elms.find((e) => e.Name == "Dropper").Enabled = false;
	Elms.find((e) => e.Name == "NumNodes").Enabled = false;
	Elms.find((e) => e.Name == "Filters").Enabled = false;
	let btns = Elms.find((e) => e.Name == "ButtonNodes");

	if (btns instanceof ButtonNodes) {
		btns.Add(1, 1, Settings.Game.Wcount - 2, 3, "Prime Shooter", 2, () => btns.texts[0].text = btns.texts[0].text == "Prime Shooter" ? "素数シューティング" : "Prime Shooter");
		btns.Add(1, 11, 3, 2, "Start", 1.5, () => {
			Elms.find((e) => e.Name == "Dropper").Enabled = true;
			Elms.find((e) => e.Name == "NumNodes").Enabled = true;
			Elms.find((e) => e.Name == "Filters").Enabled = true;
			Elms.find((e) => e.Name == "ButtonNodes").Enabled = false;
			Elms.find((e) => e.Name == "Shots").Clear();
			AddFilter(Elms);
		});
		btns.Add(Settings.Game.Wcount - 4, 11, 3, 2, "Help", 1.5, () => {
			document.getElementById("help").classList.toggle("hide");
		});
	} else throw "ERROR";
}
function onTick(Elms: Elm[], span: number) {
	let HintPerLivel = Settings.onTick.HintperLevel * Settings.NumNodes.LevelToMaxWeighting;
	let FilterPerLivel = Settings.onTick.FilterperLevel * Settings.NumNodes.LevelToMaxWeighting;
	if (Game.level > Game.maxLevel) {
		if (((Game.level / HintPerLivel)) << 0 > ((Game.maxLevel / HintPerLivel) << 0)) {
			Game.hintCount++;
		}
		if (((Game.level / FilterPerLivel)) << 0 > ((Game.maxLevel / FilterPerLivel) << 0)) {
			AddFilter(Elms);
		}
		Game.maxLevel = Game.level;
	}
	if (Game.life <= 0) {
		if (!Elms.find((e) => e.Name == "Fading").Finished) {//Gaveover & Fading_Finished
			if (!Elms.find((e) => e.Name == "Fading").Enabled) {
				Game.life = 0;
				Elms.find((e) => e.Name == "Dropper").Enabled = false;
				Elms.find((e) => e.Name == "NumNodes").Enabled = false;
				Elms.find((e) => e.Name == "Filters").Enabled = false;
				Elms.find((e) => e.Name == "Fading").Enabled = true;
			}
		} else if (Elms.find((e) => e.Name == "Fading").Enabled) {
			Elms.find((e) => e.Name == "Shots").shots = [];
			Elms.find((e) => e.Name == "Fading").Enabled = false;
			let btns = Elms.find((e) => e.Name == "ButtonNodes");
			if (btns instanceof ButtonNodes) {
				btns.Enabled = true;
				btns.Clear();
				btns.Add(1, 1, Settings.Game.Wcount - 2, 3, "Gameover", 2, () => alert("そうかそうか、そんなに13が好きか。それはいいことだ。あそこまできれいな素数は他にはないと私は思うのだが・・・どう思うかね？ワトソンくん"));
				btns.Add(2, 5, Settings.Game.Wcount - 4, 1, `Score: ${Game.score}pt`, 1, () => 0);
				btns.Add(2, 6.5, Settings.Game.Wcount - 4, 1, `Rank: ...`, 1, () => 0);
				btns.Add(1.5, 11, Settings.Game.Wcount - 3, 2, "Add to Ranking", 1.5, () => {
					if (btns instanceof ButtonNodes) {
						if (btns.texts[btns.texts.length - 1].text == "Add to Ranking") {
							let name = prompt("Enter your name...", "anonymous");
							if (!!name && name.length > 0) {
								btns.texts[btns.texts.length - 1].text = "...";
								let count = 0;
								function Tmp() {
									count++;
									if (btns instanceof ButtonNodes && count == 2)
										btns.texts[btns.texts.length - 1].text = "Finish!";
								}
								MyStorage.Add(1, JSON.stringify({ "Score": Game.score, "Level": Game.level, "Name": name }), Tmp);
								MyStorage.Add(2, JSON.stringify({ "Date": DateFormat(new Date()), "IP": IPAddress, "UA": window.navigator.userAgent }), Tmp);
							}
						}
					}
				});
				MyStorage.Get(1, (text) => {
					let data: { Score: number, Level: number, Name: string, Date: string }[] = text.map((t) => JSON.parse(t));
					data = data.sort((a, b) => b["Score"] - a["Score"]);
					let list = document.getElementById("rankingList");
					list.innerHTML = "";
					data.forEach((v, i) => {
						list.innerHTML += `<li><div>#${i + 1}</div><div>${v["Score"]}pt</div><div>Lv.${(v["Level"] % Settings.NumNodes.LevelToMaxWeighting == 0 ? (v["Level"] / Settings.NumNodes.LevelToMaxWeighting).toString() : Game["level"].toString() + "÷" + Settings.NumNodes.LevelToMaxWeighting.toString())}</div><div>${v["Name"]}</div></li>`;
					});
					let rank = data.findIndex((v) => v["Score"] <= Game.score) + 1;
					if (rank == 0) rank = data.length + 1;
					btns.texts[2].text = `Rank: ${rank}/${data.length + 1}`;
					document.getElementById("ranking").classList.remove("hide");
				});
			} else throw "ERROR";
		}
	}
}
function AddFilter(Elms: Elm[]) {
	let shots = Elms.find((e) => e.Name == "Shots").shots;
	let shooterX = Elms.find((e) => e.Name == "Shooter").x;
	Elms.find((e) => e.Name == "Dropper").Enabled = false;
	Elms.find((e) => e.Name == "NumNodes").Enabled = false;
	Elms.find((e) => e.Name == "Shooter").Enabled = false;
	setTimeout(() => Elms.find((e) => e.Name == "Shooter").Enabled = true, 1000);
	Elms.find((e) => e.Name == "Shooter").KeyMode = Elms.find((e) => e.Name == "Shooter").KeyMode.fill(0);
	Elms.find((e) => e.Name == "Shooter").x = 2;
	let tmp = Elms.find((e) => e.Name == "Filters");
	if (tmp instanceof Filters) tmp.Add(5);
	let btns = Elms.find((e) => e.Name == "ButtonNodes");
	if (btns instanceof ButtonNodes) {
		btns.Enabled = true;
		btns.Clear();
		btns.Add(1, 1, Settings.Game.Wcount - 2, 3, "Add Filter", 2, () => btns.texts[0].text = btns.texts[0].text == "Add Filter" ? "13っていいよね！" : "Add Filter");
		btns.Add(1, Settings.Game.Hcount - 9, 1, 2, "↑", 1.5, () => {
			let tmp = Elms.find((e) => e.Name == "Filters");
			if (tmp instanceof Filters) {
				tmp.filters[tmp.filters.length - 1] = Math.min(Settings.Game.Hcount - 5, Math.max(1, tmp.filters[tmp.filters.length - 1] - 1));
			}
		});
		btns.Add(2, Settings.Game.Hcount - 9, 1, 2, "↓", 1.5, () => {
			let tmp = Elms.find((e) => e.Name == "Filters");
			if (tmp instanceof Filters) {
				tmp.filters[tmp.filters.length - 1] = Math.min(Settings.Game.Hcount - 5, Math.max(1, tmp.filters[tmp.filters.length - 1] + 1));
			}
		});
		btns.Add(3, Settings.Game.Hcount - 9, Settings.Game.Wcount - 4, 2, "Add & Start", 1.5, () => {
			Elms.find((e) => e.Name == "Dropper").Enabled = true;
			Elms.find((e) => e.Name == "NumNodes").Enabled = true;
			Elms.find((e) => e.Name == "ButtonNodes").Enabled = false;
			Elms.find((e) => e.Name == "Shots").shots = shots;
			Elms.find((e) => e.Name == "Shooter").x = shooterX;
		});
	} else throw "ERROR";
}
namespace Game {
	export let score = 0;
	export let level = 1;
	export let maxLevel = 0;
	export let life = Settings.Game.life;
	export let hintCount = 0;
	let c1: ResizingCanvas;
	let Elms: Elm[] = [new BackDrawer(), new Dropper(), new Shooter().Init(), new Shots(), new NumNodes(), new Filters(), new ButtonNodes(), new Fading()];
	let OnHit: { Fn: (Elm1: Elm, Elm2: Elm, Span: number) => void, Elm1: string, Elm2: string }[] = [
		{ Fn: OnhitBtnShots, Elm1: "ButtonNodes", Elm2: "Shots" },
		{ Fn: OnhitNumShots, Elm1: "NumNodes", Elm2: "Shots" },
		{ Fn: OnhitNumNum, Elm1: "NumNodes", Elm2: "NumNodes" },
		{ Fn: OnhitFiltersNum, Elm1: "Filters", Elm2: "NumNodes" }
	];
	export function Init(): void {
		c1 = new ResizingCanvas(document.getElementById("c1"), document.documentElement, Settings.Game.Wcell * Settings.Game.Wcount, Settings.Game.Hcell * Settings.Game.Hcount);
		onLoad(Elms);
	}
	let prevTime: number = undefined;
	export function Tick(pt: number): void {
		if (prevTime === undefined) {
			prevTime = pt;
		}
		Elms.forEach((elm) => {
			if ("BeforeDraw" in elm && elm.Enabled) elm.BeforeDraw(Elms, pt - prevTime);
		});
		Elms.forEach((elm) => {
			if ("Draw" in elm && elm.Enabled) elm.Draw(c1, pt - prevTime);
		});
		Elms.forEach((elm) => {
			if ("AfterDraw" in elm && elm.Enabled) elm.AfterDraw(Elms, pt - prevTime);
		});
		OnHit.forEach((listener) => {
			let tmp1 = Elms.find((v) => v.Name == listener.Elm1);
			if (!tmp1) throw "undefined node name";
			let tmp2 = Elms.find((v) => v.Name == listener.Elm2);
			if (!tmp2) throw "undefined node name";
			if (tmp1.Enabled && tmp2.Enabled)
				listener.Fn(tmp1, tmp2, pt - prevTime);
		});
		prevTime = pt;
		onTick(Elms, pt - prevTime);
	}
}

function LoadScript(src: string) {
	let script = document.createElement('script');
	script.src = src;
	document.body.appendChild(script);
}
function DateFormat(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	var s = date.getSeconds();
	return `${y}/${m}/${d} ${h}:${min}:${s}`;
};
let IPAddress: string = "";
function AddAccessLog(text: any) {
	IPAddress = text["ip"];
	MyStorage.Add(4, DateFormat(new Date()) + " " + IPAddress + " " + window.navigator.userAgent, () => 0);
}
namespace MyStorage {
	export let _GetCB: (data: string[]) => void;
	export let _AddCB: () => void;
	let URL = "https://script.google.com/macros/s/AKfycbwgY_buxMtX3TLIxYrNfpyFZhyewRU0A3TnvDCi4A5yyY20AT0/exec";
	export function GettingURL(id: number) {
		return `${URL}?type=Get&ID=${id.toString()}`;
	}
	export function AddingURL(id: number, text: string) {
		return `${URL}?type=Add&ID=${id.toString()}&Text=${encodeURIComponent(text)}`;
	}
	export function Get(id: number, fn: (data: string[]) => void) {
		MyStorage["_GetCB"] = fn;
		LoadScript(GettingURL(id) + `&prefix=${encodeURIComponent("MyStorage._GetCB")}`);
	}
	export function Add(id: number, text: string, fn: () => void) {
		MyStorage["_AddCB"] = fn;
		LoadScript(AddingURL(id, text) + `&prefix=${encodeURIComponent("MyStorage._AddCB")}`);
	}
}

//--Main
Polyfill.Do();
window.addEventListener("load", () => {
	LoadScript(MyStorage.AddingURL(3, window.navigator.userAgent) + "&prefix=" + encodeURIComponent(""));
	LoadScript("https://api.ipify.org?format=jsonp&callback=AddAccessLog");
	Game.Init();
	function Tick() {
		Game.Tick(GetTime());
		requestAnimationFrame(Tick);
	}
	Tick();
});
document.body.removeChild(document.getElementById('message'));