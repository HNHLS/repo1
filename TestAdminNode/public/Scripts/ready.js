//var userurl="http://localhost:8001";
//var basicsurl="http://localhost:8001";
//var equipmenturl="http://localhost:8001";
//var taskurl="http://localhost:8001";
//var jwttoken="";


// 本地缓存
function storageSave(objectData) {
    localStorage.setItem(objectData.Name, JSON.stringify(objectData));
}

function storageLoad(objectName) {
    if (localStorage.getItem(objectName)) {
        return JSON.parse(localStorage.getItem(objectName))
    } else {
        return false
    }
}

//验证当前页是否登录
function checklogin(){
	if(storageLoad("UserInfo")){
		return true;
	}else
	{
		window.location.href="login.html"
	}
}



