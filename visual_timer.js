function calcHandPosDeg(cx, cy, r, degree) {
    var x = cx + r * Math.sin(degree / 180 * Math.PI);
    var y = cy - r * Math.cos(degree / 180 * Math.PI);
    return {x: x, y: y};
}
function calcHandPos(cx, cy, r, percent) {
    var x = cx + r * Math.sin(2 * Math.PI * (percent/100));
    var y = cy - r * Math.cos(2 * Math.PI * (percent/100));
    return {x: x, y: y};
}
function genDstring(cx, cy, r, percent){
  var xy = calcHandPos(cx, cy, r, percent);
  var dstring = "M"+cx+","+cy+" ";
  dstring += "L"+cx+","+ (cy-r) + " ";
  dstring += "A"+r+','+r+" 0 0,1 "+xy["x"]+","+xy["y"];
  dstring += "z"
  return dstring
}

console.log(genDstring(150, 150, 100, 40));

var d40 = genDstring(150, 150, 100, 25);
var myAnimation = anime({
  targets: ['#myd'],
  d: d40,
  easing: 'easeOutQuad',
  duration: 2000,
  loop: true
});