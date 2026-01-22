package com.tyj.java_chatroom.model;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FriendMapper {
    public List<Friend> selectFriendList(int userId);
}
