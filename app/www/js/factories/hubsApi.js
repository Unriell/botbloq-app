/**
 * @ngdoc service
 * @name botbloq:hubsApiFactory
 *
 * @description
 *
 *
 * */
angular.module('botbloq')
    .factory('hubsApi', function ($rootScope, $q, $cordovaDeviceMotion, $websocket, toaster, $ionicPlatform) {
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

        function checkIp(ip, waiting) {
            console.log("checking ip: ", ip);
            api.connect('ws://' + ip + ':8889').then(function () {
                var ipFound = 'ws://' + ip + ':8889';
                toaster.clear([waiting]);
                toaster.success('Connected', "Intel found in: " + ip);
                api.connect(ipFound, 2000)
                    .then(function () {
                        api.UtilsAPIHub.server.setId("mobile");
                    });
            })
        }

        var api = new HubsAPI(15000, webSocketWrapper, $q);

        api.onClose = function (error) {
            console.error("closed", error);
        };
        api.onOpen = function () {
            console.log("open");
        };
        api.onReconnecting = function (error) {
            console.warn("reconnecting", error);
        };
        api.onMessageError = function (error) {
            console.error("message error", error);
        };
        api.onClientFunctionNotFound = function (hub, func) {
            console.error("closed", hub, func);
        };

        api.TopicsManager.client.getAcc = function () {
            return $cordovaDeviceMotion.getCurrentAcceleration();
        };

        api.TopicsManager.client.showToast = function (message) {
            toaster.info("received message", message);
        };

        api.findRosServer = function (ip) {
            var ipBase = ip.split('.'),
                waiting = toaster.wait({
                    title: 'Searching',
                    body: 'Looking for intel IP',
                    timeout: 10000
                });
            for (var i = 1; i < 256; i++) {
                ipBase[3] = i;
                var current_ip = ipBase.join('.');
                checkIp(current_ip, waiting);
            }
        };

        $ionicPlatform.ready(function () {
            if (window.networkinterface) {
                networkinterface.getIPAddress(function (ip) {
                    alert(ip);
                }, function (error){
                    console.error(error);
                });
            } else {
                api.findRosServer('192.168.43.159');
            }
        }, false);



        return api;
    });
