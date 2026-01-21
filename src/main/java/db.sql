drop database if exists java_chatroom;
create database if not exists java_chatroom charset utf8;

use java_chatroom;

drop table if exists user;
create table user(
    userId int primary key auto_increment,
    username varchar(20) unique ,
    password varchar(20)
);
insert into user values (null,'zhangsan','123');
insert into user values (null,'lisi','123');
insert into user values (null,'wangwu','123');
insert into user values (null,'zhaoliu','123');


drop table if exists friend;
create table friend (
    userId int,
    friendId int
);

insert into friend values (1,2);
insert into friend values (2,1);
insert into friend values (1,3);
insert into friend values (3,1);
insert into friend values (1,4);
insert into friend values (4,1);


-- 会话表
drop table if exists message_session;
create table message_session (
    sessionId int primary key auto_increment,
    -- 上次访问时间
    lastTime datetime
);

insert into message_session values(1, now());
insert into message_session values(2, now());
-- 会话-用户 关联表
drop table if exists message_session_user;
create table message_session_user (
    sessionId int,
    userId int
);
insert into message_session_user values(1, 1), (1, 2);
insert into message_session_user values(2, 1), (2, 3);


drop table if exists message;
create table message (
    messageId int primary key auto_increment,
    sessionId int,
    fromId int,
    content varchar(2048),
    postTime datetime
);

insert into message values(1,1,1,'吃啥','2025-1-1 00:00:00');
insert into message values(2,1,2,'吃屎','2025-1-1 00:01:00');
insert into message values(3,1,1,'你吃屎','2025-1-1 00:02:00');
insert into message values(4,1,2,'我不吃史','2025-1-1 00:03:00');

insert into message values(5,2,1,'我喜欢你','2025-1-1 00:10:00');
insert into message values(6,2,3,'我不喜欢你','2025-1-1 00:11:00');

insert into message values(7,3,1,'你好，儿子','2025-1-1 00:20:00');
insert into message values(8,3,4,'我叫赵六','2025-1-1 00:21:00');

insert into message values(9,1,2,'我不吃史','2025-1-1 00:03:10');
insert into message values(10,1,1,'我不吃史','2025-1-1 00:03:20');
insert into message values(11,1,2,'我不吃史','2025-1-1 00:03:30');
insert into message values(12,1,1,'我不吃史','2025-1-1 00:03:40');
insert into message values(13,1,2,'我不吃史','2025-1-1 00:03:41');
insert into message values(14,1,1,'我不吃史','2025-1-1 00:03:42');
insert into message values(15,1,2,'我不吃史','2025-1-1 00:03:44');
insert into message values(16,1,1,'我不吃史','2025-1-1 00:03:45');




