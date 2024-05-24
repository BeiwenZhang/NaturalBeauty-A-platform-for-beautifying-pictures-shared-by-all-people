package com.zbw.NaturalBeauty.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zbw.NaturalBeauty.Utils.MessageUtils;
import com.zbw.NaturalBeauty.config.RoomInfo;
import com.zbw.NaturalBeauty.pojo.Message;
import com.zbw.NaturalBeauty.pojo.ResultMessage;
import com.zbw.NaturalBeauty.pojo.User;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/chat", configurator = GetHttpSessionConfigurator.class)
@Component
public class ChatEndPoint {

    public static Map<Integer, ChatEndPoint> onlineUsers = new ConcurrentHashMap<>();

    public static Set<String> usernames = new HashSet<>();

    private Session session;

    private HttpSession httpSession;


    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        this.session = session;
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession;

        User user = (User) httpSession.getAttribute("user");
        usernames.add(user.getName());
        onlineUsers.put(user.getId(), this);
        String message = MessageUtils.getMessage(ResultMessage.LOGIN_CODE, user.getName(), usernames);
        broadcastAllUsers(message);
    }

    private Object getAllOnlineUsername() {

        return onlineUsers.keySet();
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
//            System.out.println(message);
            Message msg = objectMapper.readValue(message, Message.class);
            String msgData = msg.getMessage();
            System.out.println("前端发送消息到后台 ws " + msgData);

            User user = (User) httpSession.getAttribute("user");
            int msgType = msg.getMsgType();
            String sendMsg = MessageUtils.getMessage(msgType, user.getName(), msgData);
            //发送消息
            broadcastOtherUsers(sendMsg);
            System.out.println(user.getName() + " 发送了" + sendMsg);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    @OnClose
    public void onClose(Session session) {
        User user = (User) httpSession.getAttribute("user");

        if (user.equals(RoomInfo.BeautifyImagesUser)) {
            RoomInfo.BeautifyImagesUser = null;
            RoomInfo.ifBeautifyImages = false;
        }


        ChatEndPoint remove = onlineUsers.remove(user.getId());
        usernames.remove(user.getName());
        //广播
        String message = MessageUtils.getMessage(ResultMessage.LOGOUT_CODE, user.getName(), usernames);
        broadcastAllUsers(message);
    }

    private void broadcastOtherUsers(String msg) {
        Set<Integer> keySet = onlineUsers.keySet();
        for (Integer i : keySet) {
            ChatEndPoint chatEndPoint = onlineUsers.get(i);
            if (chatEndPoint == this) continue;
            try {
                chatEndPoint.session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    private void broadcastAllUsers(String msg) {
        Set<Integer> keySet = onlineUsers.keySet();
        for (Integer i : keySet) {
            ChatEndPoint chatEndPoint = onlineUsers.get(i);
            try {
                chatEndPoint.session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }
}
