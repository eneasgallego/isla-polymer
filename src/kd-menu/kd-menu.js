Polymer({
    is: 'kd-menu',
    properties: {
        menu: {
            type:Array,
            value: []
        }
    },
    onIronSelect: function(e, item) {
        this.fire('accion', item.item.tag);
    },
    isFinalMenu: function(child) {
        return !child.menu;
    }
});
