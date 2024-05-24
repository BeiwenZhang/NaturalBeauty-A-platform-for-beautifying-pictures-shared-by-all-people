package com.zbw.NaturalBeauty.controller;

import com.zbw.NaturalBeauty.config.RoomInfo;
import com.zbw.NaturalBeauty.pojo.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;


@Controller
public class RoomController {
    @RequestMapping("/select")
    public String choose(){
        return "select";
    }

//    @RequestMapping("/center")
//    public String center(){
//        return "center";
//    }

    @GetMapping("/testBeautifyImages")
    @ResponseBody
    public String testBeautifyImages(){
        return RoomInfo.ifBeautifyImages ? 1+"" : -1+"";
    }
    @RequestMapping("/blog")
    public String login(){
        return "blog";
    }

    @RequestMapping("/room")
    public String room(@RequestParam("BeautifyImages") Boolean ifBeautifyImages ,HttpSession session){
        User user = (User) session.getAttribute("user");
        if (user == null){
            return "error";
        }else{
            if (ifBeautifyImages){
                RoomInfo.ifBeautifyImages = true;
                RoomInfo.BeautifyImagesUser = user;
            }else{
                RoomInfo.GuessUsers.add(user);
            }
            return "room";
        }
    }
    @GetMapping("/getIfBeautifyImages")
    @ResponseBody
    public Boolean getIfBeautifyImages(HttpSession session){
        User user = (User) session.getAttribute("user");
        User BeautifyImagesUser =RoomInfo.BeautifyImagesUser;
        return user.equals(BeautifyImagesUser);
    }
}
