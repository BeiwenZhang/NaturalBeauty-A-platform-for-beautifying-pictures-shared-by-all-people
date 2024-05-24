package com.zbw.NaturalBeauty.controller;

import com.zbw.NaturalBeauty.pojo.User;
import com.zbw.NaturalBeauty.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

@Controller
public class CenterController {

    private final UserService userService;

    @Autowired
    public CenterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/center")
    public String showCenterPage(Model model, HttpSession session) {
        // 从 session 中获取当前登录用户
        User user = (User) session.getAttribute("user");

        // 如果用户为空，可以进行相应的处理，例如重定向到登录页面
        if (user == null) {
            return "redirect:/login";
        }

        // 从数据库中获取用户信息
        User userProfile = userService.getUserById(user.getId());

        // 将用户信息添加到模型中
        model.addAttribute("userProfile", userProfile);

        // 返回个人中心页面
        return "center";
    }

//    @GetMapping("/getUsername")
//    @ResponseBody
//    public String getUsername(HttpSession session) {
//        User user = (User) session.getAttribute("user");
//        if (user == null) {
//            return null;
//        }
//        return user.getName();
//    }
}
