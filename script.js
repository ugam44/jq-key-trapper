$(function() {
    $("a.kt-action-button").on("click", function () {
       alert("all done!"); 
    });
    $(".kt-container:not(.container-one, .container-two)").keyTrapper({
        escape: [27, 123], // enter, f12
        trapKeys: [8, 97], // backspace, numPad1
        onActionButton: function() {
            var finished = confirm("Are you sure you want to submit the data?");
            if (finished) {
                this.actionButton.trigger("click");
            }
        }
    });

    $(".container-one").keyTrapper({
        escape: [27, 123], // esc, f12
        trapKeys: [8, 97], // backspace, numPad1
        actionButton: null,
        onLastInput: function() {
            $(".container-two").keyTrapper("option", "formInputs")[0][0].focus();
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
