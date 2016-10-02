Polymer({
    is: 'kd-filtro-int',
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
        value: {
            type: Array,
            value: []
        },
        values: {
            type: Object,
            value: {
                menor: {
                    value: 0,
                    filtrar: function(a) {
                        return a < this.value
                    },
                    getTexto: function() {
                        return '<' + this.value;
                    }
                },
                mayor: {
                    value: 0,
                    filtrar: function(a) {
                        return a > this.value
                    },
                    getTexto: function() {
                        return '>' + this.value;
                    }
                },
                igual: {
                    value: 0,
                    filtrar: function(a) {
                        return a == this.value
                    },
                    getTexto: function() {
                        return '=' + this.value;
                    }
                }
            }
        }
    },
    getTextoCompleto: function() {
        var ret = this.get('texto');
        var value = this.get('value');
        if (value.length) {
            ret += ': ';
            var arr = [];
            for (var i = 0 ; i < value.length ; i++) {
                var v = this.get('values')[value[i]];
                arr.push(v.getTexto.call(v));
            }
            ret += arr.join(' & ');
        }

        return ret;
    },
    getTextoLabel: function(texto, textoCompleto) {
        return textoCompleto ? textoCompleto : texto;
    },
    filtrar: function(val) {
        var ret = true;

        var value = this.get('value');
        //console.log(value);
        var values = this.get('values');
        for (var i = 0 ; i < value.length ; i++) {
            var v = values[value[i]/*.getAttribute('tag')*/];
            if (!v.filtrar.call(v, val)) {
                ret = false;
                break;
            }
        }

        return ret;
    },
    fireChange: function() {
        this.set('textoCompleto', this.getTextoCompleto())
        this.fire('change');
    },
    onIronSelect: function(e, details) {
        if (details.item.getAttribute('tag') == 'igual') {
            if (this.get('value').length > 1) {
                this.set('value', ['igual']);
            }
        } else {
            var index = this.get('value').indexOf('igual');
            if (!!~index) {
                this.splice('value', index, 1);
            }
        }
        this.fireChange();
    },
    onIronDeselect: function(e) {
        this.fireChange();
    },
    onClick: function(e) {
        e.stopPropagation();
    },
    onChange: function(e) {
        this.fireChange();
    }
});
