namespace Polyfill {
	const Funcs: (() => void)[] = [
		() => {
			let timer: number = undefined;
			let polyfill = function (callback: any): any {
				if (typeof timer == "number") clearTimeout(timer);
				timer = setTimeout(callback, 1000 / 60);
			};
			window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || polyfill;
		}
	];
	export function Do() {
		Funcs.forEach((v => v()));
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
			this.Parent.clientWidth / this.width, this.Parent.clientHeight / this.height);
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
	TextCenter(Text: string, x: number, y: number, w: number, h: number) {
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	TextLeft(Text: string, x: number, y: number, w: number, h: number) {
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	TextRight(Text: string, x: number, y: number, w: number, h: number) {
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
	}
	Shadow() {
		this.ctx.shadowBlur = 5;
		this.ctx.shadowColor = "#000";
		this.ctx.shadowOffsetX = 2;
		this.ctx.shadowOffsetY = 3;
	}
}
interface Elm {
	Name: string
	Init?(...Args: any[]): void
	BeforeDraw?(Elms: Elm[], Span: number): void
	Draw?(c: ResizingCanvas, Span: number): void
	AfterDraw?(Elms: Elm[], Span: number): void
}
class BackDrawer implements Elm {
	Name = "Back";
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = "#CCC";//const
		c.ctx.strokeStyle = "#333";//const
		c.ctx.fillRect(0, 0, c.S(Game.Wcell * (Game.Wcount + 1)), c.S(Game.Hcell * (Game.Hcount + 1)));
		for (let i = 1; i < Game.Wcount; i++) {
			c.Line(i * Game.Wcell - 1, 1 * Game.Hcell, i * Game.Wcell - 1, 30 * Game.Hcell);
		}
		c.ctx.fillStyle = "#333";//const
		c.ctx.font = `${c.S(Game.Hcell - 4) << 0}px ${Game.FontName}`;
		c.TextLeft("Life:  " + Game.life.toString(), 0.5/*const*/ * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
		c.TextLeft("Score: " + Game.score.toString(), 0.5/*const*/ * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
		c.TextRight("Hint: " + Game.hintCount.toString(), (Game.Wcount - 0.5/*const*/) * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
		let lvText = (Game.level % NumNodes.LevelToMaxWeighting == 0 ? (Game.level / NumNodes.LevelToMaxWeighting).toString() : Game.level.toString() + "÷" + NumNodes.LevelToMaxWeighting.toString());
		c.TextRight("Lv." + lvText, (Game.Wcount - 0.5/*const*/) * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
	}
}//Name:Back
class Dropper implements Elm {
	Name = "Dropper";
	private dx = -2;//per 1sec
	private x = ((Game.Wcount - 1) / 2) << 0;
	BeforeDraw(Elms: Elm[], Span: number) {
		const TurnProbability = 0.2;
		const DropProbability = 0.5;
		if ((this.x << 0) != (this.x + this.dx * Span / 1000) << 0) {
			this.x = (this.x + this.dx * Span / 1000);
			if (Math.random() < TurnProbability)
				this.dx *= -1;
			if (Math.random() < DropProbability) {
				Elms.find((v) => v.Name == "NumNodes").Add(Math.round(this.x + Game.Wcell) % Game.Wcell, 0);
			}
		}
	}
	Draw(c: ResizingCanvas, Span: number) {
		this.x += this.dx * Span / 1000;
		this.x = (this.x + Game.Wcount) % Game.Wcount;
		c.ctx.fillStyle = "#EEE";//const
		c.ctx.beginPath();
		c.RoundedRect(this.x * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
		c.ctx.fill();
		if (this.x > Game.Wcount - 1) {
			c.ctx.beginPath();
			c.RoundedRect((this.x - Game.Wcount) * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
			c.ctx.fill();
		}
	}
}//Name: Dropper
class Shooter implements Elm {
	Name = "Shooter";
	private Keymap = [37, 39, 38];//CONST
	private KeySleepMax1 = [6, 6, 9]; //CONST
	private KeySleepMax2 = [3, 3, 6]; //CONST
	private KeyMode = [0, 0, 0]//0:Not pressed 1+:pressed tick count
	private dx = 0;//per tick
	private x = ((Game.Wcount - 1) / 2) << 0;
	private y = 28;//CONST
	private BlinkCount = 0;
	private BlinkSpeed = 100;//const
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
		return this;
	}
	BeforeDraw(Elms: Elm[], Span: number) {
		this.KeyMode.forEach((v, i) => {
			if (v == 0) return;
			if (v == 1 || ((v - this.KeySleepMax1[i]) % this.KeySleepMax2[i] == 0 && v >= this.KeySleepMax1[i])) {
				switch (i) {
					case 0://Left
						this.dx = -0.5;//CONST
						break;
					case 1://Right
						this.dx = 0.5;//CONST
						break;
					case 2://Shot
						Elms.find((v) => v.Name == "Shots").Add(Math.round(this.x + Game.Wcell) % Game.Wcell, this.y);
						break;
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
		this.x = (this.x + Game.Wcount) % Game.Wcount;
		c.ctx.save();
		this.BlinkCount = (this.BlinkCount + 1) % this.BlinkSpeed;
		c.ctx.globalAlpha = Math.sin(Math.PI * 2 * (this.BlinkCount / this.BlinkSpeed)) / 4 + 0.5;
		c.ctx.strokeStyle = "#F00";//const
		c.Line((this.x + 0.5) * Game.Wcell - 1, 1 * Game.Hcell, (this.x + 0.5) * Game.Wcell - 1, this.y * Game.Hcell);
		c.ctx.stroke();
		c.ctx.restore();
		c.ctx.fillStyle = "#EEE";//const
		function DrawMe() {
			c.ctx.beginPath();
			c.ctx.moveTo(c.S((this.x + 0.5) * Game.Wcell - 0.5), c.S(this.y * Game.Hcell));
			c.ctx.lineTo(c.S((this.x + 0.5 - 0.3) * Game.Wcell - 0.5), c.S((this.y + 1) * Game.Hcell));
			c.ctx.lineTo(c.S((this.x + 0.5 + 0.3) * Game.Wcell - 0.5), c.S((this.y + 1) * Game.Hcell));
			c.ctx.fill();
		}
		DrawMe.apply(this);
		if (this.x > Game.Wcount - 1) {
			this.x -= Game.Wcount;
			DrawMe.apply(this);
			this.x += Game.Wcount;
		}
	}
}//Name; Shooter
class Shots implements Elm {
	Name = "Shots";
	shots: [number, number][] = [];
	static Radius = 0.2;//const
	Add(x: number, y: number) {
		this.shots.push([x, y]);
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = "#EEE";//const
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.shots.forEach((v) => {
			v[1] -= 0.1;//const
			c.Round((v[0] + 0.5) * Game.Wcell - 0.5, v[1] * Game.Hcell, Shots.Radius * Game.Hcell);
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
	static LevelToMaxWeighting = 7;
	nums: [number, number, number][] = [];//x,y,num
	Add(x: number, y: number, num?: number) {
		this.nums.push([x, y, num ? num : Math.max(2, (Math.random() * Game.level / NumNodes.LevelToMaxWeighting) << 0)/*TODO: Factor Count limit*/]);
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.fillStyle = "#EEE";//const
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.nums.forEach((v) => {
			v[1] += 0.1;
			c.RoundedRect(v[0] * Game.Wcell, v[1] * Game.Hcell, Game.Wcell - 1, Game.Hcell, Game.Rcell);
			c.ctx.closePath();
		});
		c.ctx.fill();
		c.ctx.restore();
		c.ctx.fillStyle = "#333";//const
		c.ctx.font = `${c.S(Game.Hcell - 4) << 0}px ${Game.FontName}`;
		this.nums.forEach((v) => {
			c.TextCenter(v[2].toString(), (v[0] + 0.5) * Game.Wcell, (v[1] + 0.5) * Game.Hcell, Game.Wcell - 4, Game.Hcell - 2);
		});
	}
	AfterDraw(Elms: Elm[], Span: number) {
		this.nums = this.nums.filter((num) => {
			if (num[1] <= Game.Hcount - 3) return true;//CONST
			let tmp = Factorization(num[2]);
			if (tmp[0] == 0) {//Prime number!!!!!!!
				Game.score += 11 * num[2];//CONST
				Game.level += 11;//CONST
			} else {
				Game.score -= 17 * num[2];//CONST
				Game.level -= 17;//CONST
				Game.life -= 1;//CONST
			}
			return false;
		});
	}
}//Name: NumNodes
class Filters implements Elm {
	Name = "Filters";
	static LevelToMaxWeighting = 7;
	filters: number[] = [6];//y
	Add(y: number) {
		this.filters.push(y);
	}
	Draw(c: ResizingCanvas, Span: number) {
		c.ctx.strokeStyle = "#5F2";//const
		c.ctx.save();
		c.Shadow();
		c.ctx.beginPath();
		this.filters.forEach((y) => {
			c.ctx.moveTo(0, c.S(Game.Hcell * y));
			c.ctx.lineTo(c.S(Game.Wcell * Game.Wcount), c.S(Game.Hcell * y));
		});
		c.ctx.stroke();
		c.ctx.restore();
	}
}//Name: Filter
function OnhitNumShots(num: NumNodes, shots: Shots, span: number) {
	let delNumI: number[] = [];
	let delShotI: number[] = [];
	for (let si = 0; si < shots.shots.length; si++) {
		if (delShotI.indexOf(si) >= 0) break;
		for (let ni = 0; ni < num.nums.length; ni++) {
			if (delNumI.indexOf(ni) >= 0) break;
			if (num.nums[ni][0] == shots.shots[si][0] && Math.abs(num.nums[ni][1] - shots.shots[si][1]) < (0.5 + Shots.Radius)) {
				delNumI.push(ni);
				delShotI.push(si);
			}
		}
	}
	while (delShotI.length > 0) shots.shots.splice(delShotI.pop(), 1);
	while (delNumI.length > 0) {
		let index = delNumI.pop();
		let tmp = Factorization(num.nums[index][2]);
		if (tmp[0] == 0) {//Prime number!!!!!!!
			Game.score -= 31 * num.nums[index][2];//CONST
			Game.level -= 31;//CONST
			Game.life -= 3;//const
		} else {
			Game.score += num.nums[index][2];//CONST
			Game.level += 3;//CONST
			num.Add((num.nums[index][0] + Game.Wcount - 1) % Game.Wcount, num.nums[index][1] - 1, tmp[0]);
			num.Add((num.nums[index][0] + Game.Wcount + 1) % Game.Wcount, num.nums[index][1] - 1, tmp[1]);
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
		num.nums.push([num.nums[fusionNumI[fusionI]][0], (num.nums[fusionNumI[fusionI]][1] + num.nums[fusionNumI[fusionI + 1]][1]) / 2, num.nums[fusionNumI[fusionI]][2] + num.nums[fusionNumI[fusionI + 1]][2]]);
	}
	num.nums = num.nums.filter((v, i) => (fusionNumI.indexOf(i) < 0));
	console.log(num.nums.length + ":" + fusionNumI.length);
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
		Game.score += 7 * num.nums[index][2];//CONST
		Game.level += 7;//CONST
		num.nums.splice(index, 1);
	}
}
function onTick(Elms: Elm[], span: number) {
	const HintPerLivel = 100 * NumNodes.LevelToMaxWeighting;
	if (Game.level > Game.maxLevel) {
		if (((Game.level / HintPerLivel)) << 0 > ((Game.maxLevel / HintPerLivel) << 0)) {
			Game.hintCount++;
		}
		Game.maxLevel = Game.level;
	}
	if (Game.life <= 0) {
		Game.life = 0;
		//console.log("GAMEOVER");
	}
}
namespace Game {
	export const Wcount = 9;//CellWidth+BorderWidth
	export const Hcount = 32;//Dropper:1 Nodes:27 Shooter:1 Margin:1 UI:2 => sum:32
	export const Wcell = 34;
	export const Hcell = 20;
	export const Rcell = 5;
	export const FontName = "monospace";
	export let score = 0;
	export let level = 1;
	export let maxLevel = 0;
	export let life = 20;//const
	export let hintCount = 0;
	let c1: ResizingCanvas;
	let Elms: Elm[] = [new BackDrawer(), new Dropper(), new Shooter().Init(), new Shots(), new NumNodes(), new Filters()];
	let OnHit: { Fn: (Elm1: Elm, Elm2: Elm, Span: number) => void, Elm1: string, Elm2: string }[] = [
		{ Fn: OnhitNumShots, Elm1: "NumNodes", Elm2: "Shots" },
		{ Fn: OnhitNumNum, Elm1: "NumNodes", Elm2: "NumNodes" },
		{ Fn: OnhitFiltersNum, Elm1: "Filters", Elm2: "NumNodes" }
	];
	export function Init(): void {
		c1 = new ResizingCanvas(document.getElementById("c1"), document.documentElement, Wcell * Wcount, Hcell * Hcount);
	}
	let prevTime: number = undefined;
	export function Tick(pt: number): void {
		if (prevTime === undefined) {
			prevTime = pt;
		}
		Elms.forEach((elm) => {
			if ("BeforeDraw" in elm) elm.BeforeDraw(Elms, pt - prevTime);
		});
		Elms.forEach((elm) => {
			if ("Draw" in elm) elm.Draw(c1, pt - prevTime);
		});
		Elms.forEach((elm) => {
			if ("AfterDraw" in elm) elm.AfterDraw(Elms, pt - prevTime);
		});
		OnHit.forEach((listener) => {
			let tmp1 = Elms.find((v) => v.Name == listener.Elm1);
			if (!tmp1) throw "undefined node name";
			let tmp2 = Elms.find((v) => v.Name == listener.Elm2);
			if (!tmp2) throw "undefined node name";
			listener.Fn(tmp1, tmp2, pt - prevTime);
		});
		prevTime = pt;
		onTick(Elms, pt - prevTime);
	}
}

//--Main
Polyfill.Do();
window.addEventListener("load", () => {
	Game.Init();
	function Tick() {
		Game.Tick(GetTime());
		requestAnimationFrame(Tick);
	}
	Tick();
});

document.body.removeChild(document.getElementById('message'));