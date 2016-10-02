Polymer({
    is: 'kd-filtro-obj',
    behaviors: [kdBaseBehavior],
    properties: {
        texto: {
            type: String,
            value: ''
        },
        textoCompleto: {
            type: String,
            value: ''
        },
        textoLabel: {
            type: String,
            computed: 'getTextoLabel(texto, textoCompleto)'
        },
        mostrar: {
            type: Boolean,
            value: false
        },
        value: {
            type: Array,
            notify: true
        },
        values: {
            type: Array,
            computed: 'getValues(datasetCombo, fieldId, fieldTexto)'
        },
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
        },
        selAbs: {
            type: Boolean,
            value: false
        }
    },
    ready: function() {
        this.set('value', []);
        //this.changeValues();
    },
    getDefaultValues: function(fieldId, fieldTexto) {
        var ret = [];

        if (this.get('selAbs')) {
            fieldId = typeof(fieldId) === 'undefined' ? this.get('fieldId') : fieldId ;
            fieldTexto = typeof(fieldTexto) === 'undefined' ? this.get('fieldTexto') : fieldTexto ;

            var crearValue = function(id, texto) {
                var ret = {};

                ret[fieldId] = id;
                ret[fieldTexto] = texto;

                return ret;
            }.bind(this);

            ret.push(crearValue('ninguno', 'Ninguno'));
            ret.push(crearValue('todos', 'Todos'));
        }

        return ret;
    },
    getValues: function(datasetCombo, fieldId, fieldTexto) {
        var values = this.getDefaultValues(fieldId, fieldTexto);

        for (var i = 0 ; i < datasetCombo.length ; i++) {
            values.push(datasetCombo[i]);
        }

        return values;
    },
    getTextoCompleto: function() {
        var ret = this.get('texto');
        var value = this.get('value');
        if (value.length) {
            ret += ': ';
            var arr = [];
            for (var i = 0 ; i < value.length ; i++) {
                var v = this.get('datasetCombo').buscar(this.get('fieldId'), value[i]);
                arr.push(v[this.get('fieldTexto')]);
            }
            ret += arr.join(' & ');
        }

        return ret;
    },
    getTextoLabel: function(texto, textoCompleto) {
        return textoCompleto ? textoCompleto : texto;
    },
    fireChange: function() {
        this.set('textoCompleto', this.getTextoCompleto())
        this.fire('change');
    },
    onIronSelect: function(e, details) {
        var tag = details.item.tag;

        if (tag == 'ninguno') {
            this.set('value', []);
        } else if (tag == 'todos') {
            var value = [];

            for (var i = 0 ; i < this.get('datasetCombo').length ; i++) {
                value.push(this.get('datasetCombo')[i][this.get('fieldId')]);
            }

            this.set('value', value);
        } else {
            var item = this.get('datasetCombo').buscar(this.get('fieldId'), tag);

            if (item.unico) {
                this.set('value', [tag]);
            }
        }

        this.fireChange();
    },
    onIronDeselect: function(e) {
        this.fireChange();
    }
});
