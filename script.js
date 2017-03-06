var app = angular.module("myApp", [])
    .directive("keyTrapper", function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.keyTrapper({
                    escape: [27, 123], // enter, f12
                    trapKeys: [103, 105], // numPad7, numPad9
                    onTrapKey: function(event, prevValue) {
                        event.preventDefault();
                        alert("That key is not allowed, fool!");
                    },
                    onActionButton: function() {
                        var finished = confirm("Are you sure you want to submit the angular data?");
                        if (finished) {
                            this.actionButton.trigger("click");
                        }
                    }
                });
            }
        };
    })
    .controller("myCtrl", function($scope) {
        $scope.formControls = [{
            name: "ctrl1",
            value: "",
            type: "text",
            id: "ctrl1",
            ignore: false
        }, {
            name: "ctrl2",
            value: "",
            type: "checkbox",
            id: "ctrl2",
            ignore: false
        }, {
            name: "ctrl3",
            value: "",
            type: "text",
            id: "ctrl3",
            ignore: true
        }, {
            name: "ctrl4",
            value: "",
            type: "text",
            id: "ctrl4",
            ignore: false
        }];

        $scope.sendMessage = function() {
            alert("All done, angular!");
        };
    });

$(function() {
    $("a.kt-action-button").on("click", function() {
        alert("all done!");
    });
    $(".kt-container").keyTrapper({
        escape: [27, 123], // esc, f12
        trapKeys: [8, 97], // backspace, numPad1
        previous: [38], // up arrow
        onActionButton: function() {
            var finished = confirm("Are you sure you want to submit the data?");
            if (finished) {
                this.actionButton.trigger("click");
            }
        }
    });

    $(".container-one").keyTrapper({
        escape: [27, 123], // esc, f12
        next: [40], // enter, down arrow
        trapKeys: [8, 97], // backspace, numPad1
        actionButton: null,
        onLastInput: function() {
            $(".container-two").keyTrapper("option", "formInputs")[0].focus();
        },
        custom: {
            "save": {
                keys: [["ctrl", 13]],
                handler: function (trigger, options) {
                    options.onLastInput();
                }
            }
        }
    });
    $(".container-two").keyTrapper({
        escape: [27, 123], // esc, f12
        trapKeys: [8, 97], // backspace, numPad1
        actionButton: $("#myBtn"),
        onActionButton: function() {
            alert("woot!");
        }
    });
});
