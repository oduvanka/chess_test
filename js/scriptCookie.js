var startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var nameCookie = "chessFen";

/*---------------Cookie---------------*/
/*функция сохраняет FEN в переменной cookie
cname - имя файла cookie
cvalue - значения ccokie
exdays - количество дней до истечения срока действия файла cookie*/
function setCookie(cvalue) {
    var cname = nameCookie;
	var exdays = 256;
	var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "='" + cvalue + "';" + expires + ";path=/";
}

/*функция получает cookie
cname - имя файла cookie*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*функция проверяет наличие файла cookie и, если есть, применяет содержимое*/
function checkCookie() {
    var myFEN = getCookie(nameCookie);
    if (myFEN != "") {
		startFen = myFen;
	}
}
