// Simulador de balance de Duelo de Puños: CPU vs CPU en los 25 cruces (SK1 x SK2), sin pantalla.
// Uso (desde la carpeta de la galería):  node simular_duelo.js 300            -> 300 partidas por cruce
//                                        node simular_duelo.js 300 ruta/duelo.html
const fs=require('fs');
const h=fs.readFileSync(process.argv[3]||process.env.DUELO||'./juegos/duelo.html','utf8');
const js=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));
const P=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='length'?0:k==='width'||k==='height'||k==='clientWidth'?800:P,set:()=>true,apply:()=>P,construct:()=>P});
for(const m of h.matchAll(/id="([A-Za-z0-9_]+)"/g))global[m[1]]=P;
global.window=global;global.document=P;global.navigator={vibrate(){},maxTouchPoints:0,userAgent:''};
global.localStorage={getItem:()=>null,setItem(){}};global.innerWidth=900;global.innerHeight=500;
global.requestAnimationFrame=()=>0;global.addEventListener=()=>{};global.setInterval=()=>0;global.setTimeout=()=>0;
global.AudioContext=function(){throw 1};global.matchMedia=()=>({matches:false});global.getComputedStyle=()=>P;
let seed=1;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
global.__setSeed=s=>{seed=s};
const exp=`;globalThis.G={get SK1(){return SK1},get SK2(){return SK2},set s1(v){s1=v},set s2(v){s2=v},set dif(v){dif=v},start,step,get F(){return F},get S(){return S},ovr(){inp=function(i){return i==0?ai(F[0],F[1]):ai(F[1],F[0])}}};`;
const i=js.lastIndexOf('})();');(0,eval)(js.slice(0,i)+exp+js.slice(i));
console.log('SK1:',G.SK1.length,G.SK1.map(k=>k.n).join(','));
G.ovr();
function match(a,b,seed){__setSeed(seed);G.s1=a;G.s2=b;G.start(1);let n=0;
  while(G.S!=="menu"&&n++<80000)G.step();
  const f=G.F;return n>=80000?null:[f[0].wins,f[1].wins,n];}
const N=+process.argv[2]||10,t0=Date.now();
const W1=Array(5).fill(0),W2=Array(5).fill(0),M=[],L1=[],L2=[];
let p1=0,p2=0,steps=0;
for(let a=0;a<5;a++){M[a]=[];for(let b=0;b<5;b++){let w=0,l=0;
  for(let i=0;i<N;i++){const r=match(a,b,1000*a+10*b+i+1);if(!r)continue;steps+=r[2];
    if(r[0]>r[1]){w++;W1[a]++;p1++}else{l++;W2[b]++;p2++}}
  M[a][b]=Math.round(100*w/Math.max(1,w+l));}}
const n1=G.SK1.map(k=>k.n),n2=G.SK2.map(k=>k.n);
console.log('Gana P1 (izq) en cada cruce, %  (filas SK1 vs columnas SK2)');
console.log('          '+n2.map(x=>x.padEnd(9)).join(''));
M.forEach((r,a)=>console.log(n1[a].padEnd(10)+r.map(x=>String(x).padEnd(9)).join('')));
const T=N*5;
console.log('\nVictorias totales por personaje (de '+T+' partidas c/u):');
n1.forEach((n,a)=>console.log(' ',n.padEnd(9),Math.round(100*W1[a]/T)+'%'));
n2.forEach((n,b)=>console.log(' ',n.padEnd(9),Math.round(100*W2[b]/T)+'%'));
console.log('Lado izquierdo (P1):',Math.round(100*p1/(p1+p2))+'% | pasos',steps,'| s',(Date.now()-t0)/1000);
