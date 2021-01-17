document.addEventListener('DOMContentLoaded', function(e) {
    var appStateModel = new AppStateModel();
    var keywordModel = new KeywordModel();
    var userModel = new UserModel();
    var view = new View();
    var controller = new Controller(appStateModel, keywordModel, userModel, view);
});
