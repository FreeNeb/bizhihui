"use strict";

var UserOperation = function(text) {
	if (text) {
		var obj = JSON.parse(text);
        var keys = Object.keys(obj);//获得对象属性名组成的数组
        for (var i = 0,len = keys.length; i < len; i++) {
            var key = keys[i];
            this[key] = new BigNumber(obj[key]);
        }
	} else {
	}
};

UserOperation.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var MarketOperation = function () {
    LocalContractStorage.defineMapProperty(this, "operationStatistic", {
        parse: function (text) {
           return new BigNumber(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    
    // store key for each
    LocalContractStorage.defineMapProperty(this, "arrayMap");

    // LocalContractStorage.defineMapProperty(this, "userOperationStatistic", {
    //     parse: function (text) {
    //        return text;
    //     },
    //     stringify: function (o) {
    //         return o;
    //     }
    // });
};

MarketOperation.prototype = {
    init: function () {
        this.size = 0;
    },

    methodCallStatistic: function(methodName) {
        // 1.统计查询接口被调用的次数
        // 2.统计用户调用接口的次数
        if (methodName === "") {
            throw new Error("empty method name");
        }

        var value = this.operationStatistic.get(methodName);

        // 添加到Method方法统计中
        if (value) {
            this.operationStatistic.put(methodName,value.plus(1));
        }
        else {
            this.operationStatistic.put(methodName,1);
            this.arrayMap.set(this.size, methodName);
            this.size = this.size+1;
        }

        // // 统计每个用户的行为
        // var from = Blockchain.transaction.from;
    
        // var userCountMap = this.userOperationStatistic.get(from);
        // if (userCountMap) {
        //     userCountMap[methodName] = userCountMap[methodName] ? userCountMap[methodName].plus(1) : 1;
        // }
        // else {
        //     var userOp = new UserOperation();
        //     userOp[methodName] = new 1;
        //     this.userOperationStatistic.put(from, userOp);
        // }
    },
    // getMethodStatisticByUser: function() {
    //     var user = Blockchain.transaction.from;
    //     return this.userOperationStatistic.get(user);

    // },
    getMethodStatisticByName: function(methodName) {
        methodName = methodName.trim();
        if ( methodName === "" ) {
            throw new Error("empty methodName")
        }
        return this.operationStatistic.get(methodName);

    },
    getMethodStatisc: function() {
        var result  = "";
        for(var i=0;i<this.size;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            result += "index:"+i+" key:"+ key + " value:" +object+"_";
        }
        return result;
    }
};
module.exports = MarketOperation;