var Polyfill;
(function (Polyfill) {
    const Funcs = [
        () => {
            let timer = undefined;
            let polyfill = function (callback) {
                if (typeof timer == "number")
                    clearTimeout(timer);
                timer = setTimeout(callback, 1000 / 60);
            };
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || polyfill;
        }
    ];
    function Do() {
        Funcs.forEach((v => v()));
    }
    Polyfill.Do = Do;
})(Polyfill || (Polyfill = {}));
function GetTime() {
    var now = window.performance && performance.now;
    return (now && now.call(performance)) || (new Date().getTime());
}
class ResizingCanvas {
    constructor(canvas, parent, width, height) {
        this.Parent = parent;
        if (canvas.getContext)
            this.ctx = canvas.getContext('2d');
        else
            throw "Canvasが対応していないようです。ChromeやChromeなどのナウいブラウザーを使いなさい";
        var This = this;
        ((Fn) => {
            let i = false;
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
    OnResize(dpr) {
        let Canvas = this.ctx.canvas;
        let Scale = Math.min(this.Parent.clientWidth / this.width, this.Parent.clientHeight / this.height);
        Canvas.style.width = Scale * this.width + "px";
        Canvas.style.height = Scale * this.height + "px";
        Scale *= (dpr || window.devicePixelRatio || 1);
        Canvas.width = Scale * this.width;
        Canvas.height = Scale * this.height;
        this.ctx.lineWidth = (dpr || window.devicePixelRatio || 1);
        this.scale = Scale;
    }
    S(pos) {
        return pos * this.scale;
    }
    Line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.S(x1 + 0.5), this.S(y1 + 0.5));
        this.ctx.lineTo(this.S(x2 + 0.5), this.S(y2 + 0.5));
        this.ctx.stroke();
    }
    Round(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(this.S(x), this.S(y), this.S(r), 0, 2 * Math.PI, false);
        this.ctx.fill();
    }
    RoundedRect(x, y, w, h, r) {
        let pxX = this.S(x);
        let pxY = this.S(y);
        let pxW = this.S(w);
        let pxH = this.S(h);
        let pxR = this.S(r);
        this.ctx.beginPath();
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
    Text(Text, x, y, w, h) {
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    }
    Clear() {
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    Shadow() {
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "#000";
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 3;
    }
}
class BackDrawer {
    Draw(Span) {
        let c = Game.c1.ctx;
        c.fillStyle = "#CCC";
        Game.c1.ctx.strokeStyle = "#333";
        Game.c1.Clear();
        for (let i = 1; i < Game.Wcount; i++) {
            Game.c1.Line(i * Game.Wcell - 1, 1 * Game.Hcell, i * Game.Wcell - 1, 30 * Game.Hcell);
        }
    }
}
class Dropper {
    constructor() {
        this.dx = -2;
        this.x = ((Game.Wcount - 1) / 2) << 0;
    }
    Draw(Span) {
        const TurnProbability = 0.2;
        const DropProbability = 0.5;
        let tmp = this.x;
        if ((this.x << 0) != (this.x + this.dx * Span / 1000) << 0) {
            this.x = (this.x + this.dx * Span / 1000);
            if (Math.random() < TurnProbability)
                this.dx *= -1;
            if (Math.random() < DropProbability) {
                Game.Elms.find((v) => v.Name == "Node").Elms.push(new NumNode().Init(Math.round(this.x + Game.Wcell) % Game.Wcell, 0));
            }
        }
        this.x += this.dx * Span / 1000;
        this.x = (this.x + Game.Wcount) % Game.Wcount;
        Game.c1.ctx.fillStyle = "#EEE";
        Game.c1.RoundedRect(this.x * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
        Game.c1.ctx.fill();
        if (this.x > Game.Wcount - 1)
            Game.c1.RoundedRect((this.x - Game.Wcount) * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
        Game.c1.ctx.fill();
    }
}
class Shooter {
    constructor() {
        this.Keymap = [37, 39, 38];
        this.KeySleepMax1 = [6, 6, 6];
        this.KeySleepMax2 = [3, 3, 6];
        this.KeyMode = [0, 0, 0];
        this.dx = 0;
        this.x = ((Game.Wcount - 1) / 2) << 0;
        this.y = 28;
        this.BlinkCount = 0;
        this.BlinkSpeed = 100;
    }
    Init() {
        let it = this;
        document.addEventListener("keydown", (e) => {
            if (e.repeat)
                return;
            let tmp = it.Keymap.findIndex((v) => v == e.keyCode);
            if (tmp < 0)
                return;
            it.KeyMode[tmp] = 1;
        });
        document.addEventListener("keyup", (e) => {
            let tmp = it.Keymap.findIndex((v) => v == e.keyCode);
            if (tmp < 0)
                return;
            it.KeyMode[tmp] = 0;
        });
        return this;
    }
    BeforeDraw(Span) {
        this.KeyMode.forEach((v, i) => {
            if (v == 0)
                return;
            if (v == 1 || ((v - this.KeySleepMax1[i]) % this.KeySleepMax2[i] == 0 && v >= this.KeySleepMax1[i])) {
                switch (i) {
                    case 0:
                        this.dx = -0.5;
                        break;
                    case 1:
                        this.dx = 0.5;
                        break;
                    case 2:
                        Game.Elms.find((v) => v.Name == "Shot").Elms.push(new Shot().Init(Math.round(this.x + Game.Wcell) % Game.Wcell, this.y));
                        break;
                }
            }
        }, this);
        this.KeyMode = this.KeyMode.map((v) => v == 0 ? 0 : v + 1);
    }
    Draw(Span) {
        if (this.dx > 0 && (this.x << 0) != (this.x + this.dx) << 0) {
            this.x = (this.x + this.dx) << 0;
            this.dx = 0;
        }
        else if (this.dx < 0 && Math.ceil(this.x) != Math.ceil(this.x + this.dx)) {
            this.x = Math.ceil(this.x + this.dx);
            this.dx = 0;
        }
        if (this.dx != 0)
            this.x += this.dx;
        this.x = (this.x + Game.Wcount) % Game.Wcount;
        Game.c1.ctx.save();
        this.BlinkCount = (this.BlinkCount + 1) % this.BlinkSpeed;
        Game.c1.ctx.globalAlpha = Math.sin(Math.PI * 2 * (this.BlinkCount / this.BlinkSpeed)) / 4 + 0.5;
        Game.c1.ctx.strokeStyle = "#F00";
        Game.c1.Line((this.x + 0.5) * Game.Wcell - 1, 1 * Game.Hcell, (this.x + 0.5) * Game.Wcell - 1, this.y * Game.Hcell);
        Game.c1.ctx.stroke();
        Game.c1.ctx.restore();
        Game.c1.ctx.fillStyle = "#EEE";
        function DrawMe() {
            Game.c1.ctx.beginPath();
            Game.c1.ctx.moveTo(Game.c1.S((this.x + 0.5) * Game.Wcell - 0.5), Game.c1.S(this.y * Game.Hcell));
            Game.c1.ctx.lineTo(Game.c1.S((this.x + 0.5 - 0.3) * Game.Wcell - 0.5), Game.c1.S((this.y + 1) * Game.Hcell));
            Game.c1.ctx.lineTo(Game.c1.S((this.x + 0.5 + 0.3) * Game.Wcell - 0.5), Game.c1.S((this.y + 1) * Game.Hcell));
            Game.c1.ctx.fill();
        }
        DrawMe.apply(this);
        if (this.x > Game.Wcount - 1) {
            this.x -= Game.Wcount;
            DrawMe.apply(this);
            this.x += Game.Wcount;
        }
    }
}
class Shot {
    Init(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    Draw(Span) {
        this.y -= 0.1;
        Game.c1.ctx.fillStyle = "#EEE";
        Game.c1.ctx.save();
        Game.c1.Shadow();
        Game.c1.Round((this.x + 0.5) * Game.Wcell, this.y * Game.Hcell, 4);
        Game.c1.ctx.restore();
        Game.c1.ctx.fill();
    }
}
class NumNode {
    constructor() {
        this.num = 0;
        this.x = 0;
        this.y = 0;
    }
    Init(x, y) {
        this.num = Math.max(2, Math.random() * Game.level);
        this.x = x;
        this.y = y;
        return this;
    }
    Draw(Span) {
        this.y += 0.1;
        Game.c1.ctx.fillStyle = "#EEE";
        Game.c1.RoundedRect(this.x * Game.Wcell, this.y * Game.Hcell, Game.Wcell - 1, Game.Hcell, Game.Rcell);
        Game.c1.ctx.fill();
        Game.c1.ctx.fillStyle = "#333";
        Game.c1.ctx.font = `${Game.c1.S(Game.Hcell - 4) << 0}px monospace`;
        Game.c1.Text(this.num.toString(), (this.x + 0.5) * Game.Wcell, (this.y + 0.5) * Game.Hcell, Game.Wcell - 4, Game.Hcell - 2);
    }
}
var Game;
(function (Game) {
    Game.Wcount = 9;
    Game.Hcount = 32;
    Game.Wcell = 34;
    Game.Hcell = 20;
    Game.Rcell = 5;
    Game.FontName = "monospace";
    Game.score = 0;
    Game.level = 1;
    Game.hintCount = 0;
    Game.Elms = [
        {
            Name: "Back",
            Elms: [new BackDrawer()]
        }, {
            Name: "Dropper",
            Elms: [new Dropper()]
        }, {
            Name: "Shooter",
            Elms: [new Shooter().Init()]
        }, {
            Name: "Shot",
            Elms: [],
            BeforeDraw: (Elms, Span) => {
                Elms.Elms = Elms.Elms.filter((e) => e.y > 0);
            }
        }, {
            Name: "Node",
            Elms: []
        },
    ];
    let OnHit = [];
    function Init() {
        Game.c1 = new ResizingCanvas(document.getElementById("c1"), document.documentElement, Game.Wcell * Game.Wcount, Game.Hcell * Game.Hcount);
    }
    Game.Init = Init;
    let prevTime = undefined;
    function Tick(pt) {
        if (prevTime === undefined) {
            prevTime = pt;
        }
        Game.Elms.forEach((elm) => {
            if ("BeforeDraw" in elm)
                elm.BeforeDraw(elm, pt - prevTime);
        });
        Game.Elms.forEach((elm) => {
            elm.Elms.forEach((elm2) => {
                if ("BeforeDraw" in elm2)
                    elm2.BeforeDraw(pt - prevTime);
                if ("Draw" in elm2)
                    elm2.Draw(pt - prevTime);
            });
        });
        Game.Elms.forEach((elm) => {
            if ("AfterDraw" in elm)
                elm.AfterDraw(elm, pt - prevTime);
        });
        OnHit.forEach((listener) => {
            let tmp1 = Game.Elms.find((v) => v.Name == listener.Elm1);
            if (!tmp1)
                throw "undefined node name";
            let tmp2 = Game.Elms.find((v) => v.Name == listener.Elm2);
            if (!tmp2)
                throw "undefined node name";
            tmp1.Elms.forEach((elm1) => {
                tmp2.Elms.forEach((elm2) => {
                    listener.Fn(elm1, elm2, pt - prevTime);
                });
            });
        });
        prevTime = pt;
    }
    Game.Tick = Tick;
})(Game || (Game = {}));
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
