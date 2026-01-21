package com.tyj.java_chatroom.component;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/**
 * 管理所有在线用户
 */
@Component
public class OnlineUserManager {
    //考虑到线程安全问题，使用ConcurrentHashMap
    ConcurrentHashMap<Integer, WebSocketSession> userMap = new ConcurrentHashMap<>();

    //用户上线
    public void online(Integer userId, WebSocketSession session) {
        //如果用户一上线不予登录,防多开
        //判断对应对应的userId在不在map中，在就是用户已登录直接退出
        if(userMap.get(userId) != null) {
            System.out.println("【用户已经登录，登录失败】");
            return;
        }

        userMap.put(userId, session);
        System.out.println("【用户登录成功！】");
    }
    //一个id不能存在两个session
    //用户下线
    public void offline(Integer userId, WebSocketSession session) {
        //用userId多开的时候，session2和session1的userId相同，但是执行remove(userId);的时候，不能吧session1登出
        if(userMap.get(userId) == session) {
            userMap.remove(userId);
            System.out.println("【userId登出成功】");
        }
    }

    //根据userId查询session
    public WebSocketSession getSession(Integer userId) {
        return userMap.get(userId);
    }


}
