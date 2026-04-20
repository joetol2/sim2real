test = function() {
  display_init();
  rand32(123563);
  for (var i = 0; i < 36; i++) {
    ATOMS.push(new atom(randy() * WIDTH, randy() * HEIGHT));
  }
  bond_all(ATOMS);
  display_clear();
  bonds_draw();
  atoms_draw();
  var ii = 0;
  var intv = setInterval(function() {
    display_clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW / TICK_PHYS);
    ii++;
    if (ii == 150) {
      DAMP = 1;
      BOND_P = 200;
      BOND_D = .21;
      BONDS = [];
      bond_triangulate(ATOMS, true);
    }
    if (ii == 200) {
      ATOMS[0].v.x = -21500;
      ATOMS[11].v.x = 9500;
    }
    if (ii >= TICK_MAX) {
      clearInterval(intv);
    }
  }, TICK_SHOW / REALTIME * 1000);
}

test2 = function() {
  DAMP = 1
  BOND_P = 1
  BOND_D = .2
  RADIUS = 150
  TICK_PHYS = 1
  TICK_SHOW = 1
  REALTIME = 20
  ATOMS = []
  BONDS = [];
  ATOMS.push(new atom(188.5045597249305, 99.36340591910486, -10, 0));
  ATOMS.push(new atom(110.85884619417598, 389.1411538058254, 10, 0));
  ATOMS.push(new atom(400.6365940808962, 311.49544027506806));
  bond_all(ATOMS);
  display_clear();
  bonds_draw();
  atoms_draw();
  var ii = 0;
  var intv = setInterval(function() {
    display_clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW / TICK_PHYS);
    ii++;
    if (ii >= TICK_MAX) {
      clearInterval(intv);
    }
  }, TICK_SHOW / REALTIME * 1000);
}

function asx(url, cb) {
  var xr = new XMLHttpRequest();
  xr.addEventListener("load", cb);
  xr.open("GET", url);
  xr.send();
}

var testCircle;
var testCircle2;
var specialAtom;
var newtonsCradle = [];
first_run = function() {
  DAMP = 1;
  BOND_P = 33
  BOND_D = 0.5
  TICK_MAX = 1000000;
  display_init();
  var floor = new thing("floor");
  floor.setLayer("FLOOR");
  for (i = -160; i < 0; i += Math.PI / 1) {
    var at = new atom(200 + Math.cos(i / 100 * Math.PI) * 200, 400 + Math.sin(i / 100 * Math.PI) * 200, 0, 0, 9, true, null, "blue");
    floor.add(at);
    ATOMS.push(at);
  }
  for (i = 0; i < 26 + 45; i++) {
    var at = new atom(0 + i * 20, 30, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i = 0; i < 36; i++) {
    var at = new atom(1300, 50 + i * 20, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i = 0; i < 36; i++) {
    var at = new atom(0, 50 + i * 20, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }

  var curtain = new thing("curtain");
  curtain.setLayer("CURTAIN");
  LAYER_FILTERS.push(["CURTAIN", "CURTAIN"]);
  LAYER_FILTERS.push(["FLOOR", "CURTAIN"]);
  LAYER_FILTERS.push(["FLOOR", "DEFAULT"]);
  LAYER_FILTERS.push(["CURTAIN", "DEFAULT"]);

  var testSquare = new square("square", 760, 450, 0, 0, 40, 10, null, null, "pink");
  var testCircle = new circle("circle", 1020, 750, 0, 0, 30, false, true);

  var firstCon;
  var prevCon;
  for (i = 0; i < 200; i += 4) {
    var at = new atom(1020 + Math.cos(i / 100 * Math.PI) * 100, 730 + Math.sin(i / 100 * Math.PI) * 100, 0, 0, 2, false, null, "red");
    if (i === 0) {
      firstCon = at;
    }
    if (i > 0) {
      var distA = Math.sqrt(Math.pow(at.p.x - prevCon.p.x, 2) + Math.pow(at.p.y - prevCon.p.y, 2));
      BONDS.push(new bond(at, prevCon, distA));
    }
    if (i == 200 - 4) {
      var distA = Math.sqrt(Math.pow(at.p.x - firstCon.p.x, 2) + Math.pow(at.p.y - firstCon.p.y, 2));
      BONDS.push(new bond(at, firstCon, distA));
    }
    prevCon = at;
    curtain.add(at);
    ATOMS.push(at);
  }

  for (var i = 0; i < 5; i++) {
    var atp = new atom(500 + i * 40, 800, 0, 0, 10, true);
    ATOMS.push(atp);
    var atb = new atom(500 + i * 40, 700, 0, 0, 20, false, null, "cyan");
    atb.mass = 100;
    newtonsCradle[i] = atb;
    ATOMS.push(atb);
    BONDS.push(new bond(atp, atb, 100));
  }
  if (true) {
    var extraRatio = 1;
    var atp = new atom(500 - 20 * (1 + extraRatio), 800, 0, 0, 10, true);
    ATOMS.push(atp);
    var atb = new atom(500 - 100 / 5 * 5 - 20 * (1 + extraRatio), 800 - 100 / 5 * 0, 0, 0, 20 * (extraRatio), false);
    atb.mass = 100 * extraRatio * (extraRatio);
    newtonsCradle[newtonsCradle.length] = atb;
    ATOMS.push(atb);
    BONDS.push(new bond(atp, atb, 100));
  }

  var small = new thing("x");
  var at = new atom(560, 350, 0, 0, 10, null, null, "green");
  small.add(at);
  ATOMS.push(at);
  var at2 = new atom(500, 350, 0, 0, 10, null, null, "green");
  small.add(at2);
  ATOMS.push(at2);
  var at3 = new atom(520, 390, -100, 0, 10, null, null, "green");
  small.add(at3);
  ATOMS.push(at3);
  bond_nearest([at, at2, at3], 2, true);

  var ball1 = new thing("ball1", 350, 500, 0, 0, ball16, null, null, "orange");
  bond_triangulate(ball1.atoms, true);
  var ball2 = new thing("ball2", 600, 250, 0, 0, ball16, null, null, "indigo");
  bond_triangulate(ball2.atoms, true);
  for (var i = 0; i < ball2.atoms.length; i++) {
    ball2.atoms[i].mass = 1;
  }
  var ball3 = new thing("ball3", 800, 250, 0, 0, ball16, null, null, "purple");
  bond_triangulate(ball3.atoms, true);
  for (var i = 0; i < ball3.atoms.length; i++) {
    ball3.atoms[i].mass = 1;
  }
  collide_all([floor, ball1, ball2, curtain]);
  display_clear();
  bonds_draw();
  atoms_draw();
  T = (new Date).getTime();
  update_all(TICK_SHOW / TICK_PHYS);
  display_iterate(function() {
      display_clear();
      contacts_draw();
      bonds_draw();
      atoms_draw();
      var middleAtom = testCircle.atoms[0];
      for (var i = 1; i < testCircle.atoms.length; i++) {
        var targetAtom = testCircle.atoms[i];
        targetAtom.v.x = (targetAtom.p.y - middleAtom.p.y) * -15;
        targetAtom.v.y = (targetAtom.p.x - middleAtom.p.x) * 15;
      }
      update_all(TICK_SHOW / TICK_PHYS);
    },
    function() {
      console.log("DONE -- ms timing:", (new Date).getTime() - T);
    },
    TICK_SHOW / REALTIME * 1000, TICK_MAX);
}
