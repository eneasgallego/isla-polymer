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
        mostrar: {
            type: Boolean,
            value: false,
            observable: 'mostrarEvento',
            notify: true
        }
    },
    toggle: function() {
        this.$.collapse.toggle();
        this.fire(this.get('mostrar') ? 'abrir' : 'cerrar');
    }
});
