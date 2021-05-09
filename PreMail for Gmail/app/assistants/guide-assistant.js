function GuideAssistant() {

}

GuideAssistant.prototype.setup = function() {
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

GuideAssistant.prototype.activate = function(event) {

};

GuideAssistant.prototype.deactivate = function(event) {

};

GuideAssistant.prototype.cleanup = function(event) {

};

GuideAssistant.prototype.handleCommand = function(inEvent) {
    switch (inEvent.command) {
        case "closeScene":
            //close scene
            Mojo.Controller.stageController.popScene();
            break;
    }
};