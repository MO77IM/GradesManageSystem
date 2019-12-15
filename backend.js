var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//返回学生登录界面
app.post('/stu_login.html', function(req, res){
	var id = req.body.sno;
	var pwd = req.body.spwd;
	var str = 'select * from Student where sno=\'' + id + '\' && spwd=\'' + pwd + '\';';
	query(str, (err, result)=>{
		if (err){
			throw err;
		}
		if (result[0] != null){
			fs.readFile(__dirname + '/stu_login.html', function(err, data){
				if (err){
					throw err;
				}
				var name = result[0].sname;
				data = data.toString().replace('$name$', result[0].sname);
				query('select * from Course;', function(err, rr){
					if (err){
						throw err;
					}
					var courseStr = '';
					for (var i=0;;++i){
						if (rr[i] != null){
							var el = rr[i];
							courseStr += '<li>' + el.cno + ': ' + el.cname + '</li>';
						}else{
							break;
						}
					}
					data = data.toString().replace('$li$', courseStr);
					res.end(data.toString());
				})
			});
		}else{
			res.end('登录失败');
		}
	});
});

//返回教师登录界面
app.post('/teacher_login.html', function(req, res){
	var id = req.body.sno;
	var pwd = req.body.spwd;
	var str = 'select * from Teacher where tno=\'' + id + '\' && tpwd=\'' + pwd + '\';';
	query(str, (err, result)=>{
		if (err){
			throw err;
		}
		if (result[0] != null){
			fs.readFile(__dirname + '/teacher_login.html', function(err, data){
				if (err){
					throw err;
				}
				data = data.toString().replace('$name$', result[0].tname);
				res.write(data);
				res.end();
			});
		}else{
			res.end('登录失败');
		}
	});
});

app.listen(3000, function(){
    console.log('running on 3000...');
});

function query(qstr, func){
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
