//数据库
document.onload = function(){
}

function studentLogin(){
	//document.login_form.action = 'http:127.0.0.1:3000/stu_login.html';
	setCookie('sno', document.getElementById('sno').value);
	console.log(document.getElementById('sno').value);
	console.log(getCookie('sno'));
}

function teacherLogin(){
	document.login_form.action = 'http:127.0.0.1:3000/teacher_login.html';
}
