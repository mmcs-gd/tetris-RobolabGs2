function t(t,e,i,o){Object.defineProperty(t,e,{get:i,set:o,enumerable:!0,configurable:!0})}var e={};t(e,"drawPiece",(()=>a),(t=>a=t)),t(e,"drawField",(()=>p),(t=>p=t)),t(e,"setupPieceView",(()=>w),(t=>w=t));var i=function(){function t(t){var e=this;if(this.mask=t,this.size=this.mask.length,t.some((function(t){return t.length!=e.size})))throw new Error("Invalid mask: dimensions mismatch. \n".concat(t.map((function(t){return t.join(", ")})).join("\n")))}return t.prototype.get=function(t,e,i){switch(void 0===i&&(i=0),i){case 0:return this.mask[t][e];case 1:return this.mask[e][this.size-t-1];case 2:return this.mask[this.size-t-1][this.size-e-1];case 3:return this.mask[this.size-e-1][t];default:throw new Error("Unexpected rotation ".concat(i))}},t.prototype.forEach=function(t,e){void 0===e&&(e=0);for(var i=0;i<this.size;i++)for(var o=0;o<this.size;o++)this.get(o,i,e)&&t(i,o)},t}(),o=function(){function t(t,e,i,o){this.row=t,this.column=e,this.color=i,this.mask=o,this.rotation=0,this.size=this.mask.size}return t.prototype.shift=function(t,e){this.row+=t,this.column+=e},t.prototype.rotate=function(t){void 0===t&&(t=1),this.rotation=(this.rotation+4+t)%4},t.prototype.forEach=function(t){var e=this;this.mask.forEach((function(i,o){t(e.column+i,e.row+o)}),this.rotation)},t.prototype.any=function(t){for(var e=0;e<this.size;e++)for(var i=0;i<this.size;i++)if(this.mask.get(i,e,this.rotation)&&t(this.column+e,this.row+i))return!0;return!1},t}(),n=function(t,e,i){if(i||2===arguments.length)for(var o,n=0,r=e.length;n<r;n++)!o&&n in e||(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))};function r(t,e,i){var o=s(e,i);c(t,o[0],o[1])}function s(t,e,i){return void 0===i&&(i=22),[t*i+1,e*i+1]}function c(t,e,i,o,n,r,s,c){if(void 0===o&&(o=20),void 0===n&&(n=20),void 0===r&&(r=5),void 0===s&&(s=!0),void 0===c&&(c=!0),void 0===c&&(c=!0),"number"==typeof r)r={tl:r,tr:r,br:r,bl:r};else{var a={tl:0,tr:0,br:0,bl:0};for(var l in a)r[l]=r[l]||a[l]}t.beginPath(),t.moveTo(e+r.tl,i),t.lineTo(e+o-r.tr,i),t.quadraticCurveTo(e+o,i,e+o,i+r.tr),t.lineTo(e+o,i+n-r.br),t.quadraticCurveTo(e+o,i+n,e+o-r.br,i+n),t.lineTo(e+r.bl,i+n),t.quadraticCurveTo(e,i+n,e,i+n-r.bl),t.lineTo(e,i+r.tl),t.quadraticCurveTo(e,i,e+r.tl,i),t.closePath(),s&&t.fill(),c&&t.stroke()}function a(t,e,i,o){void 0===i&&(i=!0),void 0===o&&(o=!1),e.fillStyle=t.color,e.strokeStyle=t.color,e.save(),e.translate.apply(e,s(t.column,t.row)),l(t.mask,e,i,o,t.rotation),e.restore()}function l(t,e,i,o,r,a){void 0===i&&(i=!0),void 0===o&&(o=!1),void 0===a&&(a=22),t.forEach((function(t,r){c.apply(void 0,n(n([e],s(t,r,a),!1),[a-2,a-2,a/4,i,o],!1))}),r)}function h(t,e,i){void 0===i&&(i=1),e.forEach((function(e,o){for(var n=0;n<t.colums;n++)for(var r=0;r<t.rows;r++){var s=Math.pow(Math.abs(n-e),2)+Math.pow(Math.abs(r-o),2);t.add(n,r,1/(1+i*s))}}))}function u(t,e,i){e.forEach((function(e,o,n){i.globalAlpha=t.get(o,n);i.strokeStyle="rgba(".concat(68,", ").concat(68,", ").concat(68,")");var c=s(o,n),a=c[0],l=c[1];i.strokeRect(a-1,l-1,22,22),(i.fillStyle=e||"")&&r(i,o,n)})),i.globalAlpha=1}var f=function(){function t(t,e){this.colums=t,this.rows=e,this.map=new Array(this.colums*this.rows).fill(0)}return t.prototype.index=function(t,e){return t*this.rows+e},t.prototype.add=function(t,e,i){var o=this.index(t,e);this.map[o]=Math.min(1,this.map[o]+i)},t.prototype.sub=function(t,e,i){var o=this.index(t,e);this.map[o]=Math.max(0,this.map[o]-i)},t.prototype.get=function(t,e){return this.map[this.index(t,e)]},t}(),d=function(){function t(t,e,i){this.map1=t,this.map2=e,this.merge=i}return t.prototype.get=function(t,e){return this.merge(this.map1.get(t,e),this.map2.get(t,e))},t}();function p(t,e,n,r,s){var c=new f(t.colums,t.rows),a=new f(t.colums,t.rows);!function(t,e,i){var o=new Array(e.colums).fill(1);e.forEachDownUp((function(e,n,r){t.add(n,r,o[n]),e&&(o[n]*=i)}))}(c,t,Math.max(.5,1-.05*r)),function(t,e){e.forEach((function(e){for(var i=0;i<t.colums;i++)for(var o=0;o<t.rows;o++){var n=Math.abs(o-e);t.add(i,o,1/(1+n))}}))}(c,s.flat(1)),h(a,n||new o(0,5,"",new i([[1,1],[1,1]])),r/30),u(new d(c,a,(function(t,e){return Math.max(t,e)})),t,e),e.fillStyle="#f009",s.forEach((function(i){return i.forEach((function(i){return e.fillRect(0,22*i,22*t.colums,22)}))}))}var v,m=document.createElement("canvas"),y=document.querySelector("style").sheet;function w(t,e){m.width=4*t*(e.length+1),m.height=4*t;var i=m.getContext("2d");i.clearRect(0,0,m.width,m.height);var o=new Map;o.set(void 0,0),o.set(null,0),i.translate(4*t,0),e.forEach((function(e,n){var r=e[0],s=e[1];o.set(s,n+1),i.fillStyle=r;var c=(4-s.size)/2;i.translate(t*c,t*c),l(s,i,!0,!1,0,t),i.translate(t*(4-c),-t*c)}));var n=m.toDataURL();return v&&y.deleteRule(v),v=y.insertRule(".piece-view { \n        background-image: url(".concat(n,");\n        width: ").concat(4*t,"px; \n        height: ").concat(4*t,"px;\n    }"),y.cssRules.length),function(e,i){e.style.backgroundPositionX="-".concat(4*t*o.get(i),"px")}}var g={};t(g,"PIECES",(()=>_),(t=>_=t)),t(g,"Actions",(()=>P),(t=>P=t)),t(g,"Game",(()=>k),(t=>k=t));var b,P,A=function(){function t(t,e){this.rows=t,this.colums=e,this.bottomRow=this.rows-1,this.field=new Array(t),this.filledLine=new Array(e).fill("orange");for(var i=0;i<t;i++)this.field[i]=new Array(e).fill(null)}return t.prototype.pieceSpaceIsUnoccupied=function(t){var e=this;return!t.any((function(t,i){return t<0||t>=e.colums||i<0||i>=e.rows||null!==e.field[i][t]}))},t.prototype.hasTouchBottom=function(t){var e=this;return t.any((function(t,i){return i===e.bottomRow||null!==e.field[i+1][t]}))},t.prototype.append=function(t){var e=this;t.forEach((function(i,o){e.field[o][i]=t.color}));for(var i=new Array,o=t.row;o<Math.min(t.row+t.size,this.rows);o++)this.field[o].every((function(t){return null!==t}))&&i.push(o);return i},t.prototype.clear=function(t){for(var e=0,i=t;e<i.length;e++){for(var o=i[e];o>0;o--)this.field[o]=this.field[o-1];this.field[0]=new Array(this.colums).fill(null)}},t.prototype.forEach=function(t){for(var e=0;e<this.rows;e++)for(var i=0;i<this.colums;i++)t(this.field[e][i],i,e)},t.prototype.forEachDownUp=function(t){for(var e=this.rows-1;0<=e;e--)for(var i=0;i<this.colums;i++)t(this.field[e][i],i,e)},t}(),E=function(){function t(){this.listeners=new Proxy({},{get:function(t,e,i){var o=Reflect.get(t,e,i);return void 0!==o||(o=[],Reflect.set(t,e,o,i)),o}})}return t.prototype.addEventListener=function(t,e){return this.listeners[t].push(e)-1},t.prototype.removeEventListener=function(t,e){delete this.listeners[t][e]},t.prototype.dispatchEvent=function(t,e){var i=this;this.listeners[t].forEach((function(t){return t.call(i,e)}))},t}(),L=(b=function(t,e){return(b=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function i(){this.constructor=t}b(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),x=function(t,e,i){if(i||2===arguments.length)for(var o,n=0,r=e.length;n<r;n++)!o&&n in e||(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))},S=["#45FD6B","#FC393E","#FED248","#3B73FB","#DBE1F1","#00F0F0","#A000F0"],_=[[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],[[1,1],[1,1]],[[1,0,0],[1,1,1],[0,0,0]],[[0,0,1],[1,1,1],[0,0,0]],[[0,1,0],[1,1,1],[0,0,0]],[[0,1,1],[1,1,0],[0,0,0]],[[1,1,0],[0,1,1],[0,0,0]]].map((function(t,e){return[S[e],new i(t)]}));!function(t){t[t.MoveLeft=0]="MoveLeft",t[t.MoveRight=1]="MoveRight",t[t.RotateLeft=2]="RotateLeft",t[t.RotateRight=3]="RotateRight",t[t.SoftDrop=4]="SoftDrop",t[t.HardDrop=5]="HardDrop",t[t.Hold=6]="Hold",t[t.Hold_1=7]="Hold_1",t[t.Hold_2=8]="Hold_2",t[t.Hold_3=9]="Hold_3"}(P||(P={}));var R=function(){function t(t,e,i){this.linesPerLevel=t,this.onScoreUpdated=e,this.shiftLevel=i,this.lines=0,this._score=0}return Object.defineProperty(t.prototype,"score",{get:function(){return this._score},set:function(t){this._score+=this.level*(t-this._score),this.onScoreUpdated(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"level",{get:function(){return Math.floor(this.lines/this.linesPerLevel)+this.shiftLevel},enumerable:!1,configurable:!0}),t}(),k=function(t){function i(e,i,n,r){void 0===e&&(e=1),void 0===i&&(i=0),void 0===n&&(n=10),void 0===r&&(r=1);var s=t.call(this)||this;return s.linesPerLevel=n,s.shiftLevel=r,s.filledLines=new Array,s.statistics=new R(s.linesPerLevel,(function(t){return s.dispatchEvent("updateScore",t)}),s.shiftLevel),s.activePiece=new(o.bind.apply(o,x([void 0,0,5],M(_),!1))),s.holdIndex=0,s.field=new A(24,12),s.shiftTime=60,s.lastShift=0,s.freezeAfter=s.freezeCooldown,s.buttonStates=new Array,s.prevTime=0,s.currentTime=0,s.nextPieces=new Array(Math.max(1,e)).fill(null).map((function(){return new(o.bind.apply(o,x([void 0,0,5],M(_),!1)))})),s.holdedPiece=new Array(i).fill(null),s.holded=new Array(i).fill(!1),setTimeout((function(){return s.dispatchEvent("nextLevel",s.statistics)}),0),s}return L(i,t),Object.defineProperty(i.prototype,"maxHold",{set:function(t){if(this.holdedPiece.length>t)this.holdedPiece=this.holdedPiece.slice(0,t);else{for(var e=this.holdedPiece.length;e<t;e++)this.holdedPiece.push(null);this.holded.push(!1)}},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"maxHistory",{set:function(t){if(this.nextPieces.length>t)this.nextPieces=this.nextPieces.slice(0,t);else for(var e=this.nextPieces.length;e<t;e++)this.nextPieces.push(new(o.bind.apply(o,x([void 0,0,5],M(_),!1))))},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"freezeCooldown",{get:function(){return Math.max(30,1e3-40*Math.min(10,this.statistics.level-1)-30*(this.statistics.level-1))},enumerable:!1,configurable:!0}),i.prototype.update=function(t,e){var i=this.activePiece,n=this.field;this.currentTime=e;var r=e-this.prevTime;if(this.prevTime=e,this.freezeAfter-=r,this.filledLines[0]&&this.filledLines[0][0]<=e&&(this.field.clear(this.filledLines[0][1]),this.filledLines.shift()),i)this.freezeAfter<=0&&(n.hasTouchBottom(i)?this.fixPiece(n,i):(this.pieceDown(i),this.freezeAfter=this.freezeCooldown)),this.processInput(this.buttonStates,t,e);else{if(this.nextPieces.push(new(o.bind.apply(o,x([void 0,0,5],M(_),!1)))),this.activePiece=this.nextPieces.shift(),this.freezeAfter=this.freezeCooldown,this.holdIndex=0,this.holded.fill(!1),!n.pieceSpaceIsUnoccupied(this.activePiece))return!0;this.dispatchEvent("drop",this.nextPieces)}return this.buttonStates=x([],t,!0),!1},i.prototype.fixPiece=function(t,e){var i=this.statistics.level,o=t.append(e),n=o.length;n&&this.filledLines.push([this.currentTime+200,o]),this.statistics.lines+=n,this.statistics.score+=[0,100,300,500,800][n],this.activePiece=null,i!=this.statistics.level&&this.dispatchEvent("nextLevel",this.statistics)},i.prototype.processInput=function(t,e,i){for(var o=!1,n=0;n<e.length;n++)if(e[n])if(t[n]){if(i-this.lastShift>=this.shiftTime)switch(o=!0,n){case P.MoveRight:this.tryShift(0,1);break;case P.MoveLeft:this.tryShift(0,-1);break;case P.SoftDrop:this.activePiece&&this.pieceDown(this.activePiece)&&(this.statistics.score++,this.freezeAfter=this.freezeCooldown);break;default:o=!1}}else switch(n){case P.RotateRight:this.tryRotate(-1);break;case P.RotateLeft:this.tryRotate(1);break;case P.HardDrop:this.activePiece&&(this.statistics.score+=2*this.pieceHardDown(this.activePiece),this.fixPiece(this.field,this.activePiece));break;case P.Hold:if(this.activePiece)for(;this.holdIndex<this.holdedPiece.length&&!this.hold(this.holdIndex);)this.holdIndex++;break;case P.Hold_1:this.hold(0);break;case P.Hold_2:this.hold(1);break;case P.Hold_3:this.hold(2)}o&&(this.lastShift=i)},i.prototype.hold=function(t){if(t<this.holdedPiece.length&&this.activePiece&&!this.holded[t]){this.activePiece.row=0,this.activePiece.column=5;var e=this.holdedPiece[t];return this.holdedPiece[t]=this.activePiece,this.activePiece=e,this.holded[t]=!0,this.dispatchEvent("hold",this.holdedPiece),!0}return!1},i.prototype.pieceDown=function(t){return!this.field.hasTouchBottom(t)&&(t.shift(1,0),!0)},i.prototype.pieceHardDown=function(t){for(var e=0;this.pieceDown(t);)++e;return e},i.prototype.tryShift=function(t,e){var i=this.activePiece,o=this.field;i&&(i.shift(t,e),o.pieceSpaceIsUnoccupied(i)||i.shift(-t,-e))},i.prototype.tryRotate=function(t){var e=this.activePiece,i=this.field;e&&(e.rotate(t),i.pieceSpaceIsUnoccupied(e)||e.rotate(-t))},i.prototype.draw=function(t,i){var o=t.getContext("2d");o.clearRect(0,0,t.width,t.height);var n=this.activePiece,r=this.field;if(n){e.drawPiece(n,o);var s=n.row;this.pieceHardDown(n),e.drawPiece(n,o,!1,!0),n.row=s}e.drawField(r,o,n,this.statistics.level,this.filledLines.map((function(t){t[0];return t[1]})))},i.statisticLabels={lines:"Lines",level:"Level",score:"Score"},i}(E);function M(t){return t[(e=t.length,Math.floor(Math.random()*Math.floor(e)))];var e}function H(t,e,i){var o=i.has(t),n=i.get(t);switch(typeof e){case"string":return o?n:e;case"number":return o?Number(n):e;case"boolean":return o?"false"!==n:e;default:throw new Error("type ".concat(typeof e," does not supported"))}}var D,z,O=function(t,e){var i={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(i[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(o=Object.getOwnPropertySymbols(t);n<o.length;n++)e.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(t,o[n])&&(i[o[n]]=t[o[n]])}return i},T=(D={autoStart:!1,linesPerLevel:10,startLevel:1,hardMode:!1},z=new URL(location.href),Object.fromEntries(Object.entries(D).map((function(t){var e=t[0];return[e,H(e,t[1],z.searchParams)]})))),j=T.autoStart,C=O(T,["autoStart"]),I=document.getElementById("cnvs"),q=Array.from(document.querySelectorAll(".piece-view_hold")),F=function(t){return function(e,i){return e.classList.toggle("locked",!(i<t))}},U=e.setupPieceView(13,g.PIECES),B=Array.from(document.querySelectorAll(".piece-view_next")),K=q.map((function(t){return U.bind(void 0,t)})),G=B.map((function(t){return U.bind(void 0,t)})),N=0,V=0;var Z,Q,W,X=(Z="statistics",Q=Object.keys(g.Game.statisticLabels),W=Object.fromEntries(Q.map((function(t){return[t,new Array]}))),document.querySelectorAll(".".concat(Z)).forEach((function(t){Q.forEach((function(e){return W[e].push(function(t,e,i){var o=document.createElement("section");o.innerText="".concat(e,": ");var n=document.createElement("span");return n.className=i,o.appendChild(n),t.appendChild(o),n}(t,g.Game.statisticLabels[e],"".concat(Z,"__").concat(e)))}))})),function(t){for(var e=0,i=Q;e<i.length;e++)for(var o=i[e],n=0,r=W[o];n<r.length;n++)r[n].textContent=t[o].toString()});document.querySelectorAll(".new-game").forEach((function(t){return t.addEventListener("click",ht)})),document.querySelectorAll(".pause-game").forEach((function(t){return t.addEventListener("click",at)})),document.querySelectorAll(".resume-game").forEach((function(t){return t.addEventListener("click",lt)}));var J,Y,$=document.getElementById("gameover"),tt=document.getElementById("gamehello"),et=document.getElementById("gamepause"),it={ArrowRight:g.Actions.MoveRight,ArrowLeft:g.Actions.MoveLeft,ArrowUp:g.Actions.RotateRight,ArrowDown:g.Actions.SoftDrop,KeyZ:g.Actions.RotateLeft,Space:g.Actions.HardDrop,KeyC:g.Actions.Hold,KeyD:g.Actions.MoveRight,KeyA:g.Actions.MoveLeft,KeyW:g.Actions.RotateRight,KeyS:g.Actions.SoftDrop,KeyQ:g.Actions.RotateLeft,KeyE:g.Actions.Hold,KeyR:g.Actions.RotateLeft,KeyT:g.Actions.Hold,Numpad1:g.Actions.Hold_1,Numpad2:g.Actions.Hold_2,Numpad3:g.Actions.Hold_3,Digit1:g.Actions.Hold_1,Digit2:g.Actions.Hold_2,Digit3:g.Actions.Hold_3},ot=(J=it,Y={},Object.entries(J).forEach((function(t){var e=t[0],i=t[1];if(void 0!==i){var o=g.Actions[i];Y[o]=Y[o]||[],Y[o].push(e)}})),Y);document.querySelectorAll(".controls-desc").forEach((function(t){for(var e in ot){var i=ot[e],o=document.createElement("section");o.innerHTML="<span>".concat(ut(e),"</span><span>").concat(i.map(ut).join(", "),"</span>"),t.append(o)}}));var nt=new g.Game,rt=function(t,e){void 0===e&&(e=document);var i=new Array(Object.keys(g.Actions).length/2).fill(!1);return e.addEventListener("keyup",(function(e){var o=t[e.code];void 0!==o&&(i[o]=!1)})),e.addEventListener("keydown",(function(e){var o=t[e.code];void 0!==o&&(i[o]=!0)})),i}(it);function st(t){V=window.requestAnimationFrame(st);var e=0;if(t>N+15){var i=t-N;e=Math.max(Math.floor(i/15),4)}for(var o=0;o<Math.min(1,e);o++){if(N+=15,nt.update(rt,N))return void ct()}nt.draw(I,t)}function ct(){var t;window.cancelAnimationFrame(V),V=-1,$.classList.remove("dialog_hidden"),null===(t=$.querySelector("button"))||void 0===t||t.focus(),document.body.classList.toggle("ingame_hidden",!0)}function at(){window.cancelAnimationFrame(V),V=-1,et.classList.toggle("dialog_hidden",!1),document.body.classList.toggle("ingame_hidden",!0)}function lt(){et.classList.toggle("dialog_hidden",!0),document.body.classList.toggle("ingame_hidden",!1),st(0)}function ht(){nt=new g.Game(1,0,C.linesPerLevel,C.startLevel),q.forEach(F(nt.maxHold)),B.forEach(F(nt.maxHistory)),nt.addEventListener("hold",(function(){var t=this;K.forEach((function(e,i){var o;e(null===(o=t.holdedPiece[i])||void 0===o?void 0:o.mask)}))})),nt.addEventListener("drop",(function(){var t=this;G.forEach((function(e,i){var o;e(null===(o=t.nextPieces[i])||void 0===o?void 0:o.mask)}))})),nt.addEventListener("nextLevel",(function(t){var e=t.level;this.maxHold=Math.min(3,e/5|0),this.maxHistory=C.hardMode?0:Math.min(4,e/3|1),q.forEach(F(this.holdedPiece.length)),B.forEach(F(this.nextPieces.length))})),nt.addEventListener("updateScore",X),X(nt.statistics),N=performance.now(),document.body.classList.toggle("ingame_hidden",!1),$.classList.add("dialog_hidden"),tt.classList.add("dialog_hidden"),st(0)}function ut(t){return t.split(/(?<=[a-z0-9])(?=[A-Z0-9])/g).filter((function(t){return!/(Arrow)|(Key)|(Digit)/.test(t)})).join(" ")}j&&ht();
//# sourceMappingURL=index.89ccb7a8.js.map
