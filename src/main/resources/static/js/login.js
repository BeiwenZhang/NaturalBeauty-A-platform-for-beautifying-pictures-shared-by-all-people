function onclick_method() {
    var name = document.getElementById("name").value;
    var pwd = document.getElementById("pwd").value;

    if (name == "" || pwd == "" ){
        alert("info incomplete");
        return;
    }

    var ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', "/checkout?name="+name+"&pwd="+pwd);
    ajaxObj.send();
    ajaxObj.onreadystatechange = function () {
        if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
            var res = ajaxObj.responseText;
            if (res == 1){
                alert("Login successful!")
                window.location.href="/select"
            }else {
                alert("Login unsuccessful! \ninvalid username or password ")
            }
        }
    }
}