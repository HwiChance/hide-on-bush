/**
 *   @module Keyword List Model
 *
 *   Manages keyword data of the application
 **/
(function(exports) {
    function KeywordModel() {
        this.keywordList = null;
    }

    KeywordModel.prototype = {
        getKeywordList: function(callback) {
            if (this.keywordList == null) {
                chrome.storage.sync.get(['keywordList'], function(data) {
                    this.keywordList = new Set(data.keywordList);
                    callback(this.keywordList);
                }.bind(this));
            } else {
                callback(this.keywordList);
            }
        },
        addNewKeyword: function(keyword) {
            this.keywordList.add(keyword);
            chrome.storage.sync.set({
                'keywordList': Array.from(this.keywordList)
            });
        },
        deleteKeyword: function(keyword) {
            this.keywordList.delete(keyword);
            chrome.storage.sync.set({
                'keywordList': Array.from(this.keywordList)
            });
        }
    }

    exports.KeywordModel = KeywordModel;
})(this);
