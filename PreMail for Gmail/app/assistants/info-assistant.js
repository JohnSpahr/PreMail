/*
        
    _____          __  __       _ _ 
    |  __ \        |  \/  |     (_) |
    | |__) | __ ___| \  / | __ _ _| |
    |  ___/ '__/ _ \ |\/| |/ _` | | |
    | |   | | |  __/ |  | | (_| | | |
    |_|   |_|  \___|_|  |_|\__,_|_|_|
                                    
                                    
    Copyright (c) John Spahr 2020-2021
*/

function InfoAssistant() {

}

InfoAssistant.prototype.setup = function() {
    //setup command menu...
    this.cmdMenuAttributes = {
        menuClass: 'no-fade'
    }
    this.commandMenuModel = {
        items: [{
                items: []
            },
            {
                items: [
                    { label: $L('Close'), command: "closeScene" }
                ]
            },
            {
                items: []
            }
        ]
    };

    //initialize command menu...
    this.controller.setupWidget(Mojo.Menu.commandMenu, this.cmdMenuAttributes, this.commandMenuModel);
};

InfoAssistant.prototype.activate = function(event) {

};

InfoAssistant.prototype.deactivate = function(event) {

};

InfoAssistant.prototype.cleanup = function(event) {

};

InfoAssistant.prototype.handleCommand = function(inEvent) {
    switch (inEvent.command) {
        case "closeScene":
            //close scene
            Mojo.Controller.stageController.popScene();
            break;
    }
};