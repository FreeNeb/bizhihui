var ws = new ReconnectingWebSocket("wss://api.kkcoin.com/ws/KK_ETH@book");
ws.debug = false;
ws.timeoutInterval = 40000;
ws.reconnectInterval = 12000;

var query_asset_name="KK_ETH"
var query_order_type = "bid";
var query_order_type_name = "买入限价单";
var query_order_price = 0;

var query_result = [];
var orderMap = new Map(); // <price_level,amount>
var eth_price = 0;

// for nas
var dappAddress = "n1qTiVz1gVEjvQzagBPvxChJbks9dALo1jr";
// dapphash :5a12cd7585ba53f112ab1b633c6dc4bfea7a78dd27abd0ac23198820e3385011
 
 // for test nebuls
 var nebulas = require("nebulas");
 var Account = nebulas.Account;
 var neb = new nebulas.Neb();
 neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
 // https://mainnet.nebulas.io
 // neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
 var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
 var nebPay = new NebPay();
 var serialNumber;


// Websocket连接异常
ws.onerror = onError;
// ws.onopen = onOpen;
ws.onclose =onClose;


function onError(event) {
    
    orderMap.clear()    
    alert("WebSocket onError 连接异常" + event.data);
};

//与WebSocket建立连接
function onOpen(event) {
    console.log("WebSocket onOpen 建立连接");
    $("#tb_departments").bootstrapTable('removeAll');
    orderMap.clear()
    ws.onmessage = onMessage;
};

function onClose(event) {
    console.log("WebSocket onClose 建立连接");
    orderMap.clear()
}


//处理服务器返回的信息
function onMessage(event) {
    // console.log(event.data)
    var data = JSON.parse(event.data);
    // console.log(data);
    //updateAskOrderBook(data.a);
    // 获取卖价单
    if (query_order_type == "ask") {
        updateAskOrderBook(data.a);
    }
    else {
        // 获取买价单
        updateBidOrderBook(data.b);
    }
}

// // 获取ETH对应的人民币价格
// var ws2 = new ReconnectingWebSocket("wss://api.kkcoin.com/ws/ETH_bitCNY@ticker");
// ws2.onopen = function(event) {
//     ws2.onmessage = function(event){
//         var data = JSON.parse(event.data);
//         if (data.length >=4) {
//             eth_price = data[3];
//             console.log("ETH best price = "+eth_price);
            
//         }
        
//     }
// }

// 更新买价单(bid)
function updateBidOrderBook(bid) {
    for (var i = 0;i < bid.length; i++) {
        // price/amount
        var price = bid[i][0];
        var amount = bid[i][1];
        console.log(orderMap.get(price))
        if (parseFloat(amount) == 0) {
            orderMap.delete(price);
        }
        else {
            orderMap.set(price, amount);
        }
    }
    loadData();
}


// 更新卖价单(ask)
function updateAskOrderBook(ask) {
    for (var i = 0;i < ask.length; i++) {
        // price/amount
        var price = ask[i][0];
        var amount = ask[i][1];
        console.log(orderMap.get(price))

        if (parseFloat(amount) == 0) {
            orderMap.delete(price);
        }
        else {
            orderMap.set(price, amount);
        }
    }
    loadData();
}

function strMapToObj(strMap) {
    var ret = new Array();
    for (let [k,v] of strMap) {
       var  obj = new Object();
        obj.price = parseFloat(k);
        obj.amount = parseFloat(v);
        obj.value = obj.price*obj.amount;
        obj.cny = obj.value*eth_price;
        ret.push(obj);
    }
    return ret;
}

function loadData(){
    
    $('#tb_departments').bootstrapTable('load', strMapToObj(orderMap));

    //$("#tb_departments").bootstrapTable("refreshOptions",{sortStable:true});
    //$("#tb_departments").bootstrapTable("refreshOptions",{pageNumber:1});
    // $('#tb_departments').bootstrapTable('refresh');
    
    queryResultStr ='<span style="color:#FF0000"> '+ query_asset_name+query_order_type_name+"查询成功</span>";
    $('#title').html("当前查询的是："+queryResultStr);
}

function loadData2(total_amount, total_value) {
    $('#quote_total').html(formatValue(total_amount,2));
    $('#base_total').html(formatValue(total_value,2));
}



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

function statistics() {
    var total_amount=0; 
    var total_value=0;
    var totoal_cny=0;
    if (query_order_type == "ask") {
        for (let [k,v] of orderMap) {
            if (parseFloat(k) <= query_order_price) {
                total_amount = parseFloat(v)+total_amount;
                total_value = parseFloat(k)*parseFloat(v)+total_value;
                totoal_cny = total_value*eth_price;
            }
         }
    }
    else {
        for (let [k,v] of orderMap) {
            if (parseFloat(k) >= query_order_price) {
                total_amount = parseFloat(v)+total_amount;
                total_value = parseFloat(k)*parseFloat(v)+total_value;
                totoal_cny = total_value*eth_price;
            }
         }
    }
    
    $('#quote_total').html(formatValue(total_amount,2));
    $('#base_total').html(formatValue(total_value,2));
    $('#cny_total').html(formatValue(totoal_cny,2));
}

function ordertypeChange() {
    query_order_type = $('#search_ordertype').val(); // 限价单类型
    if (query_order_type=="bid") {
        // query_order_type_name ="买入限价单"
    }
    else {
        // query_order_type_name ="卖出限价单"
    }
}

function post_query(resp) {
    var result = resp.result    ////resp is an object, resp.result is a JSON string
    console.log("return of rpc call: " + JSON.stringify(result))

    if (result == "null") {
        console.log("交易失败")
    } else {
        console.log('post query start')
        var param1 ={"id":1,"method":"call","params":[0,"lookup_asset_symbols",[[query_asset_name]]]};
        ws.send(JSON.stringify(param1));
        // 查询进度条显示, 点击进度条会自动消除
        $("#loadingModal").modal('show');
    }
}

function limit_order_query() {
    console.log("filter_order_query"+query_asset_name);
    ws = new ReconnectingWebSocket("wss://api.kkcoin.com/ws/"+query_asset_name+"@book");
    ws.debug = false;
    ws.timeoutInterval = 40000;
    ws.reconnectInterval = 12000;
    ws.onerror = onError;
    ws.onopen = onOpen;
    ws.onclose = onClose;
    console.log("test");
}

function filter_order_query() {
    statistics()
}

$(function() {
    var to = dappAddress;
    var value = "0";
    var callFunction = "methodCallStatistic";
    var callArgs1 = "[\"limit_order\"]";
    var callArgs2 = "[\"filter_order\"]";

    $('#search_price').on('input propertychange', function() {
        console.log($(this).val());
        $('#search_price_cny').val($(this).val()*eth_price);
    });

    $button = $('#btn_query'); // 处理查询点击
    $button.click(function() {
        query_asset_name = $('#search_asset').val();
        query_order_type = $('#search_ordertype').val(); // 限价单类型
        query_order_price = $('#search_price').val(); //限价单范围
        if (query_order_type=="bid") {
            query_order_type_name ="买入限价单"
        }
        else {
            query_order_type_name ="卖出限价单"
        }
        if (isNaN(query_order_price)) {
            alert("输入了一个非法的数值，将被替换成默认值0查询所有");
            query_order_price = 0;
        }
        serialNumber = nebPay.call(to, value, callFunction, callArgs1, {    //使用nebpay的call接口去调用合约,
            listener: limit_order_query        //设置listener, 处理交易返回信息
        });
        // 查询进度条显示, 点击进度条会自动消除
        // $("#loadingModal").modal('show');
    });

    $button_filter = $('#btn_filter'); // 处理查询点击
    $button_filter.click(function() {
        serialNumber = nebPay.call(to, value, callFunction, callArgs2, {    //使用nebpay的call接口去调用合约,
            listener: filter_order_query        //设置listener, 处理交易返回信息
    });
        
    });
});
