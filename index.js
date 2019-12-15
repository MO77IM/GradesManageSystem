//数据库
document.onload = function(){
}

function studentLogin(){
	document.login_form.action = 'http:127.0.0.1:3000/stu_login.html';
}

function teacherLogin(){
	document.login_form.action = 'http:127.0.0.1:3000/teacher_login.html';
}
