class WindowEvents
{
    window = null;
    tab = null;

    constructor(window, tab)
    {
        window.on('resize', () => {
            tab.setBounds({x: 0, y: 0  , height: window.getContentBounds().height, width: window.getContentBounds().width});
        });
    }
}

module.exports = WindowEvents;