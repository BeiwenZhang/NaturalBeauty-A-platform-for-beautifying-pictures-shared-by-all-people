package com.zbw.NaturalBeauty.controller;

import com.zbw.NaturalBeauty.pojo.User;
import com.zbw.NaturalBeauty.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateUserProfile(@RequestBody User updatedUser, HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user != null) {
            // 在这里可以使用 user.getId() 获取用户ID等信息
            // 处理更新用户信息的逻辑，可以调用 UserService 的方法
            userService.updateUserInfo(updatedUser);

            // 返回成功响应
            return ResponseEntity.ok("User information updated successfully");
        } else {
            return ResponseEntity.badRequest().body("User not authenticated");
        }
    }
}
