package com.tyj.java_chatroom.api;

import lombok.Data;

@Data
public class MessageResponse {
    private String type = "message";
    private Integer fromId;
    private String fromName;
    private Integer sessionId;
    private String content;
}
