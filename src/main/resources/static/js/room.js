//聊天室主人
var username;
// 消息接收者
var toName = "all";
var space = "说: ";
var service_ip = "192.168.50.90";
var Font_Size = 1;
var if_BeautifyImages ;
// Store the history of canvas states
const canvasHistory = [];
const MAX_HISTORY_LENGTH = 30; // Adjust this based on your needs
var originalImageData;
console.log("创建 ws - ")
//创建websocket对象
var ws = new WebSocket("ws://localhost:8888/chat");
var uploadedImage;
window.onload = function () {
    // 绑定事件监听器，并传递 applyFilter 作为回调函数
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');



    // 处理图片大小的函数
// 全局变量，用于存储用户上传的图片


    async function handleFileSelect(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
            const fileName = await uploadFileToServer(file);
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = async function () {
                    // Save the user-uploaded image and pass the file name
                    uploadedImage = img;

                    // Calculate scaling to fit the image on the canvas
                    const scaleWidth = canvas.width / img.width;
                    const scaleHeight = canvas.height / img.height;
                    const scale = Math.min(scaleWidth, scaleHeight);

                    const newWidth = img.width * scale;
                    const newHeight = img.height * scale;

                    // Calculate centering offsets
                    const xOffset = (canvas.width - newWidth) / 2;
                    const yOffset = (canvas.height - newHeight) / 2;

                    // Clear the canvas and draw the adjusted image
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, xOffset, yOffset, newWidth, newHeight);

                    // Initialize originalImageData
                    originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);

                    // Send a message, including the file name
                    var sendJson = { "msgType": 5, "fromName": toName, "message": fileName };
                    ws.send(JSON.stringify(sendJson));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }


    function uploadFileToServer(file) {
        const formData = new FormData();
        formData.append('file', file);

        // ...

        return fetch('http://localhost:8888/api/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json()) // 解析JSON响应
            .then(data => {
                console.log(data); // 这里是服务器响应，包含文件名等信息
                const receivedFileName = data.fileName; // 假设服务器返回的JSON中有一个字段是fileName

                // 使用 receivedFileName，根据需要进行其他操作
                // 例如：将 receivedFileName 作为上传时的文件名
                // formData.append('message', receivedFileName);
                return receivedFileName;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: 'image/png'});
    }

//登录后显示用户名和状态
    $(function () {
        $.ajax({
            //是否异步,此项目此处必须是false
            async: false,
            //请求方式
            type: 'GET',
            //请求url
            url: "/getUsername",
            success: function (res) {
                username = res;
            }
        });
        $.ajax({
            //是否异步,此项目此处必须是false
            async: false,
            //请求方式
            type: 'GET',
            //请求url
            url: "/getIfBeautifyImages",
            success: function (res) {
                if_BeautifyImages = res;
                console.log(if_BeautifyImages);

            }
        });


        //建立连接后触发
        ws.onopen = function () {
            $('#chatMeu').html('<p>用户：' + username + "<span style='float: right;color: greenyellow; height: 20px'>在线</span></p>")


        };

        ws.onmessage = function (evt) {
            // 获取数据
            var dataStr = evt.data;
            var jsonData = JSON.parse(dataStr);

            console.log("message" + jsonData.msgType);
//成功打印了1号、3号消息，ok的。五号消息没打出来。先不管了
            // 判断是否是系统消息
            if (jsonData.msgType == 1) {
                console.log("1号消息");
                var allNames = jsonData.message;
                var users_str = "";
                for (var name of allNames) {
                    users_str += name + "在线\n";
                }
                document.getElementById('text_users').value = users_str;
                var init_context = document.getElementById('text_session').value;
                init_context += "系统消息： " + jsonData.fromName + "已上线" + "\n";
                document.getElementById('text_session').value = init_context;
            } else if (jsonData.msgType == 3) {
                var data = jsonData.message;
                var fromuser = jsonData.fromName;
                var init_context = document.getElementById('text_session').value;
                init_context += fromuser + space + data + "\n";
                document.getElementById('text_session').value = init_context;
            } else if (jsonData.msgType == 2) {
                var allNames = jsonData.message;
                var users_str = "";
                for (var name of allNames) {
                    users_str += name + "\n";
                }
                document.getElementById('text_users').value = users_str;
                var init_context = document.getElementById('text_session').value;
                init_context += "系统消息： " + jsonData.fromName + "已下线" + "\n";
                document.getElementById('text_session').value = init_context;
            }
            else if (jsonData.msgType == 5) {
                    //从消息中获取图片名称
                if(if_BeautifyImages==false){
                    var imageName = jsonData.message;

                    // 设置图片路径，相对路径是相对于当前项目的根路径，而不是相对于当前 JavaScript 文件
                var imagePath = '/img/'+imageName  ;

                console.log(imageName);

                    // 创建一个新的 Image 对象
                    var img = new Image();

                    // 设置图片加载完成的回调函数
                    img.onload = function () {
                        // 计算缩放比例，使得图片尽可能铺满 canvas，但长宽比不改变
                        console.log("加载"+imagePath);
                        const scaleWidth = canvas.width / img.width;
                        const scaleHeight = canvas.height / img.height;
                        const scale = Math.min(scaleWidth, scaleHeight);

                        const newWidth = img.width * scale;
                        const newHeight = img.height * scale;

                        // 计算居中偏移量
                        const xOffset = (canvas.width - newWidth) / 2;
                        const yOffset = (canvas.height - newHeight) / 2;

                        // 清除画布并绘制调整后的图片
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(img, xOffset, yOffset, newWidth, newHeight);
                    };

                    // 设置图片路径
                    img.src = imagePath;
                }}




            else if (jsonData.msgType == 6) {
                context.fillStyle = "#FFFFFF";
                context.beginPath();
                console.fillRect(0, 0, canvas.width, canvas.height);
                console.closePath();
            }
            else if (jsonData.msgType == 7) {
                if(if_BeautifyImages==false){

                    var filterName = jsonData.message;
                    applyFilterFunction(filterName);
                }
            }

        }
        //关闭连接触发
        ws.onclose = function () {
            $('#chatMeu').html('<p>用户' + username + "<span style='float: right;color: #d50a0a; height: 20px'>离线</span></p>")
        };



        //发送按钮点击
        $("#submit").click(function () {
            //获取发送输入框中的内容
            var data = $("#tex_content").val();
            //点击发送后，清空输入内容框架
            $("#tex_content").val("");
            var sendJson = {"msgType": 3, "fromName": toName, "message": data};

            //更新聊天室
            var init_context = document.getElementById('text_session').value
            init_context += username + space + data + "\n";
            document.getElementById('text_session').value = init_context;

            //发送数据给服务端
            ws.send(JSON.stringify(sendJson));

        });


        $("#clear_button").click(function () {
            context.fillStyle = "#FFFFFF";
            context.beginPath();
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.closePath();
            var sendJson = {"msgType": 6, "fromName": username, "message": "NULL"};
            ws.send(JSON.stringify(sendJson));
        });
        function applyFilterFunction(filterName) {
            console.log(`Applying filter: ${filterName}`);
            if (filterName === '共用滤镜_1') {
                applyInvertFilter();
            }
            if (filterName === '共用滤镜_2') {
                applyGrayScaleFilter();
            }
            if (filterName === '共用滤镜_3') {
                applyMosacFilter();
            }


            if (filterName === '共用滤镜_4') {
                applyEdgeDetectionFilter();
            }

            if (filterName === '共用滤镜_5') {
                applyNeonFilter();
            }
            if (filterName === '共用滤镜_6') {
                applyBlurFilter();
            }
            if (filterName === '共用滤镜_7') {
                applyBinaryFilter();
            }
            if (filterName === '共用滤镜_8') {
                applyOilPaintFilter();
            }
            if (filterName === '共用滤镜_9') {
                applySunshineFilter();
            }
            if (filterName === '共用滤镜_10') {
                applySepiaFilter();
            }
            if (filterName === '共用滤镜_11') {
                applyComicFilter();
            }
            if (filterName === '共用滤镜_12') {
                applyColorFilter();
            }

            if (filterName === '女生滤镜_1') {
                applyChillyFilter();
            }
            if (filterName === '女生滤镜_2') {
                applyLightFilter();
            }
            if (filterName === '女生滤镜_3') {
                applyWhitenFilter();
            }
            if (filterName === '女生滤镜_4') {//applyContourBlurAndHighlightFilter
                applyDreamFilter();
            }
            if (filterName === '女生滤镜_5') {
                applyDopamineStyleFilter();
            }

            if (filterName === '五官调整_1') {
                applyEyesFilter();
            }
            if (filterName === '男生滤镜_1') {
                applyTanFilter();
            }

        }

// 应用多巴胺风格的颜色增强滤镜
        function applyDopamineStyleFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 调整图像的颜色饱和度、对比度和亮度
            adjustSaturation(imageData, 1.4); // 饱和度增强
            adjustContrast(imageData, 1.3);    // 对比度增强
            adjustBrightness(imageData, 1.1);  // 亮度增强

            context.putImageData(imageData, 0, 0);
        }

        // 应用颜色增强滤镜
        function applyColorFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 调整图像的颜色饱和度、对比度和亮度
            adjustSaturation(imageData, 1.4); // 饱和度增强
            // adjustContrast(imageData, 1.3);    // 对比度增强
            // adjustBrightness(imageData, 1.15);  // 亮度增强

            context.putImageData(imageData, 0, 0);
        }


// 辅助函数：调整图像的颜色饱和度
        function adjustSaturation(imageData, saturation) {
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];

                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                imageData.data[i] = gray + (r - gray) * saturation;
                imageData.data[i + 1] = gray + (g - gray) * saturation;
                imageData.data[i + 2] = gray + (b - gray) * saturation;
            }
        }

// 辅助函数：调整图像的对比度
        function adjustContrast(imageData, contrast) {
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];

                const avg = (r + g + b) / 3;
                imageData.data[i] = avg + (r - avg) * contrast;
                imageData.data[i + 1] = avg + (g - avg) * contrast;
                imageData.data[i + 2] = avg + (b - avg) * contrast;
            }
        }

// 辅助函数：调整图像的亮度
        function adjustBrightness(imageData, brightness) {
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] *= brightness;
                imageData.data[i + 1] *= brightness;
                imageData.data[i + 2] *= brightness;
            }
        }


        // 应用轮廓模糊滤镜并增加光感
        function applyDreamFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const blurRadius = 2; // 可调整的模糊半径
            const highlightFactor = 1.1; // 可调整的光感增强因子

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const pixel = getPixel(imageData, x, y);
                    const blurredPixel = getAverageColor(imageData, x, y, blurRadius);
                    const highlightedPixel = pixel.map(value => Math.min(255, value * highlightFactor));
                    // 根据轮廓模糊的像素和光感增强的像素，选择更亮的像素作为结果
                    const resultPixel = highlightedPixel.map((value, index) => Math.max(value, blurredPixel[index]));
                    // 直接在原始 imageData 上修改像素值
                    imageData.data.set(resultPixel, (y * canvas.width + x) * 4);
                }
            }

            context.putImageData(imageData, 0, 0);
        }

// 辅助函数：获取周围像素的平均颜色
        function getAverageColor(imageData, x, y, radius) {
            let sum = [0, 0, 0, 0];
            let count = 0;

            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    const nx = x + i;
                    const ny = y + j;

                    if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                        const pixel = getPixel(imageData, nx, ny);
                        sum = sum.map((value, index) => value + pixel[index]);
                        count++;
                    }
                }
            }
            const average = sum.map(value => Math.round(value / count));
            return average;
        }

        //男生的黑皮体育生 没能实现（能否用人脸）？
        function applyTanFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];


                let nred = r > 200 ? r * 0.8 : r; // 调整阈值和增加值以适应男生皮肤色调
                let ngreen = g > 200 ? g * 0.8 : g; // 调整阈值和增加值以适应男生皮肤色调
                let nblue = b > 200 ? b * 0.7 : b;
                ; // 不做蓝色通道的调整

                imageData.data[i] = nred;
                imageData.data[i + 1] = ngreen;
                imageData.data[i + 2] = nblue;
            }

            context.putImageData(imageData, 0, 0);
        }


        //阳光滤镜
        function applySunshineFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.min(255, imageData.data[i] * 1.3); // 增强
                imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * 1.3);
                imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * 1.1);
            }

            context.putImageData(imageData, 0, 0);
        }


//怀旧
        function applySepiaFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.height * imageData.width; i++) {
                const r = imageData.data[i * 4];
                const g = imageData.data[i * 4 + 1];
                const b = imageData.data[i * 4 + 2];

                const newR = (0.393 * r + 0.769 * g + 0.189 * b);
                const newG = (0.349 * r + 0.686 * g + 0.168 * b);
                const newB = (0.272 * r + 0.534 * g + 0.131 * b);

                const rgbArr = [newR, newG, newB].map(e => {
                    return e < 0 ? 0 : e > 255 ? 255 : e;
                });

                [imageData.data[i * 4], imageData.data[i * 4 + 1], imageData.data[i * 4 + 2]] = rgbArr;
            }

            context.putImageData(imageData, 0, 0);
        }

        //漫画滤镜
        function applyComicFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.height * imageData.width; i++) {
                const r = imageData.data[i * 4];
                const g = imageData.data[i * 4 + 1];
                const b = imageData.data[i * 4 + 2];

                // 增加对比度
                const contrastR = (r - 128) * 1.8 + 128;
                const contrastG = (g - 128) * 1.8 + 128;
                const contrastB = (b - 128) * 1.8 + 128;

                // 强化边缘
                const edgeR = Math.abs(g - b + g + r) * r / 256;
                const edgeG = Math.abs(b - g + b + r) * r / 256;
                const edgeB = Math.abs(b - g + b + r) * g / 256;

                // 合并处理
                const newR = Math.min(255, Math.max(0, contrastR + edgeR));
                const newG = Math.min(255, Math.max(0, contrastG + edgeG));
                const newB = Math.min(255, Math.max(0, contrastB + edgeB));

                const rgbArr = [newR, newG, newB];

                [imageData.data[i * 4], imageData.data[i * 4 + 1], imageData.data[i * 4 + 2]] = rgbArr;
            }

            context.putImageData(imageData, 0, 0);
        }

        //二值化
        function applyBinaryFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];

                const grey = (r + g + b) / 3;

                let n = grey < 150 ? 0 : 255;

                imageData.data[i] = n;
                imageData.data[i + 1] = n;
                imageData.data[i + 2] = n;
            }
            context.putImageData(imageData, 0, 0);
        }

//美白
        function applyWhitenFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];

                const grey = (r + g + b) / 3;

                let nred = r > 220 ? 255 : r + 30;
                let ngreen = g > 220 ? 255 : g + 30;
                let nblue = b > 220 ? 255 : b + 30;

                if (grey < 100) {
                    nred = r;
                    ngreen = g;
                    nblue = b;
                }

                imageData.data[i] = nred;
                imageData.data[i + 1] = ngreen;
                imageData.data[i + 2] = nblue;
            }

            context.putImageData(imageData, 0, 0);
        }


// 具体的滤镜应用函数
        function applyInvertFilter() {

            saveToHistory();

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            console.log(imageData); // 确保这里输出的是有效值而不是 undefined

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                const a = imageData.data[i + 3];

                // 男生滤镜效果的处理逻辑，可以根据实际需求进行修改
                // 这里以一种简单的处理方式为例
                imageData.data[i] = 255 - r;
                imageData.data[i + 1] = 255 - g;
                imageData.data[i + 2] = 255 - b;
            }
            // 将处理后的图像数据放回画布中
            context.putImageData(imageData, 0, 0);

        }

        function applyGrayScaleFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                const a = imageData.data[i + 3];
                const average = (r + g + b) / 3;
                imageData.data[i] = average;
                imageData.data[i + 1] = average;
                imageData.data[i + 2] = average;
            }

            context.putImageData(imageData, 0, 0);
        }//马赛克
        function applyMosacFilter() {
            saveToHistory();

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const mosaicBlockSize = 10; // You can adjust this block size based on your preference

            for (let y = 0; y < canvas.height; y += mosaicBlockSize) {
                for (let x = 0; x < canvas.width; x += mosaicBlockSize) {
                    const pixel = getPixel(imageData, x, y);
                    context.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
                    context.fillRect(x, y, mosaicBlockSize, mosaicBlockSize);
                }
            }
        }

        //轮廓提取
        function applyEdgeDetectionFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const threshold = 20;

            for (let i = 0; i < imageData.data.length; i += 4) {
                const x = (i / 4) % canvas.width;
                const y = Math.floor((i / 4) / canvas.width);

                const grey = getAverageGrey(imageData, x, y);
                const ngrey = getAverageGrey(imageData, x + 2, y + 2);

                if (Math.abs(grey - ngrey) > threshold) {
                    imageData.data[i] = 0;        // Set red channel to 0 for edges
                    imageData.data[i + 1] = 0;    // Set green channel to 0 for edges
                    imageData.data[i + 2] = 0;    // Set blue channel to 0 for edges
                    imageData.data[i + 3] = 255;  // Set alpha channel to 255 for edges
                } else {
                    imageData.data[i] = 225;      // Set red channel to 225 for non-edges
                    imageData.data[i + 1] = 225;  // Set green channel to 225 for non-edges
                    imageData.data[i + 2] = 225;  // Set blue channel to 225 for non-edges
                    imageData.data[i + 3] = 255;  // Set alpha channel to 255 for non-edges
                }
            }

            context.putImageData(imageData, 0, 0);
        }

// Helper function to get the average grey value of a 3x3 region
        function getAverageGrey(imageData, x, y) {
            let totalGrey = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const pixel = getPixel(imageData, x + i, y + j);
                    const greyValue = (pixel[0] + pixel[1] + pixel[2]) / 3;
                    totalGrey += greyValue;
                }
            }
            return totalGrey / 9;
        }


// Helper function to get the color of a specific pixel
        function getPixel(imageData, x, y) {
            const index = (y * imageData.width + x) * 4;
            return [
                imageData.data[index],
                imageData.data[index + 1],
                imageData.data[index + 2],
                imageData.data[index + 3]
            ];
        }

// 应用锐化滤镜
        function applySharpenFilter() {

            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 调整图像的颜色饱和度、对比度和亮度
            // adjustSaturation(imageData, 1.4); // 饱和度增强
            adjustContrast(imageData, 2);    // 对比度增强
            // adjustBrightness(imageData, 1.15);  // 亮度增强

            context.putImageData(imageData, 0, 0);

        }

// 应用模糊
        function applyBlurFilter() {
            saveToHistory();
            const radius = 3;
            const intensity = 10;
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    // 修正 x 和 y，确保它们不会超过图像边界
                    const correctedX = Math.max(0, Math.min(canvas.width - 1, x));
                    const correctedY = Math.max(0, Math.min(canvas.height - 1, y));

                    const pixel = getPixel(imageData, correctedX, correctedY);
                    const neighborPixels = getNeighborPixels(imageData, correctedX, correctedY, radius);

                    const averageColor = calculateAverageColor(neighborPixels);
                    setPixel(imageData, x, y, averageColor);
                }
            }

            context.putImageData(imageData, 0, 0);
        }


        function applyOilPaintFilter() {
            saveToHistory();
            const radius = 5; // 调整这个值以适应你的喜好
            const randomness = 30; // 随机性参数，可以调整

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < canvas.width; i += radius) {
                for (let j = 0; j < canvas.height; j += radius) {
                    const pixel = getPixel(imageData, i, j);
                    // 引入颜色随机性
                    const randomR = Math.random() * randomness - randomness / 2;
                    const randomG = Math.random() * randomness - randomness / 2;
                    const randomB = Math.random() * randomness - randomness / 2;

                    const color = `rgb(${clamp(pixel[0] + randomR, 0, 255)}, ${clamp(pixel[1] + randomG, 0, 255)}, ${clamp(pixel[2] + randomB, 0, 255)})`;

                    context.fillStyle = color;
                    context.beginPath();
                    context.arc(i, j, radius / 2, 0, Math.PI * 2);
                    context.fill();
                }
            }
        }


// 辅助函数，确保颜色值在有效范围内
        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }


        function getPixel(imageData, x, y) {
            const index = (y * imageData.width + x) * 4;
            return [
                imageData.data[index],
                imageData.data[index + 1],
                imageData.data[index + 2],
                imageData.data[index + 3]
            ];
        }


// 获取邻域像素
        function getNeighborPixels(imageData, x, y, radius) {
            const pixels = [];
            for (let i = y - radius; i <= y + radius; i++) {
                for (let j = x - radius; j <= x + radius; j++) {
                    pixels.push(getPixel(imageData, j, i));
                }
            }
            return pixels;
        }

// 计算颜色平均值
        function calculateAverageColor(pixels) {
            const sum = pixels.reduce((acc, color) => acc.map((c, i) => c + color[i]), [0, 0, 0, 0]);
            return sum.map(value => Math.round(value / pixels.length));
        }

// 设置指定位置像素的颜色值
        function setPixel(imageData, x, y, color) {
            const index = (y * imageData.width + x) * 4;
            imageData.data[index] = color[0];
            imageData.data[index + 1] = color[1];
            imageData.data[index + 2] = color[2];
            imageData.data[index + 3] = color[3];
        }


// 应用清冷网感
        function applyChillyFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 调整颜色平衡，这里以增强红色为例
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.min(255, imageData.data[i] * 0.8); // 增强
                imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * 0.8);
                imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * 0.9);
            }

            context.putImageData(imageData, 0, 0);
        }

        // 应用光尘之下滤镜
        function applyLightFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 调整颜色平衡，这里以增强红色为例
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.min(255, imageData.data[i] * 1.25); // 增强
                imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * 1.25);
                imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * 1.25);
            }
            context.putImageData(imageData, 0, 0);
        }

// 应用霓虹效果滤镜
        function applyNeonFilter() {
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.min(255, imageData.data[i] * 1.2); // 增强红色通道
                imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * 1.1); // 增强绿色通道
                imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * 1.15); // 增强蓝色通道
            }

            context.putImageData(imageData, 0, 0);
        }


        //下面开始尝试写面部识别（放大双眼）的代码

// 初始化 face-api.js
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);


// 放大双眼
        async function applyEyesFilter() {
            // 获取画布上的图像数据
            saveToHistory();
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // 将图像数据转换为 face-api.js 中使用的格式
            const inputImage = faceapi.createCanvasFromMedia(imageData);
            console.log("下面开始面部识别");
            // 加载 TinyYolov2 模型
            await faceapi.nets.tinyYolov2.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@2.0.0/models');


            // 进行面部检测
            faceapi
                .detectAllFaces(inputImage, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .then((facesWithLandmarks) => {
                    console.log("detectAllFaces完成");
                    // 获取第一个检测到的面部（假设只有一个人）
                    const firstFace = facesWithLandmarks[0];

                    // 获取左眼和右眼的坐标
                    const leftEye = firstFace.landmarks.getLeftEye();
                    const rightEye = firstFace.landmarks.getRightEye();

                    // 输出坐标
                    const leftEyeX = leftEye[0]._x;
                    const leftEyeY = leftEye[0]._y;
                    const rightEyeX = rightEye[3]._x;
                    const rightEyeY = rightEye[3]._y;

                    // 定义放大倍数
                    const enlargementFactor = 1.5;

                    for (let i = 0; i < imageData.data.length; i += 4) {
                        const x = (i / 4) % canvas.width;
                        const y = Math.floor(i / (4 * canvas.width));

                        const distanceToLeftEye = Math.sqrt((x - leftEyeX) ** 2 + (y - leftEyeY) ** 2);
                        const distanceToRightEye = Math.sqrt((x - rightEyeX) ** 2 + (y - rightEyeY) ** 2);

                        // 判断当前像素是否在双眼范围内
                        if (distanceToLeftEye < 20 || distanceToRightEye < 20) {
                            // 计算放大后的坐标
                            const newX = x + (x - leftEyeX) * (enlargementFactor - 1);
                            const newY = y + (y - leftEyeY) * (enlargementFactor - 1);

                            // 将放大后的坐标限制在画布范围内
                            const clampedX = Math.max(0, Math.min(canvas.width - 1, newX));
                            const clampedY = Math.max(0, Math.min(canvas.height - 1, newY));

                            // 获取原始像素值
                            const r = imageData.data[i];
                            const g = imageData.data[i + 1];
                            const b = imageData.data[i + 2];
                            const a = imageData.data[i + 3];

                            // 将放大后的像素值应用到图像数据中
                            const newIndex = (clampedY * canvas.width + clampedX) * 4;
                            imageData.data[newIndex] = r;
                            imageData.data[newIndex + 1] = g;
                            imageData.data[newIndex + 2] = b;
                            imageData.data[newIndex + 3] = a;
                        }
                    }
                    // 将处理后的图像数据放回画布中
                    context.putImageData(imageData, 0, 0);
                    console.log("放进去了");
                });
        }
        function saveToHistory() {
            const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasHistory.push(currentState);
            console.log(canvasHistory.length)
            // Limit the history length
            if (canvasHistory.length > MAX_HISTORY_LENGTH) {
                canvasHistory.shift(); // Remove the oldest state
            }
        }

// Helper function to restore the canvas to a previous state
        function restoreFromHistory() {


            if (canvasHistory.length > 0) {
                console.log("undo");

                const previousState = canvasHistory.pop();
                context.putImageData(previousState, 0, 0);

            }
        }

// 定义滤镜组的数组
        const commonFilters = ["反片", "灰度", "马赛克", "轮廓提取", "霓虹灯", "模糊", "杂志二值化", "油画", "阳光", "怀旧", "漫画", "色彩"];
        const maleFilters = ["黑皮体育生", "MaleFilter2", "MaleFilter3", "MaleFilter4", "MaleFilter5", "MaleFilter6", "MaleFilter7", "MaleFilter8"];
        const femaleFilters = ["清冷网感", "光尘之下", "面部美白", "梦幻光感", "多巴胺", "FemaleFilter6", "FemaleFilter7", "FemaleFilter8"];
        const facialAdjustmentFilters = ["放大双眼", "FacialAdjustment2", "FacialAdjustment3", "FacialAdjustment4", "FacialAdjustment5", "FacialAdjustment6", "FacialAdjustment7", "FacialAdjustment8"];


        // 定义应用滤镜的函数
        function applyFilter(filterArray, filterType) {
            // 获取滚动区域
            const scrollableContent = document.getElementById('scrollable-content');

            // 清空滚动区域内容
            scrollableContent.innerHTML = "";

            // 添加新的滤镜按钮
            for (let i = 0; i < filterArray.length; i++) {
                const button = document.createElement('button');
                const imagePath = `/img/${filterArray[i]}.png`;
                // console.log(${filterArray[i]});
                button.innerHTML = `
            <img src="${imagePath}" alt="${filterType} 图片">
            <span>${filterArray[i]}</span>
        `;
                button.setAttribute('filterName', `${filterType}_${i + 1}`);
                // 将点击事件绑定到动态创建的按钮上
                button.addEventListener('click', function () {
                    applyFilterFunction(button.getAttribute('filterName'));
                    var sendJson = { "msgType": 7, "fromName": toName, "message":button.getAttribute('filterName') };
                    ws.send(JSON.stringify(sendJson));
                });
                scrollableContent.appendChild(button);
            }
        }

// 示例函数，你需要根据实际情况修改,["反片", "灰度","马赛克","锐化","颜色平衡","边缘检测","霓虹灯","模糊"];
        // ... (existing code)
        if (if_BeautifyImages) {
            document.getElementById('file_input').addEventListener('change', function (event) {
                handleFileSelect(event);
            });
            $("#download-button").click(function () {

                // 计算实际图像所占用的区域
                var img = uploadedImage;
                const scaleWidth = canvas.width / img.width;
                const scaleHeight = canvas.height / img.height;
                const scale = Math.min(scaleWidth, scaleHeight);

                const newWidth = img.width * scale;
                const newHeight = img.height * scale;

                // 计算居中偏移量
                const xOffset = (canvas.width - newWidth) / 2;
                const yOffset = (canvas.height - newHeight) / 2;

                // 在当前 Canvas 上绘制指定区域
                var imageData = context.getImageData(xOffset, yOffset, newWidth, newHeight);

                // 创建一个新的 Canvas 来保存指定区域的图像
                var croppedCanvas = document.createElement('canvas');
                croppedCanvas.width = newWidth;
                croppedCanvas.height = newHeight;
                var croppedContext = croppedCanvas.getContext('2d');
                croppedContext.putImageData(imageData, 0, 0);

                // Create a data URL for the cropped canvas content
                var dataURL = croppedCanvas.toDataURL('image/png');

                // Create a Blob object from the data URL
                var blob = dataURItoBlob(dataURL);

                // Create a download link
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'cropped_image.png';

                // Append the link to the body and trigger a click
                document.body.appendChild(link);
                link.click();

                // Remove the link from the body
                document.body.removeChild(link);
            });


// Event listener for the "Undo" button
            $("#undo-button").click(function () {

                restoreFromHistory();
            });

// Event listener for the "Restore Original" button
            $("#restore-button").click(function () {

                // Restore the canvas to its original state

                context.putImageData(originalImageData, 0, 0);
                canvasHistory.length = 0; // 清空历史记录

            });
            $("#share-button").click(function () {

                // Restore the canvas to its original state

                window.location.href = "/blog";

            });





// 应用滤镜按钮点击事件
            $("#filter-button").click(function () {
                applyFilter(commonFilters, '共用滤镜');
            });

// 男性滤镜按钮点击事件
            $("#male-filter-button").click(function () {
                applyFilter(maleFilters, '男生滤镜');
            });

// 女性滤镜按钮点击事件
            $("#female-filter-button").click(function () {
                applyFilter(femaleFilters, '女生滤镜');
            });

// 五官调整按钮点击事件
            $("#facial-adjustment-button").click(function () {
                applyFilter(facialAdjustmentFilters, '五官调整');
            });





        }


        window.onbeforeunload = function () {
            ws.close();
        }
    });
};