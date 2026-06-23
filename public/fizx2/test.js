function setVel(thing, vx, vy) {
  for (var i = 0; i < thing.atoms.length; i++) {
    thing.atoms[i].v.x = vx;
    thing.atoms[i].v.y = vy;
  }
}

function setColor(thing, color) {
  for (var i = 0; i < thing.atoms.length; i++) {
    thing.atoms[i].color = color;
  }
}

function setWireframe(thing) {
  for (var i = 0; i < thing.atoms.length; i++) {
    thing.atoms[i].noFill = true;
  }
}

function makeRect(name, x, y, cols, rows, res, color) {
  var atomArray = [];
  var t = new thing(name);
  for (var i = 0; i < cols; i++) {
    atomArray[i] = [];
    for (var j = 0; j < rows; j++) {
      var a = new atom(
        x + (i - cols / 2 + 0.5) * res,
        y + (j - rows / 2 + 0.5) * res,
        0, 0, res / 2, false, null, color
      );
      a.mass = res * res / 25;
      atomArray[i][j] = a;
      t.atoms.push(a);
      ATOMS.push(a);
    }
  }
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      if (i > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j], res));
      if (j > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i][j - 1], res));
      if (j > 0 && i > 0) BONDS.push(new bond(atomArray[i][j], atomArray[i - 1][j - 1], res * Math.SQRT2));
      if (j > 0 && i < cols - 1) BONDS.push(new bond(atomArray[i][j], atomArray[i + 1][j - 1], res * Math.SQRT2));
    }
  }
  THINGS.push(t);
  return t;
}

first_run = function() {
  DAMP = 1;
  BOND_P = 33;
  BOND_D = 0.5;
  CONTACT_P = 300;
  CONTACT_D = 8;
  CONTACT_R = 0.3;
  TICK_MAX = 10000000;
  display_init();

  // three circles
  var c1 = new circle("c1", 250, 600, 0, 0, 80, false, false);
  setColor(c1, "rgba(200, 228, 255, 0.88)");
  setWireframe(c1);
  setVel(c1, 100, 70);

  var c2 = new circle("c2", 750, 250, 0, 0, 60, false, false);
  setColor(c2, "rgba(255, 255, 255, 0.82)");
  setWireframe(c2);
  setVel(c2, -80, -60);

  var c3 = new circle("c3", 1060, 700, 0, 0, 70, false, false);
  setColor(c3, "rgba(155, 205, 245, 0.88)");
  setWireframe(c3);
  setVel(c3, -90, 105);

  // square
  var sq = new square("sq", 550, 450, 50, -80, 72, 12, false, null, "rgba(220, 238, 255, 0.80)");

  // rectangle (wider than tall)
  var rect = makeRect("rect", 920, 210, 9, 4, 18, "rgba(175, 215, 250, 0.82)");
  setVel(rect, -65, 85);

  collide_all([c1, c2, c3, sq, rect]);

  display_clear();
  bonds_draw();
  atoms_draw();

  display_iterate(function() {
    display_clear();
    bonds_draw();
    atoms_draw();

    // boundary bounce — push atoms back when they reach the edge
    for (var i = 0; i < ATOMS.length; i++) {
      var a = ATOMS[i];
      if (!a.locked && !a.beingDragged) {
        var m = a.radius + 4;
        if (a.p.x < m)         { a.v.x =  Math.abs(a.v.x) * 0.85; a.p.x = m; }
        if (a.p.x > WIDTH - m) { a.v.x = -Math.abs(a.v.x) * 0.85; a.p.x = WIDTH - m; }
        if (a.p.y < m)         { a.v.y =  Math.abs(a.v.y) * 0.85; a.p.y = m; }
        if (a.p.y > HEIGHT - m){ a.v.y = -Math.abs(a.v.y) * 0.85; a.p.y = HEIGHT - m; }
      }
    }

    update_all(TICK_SHOW / TICK_PHYS);
  }, function() {}, TICK_SHOW / REALTIME * 1000, TICK_MAX);
}
