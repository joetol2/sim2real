/*
 * simple API to display, canvas implementation — transparent background version
 */

BOND_COLOR = "rgba(155, 205, 245, 0.40)";
ATOM_COLOR = "rgba(200, 228, 255, 0.88)";
ATOM_COLOR2 = "rgba(155, 195, 230, 0.88)";
CONTACT_COLOR = "rgba(180, 160, 240, 0.55)";

display_init = function() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
  WIDTH = g_canvas.width;
  HEIGHT = g_canvas.height;
}

display_circle = function(x, y, r, color, noFill) {
  g_context.beginPath();
  var strokeTh = Math.min(r, 1.5);
  g_context.lineWidth = strokeTh;
  g_context.arc(x, HEIGHT - 1 - y, r - strokeTh / 2, 0, Math.PI * 2);
  var c = color || ATOM_COLOR;
  g_context.strokeStyle = c;
  if (!noFill) {
    g_context.fillStyle = c;
    g_context.fill();
  }
  g_context.stroke();
  g_context.lineWidth = 1;
}

display_line = function(x, y, x2, y2, color, w) {
  if (!(w > 0)) w = 1;
  g_context.beginPath();
  var old = g_context.lineWidth;
  g_context.lineWidth = w;
  g_context.moveTo(x, HEIGHT - 1 - y);
  g_context.lineTo(x2, HEIGHT - 1 - y2);
  g_context.strokeStyle = color || BOND_COLOR;
  g_context.stroke();
  g_context.lineWidth = old;
}

display_clear = function() {
  g_context.clearRect(0, 0, WIDTH, HEIGHT);
}

display_iterate = function(cb, cb2, sec, max) {
  var ii = 0;
  var iv = setInterval(function() {
    if (ii++ >= max) {
      clearInterval(iv);
      cb2();
    } else {
      cb();
    }
  }, sec);
}
