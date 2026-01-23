package com.tyj.java_chatroom.api;

import lombok.Data;

@Data
public class MessageRequest {
    private String type = "message";
    private Integer sessionId;
    private String content;
}
