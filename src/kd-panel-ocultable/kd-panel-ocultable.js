Polymer({
    is: 'kd-panel-ocultable',
    behaviors: [kdBaseBehavior],
    properties: {
        titulo: {
            type: String,
            value: ''
        },
        subtitulo: {
            type: String,
            value: ''
        },
        flotante: {
            type: Boolean,
            value: false
        },
        mostrar: {
            type: Boolean,
            value: false,
            notify: true
        }
    },
    getClaseCollapse: function(flotante) {
        return flotante ? 'flotante' : '';
    },
    toggle: function() {
        this.$.collapse.toggle();
        this.fire(this.get('mostrar') ? 'abrir' : 'cerrar');
    }
});
