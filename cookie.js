function setCookie(cname, cvalue) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = cname + "=" + cvalue +
     ";SameSite=None;secure;expires="+exp.toGMTString();
} 

function getCookie(cname) {
    var getCookie=document.cookie.replace(/[]/g, "");
    var arrCookie = getCookie.split(":");
    console.log(arrCookie);
    var tips;
    for(var i=0;i<arrCookie.length;i++){
        var arr = arrCookie[i].split("=");
        if(cname == arr[0]){
            tips = arr[1];
            break;
        }
    }
    return tips;
} 