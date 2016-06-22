/**
 * @ngdoc service
 * @name botbloq:hubsApiFactory
 *
 * @description
 *
 *
 * */
angular.module('botbloq')
    .factory('hubsApi', function ($q, $cordovaDeviceMotion, $websocket, toaster) {
        function webSocketWrapper(url) {
            var ws = $websocket(url);
            ws.onMessage(function (ev) {
                ws.onmessage(ev);
            });
            ws.onOpen(function (ev) {
                ws.onopen(ev);
            });
            ws.onClose(function (ev) {
                ws.onclose(ev);
            });
            return ws;
        }


        var api = new HubsAPI(15000, webSocketWrapper, $q);
        api.connect("ws://127.0.0.1:8889", 2000)
            .then(function () {
                api.UtilsAPIHub.server.setId("mobile");
            });

        api.onClose = function (error){
            console.error("closed", error);
        };
        api.onOpen = function (){
            console.log("open");
        };
        api.onReconnecting = function (error){
            console.warn("reconnecting", error);
        };
        api.onMessageError = function (error){
            console.error("message error", error);
        };
        api.onClientFunctionNotFound = function (hub, func){
            console.error("closed", hub, func);
        };

        api.TopicsManager.client.getAcc = function () {
            return $cordovaDeviceMotion.getCurrentAcceleration();
        };

        api.TopicsManager.client.showToast = function (message) {
            toaster.pop('success', "received message", message);
        };

        return api;
    });
