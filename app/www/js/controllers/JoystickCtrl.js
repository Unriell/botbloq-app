/**
 * @ngdoc controller
 * @name botbloq.controllers:JoysticCtrl
 *
 * @description
 *
 *
 * */
angular.module('botbloq')
    .controller('JoystickCtrl', function($scope, hubsApi){
        $scope.directionButtons = [
            {label: "UP"},
            {label: "DOWN"},
            {label: "RIGHT"},
            {label: "LEFT"}
        ];

        $scope.actionButtons = [
            {label: "action1"},
            {label: "action2"},
            {label: "action3"},
            {label: "action4"}
        ];

        $scope.actionClick = function(button) {
            hubsApi.TopicsManager.server.publishMobileAction(button.label);
        };
});
