
window.onload = function init()
{
	document.getElementById('login_form').addEventListener('submit', submitForm);

	function subButtonClicked(type){
		alert(type.value);
		document.getElementById('stu_button').submit();
	}

	function submitForm(e){
		e.preventDefault();

		var no = getInputValue('sno');
		var pwd = getInputValue('spwd');
	}
}