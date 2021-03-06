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
        mostrar: {
            type: Boolean,
            value: false
        },
        value: Array,
        values: Object
    },
    ready: function() {
        this.set('value', []);
        this.set('values', {
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
                unico: true,
                filtrar: function(a) {
                    return a == this.value
                },
                getTexto: function() {
                    return '=' + this.value;
                }
            }
        });
    },
    filtrar: function(val) {
        var ret = true;

        var value = this.get('value');
        //console.log(value);
        var values = this.get('values');
        for (var i = 0 ; i < value.length ; i++) {
            var v = values[value[i]];
            if (!v.filtrar.call(v, val)) {
                ret = false;
                break;
            }
        }

        return ret;
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
    fireChange: function() {
        this.set('textoCompleto', this.getTextoCompleto())
        this.fire('change');
    },
    onClick: function(e) {
        e.stopPropagation();
    },
    onChange: function(e) {
        this.fireChange();
    },
    onIronSelect: function(e, details) {
        var tag = details.item.getAttribute('tag');
        var val = this.get('values')[tag];
        if (val.unico) {
            if (this.get('value').length > 1) {
                this.set('value', [tag]);
            }
        } else {
            var limpiar = function() {
                var rep = false;
                for (var i = 0 ; i < this.get('value').length ; i++) {
                    var t = this.get('value')[i];
                    var v = this.get('values')[t];

                    if (v.unico) {
                        this.splice('value', i, 1);
                        rep = true;
                        break;
                    }
                }
                rep && limpiar();
            }.bind(this);

            limpiar();
        }
        this.fireChange();
    },
    onIronDeselect: function(e) {
        this.fireChange();
    }
});
