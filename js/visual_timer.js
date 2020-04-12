function calcHandPosPercent(cx, cy, r, percent) {
  var x = cx + r * Math.sin(2 * Math.PI * (percent/100));
  var y = cy - r * Math.cos(2 * Math.PI * (percent/100));
  x = Math.round(x*100)/100;
  y = Math.round(y*100)/100;
  return {x: x, y: y};
}
function genDstring(cx, cy, r, percent){
  var xy = calcHandPosPercent(cx, cy, r, percent);
  var xy50 = calcHandPosPercent(cx, cy, r, 50);
  var dstring1 = "M"+cx+","+cy+" ";
  dstring1 += "L"+cx+","+ (cy-r) + " ";
  if (percent<=50){
    dstring1 += "A"+r+','+r+" 0 0,1 "+xy["x"]+","+xy["y"];
  }
  else{
    dstring1 += "A"+r+','+r+" 0 0,1 "+xy50["x"]+","+xy50["y"];
  }
  dstring1 += "z";

  var dstring2 = "M"+cx+","+cy+" ";
  dstring2 += "L"+cx+","+ (cy+r) + " ";
  if (percent<50){
    dstring2 += "A"+r+','+r+" 0 0,1 "+xy50["x"]+","+xy50["y"];
  }
  else{
    dstring2 += "A"+r+','+r+" 0 0,1 "+xy["x"]+","+xy["y"];
  }
  dstring2 += "z";

  return [dstring1, dstring2]
}
function genDarray(cx, cy, r){
  var rightvalues=[];
  var leftvalues=[];

  for(var i=100; i>=50; i--){
    var vals = genDstring(cx, cy, r, i);
    leftvalues.push(vals[1]);
  }
  for(var i=50; i>=0; i--){
    var vals = genDstring(cx, cy, r, i);
    rightvalues.push(vals[0]);
  }
  return [rightvalues, leftvalues]
}
function minutes2percent(minutes){
  // take minutes value and return percentage where
  // 0-60 minutes are mapped to 0-100%
  if (minutes != 60){
    minutes = minutes % 60;
  }
  var percent = (minutes / 60) * 100;
  return Math.round(percent)
}
function runTimeAnimation(newText){
  var fadeouttime = 1200;
  setTimeout(function(){
    $('#timeleft').text(newText);
  }, fadeouttime);

  var tani = anime.timeline({
    loop: false
  })
  .add({ // fade out
    targets: ['#timeleft'],
    translateY: [0, -100], // slide out
    opacity: [1, 0], // fade out
    easing: "easeInExpo",
    duration: fadeouttime,
  })
  .add({ // fade in
    targets: ['#timeleft'],
    translateY: [100, 0], // slide in
    opacity: [0, 1], // fade in
    easing: "easeOutExpo",
    duration: 1400,
  })
}
function sec2text(sec){
  //console.log("sec: " + sec);
  var minute = Math.floor(sec / 60);
  var secRemaining = sec % 60;

  var secSecond = Math.floor(secRemaining / 10);
  var secFirst = secRemaining % 10;
  var minuteSecond = Math.floor(minute/10);
  var minuteFirst = minute % 10;

  var timestring = ""+minuteSecond+minuteFirst+":"+secSecond+secFirst;
  //console.log(timestring);
  return timestring
}
function judgeTimer(){
  secRemaining = secRemaining - sec_step;
  if (secRemaining<0){
    resetTimer();
  }
  else{
    var timestring = sec2text(secRemaining);
    runTimeAnimation(timestring);
  }
}
function resetTimer(){
  tl.pause();
  $('#play').text("Start");
  $('#timeleft').removeClass('running')
  clearInterval(tensecInterval);
  var percent = minutes2percent($('#timeinput').val());
  var dstring = genDstring(cx, cy, r, percent);
  $('#rightpath').attr('d', dstring[0]).removeClass('running');
  $('#leftpath').attr('d', dstring[1]).removeClass('running');
  $('#timeleft').text(sec2text($('#timeinput').val()*60));
}

var cx = 115;
var cy = 115;
var r = 100;
var secRemaining;
var sec_step = 10;
var tensecInterval;
var tl = anime.timeline();

$(document).ready(function(){
  resetTimer();
  $('#play').click(function(){
    var dstring100 = genDstring(cx, cy, r, 100);
    $('#leftpath').attr('d', dstring100[1]).addClass('running');
    $('#rightpath').attr('d', dstring100[0]).addClass('running');
    $('#timeleft').addClass('running')
    var minutes = parseInt($('#timeinput').val());
    secRemaining = minutes * 60;
    judgeTimer(); // run once first
    tensecInterval = setInterval(judgeTimer, sec_step*1000); // run every sec step
    var darray = genDarray(cx, cy, r);
    tl.pause();
    tl.seek(0);
    tl = anime.timeline({
      easing: 'linear',
      autoplay: false,
      loop: false
    });
    tl.add({
      targets: ['#leftpath'],
      d: darray[1],
      duration: (minutes * 60 * 1000) / 2
    })
    .add({
      targets: ['#rightpath'],
      d: darray[0],
      duration: (minutes * 60 * 1000) / 2
    }, '-=100');
    tl.play();
    $('#play').text("Running");
  });
  $('#timeinput').on("input", function(){
    resetTimer();
  });
});