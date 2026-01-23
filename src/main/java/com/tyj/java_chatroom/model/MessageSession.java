package com.tyj.java_chatroom.model;

import lombok.Data;

import java.util.List;

@Data
public class MessageSession {
    private Integer sessionId;
    private List<Friend> friends;
    private String lastMessage;
}
