/**
 * Created by wangxin on 2017/11/20.
 */

(function (win) {
    /**
     * 计数器，用于生成callbackID
     * @type {number}
     */
    var uniqueID = 1;
    /**
     * 跨域调用回调函数队列，一个callbackID对应一个函数
     * @type {{}}
     */
    var callbackIDFuncQueue = {};

    /**
     * 跨域模拟事件回调函数队列，一个事件名对应一个函数数组
     * @type {{}}
     */
    var eventCallbackFuncQueue = {};

    /**
     * 回调前缀
     * @type {string}
     */
    var callbackPrefix = 'callbackID_';

    /**
     * 消息类型-跨域调用远程方法
     * @type {number}
     */
    var CRS_MESSAGE_TYPE_INVOKEMETHOD = 1;

    /**
     * 消息类型-跨域发送回调信息
     * @type {number}
     */
    var CRS_MESSAGE_TYPE_CALLBACK = 2;

    /**
     * 消息类型-自定义事件
     * @type {number}
     */
    var CRS_MESSAGE_TYPE_EVENT = 3;

    win.addEventListener('message', function (e) {
        console.log('child')
        var data = e.data;
        if(typeof(e.data) !== "object"){
            data = JSON.parse(e.data);
        }
        var type = data.type;
        var func = null;
        if(type === CRS_MESSAGE_TYPE_INVOKEMETHOD) {
            var funcName = data.funcName;
            var parameters = data.parameters;
            try {
                parameters = JSON.parse(data.parameters);
            } catch(e) {
                parameters = data.parameters;
            }
            var result = null;
            if(typeof parameters === 'string') {
                result = eval(funcName + "('" + parameters + "')");
            } else {
                // 20180929 zhouyz 处理异常
                try {
                    result = eval(funcName + "(" + JSON.stringify(parameters) + ")");
                } catch (e) {
                    // console.log(""+e);
                }
            }
            sendCRSMessageWithCallbackID(e.source, result, data.callbackID);
        } else if(type === CRS_MESSAGE_TYPE_CALLBACK) {
            func = callbackIDFuncQueue[data.callbackID];
            if(func && typeof func === 'function') {
                func(data.content);
            }
        } else if(type === CRS_MESSAGE_TYPE_EVENT) {
            var funcList =  eventCallbackFuncQueue[data.eventName];
            if(funcList && funcList.length > 0) {
                var len = funcList.length;
                for(var i = 0; i < len; i++) {
                    func = funcList[i];
                    func(data.content, e.source);
                }
            }
        }
    }, false);

    var getCallbackID = function () {
        return callbackPrefix + uniqueID++ + new Date().getTime();
    };

    /**
     * 发送跨域消息，该访问与<code>invokeCRSMethod</code>成对使用，callbackID由<code>invokeCRSMethod</code>传入
     * 使用场景：跨域方法调用回调：这时需要将跨域方法调用时，传入的callbackID传入
     * @param otherWindow 接受消息的window
     * @param content 消息内容
     * @param callbackID 回调ID
     */
    var sendCRSMessageWithCallbackID = function(otherWindow, content, callbackID) {
        if(callbackID && callbackID.indexOf(callbackPrefix) !== -1) {
            var messageBody = {};
            messageBody.callbackID = callbackID;
            messageBody.content = content;
            messageBody.type = CRS_MESSAGE_TYPE_CALLBACK;
            otherWindow.postMessage(JSON.stringify(messageBody), '*');
        } else {
            console.error('非法的callbackID');
        }
    };

    win.CRSMessager = {
        /**
         * 调用跨域方法
         * 使用场景：需要调用跨域window中的方法
         * @param otherWindow 跨域方法所在的window
         * @param targetFuncName 目标函数名
         * @param parameters 目前函数的参数，JSON对象
         * @param callback 回调处理函数
         */
        invokeCRSMethod: function(otherWindow, targetFuncName, parameters, callback) {
            var messageBody = {};
            var callbackID = getCallbackID();
            messageBody.callbackID = callbackID;
            messageBody.funcName = targetFuncName;
            messageBody.parameters = parameters;
            messageBody.type = CRS_MESSAGE_TYPE_INVOKEMETHOD;
            if(callback && typeof callback === 'function') {
                callbackIDFuncQueue[callbackID] = callback;
            }
            otherWindow.postMessage(JSON.stringify(messageBody), '*');
        },

        /**
         * 分发一个跨域自定义事件
         * @param otherWindow 接收事件消息的窗口
         * @param eventName 事件名称
         * @param content 事件消息内容
         */
        dispatchCRSEvent: function (otherWindow, eventName, content) {
            if(eventName) {
                var messageBody = {};
                messageBody.eventName = eventName;
                messageBody.content = content;
                messageBody.type = CRS_MESSAGE_TYPE_EVENT;
                otherWindow.postMessage(JSON.stringify(messageBody), '*');
            }
        },

        /**
         * 绑定一个跨域自定义事件处理回调
         * @param eventName 事件名称
         * @param callback 回调函数
         */
        bindCRSEvent: function (eventName, callback) {
            if(eventName) {
                var funcList = eventCallbackFuncQueue[eventName];
                if(!funcList) {
                    funcList = [];
                    eventCallbackFuncQueue[eventName] = funcList;
                }
                funcList.push(callback);
            } else {
                console.error('非法事件名');
            }
        },

        /**
         * 取消一个事件所有绑定的函数
         * @param eventName 事件名称
         */
        unBindCRSEvent: function (eventName) {
            if(eventName) {
                var funcList = eventCallbackFuncQueue[eventName];
                if(funcList) {
                    funcList = null;
                    delete eventCallbackFuncQueue[eventName];
                }
            }
        }
    };
})(window);
