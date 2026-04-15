/*
 * simple API to display, canvas implementation
 */

BOND_COLOR = "#a0c8e8";
ATOM_COLOR = "#c8e8ff";
ATOM_COLOR2 = "#90c4e4";
CONTACT_COLOR = "#b8a0f0";

display_init = function() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
  WIDTH = g_canvas.width;
  HEIGHT = g_canvas.height;
}

display_circle = function(x, y, r, color) {
  g_context.beginPath();
  var strokeTh=Math.min(r,2);
  g_context.lineWidth=strokeTh;
  g_context.arc(x, HEIGHT-1-y, r-strokeTh/2, 0, Math.PI*2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.fillStyle = g_context.strokeStyle;
  g_context.stroke();
  g_context.lineWidth=1;
}

display_line = function(x, y, x2, y2, color,w) {
    if(!(w>0)){
        w=1;
    }
  g_context.beginPath();
  var old=g_context.lineWidth;
  g_context.lineWidth=w;
  g_context.moveTo(x, HEIGHT-1-y);
  g_context.lineTo(x2, HEIGHT-1-y2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
  g_context.lineWidth=old;
}

display_clear = function() {
  // Vertical gradient: near-black at top (deep space/distance),
  // lightening toward the bottom (foreground/surface) for a 3D depth effect
  var grad = g_context.createLinearGradient(0, 0, 0, HEIGHT);
  grad.addColorStop(0,    "#010e20"); // top — very dark, deep space
  grad.addColorStop(0.45, "#013575"); // mid — site's dark blue
  grad.addColorStop(1,    "#1f7bc8"); // bottom — lighter blue, foreground
  g_context.fillStyle = grad;
  g_context.fillRect(0, 0, WIDTH, HEIGHT);
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
  }, sec)
}
