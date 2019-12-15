create table Student(
    sno char(15),
    sname char(6),
    spwd char(16)
);

create table Course(
    cno char(10),
    cname char(14),
    tno char(10),
    cscore int,
    ctype char(2)
);

create table Teacher(
    tno char(10),
    tname char(6),
    tpwd char(16)
);

create table Grade(
    cno char(14),
    sno char(15),
    gattend int,
    gdaily int,
    gfinal int
);

create table Notice(
    cno char(14),
    tno char(10),
    ntime char(15),
    ntext char(100)
);

insert into Student
    values("2017141461038", "邓瑞韬", "123456"),
    ("2017141461376", "唐睿", "123456"),
    ("2017141461221", "黄郅偈", "123456"),
    ("2017141461000", "达文西", "123456"),
    ("2017141461001", "林克", "123456"),
    ("2017141461002", "马化腾", "123456"),
    ("2017141461003", "尤达", "123456"),
    ("2017141461004", "蔡徐坤", "123456"),
    ("2017141461005", "带土", "123456");

insert into Course values
    ("c000", "数据库原理", "t001", 2, "必修"),
    ("c001", "编译原理", "t002", 3, "必修"),
    ("c002", "捏舵可-自顶向下", "t003", 2, "必修"),
    ("c003", "习近平新时代思想", "t004", 5, "必修"),
    ("c004", "计算机图形学", "t005", 2, "必修"),
    ("c005", "微机接口技术", "t006", 2, "必修"),
    ("c006", "软件工程", "t007", 2, "必修"),
    ("c007", "岛学与忽悠艺术", "t008", 6, "必修"),
    ("c008", "原力掌握指南", "t009", 10, "必修"),
    ("c009", "量子速读入门", "t002", 100, "必修");

insert into Teacher values
    ("t000", "管理员", "654321"),
    ("t001", "陈杰华", "654321"),
    ("t002", "胡大裟", "654321"),
    ("t003", "赵树龙", "654321"),
    ("t004", "李逍遥", "654321"),
    ("t005", "张无忌", "654321"),
    ("t006", "基兆王", "654321"),
    ("t007", "周杰伦", "654321"),
    ("t008", "特没普", "654321"),
    ("t009", "左劼", "654321");

insert into Grade values
    ("c001", "2017141461001", 10, 0, 0),
    ("c002", "2017141461002", 10, 0, 50),
    ("c003", "2017141461003", 0, 0, 50),
    ("c004", "2017141461004", 0, 40, 50);

insert into Notice values
    ("c001", "t000", "20191213 17:22", "这是管理员发到数据库课的第一个公告");
