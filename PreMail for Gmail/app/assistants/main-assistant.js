/*
        
    _____          __  __       _ _ 
    |  __ \        |  \/  |     (_) |
    | |__) | __ ___| \  / | __ _ _| |
    |  ___/ '__/ _ \ |\/| |/ _` | | |
    | |   | | |  __/ |  | | (_| | | |
    |_|   |_|  \___|_|  |_|\__,_|_|_|
                                    
                                    
    Copyright (c) John Spahr 2020-2021
*/

function MainAssistant() {
    this.baseURL = "https://mail.google.com/"; //used everywhere, so set as base URL
}

MainAssistant.prototype.setup = function() {
    //check if first run
    var currVersion = Mojo.Controller.appInfo.version;
    var firstRun = new Mojo.Model.Cookie("firstRun" + currVersion);
    if (firstRun.get() == undefined) {
        //if first run, show version info
        firstRun.put(false);
        Mojo.Controller.stageController.pushScene("info");
    }

    //set up browser
    this.browserAtt = {
        url: this.baseURL,
        cacheAdapter: true,
        setEnableJavaScript: true,
        setShowClickedLink: true,
        setBlockPopups: true,
        setAcceptCookies: true,
        minFontSize: 18
    };

    //initialize browser
    this.controller.setupWidget('browser', this.browserAtt, this.model);

    //setup command menu...
    this.cmdMenuAttributes = {
        menuClass: 'no-fade'
    }
    this.commandMenuModel = {
        items: [{},
            {
                items: [
                    { items: [{ iconPath: "images/inbox.png", command: "inbox" }] },
                    { items: [{ iconPath: "images/compose.png", command: "compose" }] },
                    { items: [{ iconPath: "images/contacts.png", command: "contacts" }] },
                    { items: [{ iconPath: "images/star.png", command: "starred" }] },
                    { items: [{ iconPath: "images/search.png", command: "search" }] }
                ]
            }, {

            }
        ]
    };
    this.menuAttr = {
        omitDefaultItems: true
    };

    //initialize cmd menu...
    this.controller.setupWidget(Mojo.Menu.commandMenu, this.cmdMenuAttributes, this.commandMenuModel);

    //loadingSpinner
    this.controller.setupWidget("loadingSpinner",
        this.attributes = {
            spinnerSize: "small"
        },
        this.model = {
            spinning: false,
            visible: false
        }
    );

    //when loading starts
    Mojo.Event.listen(this.controller.get("browser"), Mojo.Event.webViewLoadStarted, this.handleStartLoading.bind(this));

    //when loading ends
    Mojo.Event.listen(this.controller.get("browser"), Mojo.Event.webViewLoadStopped, this.handleStopLoading.bind(this));

    //setup app menu...
    this.appMenuModel = {
        items: [
            { label: "Selected Text" },
            Mojo.Menu.editItem,
            { label: "Email" },
            { label: "Inbox", command: "inbox", shortcut: "i" },
            { label: "Starred", command: "starred", shortcut: "s" },
            { label: "Sent", command: "sent", shortcut: "n" },
            { label: "Drafts", command: "drafts", shortcut: "d" },
            { label: "All Mail", command: "allMail", shortcut: "l" },
            { label: "Spam", command: "spam", shortcut: "p" },
            { label: "Trash", command: "trash", shortcut: "t" },
            { label: "Contacts", command: "contacts", shortcut: "o" },
            { label: "Compose", command: "compose", shortcut: "e" },
            { label: "Search", command: "search", shortcut: "h" },
            { label: "Gmail Menu", command: "gmailMenu", shortcut: "m" },
            { label: "Sign Out", command: "signOut" },
            { label: "PreMail" },
            { label: "User Guide", command: "guide", shortcut: "g" },
            { label: "What's New", command: "changelog" },
            Mojo.Menu.helpItem
        ]
    };

    //initialize app menu...
    this.controller.setupWidget(Mojo.Menu.appMenu, this.menuAttr, this.appMenuModel); //set up app menu

    //initialize (top) viewMenu
    this.viewMenuModel = {
        items: [{
            items: [
                { label: $L('Back'), icon: "back", command: "goBack" },
                { label: $L('PreBook'), width: 200, command: "refreshPage" },
                { label: $L('Forward'), icon: "forward", command: "goForward" }
            ]
        }]
    };
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, this.viewMenuModel);

    //handle screen orientation changes...
    this.controller.window.addEventListener('resize', this.orientationChanged.bind(this)); //required for TouchPad
    this.orientationChanged();
};

MainAssistant.prototype.orientationChanged = function(orientation) {
    //update top header bar width
    var topWidgetSetup = this.controller.getWidgetSetup(Mojo.Menu.viewMenu);
    var topWidgetModel = topWidgetSetup.model;
    topWidgetModel.items[0].items[1].width = this.controller.window.innerWidth - 120;

    //update bottom command bar, too
    var bottomWidgetSetup = this.controller.getWidgetSetup(Mojo.Menu.commandMenu);
    var bottomWidgetModel = bottomWidgetSetup.model;

    //tell Mojo to update header and command bar
    this.controller.modelChanged(topWidgetModel);
    this.controller.modelChanged(bottomWidgetModel);
};

MainAssistant.prototype.activate = function(event) {};

MainAssistant.prototype.deactivate = function(event) {
    //remove event handlers...
    this.controller.window.removeEventListener('resize', this.orientationChanged);
    Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadStarted, this.handleStartLoading);
    Mojo.Event.stopListening(this.controller.get('browser'), Mojo.Event.webViewLoadStopped, this.handleStopLoading);
};

MainAssistant.prototype.cleanup = function(event) {

};

MainAssistant.prototype.handleHeaderPress = function(event) {
    //show navigation menu...
    this.controller.showAlertDialog({
        onChoose: function(value) {
            switch (value) {
                case "yes":
                    //if user accepts prompt to reload page...
                    this.controller.get('browser').mojo.reloadPage(); //reload page
                    break;
            }
        },
        title: "Refresh Page",
        message: "Do you want to refresh the page?",
        choices: [
            { label: "Yes", value: "yes", type: "affirmative" },
            { label: "No", value: "no", type: "negative" }
        ]
    });
};

MainAssistant.prototype.handleStartLoading = function(event) {
    //show loading spinner
    this.controller.get('loadingSpinner').visible = true;
    this.controller.get('loadingSpinner').mojo.start();
};

MainAssistant.prototype.handleStopLoading = function(event) {
    //hide loading spinner
    this.controller.get('loadingSpinner').visible = false;
    this.controller.get('loadingSpinner').mojo.stop();
};

MainAssistant.prototype.handleCommand = function(inEvent) {
    //handle commands...
    switch (inEvent.command) {
        case "inbox":
            this.controller.get('browser').mojo.openURL(this.baseURL); //inbox
            break;

        case "starred":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/12up2sjxiqwwd-/?&s=r"); //starred
            break;

        case "sent":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/12pq1qd1ci6xv-/?&s=s"); //sent mail
            break;

        case "drafts":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/1i84fm4zc0bxk-/?&s=d"); //drafts
            break;

        case "allMail":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/pzoq716qvjkp-/?&s=a"); //all mail
            break;

        case "spam":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/ma1nuwutpmel-/?&s=m"); //spam
            break;

        case "trash":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/susauf8irc3r-/?&s=t"); //trash
            break;

        case "contacts":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/10milw7k1x8o8-/?&v=cl"); //contacts
            break;

        case "compose":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/1dg50kyayls3-/?&cs=b&pv=tl&eot=1&v=b"); //compose
            break;

        case "search":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/1cv2jcedlx3bp-/?&v=srch"); //search
            break;

        case "refreshPage":
            this.handleHeaderPress(inEvent); //prompt user to reload page
            break;

        case "goBack":
            this.controller.get('browser').mojo.goBack(); //go back
            break;

        case "goForward":
            this.controller.get('browser').mojo.goForward(); //go forward
            break;

        case "gmailMenu":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/u/0/x/30zu6dn19rbg-/?&v=mnu"); //gmail menu
            break;

        case "signOut":
            this.controller.get('browser').mojo.openURL(this.baseURL + "mail/logout"); //sign out
            break;

        case "changelog":
            Mojo.Controller.stageController.pushScene("info"); //changelog scene
            break;

        case "guide":
            Mojo.Controller.stageController.pushScene("guide"); //guide scene
            break;
    }

};