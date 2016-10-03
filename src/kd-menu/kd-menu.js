Polymer({
    is: 'kd-menu',
    properties: {
        menu: {
            type:Array,
            value: []
        },
        menuSeleccionado: {
            type: String,
            notify: true
        }
    },
    isFinalMenu: function(child) {
        return !child.menu;
    }
});
