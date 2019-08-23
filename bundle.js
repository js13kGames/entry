var Tetris=function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){n(2);const a=n(3);t.exports=a.app},function(t,e,n){},function(t,e,n){"use strict";n.r(e);const a={Play:"play",Over:"over"},r={PaddleRange:13},i=3,s=Math.PI,o=s/3,h=2*s,c=h/3;function l(t,e){return Math.random()*(e-t)+t}function d(t){return t[(e=0,n=t.length,Math.floor(l(e,n)))];var e,n}function f(t){return(Math.sin(t)+1)/2}function u(t,e,n){return Math.min(Math.max(t,e),n)}function g(t){return Math.round(100*t)/100}function p(){return Date.now()}const y=(t,e,n=1e3)=>{p()-t>n&&e()};function x(){return{debug:!1,state:a.Over,highscore:0,shake:{angle:0,x:0,y:0},extrusion:{angle3:[0,0,0]},game:{score:0,unit:40,tileWidth:3.84,tileHeight:2.56,width:384,height:256,ratio:256/384,vx:10,tick:0},paddleBoost:[1,1],paddles:[{side:"up",vx:1,vy:0,x:192,y:2,w:40,h:10},{side:"down",vx:-1,vy:0,x:192,y:245,w:40,h:10},{side:"left",vx:0,vy:1,x:1,y:128,w:10,h:40},{side:"right",vx:0,vy:-1,x:373,y:128,w:10,h:40}],hero:{color:i,exploding:!1,radius:5,gap:2,gapMove:2,rotation:0,x:192,y:128,ax:-1,ay:-1,vx:0,vy:0,rotation:0,boost:1,friction:1,tick:0,active:0}}}var v=function(){var t,e,n,a,r,i=function(t){return Math.sin(6.283184*t)},s=function(t){return.003959503758*Math.pow(2,(t-128)/12)},o=function(t,e,n){var a,r,i,o,c,l,d,f=h[t.i[0]],u=t.i[1],g=t.i[3],p=h[t.i[4]],y=t.i[5],x=t.i[8],v=t.i[9],w=t.i[10]*t.i[10]*4,M=t.i[11]*t.i[11]*4,m=t.i[12]*t.i[12]*4,b=1/m,k=t.i[13],T=n*Math.pow(2,2-t.i[14]),S=new Int32Array(w+M+m),B=0,C=0;for(a=0,r=0;a<w+M+m;a++,r++)r>=0&&(r-=T,l=s(e+(15&(k=k>>8|(255&k)<<4))+t.i[2]-128),d=s(e+(15&k)+t.i[6]-128)*(1+8e-4*t.i[7])),i=1,a<w?i=a/w:a>=w+M&&(i-=(a-w-M)*b),o=l,g&&(o*=i*i),c=f(B+=o)*u,o=d,x&&(o*=i*i),c+=p(C+=o)*y,v&&(c+=(2*Math.random()-1)*v),S[a]=80*c*i|0;return S},h=[i,function(t){return t%1<.5?1:-1},function(t){return t%1*2-1},function(t){var e=t%1*4;return e<2?e-1:3-e}];this.init=function(i){t=i,e=i.endPattern,n=0,a=i.rowLen*i.patternLen*(e+1)*2,r=new Int32Array(a)},this.generate=function(){var s,c,l,d,f,u,g,p,y,x,v,w,M,m,b=new Int32Array(a),k=t.songData[n],T=t.rowLen,S=t.patternLen,B=0,C=0,E=!1,D=[];for(l=0;l<=e;++l)for(g=k.p[l],d=0;d<S;++d){var P=g?k.c[g-1].f[d]:0;P&&(k.i[P-1]=k.c[g-1].f[d+S]||0,P<16&&(D=[]));var A=h[k.i[15]],L=k.i[16]/512,O=Math.pow(2,k.i[17]-9)/T,j=k.i[18],U=k.i[19],K=43.23529*k.i[20]*3.141592/44100,R=1-k.i[21]/255,H=1e-5*k.i[22],I=k.i[23]/32,_=k.i[24]/512,F=6.283184*Math.pow(2,k.i[25]-9)/T,W=k.i[26]/255,q=k.i[27]*T&-2;for(v=(l*S+d)*T,f=0;f<4;++f)if(u=g?k.c[g-1].n[d+f*S]:0){D[u]||(D[u]=o(k,u,T));var G=D[u];for(c=0,s=2*v;c<G.length;c++,s+=2)b[s]+=G[c]}for(c=0;c<T;c++)(x=b[p=2*(v+c)])||E?(w=K,j&&(w*=A(O*p)*L+.5),C+=(w=1.5*Math.sin(w))*(M=R*(x-C)-(B+=w*C)),x=3==U?C:1==U?M:B,H&&(x=(x*=H)<1?x>-1?i(.25*x):-1:1,x/=H),E=(x*=I)*x>1e-5,m=x*(1-(y=Math.sin(F*p)*_+.5)),x*=y):m=0,p>=q&&(m+=b[p-q+1]*W,x+=b[p-q]*W),b[p]=0|m,b[p+1]=0|x,r[p]+=0|m,r[p+1]+=0|x}return++n/t.numChannels},this.createWave=function(){var t=44+2*a-8,e=t-36,n=new Uint8Array(44+2*a);n.set([82,73,70,70,255&t,t>>8&255,t>>16&255,t>>24&255,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,255&e,e>>8&255,e>>16&255,e>>24&255]);for(var i=0,s=44;i<a;++i){var o=r[i];o=o<-32767?-32767:o>32767?32767:o,n[s++]=255&o,n[s++]=o>>8&255}return n},this.getData=function(t,e){for(var n=2*Math.floor(44100*t),a=new Array(e),i=0;i<2*e;i+=1){var s=n+i;a[i]=t>0&&s<r.length?r[s]/32768:0}return a}},w={songData:[{i:[2,100,128,0,3,201,128,0,0,0,0,6,29,0,0,0,194,4,1,3,25,191,115,244,147,6,84,6],p:[5,1,2,1,1,1,1,3,4,1,2,1,2,1,2,,,7,8,7,8,7,8,7,8,6,9],c:[{n:[123,123,135,128,123,123,135,130,126,125,126,128,123,123,135,128,123,123,135,130,126,125,126,128,123,123,135,128,123,123,135,130],f:[21,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,48]},{n:[123,123,135,128,123,123,135,130,126,125,126,128,123,123,135,128,123,123,135,130,126,125,126,128,123,,99,,,,99,,,,,,,,,,,,,,,,,,,,,,,,,,111],f:[,,,,,,,,,,,,,,,,,,,,,,,,,,,11,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,31]},{n:[111,,,,,,,,123,,,,,,,,111,,,,,,,,123],f:[]},{n:[114,,,,,,,,126,,,,,,,,114,,,,,,,,114,126,111,123,114,126,118,130],f:[13,,,,,,,,,,,,,,,,,,,,,,,,13,,13,,13,,13,11,29,,,,,,,,,,,,,,,,,,,,,,,,32,,41,,29,,25,15]},{n:[123,123,135,128,123,123,135,130,126,125,126,128,123,123,135,128,123,123,135,130,126,125,126,128,123,,99,,,,99,,,,,,,,,,,,,,,,,,,,,,,,,,111],f:[13,11,21,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,17,29,,25,113,,,,,,,,,,,,,,,,,,,,,,,,,,,,194]},{n:[111,,,,,,,,123,,,,,,,,111,,,,,,,,99],f:[]},{n:[111,123,,123,111,,123,111,111,123,,123,111,,123,111,111,123,,123,111,,123,111,111,123,,123,111,,123,111],f:[]},{n:[114,126,,126,114,,126,114,114,126,,126,114,,126,114,114,126,,126,114,,126,114,116,128,,128,116,,114,121],f:[]},{n:[],f:[]}]},{i:[0,255,117,1,0,255,110,0,1,0,4,6,35,0,0,0,0,0,0,2,14,1,1,39,76,5,0,0],p:[,1,1,1,1,1,1,2,,,,1,1,1,1,1,1,,,1,1,1,1,1,1],c:[{n:[147,,,,,,147,,,,147,,,,,,147,,,,,,147,,,,147,,,,147],f:[]},{n:[147],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,60,4,10,68,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,1,1,2,3,2,3,4,,,,2,3,2,3,2,3,,,5,5,5,5,5,5,4],c:[{n:[,,,,147,,,,,,,,148,,,,,,,,147,,,,,,,,147],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,35]},{n:[,,,,147,,,147,,,,,148,,,,,,,,147,,,147,,,147,,,,147],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,35]},{n:[,,,,147,,,147,,,,,148,,,,,,,,147,,,147,,,147,,,147,147,147],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,35]},{n:[147],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,68]},{n:[147,,,147,,,147,,147,,,147,,147,,147,147,,,147,,,147,,147,,,147,,147,,147],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,35]}]},{i:[2,192,128,0,2,192,140,18,0,0,107,115,138,0,0,0,136,5,1,2,8,92,21,56,148,5,85,8],p:[3,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[111],f:[]},{n:[114],f:[]},{n:[111],f:[24,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,56]}]},{i:[3,0,127,0,3,68,127,0,1,218,4,4,40,0,0,1,55,4,1,2,67,115,124,190,67,6,39,1],p:[,,,1,2,1,2,3,,,,1,2,1,2,1,2,,,1,4,1,4,1,4,3],c:[{n:[,,,,147,,,,,,,,147,,,,,,,,147,,,,,,,,147],f:[]},{n:[,,,,147,,,,,,,,147,,,,,,,,147,,,,,,,,147,,147,147],f:[]},{n:[147],f:[]},{n:[,,,,147,,,,,,,,147,,,,,,,,147,,,,,,,,147,,,147],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,67,0,0,0,0,0,0,2,255,15,0,32,83,3,134,4],p:[,,,1,2,3,2,1,2,,,1,2,3,2,1,2,,,,,4,5,4,5],c:[{n:[159,,147,,154,,147,,157,,147,,154,,150,,159,,147,,154,,147,,162,,147,,154,,150,,123],f:[5,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,67]},{n:[159,,147,,154,,147,,157,,147,,154,,150,,159,,147,,154,,147,,162,,147,,157,,162,,126],f:[]},{n:[159,,147,,154,,147,,157,,147,,154,,150,,159,,147,,154,,147,,162,,147,,154,,150,,123],f:[5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3]},{n:[159,,162,,164,,,,159,,162,164,,,162,,159,,162,,164,,,,159,,162,164,,,162],f:[13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,25]},{n:[157,,162,,164,,,,157,,162,164,,,162,,157,,162,,164,,,,157,,162,164,,,162],f:[,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,67]}]},{i:[3,146,140,0,1,224,128,3,0,0,92,0,95,0,0,3,179,5,1,3,37,135,63,67,150,3,157,6],p:[,,,,,,,,,1,2,3,,1,2,1,2,3,,4,5,,,,,3],c:[{n:[123,,,,,,,,,,,,,,,,130],f:[11,24,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,92,67]},{n:[133,,,,,,,,,,,,,,,138,126,,,,,,,,,,,,125],f:[11,,,,,,,,,,,,,,,,,,,,,,,,,,,,11,,,,95,,,,,,,,,,,,,,,,,,,,,,,,,,,,29]},{n:[123],f:[24,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,52,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,67]},{n:[123,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,138,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,116],f:[11,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,95]},{n:[133,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,126,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,118],f:[]}]},{i:[0,255,106,1,0,255,106,0,1,0,5,7,164,0,0,0,0,0,0,2,255,0,2,16,83,5,53,1],p:[,,,,,,,1,,,,,,,,,,1,,,,,,,,1],c:[{n:[147],f:[]}]}],rowLen:5513,patternLen:32,endPattern:26,numChannels:8},M={songData:[{i:[1,0,128,0,1,0,128,0,0,220,0,63,59,0,0,1,88,6,0,2,193,171,0,29,39,3,138,2],p:[1],c:[{n:[146],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},m={songData:[{i:[0,100,128,0,3,201,128,0,0,0,0,6,29,0,0,0,195,4,1,2,50,184,119,244,147,6,84,6],p:[5],c:[{n:[146,146,146,146,146,146,146,146,146,146,146],f:[5]},{n:[146,147],f:[]},{n:[152],f:[]},{n:[152,154,156,154,,147,146,158,142,158,140,156,139,146,140,142,144,146,142,147,142,151,152,152,156,152,154,154,154,154,154,146],f:[]},{n:[152],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},b={songData:[{i:[2,255,152,0,2,255,152,12,0,192,0,29,31,0,0,0,0,0,0,1,255,0,3,32,55,3,124,2],p:[2],c:[{n:[139,139,140,140,140,140,140,139,139,139,139,140,140,140,140,140,139,137,137,137,135,137,137,139,139,139,139,139,140,139,135,137],f:[]},{n:[139],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},k={songData:[{i:[2,100,128,0,3,201,128,0,0,0,32,28,59,0,0,0,195,6,1,1,135,0,0,32,147,6,31,3],p:[1],c:[{n:[147],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1};function T(t){let e=new AudioContext,n=e.createGain();n.connect(e.destination);const a={},r=(t,e)=>{a[t]=e},i=[{name:"song",data:w},{name:"sndSplode1",data:M},{name:"sndSplode2",data:m},{name:"sndSplode3",data:b},{name:"sndShield",data:k}];this.generate=()=>(i.forEach(t=>{let n=new v;n.init(t.data),function a(){if(1===n.generate()){let a=n.createWave().buffer;e.decodeAudioData(a,e=>{r(t.name,e)})}else setTimeout(a,0)}()}),new Promise(t=>{!function e(){Object.keys(a).length!==i.length?setTimeout(e,100):t()}()})),this.playSound=(t,r=1,i=0,s=.5,o=!1)=>{const h=a[t];if(!h)return null;let c=e.createBufferSource(),l=e.createGain(),d=e.createStereoPanner();return c.buffer=h,c.connect(d),d.connect(l),l.connect(n),c.playbackRate.value=r,c.loop=o,l.gain.value=s,d.pan.value=i,c.start(),{volume:l,sound:c}}}function S(t,e){const{width:n,height:a}=t.game,r=n*a;this.buffers={Screen:0,Effects:r,Buffer:2*r,Background:3*r,Midground:4*r,Foreground:5*r,Sprites:7*r,Ui:8*r,Collision:9*r};const i=this.buffers,o=[4278715910,4279439380,4280620859,4281145203,4280950964,4280499935,4278872826,4280001529,4282504703,4282449151,4284805846,4282637212,4281712985,4281245716,4282284570,4282077732,4280295442,4284757012,4291058728,4292779812,4291286560,4292607142,4294967295,4290835454,4290303738,4288127221,4285754088,4288367292,4286593657,4283642688,4281606692,4279901218,4280822578,4282073457,4282873275,4284720347,4288467700,4293583066,4291934643,4289696651,4287460717,4284634186,4282464563,4281541698,4281872731,4283585166,4285167034,4288919017,4294960867,4294688697,4293172100,4290678104,4286938439,4283328291,4284777522,4287475549,4290436242,4293064653,4289385188,4287344839,4284647072,4283787129,4282666586,4281612610,4278190080];let h=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64];this.renderTarget=i.Screen,this.renderSource=i.Page1;const c=e.getImageData(0,0,n,a);let l=new ArrayBuffer(c.data.length),d=new Uint8ClampedArray(l),f=new Uint32Array(l),g=new Uint8ClampedArray(n*a*22);this.clear=t=>{g.fill(t,this.renderTarget,this.renderTarget+r)},this.pset=(t,e,r)=>{t=u(0|t,0,n),e=u(0|e,0,a),g[this.renderTarget+e*n+t]=r},this.pget=(t,e,r)=>(t=u(0|t,0,n),e=u(0|e,0,a),g[r+e*n+t]),this.spr=(t=0,e=0,r=n,i=a,s=0,o=0,c=!1,l=!1)=>{for(let d=0;d<i;d++)for(let i=0;i<r;i++)if(o+d<a&&s+i<n&&o+d>-1&&s+i>-1&&!c&!l){let a=this.renderTarget+((o+d)*n+s+i),r=this.renderSource+((e+d)*n+t+i);g[r]>0&&(g[a]=h[g[r]])}},this.rspr=(t,e,r,i,s,o,c,l)=>{let d=r/2|0,f=i/2|0,u=r/2*1.41421|5,p=i/2*1.41421|5,y=-u,x=u,v=-p,w=p,M=Math.cos(-l),m=Math.sin(-l);for(let c=v;c<w;c++)for(let l=y;l<x;l++){let u=d+Math.round(M*l+m*c),p=f+Math.round(-m*l+M*c),y=l+s|0,x=c+o|0;if(y>0&&y<n&&x>0&&x<a&&u>=0&&p>=0&&u<r&&p<i){let a=this.renderSource+(u+t)+(p+e)*n,r=this.renderTarget+y+x*n;g[a]>0&&(g[r]=h[g[a]])}}};this.rspr3=(t,e,a,r,i,s,o,c)=>{let l=a/2|0,d=r/2|0,f=a/2|0,u=r/2|0,p=-f,y=f,x=-u,v=u;const w=(t=>{const e=Math.cos(t[0]),n=Math.sin(t[0]),a=Math.cos(t[1]),r=Math.sin(t[1]),i=Math.cos(t[2]),s=Math.sin(t[2]),o=e*a,h=e*r*s-n*i,c=e*r*i+n*s,l=n*a,d=n*r*s+e*i,f=n*r*i-e*s,u=-r,g=a*s,p=a*i;return(t,e,n)=>[o*t+h*e+c*n,l*t+d*e+f*n,u*t+g*e+p*n]})(o);for(let o=x;o<v;o++)for(let c=p;c<y;c++){let f,u,p,y=100,x=i+c|0,v=s+o|0;if([f,u,p]=w(c,o,y),0===p)continue;const M=y;if([f,u]=[l+Math.round(f/p*M),d+Math.round(u/p*M)],x>=0&&x<a&&v>=0&&v<r&&f>=0&&f<a&&u>=0&&u<r){let a=this.renderSource+(f+t)+(u+e)*n,r=this.renderTarget+x+v*n;g[a]>0&&(g[r]=h[g[a]])}}},this.line=(t,e,n,a,r)=>{let i,s=(a|=0)-(e|=0),o=(n|=0)-(t|=0),h=1,c=1;if(s<0&&(s=-s,c=-1),o<0&&(o=-o,h=-1),s<<=1,o<<=1,this.pset(t,e,r),o>s)for(i=s-(o>>1);t!=n;)i>=0&&(e+=c,i-=o),t+=h,i+=s,this.pset(t,e,r);else for(i=o-(s>>1);e!=a;)i>=0&&(t+=h,i-=s),e+=c,i+=o,this.pset(t,e,r)},this.circle=(t,e,n,a)=>{let r=-n,i=0,s=2-2*n;do{this.pset(t-r,e+i,a),this.pset(t-i,e-r,a),this.pset(t+r,e-i,a),this.pset(t+i,e+r,a),(n=s)<=i&&(s+=2*++i+1),(n>r||s>i)&&(s+=2*++r+1)}while(r<0)},this.fillCircle=(t,e,n,a)=>{if(n<0)return;t|=0,e|=0,a|=0;let r=-(n|=0),i=0,s=2-2*n;do{this.line(t-r,e-i,t+r,e-i,a),this.line(t-r,e+i,t+r,e+i,a),(n=s)<=i&&(s+=2*++i+1),(n>r||s>i)&&(s+=2*++r+1)}while(r<0)},this.fillRect=(t,e,n,a,r)=>{t|=0,e|=0,n|=0,a|=0;let i=Math.abs(a-e);if(this.line(t,e,n,e,r),i>0)for(;--i;)this.line(t,e+i,n,e+i,r);this.line(t,a,n,a,r)},this.fr=(t,e,n,a,r)=>{let i=0|t,s=0|e,o=t+n|0,h=e+a|0,c=Math.abs(h-s);if(this.line(i,s,o,s,r),c>0)for(;--c;)this.line(i,s+c,o,s+c,r);this.line(i,h,o,h,r)};this.render=()=>{let t=i.Effects;for(;t--;)f[t]=o[h[g[t]]];c.data.set(d),e.rotate(.5*s),e.putImageData(c,0,0)}}const B=function(){const t={0:"\n.....\n.   .\n. . .\n.   .\n.....\n",1:"\n ..\n. .\n  .\n  .\n....\n",2:"\n ...\n.  .\n  .\n . \n....\n",3:"\n ...\n.  .\n  .\n   .\n....\n",4:"\n   .\n  ..\n . .\n.....\n   .\n   .\n",5:"\n....\n. \n....\n   .\n....\n",6:"\n.....\n.\n.....\n.   .\n.....\n",7:"\n.....\n    .\n    .\n    .\n    .\n",8:"\n.....\n.   .\n.....\n.   .\n.....\n",9:"\n.....\n.   .\n.....\n    .\n.....\n","-":"\n\n\n.....\n\n\n",".":"\n\n\n\n\n .\n"," ":"\n\n\n\n\n\n","/":"\n    .\n   .\n  .\n .\n.\n",a:"\n  .\n . .\n.   .\n.....\n.   .\n",b:"\n....\n.   .\n....\n.   .\n....\n",c:"\n  ...\n.\n.\n.\n ....\n",d:"\n....\n.   .\n.   .\n.   .\n....\n",e:"\n ....\n.\n....\n.\n.....\n",f:"\n ....\n.\n....\n.\n.\n",g:"\n.....\n.\n. ...\n.   .\n.....\n",h:"\n.   .\n.   .\n.....\n.   .\n.   .\n",k:"\n.  .\n. .\n..\n. .\n.  .\n",i:"\n.....\n  .\n  .\n  .\n.....\n",l:"\n.\n.\n.\n.\n.....\n",n:"\n.   .\n..  .\n. . .\n.  ..\n.   .\n",p:"\n....\n.   .\n....\n.\n.\n",r:"\n....\n.   .\n....\n.   .\n.   .\n",s:"\n ...\n.   \n ..\n   .\n...\n",t:"\n.....\n  .\n  .\n  .\n  .\n",u:"\n.   .\n.   .\n.   .\n.   .\n ...\n",v:"\n.   .\n.   .\n.   .\n . .\n  .\n",w:"\n.   .\n.   .\n. . .\n. . .\n . .\n",x:"\n.   .\n . .\n  .\n . .\n.   .\n",y:"\n.   .\n . .\n  .\n  .\n  .\n",unknown:"\n.....\n.   .\n.   .\n.   .\n.....\n"};return Object.keys(t).reduce((e,n)=>({[n]:t[n].replace(/^\n|\n$/g,"").split("\n").map(t=>t.split("")),...e}),{})}();function C(t,e){let n=t.text.length;for(let a=0;a<n;a++){let n=B[t.text.charAt(a)]||B.unknown;for(let r=0;r<5;r++)for(let i=0;i<5;i++)"."===n[r][i]&&(1===t.scale?e.pset(t.x+i+(5+t.hspacing)*a,t.y+r,t.color):e.fr(t.x+i*t.scale+(5*t.scale+t.hspacing)*a,t.y+r*t.scale,t.scale,t.scale,t.color))}}function E(t,e){let n=5*(t={scale:1,hspacing:2,vspacing:2,halign:"center",valign:"center",render:!0,...t}).scale,a=t.text.split("\n"),r=a.slice(0),i=a.length,s=r.sort((t,e)=>e.length-t.length)[0],o=s.length*n+(s.length-1)*t.hspacing,h=i*n+(i-1)*t.vspacing,c=t.x,l=t.y,d=t.x+o,f=t.y+h;"center"===t.halign&&(c=t.x-o/2,d=t.x+o/2),"center"===t.valign&&(l=t.y-h/2,f=t.y+h/2);let u=c+o/2,g=l+h/2;if(t.render)for(let r=0;r<i;r++){let i=a[r],s=i.length*n+(i.length-1)*t.hspacing,o=t.x,c=t.y+(n+t.vspacing)*r;"center"===t.halign&&(o=t.x-s/2),"center"===t.valign&&(c-=h/2),C({x:o,y:c,text:i,hspacing:t.hspacing||0,scale:t.scale||1,color:t.color},e)}return{sx:c,sy:l,cx:u,cy:g,ex:d,ey:f,width:o,height:h}}const D=[,3,4,5,6,7];function P(t,e){const n=(t={text:"",hspacing:10,x:0,y:0,t:0,jump:20,s:{},...t}).text.split("");return n.reduce((n,a,r)=>{const i=f(t.t)+1,s=n.ex+10,o=t.y+f(.2*r+t.t)*t.jump;return E({text:a,x:s+2,y:o+2+1-i,...t.s,color:41},e),E({text:a,x:s+i,y:o,...t.s,color:D[Math.floor(A(o)*(D.length-1))]},e)},E({text:n[0],x:t.x,y:t.y,render:!1}))}const A=(()=>{const t=[];for(let e=0;e<100;e++)t.push(e/100);for(let e=100;e>0;e--)t.push(e/100);return e=>t[Math.round(e)%t.length]})(),L=t=>.04*t/--t*Math.sin(25*t);function O(t,e){const{width:n,height:r}=t.data.game,i=e.buffers,s=t=>{const a=t.data.game.score+"";(t=>{const a=.01*t.data.game.tick,i=.6*n,s=.3*r,o=.008*i,h=n/2-i/2,c=.2*r-s/2;let l=Math.sin(a)*o;e.fr(h+3*o,c+3*o-Math.sin(a)*o,i,s,41),e.fr(h+l,c,i,s,50),E({x:n/2+l,y:.2*r,text:"backout",color:1,scale:5},e)})(t);let i,s=.1*r;i=P({text:"new high score ",x:0*n,y:.45*r,t:.01*t.data.game.tick,s:{color:12,scale:3,render:t.data.game.score>t.data.highscore}},e),P({text:a,x:i.ex-.5*s,y:.45*r,t:.01*t.data.game.tick,s:{color:12,scale:3,render:t.data.game.score>t.data.highscore}},e),i=function(t,e){let n=-(t={text:"",hspacing:10,x:0,y:0,t:0,jump:20,s:{},...t}).jump*L(A(10*t.t)),a=4*L(A(10*t.t));return E({text:t.text,hspacing:a+2,x:t.x,y:t.y+n,...t.s},e)}({x:n/2-.5*s,y:.65*r,text:"space",t:.01*t.data.game.tick,jump:10,s:{color:5,scale:2}},e),E({x:i.sx-1.5*s,y:.65*r,text:"press",color:5,scale:2},e),i=E({x:i.ex+2*s,y:.65*r,text:"to play",color:5,scale:2},e),E({x:n/2,y:i.ey+1.5*s,text:"avoid paddles to hit the ball.\nuse arrow keys to control paddles.\nuse space to go faster.",vspacing:8,color:7,scale:1.8},e)};this.render=t=>{e.renderTarget=i.Ui,t.data.state===a.Over&&s(t)}}function j(t,e){const{tileWidth:n,tileHeight:a,width:i,height:o}=t.data.game,c=e.buffers;this.render=t=>{(t=t.play).stars.each(t=>(function(t,e,n){const{x:a,y:r}=e.data;n.renderTarget=c.Midground,n.pset(a,r,48)})(0,t,e)),t.spots.each(t=>(function(t,e,n){n.renderTarget=c.Buffer;const{x:a,y:r,radius:i,color:s}=e.data;n.fillCircle(a,r,i,s),n.fillCircle(a,r,.6*i,s+1)})(0,t,e)),t.blocks.each(t=>(function(t,e){const{x:n,y:a,angle:r,length:i,color:s}=t.data;let o=Math.cos(r)*i,h=Math.sin(r)*i;e.renderTarget=c.Buffer,e.line(n,a,n+o,a+h,s)})(t,e)),t.data.paddles.forEach(n=>(function(t,e,n){const{tick:a}=t.data.game,{x:s,y:h,w:l,h:d,side:u}=e,{vx:g,vy:p}=e,y=1===g||1===p,x=y?12:15;let v=0,w=0,M=y?4:0,m=0,b=0,k={side:u};switch(u){case"left":v=.08*d,w=.03*(o/2-h),k.x=s,k.y=h-20,k.w=l+40,k.h=d+40,m=f(.01*a)*M;break;case"right":v=.08*-d,w=.03*(o/2-h),k.x=s-40,k.y=h-20,k.w=l+40,k.h=d+40,m=-f(.01*a)*M;break;case"up":w=.08*l,v=.01*(i/2-s),k.x=s-20,k.y=h,k.w=l+40,k.h=d+40,b=f(.01*a)*M;break;case"down":w=.08*-l,v=.01*(i/2-s),k.x=s-20,k.y=h-40,k.w=l+40,k.h=d+40,b=-f(.01*a)*M}let T=1*f(.01*a),S=1*f(.01*a);n.renderTarget=c.Collision,n.fr(k.x,k.y,k.w,k.h,r.PaddleRange),n.renderTarget=c.Midground,n.fr(s+v*T+m,h+w*S+b,l,d,16),n.fr(s+m,h+b,l,d,x)})(t,n,e)),function(t,e){e.renderTarget=c.Collision;const{vx:n,vy:a,x:r,y:i,radius:s,rotation:o,color:h,active:l,tick:d,exploding:f}=t.data.hero;if(f)return;e.fillCircle(r,i,s,h);const u=Math.cos(o),g=Math.sin(o),p=[40,5,4,3,2],y=p[Math.floor(l)%p.length];e.renderTarget=c.Midground,e.fillCircle(r-.5*n,i-.5*a,s,43),e.fillCircle(r,i,s,y),e.fillCircle(r-u,i-g,.5*s,41)}(t,e),function(t,e){const{vx:n,vy:a,x:r,y:i,friction:o}=t.data.hero;if(o>=1)return;e.renderTarget=c.Buffer;const d=(Math.sin(.01*t.data.game.tick)+1)/2*3;const f=Math.atan2(a,n)+s%h,u=Math.cos(f),g=Math.sin(f),p=l(d,d+2),y=l(d+2,d+4),x=l(d+4,d+8);e.fillCircle(r,i,15,20),e.fillCircle(r+u*p,i+g*p,16,21),e.fillCircle(r+u*y,i+g*y,17,22),e.fillCircle(r+u*x,i+g*x,18,0)}(t,e),function(t,e){e.renderTarget=c.Midground;let r=i/n,s=o/a;for(let t=0;t<r;t++)for(let r=0;r<s;r++){let i,s;i=t*n,s=r*a;let o=e.pget(i,s,c.Buffer);o&&e.fr(i,s,n,a,o)}}(0,e),function(t,e){const n=t.data.hero.edge,a="left"===n?38:41,r="right"===n?38:41,s="up"===n?38:41,h="down"===n?38:41;e.renderTarget=c.Midground,e.fr(0,0,i,1,s),e.fr(0,0,1,o,a),e.fr(0,o-2,i,1,h),e.fr(i-2,0,1,o,r)}(t,e),function(t,e){const n=t.data.game.score+"";e.renderTarget=c.Ui;const a=E({x:.1*i,y:10,text:"score",color:48,scale:1},e);E({x:a.ex+20,y:10,text:n,color:48,scale:1},e)}(t,e)}}function U(t,e){const{width:n,height:a}=t.data.game,r=e.buffers;e.renderTarget=r.Screen;const i=new O(t,e),s=new j(t,e);this.render=t=>{!function(t,e){e.renderTarget=r.Ui,e.clear(0),e.renderTarget=r.Collision,e.clear(0),e.renderTarget=r.Background,e.clear(0),e.renderTarget=r.Buffer,e.clear(0),e.renderTarget=r.Screen,e.clear(0),e.renderTarget=r.Midground,e.clear(0),e.renderTarget=r.Foreground,e.clear(0)}(0,e),s.render(t),i.render(t),function(t,e){if(!t.data.debug)return;e.renderTarget=r.Foreground;for(let t=0;t<64;t++){const a=8*Math.floor(t/32)*4+.1*n,r=t%32*8;e.fillRect(a,r,a+8,r+8,t),E({x:a-8,y:r,hspacing:1,text:t+"",color:t},e)}}(t,e),function(t,e){e.renderSource=r.Background,e.renderTarget=r.Screen,e.spr(),e.renderSource=r.Collision,e.renderTarget=r.Screen,e.renderSource=r.Midground,e.renderTarget=r.Screen,e.spr(),e.renderSource=r.Foreground,e.renderTarget=r.Screen,e.spr(),e.renderSource=r.Ui,e.renderTarget=r.Screen,e.spr()}(0,e),function(t,e){(function(t,e){e.renderTarget=r.Effects,e.clear(0);let{angle3:i}=t.data.extrusion;i=i.map(g),e.renderSource=r.Screen,e.renderTarget=r.Effects,e.spr(),e.renderTarget=r.Screen,e.fr(0,0,n,a,0),e.renderSource=r.Effects,e.renderTarget=r.Screen,e.rspr3(0,0,n,a,n/2,a/2,i)})(t,e),function(t,e){e.renderTarget=r.Effects,e.clear(0);let{angle:i,x:s,y:o}=t.data.shake;i=g(i),s=g(s),o=g(o),e.renderSource=r.Screen,e.renderTarget=r.Effects,e.spr(),e.renderTarget=r.Screen,e.clear(0),e.renderSource=r.Effects,e.renderTarget=r.Screen,e.rspr(0,0,n,a,n/2+s,a/2+o,1,i)}(t,e)}(t,e)}}function K(t,e){this.alive=[],this.dead=[],this.create=n=>{if(this.dead.length>0){let t=this.dead.pop();return t.init(n),this.alive.push(t),t}{let a=new t(e);return a.init(n),this.alive.push(a),a}},this.release=t=>{let e=this.alive.indexOf(t);e>-1&&this.dead.push(this.alive.splice(e,1)[0])},this.each=t=>{this.alive.forEach(t)},this.find=t=>this.alive.find(t)}function R(t,e,n){return n((n,a)=>t.pget(n,a,t.buffers.Collision)===e)}function H({x:t,y:e,w:n,h:a}){return r=>{for(let i=0;i<n;i+=1)for(let n=0;n<a;n+=1){if(r(t+i,e+n))return{x:i,y:n}}return null}}function I(t,{g:e,a:n}){const{width:a,height:i}=t.data.game;let s;this.init=t=>{s=t};const c=t=>{R(e,r.PaddleRange,function({x:t,y:e,radius:n}){return a=>{for(let r=0;r<h;r+=o){const i=Math.cos(r)*n,s=Math.sin(r)*n;let o=t+i,h=e+s;if(a(o,h))return{x:o,y:h}}return null}}(s))?f():g()};this.xDeg=0,this.yDeg=0;const l=t=>{const e=2*(s.y/i-.5),n=2*(s.x/a-.5);this.xDeg+=1*(e-this.xDeg),this.yDeg+=1*(n-this.yDeg);this.xDeg,this.yDeg},d=e=>{s.exploding||((t=>{const{radius:e}=s,n=s.friction;s.vx+=s.ax*t*.001*s.boost,s.vy+=s.ay*t*.001*s.boost,s.vx*=n,s.vy*=n,s.x+=s.vx,s.y+=s.vy,s.x<e&&(s.x=e,s.vx*=-.5,s.ax*=-1,s.edge="left",s.active=4,s.audioEdge=!0),s.y<e&&(s.y=e,s.vy*=-.5,s.ay*=-1,s.edge="up",s.active=4,s.audioEdge=!0),s.x>=a-e&&(s.x=a-e,s.vx*=-.5,s.ax*=-1,s.edge="right",s.active=4,s.audioEdge=!0),s.y>=i-e&&(s.y=i-e,s.vy*=-.5,s.ay*=-1,s.edge="down",s.active=4,s.audioEdge=!0)})(e),(e=>{t.spots.create({x:s.x-10*s.ax,y:s.y-10*s.ay,color:4,life:2}),t.spots.create({x:s.x-5*s.ax,y:s.y-5*s.ay,color:7,life:2})})())};this.update=e=>{d(e),(t=>{s.rotation+=s.active,s.rotation=s.rotation%h})(),(t=>{const{x:e,y:n}=s;let r,o,h,c;e<a/2?(r=e,h=[0,1]):(r=a-e,h=[0,-1]),n<i/2?(o=n,c=[1,0]):(o=i-n,c=[-1,0]),s.closestEdge=r<o?h:c,s.inwards=1===Math.sign(_(s.closestEdge,[s.vx,s.vy]))})(),c(),(e=>{if(4===s.active&&!s.audioEdge){const e=Math.atan2(s.vy,s.vx);t.shake(e)}})(),(t=>{4===s.active&&(s.audioEdge?(s.audioEdge=!1,n.playSound("sndSplode2")):n.playSound("sndSplode3")),s.friction<1&&n.playSound("sndShield",1,0,.2),s.exploding&&!s.audioExplode&&(s.audioExplode=!0,n.playSound("sndSplode1"))})(),(t=>{s.tick+=t,s.active>0?s.active=Math.max(0,s.active-t/16*.2):delete s.edge})(e),(e=>{t.data.game.score+=Math.floor(s.active),t.data.game.score+=Math.floor(Math.sqrt(Math.sqrt(s.boost-1)))})(),l()},this.boost=t=>{s.boost=t},this.changeV=t=>{const e=[Math.cos(t),Math.sin(t)],n=[-s.vx,-s.vy],a=[n[0]+e[0],n[1]+e[1]];s.vx=u(2*a[0],-1,1),s.vy=u(2*a[1],-1,1),s.ax=u(2*a[0],-1,1),s.ay=u(2*a[1],-1,1),s.active=4},this.explode=()=>{s.friction=1,s.exploding=!0};const f=()=>{s.inwards||s.exploding||(s.friction=.9)},g=()=>{s.friction=1}}const _=(t,e)=>t[0]*e[1]+t[1]*e[0];function F(t,e){const{width:n,height:a}=t.data.game,r=t.data.paddles,s=t=>({e:t,c:R(e,i,H(t))});this.update=e=>{(e=>{r.map(s).find(t=>!!t.c)&&t.paddleHit()})(),r.forEach(r=>(e=>r=>{e.x+=e.vx*t.data.paddleBoost[0],e.y+=e.vy*t.data.paddleBoost[1],e.x>n-e.w&&(e.x=n-e.w,e.vx*=-1),e.x<0&&(e.x=0,e.vx*=-1),e.y>a-e.h&&(e.y=a-e.h,e.vy*=-1),e.y<0&&(e.y=0,e.vy*=-1)})(r)(e))}}function W(t){this.init=t=>{this.data={...e(),...t},this.data.radius=2*this.data.life},this.update=e=>{this.data.life-=.01*e,this.data.radius=2*this.data.life,this.data.life<0&&t.spots.release(this)};const e=()=>({x:0,y:0,color:12,life:10})}function q(t){this.init=t=>{this.data={...V(),...t},this.life=10,this.baseX=this.data.x,this.baseY=this.data.y},this.update=t=>{n(t),e(t)};const e=t=>{const e=10*Math.cos(this.life),n=10*Math.sin(this.life);this.data.x=this.baseX+e,this.data.y=this.baseY+n},n=e=>{this.life-=.001*e,this.life<0&&t.blocks.release(this)}}const G=()=>d([18,20,5]),V=()=>({x:0,y:0,angle:c,length:100,color:G()});function X(t,e){const{width:n,height:a}=t.data.game;this.init=t=>{this.falling=!1,this.data={...Y(n,a),...t}},this.update=t=>{i(t),r(t),this.data.life<=2&&!this.falling&&(this.falling=!0,this.data.vx=2*l(-1,1),this.data.vy=2*l(-1,1))};const r=e=>{this.data.vx+=-t.data.hero.ax*e*.001,this.data.vy+=-t.data.hero.ay*e*.001,this.data.x+=this.data.vx,this.data.y+=this.data.vy},i=e=>{this.data.life-=.001*e,this.data.life<0&&t.stars.release(this)}}const Y=(t,e)=>({x:l(0,t),y:l(0,e),vx:0,vy:0,life:10});function $(t,e){const{g:n,a:r}=e;this.data=t.data;const{width:s,height:o}=this.data.game;this.hero=new I(this,e),this.paddles=new F(this,n),this.blocks=new K(q,this),this.spots=new K(W,this),this.stars=new K(X,this);const c=t=>{const e=this.blocks.find(t=>R(n,i,function({x:t,y:e,angle:n,length:a}){return r=>{for(let i=0;i<a;i+=.1){const a=Math.cos(n)*i,s=Math.sin(n)*i;let o=t+a,h=e+s;if(r(o,h))return{x:o,y:h}}return null}}(t.data)));e&&u(e)},d=()=>l(2,5),f=(t,e,n)=>{this.spots.create({x:t,y:e,color:n}),l(0,1)<.5&&this.spots.create({x:t+20,y:e,life:d(),color:n}),l(0,1)<.5&&this.spots.create({x:t-20,y:e,life:d(),color:n}),l(0,1)<.5&&this.spots.create({x:t+20,y:e+20,life:d(),color:n}),l(0,1)<.5&&this.spots.create({x:t+20,y:e-20,life:d(),color:n}),l(0,1)<.5&&this.spots.create({x:t,y:e+20,life:d(),color:n}),l(0,1)<.5&&this.spots.create({x:t,y:e-20,life:d(),color:n})},u=t=>{const{x:e,y:n,angle:a,color:r}=t.data;this.hero.changeV(a),this.blocks.release(t),f(e,n,r)},g=()=>{this.userBoost?(this.hero.boost(20),y(this.userBoost,()=>{this.userBoost=0},100)):this.hero.boost(1)},v=z(()=>{const t=this.data.game.unit;this.blocks.create({x:l(t,s-t),y:l(t,o-t),length:.4*t,angle:l(0,h/4-h/8)+h/10})},1e3),w=z(()=>{this.stars.create({life:l(0,10)})},100),M=t=>{this.data.gameover>0&&y(this.data.gameover,()=>{this.data.gameover=0,this.data.state=a.Over},1e3)};this.reset=()=>{const t=x();this.data.game.score>this.data.highscore&&(this.data.highscore=this.data.game.score),this.data.hero=t.hero,this.data.game=t.game,this.hero.init(this.data.hero)},this.boost=()=>{this.userBoost=p()},this.paddleHit=()=>{this.data.hero.inwards||(this.hero.explode(),f(this.data.hero.x,this.data.hero.y,3),this.data.gameover=p())},this.paddleMove=t=>{0!==t[0]&&(this.data.paddleBoost[0]=t[0]),0!==t[1]&&(this.data.paddleBoost[1]=t[1])},this.shake=e=>{t.screenshake.shake({translate:15,rotate:.15,xBias:Math.cos(e),yBias:-10*Math.sin(e)})},this.extrude=t=>{this.data.extrusion.angle3[0]=t[0],this.data.extrusion.angle3[1]=t[1],this.data.extrusion.angle3[2]=t[2]},this.update=t=>{g(),v(t),w(t),M(),c(),this.hero.update(t),this.paddles.update(t),this.blocks.each(e=>e.update(t)),this.spots.each(e=>e.update(t)),this.stars.each(e=>e.update(t))}}const z=(t,e,n)=>{let a=0;return r=>{(a+=r)>=e?(t(),a=0):n&&n(a/e)}};function J(t,e){const{g:n}=e;this.data=t.data;const a=()=>{this.data.game.score,this.data.highscore};this.update=t=>{a()}}function N(t,{g:e,a:n}){const a=t.data.shake;this.translate=0,this.rotate=0,this.xTarget=0,this.yTarget=0,this.xBias=0,this.yBias=0,this.angleTarget=0,this.shake=({translate:t,rotate:e,xBias:n,yBias:a})=>{this.translate=t,this.rotate=e,this.xBias=n,this.yBias=a},this.update=t=>{this.xBias*=.9,this.yBias*=.9,this.translate>0?(this.translate*=.9,this.xTarget=l(-this.translate,this.translate)+this.xBias,this.yTarget=l(-this.translate,this.translate)+this.yBias):(this.xTarget=0,this.yTarget=0),this.rotate>0?(this.rotate*=.9,this.angleTarget=l(-this.rotate,this.rotate)):this.angleTarget=0,a.x+=.1*(this.xTarget-a.x),a.y+=.1*(this.yTarget-a.y),a.angle+=.1*(this.angleTarget-a.angle)}}function Q(t,e){const{g:n,a:r}=e;this.data=t,this.play=new $(this,e),this.over=new J(this,e),this.screenshake=new N(this,e);const i=t=>{this.data.state===a.Play&&this.play.update(t)},s=t=>{this.data.state===a.Over&&this.over.update(t)};this.spaceHit=()=>{this.data.state===a.Play?this.play.boost():(this.play.reset(),this.data.state=a.Play)};this.pressKey=t=>{switch(t){case"up":this.play.paddleMove([0,-3]);break;case"down":this.play.paddleMove([0,3]);break;case"left":this.play.paddleMove([-3,0]);break;case"right":this.play.paddleMove([3,0])}},this.releaseKey=t=>{switch(t){case"up":this.data.paddleBoost[1]<0&&this.play.paddleMove([0,1]);break;case"down":this.data.paddleBoost[1]>0&&this.play.paddleMove([0,1]);break;case"left":this.data.paddleBoost[0]<0&&this.play.paddleMove([1,0]);break;case"right":this.data.paddleBoost[0]>0&&this.play.paddleMove([1,0])}},this.update=t=>{i(t),s(t),this.screenshake.update(t),this.data.game.tick+=t}}const Z=void 0!==window.performance?window.performance:Date,tt=()=>Z.now(),et=window.requestAnimationFrame;function nt(t){let e=!1,n=tt(),a=0;this.start=()=>e?this:(e=!0,n=tt(),a=et(r),this),this.stop=()=>(e=!1,0!=a&&et.cancel(a),a=0,this);const r=()=>{a=et(r);const e=tt();t(e-n),n=e}}function at(t,e,n){return t.addEventListener(e,n),()=>t.removeEventListener(e,n)}function rt(t,e){const n=document.createElement("canvas"),a=n.getContext("2d"),r={...x()};let i=new T(r);r.debug||i.generate().then(()=>{i.playSound("song",1,0,.2,!0)});let s=new S(r,a),o=new Q(r,{g:s,a:i}),h=new U(o,s);new nt(t=>{o.update(t),h.render(o),s.render()}).start(),n.width=r.game.width,n.height=r.game.height,t.append(n),function(t){const e=[],n=function(t){return function(e){switch(e.code){case"Space":t.spaceHit();break;case"ArrowUp":t.pressKey("up");break;case"ArrowDown":t.pressKey("down");break;case"ArrowLeft":t.pressKey("left");break;case"ArrowRight":t.pressKey("right");break;default:return}e.preventDefault()}}(t),a=function(t){return function(e){switch(e.code){case"ArrowUp":t.releaseKey("up");break;case"ArrowDown":t.releaseKey("down");break;case"ArrowLeft":t.releaseKey("left");break;case"ArrowRight":t.releaseKey("right")}}}(t);e.push(at(document,"keydown",n)),e.push(at(document,"keyup",a))}(o)}n.d(e,"app",function(){return rt})}]);