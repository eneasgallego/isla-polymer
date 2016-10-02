Polymer({
    is: 'kd-filtro-bool',
    behaviors: [kdBaseBehavior],
    properties: {
        texto: {
            type: String,
            value: ''
        },
        value: Array,
        datasetCombo: {
            type: Array,
            value: []
        },
        fieldId: {
            type: String,
            value: 'id'
        },
        fieldTexto: {
            type: String,
            value: 'texto'
        }
    },
    ready: function() {
        this.set('datasetCombo', [{
            id: 'si',
            texto: 'Sí',
            unico: true,
            value: true
        },{
            id: 'no',
            texto: 'No',
            unico: true,
            value: false
        }]);
    },
    filtrar: function(val) {
        var ret = true;

        var value = this.get('value');
        if (value.length) {
            value = value[0];
            value = this.get('datasetCombo').buscar('id', value);
            if (value) {
                ret = val == value.value;
            }
        }

        return ret;
    }
});
