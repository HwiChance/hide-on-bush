/**
 *   @module App View
 *
 *   Renders view of data
 **/
(function(exports) {
    function View() {

    }

    View.prototype = {
        setOnOffBtn: function(state) {
            var btn = $("#onoff-btn");
            btn.attr("checked", state);
            this.toggleOnOffBtn(state);
        },
        toggleOnOffBtn: function(state) {
            var text = $("#onoff-text");
            if (state) {
                text.attr("class", "onoff-text-on");
                text.text("ON");
            } else {
                text.attr("class", "onoff-text-off");
                text.text("OFF");
            }
        },
        setOnOffBtnActive: function() {
            $("label[name=onoff-label]").addClass("active");
        },
        drawAddChip: function() {
            var chipsWrapper = $(".chips-wrapper");
            var addChipsForm = $("<form/>")
                .addClass("add-chips-background");
            var addChipsDiv = $("<div/>")
                .addClass("add-chips-field")
                .append("<i class='fas fa-plus' aria-hidden='true'></i>")
                .append("<input type='text'>");
            addChipsForm.append(addChipsDiv);
            chipsWrapper.append(addChipsForm);
        },
        drawAllChips: function(model) {
            var chipsWrapper = $(".chips-wrapper");
            for (var data of model) {
                $("<Button/>")
                    .text(data)
                    .addClass('chip')
                    .appendTo(chipsWrapper);
            }
        },
        removeAllChips: function() {
            var addChipsForm = $(".add-chips-background");
            addChipsForm.remove();
            $(".chip").remove();
        },
        addChip: function(listener, text) {
            var chipsWrapper = $(".chips-wrapper");
            $("<Button/>")
                .text(text)
                .addClass('chip')
                .click(listener)
                .appendTo(chipsWrapper);
        },
        removeChip: function(element) {
            element.remove();
        },
        setAddChipInputText: function(text) {
            var addChipInput = $(".add-chips-field input");
            addChipInput.val(text);
        },
        addChipActivate: function() {
            var addChip = $(".add-chips-field");
            addChip.addClass("active");
            addChip.children("input").focus();
        },
        addChipDeactivate: function() {
            var addChipInput = $(".add-chips-field input");
            addChipInput.val('');
            addChipInput.parent().removeClass('active')
        },
        printErrorBubble: function(msg) {
            var pos = $(".add-chips-background")
                .first()
                .position();
            var bubble = $("<span/>")
                .addClass("formHintBubble")
                .css("left", pos.left + "px")
                .css("top", pos.top + "px")
                .append("<i class='fas fa-exclamation-triangle'></i> " + msg);
            bubble.insertAfter($(".chips-wrapper"));
        },
        removeErrorBubble: function() {
            var bubble = $(".formHintBubble");
            if (bubble) {
                bubble.remove();
            }
        },
        toggleClearBtn: function(visiblity) {
            $("#clear-btn").toggle(visiblity);
        },
        resetSearchBar: function() {
            $("#searchBar").val('');
            this.toggleClearBtn(false);
        }
    };

    exports.View = View;
})(this);
