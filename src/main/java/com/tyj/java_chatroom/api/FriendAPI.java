package com.tyj.java_chatroom.api;



import com.tyj.java_chatroom.model.Friend;
import com.tyj.java_chatroom.model.FriendMapper;
import com.tyj.java_chatroom.model.User;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping
public class FriendAPI {
    @Resource
    FriendMapper friendMapper;

    @RequestMapping("/friendList")
    public List<Friend> getFriendList(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session == null) {
            return new ArrayList<Friend>();
        }

        User user = (User) session.getAttribute("user");
        if(user == null) {
            return new ArrayList<Friend>();
        }


        List<Friend> friendList =  friendMapper.selectFriendList(user.getUserId());
        return friendList;

    }
}
