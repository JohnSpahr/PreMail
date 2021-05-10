/*
        
    _____          __  __       _ _ 
    |  __ \        |  \/  |     (_) |
    | |__) | __ ___| \  / | __ _ _| |
    |  ___/ '__/ _ \ |\/| |/ _` | | |
    | |   | | |  __/ |  | | (_| | | |
    |_|   |_|  \___|_|  |_|\__,_|_|_|
                                    
                                    
    Copyright (c) John Spahr 2020-2021
*/

function StageAssistant() {
    /* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
    /* this function is for setup tasks that have to happen when the stage is first created */
    this.controller.setWindowOrientation("free");
    Mojo.Controller.stageController.pushScene("main");
}

StageAssistant.prototype.handleCommand = function(inEvent) {
    switch (inEvent.type) {
        case Mojo.Event.commandEnable:
            switch (inEvent.command) {
                case Mojo.Menu.helpCmd:
                    inEvent.stopPropagation();
                    break;
            }
            break;

        case Mojo.Event.command:
            switch (inEvent.command) {
                case Mojo.Menu.helpCmd:
                    this.controller.pushAppSupportInfoScene();
                    break;
            }
            break;
    }

};