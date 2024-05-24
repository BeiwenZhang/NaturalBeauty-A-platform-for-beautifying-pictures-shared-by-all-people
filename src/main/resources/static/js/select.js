var ajaxObj = new XMLHttpRequest();
ajaxObj.open('get', "/testBeautifyImages");
ajaxObj.send();
ajaxObj.onreadystatechange = function () {
    if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
        var res = ajaxObj.responseText;
        if (res == 1){
            var BeautifyImages_button = document.getElementById("BeautifyImages_button")
            BeautifyImages_button.setAttribute("disabled", true);//设置不可点击
            BeautifyImages_button.style.backgroundColor  = '#555555';//设置背景色
        }else {
            var BeautifyImages_button = document.getElementById("BeautifyImages_button")
            // BeautifyImages_button.style.backgroundColor  = '#333';//设置背景色

        }
    }
}

function BeautifyImages_button_onclick(){
    window.location.href="/room?BeautifyImages=true"
}
function Observe_button_onclick(){
    window.location.href="/room?BeautifyImages=false"
}
function center_button_onclick(){
    window.location.href = "/center";
}
// function share_button_onclick(){
//     window.location.href = "/center";
// }

