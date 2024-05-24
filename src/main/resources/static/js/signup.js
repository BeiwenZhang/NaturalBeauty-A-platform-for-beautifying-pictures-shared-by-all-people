function onclick_method() {
    var name = document.getElementById("name").value;
    var pwd = document.getElementById("pwd").value;
    var pwd_ack = document.getElementById("pwd2").value;

    if (name == "" || pwd == "" || pwd_ack == "" ){
        alert("info incomplete");
        return;
    }

    if (pwd_ack != pwd){
        alert("password dont match")
    }

    var ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', "/register?name="+name+"&pwd="+pwd);
    ajaxObj.send();
    ajaxObj.onreadystatechange = function () {
        if (ajaxObj.readyState == 4 && ajaxObj.status == 200) {
            var res = ajaxObj.responseText;

            if (res == 1){
                alert("Register successful!")
                window.location.href="/login"

            }else if (res == -1){
                alert("Duplicate username \nTry different username")
            }else{
                alert("Register unsuccessful! \nTry again")
            }


        }
    }


}


