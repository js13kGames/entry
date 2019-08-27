!function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){var s=i(1),n=i(2),o=i(3),a=i(4),h=i(5),d=i(6),c=(i(7),i(8)),u=document.getElementById("container");window.game=new function(t,e,i,l){var p;this.constants={width:t,height:e,targetFps:i,debug:l},this.state={},this.viewport=a.generateCanvas(t,e),this.viewport.id="gameViewport",this.context=this.viewport.getContext("2d"),u.insertBefore(this.viewport,u.firstChild),this.update=n(this),this.render=o(this),this.loop=s(this),(p=this).state.entities=p.state.entities||{};var f,x=function(t,e,i){this.name=t,this.type="candy",this.state={id:i,position:e.pos||{x:0,y:0},radius:5,color:"red"},this.state.life=25*Math.random()*20,this.update=function(){var t,e,i,s,n,o;1==(t=this.state.id,e="player",i=p.state.entities[t].state.position.x-p.state.entities[e].state.position.x,s=p.state.entities[t].state.position.y-p.state.entities[e].state.position.y,n=i*i+s*s,(o=p.state.entities[t].state.radius+p.state.entities[e].state.radius)*o>=n)&&(p.state.entities.player.state.life+=this.state.life/10,"🐞"==this.name?(sfx.play("bonus",function(){}),p.state.entities[this.state.id]=new g(this.name,this.state.position.x,this.state.position.y,this.state.id)):(sfx.play("pick",function(){}),delete p.state.entities[this.state.id])),this.state.life<0&&(p.state.entities[this.state.id]=new w(this.name,this.state.position.x,this.state.position.y,this.state.id)),this.state.life--},this.render=function(){p.context.save(),p.context.font="24px Arial",p.context.fillStyle="red",p.context.fillText(this.name,this.state.position.x,this.state.position.y),p.context.restore()}},y=function(i){this.name=i,this.type="base",this.state={position:{x:t/2,y:e/2},radius:50,color:"rgba(255,255,255,0.3)"},this.update=function(){},this.render=function(){p.context.beginPath(),p.context.arc(this.state.position.x,this.state.position.y,this.state.radius,0,2*Math.PI),p.context.fillStyle=this.state.color,p.context.lineWidth=10,p.context.strokeStyle=p.state.entities.player.state.color,p.context.fill(),p.context.stroke(),p.context.save(),p.context.font="16px Arial",p.context.fillStyle=this.state.color,p.context.fillText(this.name,this.state.position.x-(this.state.radius-10),this.state.position.y),p.context.restore()}},m=function(t){this.type="bullet",this.state={id:t.id||"bullet",speed:10,color:t.color||"#fff",position:t.pos||{x:0,y:0},orientation:t.orientation||{angle:0},radius:10+5*Math.random(),vel:{x:10,y:10}},sfx.play("shoot",function(){}),this.update=function(){var e,i,s,n,o,a;for(var r in this.state.position.y+=Math.sin(this.state.orientation.angle)*this.state.speed,this.state.position.x+=Math.cos(this.state.orientation.angle)*this.state.speed,this.state.radius-=.25,this.state.position.x+=Math.random()-.5,this.state.position.y+=Math.random()-.5,p.state.entities)if(p.state.entities[r].type==t.target&&(e=r,i=this.state.id,s=void 0,n=void 0,o=void 0,a=void 0,s=p.state.entities[e].state.position.x-p.state.entities[i].state.position.x,n=p.state.entities[e].state.position.y-p.state.entities[i].state.position.y,o=s*s+n*n,(a=p.state.entities[e].state.radius+p.state.entities[i].state.radius)*a>=o)){p.state.entities[r].state.life--,sfx.play("hurt",function(){}),delete p.state.entities[this.state.id];break}this.state.radius<0&&delete p.state.entities[this.state.id]},this.render=function(){p.context.save(),p.context.fillStyle=this.state.color,p.context.beginPath(),p.context.arc(this.state.position.x,this.state.position.y,this.state.radius,0,2*Math.PI),p.context.fill(),p.context.restore()}},_=function(t){this.name=t||Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,2),this.type="bugster",this.state={position:{x:0,y:0},radius:20,orientation:"undecided",color:"rgb("+[Math.round(255*Math.random()),Math.round(255*Math.random()),Math.round(255*Math.random())].join()+")",vel:{x:10,y:10}},this.update=function(){},this.render=function(){var t,e;p.context.save(),t=e=0,"right"==this.state.orientation?t=1*this.state.radius:"left"==this.state.orientation?t=-1*this.state.radius:"up"==this.state.orientation?e=-1*this.state.radius:"down"==this.state.orientation&&(e=1*this.state.radius),p.context.beginPath(),p.context.arc(this.state.position.x+t,this.state.position.y+e,this.state.radius/1.75,0,2*Math.PI),p.context.fillStyle=this.state.color,p.context.fill(),p.context.restore(),p.context.beginPath(),p.context.arc(this.state.position.x,this.state.position.y,this.state.radius,0,2*Math.PI),p.context.lineWidth=5,p.context.strokeStyle="#fff",p.context.fillStyle=this.state.color,p.context.fill(),p.context.stroke(),p.context.save(),p.context.fillStyle="#fff","up"==this.state.orientation?p.context.fillRect(this.state.position.x-2.5,this.state.position.y-this.state.radius,5,2*this.state.radius):"left"==this.state.orientation?p.context.fillRect(this.state.position.x-this.state.radius,this.state.position.y-2.5,2*this.state.radius,5):"down"==this.state.orientation?p.context.fillRect(this.state.position.x-2.5,this.state.position.y-this.state.radius,5,2*this.state.radius):"right"==this.state.orientation&&p.context.fillRect(this.state.position.x-this.state.radius,this.state.position.y-2.5,2*this.state.radius,5),p.context.restore(),p.context.beginPath(),p.context.arc(this.state.position.x,this.state.position.y,this.state.radius/3,0,2*Math.PI),p.context.fillStyle="rgba(255,255,255,1)",p.context.fill(),p.context.save(),p.context.font="16px Arial",p.context.fillStyle="yellow",p.context.fillText(this.name,this.state.position.x-(this.state.radius-10),this.state.position.y),p.context.restore()}},v=function(t,e,i){_.apply(this,arguments),this.state.position={x:e,y:i},this.name=t||this.name,this.type="bugster",this.state.life=10+15*Math.random(),this.update=function(){if((h.isPressed.left||window.gamePad.left)&&(this.state.position.x-=this.state.vel.x,this.state.orientation="left"),(h.isPressed.right||window.gamePad.right)&&(this.state.position.x+=this.state.vel.x,this.state.orientation="right"),(h.isPressed.up||window.gamePad.up)&&(this.state.position.y-=this.state.vel.y,this.state.orientation="up"),(h.isPressed.down||window.gamePad.down)&&(this.state.position.y+=this.state.vel.y,this.state.orientation="down"),window.joyStick.left()||window.joyStick.right()||window.joyStick.up()||window.joyStick.down()){var t=window.joyStick.deltaY(),e=window.joyStick.deltaX();if(t&&e){var i=Math.atan2(t,e),s=this.name+Math.random();(!window.timer||Date.now()-window.timer>250)&&(p.state.entities[s]=new m({target:"bug",id:s,color:this.state.color,orientation:{angle:i},pos:{x:this.state.position.x,y:this.state.position.y}}),window.timer=Date.now())}}this.state.position.x=this.state.position.x.boundary(this.state.radius,p.constants.width-this.state.radius),this.state.position.y=this.state.position.y.boundary(this.state.radius,p.constants.height-this.state.radius)}},b=function(t,e,i,s){this.type="debris",this.state={id:i,radius:5+20*Math.random(),life:life=25*Math.random()*20,color:s,position:{x:t,y:e}},this.render=function(){p.context.beginPath(),p.context.arc(this.state.position.x,this.state.position.y,this.state.radius,0,2*Math.PI),p.context.fillStyle=this.state.color,p.context.fill()},this.update=function(){this.state.life--,this.state.radius-=.1,this.state.position.x+=Math.random()-.5,this.state.position.y+=Math.random()-.5,(this.state.life<0||this.state.radius<0)&&delete p.state.entities[this.state.id]}},w=function(i,s,n,o){_.apply(this,arguments),this.state.life=1+1.5*Math.random(),this.state.id=o,this.state.position.x=s,this.state.position.y=n,this.name=i||this.name,this.type="bug",this.explosion=function(t){for(var e=0;e<t;e++)for(var i=0;i<t;i++)dir=function(){return Math.random()>.5?1:-1},p.state.entities["debris__"+this.state.id+e+i]=new b(this.state.position.x+e*Math.random()*20*dir(),this.state.position.y+i*Math.random()*20*dir(),"debris__"+this.state.id+e+i,this.state.color)},this.explosion(this.state.radius/10),this.update=function(){for(var i in p.state.entities)if("bugster"==p.state.entities[i].type){var s=p.state.entities[i].state.position.x,n=p.state.entities[i].state.position.y;r=Math.atan2(n-this.state.position.y,s-this.state.position.x);var a="bug__"+o+Math.random();(!window["bugtimmer"+o]||Date.now()-window["bugtimmer"+o]>1250)&&(p.state.entities[a]=new m({target:"bugster",id:a,color:this.state.color,orientation:{angle:r},pos:{x:this.state.position.x,y:this.state.position.y}}),window["bugtimmer"+o]=Date.now())}s=t/2,n=e/2,this.state.angle=Math.atan2(n-this.state.position.y,s-this.state.position.x),this.state.position.x+=.5*Math.cos(this.state.angle),this.state.position.y+=.5*Math.sin(this.state.angle),this.state.position.x=this.state.position.x.boundary(this.state.radius,p.constants.width-this.state.radius),this.state.position.y=this.state.position.y.boundary(this.state.radius,p.constants.height-this.state.radius),(this.state.life<0||this.state.radius<0)&&(sfx.play("explode",function(){}),this.explosion(this.state.radius/5),delete p.state.entities[this.state.id])}},g=function(t,e,i,s){_.apply(this,arguments),this.state.life=3600,this.state.id=s,this.state.position.x=e,this.state.position.y=i,this.name=t||this.name,this.type="bugster",this.explosion=function(t){for(var e=0;e<t;e++)for(var i=0;i<t;i++)dir=function(){return Math.random()>.5?1:-1},p.state.entities["debris__"+this.state.id+e+i]=new b(this.state.position.x+e*Math.random()*20*dir(),this.state.position.y+i*Math.random()*20*dir(),"debris__"+this.state.id+e+i,this.state.color)},this.explosion(this.state.radius/10),this.update=function(){for(var t in p.state.entities)if("bug"==p.state.entities[t].type){var e=p.state.entities[t].state.position.x,i=p.state.entities[t].state.position.y;r=Math.atan2(i-this.state.position.y,e-this.state.position.x);var n="bug__"+s+Math.random();(!window["bugtimmer"+s]||Date.now()-window["bugtimmer"+s]>250)&&(p.state.entities[n]=new m({target:"bug",id:n,color:this.state.color,orientation:{angle:r},pos:{x:this.state.position.x,y:this.state.position.y}}),window["bugtimmer"+s]=Date.now())}this.state.position.x=this.state.position.x.boundary(this.state.radius,p.constants.width-this.state.radius),this.state.position.y=this.state.position.y.boundary(this.state.radius,p.constants.height-this.state.radius),this.state.life--,(this.state.life<0||this.state.radius<0)&&(this.explosion(this.state.radius/5),delete p.state.entities[this.state.id])}};return(v.prototype=_.prototype).constructor=v,f=function(){window.joyStick=new c({stationaryBase:!0,baseX:65,baseY:e-90,limitStickTravel:!0,stickRadius:50,strokeStyle:"#546e7a",mouseSupport:!0}),window.joyStick.addEventListener("touchStartValidation",function(t){var e=t.changedTouches[0];return e.pageX<=window.innerWidth/2&&e.pageY>=window.innerHeight/2}),p.state.entities.base=new y("sweet spot"),p.state.entities.hub={score:0,treasure:0,update:function(){},render:function(){p.context.font="14px Arial",p.context.fillStyle="#ff0",p.context.fillText("sauce: "+Math.round(p.state.entities.player.state.life),16,16),Math.round(p.state.entities.player.state.life)<1&&p.context.fillText("😂 come on you can do it",16,32)}},p.state.entities.candyrush={candies:["🍡","🍩","🍦","☕","🍰","🍖","🍬","🍭","🍔","🍯","🍕","🍟","🐞","🍲","🌰","🍪"],update:function(){mx=Math.random()*t+10,my=Math.random()*e+10,Math.random()<.98||(p.state.entities["candy__"+mx+my]=new x(function(t){for(var e,i,s=t.length;0!==s;)i=Math.floor(Math.random()*s),e=t[s-=1],t[s]=t[i],t[i]=e;return t}(this.candies)[0],{pos:{x:mx,y:my}},"candy__"+mx+my))},render:function(){}},p.state.entities.player=new v("me",t/2,e/2),p.state.entities.buddy=new g("🐞",t/2,e/2+25,"buddy"),window.gamePad={},document.querySelector("#buttons").innerHTML='<style> .fab {width: 56px;height: 56px;background: #546e7a;border-radius: 50%;box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);color: #fff;display: flex;justify-content: center;align-items: center;cursor: pointer; position: fixed;bottom: 0;right: 0;margin: 25px;-webkit-tap-highlight-color: transparent;-webkit-backface-visibility: hidden;backface-visibility: hidden;overflow: hidden;}.fab.active {background: #faab1a;}.fab__ripple {position: absolute;left: -17px;bottom: -12px;width: 56px;height: 56px;-webkit-transform: scale(0.5);transform: scale(0.5);background: #fff;border-radius: 50%;-webkit-transform-origin: 50%;transform-origin: 50%;transition: -webkit-transform 0.35s cubic-bezier(0, 0, 0.3, 1) 0ms;transition: transform 0.35s cubic-bezier(0, 0, 0.3, 1) 0ms;transition: transform 0.35s cubic-bezier(0, 0, 0.3, 1) 0ms, -webkit-transform 0.35s cubic-bezier(0, 0, 0.3, 1) 0ms;-webkit-backface-visibility: hidden;backface-visibility: hidden;will-change: transform;z-index: 2;opacity: 0;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}.fab:active .fab__ripple {opacity: 0.2;-webkit-transform: scale(1) translate(31%, -22%);transform: scale(1) translate(31%, -22%);}.fab__image {overflow: hidden;z-index: 3;}</style><div ontouchstart="window.gamePad.left=true" ontouchend="window.gamePad.left=false" style="margin-right:110px; margin-bottom:65px" class="fab button__left"><div class="fab__ripple"></div></div><div ontouchstart="window.gamePad.right=true" ontouchend="window.gamePad.right=false" style="margin-right:16px; margin-bottom:65px" class="fab button__right"><div class="fab__ripple"></div></div><div ontouchstart="window.gamePad.up=true" ontouchend="window.gamePad.up=false" style="margin-right:66px; margin-bottom:114px" class="fab button__up"><div class="fab__ripple"></div></div><div ontouchstart="window.gamePad.down=true" ontouchend="window.gamePad.down=false" style="margin-right:66px; margin-bottom:16px" class="fab button__down"><div class="fab__ripple"></div></div>'},p.state.entities.loader=new function(){return this.type="loader",this.state={position:{x:0,y:0}},this.update=function(){if(!window.loadtimer||Date.now()-window.loadtimer>5e3){if(!window.loadtimer)return window.loadtimer=Date.now();delete p.state.entities.loader,sfx=new d,sfx.load("bonus","./bonus.wav",function(){}),sfx.load("pick","./pick.wav",function(){}),sfx.load("hurt","./hurt.wav",function(){}),sfx.load("explode","./explode.wav",function(){}),sfx.load("shoot","./shoot.wav",function(){f()})}this.state.position.x+=Math.random()-.5,this.state.position.y+=Math.random()-.5},this.render=function(){if(Date.now()-window.loadtimer>3e3)return p.context.save(),p.context.font="64px Arial",p.context.fillText("🐞",t/4+10+this.state.position.x,e/2+this.state.position.y,t),p.context.font="32px Arial",p.context.fillText("🐞B422🐞️",t/4+65,e/2,t),p.context.font="16px Arial",p.context.fillText("watchmyback",t/4+10,e/2+25,t),p.context.font="14px Arial",p.context.fillText("eat the candies before they eat You",t/4+10,e/2+50,t),p.context.font="10px Arial",p.context.fillText("use touch buttons or direction keys",t/4+10,e/2+65,t),p.context.font="12px Arial",p.context.fillText("https://github.com/swashvirus/watchmyback️",16,e-16,t),void p.context.restore();p.context.save(),p.context.font="64px Arial",p.context.fillText("☄️",t/4+10+this.state.position.x,e/2+this.state.position.y,t),p.context.font="32px Arial",p.context.fillText("Craters.js️",t/4+65,e/2,t),p.context.font="16px Arial",p.context.fillText("loading...",t/4+10,e/2+25,t),p.context.font="12px Arial",p.context.fillText("https://github.com/swashvirus/️",16,e-16,e),p.context.restore()},this},this}(window.innerWidth,window.innerHeight,60,!1),t.exports=game},function(t,e){t.exports=function(t){var e=this,i=t.constants.targetFps,s=1e3/i,n=window.performance.now(),o={new:{frameCount:0,startTime:n,sinceStart:0},old:{frameCount:0,startTime:n,sineStart:0}},a="new";return e.fps=0,e.main=function(r){e.stopLoop=window.requestAnimationFrame(e.main);var h,d,c=r,u=c-n;if(u>s){for(var l in n=c-u%s,o)++o[l].frameCount,o[l].sinceStart=c-o[l].startTime;h=o[a],e.fps=Math.round(1e3/(h.sinceStart/h.frameCount)*100)/100,d=o.new.frameCount===o.old.frameCount?5*i:10*i,h.frameCount>d&&(o[a].frameCount=0,o[a].startTime=c,o[a].sinceStart=0,a="new"===a?"old":"new"),t.state=t.update(c),t.render()}},e.main(),e}},function(t,e){t.exports=function(t){return function(e){var i=t.state||{};if(i.hasOwnProperty("entities")){var s=i.entities;for(var n in s)s[n].update()}return i}}},function(t,e){t.exports=function(t){var e=t.constants.width,i=t.constants.height;return function(){if(t.context.clearRect(0,0,e,i),t.context.fillStyle="#ff0",t.constants.debug&&t.context.fillText("fps : "+t.loop.fps,e-100,50),t.state.hasOwnProperty("entities")){var s=t.state.entities;for(var n in s)s[n].render()}}}},function(t,e){t.exports={getPixelRatio:function(t){console.log("Determining pixel ratio.");return window.devicePixelRatio/["webkitBackingStorePixelRatio","mozBackingStorePixelRatio","msBackingStorePixelRatio","oBackingStorePixelRatio","backingStorePixelRatio"].reduce(function(e,i){return t.hasOwnProperty(i)?t[i]:1})},generateCanvas:function(t,e){console.log("Generating canvas.");var i=document.createElement("canvas"),s=i.getContext("2d"),n=this.getPixelRatio(s);return i.width=Math.round(t*n),i.height=Math.round(e*n),i.style.width=t+"px",i.style.height=e+"px",s.setTransform(n,0,0,n,0,0),i}}},function(t,e){t.exports=function(){var t,e,i,s;return this.isPressed={},document.onkeydown=function(n){39===n.keyCode&&(e=!0),37===n.keyCode&&(t=!0),38===n.keyCode&&(i=!0),40===n.keyCode&&(s=!0)},document.onkeyup=function(n){39===n.keyCode&&(e=!1),37===n.keyCode&&(t=!1),38===n.keyCode&&(i=!1),40===n.keyCode&&(s=!1)},Object.defineProperty(this.isPressed,"left",{get:function(){return t},configurable:!0,enumerable:!0}),Object.defineProperty(this.isPressed,"right",{get:function(){return e},configurable:!0,enumerable:!0}),Object.defineProperty(this.isPressed,"up",{get:function(){return i},configurable:!0,enumerable:!0}),Object.defineProperty(this.isPressed,"down",{get:function(){return s},configurable:!0,enumerable:!0}),this}()},function(t,e){t.exports=function(){return this.sounds={},this.instances=[],this.default_volume=1,this.load=function(t,e,i){if(this.sounds[t]=new Audio(e),"function"!=typeof i)return new Promise((e,i)=>{this.sounds[t].addEventListener("canplaythrough",e),this.sounds[t].addEventListener("error",i)});this.sounds[t].addEventListener("canplaythrough",i)},this.remove=function(t){void 0!==this.sounds&&delete this.sounds[t]},this.play=function(t,e,i,s){if(s=s||!1,void 0===this.sounds[t])return console.error("Can't find sound called '"+t+"'."),!1;var n=this.sounds[t].cloneNode(!0);return n.volume="number"==typeof i?i:this.default_volume,n.loop=s,n.play(),this.instances.push(n),n.addEventListener("ended",()=>{var t=this.instances.indexOf(n);-1!=t&&this.instances.splice(t,1)}),"function"==typeof e?(n.addEventListener("ended",e),!0):new Promise((t,e)=>n.addEventListener("ended",t))},this.stop_all=function(){var t=this.instances.slice();for(var e of t)e.pause(),e.dispatchEvent(new Event("ended"))},this}},function(t,e){var i=function(t,e){return Math.min(Math.max(this,t),e)};Number.prototype.boundary=i,t.exports=i},function(t,e){var i,s=function(t){t=t||{},this._container=t.container||document.body,this._strokeStyle=t.strokeStyle||"cyan",this._stickEl=t.stickElement||this._buildJoystickStick(),this._baseEl=t.baseElement||this._buildJoystickBase(),this._mouseSupport=void 0!==t.mouseSupport&&t.mouseSupport,this._stationaryBase=t.stationaryBase||!1,this._baseX=this._stickX=t.baseX||0,this._baseY=this._stickY=t.baseY||0,this._limitStickTravel=t.limitStickTravel||!1,this._stickRadius=void 0!==t.stickRadius?t.stickRadius:100,this._useCssTransform=void 0!==t.useCssTransform&&t.useCssTransform,this._container.style.position="relative",this._container.appendChild(this._baseEl),this._baseEl.style.position="absolute",this._baseEl.style.display="none",this._container.appendChild(this._stickEl),this._stickEl.style.position="absolute",this._stickEl.style.display="none",this._pressed=!1,this._touchIdx=null,!0===this._stationaryBase&&(this._baseEl.style.display="",this._baseEl.style.left=this._baseX-this._baseEl.width/2+"px",this._baseEl.style.top=this._baseY-this._baseEl.height/2+"px"),this._transform=!!this._useCssTransform&&this._getTransformProperty(),this._has3d=this._check3D();var e=function(t,e){return function(){return t.apply(e,arguments)}};this._$onTouchStart=e(this._onTouchStart,this),this._$onTouchEnd=e(this._onTouchEnd,this),this._$onTouchMove=e(this._onTouchMove,this),this._container.addEventListener("touchstart",this._$onTouchStart,!1),this._container.addEventListener("touchend",this._$onTouchEnd,!1),this._container.addEventListener("touchmove",this._$onTouchMove,!1),this._mouseSupport&&(this._$onMouseDown=e(this._onMouseDown,this),this._$onMouseUp=e(this._onMouseUp,this),this._$onMouseMove=e(this._onMouseMove,this),this._container.addEventListener("mousedown",this._$onMouseDown,!1),this._container.addEventListener("mouseup",this._$onMouseUp,!1),this._container.addEventListener("mousemove",this._$onMouseMove,!1))};s.prototype.destroy=function(){this._container.removeChild(this._baseEl),this._container.removeChild(this._stickEl),this._container.removeEventListener("touchstart",this._$onTouchStart,!1),this._container.removeEventListener("touchend",this._$onTouchEnd,!1),this._container.removeEventListener("touchmove",this._$onTouchMove,!1),this._mouseSupport&&(this._container.removeEventListener("mouseup",this._$onMouseUp,!1),this._container.removeEventListener("mousedown",this._$onMouseDown,!1),this._container.removeEventListener("mousemove",this._$onMouseMove,!1))},s.touchScreenAvailable=function(){return"createTouch"in document},(i=s.prototype).addEventListener=function(t,e){return void 0===this._events&&(this._events={}),this._events[t]=this._events[t]||[],this._events[t].push(e),e},i.removeEventListener=function(t,e){void 0===this._events&&(this._events={}),t in this._events!=0&&this._events[t].splice(this._events[t].indexOf(e),1)},i.dispatchEvent=function(t){if(void 0===this._events&&(this._events={}),void 0!==this._events[t])for(var e=this._events[t].slice(),i=0;i<e.length;i++){var s=e[i].apply(this,Array.prototype.slice.call(arguments,1));if(void 0!==s)return s}},s.prototype.deltaX=function(){return this._stickX-this._baseX},s.prototype.deltaY=function(){return this._stickY-this._baseY},s.prototype.up=function(){if(!1===this._pressed)return!1;var t=this.deltaX(),e=this.deltaY();return!(e>=0)&&!(Math.abs(t)>2*Math.abs(e))},s.prototype.down=function(){if(!1===this._pressed)return!1;var t=this.deltaX(),e=this.deltaY();return!(e<=0)&&!(Math.abs(t)>2*Math.abs(e))},s.prototype.right=function(){if(!1===this._pressed)return!1;var t=this.deltaX(),e=this.deltaY();return!(t<=0)&&!(Math.abs(e)>2*Math.abs(t))},s.prototype.left=function(){if(!1===this._pressed)return!1;var t=this.deltaX(),e=this.deltaY();return!(t>=0)&&!(Math.abs(e)>2*Math.abs(t))},s.prototype._onUp=function(){this._pressed=!1,this._stickEl.style.display="none",0==this._stationaryBase&&(this._baseEl.style.display="none",this._baseX=this._baseY=0,this._stickX=this._stickY=0)},s.prototype._onDown=function(t,e){if(this._pressed=!0,0==this._stationaryBase&&(this._baseX=t,this._baseY=e,this._baseEl.style.display="",this._move(this._baseEl.style,this._baseX-this._baseEl.width/2,this._baseY-this._baseEl.height/2)),this._stickX=t,this._stickY=e,!0===this._limitStickTravel){var i=this.deltaX(),s=this.deltaY(),n=Math.sqrt(i*i+s*s);if(n>this._stickRadius){var o=i/n,a=s/n;this._stickX=o*this._stickRadius+this._baseX,this._stickY=a*this._stickRadius+this._baseY}}this._stickEl.style.display="",this._move(this._stickEl.style,this._stickX-this._stickEl.width/2,this._stickY-this._stickEl.height/2)},s.prototype._onMove=function(t,e){if(!0===this._pressed){if(this._stickX=t,this._stickY=e,!0===this._limitStickTravel){var i=this.deltaX(),s=this.deltaY(),n=Math.sqrt(i*i+s*s);if(n>this._stickRadius){var o=i/n,a=s/n;this._stickX=o*this._stickRadius+this._baseX,this._stickY=a*this._stickRadius+this._baseY}}this._move(this._stickEl.style,this._stickX-this._stickEl.width/2,this._stickY-this._stickEl.height/2)}},s.prototype._onMouseUp=function(t){return this._onUp()},s.prototype._onMouseDown=function(t){t.preventDefault();var e=t.clientX,i=t.clientY;return this._onDown(e,i)},s.prototype._onMouseMove=function(t){var e=t.clientX,i=t.clientY;return this._onMove(e,i)},s.prototype._onTouchStart=function(t){if(null===this._touchIdx&&!1!==this.dispatchEvent("touchStartValidation",t)){this.dispatchEvent("touchStart",t),t.preventDefault();var e=t.changedTouches[0];this._touchIdx=e.identifier;var i=e.pageX,s=e.pageY;return this._onDown(i,s)}},s.prototype._onTouchEnd=function(t){if(null!==this._touchIdx){this.dispatchEvent("touchEnd",t);for(var e=t.changedTouches,i=0;i<e.length&&e[i].identifier!==this._touchIdx;i++);if(i!==e.length)return this._touchIdx=null,t.preventDefault(),this._onUp()}},s.prototype._onTouchMove=function(t){if(null!==this._touchIdx){for(var e=t.changedTouches,i=0;i<e.length&&e[i].identifier!==this._touchIdx;i++);if(i!==e.length){var s=e[i];t.preventDefault();var n=s.pageX,o=s.pageY;return this._onMove(n,o)}}},s.prototype._buildJoystickBase=function(){var t=document.createElement("canvas");t.width=126,t.height=126;var e=t.getContext("2d");return e.beginPath(),e.strokeStyle=this._strokeStyle,e.lineWidth=6,e.arc(t.width/2,t.width/2,40,0,2*Math.PI,!0),e.stroke(),e.beginPath(),e.strokeStyle=this._strokeStyle,e.lineWidth=2,e.arc(t.width/2,t.width/2,60,0,2*Math.PI,!0),e.stroke(),t},s.prototype._buildJoystickStick=function(){var t=document.createElement("canvas");t.width=86,t.height=86;var e=t.getContext("2d");return e.beginPath(),e.strokeStyle=this._strokeStyle,e.lineWidth=6,e.arc(t.width/2,t.width/2,40,0,2*Math.PI,!0),e.stroke(),t},s.prototype._move=function(t,e,i){this._transform?this._has3d?t[this._transform]="translate3d("+e+"px,"+i+"px, 0)":t[this._transform]="translate("+e+"px,"+i+"px)":(t.left=e+"px",t.top=i+"px")},s.prototype._getTransformProperty=function(){for(var t,e=["webkitTransform","MozTransform","msTransform","OTransform","transform"],i=document.createElement("p"),s=0;s<e.length;s++)if(t=e[s],null!=i.style[t])return t},s.prototype._check3D=function(){var e=this._getTransformProperty();if(!e||!window.getComputedStyle)return t.exports=!1;var i=document.createElement("div");i.style[e]="translate3d(1px,1px,1px)",document.body.insertBefore(i,null);var s=getComputedStyle(i).getPropertyValue({webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"}[e]);return document.body.removeChild(i),null!=s&&s.length&&"none"!=s},t.exports=s}]);