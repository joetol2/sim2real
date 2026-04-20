test = function() {
  display_init();
  rand32(123563);
  for (var i = 0; i < 36; i++) {
    // new atom(Math.random() * WIDTH, Math.random() * HEIGHT);
    ATOMS.push(new atom(randy() * WIDTH, randy() * HEIGHT));
  }
  // ATOMS.push(new atom(200, 200));
  // ATOMS.push(new atom(200, 300));
  // ATOMS.push(new atom(300, 300));
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
      console.log("HIT ME")
      DAMP = 1 //0.998
      BOND_P = 200;
      BOND_D = .21;
      // ATOMS[0].v.x = -2000;
      BONDS = [];
      bond_triangulate(ATOMS, true)
      // bond_nearest(ATOMS, 5, true)
      console.log("stable tri:", ATOMS[0].p, ATOMS[1].p, ATOMS[2].p)
    }
    if (ii == 200) {
      console.log("HIT ME AGIN bonds:", BONDS.length);
      ATOMS[0].v.x = -21500;
      ATOMS[11].v.x = 9500;
    }
    if (ii >= TICK_MAX) {
      clearInterval(intv)
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
  // ATOMS.push(new atom(200, 100, 0, 10));
  // ATOMS.push(new atom(200, 400, 0, -10));
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
      clearInterval(intv)
    }
  }, TICK_SHOW / REALTIME * 1000);
}

function asx(url, cb) {
  var xr = new XMLHttpRequest();
  xr.addEventListener("load", cb);
  xr.open("GET", url);
  xr.send();
  // console.log("asx:", xr.readyState)
}

var testCircle;
var testCircle2;
var specialAtom;
var newtonsCradle = [];
first_run = function() {
  DAMP = 1; //0.999//-TICK_PHYS/10
  BOND_P = 33
  BOND_D = 0.5
  TICK_MAX = 1000000;
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var floor = new thing("floor");
  floor.setLayer("FLOOR");
  /*for (i=0; i<50; i+=4) {
    var at = new atom(430+Math.cos(i/100*Math.PI)*200, 520+Math.sin(i/100*Math.PI)*200, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i=-100; i<-50; i+=2) {
    var at = new atom(360+Math.cos(i/100*Math.PI)*300, 900+Math.sin(i/100*Math.PI)*300, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  */
  /*for (i=-100; i<0; i+=4) {
    var at = new atom(660+Math.cos(i/100*Math.PI)*150, 400+Math.sin(i/100*Math.PI)*150, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
}*/
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
  var at = new atom(725, 221, 0, 0, 10, true);
  //floor.add(at);
  //ATOMS.push(at);

  var curtain = new thing("curtain");
  curtain.setLayer("CURTAIN");
  LAYER_FILTERS.push(["CURTAIN", "CURTAIN"]);
  LAYER_FILTERS.push(["FLOOR", "CURTAIN"]);
  LAYER_FILTERS.push(["FLOOR", "DEFAULT"]);
  LAYER_FILTERS.push(["CURTAIN", "DEFAULT"]);

  var testSquare = new square("square", 760, 450, 0, 0, 40, 10, null, null, "pink");
  //  var testSquare2 = new square("square2", 100, 450, 0, 0, 100,50);
  //  var testSquare3 = new square("square3", 250, 450, 0, 0, 50,10);
  //  var testTri = new triangle("triangle", 600, 450, 0, 0, 40,2,true);
  var testCircle = new circle("circle", 1020, 750, 0, 0, 30, false, true);
  //   testCircle.atoms[0].locked=true;



  //testCircle2 = new circle("circle2", 1020, 680, 0, 0, 30,false);
  //var testBall = new circle("ball", 500, 750, 0, 0, 30,false);

  //bond_all(testCircle.atoms,true);
  //bond_triangulate(testCircle.atoms, true);
  //bond_nearest(testSquare.atoms,2,true);
  /* for (i=-100; i<2; i+=2) {
     //var at = new atom(420+i*16, 400+i*12, 0, 0, 8, i==0||i==19);
     var at = new atom(650+Math.cos(i/100*Math.PI)*160, 400+Math.sin(i/100*Math.PI)*230, 0, 0, 5, i==-100||i==0);

     curtain.add(at);
     ATOMS.push(at);
   }
    bond_nearest(curtain.atoms,2,true);*/
  var firstCon;
  var prevCon;
  for (i = 0; i < 200; i += 4) {
    //var at = new atom(420+i*16, 400+i*12, 0, 0, 8, i==0||i==19);
    var at = new atom(1020 + Math.cos(i / 100 * Math.PI) * 100, 730 + Math.sin(i / 100 * Math.PI) * 100, 0, 0, 2, false, null, "red");
    if (i === 0) {
      firstCon = at;
    }
    if (i > 0) {
      var distA = Math.sqrt(Math.pow(at.p.x - prevCon.p.x, 2) + Math.pow(at.p.y - prevCon.p.y, 2));
      //console.log(distA);
      BONDS.push(new bond(at, prevCon, distA));
    }
    if (i == 200 - 4) {
      var distA = Math.sqrt(Math.pow(at.p.x - firstCon.p.x, 2) + Math.pow(at.p.y - firstCon.p.y, 2));
      //console.log(distA);
      BONDS.push(new bond(at, firstCon, distA));
    }
    prevCon = at;
    // at.mass=0.1;
    curtain.add(at);
    ATOMS.push(at);
  }

  // var atw = new atom(1020, 550, 0, 0, 40, false);
  //atw.mass=100000;
  //ATOMS.push(atw);
  /*var atws = new atom(1020, 588, 0, 0, 40, true);
  atws.mass=100;
  ATOMS.push(atws);

  var atws = new atom(1100, 588, 0, 0, 40, true);
  atws.mass=100;
  ATOMS.push(atws);*/
  for (var i = 0; i < 5; i++) {
    var atp = new atom(500 + i * 40, 800, 0, 0, 10, true);

    ATOMS.push(atp);

    var atb = new atom(500 + i * 40, 700, 0, 0, 20, false, null, "cyan");
    atb.mass = 100;
    if (i < 0) {
      atb = new atom(500 - 100 / 5 * 5 + i * 40 - 2, 800 - 100 / 5 * 0, 0, 0, 20, false);
      atb.mass = 100;
    }
    newtonsCradle[i] = atb;
    /*if(i===1){
        atb = new atom(560+i*40+100/5*5, 800-100/5*0, 0, -100, 20, false);
        atb.mass=1;
    }*/

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
    /*if(i===1){
        atb = new atom(560+i*40+100/5*5, 800-100/5*0, 0, -100, 20, false);
        atb.mass=1;
    }*/

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
  collide_all([floor, ball1, ball2, curtain]); //, ball2, small, curtain]);
  console.log(BONDS.length, "bonds")
  display_clear();
  bonds_draw();
  atoms_draw();
  console.log("START");
  T = (new Date).getTime();
  update_all(TICK_SHOW / TICK_PHYS);
  //window.setTimeout(function(){for(var i=1;i<testCircle.atoms.length;i++){testCircle.atoms[i].locked=false}},1000)
  display_iterate(function() {
      // console.log("draw", ii);
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

      /*var middleAtom2=testCircle2.atoms[0];
      for(var i=1;i<testCircle2.atoms.length;i++){
          var targetAtom=testCircle2.atoms[i];
      targetAtom.v.x=(targetAtom.p.y-middleAtom2.p.y)*-15;
      targetAtom.v.y=(targetAtom.p.x-middleAtom2.p.x)*15;
      }*/
      update_all(TICK_SHOW / TICK_PHYS);
    },
    function() {
      console.log("DONE -- ms timing:", (new Date).getTime() - T);
    },
    TICK_SHOW / REALTIME * 1000, TICK_MAX);
}

sound = function() {
  BOND_D = 0.05
  CONTACT_P = 2000
  CONTACT_D = 0
  TICK_PHYS = 0.00005
  REALTIME = 1000;
  TICK_SHOW = TICK_PHYS
  TICK_MAX = 22000;
  display_init();
  // var a=new atom(100,110,0,0,50)
  // var b=new atom(100,200,0,0,50)
  // var c=new atom(200,200,0,0,50)
  // ATOMS.push(a);
  // ATOMS.push(b);
  // ATOMS.push(c);
  // BONDS.push(new bond(a, b, 110))
  // BONDS.push(new bond(b, c, 130))
  // BONDS.push(new bond(a, c, 160))
  var floor = new thing("floor");
  for (i = 0; i < 100; i++) {
    var at = new atom(25 + i * 10, 221, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  var ball1 = new thing("ball2", 100, 552, 10000, 0, ball23);
  bond_triangulate(ball1.atoms, true);
  var ball2 = new thing("ball2", 1100, 500, -10000, 0, ball23);
  bond_triangulate(ball2.atoms, true);
  collide_all([ball1, ball2, floor]);
  ii = 0;
  console.log("START");
  var a = ball1.atoms[4];
  var b = ball1.atoms[5];
  var intv = setInterval(function() {
    // console.log("draw", ii);
    var dx = b.p.x - a.p.x;
    var dy = b.p.y - a.p.y;
    var d = Math.sqrt(dx * dx + dy * dy)
    d -= 50;
    console.log(d);
    display_clear();
    contacts_draw();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW / TICK_PHYS);
    ii++;
    if (ii >= TICK_MAX) {
      clearInterval(intv);
      console.log("DONE");
    }
  }, TICK_SHOW / REALTIME * 1000);
}

test_profile = function() {
  DAMP = 1
  BOND_P = 33
  BOND_D = .5
  GRAVITY = 0
  TICK_MAX = 100;
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var ob1 = new thing("1");
  for (i = 0; i < 10; i++) {
    var at = new atom(100 + i * 20, 400, 0, 0, 10);
    ob1.add(at);
    ATOMS.push(at);
  }

  var ob2 = new thing();
  for (i = 0; i < 10; i++) {
    var at = new atom(100 + i * 20, 500, 0, 0, 10);
    ob2.add(at);
    ATOMS.push(at);
  }

  collide_all([ob1, ob2]);
  console.log(BONDS.length, "bonds")
  var ret = refresh_contacts()
  console.log("CONTACTS:", ret)
  display_clear();
  bonds_draw();
  atoms_draw();
  console.log("START");
  T = (new Date).getTime();

  display_iterate(function() {
      // console.log("draw", ii);
      display_clear();
      contacts_draw();
      bonds_draw();
      atoms_draw();
      update_all(TICK_SHOW / TICK_PHYS);
      console.log(profile_counts);
    },
    function() {
      console.log("DONE -- ms timing:", (new Date).getTime() - T);
    },
    TICK_SHOW / REALTIME * 1000, TICK_MAX);
}
