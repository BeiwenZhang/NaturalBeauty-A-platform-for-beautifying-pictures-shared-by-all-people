// 登录后获取用户的 profile 数据
document.addEventListener("DOMContentLoaded", function () {






    // 使用 fetch 发送 GET 请求获取用户的 profile 数据
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(userProfile => {
            // 在此处处理获取到的用户 profile 数据
            console.log('用户 profile 数据:', userProfile);
            // populateForm(userProfile); // 调用 populateForm 函数填充表单
        })
        .catch(error => console.error('获取用户 profile 时出错:', error));

    // 表单提交时调用的函数
    function submitForm(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        // 使用 fetch 发送 POST 请求更新用户的 profile 数据
        fetch('/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // 在此处处理从服务器返回的数据
            })
            .catch(error => {
                console.error('更新用户 profile 时出错:', error);
            });
    }

    // 将用户的 profile 数据填充到表单中
    function populateForm(userProfile) {
        document.getElementById("name").value = userProfile.name || '尚未填写';
        document.getElementById("MBTI").value = userProfile.MBTI || '';
        document.getElementById("constellation").value = userProfile.constellation || '';
        document.getElementById("gender").value = userProfile.gender || '';
        document.getElementById("isVip").value = userProfile.isVip ? "是" : "否";
        document.getElementById("id").value = userProfile.id ? "是" : "否";
        document.getElementById("pwd").value = userProfile.pwd ? "是" : "否";
    }

    // 给表单添加提交事件监听器
    const profileForm = document.getElementById("profileForm");
    profileForm.addEventListener("submit", submitForm);
});
document.addEventListener("DOMContentLoaded", function () {

});


function showGenderOptions() {
        const genderOptions = ["男", "女"]; // Updated gender options based on your HTML
        const selectedGender = document.getElementById("gender").value;
        const selectedOption = window.prompt("请选择性别:", selectedGender);

        if (selectedOption && genderOptions.includes(selectedOption)) {
            document.getElementById("gender").value = selectedOption;
        }
    }

// Function to toggle VIP status
    function toggleVip() {
        const currentisVip = document.getElementById("isVip").value === "是";
        document.getElementById("isVip").value = currentisVip ? "否" : "是";
    }

// Function to enable form editing
    function editProfile() {
        const form = document.getElementById("profileForm");
        const inputs = form.getElementsByTagName("input");
        const selects = form.getElementsByTagName("select");

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].removeAttribute("readonly");
        }

        for (let i = 0; i < selects.length; i++) {
            selects[i].removeAttribute("readonly");
        }

        form.querySelector('button[type="submit"]').style.display = "block";
        form.querySelector('button[type="button"]').style.display = "none";
    }

// Function to handle form submission (replace with actual AJAX call)
//     function submitForm(event) {
//         event.preventDefault();
//
//         const form = event.target;
//         const formData = new FormData(form);
//
//         // Call the function to update user information
//         updateUserInfo(formData);
//     }

// New function to update user information
    function updateUserInfo(formData) {
        fetch('/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Handle the data returned from the server
            })
            .catch(error => {
                console.error('Error updating user info:', error);
            });
    }



