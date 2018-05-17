// 格式化金额数字函数
var formatValue = function (s, n) { 
    n = n > 0 && n <= 20 ? n : 2; 
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
    t = ""; 
    for (i = 0; i < l.length; i++) { 
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
        } 
    return t.split("").reverse().join("") + "." + r; 
} 

function convetToUnixTime(str) {
    // str = str.replace(/-/g,"/");
    // var date = new Date(str); 
    // var humanDate = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(), date.getSeconds())); 
    //return (humanDate.getTime()/1000 - 8*60*60);
    return new Date(str).getTime()/1000|0;
}
function convertDateToUTC(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function convertUTC2LocalDate(utc) {
    return (new Date(utc).getTime()*1000).toLocaleString();
}

function asset_to_real(amount, precision) {
    return amount / Math.pow(10, precision);
}