function setVel(thing, vx, vy) {
  for (var i = 0; i < thing.atoms.length; i++) {
    thing.atoms[i].v.x = vx;
    thing.atoms[i].v.y = vy;
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
  BOND_P = 80;
  BOND_D = 1.0;
  CONTACT_P = 60;
  CONTACT_D = 25;
  CONTACT_R = 0.08;
  TICK_MAX = 10000000;
  display_init();

  // balls as single atoms — one contact point each, no spin possible
  var b1 = new atom(250, 620, 80, 55, 75, false, null, "rgba(200, 228, 255, 0.88)");
  b1.noFill = true;
  b1.mass = 180;
  ATOMS.push(b1);

  var b2 = new atom(750, 260, -65, -50, 58, false, null, "rgba(255, 255, 255, 0.82)");
  b2.noFill = true;
  b2.mass = 135;
  ATOMS.push(b2);

  var b3 = new atom(1060, 700, -70, 88, 68, false, null, "rgba(155, 205, 245, 0.88)");
  b3.noFill = true;
  b3.mass = 160;
  ATOMS.push(b3);

  // square — small atom radii to limit multi-contact pile-up
  var sq = new square("sq", 540, 440, 38, -55, 72, 12, false, null, "rgba(220, 238, 255, 0.80)");
  for (var i = 0; i < sq.atoms.length; i++) sq.atoms[i].radius = 3;

  // rectangle — same treatment
  var rect = makeRect("rect", 910, 215, 9, 4, 18, "rgba(175, 215, 250, 0.82)");
  for (var i = 0; i < rect.atoms.length; i++) rect.atoms[i].radius = 3;
  setVel(rect, -55, 70);

  display_clear();
  bonds_draw();
  atoms_draw();

  display_iterate(function() {
    display_clear();
    bonds_draw();
    atoms_draw();

    // soft boundary bounce
    for (var i = 0; i < ATOMS.length; i++) {
      var a = ATOMS[i];
      if (!a.locked && !a.beingDragged) {
        var m = a.radius + 4;
        if (a.p.x < m)           { a.v.x =  Math.abs(a.v.x) * 0.85; a.p.x = m; }
        if (a.p.x > WIDTH - m)   { a.v.x = -Math.abs(a.v.x) * 0.85; a.p.x = WIDTH - m; }
        if (a.p.y < m)           { a.v.y =  Math.abs(a.v.y) * 0.85; a.p.y = m; }
        if (a.p.y > HEIGHT - m)  { a.v.y = -Math.abs(a.v.y) * 0.85; a.p.y = HEIGHT - m; }
      }
    }

    update_all(TICK_SHOW / TICK_PHYS);
  }, function() {}, TICK_SHOW / REALTIME * 1000, TICK_MAX);
}
