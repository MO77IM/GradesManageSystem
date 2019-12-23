window.onload = () => {
        var welcome = document.getElementsByTagName('h1')[0];
        welcome.innerHTML = '欢迎 ' + '$name$' + ' 同学';

        var arr = document.getElementsByClassName("check");

        for (var i = 0; i < arr.length; i++) {
            arr[i].onclick = function() {
                var input = $("<input type='hidden' name='check_cno' />")
                input.attr('value', this.value);
                alert("aaaa");
                var myform = $('#select_class_form');

                myform.append(input);
                myform.submit()
            }
        }
    };