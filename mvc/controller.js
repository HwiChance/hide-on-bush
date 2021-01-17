/**
 *   @module Controller
 *
 *   Links user input and view output.
 */
(function(exports) {
    function Controller(appStateModel, keywordModel, userModel, view) {
        this.isKeyowrdTab = true;
        this.appStateModel = appStateModel;
        this.keywordModel = keywordModel;
        this.userModel = userModel;
        this.view = view;

        this.appStateModel.getAppState(this.setAppState.bind(this))
        this.keywordModel.getKeywordList(this.setChips.bind(this));
        this.userModel.getUserList(this.setTabs.bind(this));
    }

    Controller.prototype = {
        setAppState: function(state) {
            this.view.setOnOffBtn(state);
            $("#onoff-btn").on("change", this.appStateChangeListener.bind(this));
        },
        setChips: function(model) {
            this.setAddChip();

            this.view.drawAllChips(model);
            $(".chip").on("click", this.chipClickListener.bind(this));
            $("input[name=keyword-searcher]").on("input", this.searchBarInputListener.bind(this));
            $("#clear-btn").on("click", this.searchResetListener.bind(this));
        },
        setAddChip: function() {
            this.view.drawAddChip();
            $(".add-chips-field").on("click", this.addChipClickListener.bind(this));
            $(".add-chips-field input").on({
                blur: this.addChipBlurListener.bind(this),
                input: this.addChipInputListener.bind(this),
                keypress: this.addChipKeypressListener.bind(this)
            })
        },
        setTabs: function() {
            $("input:radio[name=tabs]").on("change", this.tabClickListener.bind(this));
        },
        appStateChangeListener: function(event) {
            this.appStateModel.setAppState(event.target.checked);
            this.view.setOnOffBtnActive();
            this.view.toggleOnOffBtn(event.target.checked);
            if (event.target.checked) {
                this.sendMsgToContent("switch-on");
            } else {
                this.sendMsgToContent("switch-off");
            }
        },
        addChipClickListener: function() {
            this.view.addChipActivate();
        },
        addChipBlurListener: function() {
            this.view.removeErrorBubble();
            this.view.addChipDeactivate();
        },
        addChipKeypressListener: function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();

                this.view.removeErrorBubble();

                var newText = $(event.target).val().trim();
                var errMsg = this.checkTextValidation(newText);
                if (errMsg) {
                    this.view.printErrorBubble(errMsg);
                } else {
                    this.view.addChip(this.chipClickListener.bind(this), newText);
                    if (this.isKeyowrdTab) {
                        this.keywordModel.addNewKeyword(newText);
                        this.sendMsgToContent("keyword-add");
                    } else {
                        this.userModel.addNewUser(newText);
                        this.sendMsgToContent("user-add");
                    }
                    $(event.target).blur();
                }
            }
        },
        addChipInputListener: function(event) {
            this.view.removeErrorBubble();

            var text = this.checkTextLength($(event.target).val());
            this.view.setAddChipInputText(text);
        },
        chipClickListener: function(event) {
            var data = event.target.innerText;
            if (this.isKeyowrdTab) {
                this.keywordModel.deleteKeyword(data);
                this.sendMsgToContent("keyword-delete");
            } else {
                this.userModel.deleteUser(data);
                this.sendMsgToContent("user-delete");
            }
            this.view.removeChip($(event.target));
        },
        checkTextValidation: function(text) {
            if (text == '') {
                return "유효하지 않은 문자열입니다."
            }
            if (this.isKeyowrdTab) {
                if (this.keywordModel.keywordList.has(text)) {
                    return "이미 존재합니다."
                }
            } else {
                if (this.userModel.userList.has(text)) {
                    return "이미 존재합니다."
                }
            }
            return null;
        },
        checkTextLength: function(text) {
            var len = 0;
            for (var i = 0; i < text.length; i++) {
                if (escape(text.charAt(i)).length == 6) {
                    len++;
                }
                len++;
                if (len > 34) {
                    this.view.printErrorBubble("더이상 입력할 수 없습니다.");
                    return text.substring(0, i);
                }
            }
            return text;
        },
        tabClickListener: function(event) {
            this.view.removeAllChips();
            this.view.resetSearchBar();
            if ($("input:radio[name=tabs]:checked").val() === 'keyword-tab') {
                this.isKeyowrdTab = true;
                this.keywordModel.getKeywordList(this.setChips.bind(this));
            } else {
                this.isKeyowrdTab = false;
                this.userModel.getUserList(this.setChips.bind(this));
            }
        },
        searchBarInputListener: function(event) {
            this.searchString = event.target.value;
            this.view.toggleClearBtn(Boolean(this.searchString));
            if (this.isKeyowrdTab) {
                this.keywordModel.getKeywordList(this.setFilteredChips.bind(this));
            } else {
                this.userModel.getUserList(this.setFilteredChips.bind(this));
            }
        },
        setFilteredChips: function(model) {
            var matchedKeywords = [];
            for (var data of model) {
                if (data.match(this.searchString)) {
                    matchedKeywords.push(data);
                }
            }
            if (!(this.isArraysEqual(this.prevSearched, matchedKeywords))) {
                this.view.removeAllChips();
                if (!Boolean(this.searchString)) {
                    this.setAddChip();
                }
                for (var data of matchedKeywords) {
                    this.view.addChip(this.chipClickListener.bind(this), data);
                }
            }
        },
        isArraysEqual: function(arr1, arr2) {
            if (arr1 === arr2) {
                return true;
            }
            if (arr1 == null || arr2 == null) {
                return false;
            }
            if (arr1.length != arr2.length) {
                return false;
            }

            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        },
        searchResetListener: function() {
            this.view.resetSearchBar();
            this.view.removeAllChips();
            if (this.isKeyowrdTab) {
                this.keywordModel.getKeywordList(this.setChips.bind(this));
            } else {
                this.userModel.getUserList(this.setChips.bind(this));
            }
        },
        sendMsgToContent: function(op) {
            var data = {
                onoff: this.appStateModel.appState,
                keywordList: Array.from(this.keywordModel.keywordList),
                userList: Array.from(this.userModel.userList)
            };
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    'op': op,
                    'data': data
                });
            });
        }
    };
    exports.Controller = Controller;
})(this);
