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
    onIronSelect: function(e, item) {
        //this.fire('accion', item.item.tag);
    },
    isFinalMenu: function(child) {
        return !child.menu;
    }
});
