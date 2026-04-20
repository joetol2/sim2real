var GRAVITY = -1000
var RADIUS = 25;
var RADIUS_SHOW = 1;
var TICK_PHYS = 0.001;
var TICK_SHOW = 0.001 * (1000 / 60);
var oldMouse = {
  x: 0,
  y: 0,
  d: false
};
var mouse = {
  x: 0,
  y: 0,
  d: false
};
var nmouse = {
  x: 0,
  y: 0,
  d: false
};
REALTIME = 1 //2.5;
TICK_MAX = 1000000;
// TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20

BOND_P = 200
BOND_D = 0.5
CONTACT_P = 1000
CONTACT_D = 0
DAMP = 0.95
MAX_SPEED = 100000
ATOMS = []
BONDS = []
THINGS = []
CONTACTS = []
COLLIDES = []
LAYER_FILTERS = [
  ["DEFAULT", "DEFAULT"]
]
var nextVol = 0;
var vol = 0;
STEP_RES = 11 // DONOT CHANGE TO VERY LOW (Higher Is More Real And More Stable)
function componentAlong(a, b) {
  return (a.x * b.x + a.y * b.y) / Math.sqrt(b.y * b.y + b.x * b.x);
}
atom = function(x, y, vx, vy, radius, locked, layer, color) {
  this.color = color;
  this.beingDragged = false;
  this.lockedBeforeDrag = locked;
  if (vx == null) vx = vy = 0;
  if (radius == null) radius = RADIUS;
  this.p = {
    x: x,
    y: y | 0
  };
  this.dragDelta = {
    x: 0,
    y: 0
  }
  this.v = {
    x: vx,
    y: vy
  };
  this.radius = radius;
  this.mass = 1;
  if (layer == null || layer == undefined || layer == "") {
    layer = "DEFAULT";
  }
  this.layer = layer;
  this.locked = locked;
  this.f = {
    x: 0,
    y: 0
  };
  this.nv = {
    x: 0,
    y: 0
  };
  this.nf = {
    x: 0,
    y: 0
  };


}
atom.prototype.draw = function() {
  display_circle(this.p.x, this.p.y, this.radius, this.color); //ATOM_COLOR2);
  //display_circle(this.p.x, this.p.y, RADIUS_SHOW+1, ATOM_COLOR);
};
atom.prototype.applyForce = function() {
  var vDist = Math.sqrt(Math.pow(this.v.x, 2) + Math.pow(this.v.y, 2));
  if (vDist > MAX_SPEED) {
    this.v.y = this.v.y / vDist * MAX_SPEED;
    this.v.x = this.v.x / vDist * MAX_SPEED;
  }
  if (!this.locked && !this.beingDragged) {
    //  console.log(this.f.x , STEP_RES);
    this.v.x += this.f.x / STEP_RES;

    this.v.y += this.f.y / STEP_RES;

    this.nv.x += this.nf.x / STEP_RES;

    this.nv.y += this.nf.y / STEP_RES;
    //this.v.y += GRAVITY * TICK_PHYS;

  } else {
    this.v.x = 0;
    this.v.y = 0;
    this.nv.x = 0;
    this.nv.y = 0;
  }
  if (this.beingDragged) {
    this.v.x = (mouse.x - oldMouse.x);
    this.v.y = (mouse.y - oldMouse.y);
  }
  this.f.x = 0;
  this.f.y = 0;
  this.nf.x = 0;
  this.nf.y = 0;
};
atom.prototype.update = function() {
  if (!this.locked) {
    //this.v.x += this.f.x;
    //this.f.x = 0;
    //this.v.y += this.f.y;
    //this.f.y = 0;

    if (this.beingDragged) {

      this.v.x = (0);
      this.v.y = (0);
    } else {
      this.p.x += this.v.x * TICK_PHYS;
      this.p.y += this.v.y * TICK_PHYS;
      this.v.x -= this.nv.x;
      this.v.y -= this.nv.y;
    }
    this.v.y += GRAVITY * TICK_PHYS;
    this.v.x *= DAMP;
    this.v.y *= DAMP;

    if (this.beingDragged) {
      this.v.x = (mouse.x - oldMouse.x);
      this.v.y = (mouse.y - oldMouse.y);
    }
  } else {
    this.v.x = 0;
    this.v.y = 0;

    if (this.beingDragged) {
      this.p.x = mouse.x;
      this.p.y = mouse.y;
    }
  }
  this.nv.x = 0;
  this.nv.y = 0;
  if (Math.pow(Math.pow((mouse.x - this.p.x), 2) + Math.pow((mouse.y - this.p.y), 2), 0.5) <= this.radius) {
    //this.radius++;
  }
  if (mouse.d && (!oldMouse.d)) {
    if (Math.pow(Math.pow((mouse.x - this.p.x), 2) + Math.pow((mouse.y - this.p.y), 2), 0.5) <= this.radius) {
      this.beingDragged = true;
      this.locked = true;
      this.dragDelta = {
        x: this.p.x - mouse.x,
        y: this.p.y - mouse.y
      };
      //this.radius++;
    }
  }
  if (!mouse.d) {
    //if(Math.pow(Math.pow((mouse.x-this.x),2)+Math.pow((mouse.y-this.y),2),0.5)<=this.radius){
    this.locked = this.lockedBeforeDrag;
    this.beingDragged = false;
    //}

  }
};

bond = function(atom1, atom2, dist) {
  if (dist == undefined) dist = RADIUS * 2;
  this.a = atom1;
  this.b = atom2;
  this.d = dist;
}

thing = function(name, x, y, vx, vy, obj, locked, layer, color) {
  console.log("creating thing", name, color);
  this.name = name;
  this.atoms = [];
  this.soft = false;
  if (layer == null || layer == undefined || layer == "") {
    layer = "DEFAULT";
  }
  this.layer = layer;
  this.add = function(atom) {
    atom.layer = this.layer;
    if (color != null) {
      atom.color = color;
      console.log("coloring thing", name, atom.color);
    }
    this.atoms.push(atom);

  }
  if (obj != undefined) {
    for (var i = 0; i < obj.length; i++) {
      var o = obj[i];
      var a = new atom(o.p.x + x, o.p.y + y, o.v.x + vx, o.v.y + vy, o.radius, locked, this.layer, color);
      this.atoms.push(a);
      ATOMS.push(a);
    }
  }
  this.runGroup = function() {
    var massTotal = 0;
    var massDTotal = 0;
    var massCenter = {
      x: 0,
      y: 0
    };
    var rotVector = {
      x: 0,
      y: 0
    };
    var transVector = {
      x: 0,
      y: 0
    };
    var rotVel = {
      x: 0,
      y: 0
    };
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      massTotal += atom.mass;
      massCenter.x += atom.p.x * atom.mass;
      massCenter.y += atom.p.y * atom.mass;
    }
    massCenter.x = massCenter.x / massTotal;
    massCenter.y = massCenter.y / massTotal;
    //massTotal=0;
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      var angleV = Math.atan2(atom.f.y, atom.f.x);
      var angleA = Math.atan2(atom.p.y - massCenter.y, atom.p.x - massCenter.x);
      var dist = Math.sqrt(Math.pow(atom.p.x - massCenter.x, 2) + Math.pow(atom.p.y - massCenter.y, 2));
      var vDist = Math.sqrt(Math.pow(atom.f.x, 2) + Math.pow(atom.f.y, 2));
      var angleVD = (angleV - angleA);
      var velVec = {
        x: Math.cos(angleVD) * atom.mass / dist,
        y: Math.sin(angleVD) * atom.mass / dist
      }
      rotVector.x += velVec.x;
      rotVector.y += velVec.y;
      massDTotal += atom.mass / dist;
    }
    rotVector.x = rotVector.x / massDTotal;
    rotVector.y = rotVector.y / massDTotal;

    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      var angleV = Math.atan2(atom.f.y, atom.f.x);
      var angleA = Math.atan2(atom.p.y - massCenter.y, atom.p.x - massCenter.x);
      var dist = Math.sqrt(Math.pow(atom.p.x - massCenter.x, 2) + Math.pow(atom.p.y - massCenter.y, 2));
      var vDist = Math.sqrt(Math.pow(atom.f.x, 2) + Math.pow(atom.f.y, 2));
      //  var angleVD=(angleV-angleA);
      var angleVD = angleA + Math.atan2(rotVector.y, rotVector.x);
      var velVec = {
        x: Math.cos(angleVD) / atom.mass * dist,
        y: Math.sin(angleVD) / atom.mass * dist
      }
      transVector.x += (velVec.x - this.atoms[i].f.x) * atom.mass;
      transVector.y += (velVec.y - this.atoms[i].f.y) * atom.mass;
      this.atoms[i].f = velVec;
    }
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      this.atoms[i].f.x += transVector.x / massTotal;
      this.atoms[i].f.y += transVector.y / massTotal;
    }
  }
  this.runGroup2 = function() {
    var massTotal = 0;
    var massDTotal = 0;
    var massCenter = {
      x: 0,
      y: 0
    };
    var rotVector = {
      x: 0,
      y: 0
    };
    var transVector = {
      x: 0,
      y: 0
    };
    var rotVel = {
      x: 0,
      y: 0
    };
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      massTotal += atom.mass;
      massCenter.x += atom.p.x * atom.mass;
      massCenter.y += atom.p.y * atom.mass;
    }
    massCenter.x = massCenter.x / massTotal;
    massCenter.y = massCenter.y / massTotal;
    //massTotal=0;
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      var angleV = Math.atan2(atom.v.y, atom.v.x);
      var angleA = Math.atan2(atom.p.y - massCenter.y, atom.p.x - massCenter.x);
      var dist = Math.sqrt(Math.pow(atom.p.x - massCenter.x, 2) + Math.pow(atom.p.y - massCenter.y, 2));
      var vDist = Math.sqrt(Math.pow(atom.v.x, 2) + Math.pow(atom.v.y, 2));
      var angleVD = (angleV - angleA);
      var velVec = {
        x: Math.cos(angleVD) * atom.mass / dist,
        y: Math.sin(angleVD) * atom.mass / dist
      }
      rotVector.x += velVec.x;
      rotVector.y += velVec.y;
      massDTotal += atom.mass / dist;
    }
    rotVector.x = rotVector.x / massDTotal;
    rotVector.y = rotVector.y / massDTotal;

    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      var angleV = Math.atan2(atom.v.y, atom.v.x);
      var angleA = Math.atan2(atom.p.y - massCenter.y, atom.p.x - massCenter.x);
      var dist = Math.sqrt(Math.pow(atom.p.x - massCenter.x, 2) + Math.pow(atom.p.y - massCenter.y, 2));
      var vDist = Math.sqrt(Math.pow(atom.v.x, 2) + Math.pow(atom.v.y, 2));
      //  var angleVD=(angleV-angleA);
      var angleVD = angleA + Math.atan2(rotVector.y, rotVector.x);
      var velVec = {
        x: Math.cos(angleVD) / atom.mass * dist,
        y: Math.sin(angleVD) / atom.mass * dist
      }
      transVector.x += (velVec.x - this.atoms[i].v.x) * atom.mass;
      transVector.y += (velVec.y - this.atoms[i].v.y) * atom.mass;
      this.atoms[i].v = velVec;
    }
    for (var i = 0; i < this.atoms.length; i++) {
      var atom = this.atoms[i];
      this.atoms[i].v.x += transVector.x / massTotal;
      this.atoms[i].v.y += transVector.y / massTotal;
    }
  }
  this.setLayer = function(name) {
    this.layer = name;
    for (var i = 0; i < this.atoms.length; i++) {
      this.atoms[i].layer = name;
    }
  }
  THINGS.push(this);
}
square = function(name, x, y, vx, vy, r, res, locked, layer, color) {
  var temp = new thing(name, x, y, vx, vy, [], locked, layer);
  for (var p in temp) {
    this[p] = temp[p];
  }
  var atomArray = [];
  var scale = res;
  r = Math.floor(r / scale);
  for (var i = 0; i < r; i++) {
    atomArray[i] = [];
    for (var j = 0; j < r; j++) {
      //if(i===0||j===0||i==r-1||j==r-1){


      var a = new atom(x + (i - r / 2) * scale, y + (j - r / 2) * scale, vx, vy, scale / 2, locked, null, color);
      a.mass = 1 / 25 * scale * scale;
      atomArray[i][j] = a;
      this.atoms.push(a);
      ATOMS.push(a);
      //  }
    }
  }

  for (var j = 0; j < r; j++) {
    for (var i = 0; i < r; i++) {
      if (i > 0) {
        BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j], scale));
      }
      if (j > 0) {
        BONDS.push(new bond(atomArray[i][j], atomArray[i][j - 1], scale));
      }
      if (j > 0 && i > 0) {
        BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j - 1], scale * Math.sqrt(2)));
      }
      if (j > 0 && i < atomArray.length - 1) {
        BONDS.push(new bond(atomArray[i][j], atomArray[i + 1][j - 1], scale * Math.sqrt(2)));
      }
    }

  }
  return this;

}

circle = function(name, x, y, vx, vy, r, locked, lockedC, layer) {
  var temp = new thing(name, x, y, vx, vy, [], locked, layer);
  for (var p in temp) {
    this[p] = temp[p];
  }

  var c = new atom(x, y, vx * 0, vy * 0, r - 3, lockedC);
  c.mass = Math.pow(r, 2) * Math.PI / 10 - Math.floor(Math.PI * r / 4) * Math.pow(2, 2) * Math.PI / 10;
  this.center = c;
  this.add(c);
  ATOMS.push(c);
  var atomArray = [];
  var atomCount = Math.floor(Math.PI * r / 4);
  for (var i = 0; i < atomCount; i++) {


    var a = new atom(x + Math.sin(i / atomCount * Math.PI * 2) * r, y + Math.cos(i / atomCount * Math.PI * 2) * r, 0, 0, 2, locked);
    a.mass = Math.pow(2, 2) * Math.PI / 10;
    atomArray[i] = a;
    this.add(a);

    //if(i>0){
    BONDS.push(new bond(a, c, r));
    ///}
    if (i > 0) {
      var distA = Math.sqrt(Math.pow(a.p.x - atomArray[i - 1].p.x, 2) + Math.pow(a.p.y - atomArray[i - 1].p.y, 2));
      //console.log(distA);
      BONDS.push(new bond(a, atomArray[i - 1], distA));

    }

    if (i == atomCount - 1) {
      var distA = Math.sqrt(Math.pow(a.p.x - atomArray[0].p.x, 2) + Math.pow(a.p.y - atomArray[0].p.y, 2));
      //console.log(distA);
      BONDS.push(new bond(atomArray[0], atomArray[atomArray.length - 1], distA));

    }
    ATOMS.push(a);
  }
  return this;
  //bond_all(this.atoms,true);
  //bond_triangulate(this.atoms,true);




}

triangle = function(name, x, y, vx, vy, r, res, locked, layer) {
  var temp = new thing(name, x, y, vx, vy, [], locked, layer);
  for (var p in temp) {
    this[p] = temp[p];
  }


  var atmData = fetchPointsToFillTriangle(x, y, r, res, Math.pow(r, 2) * Math.PI / 10 - Math.floor(Math.PI * r / 4) * Math.pow(2, 2) * Math.PI / 10);
  for (var cD of atmData) {
    var c = new atom(cD[0], cD[1], vx * 0, vy * 0, cD[2], locked);
    this.add(c);
    ATOMS.push(c);
  }
  return this;
  //bond_all(this.atoms,true);
  //bond_triangulate(this.atoms,true);




}

atoms_update = function() {
  for (var i = 0; i < ATOMS.length; i++) {
    ATOMS[i].update();
  }
}

atoms_draw = function() {
  for (var i = 0; i < ATOMS.length; i++) {
    ATOMS[i].draw();
  }
}

function fetchPointsToFillTriangle(x, y, r, depth, m) {
  if (depth < 2) {
    return [
      [x, y, r, m]
    ];
  } else {
    var top = fetchPointsToFillTriangle(x, y + r, r / 2, depth - 1, m / 4);
    var left = fetchPointsToFillTriangle(x - r / 2 * Math.sqrt(3), y - r / 2, r / 2, depth - 1, m / 4);
    var right = fetchPointsToFillTriangle(x + r / 2 * Math.sqrt(3), y - r / 2, r / 2, depth - 1, m / 4);
    var center = [
      [x, y, r / 2, m / 4]
    ]; //fetchPointsToFillTriangle(x,y,r/2,depth-1,m/4);
    return top.concat(left).concat(right).concat(center);
  }

}
refresh_contacts = function() {
  var tot = xchk = ychk = dchk = 0;
  CONTACTS = [];
  var layerNames = [];
  var layerObjectIndicies = [];
  for (var i = 0; i < ATOMS.length; i++) {
    var a = ATOMS[i];
    var layerNum = layerNames.indexOf(a.layer);
    if (layerNum < 0) {
      layerNames.push(a.layer);
      layerObjectIndicies.push([i]);
    } else {
      layerObjectIndicies[layerNum].push(i);
    }
  }
  for (var i = 0; i < LAYER_FILTERS.length; i++) {
    var ta = layerNames.indexOf(LAYER_FILTERS[i][0]);
    var tb = layerNames.indexOf(LAYER_FILTERS[i][1]);
    for (var j = 0; j < layerObjectIndicies[ta].length; j++) {
      var a = ATOMS[layerObjectIndicies[ta][j]];
      for (var k = 0; k < layerObjectIndicies[tb].length; k++) {
        var b = ATOMS[layerObjectIndicies[tb][k]];
        if (a != b) {

          var dx = a.p.x - b.p.x;
          var thresh = a.radius + b.radius;
          if (Math.abs(dx) < thresh) {
            xchk++;
            var dy = a.p.y - b.p.y;
            if (Math.abs(dy) < thresh) {
              ychk++;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < thresh) {
                dchk++;
                var ai = layerObjectIndicies[ta][j];
                var bi = layerObjectIndicies[tb][k];
                if (layerObjectIndicies[ta][j] > layerObjectIndicies[tb][k]) {
                  if (CONTACTS.indexOf(bi + "," + ai) < 0) {
                    CONTACTS.push(bi + "," + ai);
                  }
                } else {
                  if (CONTACTS.indexOf(ai + "," + bi) < 0) {
                    CONTACTS.push(ai + "," + bi);
                  }
                }

              }
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < CONTACTS.length; i++) {
    CONTACTS[i] = [ATOMS[parseInt(CONTACTS[i].split(",")[0])], ATOMS[parseInt(CONTACTS[i].split(",")[1])]];
  }
  /*for (var i=0; i<COLLIDES.length; i++) {
    var ta = COLLIDES[i][0];
    var tb = COLLIDES[i][1];
    for (var j=0; j<ta.atoms.length; j++) {
      var a = ta.atoms[j];
      for (var k=0; k<tb.atoms.length; k++) {
        tot++;
        var b = tb.atoms[k];
        var dx = a.p.x-b.p.x;
        var thresh = a.radius+b.radius;
        if (Math.abs(dx) < thresh) {
          xchk++;
          var dy = a.p.y-b.p.y;
          if (Math.abs(dy) < thresh) {
            ychk++;
            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < thresh) {
              dchk++;
              CONTACTS.push([a, b])
            }
          }
        }
      }
    }
}*/
  return {
    x: xchk,
    y: ychk,
    d: dchk,
    t: tot
  }
}

var momentum_swap = function(a, b, P, D, RESTITUTION, target, for_sound) {
  /*if(Number.isNaN(a.p.x)){
    a.p.x=0;
  }
  if(Number.isNaN(a.p.y)){
    a.p.y=0
  }
  if(Number.isNaN(a.v.x)){
    a.v.x=0;
  }
  if(Number.isNaN(a.v.y)){
    a.v.y=0;
  }

  if(Number.isNaN(b.p.x)){
    b.p.x=0;
  }
  if(Number.isNaN(b.p.y)){
    b.p.y=0
  }
  if(Number.isNaN(b.v.x)){
    b.v.x=0;
  }
  if(Number.isNaN(b.v.y)){
    b.v.y=0;
  }*/
  var dx = b.p.x - a.p.x;
  var dy = b.p.y - a.p.y;
  var dpvx = b.p.x - a.p.x + b.v.x - a.v.x;
  var dpvy = b.p.y - a.p.y + b.v.y - a.v.y;
  var dist = Math.sqrt(dx * dx + dy * dy); // distance between atoms
  var udx = dx / dist; // unit vector pointing from a to b
  var udy = dy / dist;
  var dif = dist - target; // difference we want to restore to zero
  /*
  var vacomp1 = componentAlong(a.v, {
      x: udx,
      y: udy
  }); //dvx*udx + dvy*udy;
  var vbcomp1 = componentAlong(b.v, {
      x: udx,
      y: udy
  }); //dvx*udx + dvy*udy;
  */
  var magicMult = a.mass * b.mass / (b.mass + a.mass);

  //  if(!for_sound){
  if (a.locked || a.mass === 0) {
    magicMult = b.mass;
    //P=1;

  }
  if (b.locked || b.mass === 0) {
    magicMult = a.mass;
    //  P=1;
  }
  //  P=1;
  /*if(!(magicMult>0)){
//console.log(magicMult);
}
//}
var dvx = b.v.x - a.v.x;
var dvy = b.v.y - a.v.y;

var dvmx = b.v.x * (b.locked?0:b.mass) - a.v.x * (a.locked?0:a.mass);
var dvmy = b.v.y * (b.locked?0:b.mass) - a.v.y * (a.locked?0:a.mass);
var vcomp = componentAlong({
    x: dvx,
    y: dvy
}, {
    x: udx,
    y: udy
}); //dvx*udx + dvy*udy;
*/
  var vacomp = componentAlong(a.v, {
    x: udx,
    y: udy
  }); //dvx*udx + dvy*udy;
  var vbcomp = componentAlong(b.v, {
    x: udx,
    y: udy
  }); //dvx*udx + dvy*udy;
  var vmcomp = (vbcomp + 0 * (b.locked ? 0 : b.mass) - vacomp + 0 * (a.locked ? 0 : a.mass)) * (1 + RESTITUTION); ///magicMult;// / magicMult;
  //console.log(vmcomp);
  //var relativeMomentumBetween=(vbcomp * (b.locked?0:b.mass) - vacomp * (a.locked?0:a.mass));
  /*vmcomp = componentAlong({
      x: dvmx,
      y: dvmy
  }, {
      x: udx,
      y: udy
  })/ magicMult;*/
  //if(!for_sound){
  //D=Math.abs(vmcomp*magicMult);
  //}
  //var difPV = Math.sqrt(dpvx * dpvx + dpvy * dpvy) - target;
  var pterm = (dif) * P; //*magicMult*P/magicMult;///TICK_PHYS*P;                // Proportional term for our springy bond
  //  D=D;

  // original logic for posterity
  // var dvx = b.v.x-a.v.x;
  // var dvy = b.v.y-a.v.y;
  // var vdif = Math.sqrt(dvx*dvx+dvy*dvy);  // relative velocity
  // var vdot = 0;                           // if relative velocity==0, no Derivative term for our PiD
  // if (vdif) {
  // var uvx = dvx / vdif;                 // velocity unit vector (direction of rel vel)
  // var uvy = dvy / vdif;
  // vdot = uvx*udx + uvy*udy;             // dot product of positional direction vs rel vel - we only
  // }                                       // want to adjust velocity along axis aligned with 2 particles,
  // var dterm = vdif * vdot * D;        // Derivative term

  // equivalent yet optimized:

  //pterm = (dif )*target;//(Math.abs(vmcomp)+1+target);
  // D = 1/target;//(Math.abs(vmcomp)+1+target);
  //pterm=dif*(target+Math.abs(dif+vacomp-vbcomp))/target
  var dterm = vmcomp * D; // Derivative term
  //pterm+=dif*(Math.abs(vmcomp));
  /*
      if (a.locked) {
          //dterm = 0;
      }
      if (b.locked) {
          //dterm = 0;
      }

      var xswap = (pterm + dterm) * udx; //*100;//*(target+Math.abs(dif))/target;          // along axis a--b
      var yswap = (pterm + dterm) * udy; //*100;//*(target+Math.abs(dif))/target;
      if(for_sound){
        var r = a.radius;
      var R = b.radius;
      var d = difPV;
      if(R < r){
      // swap
      r = b.radius;
      R = a.radius;
      }
      var part1 = r*r*Math.acos((d*d + r*r - R*R)/(2*d*r));
      var part2 = R*R*Math.acos((d*d + R*R - r*r)/(2*d*R));
      var part3 = 0.5*Math.sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));

      var intersectionArea = part1 + part2 - part3;
      //xswap = intersectionArea *(a.mass+b.mass) * udx; //*100;//*(target+Math.abs(dif))/target;          // along axis a--b
      //yswap = intersectionArea *(a.mass+b.mass) * udy; //*100;//*(target+Math.abs(dif))/target;
      }
      // swap momenta

*/

  if (!b.locked) {
    //b.f.x -= xswap;
    //b.f.y -= yswap;
    //console.log(b,dterm);
    b.f.x -= (pterm + dterm) * udx * magicMult / b.mass; //(pterm + vmcomp *D) * udx * magicMult / b.mass;
    b.f.y -= (pterm + dterm) * udy * magicMult / b.mass; //(pterm + vmcomp*D ) * udy * magicMult / b.mass;
    //  b.f.x -= xswap;
    //  b.f.y -= yswap;
    if (for_sound) { //}&& (newtonsCradle.indexOf(a)+newtonsCradle.indexOf(b)>-2)){

      //    nextVol = Math.min(Math.max(nextVol, Math.sqrt((Math.abs(difPV) * 100 + 10) * (b.mass * 2)) / 5000 - 0.1), 1); //(vmcomp+Math.abs(dif))/10);
      //      nextVol=Math.min(Math.max(nextVol,(Math.abs(vbcomp*b.mass-vacomp*a.mass )+Math.abs(dif))/100),1);//(vmcomp+Math.abs(dif))/10);
    }
  }
  if (!a.locked) {
    a.f.x += (pterm + dterm) * udx * magicMult / a.mass; //(pterm + vmcomp*D ) * udx * magicMult / a.mass;
    a.f.y += (pterm + dterm) * udy * magicMult / a.mass; // (pterm + vmcomp *D) * udy * magicMult / a.mass;
    //a.f.x += xswap;
    //a.f.y += yswap;
    if (for_sound) { //}&& (newtonsCradle.indexOf(a)+newtonsCradle.indexOf(b)>-2)){

      //    nextVol = Math.min(Math.max(nextVol, Math.sqrt((Math.abs(difPV) * 100 + 10) * (a.mass * 2)) / 5000 - 0.1), 1); //(vmcomp+Math.abs(dif))/10);
      //      nextVol=Math.min(Math.max(nextVol,(Math.abs(vbcomp*b.mass-vacomp*a.mass )+Math.abs(dif))/100),1);//(vmcomp+Math.abs(dif))/10);
    }
  }
  if (!(b.locked || a.locked)) {
    if (for_sound) { //}&& (newtonsCradle.indexOf(a)+newtonsCradle.indexOf(b)>-2)){

      //  nextVol = Math.min(Math.max(nextVol, Math.sqrt((Math.abs(difPV) * 100 + 10) * (a.mass + b.mass)) / 5000 - 0.1), 1); //(vmcomp+Math.abs(dif))/10);
      //      nextVol=Math.min(Math.max(nextVol,(Math.abs(vbcomp*b.mass-vacomp*a.mass )+Math.abs(dif))/100),1);//(vmcomp+Math.abs(dif))/10);
    }


  }
  /*if(Number.isNaN(a.f.x)){
    a.f.x=0;
  }
  if(Number.isNaN(a.f.y)){
    a.f.y=0;
  }

  if(Number.isNaN(b.f.x)){
    b.f.x=0;
  }
  if(Number.isNaN(b.f.y)){
    b.f.y=0;
  }*/


}

bonds_update = function() {
  for (var i = 0; i < BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    var target = BONDS[i].d;
    momentum_swap(a, b, 1 / TICK_PHYS, 1, 1, target);
  }
}

contacts_update = function() {
  for (var i = 0; i < CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    var target = a.radius + b.radius;
    momentum_swap(a, b, 2000, 0, 1, target, true);
  }
}

bonds_draw = function() {
  for (var i = 0; i < BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    display_line(a.p.x, a.p.y, b.p.x, b.p.y, BOND_COLOR, 2);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

contacts_draw = function() {
  for (var i = 0; i < CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    display_line(a.p.x, a.p.y, b.p.x, b.p.y, CONTACT_COLOR);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

profile_counts = {
  bonds: 0,
  atoms: 0,
  contacts_total: 0,
  contacts_x: 0,
  contacts_y: 0,
  contacts_deep: 0,
  real_contacts: 0,
  iterations: 0
}
update_all = function(n) {
  mouse.d = nmouse.d;
  mouse.x = nmouse.x;
  mouse.y = nmouse.y;
  nextVol = 0;
  var aveVol = 0;
  var volSamples = 0;
  for (var i = 0; i < n; i++) {

    var cprof = refresh_contacts()
    for (var ti = 0; ti < STEP_RES; ti++) {
      bonds_update();
      contacts_update();
      aveVol += nextVol;
      volSamples += 1;
      /*if(i===0 && ti===0){
vol=nextVol;
    }*/

      for (var j = 0; j < ATOMS.length; j++) {
        ATOMS[j].applyForce();
      }
      for (var j = 0; j < THINGS.length; j++) {
        //THINGS[j].runGroup2();
      }

    }
    /*  for (var j = 0; j < THINGS.length; j++) {
          THINGS[j].runGroup2();
      }*/
    atoms_update();

    profile_counts.iterations++;
    profile_counts.bonds += BONDS.length;
    profile_counts.atoms += ATOMS.length;
    profile_counts.real_contacts += CONTACTS.length;
    profile_counts.contacts_total += cprof.t;
    profile_counts.contacts_y += cprof.x;
    profile_counts.contacts_y += cprof.y;
    profile_counts.contacts_deep += cprof.d;
  }
  for (var j = 0; j < ATOMS.length; j++) {
    var at = ATOMS[j];
    if (ATOMS[j].beingDragged) {
      ATOMS[j].p.x = mouse.x + ATOMS[j].dragDelta.x;
      ATOMS[j].p.y = mouse.y + ATOMS[j].dragDelta.y;
    }
    //ATOMS[j].applyForce();
  }

  oldMouse.d = mouse.d;
  oldMouse.x = mouse.x;
  oldMouse.y = mouse.y;
  //console.log(mouse);
  vol = aveVol / Math.max(1, volSamples);
}

bond_all = function(atoms) {
  for (var i = 0; i < atoms.length; i++) {
    for (var j = i + 1; j < atoms.length; j++) {
      var d = Math.sqrt(Math.pow(atoms[i].p.x - atoms[j].p.x, 2) + Math.pow(atoms[i].p.y - atoms[j].p.y, 2));
      BONDS.push(new bond(atoms[i], atoms[j], d));
    }
  }
}

bond_near = function(atoms, thresh, freeze) {
  for (var i = 0; i < atoms.length; i++) {
    var a = atoms[i];
    for (var j = i + 1; j < atoms.length; j++) {
      var b = atoms[j];
      var dx = a.p.x - b.p.x;
      var dy = a.p.y - b.p.y
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= thresh) {
        if (freeze) {
          BONDS.push(new bond(a, b, dist));
        } else {
          BONDS.push(new bond(a, b));
        }
      }
    }
  }
}

bond_nearest = function(atoms, n, freeze, Bdist) {
  for (var i = 0; i < atoms.length; i++) {
    var pts = [];
    var a = atoms[i];
    for (var j = 0; j < atoms.length; j++) {
      var b = atoms[j];
      if (a === b) {
        continue;
      }
      var dx = a.p.x - b.p.x;
      var dy = a.p.y - b.p.y
      var dist = Math.sqrt(dx * dx + dy * dy);
      pts.push([dist, b])
    }
    pts.sort(function(p, q) {
      return p[0] - q[0];
    });
    console.log("PTS:", pts)
    for (var k = 0; k < n; k++) {
      var b = pts[k][1];
      var already = false;
      for (var m = 0; m < BONDS.length; m++) {
        if ((BONDS[m].a === a && BONDS[m].b === b) || (BONDS[m].a === b && BONDS[m].b === a)) {
          already = true;
          break;
        }
      }
      if (!already) {
        if (freeze) {
          BONDS.push(new bond(a, b, pts[k][0]));
        } else {
          //if(Bdist==undefined||Bdist==null){

          //}
          BONDS.push(new bond(a, b, Bdist));
        }
      }
    }
  }
  console.log("NEAREST BONDS:", BONDS)
}

bond_triangulate = function(atoms, freeze) {
  var verts = [];
  for (var i = 0; i < atoms.length; i++) {
    verts.push([atoms[i].p.x, atoms[i].p.y])
  }
  var triangles = Delaunay.triangulate(verts);
  var bonded = {};
  for (var i = 0; i < triangles.length; i += 3) {
    var A = triangles[i];
    var B = triangles[i + 1];
    var C = triangles[i + 2];
    var edges = [
      [A, B],
      [B, C],
      [C, A]
    ];
    for (var j = 0; j < 3; j++) {
      var a = edges[j][0];
      var b = edges[j][1];
      if (a > b) {
        var aa = a;
        a = b;
        b = aa;
      }
      // console.log("  ab", a, b)
      var key = [a, b]
      if (bonded[key] === undefined) {
        bonded[key] = 1;
        if (freeze) {
          var dx = atoms[b].p.x - atoms[a].p.x;
          var dy = atoms[b].p.y - atoms[a].p.y;
          BONDS.push(new bond(atoms[a], atoms[b], Math.sqrt(dx * dx + dy * dy)));
        } else {
          BONDS.push(new bond(atoms[a], atoms[b]));
        }
      }
    }
  }
  // console.log(bonded)
}

collide_all = function(things) {
  for (var i = 0; i < things.length; i++) {
    for (var j = i + 1; j < things.length; j++) {
      COLLIDES.push([things[i], things[j]]);
    }
  }
}

rand32_A = 1664525;
rand32_C = 1013904223;
rand32_seed = 12345678;
rand32 = function(seed) {
  if (seed != null) rand32_seed = seed;
  rand32_seed = (rand32_seed * rand32_A + rand32_C) % 0xffffffff;
  return rand32_seed
}

randy = function() {
  return rand32() / 0x100000000;
}