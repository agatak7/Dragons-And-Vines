function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
function checkCookie() {
    var access=getCookie("access");
    if (access != "") {
      var num = parseInt(access, 10);
      num++;
      document.getElementById("visits").innerHTML='<h3>Times you have visited this page: '+num+'</h3>';
      document.cookie = "access="+num;
    } else {
       alert("Welcome for the first time!")
       document.cookie = "access=1";

    }
    document.getElementById("my_audio").play();
  }

if(screen.width<1366 || screen.height<768){
    alert("Your Screen size may be too small!");
}else if(window.fullScreen==false){
    alert("Please go to fullscreen mode for the optimal gameplay!");
}