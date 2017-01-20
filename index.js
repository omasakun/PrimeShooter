//TODO: Help-素数色分け機能
var Polyfill;
(function (Polyfill) {
    function Do() {
        var timer = undefined;
        var polyfill = function (callback) {
            if (typeof timer == "number")
                clearTimeout(timer);
            timer = setTimeout(callback, 1000 / 60);
        };
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || polyfill;
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
var ResizingCanvas = (function () {
    function ResizingCanvas(canvas, parent, width, height) {
        var _this = this;
        this.Parent = parent;
        if (canvas.getContext)
            this.ctx = canvas.getContext('2d');
        else
            throw "Canvasが対応していないようです。ChromeやChromeなどのナウいブラウザーを使いなさい";
        var This = this;
        (function (Fn) {
            var i = false;
            window.addEventListener("resize", function () {
                if (typeof i == "number")
                    clearTimeout(i);
                i = setTimeout(Fn, 100);
            });
        })(function () { return _this.OnResize.call(This); });
        this.width = width;
        this.height = height;
        this.OnResize();
    }
    ResizingCanvas.prototype.OnResize = function (dpr) {
        var Canvas = this.ctx.canvas;
        var Scale = Math.min(this.Parent.clientWidth / this.width, this.Parent.clientHeight / this.height);
        Canvas.style.width = Scale * this.width + "px";
        Canvas.style.height = Scale * this.height + "px";
        Scale *= (dpr || window.devicePixelRatio || 1);
        Canvas.width = Scale * this.width;
        Canvas.height = Scale * this.height;
        this.ctx.lineWidth = (dpr || window.devicePixelRatio || 1);
        this.scale = Scale;
    };
    ResizingCanvas.prototype.S = function (pos) {
        return pos * this.scale;
    };
    ResizingCanvas.prototype.Line = function (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.S(x1 + 0.5), this.S(y1 + 0.5));
        this.ctx.lineTo(this.S(x2 + 0.5), this.S(y2 + 0.5));
        this.ctx.stroke();
    };
    ResizingCanvas.prototype.Round = function (x, y, r) {
        this.ctx.arc(this.S(x), this.S(y), this.S(r), 0, 2 * Math.PI, false);
    };
    ResizingCanvas.prototype.RoundedRect = function (x, y, w, h, r) {
        var pxX = this.S(x);
        var pxY = this.S(y);
        var pxW = this.S(w);
        var pxH = this.S(h);
        var pxR = this.S(r);
        this.ctx.moveTo(pxX, pxY + pxR);
        this.ctx.lineTo(pxX, pxY + pxH - pxR);
        this.ctx.quadraticCurveTo(pxX, pxY + pxH, pxX + pxR, pxY + pxH);
        this.ctx.lineTo(pxX + pxW - pxR, pxY + pxH);
        this.ctx.quadraticCurveTo(pxX + pxW, pxY + pxH, pxX + pxW, pxY + pxH - pxR);
        this.ctx.lineTo(pxX + pxW, pxY + pxR);
        this.ctx.quadraticCurveTo(pxX + pxW, pxY, pxX + pxW - pxR, pxY);
        this.ctx.lineTo(pxX + pxR, pxY);
        this.ctx.quadraticCurveTo(pxX, pxY, pxX, pxY + pxR);
    };
    ResizingCanvas.prototype.TextCenter = function (Text, x, y, w) {
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    };
    ResizingCanvas.prototype.TextLeft = function (Text, x, y, w) {
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    };
    ResizingCanvas.prototype.TextRight = function (Text, x, y, w) {
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(Text, this.S(x), this.S(y), this.S(w));
    };
    ResizingCanvas.prototype.Shadow = function () {
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "#000";
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 3;
    };
    return ResizingCanvas;
}());
var BackDrawer = (function () {
    function BackDrawer() {
        this.Name = "Back";
        this.Enabled = true;
    }
    BackDrawer.prototype.Draw = function (c, Span) {
        c.ctx.fillStyle = "#CCC"; //const
        c.ctx.strokeStyle = "#333"; //const
        c.ctx.fillRect(0, 0, c.S(Game.Wcell * (Game.Wcount + 1)), c.S(Game.Hcell * (Game.Hcount + 1)));
        for (var i = 1; i < Game.Wcount; i++) {
            c.Line(i * Game.Wcell - 1, 1 * Game.Hcell, i * Game.Wcell - 1, 30 * Game.Hcell);
        }
        c.ctx.fillStyle = "#333"; //const
        c.ctx.font = (c.S(Game.Hcell - 4) << 0) + "px " + Game.FontName;
        c.TextLeft("Life:  " + Game.life.toString(), 0.5 /*const*/ * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2);
        c.TextLeft("Score: " + Game.score.toString(), 0.5 /*const*/ * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2);
        c.TextRight("Hint: " + Game.hintCount.toString(), (Game.Wcount - 0.5 /*const*/) * Game.Wcell, Game.Hcell * (Game.Hcount - 1 + 0.5), Game.Wcell * Game.Wcount / 2);
        var lvText = (Game.level % NumNodes.LevelToMaxWeighting == 0 ? (Game.level / NumNodes.LevelToMaxWeighting).toString() : Game.level.toString() + "÷" + NumNodes.LevelToMaxWeighting.toString());
        c.TextRight("Lv." + lvText, (Game.Wcount - 0.5 /*const*/) * Game.Wcell, Game.Hcell * (Game.Hcount - 2 + 0.5), Game.Wcell * Game.Wcount / 2);
    };
    return BackDrawer;
}()); //Name:Back
var Dropper = (function () {
    function Dropper() {
        this.Name = "Dropper";
        this.Enabled = true;
        this.dx = -3; //const per 1sec
        this.x = ((Game.Wcount - 1) / 2) << 0;
    }
    Dropper.prototype.BeforeDraw = function (Elms, Span) {
        var TurnProbability = 0.4;
        var DropProbability = 0.2;
        if ((this.x << 0) != (this.x + this.dx * Span / 1000) << 0) {
            this.x = (this.x + this.dx * Span / 1000);
            if (Math.random() < TurnProbability)
                this.dx *= -1;
            if (Math.random() < DropProbability) {
                Elms.find(function (v) { return v.Name == "NumNodes"; }).Add(Math.round(this.x + Game.Wcell) % Game.Wcell, 0);
            }
        }
    };
    Dropper.prototype.Draw = function (c, Span) {
        this.x += this.dx * Span / 1000;
        this.x = (this.x + Game.Wcount) % Game.Wcount;
        c.ctx.fillStyle = "#EEE"; //const
        c.ctx.beginPath();
        c.RoundedRect(this.x * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
        c.ctx.fill();
        if (this.x > Game.Wcount - 1) {
            c.ctx.beginPath();
            c.RoundedRect((this.x - Game.Wcount) * Game.Wcell, 0, Game.Wcell - 1, Game.Hcell, Game.Rcell);
            c.ctx.fill();
        }
    };
    return Dropper;
}()); //Name: Dropper
var Shooter = (function () {
    function Shooter() {
        this.Name = "Shooter";
        this.Enabled = true;
        this.Keymap = [37, 39, 38, 72]; //CONST Left Right Shot Help
        this.KeySleepMax1 = [9, 9, 9, Infinity]; //CONST
        this.KeySleepMax2 = [6, 6, 3, Infinity]; //CONST
        this.KeyMode = [0, 0, 0]; //0:Not pressed 1+:pressed tick count
        this.dx = 0; //per tick
        this.x = ((Game.Wcount - 1) / 2) << 0;
        this.y = 28; //CONST
        this.BlinkCount = 0;
        this.BlinkSpeed = 100; //const
    }
    Shooter.prototype.Init = function () {
        var it = this;
        document.addEventListener("keydown", function (e) {
            if (e.repeat)
                return;
            var tmp = it.Keymap.findIndex(function (v) { return v == e.keyCode; });
            if (tmp < 0)
                return;
            e.preventDefault();
            it.KeyMode[tmp] = 1;
        });
        document.addEventListener("keyup", function (e) {
            var tmp = it.Keymap.findIndex(function (v) { return v == e.keyCode; });
            if (tmp < 0)
                return;
            e.preventDefault();
            it.KeyMode[tmp] = 0;
        });
        return this;
    };
    Shooter.prototype.BeforeDraw = function (Elms, Span) {
        var _this = this;
        this.KeyMode.forEach(function (v, i) {
            if (v == 0)
                return;
            if (v == 1 || ((v - _this.KeySleepMax1[i]) % _this.KeySleepMax2[i] == 0 && v >= _this.KeySleepMax1[i])) {
                switch (i) {
                    case 0:
                        _this.dx = -0.5; //CONST
                        break;
                    case 1:
                        _this.dx = 0.5; //CONST
                        break;
                    case 2:
                        Elms.find(function (v) { return v.Name == "Shots"; }).Add(Math.round(_this.x + Game.Wcell) % Game.Wcell, _this.y);
                        break;
                    case 3:
                        Elms.find(function (v) { return v.Name == "NumNodes"; }).Hint();
                }
            }
        }, this);
        this.KeyMode = this.KeyMode.map(function (v) { return v == 0 ? 0 : v + 1; });
    };
    Shooter.prototype.Draw = function (c, Span) {
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
        c.ctx.strokeStyle = "#F00"; //const
        c.Line((this.x + 0.5) * Game.Wcell - 1, 1 * Game.Hcell, (this.x + 0.5) * Game.Wcell - 1, this.y * Game.Hcell);
        c.ctx.stroke();
        c.ctx.restore();
        c.ctx.fillStyle = "#EEE"; //const
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
    };
    return Shooter;
}()); //Name; Shooter
var Shots = (function () {
    function Shots() {
        this.Name = "Shots";
        this.Enabled = true;
        this.shots = [];
    }
    Shots.prototype.Add = function (x, y) {
        this.shots.push([x, y]);
    };
    Shots.prototype.Clear = function () {
        this.shots = [];
    };
    Shots.prototype.Draw = function (c, Span) {
        c.ctx.fillStyle = "#EEE"; //const
        c.ctx.save();
        c.Shadow();
        c.ctx.beginPath();
        this.shots.forEach(function (v) {
            v[1] -= 0.3; //const
            c.Round((v[0] + 0.5) * Game.Wcell - 0.5, v[1] * Game.Hcell, Shots.Radius * Game.Hcell);
            c.ctx.closePath();
        });
        c.ctx.fill();
        c.ctx.restore();
    };
    Shots.prototype.AfterDraw = function (Elms, Span) {
        this.shots = this.shots.filter(function (shot) { return shot[1] > 0; });
    };
    return Shots;
}()); //Name: Shots
Shots.Radius = 0.2; //const
var NumNodes = (function () {
    function NumNodes() {
        this.Name = "NumNodes";
        this.Enabled = true;
        this.nums = []; //x,y,num,Color
    }
    NumNodes.prototype.Add = function (x, y, num) {
        this.nums.push([x, y, num ? num : Math.max(2, (Math.random() * Game.level / NumNodes.LevelToMaxWeighting) << 0) /*TODO: Factor Count limit*/, 0]);
    };
    NumNodes.prototype.Hint = function () {
        if (Game.hintCount <= 0)
            return;
        Game.hintCount--;
        this.nums.forEach(function (num) {
            if (Factorization(num[2])[0] == 0) {
                num[3] = 1;
            }
            else {
                num[3] = 2;
            }
        });
    };
    NumNodes.prototype.Draw = function (c, Span) {
        this.nums.forEach(function (v) { return v[1] += 0.01; } /*const*/);
        c.ctx.save();
        c.Shadow();
        var _loop_1 = function (tmp) {
            c.ctx.fillStyle = NumNodes.Colors[tmp];
            c.ctx.beginPath();
            this_1.nums.forEach(function (v) {
                if (v[3] != tmp)
                    return;
                c.RoundedRect(v[0] * Game.Wcell, v[1] * Game.Hcell, Game.Wcell - 1, Game.Hcell, Game.Rcell);
                c.ctx.closePath();
            });
            c.ctx.fill();
        };
        var this_1 = this;
        for (var tmp = 0; tmp < NumNodes.Colors.length; tmp++) {
            _loop_1(tmp);
        }
        c.ctx.restore();
        c.ctx.fillStyle = "#333"; //const
        c.ctx.font = (c.S(Game.Hcell - 4) << 0) + "px " + Game.FontName;
        this.nums.forEach(function (v) {
            c.TextCenter(v[2].toString(), (v[0] + 0.5) * Game.Wcell, (v[1] + 0.5) * Game.Hcell, Game.Wcell - 4);
        });
    };
    NumNodes.prototype.AfterDraw = function (Elms, Span) {
        this.nums = this.nums.filter(function (num) {
            if (num[1] <= Game.Hcount - 3)
                return true; //CONST
            var tmp = Factorization(num[2]);
            if (tmp[0] == 0) {
                Game.score += 11 * num[2]; //CONST
                Game.level += 11; //CONST
            }
            else {
                Game.score -= 17 * num[2]; //CONST
                Game.level -= 17; //CONST
                Game.life -= 1; //CONST
            }
            return false;
        });
    };
    return NumNodes;
}()); //Name: NumNodes
NumNodes.LevelToMaxWeighting = 7;
NumNodes.Colors = ["#EEE", "#DFD", "#FDD"]; //const
var Filters = (function () {
    function Filters() {
        this.Name = "Filters";
        this.Enabled = true;
        this.filters = []; //y
    }
    Filters.prototype.Add = function (y) {
        this.filters.push(y);
    };
    Filters.prototype.Draw = function (c, Span) {
        c.ctx.strokeStyle = "#5F2"; //const
        c.ctx.save();
        c.Shadow();
        c.ctx.beginPath();
        this.filters.forEach(function (y) {
            c.ctx.moveTo(0, c.S(Game.Hcell * y));
            c.ctx.lineTo(c.S(Game.Wcell * Game.Wcount), c.S(Game.Hcell * y));
        });
        c.ctx.stroke();
        c.ctx.restore();
    };
    return Filters;
}()); //Name: Filters
Filters.LevelToMaxWeighting = 7;
var ButtonNodes = (function () {
    function ButtonNodes() {
        this.Name = "ButtonNodes";
        this.Enabled = true;
        this.texts = []; //x,y,num
    }
    ButtonNodes.prototype.Add = function (x, y, w, h, text, fontsize, fn) {
        this.texts.push({ x: x, y: y, w: w, h: h, text: text, fontsize: fontsize, fn: fn });
    };
    ButtonNodes.prototype.Clear = function () {
        this.texts = [];
    };
    ButtonNodes.prototype.Draw = function (c, Span) {
        c.ctx.fillStyle = "#EEE"; //const
        c.ctx.save();
        c.Shadow();
        c.ctx.beginPath();
        this.texts.forEach(function (v) {
            c.RoundedRect(v.x * Game.Wcell, v.y * Game.Hcell, v.w * Game.Wcell, v.h * Game.Hcell, Game.Rcell);
            c.ctx.closePath();
        });
        c.ctx.fill();
        c.ctx.restore();
        c.ctx.fillStyle = "#333"; //const
        this.texts.forEach(function (v) {
            c.ctx.font = (c.S(Game.Hcell * v.fontsize - 4) << 0) + "px " + Game.FontName;
            c.TextCenter(v.text, (v.x + v.w / 2) * Game.Wcell, (v.y + v.h / 2) * Game.Hcell, Game.Wcell * v.w - 4);
        });
    };
    return ButtonNodes;
}()); //Name: ButtonNodes
ButtonNodes.LevelToMaxWeighting = 7;
function OnhitNumShots(num, shots, span) {
    var delNumI = [];
    var delShotI = [];
    for (var si = 0; si < shots.shots.length; si++) {
        if (delShotI.indexOf(si) >= 0)
            break;
        for (var ni = 0; ni < num.nums.length; ni++) {
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
        var index = delNumI.pop();
        var tmp = Factorization(num.nums[index][2]);
        if (tmp[0] == 0) {
            Game.score -= 31 * num.nums[index][2]; //CONST
            Game.level -= 31; //CONST
            Game.life -= 3; //const
        }
        else {
            Game.score += num.nums[index][2]; //CONST
            Game.level += 3; //CONST
            num.Add((num.nums[index][0] + Game.Wcount - 1) % Game.Wcount, num.nums[index][1] - 1, tmp[0]);
            num.Add((num.nums[index][0] + Game.Wcount + 1) % Game.Wcount, num.nums[index][1] - 1, tmp[1]);
        }
        num.nums.splice(index, 1);
    }
}
function OnhitNumNum(num, unused, span) {
    var fusionNumI = [];
    for (var i1 = 0; i1 < num.nums.length; i1++) {
        if (fusionNumI.indexOf(i1) >= 0)
            break;
        for (var i2 = i1 + 1; i2 < num.nums.length; i2++) {
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
    for (var fusionI = 0; fusionI < fusionNumI.length; fusionI += 2) {
        num.Add(num.nums[fusionNumI[fusionI]][0], (num.nums[fusionNumI[fusionI]][1] + num.nums[fusionNumI[fusionI + 1]][1]) / 2, num.nums[fusionNumI[fusionI]][2] + num.nums[fusionNumI[fusionI + 1]][2]);
    }
    num.nums = num.nums.filter(function (v, i) { return (fusionNumI.indexOf(i) < 0); });
    console.log(num.nums.length + ":" + fusionNumI.length);
}
function OnhitFiltersNum(filter, num, span) {
    var delNumI = [];
    for (var fi = 0; fi < filter.filters.length; fi++) {
        for (var ni = 0; ni < num.nums.length; ni++) {
            if (delNumI.indexOf(ni) >= 0)
                break;
            if (Math.abs(num.nums[ni][1] - filter.filters[fi] + 0.5) < 0.5 && Factorization(num.nums[ni][2])[0] == 0) {
                delNumI.push(ni);
            }
        }
    }
    delNumI.sort(function (a, b) { return a - b; });
    while (delNumI.length > 0) {
        var index = delNumI.pop();
        Game.score += 7 * num.nums[index][2]; //CONST
        Game.level += 7; //CONST
        num.nums.splice(index, 1);
    }
}
function OnhitBtnShots(btn, shots, span) {
    var delBtnI = [];
    var delShotI = [];
    for (var si = 0; si < shots.shots.length; si++) {
        if (delShotI.indexOf(si) >= 0)
            break;
        for (var bi = 0; bi < btn.texts.length; bi++) {
            if (delBtnI.indexOf(bi) >= 0)
                break;
            if (btn.texts[bi].y - Shots.Radius <= shots.shots[si][1] && btn.texts[bi].y + btn.texts[bi].h + Shots.Radius >= shots.shots[si][1])
                if (btn.texts[bi].x <= shots.shots[si][0] && btn.texts[bi].x + btn.texts[bi].w - 1 >= shots.shots[si][0]) {
                    delBtnI.push(bi);
                    delShotI.push(si);
                }
        }
    }
    while (delShotI.length > 0)
        shots.shots.splice(delShotI.pop(), 1);
    while (delBtnI.length > 0) {
        var index = delBtnI.pop();
        btn.texts[index].fn();
    }
}
function onLoad(Elms) {
    Elms.find(function (e) { return e.Name == "Dropper"; }).Enabled = false;
    Elms.find(function (e) { return e.Name == "NumNodes"; }).Enabled = false;
    Elms.find(function (e) { return e.Name == "Filters"; }).Enabled = false;
    var btns = Elms.find(function (e) { return e.Name == "ButtonNodes"; });
    if (btns instanceof ButtonNodes) {
        btns.Add(1, 1, Game.Wcount - 2, 3, "Prime Shooter", 2, function () { return btns.texts[0].text = btns.texts[0].text == "Prime Shooter" ? "Do you like 13?" : "Prime Shooter"; });
        btns.Add(1, 10, 3, 2, "Start", 1.5, function () {
            Elms.find(function (e) { return e.Name == "Dropper"; }).Enabled = true;
            Elms.find(function (e) { return e.Name == "NumNodes"; }).Enabled = true;
            Elms.find(function (e) { return e.Name == "Filters"; }).Enabled = true;
            Elms.find(function (e) { return e.Name == "ButtonNodes"; }).Enabled = false;
            Elms.find(function (e) { return e.Name == "Shots"; }).Clear();
            AddFilter(Elms);
        });
        btns.Add(Game.Wcount - 4, 10, 3, 2, "Help", 1.5, function () {
            document.getElementById("help").classList.toggle("hide");
        });
    }
    else
        throw "ERROR";
}
function onTick(Elms, span) {
    var HintPerLivel = 13 * NumNodes.LevelToMaxWeighting;
    var FilterPerLivel = 97 * NumNodes.LevelToMaxWeighting;
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
        Game.life = 0;
        Elms.find(function (e) { return e.Name == "Dropper"; }).Enabled = false;
        Elms.find(function (e) { return e.Name == "NumNodes"; }).Enabled = false;
        Elms.find(function (e) { return e.Name == "Filters"; }).Enabled = false;
        var btns = Elms.find(function (e) { return e.Name == "ButtonNodes"; });
        if (btns instanceof ButtonNodes) {
            btns.Clear();
            btns.Add(1, 10, 3, 2, "Add to ranking", 1.5, function () {
            });
        }
        else
            throw "ERROR";
    }
}
function AddFilter(Elms) {
    Elms.find(function (e) { return e.Name == "Dropper"; }).Enabled = false;
    Elms.find(function (e) { return e.Name == "NumNodes"; }).Enabled = false;
    var tmp = Elms.find(function (e) { return e.Name == "Filters"; });
    if (tmp instanceof Filters) {
        tmp.Add(5);
    }
    var btns = Elms.find(function (e) { return e.Name == "ButtonNodes"; });
    if (btns instanceof ButtonNodes) {
        btns.Enabled = true;
        btns.Clear();
        btns.Add(1, 10, 1, 2, "↑", 1.5, function () {
            var tmp = Elms.find(function (e) { return e.Name == "Filters"; });
            if (tmp instanceof Filters) {
                tmp.filters[tmp.filters.length - 1] = Math.min(Game.Hcount - 5, Math.max(0, tmp.filters[tmp.filters.length - 1] - 1));
            }
        });
        btns.Add(2, 10, 1, 2, "↓", 1.5, function () {
            var tmp = Elms.find(function (e) { return e.Name == "Filters"; });
            if (tmp instanceof Filters) {
                tmp.filters[tmp.filters.length - 1] = Math.min(Game.Hcount - 5, Math.max(0, tmp.filters[tmp.filters.length + 1] - 1));
            }
        });
        btns.Add(3, 10, Game.Wcount - 4, 2, "Enter", 1.5, function () {
            Elms.find(function (e) { return e.Name == "Dropper"; }).Enabled = true;
            Elms.find(function (e) { return e.Name == "NumNodes"; }).Enabled = true;
            Elms.find(function (e) { return e.Name == "ButtonNodes"; }).Enabled = false;
        });
    }
    else
        throw "ERROR";
}
var Game;
(function (Game) {
    Game.Wcount = 9; //CellWidth+BorderWidth
    Game.Hcount = 32; //Dropper:1 Nodes:27 Shooter:1 Margin:1 UI:2 => sum:32
    Game.Wcell = 34;
    Game.Hcell = 20;
    Game.Rcell = 5;
    Game.FontName = "monospace";
    Game.score = 0;
    Game.level = 1;
    Game.maxLevel = 0;
    Game.life = 20; //const
    Game.hintCount = 0;
    var c1;
    var Elms = [new BackDrawer(), new Dropper(), new Shooter().Init(), new Shots(), new NumNodes(), new Filters(), new ButtonNodes()];
    var OnHit = [
        { Fn: OnhitBtnShots, Elm1: "ButtonNodes", Elm2: "Shots" },
        { Fn: OnhitNumShots, Elm1: "NumNodes", Elm2: "Shots" },
        { Fn: OnhitNumNum, Elm1: "NumNodes", Elm2: "NumNodes" },
        { Fn: OnhitFiltersNum, Elm1: "Filters", Elm2: "NumNodes" }
    ];
    function Init() {
        c1 = new ResizingCanvas(document.getElementById("c1"), document.documentElement, Game.Wcell * Game.Wcount, Game.Hcell * Game.Hcount);
        onLoad(Elms);
    }
    Game.Init = Init;
    var prevTime = undefined;
    function Tick(pt) {
        if (prevTime === undefined) {
            prevTime = pt;
        }
        Elms.forEach(function (elm) {
            if ("BeforeDraw" in elm && elm.Enabled)
                elm.BeforeDraw(Elms, pt - prevTime);
        });
        Elms.forEach(function (elm) {
            if ("Draw" in elm && elm.Enabled)
                elm.Draw(c1, pt - prevTime);
        });
        Elms.forEach(function (elm) {
            if ("AfterDraw" in elm && elm.Enabled)
                elm.AfterDraw(Elms, pt - prevTime);
        });
        OnHit.forEach(function (listener) {
            var tmp1 = Elms.find(function (v) { return v.Name == listener.Elm1; });
            if (!tmp1)
                throw "undefined node name";
            var tmp2 = Elms.find(function (v) { return v.Name == listener.Elm2; });
            if (!tmp2)
                throw "undefined node name";
            if (tmp1.Enabled && tmp2.Enabled)
                listener.Fn(tmp1, tmp2, pt - prevTime);
        });
        prevTime = pt;
        onTick(Elms, pt - prevTime);
    }
    Game.Tick = Tick;
})(Game || (Game = {}));
//--Main
Polyfill.Do();
window.addEventListener("load", function () {
    Game.Init();
    function Tick() {
        Game.Tick(GetTime());
        requestAnimationFrame(Tick);
    }
    Tick();
});
document.body.removeChild(document.getElementById('message'));
