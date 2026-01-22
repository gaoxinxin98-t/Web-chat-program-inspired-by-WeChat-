package com.tyj.java_chatroom.api;

import com.tyj.java_chatroom.model.Message;
import com.tyj.java_chatroom.model.MessageMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
public class MessageAPI {
    @Resource
    MessageMapper messageMapper;

    @GetMapping("/message")
    public Object getHistoryMessageBySessionId(@RequestParam(name = "sessionId") int sessionId) {
        List<Message> historyMessages = messageMapper.getHistoryMessages(sessionId);
        //倒序查询结果使新消息在下边
        Collections.reverse(historyMessages);
        return historyMessages;
    }


}
