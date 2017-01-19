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
function Factorization(n) {
    if (n % 2 == 0 && n != 2)
        return [2, n / 2];
    for (var i = 3; i < n; i += 2) {
        if (n % i === 0) {
            return [i, n / i];
        }
    }
    return [0, n];
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
        this.ctx.arc(this.S(x), this.S(y), this.S(r), 0, 2 * Math.PI, false);
    }
    RoundedRect(x, y, w, h, r) {
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
    TextCenter(Text, x, y, w, h) {
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    }
    TextLeft(Text, x, y, w, h) {
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    }
    TextRight(Text, x, y, w, h) {
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
class BackDrawer {
    constructor() {
        this.Name = "Back";
    }
    Draw(c, Span) {
        c.ctx.fillStyle = "#CCC";
        c.ctx.strokeStyle = "#333";
        c.ctx.fillRect(0, 0, c.S(Game.Wcell * (Game.Wcount + 1)), c.S(Game.Hcell * (Game.Hcount + 1)));
        for (let i = 1; i < Game.Wcount; i++) {
            c.Line(i * Game.Wcell - 1, 1 * Game.Hcell, i * Game.Wcell - 1, 30 * Game.Hcell);
        }
        c.ctx.fillStyle = "#333";
        c.ctx.font = `${c.S(Game.Hcell - 4) << 0}px ${Game.FontName}`;
        c.TextLeft("Life:  " + Game.life.toString(), 0.5 * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
        c.TextLeft("Score: " + Game.score.toString(), 0.5 * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
        c.TextRight("Hint: " + Game.hintCount.toString(), (Game.Wcount - 0.5) * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
        let lvText = (Game.level % NumNodes.LevelToMaxWeighting == 0 ? (Game.level / NumNodes.LevelToMaxWeighting).toString() : Game.level.toString() + "÷" + NumNodes.LevelToMaxWeighting.toString());
        c.TextRight("Lv." + lvText, (Game.Wcount - 0.5) * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2, Game.Hcell);
    }
}
class Dropper {
    constructor() {
        this.Name = "Dropper";
        this.dx = -2;
        this.x = ((Game.Wcount - 1) / 2) << 0;
    }
    BeforeDraw(Elms, Span) {
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
    Draw(c, Span) {
        this.x += this.dx * Span / 1000;
        this.x = (this.x + Game.Wcount) % Game.Wcount;
        c.ctx.fillStyle = "#EEE";
        c.ctx.beginPath();
        c.RoundedRect(this.x * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
        c.ctx.fill();
        if (this.x > Game.Wcount - 1) {
            c.ctx.beginPath();
            c.RoundedRect((this.x - Game.Wcount) * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
            c.ctx.fill();
        }
    }
}
class Shooter {
    constructor() {
        this.Name = "Shooter";
        this.Keymap = [37, 39, 38];
        this.KeySleepMax1 = [6, 6, 9];
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
            e.preventDefault();
            it.KeyMode[tmp] = 1;
        });
        document.addEventListener("keyup", (e) => {
            let tmp = it.Keymap.findIndex((v) => v == e.keyCode);
            if (tmp < 0)
                return;
            e.preventDefault();
            it.KeyMode[tmp] = 0;
        });
        return this;
    }
    BeforeDraw(Elms, Span) {
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
                        Elms.find((v) => v.Name == "Shots").Add(Math.round(this.x + Game.Wcell) % Game.Wcell, this.y);
                        break;
                }
            }
        }, this);
        this.KeyMode = this.KeyMode.map((v) => v == 0 ? 0 : v + 1);
    }
    Draw(c, Span) {
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
        c.ctx.save();
        this.BlinkCount = (this.BlinkCount + 1) % this.BlinkSpeed;
        c.ctx.globalAlpha = Math.sin(Math.PI * 2 * (this.BlinkCount / this.BlinkSpeed)) / 4 + 0.5;
        c.ctx.strokeStyle = "#F00";
        c.Line((this.x + 0.5) * Game.Wcell - 1, 1 * Game.Hcell, (this.x + 0.5) * Game.Wcell - 1, this.y * Game.Hcell);
        c.ctx.stroke();
        c.ctx.restore();
        c.ctx.fillStyle = "#EEE";
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
}
class Shots {
    constructor() {
        this.Name = "Shots";
        this.shots = [];
    }
    Add(x, y) {
        this.shots.push([x, y]);
    }
    Draw(c, Span) {
        c.ctx.fillStyle = "#EEE";
        c.ctx.save();
        c.Shadow();
        c.ctx.beginPath();
        this.shots.forEach((v) => {
            v[1] -= 0.1;
            c.Round((v[0] + 0.5) * Game.Wcell - 0.5, v[1] * Game.Hcell, Shots.Radius * Game.Hcell);
            c.ctx.closePath();
        });
        c.ctx.fill();
        c.ctx.restore();
    }
    AfterDraw(Elms, Span) {
        this.shots = this.shots.filter((shot) => shot[1] > 0);
    }
}
Shots.Radius = 0.2;
class NumNodes {
    constructor() {
        this.Name = "NumNodes";
        this.nums = [];
    }
    Add(x, y, num) {
        this.nums.push([x, y, num ? num : Math.max(2, (Math.random() * Game.level / NumNodes.LevelToMaxWeighting) << 0)]);
    }
    Draw(c, Span) {
        c.ctx.fillStyle = "#EEE";
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
        c.ctx.fillStyle = "#333";
        c.ctx.font = `${c.S(Game.Hcell - 4) << 0}px ${Game.FontName}`;
        this.nums.forEach((v) => {
            c.TextCenter(v[2].toString(), (v[0] + 0.5) * Game.Wcell, (v[1] + 0.5) * Game.Hcell, Game.Wcell - 4, Game.Hcell - 2);
        });
    }
    AfterDraw(Elms, Span) {
        this.nums = this.nums.filter((num) => {
            if (num[1] <= Game.Hcount - 3)
                return true;
            let tmp = Factorization(num[2]);
            if (tmp[0] == 0) {
                Game.score += 11 * num[2];
                Game.level += 11;
            }
            else {
                Game.score -= 17 * num[2];
                Game.level -= 17;
                Game.life -= 1;
            }
            return false;
        });
    }
}
NumNodes.LevelToMaxWeighting = 7;
class Filters {
    constructor() {
        this.Name = "Filters";
        this.filters = [6];
    }
    Add(y) {
        this.filters.push(y);
    }
    Draw(c, Span) {
        c.ctx.strokeStyle = "#5F2";
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
}
Filters.LevelToMaxWeighting = 7;
function OnhitNumShots(num, shots, span) {
    let delNumI = [];
    let delShotI = [];
    for (let si = 0; si < shots.shots.length; si++) {
        if (delShotI.indexOf(si) >= 0)
            break;
        for (let ni = 0; ni < num.nums.length; ni++) {
            if (delNumI.indexOf(ni) >= 0)
                break;
            if (num.nums[ni][0] == shots.shots[si][0] && Math.abs(num.nums[ni][1] - shots.shots[si][1]) < (0.5 + Shots.Radius)) {
                delNumI.push(ni);
                delShotI.push(si);
            }
        }
    }
    while (delShotI.length > 0)
        shots.shots.splice(delShotI.pop(), 1);
    while (delNumI.length > 0) {
        let index = delNumI.pop();
        let tmp = Factorization(num.nums[index][2]);
        if (tmp[0] == 0) {
            Game.score -= 31 * num.nums[index][2];
            Game.level -= 31;
            Game.life -= 3;
        }
        else {
            Game.score += num.nums[index][2];
            Game.level += 3;
            num.Add((num.nums[index][0] + Game.Wcount - 1) % Game.Wcount, num.nums[index][1] - 1, tmp[0]);
            num.Add((num.nums[index][0] + Game.Wcount + 1) % Game.Wcount, num.nums[index][1] - 1, tmp[1]);
        }
        num.nums.splice(index, 1);
    }
}
function OnhitNumNum(num, unused, span) {
    let fusionNumI = [];
    for (let i1 = 0; i1 < num.nums.length; i1++) {
        if (fusionNumI.indexOf(i1) >= 0)
            break;
        for (let i2 = i1 + 1; i2 < num.nums.length; i2++) {
            if (fusionNumI.indexOf(i2) >= 0)
                break;
            if (num.nums[i1][0] == num.nums[i2][0] && Math.abs(num.nums[i1][1] - num.nums[i2][1]) < 1) {
                fusionNumI.push(i1);
                fusionNumI.push(i2);
            }
        }
    }
    if (fusionNumI.length == 0)
        return;
    for (let fusionI = 0; fusionI < fusionNumI.length; fusionI += 2) {
        num.nums.push([num.nums[fusionNumI[fusionI]][0], (num.nums[fusionNumI[fusionI]][1] + num.nums[fusionNumI[fusionI + 1]][1]) / 2, num.nums[fusionNumI[fusionI]][2] + num.nums[fusionNumI[fusionI + 1]][2]]);
    }
    num.nums = num.nums.filter((v, i) => (fusionNumI.indexOf(i) < 0));
    console.log(num.nums.length + ":" + fusionNumI.length);
}
function OnhitFiltersNum(filter, num, span) {
    let delNumI = [];
    for (let fi = 0; fi < filter.filters.length; fi++) {
        for (let ni = 0; ni < num.nums.length; ni++) {
            if (delNumI.indexOf(ni) >= 0)
                break;
            if (Math.abs(num.nums[ni][1] - filter.filters[fi] + 0.5) < 0.5 && Factorization(num.nums[ni][2])[0] == 0) {
                delNumI.push(ni);
            }
        }
    }
    delNumI.sort((a, b) => a - b);
    while (delNumI.length > 0) {
        let index = delNumI.pop();
        Game.score += 7 * num.nums[index][2];
        Game.level += 7;
        num.nums.splice(index, 1);
    }
}
function onTick(Elms, span) {
    const HintPerLivel = 100 * NumNodes.LevelToMaxWeighting;
    if (Game.level > Game.maxLevel) {
        if (((Game.level / HintPerLivel)) << 0 > ((Game.maxLevel / HintPerLivel) << 0)) {
            Game.hintCount++;
        }
        Game.maxLevel = Game.level;
    }
    if (Game.life <= 0) {
        Game.life = 0;
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
    Game.maxLevel = 0;
    Game.life = 20;
    Game.hintCount = 0;
    let c1;
    let Elms = [new BackDrawer(), new Dropper(), new Shooter().Init(), new Shots(), new NumNodes(), new Filters()];
    let OnHit = [
        { Fn: OnhitNumShots, Elm1: "NumNodes", Elm2: "Shots" },
        { Fn: OnhitNumNum, Elm1: "NumNodes", Elm2: "NumNodes" },
        { Fn: OnhitFiltersNum, Elm1: "Filters", Elm2: "NumNodes" }
    ];
    function Init() {
        c1 = new ResizingCanvas(document.getElementById("c1"), document.documentElement, Game.Wcell * Game.Wcount, Game.Hcell * Game.Hcount);
    }
    Game.Init = Init;
    let prevTime = undefined;
    function Tick(pt) {
        if (prevTime === undefined) {
            prevTime = pt;
        }
        Elms.forEach((elm) => {
            if ("BeforeDraw" in elm)
                elm.BeforeDraw(Elms, pt - prevTime);
        });
        Elms.forEach((elm) => {
            if ("Draw" in elm)
                elm.Draw(c1, pt - prevTime);
        });
        Elms.forEach((elm) => {
            if ("AfterDraw" in elm)
                elm.AfterDraw(Elms, pt - prevTime);
        });
        OnHit.forEach((listener) => {
            let tmp1 = Elms.find((v) => v.Name == listener.Elm1);
            if (!tmp1)
                throw "undefined node name";
            let tmp2 = Elms.find((v) => v.Name == listener.Elm2);
            if (!tmp2)
                throw "undefined node name";
            listener.Fn(tmp1, tmp2, pt - prevTime);
        });
        prevTime = pt;
        onTick(Elms, pt - prevTime);
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
