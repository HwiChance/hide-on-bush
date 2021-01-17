/**
 *   @module Blocked User List Model
 *
 *   Manages blocked user data of the application
 **/
(function(exports) {
    function UserModel() {
        this.userList = null;
    }

    UserModel.prototype = {
        getUserList: function(callback) {
            if (this.userList == null) {
                chrome.storage.sync.get(['userList'], function(data) {
                    this.userList = new Set(data.userList);
                    callback(this.userList);
                }.bind(this));
            } else {
                callback(this.userList);
            }
        },
        addNewUser: function(user) {
            this.userList.add(user);
            chrome.storage.sync.set({
                'userList': Array.from(this.userList)
            });
        },
        deleteUser: function(user) {
            this.userList.delete(user);
            chrome.storage.sync.set({
                'userList': Array.from(this.userList)
            });
        }
    }

    exports.UserModel = UserModel;
})(this);
