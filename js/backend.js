var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/student_login', function(req, res){
	var id = req.body.sno;
	var pwd = req.body.spwd;
	var str = 'select * from Student where sno=\'' + id + '\' && spwd=\'' + pwd + '\';';
	query(str, (err, result)=>{
		if (err){
			throw err;
		}
		if (result[0] != null){
			res.send('你好 ' + result[0]['sname']);
		}else{
			res.send('登录失败');
		}
	});
});

app.post('/teacher_login', function(req, res){
	var id = req.body.sno;
	var pwd = req.body.spwd;
	var str = 'select * from Teacher where sno=\'' + id + '\' && spwd=\'' + pwd + '\';';
	query(str, (err, result)=>{
		if (err){
			throw err;
		}
		if (result[0] != null){
			res.send('你好 ' + result[0]['tname']);
		}else{
			res.send('登录失败');
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
