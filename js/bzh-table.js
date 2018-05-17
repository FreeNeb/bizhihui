$(function() {
    // 1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    // 2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

});

var TableInit = function() {
    var oTableInit = new Object();
    // 初始化Table
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable(
                {
                    data : "", // json
                    // url:"" //请求后台的URL（*）
                    // method: 'get', //请求方式（*）
                    toolbar : '#toolbar', // 工具按钮用哪个容器
                    striped : true, // 是否显示行间隔色
                    cache : false,    // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination : true, // 是否显示分页（*）
                    sortable : true, // 是否启用排序
                    sortOrder : "asc", // 排序方式
                    queryParams : oTableInit.queryParams,// 传递参数（*）
                    sidePagination : "client", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber : 1, // 初始化加载第一页，默认第一页
                    pageSize : 100, // 每页的记录行数（*）
                    pageList : [ 50, 100 ,500], // 可供选择的每页的行数（*）
                    search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                    strictSearch : true,
                    showColumns : true, // 是否显示所有的列
                    showRefresh : true, // 是否显示刷新按钮
                    minimumCountColumns : 2, // 最少允许的列数
                    clickToSelect : true, // 是否启用点击选中行
                    height : 800, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId : "ID", // 每一行的唯一标识，一般为主键列
                    showToggle : true, // 是否显示详细视图和列表视图的切换按钮
                    cardView : false, // 是否显示详细视图
                    detailView : false, // 是否显示父子表
                    showFooter : true,
                    showExport : true, // 是否显示导出按钮
                    buttonsAlign : "right", // 按钮位置
                    exportTypes : [ 'json', 'xml', 'csv', 'txt', 'excel' ], // 导出文件类型
                    Icons : 'glyphicon-export',
                    columns : [
                            {
                                checkbox : true
                            },
                            {
                                field : 'price',
                                title : '报价',
                                sortable : true,
                                // formatter : function(value, row, index) {
                                //     // 通过判断单元格的值，来格式化单元格，返回的值即为格式化后包含的元素
                                //     return formatValue(value, 9);
                                // },
                                footerFormatter : function(value, role, index) {
                                    return "合计";
                                }
                            },
                            {
                                field : 'amount',
                                title : '数量(个)',
                                sortable : true,
                                formatter : function(value, row, index) {
                                    // 通过判断单元格的值，来格式化单元格，返回的值即为格式化后包含的元素
                                    var a = "";
                                    if (value > 100000) {
                                        var a = '<span style="color:#FF0000">'
                                                + formatValue(value, 5)
                                                + '</span>';
                                    }
                                    else {
                                        var a = '<span>'
                                                + formatValue(value, 5)
                                                + '</span>';
                                    }
                                    return a;
                                },
                                footerFormatter : function(value) {
                                    var count = 0;
                                    for ( var i in value) {
                                        count += value[i].amount;
                                    }
                                    return count;
                                }
                            },
                            {
                                field : 'value',
                                title : '价值',
                                sortable : true,
                                formatter : function(value, row, index) {
                                    // 通过判断单元格的值，来格式化单元格，返回的值即为格式化后包含的元素
                                    var a = "";
                                    if (value > 50000) {
                                        var a = '<span style="color:#FF0000">'
                                                + formatValue(value, 8)
                                                + '</span>';
                                    }
                                    else {
                                        var a = '<span>'
                                                + formatValue(value, 8)
                                                + '</span>';
                                    }
                                    return a;
                                },
                                footerFormatter : function(value) {
                                    var count = 0;
                                    for ( var i in value) {
                                        count += value[i].value;
                                    }
                                    return formatValue(count, 2);
                                }
                            } 
                            // ,
                            // {
                            //     field : 'cny',
                            //     title : 'CNY价值(≈)',
                            //     sortable : true,
                            //     formatter : function(value, row, index) {
                            //         // 通过判断单元格的值，来格式化单元格，返回的值即为格式化后包含的元素
                            //         var a = "";
                            //         if (value > 50000) {
                            //             var a = '<span style="color:#FF0000">'
                            //                     + formatValue(value, 2)
                            //                     + '</span>';
                            //         }
                            //         else {
                            //             var a = '<span>'
                            //                     + formatValue(value, 2)
                            //                     + '</span>';
                            //         }
                            //         return a;
                            //     },
                            //     footerFormatter : function(value) {
                            //         var count = 0;
                            //         for ( var i in value) {
                            //             count += value[i].cny;
                            //         }
                            //         return formatValue(count, 2);
                            //     }
                            // } 
                        ]
                });
    };

    // 得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            departmentname : $("#txt_search_departmentname").val(),
            statu : $("#txt_search_statu").val()
        };
        return temp;
    };
    return oTableInit;
};

var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {
        //初始化页面上面的按钮事件
    };

    return oInit;
};
