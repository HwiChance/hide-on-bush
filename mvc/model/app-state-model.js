/**
 *   @module App State Model
 *
 *   Manages state data of the application
 **/
(function(exports) {
    function AppStateModel() {
        this.appState = null;
    }

    AppStateModel.prototype = {
        getAppState: function(callback) {
            if (this.appState == null) {
                chrome.storage.sync.get(['onoff'], function(data) {
                    this.appState = data.onoff;
                    callback(this.appState);
                }.bind(this));
            } else {
                callback(this.appState);
            }
        },
        setAppState: function(state) {
            chrome.storage.sync.set({
                'onoff': state
            });
        }
    }

    exports.AppStateModel = AppStateModel;
})(this);
