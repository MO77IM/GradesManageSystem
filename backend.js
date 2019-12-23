var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//返回学生登录界面
app.post('/stu_login.html', function(req, res) {
    var id = req.body.sno;
    var pwd = req.body.spwd;
    var str = 'select * from Student where sno=\'' + id + '\' && spwd=\'' + pwd + '\';';
    query(str, (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            fs.readFile(__dirname + '/stu_login.html', function(err, data) {
                if (err) {
                    throw err;
                }
                var name = result[0].sname;
                data = data.toString().replace('$name$', name).replace('$sno$', id);
                query('select * from Course;', function(err, rr) {
                    if (err) {
                        throw err;
                    }
                    //显示可选课程
                    var courseStr = '';
                    for (var i = 0;; ++i) {
                        if (rr[i] != null) {
                            var el = rr[i];
                            courseStr += '<li>' + el.cno + ': ' + el.cname + '<input type="checkbox" name="select_cno" style="float:right"/></li>';
                        } else {
                            break;
                        }

                    }
                    data = data.toString().replace('$li$', courseStr);
                    //res.end(data.toString());
                })

                //查询该学生已选课程与任课教师
                query('select cno,cname,tname ' +
                    'from course, teacher ' +
                    'where exists( ' +
                    'select * ' +
                    'from grade ' +
                    'where grade.cno=course.cno and grade.sno=\'' + id + '\' ' +
                    ') and teacher.tno=course.tno; ', (err, rr) => {
                        if (err) {
                            throw err;
                        }
                        var sCourseStr = '';
                        for (var i = 0;; ++i) {
                            if (rr[i] != null) {
                                var el = rr[i];
                                sCourseStr += '<li>' + el.cno + ': ' + el.cname + '&nbsp&nbsp&nbsp&nbsp&nbsp任课教师:' + el.tname +
                                    '<button class="check" value="' + el.cno + '" style="float:right;margin-right:5px;width:50px">查看</button>' + '</li>';
                            } else {
                                break;
                            }
                        }
                        data = data.toString().replace('$li2$', sCourseStr);
                        res.end(data.toString());
                    })

            });
        } else {
            res.end('登录失败');
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
                data = data.toString().replace('$name$', result[0].tname);

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
                    data = data.toString().replace('$li$', courseStr);
                    data = data.toString().replace('$sno$', id);
                    res.end(data.toString());
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
                data = data.toString().replace('$name$', result[0].cname);

                //获取学生在该课程的详细信息
                var cStr = 'select cname,tname,cscore,ctype,gattend,gdaily,gfinal ' +
                    'from course,teacher,grade ' +
                    'where grade.sno=\'' + sno + '\' and grade.cno=\'' + cno +
                    '\' and course.cno=\'' + cno + '\' and teacher.tno=course.tno;';
                query(cStr, (err, rr) => {
                    if (err) {
                        throw err;
                    }
                    var el = rr[0];
                    data = data.toString().replace('$cno$', cno);
                    data = data.toString().replace('$cname$', el.cname);
                    data = data.toString().replace('$tname$', el.tname);
                    data = data.toString().replace('$cscore$', el.cscore);
                    data = data.toString().replace('$ctype$', el.ctype);
                    data = data.toString().replace('$gattend$', el.gattend);
                    data = data.toString().replace('$gdaily$', el.gdaily);
                    data = data.toString().replace('$gfinal$', el.gfinal);
                    data = data.toString().replace('$gtotal$', el.gattend + el.gdaily + el.gfinal);
                    res.end(data.toString());
                });
            });
        } else {
            res.end('查询失败');
        }
    });
});

//教师管理课程页面
app.post('/teacher_course_info.html', function(req, res) {
    var cno = req.body.cno;
    query('select cname from course where course.cno=\'' + cno + '\';', (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0] != null) {
            fs.readFile(__dirname + '/teacher_course_info.html', function(err, data) {
                if (err) {
                    throw err;
                }
                data = data.toString().replace('$cname$', result[0].cname);
                query('select avg(gattend+gdaily+gfinal) from grade where grade.cno=\'' + cno + '\';', (err, rr) => {
                    if (err) {
                        throw err;
                    }
                    if (rr[0] != null) {
                        var json = JSON.stringify(rr[0]);
                        var avg = JSON.parse(json);

                        data = data.toString().replace('$num$', avg['avg(gattend+gdaily+gfinal)']==null? 0.0:avg['avg(gattend+gdaily+gfinal)']);
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
                    //console.log(total);
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
                                    '_final" placeholder="' + el.gfinal + '"></li>'
                            } else {
                                break;
                            }
                        }
                        //console.log("stulist");
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
                    res.end(data.toString());
                });
            });
        } else {
            res.end("查询失败");
        }
    });
});






app.listen(3000, function() {
    console.log('running on 3000...');
});

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