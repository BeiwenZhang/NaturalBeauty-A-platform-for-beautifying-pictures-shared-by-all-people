package com.zbw.NaturalBeauty.controller;

import com.zbw.NaturalBeauty.pojo.User;
import com.zbw.NaturalBeauty.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class LoginController {

    @Autowired
    UserService userService;

    @RequestMapping("/")
    public String index(){
        return "index";
    }


    @RequestMapping("/start")
    public String start(){
        return "redirect:login";
    }
    @RequestMapping("/login")
    public String login(){
        return "login";
    }



    @RequestMapping("/signup")
    public String signup(){
        return "signup";
    }

    @RequestMapping("/beauty")
    public String beauty(){
        return "beauty";
    }
    @GetMapping("/register")
    @ResponseBody
    public String register(@RequestParam("name") String name, @RequestParam("pwd") String pwd){
        Integer i = userService.CheckUserName(name);
        if (i != null) return -1+"";
        int res = userService.addUser(new User(-1, name, pwd,null,null,null,false));
        return res+"";

    }


    @GetMapping("/checkout")
    @ResponseBody
    public String login(@RequestParam("name") String name, @RequestParam("pwd") String pwd, HttpSession session){
        Integer i = userService.CheckUser(name, pwd);
        System.out.println("get check id " + i);
        if (i == null){
            return -1+"";
        }else{
            User user = userService.getUserById(i);
            session.setAttribute("user",user);
            return 1+"";
        }
    }




    @RequestMapping("/quearyAllUser")
    @ResponseBody
    public String quearyAllUser(){
        List<User> users = userService.getAllUsers();
        StringBuffer buffer = new StringBuffer();
        for (User user : users) buffer.append(user+"\n");
        return buffer.toString();
    }

    @GetMapping("/getUsername")
    @ResponseBody
    public String getUsername(HttpSession session){
        User user = (User) session.getAttribute("user");
        if (user == null) return null;
        return user.getName();
    }

}
