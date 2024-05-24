package com.zbw.NaturalBeauty.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            // 替换为你的项目文件夹路径
            String uploadDir = "D:/idea-workplace/NaturalBeauty/target/classes/static/img";

            // 生成唯一的文件名
            String fileName = generateUniqueFileName();

            // 将文件保存到项目文件夹中
            file.transferTo(new File(uploadDir + File.separator + fileName));

            // 判断文件是否存在
            File savedFile = new File(uploadDir, fileName);
            if (savedFile.exists()) {
                // 返回成功响应，包含文件名
                Map<String, String> response = new HashMap<>();
                response.put("fileName", fileName);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                // 返回失败响应
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (IOException e) {
            e.printStackTrace();
            // 返回失败响应
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private String generateUniqueFileName() {
        // 使用当前时间戳生成唯一的文件名
        return "image_" + System.currentTimeMillis() + ".jpg";
    }
}
