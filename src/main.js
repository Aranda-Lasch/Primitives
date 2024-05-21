// primatives by Aranda\Lasch
// Benjamin Aranda
// Jesse Bassett
// Joaquin Bonifaz
// Chris Lasch


document.oncontextmenu = () => false;//doesnt allow left click for more info :)

let tknum = 123;
let tokenData = genTokenData(tknum);
let hash = tokenData.hash;
//fake hash for testing
function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }

  data.hash = "0xc8d22528af4ebde207b70700c20ddfe64bac8a6afb23be649c9f77e818d798e1"; //hash;
  data.hash = hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
}

/ RANDOM FUNCTIONS ///////////////////////////////////////////////////////////////////////////////
class Random  {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8,
        8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
}

let R, R1, R2, R3, R4, R10, R11;
//console.log(tokenData);
//tokenData.hash = '0xab5330b999e10ed4290e2098d715ecd98d7fd58c5901f16f8c4d41ed4bd5e3f0';
//tokenData.hash = '0x91c39407a8ca53234fda90221ad89b74f47d4a100b6bdaca1adb1e9a60574263';

R = new Random();
R1 = new Random();
R2 = new Random();
R3 = new Random();
R4 = new Random();
R10 = new Random();
R11 = new Random();

// Gategory class //////////////////////////////////////////////////////////////////////////////////

class Category{
  constructor(_arr = [ {name: 'default', chance: 1, amount: 1, min:0, max:1 } ] ){
    this.count = 500,
    this.arr = _arr,
    this.select = {}
  }
    setByAmount(){
      let sum = 0;
      for (let i = 0; i < this.arr.length; i++){
        sum += this.arr[i].amount
      }
      this.count = sum;
      for (let i = 0; i < this.arr.length; i++){
        this.arr[i].chance = this.arr[i].amount / this.count;
      }
    }

    setByChance(_cnt = this.count){
      let sum = 0;
      for (let i = 0; i < this.arr.length; i++){
        sum += this.arr[i].chance
      }

      //if(sum == 1){// i assume some floating point error
      if(sum >= .9999999999 && sum <= 1.00000000001){
        for (let i = 0; i < this.arr.length; i++){
          this.arr[i].amount = this.arr[i].chance*this.count;
        }

      }else{
        console.log('Improper Sum: ' + sum);//doesnt sum to 1
      }
    }

    sum(){
      let arrMaxtemp = [];
      let arrMintemp = [];
      arrMintemp.push(0);
      for (let i = 0; i < this.arr.length; i++){
        arrMaxtemp.push(this.arr[i].chance);
        arrMintemp.push(this.arr[i].chance);
      }
      arrMintemp.pop();
      arrMaxtemp = partialSum(arrMaxtemp);
      arrMintemp = partialSum(arrMintemp);
      for (let i = 0; i < this.arr.length; i++){
        this.arr[i].min = arrMintemp[i];
        this.arr[i].max = arrMaxtemp[i];
      }
    }

    pickCategory(){
    let param = R.random_dec();  //random function can be changed
    let category;
    for (let i = 0; i < this.arr.length; i++){
      if(this.arr[i].min <= param && param < this.arr[i].max){
        category = this.arr[i].name;
      }
    }
    this.select = {name:category, value:param};
    return {name:category, value:param};
    }

    setCategory(_cat){
      let param = 0;
      let category;
      for (let i = 0; i < this.arr.length; i++){
        if(_cat == this.arr[i].name){
          category = this.arr[i].name;
        }
      }

      this.select = {name:category, value:param};
      return {name:category, value:param};
    }

    setCategoryValue(_val){
      let param;
      let category;
      for (let i = 0; i < this.arr.length; i++){
        if(this.arr[i].min <= _val && _val < this.arr[i].max){
          category = this.arr[i].name;
          param = _val;
        }
      }
      this.select = {name:category, value:param};
      return {name:category, value:param};
    }
}

function partialSum(arr){
  return arr.reduce((acc, el, i, arr) => {
    const slice = arr.slice(0, i + 1)
    const sum = slice.reduce((a, b) => a + b, 0)
    return [...acc, sum]
  }, [])
}


//Category v 0.01

/*

// allows control of category by amount or chance, automatically sets bounds for picking between 0,1 ( min, max )

let plotCategoryLibrary = [
  {name: 'circle', chance: 0, amount: 1, min:0, max:0 },
  {name: 'disk', chance: 0, amount: 1, min:0, max:0 },
  {name: 'axialSym', chance: 0, amount: 1, min:0, max:0 },
];
let plotCategory = new Category(plotCategoryLibrary);
plotCategory.setByAmount();                                   //Sets the chance = (declared amounts)/(sum of all amounts)
//plotCategory.setByChance(totalCount);                       //Sets the Amounts by the supplied total count & declared chances
plotCategory.sum();                                           //determines Min + max values
plot = plotCategory.pickCategory().name;             //Picks random category

for (i = 0; i < plotCategory.arr.length; i++) {
  if( plot == plotCategory.arr[0].name ){
  // category 0 logic
  }else if( plot == plotCategory.arr[1].name ){
  // category 1 logic
  }else if( plot == plotCategory.arr[2].name ){
  // category 2 logic
  }else if( plot == plotCategory.arr[3].name ){
  // category 3 logic
  }
}

*/


// NEW CATEGORY DECLARE ///////////////////////////////////////////////////////////////////////////

/*
let scale_arr = ["1x", "2x"];
let colr_arr = ["warm","cool","grey","white"];
let bkgd_arr = ["dark hatch", "blank", "grid lattice", "linear hatch", "stipple hatch", "noise hatch", "cross hatch", "outline hatch",];
let frac_arr = ["shallow", "medium", "deep"];
let patt_arr = ["cluster", "branch", "hole", "bulk", "loop", "line", "point"];
let scat_arr = [  ];
let comp_arr = ["complete","empty","empty2","wireframe"];
let plex_arr = ["low","medium","high"];

let scale_arr;
let colr_arr;
let bkgd_arr;
let frac_arr;
let patt_arr;
let scat_arr;
let comp_arr;
let plex_arr;
*/



// GLOBAL Geometry Vars //////////////////////////////////////////////////////////////////////////////////

//Grow class
let grw;

//lists to hold information in a "stack"
let go = [];
let resetGo = []; //initial verts position of centered cluster
let goDepot = [];
let resetDepot = [];

//Current items
let currGo; //the current Golden Octahedra
let currFace; //the current Face to grow from
let currPoint; //the current point we are "starring" around

//drawing vars
let steps = 0;

//target point
let targetPt; //point to grow to, on update (vector)
let currArraySize = 0; //keep track of the number of units every grow cycle

let  zflag=0;

//Lighting
let sun = new p5.Vector(1, -1, 1);
sun.normalize();

//camera
let myAngle = 0.0;

//render model
let geom;
let mGo = 0; //counter of current Go to model
let goModels = [];
let goModelsDepot = [];
let timer;
let delay = 3;

let img;

let centerX;;
let centerY;
let centerZ;
let xMin, xMax, yMin, yMax, zMin, zMax;
let bBox = [];

let goNum;
let currCluster = 0;
let grow = 1;

let rand, rand1, rand2, rand3;
let zoomRR;
let initGrow = true;
let num;
//artblocks vars
var DEFAULT_SIZE = 1400;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE;

let Lstring = "ffff+fff";

let shad_Size = 512;//MUST BE POWER OF 2. 256,512,1024,2048
let myImg;
let canvas;
let drawTex = true;

let UNI = ['LF1','LF2','LR1','LR2','dA1','dA2','df1','df2','wb1','wb2','bb1','bb2','Nf1','Nf2','Nn1','Nn2','Nx1','Nx2','indx','Ld','cBlend'];
let shaderA;
let sG = 10.0;
let UNIVAR = [
  [
    [54.640+sG,49.324+sG,40.324+sG,50.+sG], [80.48+sG, 0.],
    [1.57079632679,-0.788,-0.788,-4.668], [3.604, 0.],
    [2.0,100.160,100.160,2.880], [2.880, 0.],
    [147.2,516.8,516.8,589.6], [589.6, 0.],
    [3.424,4.816,4.816,4.056], [3.592, 0.],
    [1.484,0.860,0.860,0.860], [0.860, 0.],
    [40.,43.752,41.752,24.216], [0.0,1.2],
    [-0.020,-0.260,-0.260,0.100], [0., 0.],
    [0.304,0.376,0.376,0.376], [0.,1.],
    1.0, [0., 0., 0., 0.], 0.796,
  ],
  [
    [52.696+sG, 54.324+sG, 55.324+sG, 62.392+sG],[80.48+sG, 0.],
    [0.,0.796,1.640,3.196],[5.332, 5.],
    [11.712, 100.160, 100.160, 2.880],[2.880, 0.],
    [247.2, 516.8, 516.8, 589.6],[589.6, 0.],
    [2.904, 3.608, 3.192, 3.224],[3.592, 0.],
    [1.484, 0.860, 0.860, 0.860],[0.860, 0.],
    [16.376, 35.832, 36.136, 3.312],[4.152, -1.152],
    [0.0, 0.220, -0.124, 0.100],[0.100, 0.1],
    [0.0, 0.400, 0.560, 1.128],[1.128, 1.],
    2.0, [0., 0., 0., 0.], 0.796
  ],
  [
    [54.640+sG, 49.324+sG, 49.324+sG, 49.284+sG], [80.48+sG, 0.],
    [0., 1.580, 4.548, 2.316], [3.604, 0.],
    [11.712, 100.160, 100.160, 98.696], [2.880, 0.],
    [247.2, 516.8, 516.8, 621.6], [589.6, 0.],
    [3.488, 3.088, 3.056, 3.848], [3.592, 0.],
    [1.484, 0.860, 0.860, 0.860], [0.860, 0.],
    [16.376, 35.832, 36.136, 36.136], [4.152, -1.5],
    [-0.00, -0.260, -0.124, -0.124], [0.100, 0.1],
    [0.400, 0.400, 0.560, 0.592], [1.128, 1.],
    3.0, [0., 0., 0., 0.], 0.796
  ],
  [
    [60.320+sG, 49.324+sG, 49.324+sG, 49.284+sG], [80.408+sG, 0.],
    [2.227, 0.836, 6.828, 2.316], [3.932, 0.],
    [11.632, 11.256, 100.160, 98.696], [2.880, 0.],
    [553.6, 290.4, 516.8, 621.6], [589.6, 0.],
    [2.920, 3.840, 3.712, 3.880], [2.832, 0.],
    [0.276, 1.188, 0.860, 0.860], [0.860, 0.],
    [16.376, 35.832, 36.136, 36.136], [4.152, 0.7],
    [0.388, 0.212, -0.124, -0.124], [0.100, 0.1],
    [1.024, 0.424, 0.560, 0.592], [1.544, 1.],
    4.0, [-0.168, 2.336, 1.506, 0.952], 0.810
  ],
  [
    [53.720+sG, 46.468+sG, 49.324+sG, 49.284+sG], [50.352+sG, 0.],
    [3.963, 2.032, 6.876, 0.100], [2.604, 0.],
    [13.384, 11.112, 100.160, 98.696], [3.240, 0.],
    [487.2, 290.4, 516.8, 621.6], [589.6, 0.],
    [2.696, 2.808, 2.488, 2.960], [1.464, 0.],
    [0.196, 1.188, 0.900, 0.860], [0.860, 0.],
    [16.376, 35.832, 24.264, 33.872], [3.200, -.8],
    [0.572, 0.212, -0.124, -0.124], [-0.084, 0.05],
    [0.976, 0.656, 0.480, 0.592], [1.816, 0.9],
    5.0, [0.630,0.378,0.601,3.632], 0.924
  ],
  [
    [58.408+sG, 46.468+sG, 53.916+sG, 51.336+sG], [40.424+sG, 0.],
    [4.707, 1.104, 6.676, 2.596], [2.980, 0.],
    [12.208, 10.120, 100.160, 98.704], [2.880, 0.],
    [578.4, 290.4, 516.8, 621.6], [589.6, 0.],
    [1.156, 2.376, 2.376, 2.168], [2.208, 0.],
    [0.708, 1.188, 0.860, 0.860], [0.860, 0.],
    [18.168, 40.832, 25., 3.136], [3.112, 1.112],
    [0.108, 0.212, -0.124, -0.116], [0.100, 0.100],
    [1.304, 0.512, 0.560, 1.072], [1.104, 1.104],
    6.0, [0., 0., 0., 0.], 0.796
  ],
  [
    [60.320+sG, 60.324+sG, 61.692+sG, 61.336+sG], [50.424+sG, 0.],
    [2.091, 0.796, 4.724, 2.596], [4.788, 0.],
    [18.376, 10.544, 100.160, 98.704], [2.880, 0.],
    [553.6, 444.0, 516.8, 621.6], [589.6, 0.],
    [1.616, 2.280, 2.720, 2.312], [1.776, 0.],
    [1.484, 1.188, 0.860, 0.860], [0.860, 0.],
    [16.744, 35.832, 36.136, 3.136], [4.336, 0.],
    [0.388, 0.212, -0.508, -0.124], [0.100, 0.],
    [1.096, 1.248, 1.360, 0.592], [1.768, 0.],
    7.0, [0., 0., 0., 0.], 0.796,
  ],
  [
    [60.320+sG, 80.324+sG, 51.692+sG, 60.368+sG],[1.+sG, 0.],
    [6.427, 1.012, 6.828, 4.836],[1., 0.],
    [11.632, 10.056, 100.160, 98.696],[4., 0.],
    [553.6, 444., 516.8, 621.6],[0.4, 0.],
    [1.440, 0.920, 2.256, 2.024],[0.2, 0.],
    [1.484, 1.188, 0.860, 0.860],[0.2, 0.],
    [16.160, 35.832, 36.136, 3.136],[0.1, 0.],
    [0.388, 0.212, -0.508, -0.124],[0., 0.],
    [1.096, 1.248, 1.784, 0.496],[0., 0.],
    8.0, [0., 0., 0., 0.], 0.796,
  ],
];




//Grid vars
let gBorder = 1;
let rg; //Grid Object
let gScale = 20; //starting octahedra scale
let gVals =  7 + gBorder; //cube grid///growth variation

///growth variation
let growth_Max = 7;//= 7;
let growth_percent = .5;//= .5;
let growth_type_ratio = .5;//= .5;
let small_death_chance = .1;//= .1;

//initial rotation parameters
//let rotX_init;
//let rotY_init;
//let rotZ_init;

////////////////////NEW SETTINGS ///////////////////////////////////////////


let BKGRID = false; // draw Background Grid?
let bkGridTrueMax = 27;
let bkGridDrawBoundsX = 11;
let bkGridDrawBoundsY = 11;
let bkGridDrawBoundsZ = 11;



// Pick Pattern
//let growthPIndx = 0;
//let growthPatterns = ["cluster","CubeWireframe","Plane","Long1","Long2","Hole","Circle","genX","BranchA","BranchB","BranchC","BranchD","LoopA","LoopB","LoopC","LoopD","lineA","lineB", "point"];
//let gPatternSelect = "cluster";

/*
let growthPIndx = 0;
let patternFuncs = ["cluster","CubeWireframe","Plane","Long1","Long2","Hole","Circle","genX","BranchA","BranchB","BranchC","BranchD","LoopA","LoopB","LoopC","LoopD","lineA","lineB", "point"];
let gPatternSelect = "lineA";
*/
/*
0: CLUSTER
1:BRANCH 1
2:BRANCH 2
3:BRANCH 4
4:LOOP 1
5:LOOP 2
6:LOOP 3
7:LOOP 4
8:LINE 1
9:POINT 1
*/

//let pS =  R11.random_int(2, 6);


let patternSelect;

//console.log(growthPts);
let pS = 1;
//console.log(growthPts);

////////////////////BK TEXTURES/////////////////////////////////////////////
let BKTEXT = false;
let bkImg;
let bkrez = 2048;
let shaderBK;


let bkSCALE = 250, bkrot =0, bkfreq = 0, bkamp = 0, bkNscale = 0, bkNmin = 0, bkNmax = 0;
let bkUniform;

//Delete this later


//let bkGraph;
//let bkShader;


let pattDirector = [];
//[ FUNCTIUON INDEX , ACECTABLE SCALE, FRAC DEPTH RECORDING ],
// Frac Depth: 0 = low or Medium, 1 = high, 2 = XL(not in development but recorded), -1 = Dont rerolloriginal frac depth, 3 = medium2!

//CLUSTER
let pattOrgClust = [
[ 0,0,-1 ],

[ 1,2,0 ],
[ 2,2,0 ],
[ 4,2,0 ],
[ 5,2,0 ],
[ 7,2,0 ],

[ 3,2,1 ],
[ 4,3,1 ],
[ 6,2,1 ],
[ 7,2,1 ],

];

//BRANCH
let pattOrgBranch = [
[ 1,3,3 ],//3//0
[ 2,4,3 ],//3//1
[ 1,4,3 ],//3//1

[ 1,3,3 ],//3//0
[ 2,4,3 ],//3//1
[ 1,4,3 ],//3//1

[ 1,5,1 ],
[ 1,6,1 ],
[ 1,7,1 ],
[ 2,5,1 ],
[ 3,4,1 ],
//[ 2,6,2 ],
//[ 1,8,2 ],
//[ 3,5,2 ],
];

//LOOP
let pattOrgLoop = [
[ 4,4,1 ],
[ 4,5,1 ],
[ 5,4,1 ],
[ 5,5,1 ],
[ 6,5,1 ],
[ 7,3,1 ],
[ 7,4,1 ],
//[ 4,6,2 ],
//[ 5,6,2 ],
//[ 7,5,2 ],
//[ 7,6,2 ],
];

//LINE
let pattOrgLine = [
[ 8,3,3 ],//3//0
[ 8,4,3 ],//3//1

[ 8,3,3 ],//3//0
[ 8,4,3 ],//3//1
[ 8,3,3 ],//3//0
[ 8,4,3 ],//3//1

[ 8,5,1 ],
[ 8,6,1 ],
[ 8,7,1 ],
//[ 8,8,2 ],
];

//HOLE
let pattOrgHole = [
[ 10,0,-1 ],

[ 10,0,-1 ],
[ 10,0,-1 ],

[ 2,3,1 ],
[ 4,4,1 ],
[ 6,3,1 ],
];


//POINT
let pattOrgPT = [
[ 9,0,-1 ],
[ 9,0,-1 ],
[ 9,0,-1 ],
[ 9,0,-1 ],
[ 9,0,-1 ],
[ 9,0,-1 ],

[ 9,0,0 ],
[ 9,0,0 ],
[ 9,0,0 ],
[ 9,0,0 ],
[ 9,0,0 ],
[ 9,0,0 ],

[ 9,0,1 ],
];


// RENDER FLAGS ///////////////////////////////////////////////////////////////////////////////////

let ERASE  = false;
let WIREFRAME   = false;
let OPAQUE = false;

// NEW CATEGORY DECLARE ///////////////////////////////////////////////////////////////////////////



let scale_lib = [
  //{name: 'circle', chance: 0, amount: 1, min:0, max:0 },
  {name: 'fit', chance: .8,},
  {name: 'zoom',  chance: .2,},
];
let colr_lib = [
  {name: 'warm', chance: .55,},
  {name: 'cool',  chance: .15,},
  {name: 'grey', chance: .20,},
  {name: 'white',  chance: .10,},
];
let bkgd_lib = [
  {name: 'blank',  chance: .30,},
  {name: 'grid lattice', chance: .15,},
  {name: 'linear hatch',  chance: .07,},
  {name: 'noise hatch',  chance: .08,},
  {name: 'cross hatch',  chance: .10,},
  {name: 'stipple hatch',  chance: .10,},
  {name: 'dark hatch', chance: .20,},
  //{name: 'outline hatch',  amount: 0,},
];
let patt_lib = [
  {name: 'cluster', chance: .55,},
  {name: 'branch',  chance: .10,},
  {name: 'loop',  chance: .05,},
  {name: 'hole', chance: .10,},
  {name: 'line',  chance: .10,},
  {name: 'point',  chance: .10,},
];
let frac_lib = [
  {name: 'minimal', chance: .01,},
  {name: 'shallow',  chance: .30,},
  {name: 'medium', chance: .36, },
  {name: 'deep', chance: .33, },
];
let scat_lib = [
  {name: 'none', chance: .5,},
  {name: 'fragmented', chance: .5,},
];
let rndr_lib = [
  {name: 'complete', chance: .90,},
  {name: 'proof', chance: .10,},
];



let scale_cat = new Category( scale_lib );
scale_cat.setByChance();
scale_cat.sum();
let colr_cat = new Category( colr_lib );
colr_cat.setByChance();
colr_cat.sum();
let bkgd_cat = new Category( bkgd_lib );
bkgd_cat.setByChance();
bkgd_cat.sum();
let frac_cat = new Category( frac_lib );
frac_cat.setByChance();
frac_cat.sum();
let patt_cat = new Category( patt_lib );
patt_cat.setByChance();
patt_cat.sum();
let scat_cat = new Category( scat_lib );
scat_cat.setByChance();
scat_cat.sum();
let rndr_cat = new Category( rndr_lib );
rndr_cat.setByChance();
rndr_cat.sum();


let scale_f = scale_cat.pickCategory().name;
let colr_f = colr_cat.pickCategory().name;
let bkgd_f = bkgd_cat.pickCategory().name;
let frac_f = frac_cat.pickCategory().name;
let patt_f = patt_cat.pickCategory().name;
let scat_f = scat_cat.pickCategory().name;
let rndr_f = rndr_cat.pickCategory().name;

//
// 1x, 2x,
 ///scale_f = scale_lib[1].name;

// warm, cool, grey, white
//colr_f = colr_lib[3].name;

//  blank, grid lattice, linear hatch, stipple hatch, noise hatch, cross hatch, dark hatch,outline hatch
//bkgd_f = bkgd_lib[6].name;//7

// cluster, branch, loop, hole, line, point
//patt_f = patt_lib[5].name; //5

// shallow, medium, deep
// frac_f = frac_lib[0].name;

// whole, fragment
//scat_f = scat_lib[0].name;

// complete, wireframe,. OPAQUE
//rndr_f = rndr_lib[1].name;

//additional settings
let run_animation = true;    // DEFAULT : TRUE
let DECORATE = true;         // DEFAULT : TRUE
let prtScn = false;          // DEFAULT : FALSE
let swap = false;            // DEFAULT : FALSE
let camZoomInit = true;      // DEFAULT : TRUE
let mobile = false;        // DEFAULT : FALSE

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

if ( window.innerWidth == 2400 && window.innerHeight == 2400){
  run_animation = false;
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  run_animation = false;
  mobile = true;
} 


/////////////////////////////////////////////////////// SCALE /////////////////////////////////////////////////////
let ZoomPercent = scale_lib[1].chance * Math.PI;
//if( scale_f == scale_cat.arr[0].name ){
  //1x Set Later
//}else if( scale_f == scale_cat.arr[1].name ){
  //2x Set Later
//}
/////////////////////////////////////////////////////// COLOR /////////////////////////////////////////////////////

let color0;// = color(50, 9, 78); //light color
let color1;// = color(50, 9, 78); //background
let color2;// = color(50, 9, 78); //Border
let hR, sR, bR;

if( colr_f == colr_cat.arr[0].name ){
  //warm
  let colorHfix = R.random_dec();

  if (colorHfix < .9) {
    hR = R11.random_num(30, 65);
  } else {
    hR = R.random_int( 0,105 ) - 40;
    if(hR <0 ){
      hR += 360;
    }
  }


  sR = R.random_int( 6,15 );
  bR = R.random_int( 78,100 );
}else if( colr_f == colr_cat.arr[1].name ){
  //cool
  hR = R.random_int( 65,320 );
  sR = R.random_int( 6,15 );
  bR = R.random_int( 78,100 );

}else if( colr_f == colr_cat.arr[2].name ){
  //grey
  hR = R.random_int( 0,360 );
  sR = R.random_int( 0,2 );
  bR = R.random_int( 78,94 );

}else if( colr_f == colr_cat.arr[3].name ){
  //white
  hR = R.random_int( 0,360 );
  sR = R.random_int( 0,1 );
  bR = R.random_int( 96,100 );
}


/////////////////////////////////////////////////////// BACKGROUND /////////////////////////////////////////////////////
if( bkgd_f == bkgd_cat.arr[0].name ){
  //blank
  BKTEXT = false;
  BKGRID = false;
  bkUniform =   [
    [0.,0.,0.,0.], [0., 0.],                      //SCALE
    [0.,0.,0.,0.], [0., 0.],                        //ROTATION
    [0.,100.160,100.160,2.880], [2.880, 0.],      //Wave freq
    [0.,.2,516.8,516.8,589.6], [589.6, 0.],          //Wave amp
    [4.5,4.816,4.816,4.056], [3.592, 0.],              //Line weight
    [4.35,0.860,0.860,0.860], [0.860, 0.],               //Line fade
    [0.,43.752,41.752,24.216], [0.0,1.2],        //Noise Scale
    [0.,-0.260,-0.260,0.100], [0., 0.],            //Noise min
    [0.,0.376,0.376,0.376], [0.,1.],               //Noise max
    1.0, [0., 0., 0., 0.], 0.796,                      //Distortion:
  ];

}else if( bkgd_f == bkgd_cat.arr[1].name ){
  //grid lattice
  BLTEXT = false;
  BKGRID = true;
  bkUniform =   [
    [0.,0.,0.,0.], [0., 0.],                      //SCALE
    [0.,0.,0.,0.], [0., 0.],                        //ROTATION
    [0.,100.160,100.160,2.880], [2.880, 0.],      //Wave freq
    [0.,.2,516.8,516.8,589.6], [589.6, 0.],          //Wave amp
    [4.5,4.816,4.816,4.056], [3.592, 0.],              //Line weight
    [4.35,0.860,0.860,0.860], [0.860, 0.],               //Line fade
    [0.,43.752,41.752,24.216], [0.0,1.2],        //Noise Scale
    [0.,-0.260,-0.260,0.100], [0., 0.],            //Noise min
    [0.,0.376,0.376,0.376], [0.,1.],               //Noise max
    1.0, [0., 0., 0., 0.], 0.796,                      //Distortion:
  ];

}else if( bkgd_f == bkgd_cat.arr[2].name ){
  //linear hatch
  BKTEXT = true;
  BKGRID = false;
  //bkSelect = "s-d";

  bkrot = R.random_int(0,7)*Math.PI/4;
  bkfreq = 0;
  bkamp = 150;
  bkNscale = 0;
  bkNmin = .65;
  bkNmax = .651;

  bkUniform =   [
    [bkSCALE,0.,0.,0.], [0., 0.],                      //SCALE
    [bkrot,0.,0.,0.], [0., 0.],                        //ROTATION
    [bkfreq,100.160,100.160,2.880], [2.880, 0.],      //Wave freq
    [bkamp,.2,516.8,516.8,589.6], [589.6, 0.],          //Wave amp
    [4.5,4.816,4.816,4.056], [3.592, 0.],              //Line weight
    [4.35,0.860,0.860,0.860], [0.860, 0.],               //Line fade
    [bkNscale,43.752,41.752,24.216], [0.0,1.2],        //Noise Scale
    [bkNmin,-0.260,-0.260,0.100], [0., 0.],            //Noise min
    [bkNmax,0.376,0.376,0.376], [0.,1.],               //Noise max
    1.0, [0., 0., 0., 0.], 0.796,                      //Distortion:
  ];
  bkgd_f = "linear hatch";
}else if( bkgd_f == bkgd_cat.arr[3].name ){
  //noise hatch
  BKTEXT = true;
  BKGRID = false;

  bkSCALE = 200;
  bkrot = R.random_int(0,7)*Math.PI/4;
  bkfreq = 0;
  bkamp = 150;
  bkNscale = bkSCALE/4;
  bkNmin = .3;
  bkNmax = .651;

  bkUniform =   [
    [bkSCALE,0.,0.,0.], [0., 0.],                      //SCALE
    [bkrot,0.,0.,0.], [0., 0.],                        //ROTATION
    [bkfreq,100.160,100.160,2.880], [2.880, 0.],      //Wave freq
    [bkamp,.2,516.8,516.8,589.6], [589.6, 0.],          //Wave amp
    [4.5,4.816,4.816,4.056], [3.592, 0.],              //Line weight
    [30,0.860,0.860,0.860], [0.860, 0.],               //Line fade
    [bkNscale,43.752,41.752,24.216], [0.0,1.2],        //Noise Scale
    [bkNmin,-0.260,-0.260,0.100], [0., 0.],            //Noise min
    [bkNmax,0.376,0.376,0.376], [0.,1.],               //Noise max
    1.0, [0., 0., 0., 0.], 0.796,                      //Distortion:
  ];
  bkgd_f = "linear hatch";
}else if( bkgd_f == bkgd_cat.arr[4].name ){
  //cross hatch
  BKTEXT = true;
  BKGRID = false;
  bkSCALE = 200;
  bkrot = R.random_int(0,7)*Math.PI/4;
  bkfreq = 0;
  bkamp = 150;
  bkNscale = bkSCALE/4;
  bkNmin = .3;
  bkNmax = .651;

  bkUniform =   [
    [bkSCALE,bkSCALE,0.,0.], [0., 0.],                      //SCALE
    [bkrot,bkrot + (Math.PI/4)*R.random_int(1,3),0.,0.], [0., 0.],                        //ROTATION
    [bkfreq,0,100.160,2.880], [2.880, 0.],      //Wave freq
    [bkamp,.2,516.8,516.8,589.6], [589.6, 0.],          //Wave amp
    [4.5,4.816,4.816,4.056], [3.592, 0.],              //Line weight
    [30,0.860,0.860,0.860], [0.860, 0.],               //Line fade
    [bkNscale,bkNscale,41.752,24.216], [0.0,1.2],        //Noise Scale
    [bkNmin,bkNmin,-0.260,0.100], [0., 0.],            //Noise min
    [bkNmax,bkNmax,0.376,0.376], [0.,1.],               //Noise max
    1.0, [0., 0., 0., 0.], 0.796,                      //Distortion:
  ];
  bkgd_f = "cross hatch";
}else if( bkgd_f == bkgd_cat.arr[5].name ){
  //stipple hatch
  BKTEXT = true;
  BKGRID = false;

  bkUniform = UNIVAR[R.random_int(1,2)];
  bkgd_f = "cross hatch";
}else if( bkgd_f == bkgd_cat.arr[6].name ){
  //dark hatch
  BKTEXT = true;
  BKGRID = false;

  bkUniform = UNIVAR[R.random_int(6,7)];

}

/////////////////////////////////////////////////////// PATTERN  /////////////////////////////////////////////////////
if( patt_f == patt_cat.arr[0].name ){
  //cluster
  let pP;

  let aP = R.random_dec();
  if( aP <= .6 ){
    pP = 0;
  }else{
    pP = pattOrgClust.length-1;
    pP = R.random_int(1, pP );
  }
  pattDirector = pattOrgClust[pP];

}else if( patt_f == patt_cat.arr[1].name ){
  //branch
  let pP = pattOrgBranch.length-1;
  pP = R.random_int(0, pP );
  pattDirector = pattOrgBranch[pP];

}else if( patt_f == patt_cat.arr[2].name ){
  //loop
  let pP = pattOrgLoop.length-1;
  pP = R.random_int(0, pP );
  pattDirector = pattOrgLoop[pP];

}else if( patt_f == patt_cat.arr[3].name ){
  //hole
  let pP = pattOrgHole.length-1;
  pP = R.random_int(0, pP );
  pattDirector = pattOrgHole[pP];

}else if( patt_f == patt_cat.arr[4].name ){
  //line
  let pP = pattOrgLine.length-1;
  pP = R.random_int(0, pP );
  pattDirector = pattOrgLine[pP];
  //pS =
}else if( patt_f == patt_cat.arr[5].name ){
  //point
  let pP = pattOrgPT.length-1;
  pP = R.random_int(0, pP );
  pattDirector = pattOrgPT[pP];
  Lstring = "ffff+fff+ff+fff+f+fff+f+ffff+ff";
}

//console.log(pattDirector);
//pattDirectorp[0]   Growth Fucntion: growthPts
//pattDirectorp[1]   Growth Variable: pS
//pattDirectorp[2]   determines frac_f

pS = pattDirector[1];
//console.log("pS: " + pS)
if (pattDirector[2] == 1){
  frac_f = frac_cat.arr[0].name; // minimal

}else if (pattDirector[2] == 0){
  let fracRand = R.random_dec( );
  if (fracRand <= .5){
    frac_f = frac_cat.arr[3].name // deep
  }else{
    frac_f = frac_cat.arr[2].name // medium
  }

}else if (pattDirector[2] == -1){
// do nothing :)
}else if (pattDirector[2] == 2){
//XL frac_f unsued
}else if (pattDirector[2] == 3){
//NEW CATEGORY! 'medium2'
  frac_f = frac_cat.arr[1].name // shallow
}
/*
{name: 'minimal', amount: 33,},
{name: 'shallow',  amount: 36,},
{name: 'deep', amount: 30, },
{name: 'medium', amount: 1, },
*/
/////////////////////////////////////////////////////// FRACTAL DEPTH /////////////////////////////////////////////////////
if( frac_f == frac_cat.arr[0].name ){
  //MINIMAL
  growth_Max = 10;
  growth_percent = .8;
  growth_type_ratio = .5;
  small_death_chance = .2;
}else if( frac_f == frac_cat.arr[1].name ){
  //SHALLOW
  growth_Max = 6;
  growth_percent = .7;
  growth_type_ratio = .5;
  small_death_chance = .15;
}
else if( frac_f == frac_cat.arr[2].name ){
  //medium
  growth_Max = 1;
  growth_percent = 0.;
  growth_type_ratio = .5;
  small_death_chance = .1;
}else if( frac_f == frac_cat.arr[3].name ){
  //deep
  growth_Max = 2;
  growth_percent = .6;
  growth_type_ratio = .5;
  small_death_chance = .04;
}
/////////////////////////////////////////////////////// SCATTER /////////////////////////////////////////////////////
if( scat_f == scat_cat.arr[0].name ){
  //full
}else if( scat_f == scat_cat.arr[1].name ){
  //scatter
  ERASE  = true;
}
/////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
if( rndr_f == rndr_cat.arr[0].name ){
  //full
}else if( rndr_f == rndr_cat.arr[1].name ){
  let incMode = R.random_dec();
  if(incMode<.5){
    WIREFRAME   = true;
  }else{
    OPAQUE = true;
  }
}

////////////////////// GROWTH FOCUMLAS /////////////////////
let growthPts = [
  [//CLUSTER
    {x:0,y:0,z:0},
    {
      x: R.random_int(1, Math.floor( growth_Max / 2)) + Math.floor( growth_Max / 2),
      y: R.random_int(1, growth_Max - 1),
      z: R.random_int(1, growth_Max - 1)
    },
  ],
  [//BRANCH 1
    {x:0,y:0,z:0},
    {x:0,y:pS,z:0},
    {x:0,y:pS,z:pS},
    {x:0,y:pS,z:0},
    {x:pS,y:pS,z:0},
  ],
  [//BRANCH 2
    {x:0,y:0,z:0},
    {x:0,y:pS,z:0},
    {x:0,y:pS,z:pS},
    {x:0,y:pS,z:0},
    {x:pS,y:pS,z:0},
    {x:0,y:pS,z:0},
    {x:pS,y:0,z:0},
  ],
  [//BRANCH 4
    {x:0,y:0,z:0},
    {x:0,y:pS,z:0},
    {x:0,y:-pS,z:0},
    {x:0,y:0,z:0},
    {x:pS,y:0,z:0},
    {x:-pS,y:0,z:0},
    {x:0,y:0,z:0},
    {x:0,y:0,z:pS},
    {x:0,y:0,z:pS},
  ],
  [//lOOP 1F
    {x:0,y:0,z:0},
    {x:0,y:pS,z:0},
    {x:pS,y:pS,z:0},
    {x:pS,y:0,z:0},
    {x:0,y:0,z:0},
  ],
  [//lOOP 2
    {x:0,y:0,z:0},
    {x:0,y:0,z:pS},
    {x:0,y:pS,z:pS},
    {x:0,y:pS,z:0},
    {x:0,y:0,z:0},
  ],
  [//lOOP 3
    {x:0,y:0,z:0},
    {x:0,y:0,z:pS},
    {x:pS,y:0,z:pS},
    {x:pS,y:0,z:0},
    {x:0,y:0,z:0},
  ],
  [//lOOP 4
    {x:0,y:0,z:0},
    {x:0,y:pS,z:0},
    {x:pS,y:pS,z:pS},
    {x:pS,y:0,z:pS},
    {x:0,y:0,z:0},
  ],
  [//lINE 1
    {x:0,y:0,z:0},
    {x:pS,y:pS,z:pS},
  ],
  [//Point
    {x:0,y:0,z:0},
    {x:1,y:1,z:1},
  ],
  [//HOLE
    {x:0,y:0,z:0},
    {x:2,y:2,z:2},
    {x:0,y:1,z:0},
    {x:0,y:0,z:0},
    {x:0,y:0,z:0},
    {x:0,y:1,z:0},
    {x:0,y:0,z:0},
  ],

];

patternSelect = growthPts[ pattDirector[0] ];


// BK SELECT ////////////////////////////////////////////////////////////////////////////////////

UNIVAR.push( bkUniform );

/*OLD UPDATE UNIFORMS
for(i = 0; i < bkNames.length-1; i++) {
    if(bkSelect == bkNames[i] ){
      bkIndx = i;
    }
}
UNIVAR.push( bkUni[bkIndx] );
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////


//let rl = R.random_int(1, Math.floor( growth_Max / 2)) + Math.floor( growth_Max / 2) ;
//let rw = R.random_int(1, growth_Max - 1);
//let rh = R.random_int(1, growth_Max - 1);


/*
for(i = 0; i < growthPatterns.length; i++) {
    if(gPatternSelect == growthPatterns[i] ){
      growthPIndx = i;
    }
}
*/

//  RHOM  GRID MATHS /////////////////////////////////////////////////////////////////////////////////////////////

let xGridMax = -1000 ;
let yGridMax = -1000 ;
let zGridMax = -1000 ;

for(i = 0; i < patternSelect.length; i++) {

  if ( patternSelect[i].x >= xGridMax ){
    xGridMax = patternSelect[i].x;
  }
  if ( patternSelect[i].y >= yGridMax ){
    yGridMax = patternSelect[i].y;
  }
  if ( patternSelect[i].z >= zGridMax ){
    zGridMax = patternSelect[i].z;
  }

}

bkGridDrawBoundsX = xGridMax+5;
bkGridDrawBoundsY = yGridMax+5;
bkGridDrawBoundsZ = zGridMax+5;


let ignX = false;
let ignY = false;
let ignZ = false;

let ignR = R.random_dec();

if (ignR <= .33){
  ignX = true;
}else if(ignR >= .66){
  ignY = true;
}else{
  ignZ = true;
}

//Center pts in Rhjom Grid
for(i = 0; i < patternSelect.length; i++) {
  patternSelect[i].x += Math.floor(bkGridTrueMax/2);
  patternSelect[i].y += Math.floor(bkGridTrueMax/2);
  patternSelect[i].z += Math.floor(bkGridTrueMax/2);
}

let dSX = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
let dFX = bkGridDrawBoundsX + dSX;
let dSY = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
let dFY = bkGridDrawBoundsY + dSY;
let dSZ = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
let dFZ = bkGridDrawBoundsZ + dSZ;

//////////////Render Pattern////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let renderPattern = [];

//////////////CAMERA ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//random camera stuff
let zoomRRR = R4.random_num(0, 1);
zoomRR = R4.random_num(0, Math.PI);
scale_f = scale_cat.arr[0].name;

if(Math.abs( (myAngle + zoomRR) % Math.PI  ) <= ZoomPercent ){
  scale_f = scale_cat.arr[1].name;
  zoomRR = 0;
}


// MOBILE RENDER LOGIC
let bkG;
let txG;
let txW = 512*8/2;
let txH = 512/2;

let bkS;
let txS;
let txSr = 2048;


let display = {"Growth Pattern": patt_f, "Fractal Depth": frac_f, "Fragmentation": scat_f,"Completeness": rndr_f, "Background": bkgd_f, "Scale": scale_f,  "Paper Color": colr_f,};
//console.log( JSON.stringify( display) );



console.log("primatives by Aranda\Lasch");
console.log("Benjamin Aranda, Jesse Bassett, Joaquin Bonifaz, Chris Lasch");
console.log(" ");
console.log("Growth Pattern: " + patt_f);
console.log("Fractal Depth:  " + frac_f);
console.log("Broken/scatter: " + scat_f);
console.log("Completness:    " + rndr_f);
console.log("Scale:          " + scale_f);
console.log("Background:     " + bkgd_f);
console.log("Paper Color:    " + colr_f);


///////////////////////////////////////////////////////////////////////////////////end FEATURES

function setup() {
  colorMode(HSB);
  canvas = createCanvas(DIM, DIM, WEBGL);
  noStroke();
  //fill(100,80,70);
  //stroke(360,50,50);
  rect(100 * M, 500 * M, 50 * M, 50 * M);
  //console.log(tokenData.hash);
  pixelDensity(2.0);




  if (mobile == true){
    txG = createGraphics(txW, txH, WEBGL);
    txS = txG.createShader(basicVert2, fragShaderA);
  }else{
    //create Primative Shader
    shaderA = createShader(basicVert, fragShaderA);
    shaderA.setUniform('u_resolution', [DIM, DIM]);

    shad_Size = 1024;
    bkrez = 2800;

    //create Primative texture image
    myImg = createImage(shad_Size * 8, shad_Size);
  }


  //create BK Shader Texture
  shaderBK = createShader(basicVert, fragShaderA);
  shaderBK.setUniform('u_resolution', [bkrez, bkrez]);
  bkImg = createImage(bkrez, bkrez);


  sPress(); //step camera view forward
  sun = new p5.Vector(1, -1, 1);
  sun.normalize();

  //Grid vars
  gBorder = 2;
  rg; //Grid Object
  gScale = 20; //starting octahedra scale
  gVals = growth_Max + gBorder; //cube grid///growth variation
  gVals = bkGridTrueMax;
  grw = new GrowSys(1);//set up grow system target pts
  rg = new Grid_Rhomb(gVals, gVals, gVals, gScale);//Create the Grid


  // Set initial target point from List
  let firstP = patternSelect[0];
  targetPt = rg.gPts[ firstP.x ][ firstP.y ][ firstP.z ]
  // remove first point from list
  patternSelect.shift();

  go.push(new Go3d(1, targetPt.x, targetPt.y, targetPt.z, gScale));//Seed, create GO by Verts
  currGo = go[0];
  goNum = 1;


  for (i = 0; i < goNum; i++) {
    goDepot[i] = [];
    resetDepot[i] = [];
    nextGrow();
    //save verticie position
    for (let j = 0; j < go.length; j++) { //gos
      resetDepot[i][j] = [];
      for (let k = 0; k < go[j].verts.length - 2; k++) { //faces
        resetDepot[i][j].push(new p5.Vector(go[j].verts[k].x, go[j].verts[k].y, go[j].verts[k].z));
      }
    }
    goDepot[i] = go;
    goModelsDepot.push(goModels);
  }


  currCluster = goNum - 1;
  grow = -1;
  timer = 0;


  color0 = color(hR, sR, bR);
  color1 = color0;
  color2 = color0;
  //getModelExtents();
  //console.log("Num Geometry: " + goModels.length);

  /////////////////////////////////////// create render pattern /////////////////////////////////////
  let rdrB1 = R.random_int( 1/6*goModels.length  , 4/5*goModels.length);
  let rdrLen = Math.round( (5/12)*goModels.length );
  //if (rdrLen > 42){
  //  rdrLen = 27;
  //}
  let rdrB2 = rdrB1 + rdrLen*(1/3);
  let rdrB3 = rdrB1 + rdrLen*(1/2);
  let rdrB4 = rdrB1 + rdrLen*(2/3);
  let rdrB5 = rdrB1 + rdrLen*(1/1);
  let wireType = R.random_int(0,3);

  for (i = 0; i < goModels.length; i++) {
    renderPattern.push(0);
    //0 TEXTURE
    //1 NOTHING
    //2 OPAQUE
    //3 WIREFRAME
    //4 OPAQUE WIREFRAME
    //5 TEXTURE WIREFRAME

    if (ERASE == true) {
      if (i > 5 && i < .33 * goModels.length) {
        renderPattern[i] = 1;
      }
    }
    if (WIREFRAME == true) {
      if (wireType == 0) {
        if (i > rdrB1 && i < rdrB5) {
          renderPattern[i] = 3;
        }
      } else if (wireType == 1) {
        if (i > rdrB1 && i < rdrB3) {
          renderPattern[i] = 3;
        } else if (i > rdrB3 && i < rdrB5) {
          renderPattern[i] = 5;
        }
      } else if (wireType == 2) {
        if (i > rdrB1 && i < rdrB2) {
          renderPattern[i] = 3;
        } else if (i > rdrB2 && i < rdrB4) {
          renderPattern[i] = 3;
        }
      } else if (i > rdrB4 && i < rdrB5) {
        renderPattern[i] = 5;
      } else {
        if (i > rdrB1 && i < rdrB5) {
          renderPattern[i] = 3;
        }
      }

    } else if (OPAQUE == true) {
      if (i > rdrB1 && i < rdrB5) {
        renderPattern[i] = 2;
      }
    } else {
      renderPattern.push(0);
    }

  }
  /*
  console.log( "Len: " + rdrLen );
  console.log( "Wiretype: " + wireType );
  console.log( "erase: " + ERASE );
  console.log( "Wire: " + WIREFRAME );
  console.log( "Opaque: " + OPAQUE );
  console.log(renderPattern);
  //console.log(rOffset1);
  //console.log(rOffset2);
  */

}


function draw() {


  if (drawTex == true) {//only run this once.( doesnt work in setup() )
    drawTex = false;


    if (mobile == true){
      txG.noStroke();
      txG.shader(txS);
      txS.setUniform('u_resolution', [txH, txH]);

      for (let i = 0; i < 8; i++) {
        console.log("txG mode, Jesse")
        readUniforms(txS, i);
        txG.rect( (i*txW/8-txW/2),(-txH/2),(txW/8),(txH) );
        //save(txG,"Gtext-.png");
      }
      //save(txG, "Gtext.png");
      txG.resetShader();

    }else{
      //PRIMATIVE SHADER ////////////////////////////////////////////////////////
      shaderA.setUniform('u_resolution', [shad_Size, shad_Size]);
      shader(shaderA);
      resizeCanvas(shad_Size, shad_Size, false);

      for (let i = 0; i < 8; i++) {
        readUniforms(shaderA, i);
        rect(0, 0, 40, 40);
        myImg.copy(canvas, 0, 0, shad_Size * 2, shad_Size * 2, shad_Size * i, 0, shad_Size * 2, shad_Size * 2);
      }
      //myImg.save("mySketch.png");
      resetShader();
    }



    

    //BK SHADER TEXTURE////////////////////////////////////////////////////////
    resizeCanvas(bkrez, bkrez, false);
    shader(shaderBK);

    let BKscaling = 2*v;
    //let BKscaling = 25*Math.sqrt(v);
    //UNIVAR[8][0][0] = 18*Math.pow(v, 0.55);
    //let BKscaling = 34*Math.pow(v, 0.41);
    //let BKscaling = 21.43*Math.pow(v, 0.781)-10*Math.pow(v, 0.87) ;

    UNIVAR[8][0][0] = BKscaling;
    if( bkgd_f != bkgd_cat.arr[2].name ){
    UNIVAR[8][0][1] = BKscaling + R.random_num(-20,20);
    UNIVAR[8][0][2] = BKscaling + R.random_num(-30,30);
    UNIVAR[8][0][3] = BKscaling + R.random_num(-30,20);
    UNIVAR[8][1][0] = BKscaling + R.random_num(-20,30);
    }
    UNIVAR[8][12][0] *= BKscaling/60;
    UNIVAR[8][12][1] *= BKscaling/60;
    UNIVAR[8][12][2] *= BKscaling/60;
    UNIVAR[8][12][3] *= BKscaling/60;
    UNIVAR[8][13][0] *= BKscaling/60;
    //console.log( UNIVAR[8] );
    readUniforms(shaderBK, 8 );
    //console.log(UNIVAR[8][0]);
    //shaderBK.setUniform('LF1',UNIVAR[8][1]);
    rect(0, 0, 40, 40);
    bkImg.copy(canvas, 0, 0, bkrez, bkrez, 0, 0, bkrez, bkrez);

    //RESET CANVAS FOR DRAW LOOP///////////////////////////////////////////////
    resetShader();
    resizeCanvas(DIM, DIM, false);
    //myImg.filter(INVERT);



    //console.log(goModels);
    //for (let i = 0; i < goModels.length; i++) {
      //console.log( goModels[i] );
      /*
      goModels[i].faces[0] = [0, 1, 2];
      goModels[i].faces[1] = [3, 4, 5];
      goModels[i].faces[2] = [6, 7, 8];
      goModels[i].faces[3] = [9, 10, 11];
      goModels[i].faces[4] = [12, 13, 14];
      goModels[i].faces[5] = [15, 16, 17];
      goModels[i].faces[6] = [18, 19, 20];
      goModels[i].faces[7] = [21, 22, 23];
      */
      //console.log( goModels[i].faces.length );
      //console.log( goModels[i].vertices.length );
  //  }
  }






  background( color1);

  makeBorder();

  //new lights
  lightFalloff(0.003, 0.0003, 0);
  ambientLight(color0);
  noStroke();

  if (run_animation == false){
    steps = go.length;///growth variation
  }

  if (grow == 1) {
    if (steps >= go.length) {
      steps = go.length;
    } else {
      if (millis() > timer) {
        timer = timer + delay;
        steps++;
      }
    }
  } else if (grow == -1) {
    if (steps <= 1) {
      currCluster += 1;
      if (currCluster > goNum - 1) {
        currCluster = 0
      }

      if (initGrow == true){
        go = [];
        resetGo = [];
        go = goDepot[currCluster].slice();
        resetGo = resetDepot[currCluster].slice();
        goModels = goModelsDepot[currCluster];
        initGrow = false;
      }

      zoomStart = zoom;
      camStart = [cam[0], cam[1], cam[2]];
      camTarg = [camTarg[0], camTarg[1], camTarg[2]];

      for (let i = 0; i < go.length; i++) { //gos
        for (let j = 0; j < go[i].verts.length - 2; j++) { //faces
          go[i].verts[j] = new p5.Vector(resetGo[i][j].x, resetGo[i][j].y, resetGo[i][j].z);
        }
      }

     ratio = +camSpeed;
     vStart = vTarg;
     //getModelExtents();//JESSE
     steps = 1;
     grow *= -1;

    } else {
      if (millis() > timer) {
        timer = timer + delay;
        steps -= 3;
      }
    }
  }

  push();
  stroke(255,0,0);
  strokeWeight(6);
  line(0,0,0,0,0,100000);
  pop();

  updateCam();

  //filter(INVERT);

  if ( swap == true ){
    save("primative");
    pixelDensity(2);
    ortho(-v * zoom, v * zoom, -v * zoom, v * zoom, -10000, 10000);
    prtScn = false;
    swap = false;

    //shad_Size = 1024;
    //bkrez = 4096;
    //drawTex = true;

  }

  if ( prtScn == true ){

    let dp = 4800/(DIM);
    pixelDensity(dp);
    //pixelDensity(4);
    ortho(-v * zoom, v * zoom, -v * zoom, v * zoom, -10000, 10000);

    swap = true;

    //shad_Size = 1024/2;
    //bkrez = 4096/2;
    //drawTex = true;

  }


} //end draw

function readUniforms(_shader,i){
  for (let j=0; j<UNI.length; j++){
    _shader.setUniform(UNI[j],UNIVAR[i][j]);
  }
}

function lPress(){
  camStart = [cam[0], cam[1], cam[2]];
  camTarg = [0, camTarg[1] + angle, camTarg[2] + angle];
  zoomStart = zoom;

  myAngle += angle;

  zflag--;
  if (zflag < 0 ){
    zflag = 2;
  }

  if (zflag == 0){
    zoomTarg = defaultZoom / 2;
  }else{
    zoomTarg = defaultZoom;
  }
    ratio = +camSpeed;



  vStart = vTarg;
  getModelExtents();
  //print("zoom = " + zoom);

}

function rPress(){
  camStart =  [cam[0], cam[1], cam[2]];
  camTarg = [0, camTarg[1] - angle, camTarg[2] - angle];
  zoomStart = zoom;


  myAngle -= angle;

  zflag++;
  if (zflag >= 3){
    zflag = 0;
  }

  if (zflag == 0){
    zoomTarg = defaultZoom / 2;
  }else{
    zoomTarg = defaultZoom;
  }


  ratio = +camSpeed;



  vStart = vTarg;
  getModelExtents();




}

function sPress(){
  camStart =  [cam[0], cam[1], cam[2]];
  camTarg =  [cam[0], cam[1], cam[2]];
  //camTarg = [0, camTarg[1] - angle, camTarg[2] - angle];


  if(Math.abs( (myAngle + zoomRR) % Math.PI  ) <= ZoomPercent ){ //1.5 ){ //0.628319 ){
    zoomTarg = defaultZoom / 2;
    zflag = 0;
  } else {
    zoomTarg = defaultZoom;
    if(zoomRRR>=.5){
      zflag = 1;
    }else if (zoomRRR<=.5) {
      zflag = 2;
    }

  }

  //console.log(zoomTarg);
  zoomStart = zoomTarg;

  ratio = +camSpeed;
  ratio = .98999;



}

function touchStarted() {
  if (mouseX > WIDTH/2) {
    rPress();
    //console.log('touch R');
  } else if (mouseX < WIDTH/2) {
    lPress();
    //console.log('touch L');
  }
}

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    lPress();
  } else if (keyCode === RIGHT_ARROW) {
    rPress();
  } else if (keyCode === UP_ARROW) {
    zoomStart = zoom;
    zoomTarg = defaultZoom/2;
    ratio = +camSpeed ;
    camStart =  [cam[0], cam[1], cam[2]];
    camTarg = [0, camTarg[1] , camTarg[2] ];
    vStart = vTarg;
    getModelExtents();
  } else if (keyCode === DOWN_ARROW) {
    zoomStart = zoom;
    zoomTarg = defaultZoom;
    ratio = +camSpeed ;
    camStart =  [cam[0], cam[1], cam[2]];
    camTarg = [0, camTarg[1] , camTarg[2] ];
    vStart = vTarg;
    getModelExtents();
  }




  if ((key == 'o') || (key == 'O')) {
    let eVerts = [];
    let eFaces = [];
    let cnt = 0;
    for (let i = 0; i < go.length; i++) {
      if ( renderPattern[i] != 1 ){
        for (let j = 0; j < go[i].faces.length; j++) {
          for (let k = 0; k < go[i].faces[j].facePts.length; k++) {
            eVerts.push("v " + go[i].faces[j].facePts[k].x + " " + go[i].faces[j].facePts[k].y + " " + go[i].faces[j].facePts[k].z);
            cnt += 1;
          }
          eFaces.push("f " + (cnt - 2) + " " + (cnt - 1) + " " + (cnt));
        }
      }
    }
    let output = eVerts.concat(eFaces);
    saveStrings(output, 'primitive', 'obj');
  }
  // If you hit the i key, save an image
  if ((key == 'i') || (key == 'I') ){

    //pixelDensity(3);
    //save("primative");
    //pixelDensity(2);
    //DIM = min(windowWidth,windowHeight);

    //resizeCanvas(1000/2, 1000/2);
    //let dp =4800/2*DIM;
    //pixelDensity(dp);
    //ortho(-v * zoom, v * zoom, -v * zoom, v * zoom, -10000, 10000);
    //save("primative");
    //pixelDensity(2);
    prtScn = true;

    //windowResized();
    //resizeCanvas(DIM, DIM);

    //pixelDensity(4);
    console.log(prtScn);
    console.log(swap);

  }
  if ((key == 'u') || (key == 'U') ) {
    //print('SAVE TEXTURE');
    //myTex.save("myTex.png");
    myImg.save('primatives texture', 'png');
  }
  if ((key == 'g') || (key == 'G') ) {
    //console.log(grow);
    //steps = go.length;
    run_animation = true;
    grow = -1;
    //console.log(grow);
    //console.log(steps);

  }




}

function makeBorder(){
//////////////////////////////////////////////////BORDER
//console.log(v);
//console.log(zoom);
//console.log(50*zoom);
//console.log(zoomStart);
//console.log(zoomTarg);


push();

scale(zoom);

fill(color2);
//let border = .75;
let Mov = .1*v/1.15;
if (BKTEXT == true){
  push();
  lightFalloff(0.003, 0.0003, 0);
  ambientLight(color0);
  texture( bkImg );
  //texture( bkGraph );
  translate(0,0,-1000);
  box( (v*2 - Mov)*1.15/zoom , (v*2 - Mov)*1.15/zoom );
  pop();
}

push();
translate(-1.15*v/1.15,0,1000)
box(Mov,5*v);
pop();

push();
translate(1.15*v/1.15,0,1000)
box(Mov,5*v);
pop();

push();
translate(0,1.15*v/1.15,1000)
box(5*v,Mov);
pop();

push();
translate(0,-1.15*v/1.15,1000)
box(5*v,Mov);
pop();

//-v * zoom, v * zoom, -v * zoom, v * zoom
pop();
}



function nextGrow() {
  //console.log("NEXT GROW");
  //resetMatrix();

  cam =  [0, cam[1] - myAngle, cam[2] - myAngle];
  camStart = [0, camStart[1] - myAngle, camStart[2] - myAngle];
  camTarg = [0, camTarg[1] - myAngle, camTarg[2] - myAngle];
  v = 0;
  vStart = 0;
  vTarg = 0;


  //myAngle = 0; MY ANGLE REST REMOVED
  //Reset
  steps = 0;
  mGo = 0;
  go = []; //clear the go array
  goModels = [];
  //reseed
  go.push(new Go3d(1, targetPt.x, targetPt.y, targetPt.z, gScale));//gen
  currGo = go[0];


  let rl = R.random_int(1, Math.floor( growth_Max / 2)) + Math.floor( growth_Max / 2) ;
  let rw = R.random_int(1, growth_Max - 1);
  let rh = R.random_int(1, growth_Max - 1);

  //record current array size
  currArraySize = go.length;
  //console.log(growthPts[growthPIndx][i].y);
  for (let i = 0; i < patternSelect.length; i++) {
    let p = patternSelect[i];
    grw.growToTarget(rg.gPts[ p.x ][ p.y ][ p.z ]);
  }

  getModelExtents();

  //center the cluster
  for (let i = 0; i < go.length; i++) { //gos
    go[i].center.x += -centerX;
    go[i].center.y += -centerY;
    go[i].center.z += -centerZ;
    for (let j = 0; j < go[i].faces.length; j++) { //faces
      go[i].faces[j].center.x += -centerX;
      go[i].faces[j].center.y += -centerY;
      go[i].faces[j].center.z += -centerZ;

      for (let k = 0; k < go[i].faces[j].facePts.length; k++) {
        go[i].faces[j].facePts[k].x += -centerX;
        go[i].faces[j].facePts[k].y += -centerY;
        go[i].faces[j].facePts[k].z += -centerZ;
      }
    }
  }

  for (let i = 0; i < go.length; i++) { //gos
    for (let j = 0; j < go[i].verts.length; j++) { //faces
      go[i].verts[j].x += -centerX;
      go[i].verts[j].y += -centerY;
      go[i].verts[j].z += -centerZ;
    }
  }

  xMax += -centerX;
  xMin += -centerX;
  yMax += -centerY;
  yMin += -centerY;
  zMax += -centerZ;
  zMin += -centerZ;


  getModelExtents();

  if (v == 0) {
    v = vTarg;
    vStart = vTarg;
  }


  //build models
  //console.log("go length = " + go.length);
  for (let i = 0; i < go.length; i++) {
    geom = new p5.Geometry(1, 1, buildModel);
    geom.gid = 'go' + mGo + "_" + R.random_dec();
    //print(geom.gid);
    goModels.push(geom);
    mGo++;
  }
}

function buildModel() {
  let indx = 0;

  for (let j = 0; j < go[mGo].faces.length; j++) { //faces
    let faceIndx = [];
    for (let k = 0; k < go[mGo].faces[j].facePts.length; k++) { //face pts
      this.vertices.push(go[mGo].faces[j].facePts[k]);
      faceIndx.push(indx);
      indx += 1;
    } //end face pts
    this.faces.push([faceIndx[0], faceIndx[1], faceIndx[2]]);
    n = createVector(go[mGo].faces[j].normal.x, go[mGo].faces[j].normal.y, go[mGo].faces[j].normal.z);
    n.normalize();
    this.vertexNormals.push(n, n, n);
    let imgSeg = 1 / 8;
    let dotProd = sun.dot(n);
    let ang = sun.angleBetween(n);
    let imgNum = map(dotProd, -1, 1, 0, 7);
    imgNum = round(imgNum);

    //map UVs
    let dist1 = this.vertices[faceIndx[0]].dist(this.vertices[faceIndx[1]]);
    let dist2 = this.vertices[faceIndx[0]].dist(this.vertices[faceIndx[2]]);
    let dist3 = this.vertices[faceIndx[1]].dist(this.vertices[faceIndx[2]]);
    dist1 = map(dist1, 0, 41.71563256142714, 0, 1);
    dist2 = map(dist1, 0, 41.71563256142714, 0, 1);
    dist3 = map(dist1, 0, 41.71563256142714, 0, 1);

    if (go[mGo].faces[j].type == "e") {
      this.uvs.push([imgSeg * imgNum, 0]);
      this.uvs.push([imgSeg * imgNum, dist1]);
      this.uvs.push([(imgSeg * imgNum) + ((0.866 * dist1) * imgSeg), dist1/2]);

    } else { //type == i
      if ((dist1 > dist2) && (dist1 > dist3)) { //0,1 is the long side
        this.uvs.push([imgSeg * imgNum, 0]);
        this.uvs.push([imgSeg * imgNum, dist1]);
        this.uvs.push([(imgSeg * imgNum) + ((0.809 * dist1) * imgSeg), dist1/2]);

      } else if ((dist2 > dist1) && (dist2 > dist3)) { //0,1 is the long side
        this.uvs.push([imgSeg * imgNum, 0]);
        this.uvs.push([(imgSeg * imgNum) + ((0.809 * dist2) * imgSeg), dist2/2]);
        this.uvs.push([imgSeg * imgNum, dist2]);

      } else if ((dist3 > dist1) && (dist3 > dist2)) { //0,1 is the long side
        //console.log('uh');//does this never happen?
        this.uvs.push([(imgSeg * imgNum) + ((0.809 * dist3) * imgSeg), dist3/2]);
        this.uvs.push([imgSeg * imgNum, 0]);
        this.uvs.push([imgSeg * imgNum, dist3]);

      }


    }
    //console.log(this.uvs);
    let mirror1 = R3.random_dec();
    let mirror2 = R4.random_dec();
    //console.log(this.uvs.length);
    //console.log(imgSeg * imgNum);
    if(mirror1 <= .5){
      for (let n = 0; n < this.uvs.length; n++){
        this.uvs[n][1] = -this.uvs[n][1] + 1;
      }
    }
    if(mirror2 <= .5){
      for (let n = 0; n < this.uvs.length; n++){
        //console.log(this.uvs[n][0])
      }
    }

  } //end faces
}


function getModelExtents() {
  //framing
  let xValues = [];
  let yValues = [];
  let zValues = [];

  for (let i = 0; i < go.length; i++) { //gos
    for (let j = 0; j < go[i].verts.length - 2; j++) { //faces
      xValues.push(go[i].verts[j].x);
      yValues.push(go[i].verts[j].y);
      zValues.push(go[i].verts[j].z);
    }
  }
  xValues.sort((a, b) => a - b);
  yValues.sort((a, b) => a - b);
  zValues.sort((a, b) => a - b);
  xMin = xValues[0];
  xMax = xValues[xValues.length - 1];
  yMin = yValues[0];
  yMax = yValues[yValues.length - 1];
  zMin = zValues[0];
  zMax = zValues[zValues.length - 1];

  centerX = (xMax - xMin) / 2 + xMin;
  centerY = (yMax - yMin) / 2 + yMin;
  centerZ = (zMax - zMin) / 2 + zMin;
  //centerX = 0;
  //centerY = 0;
  //centerZ = 0;

  let xTarg, yTarg;
  xTarg = Math.max(xMax,Math.abs(xMin));
  yTarg = Math.max(yMax,Math.abs(yMin));
  vTarg = Math.max(xTarg,yTarg);

}



/*
//fake hash for testing
function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = "0xc8d22528af4ebde207b70700c20ddfe64bac8a6afb23be649c9f77e818d798e1"; //hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
}
*/

function drawGrid() {
  push();

  let dSX = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
  let dFX = bkGridDrawBoundsX + dSX;
  let dSY = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
  let dFY = bkGridDrawBoundsY + dSY;
  let dSZ = Math.ceil((bkGridTrueMax - bkGridDrawBoundsX) / 2);
  let dFZ = bkGridDrawBoundsZ + dSZ;

  stroke(0, 0, 0);
  strokeWeight(1);
  if(ignX == false){
    for (let j = dSY; j <= dFY; j++) {
      for (let k = dSZ; k <= dFZ; k++) {
        line(rg.gPts[dSX][j][k].x, rg.gPts[dSX][j][k].y, rg.gPts[dSX][j][k].z, rg.gPts[dFX][j][k].x, rg.gPts[dFX][j][k].y, rg.gPts[dFX][j][k].z);
      }
    }
  }

  if(ignY == false){
    for (let i = dSX; i <= dFX; i++) {
      for (let k = dSZ; k <= dFZ; k++) {
        line(rg.gPts[i][dSY][k].x, rg.gPts[i][dSY][k].y, rg.gPts[i][dSY][k].z, rg.gPts[i][dFY][k].x, rg.gPts[i][dFY][k].y, rg.gPts[i][dFY][k].z);
      }
    }
  }

  if(ignZ == false){
    for (let i = dSX; i <= dFX; i++) {
      for (let j = dSY; j <= dFY; j++) {
        line(rg.gPts[i][j][dSZ].x, rg.gPts[i][j][dSZ].y, rg.gPts[i][j][dSZ].z, rg.gPts[i][j][dFZ].x, rg.gPts[i][j][dFZ].y, rg.gPts[i][j][dFZ].z);
      }
    }
  }
  /*
  // DRAW EDGES?????
  if(ignX == true){
    line(rg.gPts[dSX][dSY][dSZ].x, rg.gPts[dSX][dSY][dSZ].y, rg.gPts[dSX][dSY][dSZ].z, rg.gPts[dFX][dSY][dSZ].x, rg.gPts[dFX][dSY][dSZ].y, rg.gPts[dFX][dSY][dSZ].z);
    line(rg.gPts[dSX][dFY][dSZ].x, rg.gPts[dSX][dFY][dSZ].y, rg.gPts[dSX][dFY][dSZ].z, rg.gPts[dFX][dFY][dSZ].x, rg.gPts[dFX][dFY][dSZ].y, rg.gPts[dFX][dFY][dSZ].z);
    line(rg.gPts[dSX][dSY][dFZ].x, rg.gPts[dSX][dSY][dFZ].y, rg.gPts[dSX][dSY][dFZ].z, rg.gPts[dFX][dSY][dFZ].x, rg.gPts[dFX][dSY][dFZ].y, rg.gPts[dFX][dSY][dFZ].z);
    line(rg.gPts[dSX][dFY][dFZ].x, rg.gPts[dSX][dFY][dFZ].y, rg.gPts[dSX][dFY][dFZ].z, rg.gPts[dFX][dFY][dFZ].x, rg.gPts[dFX][dFY][dFZ].y, rg.gPts[dFX][dFY][dFZ].z);
  }
  if(ignY == true){
    line(rg.gPts[dSX][dSY][dSZ].x, rg.gPts[dSX][dSY][dSZ].y, rg.gPts[dSX][dSY][dSZ].z, rg.gPts[dSX][dFX][dSZ].x, rg.gPts[dSX][dFX][dSZ].y, rg.gPts[dSX][dFX][dSZ].z);
    line(rg.gPts[dFX][dSY][dSZ].x, rg.gPts[dFX][dSY][dSZ].y, rg.gPts[dFX][dSY][dSZ].z, rg.gPts[dFX][dFX][dSZ].x, rg.gPts[dFX][dFX][dSZ].y, rg.gPts[dFX][dFX][dSZ].z);
    line(rg.gPts[dSX][dSY][dFZ].x, rg.gPts[dSX][dSY][dFZ].y, rg.gPts[dSX][dSY][dFZ].z, rg.gPts[dSX][dFX][dFZ].x, rg.gPts[dSX][dFX][dFZ].y, rg.gPts[dSX][dFX][dFZ].z);
    line(rg.gPts[dFX][dSY][dFZ].x, rg.gPts[dFX][dSY][dFZ].y, rg.gPts[dFX][dSY][dFZ].z, rg.gPts[dFX][dFX][dFZ].x, rg.gPts[dFX][dFX][dFZ].y, rg.gPts[dFX][dFX][dFZ].z);
  }
  if(ignZ == true){
    line(rg.gPts[dSX][dSY][dSZ].x, rg.gPts[dSX][dSY][dSZ].y, rg.gPts[dSX][dSY][dSZ].z, rg.gPts[dSX][dSY][dSZ].x, rg.gPts[dSX][dSY][dSZ].y, rg.gPts[dSX][dSY][dSZ].z);
    line(rg.gPts[dSX][dFY][dSZ].x, rg.gPts[dSX][dFY][dSZ].y, rg.gPts[dSX][dFY][dSZ].z, rg.gPts[dSX][dFY][dSZ].x, rg.gPts[dSX][dFY][dSZ].y, rg.gPts[dSX][dFY][dSZ].z);
    line(rg.gPts[dFX][dSY][dSZ].x, rg.gPts[dFX][dSY][dSZ].y, rg.gPts[dFX][dSY][dSZ].z, rg.gPts[dFX][dSY][dSZ].x, rg.gPts[dFX][dSY][dSZ].y, rg.gPts[dFX][dSY][dSZ].z);
    line(rg.gPts[dFX][dFY][dSZ].x, rg.gPts[dFX][dFY][dSZ].y, rg.gPts[dFX][dFY][dSZ].z, rg.gPts[dFX][dFY][dSZ].x, rg.gPts[dFX][dFY][dSZ].y, rg.gPts[dFX][dFY][dSZ].z);
  }
  */
  pop();
}

function windowResized() {
  DIM = min(windowWidth,windowHeight);
  resizeCanvas(DIM, DIM);
  //resizeCanvas(windowWidth, windowHeight);
}

//END MAIN ////////////////////////////////////////////////////////////////////////////////////////////////

//SHADERZ///////////////////////////////////////////////////////////////////////////////////////////////////
let basicVert = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  void main() {
    vTexCoord=aTexCoord;
    vec4 positionVec4=vec4(aPosition,1.0);
    positionVec4.xy=positionVec4.xy*2.0-1.0;
    gl_Position=positionVec4;
  }
  `;
  let basicVert2 = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  }
`;

  let fragShaderA=`\n//Author:Jesse Bassett\n#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 vTexCoord; varying vec4 Depth; uniform vec4 LF1; uniform vec2 LF2; uniform vec4 LR1; uniform vec2 LR2; uniform vec4 dA1; uniform vec2 dA2; uniform vec4 df1; uniform vec2 df2; uniform vec4 wb1; uniform vec2 wb2; uniform vec4 bb1; uniform vec2 bb2; uniform vec4 Nf1; uniform vec2 Nf2; uniform vec4 Nn1; uniform vec2 Nn2; uniform vec4 Nx1; uniform vec2 Nx2; uniform float indx; uniform vec4 Ld; uniform float cBlend; \n#define BlendScreen(base,blend) (1.0-((1.0-base)*(1.0-blend)))\nvec3 mod289(vec3 x) {return x-floor(x*(1.0 / 289.0))*289.0;} vec2 mod289(vec2 x) {return x-floor(x*(1.0 / 289.0))*289.0;} vec3 permute(vec3 x) {return mod289(((x*34.0)+1.0)*x);} float snoise(vec2 v) {const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439); vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1=vec2(0.0); i1=(x0.x > x0.y)? vec2(1.0,0.0):vec2(0.0,1.0); vec2 x1=x0.xy+C.xx-i1; vec2 x2=x0.xy+C.zz; i=mod289(i); vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0)); vec3 m=max(0.5-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.0); m=m*m; m=m*m; vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox; m*=1.79284291400159-0.85373472095314*(a0*a0+h*h); vec3 g=vec3(0.0); g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*vec2(x1.x,x2.x)+h.yz*vec2(x1.y,x2.y); return 130.0*dot(m,g);} vec2 rotateUV(vec2 uv,float rotation) {return vec2(cos(rotation)*(uv.x-0.5)+sin(rotation)*(uv.y-0.5)+0.5,cos(rotation)*(uv.y-0.5)-sin(rotation)*(uv.x-0.5)+0.5);} float SmoothStep(float edge0,float edge1,float x){float t=clamp((x-edge0) / (edge1-edge0),0.0,1.0); return t;} void main() {vec2 st=vTexCoord; vec2 st_1=st; vec2 st_2=st; vec2 st_3=st; vec2 st_4=st; vec2 st_5=st; vec2 st_6=st; vec3 color=vec3(0.0); st_1=rotateUV(st,LR1.x); st_1.x+=cos(st_1.y*dA1.x)/df1.x; st_1.y+=sin(st_1.x*dA1.x)/df1.x; float pos_1=st_1.x*LF1.x; float y=0.; float x=pos_1; y=sin((x+Ld.z)*Ld.y); y+=sin((x+Ld.z)*Ld.y*2.1+Ld.w)*4.5; y+=sin((x+Ld.z)*Ld.y*1.72+Ld.w*1.121)*4.0; y+=sin((x+Ld.z)*Ld.y*2.221+Ld.w*0.437)*5.0; y+=sin((x+Ld.z)*Ld.y*3.1122+Ld.w*4.269)*2.5; y*=Ld.x*0.06; pos_1=pos_1+y; float colL_1=wb1.x*bb1.x*((cos(pos_1*2.*3.14)+1.)/2.)-bb1.x+1.; float colLC_1=clamp(colL_1,0.090,1.0); vec2 posN_1=st*Nf1.x; float colN_1=(snoise(posN_1)*.5+.5); float colNC_1=smoothstep(Nn1.x,Nx1.x,colN_1); st_2=rotateUV(st_2,LR1.y); st_2.x+=cos(st_2.y*dA1.y)/df1.y; st_2.y+=sin(st_2.x*dA1.y)/df1.y; float pos_2=st_2.x*LF1.y; float colL_2=wb1.y*bb1.y*((cos(pos_2*2.*3.14)+1.)/2.)-bb1.y+1.; float colLC_2=clamp(colL_2,0.090,1.0); vec2 posN_2=st_2*Nf1.y; float colN_2=(snoise(posN_2)*.5+.5); float colNC_2=smoothstep(Nn1.y,Nx1.y,colN_2); st_3=rotateUV(st_3,LR1.z); st_3.x+=cos(st_3.y*dA1.z)/df1.z; st_3.y+=sin(st_3.x*dA1.z)/df1.z; float pos_3=st_3.x*LF1.z; float colL_3=wb1.z*bb1.z*((cos(pos_3*2.*3.14)+1.)/2.)-bb1.z+1.; float colLC_3=clamp(colL_3,0.090,1.0); vec2 posN_3=st_3*Nf1.z; float colN_3=(snoise(posN_3)*.5+.5); float colNC_3=smoothstep(Nn1.z,Nx1.z,colN_3); st_4=rotateUV(st_4,LR1.w); st_4.x+=cos(st_4.y*dA1.w)/df1.w; st_4.y+=sin(st_4.x*dA1.w)/df1.w; float pos_4=st_4.x*LF1.w; float colL_4=wb1.w*bb1.w*((cos(pos_4*2.*3.14)+1.)/2.)-bb1.w+1.; float colLC_4=clamp(colL_4,0.090,1.0); vec2 posN_4=st_4*Nf1.w; float colN_4=(snoise(posN_4)*.5+.5); float colNC_4=smoothstep(Nn1.w,Nx1.w,colN_4); st_5=rotateUV(st_5,LR2.x); st_5.x+=cos(st_5.y*dA2.x)/df2.x; st_5.y+=sin(st_5.x*dA2.x)/df2.x; float pos_5=st_5.x*LF2.x; float colL_5=wb2.x*bb2.x*((cos(pos_5*2.*3.14)+1.)/2.)-bb2.x+1.; float colLC_5=clamp(colL_5,0.090,1.0); vec2 posN_5=st_5*Nf2.x; float colN_5=(snoise(posN_5)*.5+.5); float colNC_5=smoothstep(Nn2.x,Nx2.x,colN_5); vec2 posN_6=st_6*Nf2.y; float colN_6=(snoise(posN_6)*.5+.5); float colNC_6=smoothstep(Nn2.y,Nx2.y,colN_6); if(indx==1.0){colNC_5=colNC_5+colNC_2; colNC_4=colNC_4+colNC_3; colNC_1=0.108*(colNC_6-0.)+colNC_1; colNC_2=0.292*(colNC_6-0.)+colNC_2; colNC_3=-0.448*(-colNC_6+0.024)+colNC_3;}else if (indx==2.0){colNC_5=colNC_5+colNC_2; colNC_4=1.; colNC_3=0.664*colNC_6+colNC_3; colNC_2=1.664*colNC_6+colNC_2; colNC_1=1.;}else if (indx==3.0){colNC_5=colNC_5+colNC_3; colNC_4=0.032*colNC_6+colNC_4; colNC_3=0.712*colNC_6+colNC_3; colNC_1=0.672*colNC_6+colNC_1;}else if (indx==4.0){colNC_5=colNC_5+colNC_3; colNC_3=1.680*colNC_5+colNC_3-1.; colNC_4=0.784*colNC_6+colNC_4; colNC_3=0.736*colNC_6+colNC_3; colNC_1=-0.016*colNC_6+colNC_1;}else if (indx==5.0){colNC_5=colNC_5+colNC_3; colNC_4=0.016*colNC_6+colNC_4; colNC_3=0.000*colNC_6+colNC_3; colNC_2=0.328*colNC_6+colNC_2; colNC_1=0.992*(colNC_6-0.024)+colNC_1;}else if (indx==6.0){colNC_5=colNC_5+colNC_3;}else if (indx==7.0){colNC_5=colNC_5+colNC_3;}else if (indx==8.0){colNC_5=colNC_5+colNC_3;} float colB_1=BlendScreen(colNC_1,colLC_1); float colB_2=BlendScreen(colNC_2,colLC_2); float colB_3=BlendScreen(colNC_3,colLC_3); float colB_4=BlendScreen(colNC_4,colLC_4); float colB_5=BlendScreen(colNC_5,colLC_5); float colF_1=SmoothStep(cBlend,1.,colB_1); float colF_2=SmoothStep(cBlend,1.,colB_2); float colF_3=SmoothStep(cBlend,1.,colB_3); float colF_4=SmoothStep(cBlend,1.,colB_4); float colF_5=SmoothStep(cBlend,1.,colB_5); float colF=min(colF_1,colF_2); colF=min(colF,colF_3); colF=min(colF,colF_4); colF=min(colF,colF_5); color=vec3(colF); gl_FragColor=vec4(color,1.0);} `;

  //END MAIN ////////////////////////////////////////////////////////////////////////////////////////////////


let angle = Math.PI / 3.0;
//let myAngle = 0.0;
let defaultZoom = 1.15;
let zoom = 1.15;
let zoomStart = 1.15;
let zoomTarg = 1.15;
let v = 0;
let vStart = 0;
let vTarg = 0;

let ratio = 0.0;
let camSpeed = 0.02;
let easing = 0.05;

let resetPt;
let resetTarg;

//RANDOMIZE INITAL VIEW
//let cam = [0, 0, 0];
let initCamAngle = R.random_int(0,5) * angle;
let cam = [initCamAngle.PI/6, initCamAngle, initCamAngle];



let camStart = [0, 0, 0];
let camTarg = [0, 0, 0];

let rx1 = 1 + R.random_dec()/100;
let ry1 = 1 + R.random_dec()/100;
let rz1 = 1 + R.random_dec()/100;

let rx2 = 1 + R.random_dec()/100;
let ry2 = 1 + R.random_dec()/100;
let rz2 = 1 + R.random_dec()/100;

let rx3 = 1 + R.random_dec()/100;
let ry3 = 1 + R.random_dec()/100;
let rz3 = 1 + R.random_dec()/100;

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function dash_line(x1, y1, z1, x2, y2, z2, lon, loff) {
  let v1 = createVector(x1, y1, z1);
  let v2 = createVector(x2, y2, z2);
  let vd = p5.Vector.sub(v2, v1);
  let llong = vd.mag();
  let kn  = int( llong/(lon + loff) );
  push();
  translate(x1, y1, z1);
  let vdon  = vd.copy().setMag(lon); //_____ make line
  let vdt = vd.copy().setMag(lon+loff);  //_ translate to next line
  for (let k = 0; k < kn; k++) {
    line(0, 0, 0, vdon.x, vdon.y, vdon.z);
    translate(vdt.x, vdt.y, vdt.z);
  }
  pop();
}

function updateCam() {
    push();
    rotateZ(cam[2]);
    rotateY(cam[1]);
    //console.log(renderPattern);


    push();

    //0 TEXTURE
    //1 NOTHING
    //2 OPAQUE
    //3 WIREFRAME
    //4 OPAQUE WIREFRAME
    //5 TEXTURE WIREFRAME
    for (i = 0; i < steps; i++) {

      if (renderPattern[i] == 0){
        if (mobile == true){
          texture(txG);
        }else{
          texture(myImg);
        }
        model(goModels[i]);
      }else if (renderPattern[i] == 1){
        //model(goModels[i]);
      }else if (renderPattern[i] == 2){
        noStroke();
        fill(255);
        model(goModels[i]);
        noFill();
      }else if (renderPattern[i] == 3){
        stroke(0);
        strokeWeight(1);
        noFill();
        model(goModels[i]);
        noStroke();
      }else if (renderPattern[i] == 4){
        stroke(0);
        strokeWeight(1);
        fill(255);
        model(goModels[i]);
        noStroke();
        noFill();
      }else if (renderPattern[i] == 5){
        if (mobile == true){
          texture(txG);
        }else{
          texture(myImg);
        }
        stroke(0);
        strokeWeight(1);
        model(goModels[i]);
        noStroke();
      }else{
        noStroke();
        if (mobile == true){
          texture(txG);
        }else{
          texture(myImg);
        }
        model(goModels[i]);
      }






      /*
      if (i < 0){
        push();
        // /scale( (1 + R.random_dec()/50),(1 + R.random_dec()/50),(1 + R.random_dec()/50) );
        //console.log( goModels[i].edges );
        //console.log( goModels[i].vertices );
        let lines = goModels[i].edges;
        let pts = goModels[i].vertices;
        //console.log("Lines: " );
        //console.log(lines[0] );
        //console.log("pts: " );
        //console.log( pts[0] );
        //console.log(pts[0].x,pts[0].y,pts[0].z, pts[1].x, pts[1].y, pts[1].z,  );
        stroke(0,0,50);
        strokeWeight(1);
        fill(255);
        //line( pts[0].x,pts[0].y,pts[0].z, pts[1].x, pts[1].y, pts[1].z );
        //line( pts[1].x,pts[1].y,pts[1].z, pts[2].x, pts[2].y, pts[2].z );
        //line( pts[2].x,pts[2].y,pts[2].z, pts[0].x, pts[0].y, pts[2].z );
        //setLineDash([5, 10, 30, 10]);
        //line( pts[0].x*rx1, pts[0].y*ry1, pts[0].z*rz1,  pts[1].x*rx1, pts[1].y*ry1, pts[1].z*rz1 );
        //line( pts[1].x*rx2, pts[1].y*ry2, pts[1].z*rz2,  pts[2].x*rx2, pts[2].y*ry2, pts[2].z*rz2 );
        //line( pts[2].x*rx3, pts[2].y*ry3, pts[2].z*rz3,  pts[0].x*rx3, pts[0].y*ry3, pts[0].z*rz3 );
        dash_line( pts[0].x*rx1, pts[0].y*ry1, pts[0].z*rz1,  pts[1].x*rx1, pts[1].y*ry1, pts[1].z*rz1, 2, 4);
        dash_line( pts[1].x*rx2, pts[1].y*ry2, pts[1].z*rz2,  pts[2].x*rx2, pts[2].y*ry2, pts[2].z*rz2, 2, 4);
        dash_line( pts[2].x*rx3, pts[2].y*ry3, pts[2].z*rz3,  pts[0].x*rx3, pts[0].y*ry3, pts[0].z*rz3, 2, 4);
        fill(255);
        stroke(0);
        strokeWeight(0);
        model(goModels[i]);
        //console.log( goModels[i] );

        pop();
      }else{
        //fill(255);
        //noStroke();


        noStroke();
        texture(myImg);
        model(goModels[i]);
      }*/

        //gradient
        //let p = i/steps*120
        //fill(p,95,80);

        //noStroke();
        //texture(myImg);


        //model(goModels[i]);
    }
    pop();

    if (BKGRID == true) {
      drawGrid();
    }

    pop();
    //console.log(v);
    if ((ratio > 0.0) && (ratio < 1.0)) {

        if ((ratio >= 0.99999)) {
            ratio = 1.0;
        }
        zoom = lerp(zoomStart, zoomTarg, ratio);
        cam[0] = lerp(camStart[0], camTarg[0], ratio);
        cam[1] = lerp(camStart[1], camTarg[1], ratio);
        cam[2] = lerp(camStart[2], camTarg[2], ratio);
        v = lerp(vStart,vTarg,ratio);

        let dr = 1 - ratio;
        ratio += dr * easing;

        if (camZoomInit == true){
          ratio = 0.99999;
          zoom = defaultZoom/2;
          camZoomInit = false;
        }

    }
    ortho(-v * zoom, v * zoom, -v * zoom, v * zoom, -10000, 10000);
}

function pointRotateY(_pt, _angle) {
    let newPoint = new p5.Vector;
    newPoint.x = _pt.z * Math.sin(_angle) + _pt.x * Math.cos(_angle);
    newPoint.y = _pt.y;
    newPoint.z = _pt.z * Math.cos(_angle) - _pt.x * Math.sin(_angle);
    return newPoint;
}

function pointRotateZ(_pt, _angle) {
    let newPoint = new p5.Vector;
    newPoint.x = _pt.x * Math.cos(_angle) - _pt.y * Math.sin(_angle);
    newPoint.y = _pt.x * Math.sin(_angle) + _pt.y * Math.cos(_angle);
    newPoint.z = _pt.z;
    return newPoint;
}


class Go3d {
  constructor(_method, _x, _y, _z, _gScale, _color, _mPlane, _myParent, _aPt, _scaleFactor) {
    this.verts = [];
    this.faces = [];
    this.faceIndx =[];
    this.gScale = _gScale;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.center = new p5.Vector();
    this.ballCenter1 = new p5.Vector();
    this.ballCenter2 = new p5.Vector();

    if (_method == 1) {
      this.x = _x;
      this.y = _y;
      this.z = _z;

      this.verts[0] = createVector(0.0, 0.0, 0.0);
      this.verts[1] = createVector(-0.548, 1.097, 1.687);
      this.verts[2] = createVector(1.226, 0.000, 1.687);
      this.verts[3] = createVector(1.226, 1.984, 1.687);
      this.verts[4] = createVector(1.774, 0.887, 0.000);
      this.verts[5] = createVector(0.000, 1.984, 0.000);
      this.verts[6] = createVector(-0.548, -0.887, 1.688);
      this.verts[7] = createVector(1.774, 2.870, -0.000);


      for (let i = 0; i < this.verts.length; i++) {
        this.verts[i].x = ((this.verts[i].x * this.gScale) + this.x);
        this.verts[i].y = ((this.verts[i].y * this.gScale) + this.y);
        this.verts[i].z = ((this.verts[i].z * this.gScale) + this.z);
      }

      this.faceIndx = [[0,1,2],[3,5,4],[0,5,1],[5,3,1],[1,3,2],[2,3,4],[0,2,4],[0,4,5]];

    } else if (_method == 2)
    {
      let mPlane = new Face(_mPlane.facePts[0], _mPlane.facePts[1], _mPlane.facePts[2]);
      let myParent;

      myParent = _myParent;

      for (let i = 0; i < 8; i++) {
        this.verts[i] = reflect3d(myParent.verts[i], mPlane);
      }

      for (let i = 0; i < 8; i++) {
        this.faceIndx.push([myParent.faceIndx[i][0],myParent.faceIndx[i][2],myParent.faceIndx[i][1]]);
      }

    } else if (_method == 3)
    {
      let aPt = _aPt;
      let scaleFactor = _scaleFactor;
      let myParent = _myParent;

      for (let i = 0; i < 8; i++) {
        this.verts[i] = scale3d(myParent.verts[i], aPt, scaleFactor);
      }

      for (let i = 0; i < 8; i++) {
        this.faceIndx.push([myParent.faceIndx[i][0],myParent.faceIndx[i][1],myParent.faceIndx[i][2]]);
      }
    }
    this.ballCenter1 = this.verts[6];
    this.ballCenter2 = this.verts[7];
    this.center = vertex_average([this.verts[0],this.verts[1],this.verts[2],this.verts[3],this.verts[4],this.verts[5]]);

  for (let i = 0; i < 8; i++) {
    let myType;
    if (i<2){
      myType = "e";
    } else {
      myType = "i";
    }
    this.faces.push(new Face(this.verts[this.faceIndx[i][0]],this.verts[this.faceIndx[i][1]],this.verts[this.faceIndx[i][2]],myType));
  }

  }


}

//--------------------------
//RHOMB GRID (CHOOSE 3 VECTORS FROM DODECAHEDRON)
//--------------------------
class Grid_Rhomb {
  constructor(_w, _h, _l, _gridScale) {
    this.gPts = [];
    this.gIndx = [];
    this.vecNum = 3;
    this.moveVectors = new p5.Vector(this.vecNum * 2); //3 vectors and their opposites
    this.moveVectorsIndx = new Array(this.vecNum * 2);
    this.gVectors = new p5.Vector();
    this.w = _w;
    this.h = _h;
    this.l = _l;
    this.gridScale = _gridScale;
    this.moveVectorSize = this.vecNum * 2;

    this.gVectors = this.findDodecaVectors(); //generate dodecahedron vectors

    //Scale the grid to stetch from ball to ball
    for (let i = 0; i < 20; i++) {
      this.gVectors[i].mult(2.0);
    }
    //which vectors do we want to use for the grid?
    this.moveVectors[0] = this.gVectors[0];
    this.moveVectors[1] = this.gVectors[1];
    this.moveVectors[2] = this.gVectors[10];
    //reverse
    this.moveVectors[3] = this.gVectors[17];
    this.moveVectors[4] = this.gVectors[18];
    this.moveVectors[5] = this.gVectors[8];
    //indx nums
    this.moveVectorsIndx[0] = 0;
    this.moveVectorsIndx[1] = 1;
    this.moveVectorsIndx[2] = 10;
    //reverse
    this.moveVectorsIndx[3] = 17;
    this.moveVectorsIndx[4] = 18;
    this.moveVectorsIndx[5] = 8;

    //DEFINE THE GRID
    for (let i = 0; i < this.l; i++) {
      this.gPts[i] = [];
      this.gIndx[i] = [];
      for (let j = 0; j < this.w; j++) {
        this.gPts[i][j] = [];
        this.gIndx[i][j] = [];
        for (let k = 0; k < this.h; k++) {
          let dx = new p5.Vector(this.moveVectors[0].x, this.moveVectors[0].y, this.moveVectors[0].z);
          let dy = new p5.Vector(this.moveVectors[1].x, this.moveVectors[1].y, this.moveVectors[1].z);
          let dz = new p5.Vector(this.moveVectors[2].x, this.moveVectors[2].y, this.moveVectors[2].z);
          let t = ((this.w) * 0.5); //assuming a square grid
          dx.mult((i - t) * this.gridScale); //go negative
          dy.mult((j - t) * this.gridScale);
          dz.mult((k - t) * this.gridScale);
          let v = new p5.Vector(0, 0, 0);
          v.add(dx);
          v.add(dy);
          v.add(dz);
          this.gPts[i][j][k] = new p5.Vector(v.x, v.y, v.z);
          this.gIndx[i][j][k] = new p5.Vector(i, j, k);
        }
      }
    }

  } //end constructor

  //Calculate the 20 grid vectors (Vertices of a dodecahedron)
  findDodecaVectors() {
    let retV = []; //new p5.Vector(20);
    let vertices = []; //new p5.Vector(20,3); //2D array

    let phiaa = 52.62263590; // the two phi angles needed for generation
    let phibb = 10.81231754;

    let r = 1.0; // any radius in which the polyhedron is inscribed
    let phia = PI * phiaa / 180.0; // 4 sets of five points each
    let phib = PI * phibb / 180.0;
    let phic = PI * (-phibb) / 180.0;
    let phid = PI * (-phiaa) / 180.0;
    let the72 = PI * 72.0 / 180;
    let theb = the72 / 2.0; // pairs of layers offset 36 degrees
    let the = 0.0;
    let myVert = createVector(0, 0, 0); //new p5.Vector();


    for (let i = 0; i < 5; i++) {
      vertices[i] = [];
      vertices[i][0] = r * cos(the) * cos(phia);
      vertices[i][1] = r * sin(the) * cos(phia);
      vertices[i][2] = r * sin(phia);
      vertices.push(myVert);
      the = the + the72;
    }
    the = 0.0;

    for (let i = 5; i < 10; i++) {
      vertices[i] = [];
      vertices[i][0] = r * cos(the) * cos(phib);
      vertices[i][1] = r * sin(the) * cos(phib);
      vertices[i][2] = r * sin(phib);
      the = the + the72;
    }
    the = theb;

    for (let i = 10; i < 15; i++) {
      vertices[i] = [];
      vertices[i][0] = r * cos(the) * cos(phic);
      vertices[i][1] = r * sin(the) * cos(phic);
      vertices[i][2] = r * sin(phic);
      the = the + the72;
    }
    the = theb;

    for (let i = 15; i < 20; i++) {
      vertices[i] = [];
      vertices[i][0] = r * cos(the) * cos(phid);
      vertices[i][1] = r * sin(the) * cos(phid);
      vertices[i][2] = r * sin(phid);
      the = the + the72;
    }


    for (let i = 0; i < 20; i++) {
      retV.push(new p5.Vector(vertices[i][0], vertices[i][1], vertices[i][2]));
    }

    return retV;
  }
}

//////////////////////////////////////
class GrowSys {
  constructor(_gens) {
    this.gens = _gens;
    this.gen1 = 0;
  }

  //Grow to a target point
  //Grow until the target is reached
  growToTarget(_myTarg) {
    let myTarg = _myTarg;
    let letsGrow = true;
    let temp = currGo; //a Go3d
    let testDist = temp.verts[3].dist(temp.verts[0]); //67.4896;//diagonal along the shape
    let cnt = 0;

    while (letsGrow == true) {
      cnt += 1; //bailout var (fix this)
      //figure out dist of current unit from target point
      temp = currGo;
      let tempDist = temp.center.dist(myTarg);
      //grow to target
      if ((tempDist > testDist) && (cnt < 199)) {
        let currGroup = [];
        currGroup = this.growByBall(temp, myTarg); //Grow toward target (create a group of new units)

        //find the closest unit in the new group to target
        let cfIndx = 99;
        let gCurrDist = 9999;
        let gTestDist;
        for (let i = 0; i < currGroup.length; i++) {
          let gTemp = currGroup[i];
          gTestDist = gTemp.center.dist(myTarg);
          if (gTestDist < gCurrDist) {
            gCurrDist = gTestDist;
            cfIndx = i;
          } //end if
          //lets add them to go
          go.push(gTemp);
        } //end for
        //closest unit of the group, the "current unit" to grow from
        currGo = currGroup[cfIndx];
      } else { //we've reached the target
        letsGrow = false;
        go = this.remDups(go);
        // go = this.remFaces(go);
        this.gen1 = go.length;

        if (DECORATE == true){
          this.decorate();
        }

        //one last check
        go = this.remDups(go);
       // go = this.remIntersect(go);
      } //end decorate phase
    } //end grow=TRUE
  } //end class

  growByBall(_myGo, _myTarg) { //Go3D, Vector
    let group = []; //Array to store the group of units that we produce
    let myGo = _myGo;
    let myTarg = _myTarg;
    let cfIndx = 99;

    //Find whether face 0 or 1 is closer to the target (the equilateral faces)
    if (myGo.faces[0].center.dist(myTarg) <= myGo.faces[1].center.dist(myTarg)) {
      cfIndx = 0;
    } else {
      cfIndx = 1;
    }
    //Grow ball section
    //L-system type instructions

    group = this.render(Lstring, myGo, cfIndx);
    //"ffff+fff"
    //ffff+fff+ff+fff+f+fff+f+ffff+ff
    return group;
  }

  //go back over GO list and scale etc.
  decorate() {
    let genSize = go.length;

    for (let i = 0; i <= this.gens; i++) {
      for (let j = currArraySize; j < genSize; j++) { //start from the current array
        let group = [];
        let startPt = 0; //what point to start with

        //scale down?
        rand = R.random_dec();
        //print(rand);

        if (rand > growth_percent) {///growth variation
          let temp = go[j]; //parent
          rand1 = R1.random_dec();
          let scalePt; //vector
          if (rand1 > growth_type_ratio) {///growth variation
            scalePt = temp.ballCenter1;
            startPt = 0;
          } else {
            scalePt = temp.ballCenter2;
            startPt = 3;
          }
          //make sure the new unit won't be inside a Gen 0 neighbor
          let flag = 0;
          let gSphere = go[0].center.dist(go[0].faces[0].center); //inner bounding sphere of GO
          //print("gShphere 1 = " + gSphere);
          for (let i = 0; i < go.length; i++) {
            if (go[i].center.dist(scalePt) < gSphere) {
              flag = 1;
            }
          }
          if (flag == 0) {
            go.push(new Go3d(3, undefined, undefined, undefined, undefined, undefined, undefined, temp, scalePt, 0.5)); //scale it
            temp = go[go.length - 1]; //get it
            //And grow from it?
            //build the instruction string
            let build = true;
            let p = "";
            let cnt = 0;
            while (build == true) {
              rand2 = R2.random_dec();
              let randA = small_death_chance;///growth variation
              if (rand2 > randA) { //start growing
                p = p + "f";
                cnt += 1;
                if (cnt >= 4) {
                  p = p + "+";
                  cnt = 0;
                } //change direction?
                rand3 = R3.random_dec();
                randA = .98;
                if (rand3 > randA) { //change direction
                  p = p + "/";
                  cnt = 0;
                }
              } else {
                build = false;
              }
            } //while

            //render the instructions
            //consol.log ("p = " + p);
            group = this.render(p, temp, startPt);
            group = this.remDups(group);
            group = this.remFaces(group);

            //add the remaining members of the group
            for (let k = 0; k < group.length; k++) {
              go.push(group[k]);
            }

          } //end of scale inside test
        } //scale down?
      } //j, current generation
      //set up for next generation
      currArraySize = genSize;
      genSize = go.length;
    } //i, for each generation


  } //decorate

  remDups(_myGroup) {
    //print("rem dups before = " + _myGroup.length);
    for (let i = 0; i < _myGroup.length; i++) {
      let temp = _myGroup[i];
      for (let j = 0; j < _myGroup.length; j++) {
        if (j != i) {
          let temp1;
          temp1 = _myGroup[j];
          if (temp.center.dist(temp1.center) < 0.1) {
            _myGroup.splice(j, 1);
          }
        }
      }
    }
    //print("rem dups after = " + _myGroup.length);
    return _myGroup;
  }

  remFaces(_myGroup) {
    //remove Interior faces
    //could this check just neighbors in the go chain?
    //for each go
    for (let i = 0; i < _myGroup.length; i++) {
      //print("faces before = " + go[i].faces.length);
      let temp = _myGroup[i];
      for (let j = 0; j < _myGroup.length; j++) {
        if (j != i) {
          //for each parent face
          for (let k = 0; k < _myGroup[i].faces.length; k++) {
            let tempFacePt = _myGroup[i].faces[k].center;
            for (let l = 0; l < _myGroup[j].faces.length; l++) {
              if (tempFacePt.dist(_myGroup[j].faces[l].center) < 0.1) {
                _myGroup[i].faces.splice(k, 1);
                _myGroup[j].faces.splice(l, 1);
                break;
              }
            }
          }
        }
      }
      //print("faces after = " + go[i].faces.length);
    }
    return _myGroup;
  }


  render(_production, _myGo, _myFaceIndx) {
    let production = _production;
    let myGo = _myGo;

    let proLen = production.length;
    let myGroup = [];

    //update this, maybe we dont need the global vars anymore
    let currFace = 2;
    let currPoint;
    if (_myFaceIndx == 0) {
      currPoint = 0;
    } else {
      currPoint = 3;
    }

    for (let i = 0; i < proLen; i++) {
      let pstep = production.charAt(i);
      //GROW BY MIRRORING
      if (pstep == 'f') {

        //switch
        if (currPoint == 0) {
          if (currFace == 2) {
            currFace = 6;
          } else if (currFace == 6) {
            currFace = 2;
          } else {
            currFace = 2;
          }
        } else if (currPoint == 1) {
          if (currFace == 2) {
            currFace = 4;
          } else if (currFace == 4) {
            currFace = 2;
          } else {
            currFace = 4;
          }
        } else if (currPoint == 2) {
          if (currFace == 2) {
            currFace = 6;
          } else if (currFace == 6) {
            currFace = 2;
          } else {
            currFace = 6;
          }
        } else if (currPoint == 3) {
          if (currFace == 3) {
            currFace = 5;
          } else if (currFace == 5) {
            currFace = 3;
          } else {
            currFace = 3;
          }
        } else if (currPoint == 4) {
          if (currFace == 5) {
            currFace = 7;
          } else if (currFace == 7) {
            currFace = 5;
          } else {
            currFace = 5;
          }
        }
        //grow by mirroring
        myGroup.push(new Go3d(2, undefined, undefined, undefined, undefined, undefined, myGo.faces[currFace], myGo));
        //myGo.faces.splice(currFace,1); //delete the now hidden face
        let temp = myGroup[myGroup.length - 1];
        myGo = temp;
      } else if (pstep == '+') { //CHANGE POINT
        if (currPoint < 3) {
          currPoint += 1;
          if (currPoint > 2) {
            currPoint = 0;
          }
        } else {
          currPoint += 1;
          if (currPoint > 4) {
            currPoint = 3;
          }
        }
      }
      //CHANGE DIRECTION
      else if (pstep == '/') {
        if (currPoint < 3) {
          currPoint = 3;
        } else {
          currPoint = 0;
        }
      }
    } //end loop
    return myGroup;
  }
} //end class


//--------------------------
//A triangular face
//--------------------------
class Face
{
  constructor(_pt1, _pt2, _pt3, _type){
    this.type = _type;
    this.facePts = [];
    this.center = new p5.Vector();

    this.facePts[0] = createVector(_pt1.x,_pt1.y,_pt1.z);
    this.facePts[1] = createVector(_pt2.x,_pt2.y,_pt2.z);
    this.facePts[2] = createVector(_pt3.x,_pt3.y,_pt3.z);

    this.center = vertex_average(this.facePts);
    this.normal = p5.Vector.sub(this.facePts[1], this.facePts[0]).cross(p5.Vector.sub(this.facePts[2], this.facePts[0]));
    this.normal.mult(-1);//don't know why its not pointing the right way
    this.normal.normalize();
  }
}

//-------------------------------------
//UTILITY FUNCTIONS
//-------------------------------------
//reflect a point across a plane
function reflect3d(_p,_mFace)
{
  let retV = new p5.Vector(0,0,0);
  let mFace = new Face(_mFace.facePts[0],_mFace.facePts[1],_mFace.facePts[2]);

  //planeVectors
  let pv0 = new p5.Vector(mFace.facePts[0].x,mFace.facePts[0].y,mFace.facePts[0].z);
  let pv1 = p5.Vector.sub(mFace.facePts[1],mFace.facePts[0]);
  let pv2 = p5.Vector.sub(mFace.facePts[2],mFace.facePts[0]);

  let myNormal = pv2.cross(pv1);
  myNormal.normalize();

  gTestPV0 = pv0;
  gTestPV1 = pv1;
  gTestPV2 = pv2;

  //create vector between plane origin and the point
  if(_p.dist(mFace.facePts[0]) == 0 || _p.dist(mFace.facePts[1]) == 0 || _p.dist(mFace.facePts[2]) == 0) {
    retV.x = _p.x;
    retV.y = _p.y;
    retV.z = _p.z;
  }
  else {
    let pvR = p5.Vector.sub(_p,mFace.facePts[0]);

    let ang =Math.abs(pvR.angleBetween(myNormal));

    //Parallel
    //cross product of point vector and surface normal
    let cross1 = pvR.cross(myNormal);
    cross1.normalize();
    cross1.mult(20);
    testCross1 = new p5.Vector(cross1.x,cross1.y,cross1.z);
    cross1.normalize();

    //cross product of cross1 and surface normal
    let parallelV = myNormal.cross(cross1);
    parallelV.normalize();
    //find proper length
    parallelV.mult(pvR.mag()*sin(ang));

    //perpendicular component
    //length of pvR*cos(ang) along plane normal
    myNormal.normalize();

    myNormal.mult(pvR.mag()*cos(ang));
    let perpV = new p5.Vector(myNormal.x,myNormal.y,myNormal.z);

    //Reflect the point
    //-P*Va*P
    perpV.mult(-1.0);
    retV.x = perpV.x;
    retV.y = perpV.y;
    retV.z = perpV.z;

    retV1 = new p5.Vector(retV.x,retV.y,retV.z);

    retV.add(parallelV);

    retV2 = new p5.Vector(retV.x,retV.y,retV.z);

    retV.add(pv0);

    retV3 = new p5.Vector(retV.x,retV.y,retV.z);
  }
  return retV;
}

function scale3d( v, b, s) { //point to scale, point to scale about, scale factor
  let retV = new p5.Vector(0,0,0);
  retV.x = v.x + (-1*b.x);
  retV.y = v.y + (-1*b.y);
  retV.z = v.z + (-1*b.z);

  retV.x = (retV.x * s);
  retV.y = (retV.y * s);
  retV.z = (retV.z * s);

  //move it back into place
  retV.x = retV.x + (b.x);
  retV.y = retV.y + (b.y);
  retV.z = retV.z + (b.z);

  return retV;
}

// Vertices Centroid
// in:  an array of vertices
// out: the centroid of them
function vertex_average( vertices )
{
  let retV = new p5.Vector(0,0,0);
  for (let i=0; i<vertices.length; i++) {
    retV.x = retV.x + vertices[i].x;
    retV.y = retV.y + vertices[i].y;
    retV.z = retV.z + vertices[i].z;
  }
  let total = vertices.length;
  retV.x = retV.x / total;
  retV.y = retV.y / total;
  retV.z = retV.z / total;

  return retV;
}
