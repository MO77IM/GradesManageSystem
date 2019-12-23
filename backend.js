var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var EventEmitter = require('events');

var event = new EventEmitter();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//返回学生登录界面
app.post('/stu_login.html', function(req, res) {
    var id = req.body.sno;
    var pwd = req.body.spwd;
    //验证登录
    query(`select * from Student
				where sno=\'` + id + `\' and spwd=\'` + pwd + '\';', (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            postStudentPage(res, result[0].sname, id);
        } else {
            res.end('登录失败', 'utf-8');
        }
    });
});

//返回教师登录界面
app.post('/teacher_login.html', function(req, res) {
    var id = req.body.sno;
    var pwd = req.body.spwd;
    var str = 'select * from Teacher where tno=\'' + id + '\' && tpwd=\'' + pwd + '\';';
    query(str, (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            fs.readFile(__dirname + '/teacher_login.html', function(err, data) {
                if (err) {
                    throw err;
                }

                var cStr = 'select cno,cname ' +
                    'from course ' +
                    'where course.tno=\'' + id + '\';';
                query(cStr, (err, rr) => {
                    if (err) {
                        throw err;
                    }
                    var courseStr = '';
                    for (var i = 0;; ++i) {
                        if (rr[i] != null) {
                            var el = rr[i];
                            courseStr += '<li>' + el.cno + ':&nbsp&nbsp&nbsp' + el.cname +
                                '<button class="check" value="' + el.cno + '"style="float:right;margin-right:5px;width:50px;height:20px">查看</button></li>';
                        } else {
                            break;
                        }
                    }
                    data = data.toString()
                        .replace('$tname$', result[0].tname)
                        .replace('$li$', courseStr)
                        .replace('$tno$', result[0].tno);
                    res.end(data);
                });
            });
        } else {
            res.end('登录失败');
        }
    });
});

//课程详细信息页面
app.post('/course_info.html', function(req, res) {
    var cno = req.body.check_cno;
    var sno = req.body.check_sno;
    var str = 'select * from course where course.cno=\'' + cno + '\';';
    query(str, (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            fs.readFile(__dirname + '/course_info.html', function(err, data) {
                if (err) {
                    throw err;
                }
                //替换课程名
                data = data.toString().replace('$name$', result[0].cname);

                //获取学生在该课程的详细信息
                var cStr = 'select cname,tname,cscore,ctype,gattend,gdaily,gfinal ' +
                    'from course,teacher,grade ' +
                    'where grade.sno=\'' + sno + '\' and grade.cno=\'' + cno + '\' and course.cno=\'' + cno + '\' and teacher.tno=course.tno;';
                query(cStr, (err, rr) => {
                    if (err) {
                        throw err;
                    }
                    var el = rr[0];
                    data = data.toString().replace('$cno$', cno)
                        .replace('$cname$', el.cname)
                        .replace('$tname$', el.tname)
                        .replace('$cscore$', el.cscore)
                        .replace('$ctype$', el.ctype)
                        .replace('$gattend$', el.gattend)
                        .replace('$gdaily$', el.gdaily)
                        .replace('$gfinal$', el.gfinal)
                        .replace('$gtotal$', el.gattend + el.gdaily + el.gfinal);
                });
                query('select * from notice where notice.cno=\'' + cno + '\';', (err, rr) => {
                    if (err) {
                        throw err;
                    }
                    var noticeList = '';
                    for (var i = 0;; ++i) {
                        if (rr[i] != null) {
                            var el = rr[i];
                            noticeList += '<li>' + el.ntime + '<p style="height:150px">' + el.ntext + '</p></li>';
                        } else {
                            break;
                        }
                    }
                    data = data.toString().replace('$li$', noticeList);

                    event.on('data_end', function() {
                        res.end(data.toString());
                    });
                    setTimeout(function() {
                        event.emit('data_end');
                    }, 1000);

                })
            });
        } else {
            res.end('查询失败', 'utf-8');
        }

    });
});

//学生选课
app.post('/select_class', (req, res) => {
    var id = req.body.sno;
    var name = req.body.sname;
    for (var cno in req.body) {
        if (cno == 'sno' || cno == 'sname') {
            continue;
        }
        query('insert into Grade value(\'' + cno + '\', \'' + id + '\', 0 , 0, 0);', (err, result) => {
            if (err) {
                throw err;
            }
            postStudentPage(res, name, id);
        });
    }
});

//教师管理课程页面
app.post('/teacher_course_info.html', function(req, res) {
    var cno = req.body.cno;
    var tno = req.body.tno;
    query('select cname from course where course.cno=\'' + cno + '\';', (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            postTeacherCourse(res, cno, result[0].cname, tno);
        } else {
            res.end("查询失败");
        }
    });
});

app.post('/release_notice', function(req, res) {
    var cno = req.body.cno;
    var cname = req.body.cname;
    var noticeContent = req.body.inform_content;
    console.log(noticeContent);
    var tno = req.body.tno;
    var ntime = '';
    var date = new Date();
    ntime += date.getFullYear();
    ntime += date.getMonth();
    ntime += date.getDate();
    ntime += ' ' + date.getHours();
    ntime += ':' + date.getMinutes();
    if (noticeContent != "") {
        query('insert into notice value(\'' + cno + '\', \'' + tno + '\', \'' + ntime + '\', \'' + noticeContent + '\');', (err, result) => {
            if (err) {
                throw err;
            }
            postTeacherCourse(res, cno, cname, tno);
        });
    }
});


app.listen(3000, function() {
    console.log('running on 3000...');
});

//返回学生页面
function postStudentPage(res, name, id) {
    fs.readFile(__dirname + '/stu_login.html', function(err, data) {
        if (err) {
            throw err;
        }
        query(`select * from Course c
				where not exists (
					select * from Grade g
						where g.cno = c.cno and g.sno=\'` + id + `\'
				);
		`, function(err, rr) {
            if (err) {
                throw err;
            }
            //显示可选课程
            var courseStr = '';
            for (var i = 0;; ++i) {
                if (rr[i] != null) {
                    var el = rr[i];
                    courseStr += '<li>' + el.cno + ': ' + el.cname + '<input type="checkbox" name="' + el.cno + '" style="float:right"/></li>';
                } else {
                    break;
                }
            }
            data = data.toString()
                .replace(/[$]sname[$]/g, name)
                .replace('$sno$', id)
                .replace('$li$', courseStr);
        });

        //查询该学生已选课程与任课教师
        query('select cno, cname, tname, cscore ' +
            'from course, teacher ' +
            'where exists( ' +
            'select * ' +
            'from grade ' +
            'where grade.cno=course.cno and grade.sno=\'' + id + '\' ' +
            ') and teacher.tno=course.tno; ', (err, rr) => {
                if (err) {
                    throw err;
                }
                //记录总学分
                var totalScore = 0;
                //已选课程信息
                var sCourseStr = '';
                for (var i = 0;; ++i) {
                    if (rr[i] != null) {
                        var el = rr[i];
                        totalScore += Number(el.cscore);
                        sCourseStr += '<li>' + el.cno + ': ' + el.cname + '&nbsp&nbsp&nbsp&nbsp&nbsp任课教师:' + el.tname +
                            '<button class="check" value="' + el.cno + '" style="float:right;margin-right:5px;width:50px">查看</button>' + '</li>';
                    } else {
                        break;
                    }
                }
                data = data.toString()
                    .replace('$li2$', sCourseStr)
                    .replace('$totalScore$', totalScore);
                event.on('data_end', function() {
                    res.end(data.toString());
                });
                setTimeout(function() {
                    event.emit('data_end');
                }, 1000);
            });
    });
}

function postTeacherCourse(res, cno, cname, tno) {
    fs.readFile(__dirname + '/teacher_course_info.html', function(err, data) {
        if (err) {
            throw err;
        }
        data = data.toString().replace('$cname$', cname);
        data = data.toString().replace('$cname2$', cname);
        data = data.toString().replace('$cno$', cno);
        data = data.toString().replace('$tno$', tno);
        query('select avg(gattend+gdaily+gfinal) from grade where grade.cno=\'' + cno + '\';', (err, rr) => {
            if (err) {
                throw err;
            }
            if (rr[0] != null) {
                var json = JSON.stringify(rr[0]);
                var avg = JSON.parse(json);

                data = data.toString().replace('$num$', avg['avg(gattend+gdaily+gfinal)'] == null ? 0.0 : avg['avg(gattend+gdaily+gfinal)']);
            } else
                data = data.toString().replace('$num$', '0.0');
        });
        query('select count(*) from grade where grade.cno=\'' + cno + '\' and grade.gattend+grade.gdaily+grade.gfinal>=60;', (err, rr) => {
            if (err) {
                throw err;
            }
            var total = 0;
            var rate = 0;
            var pass = rr[0] == null ? 0 : JSON.parse(JSON.stringify(rr[0]))['count(*)'];
            query('select count(*) from grade where grade.cno=\'' + cno + '\';', (err, rr) => {
                if (err) {
                    throw err;
                }
                total = rr[0] == null ? 0 : JSON.parse(JSON.stringify(rr[0]))['count(*)'];
            });
            if (total == 0)
                rate = 0;
            else
                rate = pass / total;
            data = data.toString().replace('$num2$', rate);
        });

        //获取学生列表
        query('select sname,student.sno,gattend,gdaily,gfinal ' +
            'from student,grade ' +
            'where grade.cno=\'' + cno + '\' and student.sno=grade.sno;', (err, rr) => {
                if (err) {
                    throw err;
                }
                var sList = '';
                for (var i = 0;; ++i) {
                    if (rr[i] != null) {
                        var el = rr[i];
                        sList += '<li>' + el.sno + '&nbsp&nbsp' + el.sname + '&nbsp&nbsp出勤：<input class="grade" type="text" id="' +
                            el.sno + '_attend" placeholder="' + el.gattend + '">&nbsp平时：<input class="grade" type="text" id="' + el.sno +
                            '_daily" placeholder="' + el.gdaily + '">&nbsp期末：<input class="grade" type="text" id="' + el.sno +
                            '_final" placeholder="' + el.gfinal + '"></li>';
                    } else {
                        break;
                    }
                }
                data = data.toString().replace('$li$', sList);
            });

        //课堂通知
        query('select * from notice where notice.cno=\'' + cno + '\';', (err, rr) => {
            if (err) {
                throw err;
            }
            var nList = '';
            for (var i = 0;; ++i) {
                if (rr[i] != null) {
                    var el = rr[i];
                    nList += '<li>' + el.ntime + '<p style="height:150px">' + el.ntext + '</p></li>';
                } else {
                    break;
                }
            }
            data = data.toString().replace('$li2$', nList);
            event.on('data_end', function() {
                res.end(data.toString());
            });
            setTimeout(function() {
                event.emit('data_end');
            }, 1000);
        });
    });
}

function query(qstr, func) {
    //创建数据库链接
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });
    connection.connect();

    //查询语句
    connection.query(qstr, func);
    connection.end();
}