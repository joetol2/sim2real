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
REALTIME = 1;
TICK_MAX = 1000000;

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
STEP_RES = 11
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
  display_circle(this.p.x, this.p.y, this.radius, this.color);
};
atom.prototype.applyForce = function() {
  var vDist = Math.sqrt(Math.pow(this.v.x, 2) + Math.pow(this.v.y, 2));
  if (vDist > MAX_SPEED) {
    this.v.y = this.v.y / vDist * MAX_SPEED;
    this.v.x = this.v.x / vDist * MAX_SPEED;
  }
  if (!this.locked && !this.beingDragged) {
    this.v.x += this.f.x / STEP_RES;
    this.v.y += this.f.y / STEP_RES;
    this.nv.x += this.nf.x / STEP_RES;
    this.nv.y += this.nf.y / STEP_RES;
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
  if (mouse.d && (!oldMouse.d)) {
    if (Math.pow(Math.pow((mouse.x - this.p.x), 2) + Math.pow((mouse.y - this.p.y), 2), 0.5) <= this.radius) {
      this.beingDragged = true;
      this.locked = true;
      this.dragDelta = {
        x: this.p.x - mouse.x,
        y: this.p.y - mouse.y
      };
    }
  }
  if (!mouse.d) {
    this.locked = this.lockedBeforeDrag;
    this.beingDragged = false;
  }
};

bond = function(atom1, atom2, dist) {
  if (dist == undefined) dist = RADIUS * 2;
  this.a = atom1;
  this.b = atom2;
  this.d = dist;
}

thing = function(name, x, y, vx, vy, obj, locked, layer, color) {
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
      var a = new atom(x + (i - r / 2) * scale, y + (j - r / 2) * scale, vx, vy, scale / 2, locked, null, color);
      a.mass = 1 / 25 * scale * scale;
      atomArray[i][j] = a;
      this.atoms.push(a);
      ATOMS.push(a);
    }
  }
  for (var j = 0; j < r; j++) {
    for (var i = 0; i < r; i++) {
      if (i > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j], scale));
      if (j > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i][j - 1], scale));
      if (j > 0 && i > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j - 1], scale * Math.sqrt(2)));
      if (j > 0 && i < atomArray.length - 1) BONDS.push(new bond(atomArray[i][j], atomArray[i + 1][j - 1], scale * Math.sqrt(2)));
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
    BONDS.push(new bond(a, c, r));
    if (i > 0) {
      var distA = Math.sqrt(Math.pow(a.p.x - atomArray[i - 1].p.x, 2) + Math.pow(a.p.y - atomArray[i - 1].p.y, 2));
      BONDS.push(new bond(a, atomArray[i - 1], distA));
    }
    if (i == atomCount - 1) {
      var distA = Math.sqrt(Math.pow(a.p.x - atomArray[0].p.x, 2) + Math.pow(a.p.y - atomArray[0].p.y, 2));
      BONDS.push(new bond(atomArray[0], atomArray[atomArray.length - 1], distA));
    }
    ATOMS.push(a);
  }
  return this;
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
                  if (CONTACTS.indexOf(bi + "," + ai) < 0) CONTACTS.push(bi + "," + ai);
                } else {
                  if (CONTACTS.indexOf(ai + "," + bi) < 0) CONTACTS.push(ai + "," + bi);
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
  return { x: xchk, y: ychk, d: dchk, t: tot }
}

var momentum_swap = function(a, b, P, D, RESTITUTION, target, for_sound) {
  var dx = b.p.x - a.p.x;
  var dy = b.p.y - a.p.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  var udx = dx / dist;
  var udy = dy / dist;
  var dif = dist - target;
  var magicMult = a.mass * b.mass / (b.mass + a.mass);
  if (a.locked || a.mass === 0) magicMult = b.mass;
  if (b.locked || b.mass === 0) magicMult = a.mass;
  var vacomp = componentAlong(a.v, { x: udx, y: udy });
  var vbcomp = componentAlong(b.v, { x: udx, y: udy });
  var vmcomp = (vbcomp - vacomp) * (1 + RESTITUTION);
  var pterm = (dif) * P;
  var dterm = vmcomp * D;
  if (!b.locked) {
    b.f.x -= (pterm + dterm) * udx * magicMult / b.mass;
    b.f.y -= (pterm + dterm) * udy * magicMult / b.mass;
  }
  if (!a.locked) {
    a.f.x += (pterm + dterm) * udx * magicMult / a.mass;
    a.f.y += (pterm + dterm) * udy * magicMult / a.mass;
  }
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
  }
}

contacts_draw = function() {
  for (var i = 0; i < CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    display_line(a.p.x, a.p.y, b.p.x, b.p.y, CONTACT_COLOR);
  }
}

profile_counts = {
  bonds: 0, atoms: 0, contacts_total: 0,
  contacts_x: 0, contacts_y: 0, contacts_deep: 0,
  real_contacts: 0, iterations: 0
}
update_all = function(n) {
  mouse.d = nmouse.d;
  mouse.x = nmouse.x;
  mouse.y = nmouse.y;
  nextVol = 0;
  for (var i = 0; i < n; i++) {
    var cprof = refresh_contacts()
    for (var ti = 0; ti < STEP_RES; ti++) {
      bonds_update();
      contacts_update();
      for (var j = 0; j < ATOMS.length; j++) ATOMS[j].applyForce();
    }
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
    if (ATOMS[j].beingDragged) {
      ATOMS[j].p.x = mouse.x + ATOMS[j].dragDelta.x;
      ATOMS[j].p.y = mouse.y + ATOMS[j].dragDelta.y;
    }
  }
  oldMouse.d = mouse.d;
  oldMouse.x = mouse.x;
  oldMouse.y = mouse.y;
}

bond_all = function(atoms) {
  for (var i = 0; i < atoms.length; i++) {
    for (var j = i + 1; j < atoms.length; j++) {
      var d = Math.sqrt(Math.pow(atoms[i].p.x - atoms[j].p.x, 2) + Math.pow(atoms[i].p.y - atoms[j].p.y, 2));
      BONDS.push(new bond(atoms[i], atoms[j], d));
    }
  }
}

bond_nearest = function(atoms, n, freeze, Bdist) {
  for (var i = 0; i < atoms.length; i++) {
    var pts = [];
    var a = atoms[i];
    for (var j = 0; j < atoms.length; j++) {
      var b = atoms[j];
      if (a === b) continue;
      var dx = a.p.x - b.p.x;
      var dy = a.p.y - b.p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      pts.push([dist, b]);
    }
    pts.sort(function(p, q) { return p[0] - q[0]; });
    for (var k = 0; k < n; k++) {
      var b = pts[k][1];
      var already = false;
      for (var m = 0; m < BONDS.length; m++) {
        if ((BONDS[m].a === a && BONDS[m].b === b) || (BONDS[m].a === b && BONDS[m].b === a)) {
          already = true; break;
        }
      }
      if (!already) {
        if (freeze) BONDS.push(new bond(a, b, pts[k][0]));
        else BONDS.push(new bond(a, b, Bdist));
      }
    }
  }
}

bond_triangulate = function(atoms, freeze) {
  var verts = [];
  for (var i = 0; i < atoms.length; i++) verts.push([atoms[i].p.x, atoms[i].p.y]);
  var triangles = Delaunay.triangulate(verts);
  var bonded = {};
  for (var i = 0; i < triangles.length; i += 3) {
    var A = triangles[i];
    var B = triangles[i + 1];
    var C = triangles[i + 2];
    var edges = [[A, B], [B, C], [C, A]];
    for (var j = 0; j < 3; j++) {
      var a = edges[j][0];
      var b = edges[j][1];
      if (a > b) { var aa = a; a = b; b = aa; }
      var key = [a, b];
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
  return rand32_seed;
}

randy = function() {
  return rand32() / 0x100000000;
}
