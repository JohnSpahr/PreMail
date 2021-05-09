function InfoAssistant() {

}

InfoAssistant.prototype.setup = function() {
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