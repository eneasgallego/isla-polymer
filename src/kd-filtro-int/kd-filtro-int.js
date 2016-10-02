Polymer({
    is: 'kd-filtro-int',
    behaviors: [kdBaseBehavior, kdFiltroBehavior],
    properties: {
    },
    ready: function() {
        kdFiltroBehavior.ready.call(this);
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
    onClick: function(e) {
        e.stopPropagation();
    },
    onChange: function(e) {
        this.fireChange();
    }
});
