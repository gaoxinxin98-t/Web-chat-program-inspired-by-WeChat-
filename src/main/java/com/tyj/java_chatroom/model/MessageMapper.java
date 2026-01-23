package com.tyj.java_chatroom.model;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MessageMapper {

    // 获取会话的最后一条信息
    String getLastMessage(int sessionId);

    List<Message>  getHistoryMessages(int sessionId);

    void add(Message message);
}
