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
            value: false
        }
    },
    toggle: function() {
        this.$.collapse.toggle();
    }
});
