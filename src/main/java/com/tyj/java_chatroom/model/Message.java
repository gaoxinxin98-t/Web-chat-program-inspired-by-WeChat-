package com.tyj.java_chatroom.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Message {
    private Integer messageId;
    private Integer fromId;
    private String fromName;
    private Integer sessionId;
    private String content;
    private LocalDateTime postTime;
}
