const {app, WebContentsView, BaseWindow } = require('electron');

var DOUBLE_CLICK_DELAY = 1000; // in ms
var DOUBLE_CLICK_RADIUS_SQR = 2500; // square of radius in pixels
var BLOCK_KEYBOARD = false;

// radial double-click
class DoubleclickSetup
{
    lstLeftPress = 0;
    lstLeftPos = {x: 0, y:0};
    lstRightPress = 0;
    lstRightPos = {x:0, y:0};
    tab;

    constructor(window, tab)
    {
        // window = null;
        this.tab = tab;
        console.log("setting up: ", window, tab);
        this.tab.webContents.on('input-event', (event, input) => {
            if (input.type != 'mouseMove')
                console.log("sending an", input.type);
            switch(input.type)
            {
                case 'mouseDown':
                    switch(input.button)
                    {
                        case 'left':
                            this.looseDoubleClickCheck(input, event);
                            this.lstLeftPress = Date.now();
                            this.lstLeftPos = {x: input.x, y: input.y};
                         break ;
                        case 'right':
                            this.lstRightPress = Date.now();
                            this.lstRightPos = {x: input.x, y: input.y};
                         break ;
                    }
                 break ;
                // case 'mouseUp':
                //     switch(input.button)
                //     {
                //         case 'left':
                //          break ;
                //         case 'right':
                //          break ;
                //     }
                //  break ;
                // case 'mouseMove':

                //  break ;
            }
        });
        if (BLOCK_KEYBOARD)
        {
            tab.webContents.on('before-input-event', (event, input) => {
                if (input.type === 'char' || input.type === 'rawKeyDown' || input.type === 'keyUp')
                    event.preventDefault();
            });
        }
    }
    
    async looseDoubleClickCheck(input, event)
    {
        if (Date.now() > this.lstLeftPress + DOUBLE_CLICK_DELAY)
            return ;
        const dx = input.x - this.lstLeftPos.x;
        const dy = input.y - this.lstLeftPos.y;
        if ((dx != 0 || dy != 0) && dx * dx + dy * dy < DOUBLE_CLICK_RADIUS_SQR)
        {
            this.tab.webContents.send('double-click2', { x: input.x, y: input.y });
            console.log("Firing!");
        }
        else
            console.log("radius exceeded or zero");
        this.lstLeftPress = 0;
    }
}

module.exports = DoubleclickSetup;