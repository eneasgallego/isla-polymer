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
        }
    },
    toggle: function() {
        this.$.collapse.toggle();
    }
});
