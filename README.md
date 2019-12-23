# GradesManageSystem
Just a database curriculum design.

使用前先开启服务器:
    node backend.js

学生端：查询信息（已修课程*，总学分*，选修必修课程*，对应分数*）
老师端：对课内学生打分（平时，出勤，期末），统计通过率平均分等，发布消息给学生（课程要求，公告）
select distinct cname,tname,cscore,ctype,gattend,gdaily,gfinal from course,teacher,grade where grade.sno='2017141461038' and grade.cno='c009' and course.cno='c009' and teacher.tno=course.tno;