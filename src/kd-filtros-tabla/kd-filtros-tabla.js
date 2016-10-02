Polymer({
    is: 'kd-filtros-tabla',
    behaviors: [kdBaseBehavior, kdTablaBehavior],
    properties: {
        columnas: {
            type: Array,
            value: []
        }
    },
    generarIdFiltro: function(col) {
        return 'filtro_' + col.campo;
    },
    filtrar: function(item) {

        var filtrarCol = function(col) {
            var input = this.$$('#' + this.generarIdFiltro(col));
            if (input) {
                var val = input.get('value');

                if (this.editarInput(col)) {
                    if (this.getTipoInput(col) == 'text' && val) {
                        return !!~('' + item[col.campo]).toUpperCase().indexOf(('' + val).toUpperCase());
                    } else if (this.getTipoInput(col) == 'number' && val.length) {
                        return input.filtrar(item[col.campo]);
                    }
                }
            }

            return true;
        }.bind(this);

        var ret = true;
        for (var i = 0 ; i < this.get('columnas').length ; i++) {
            if (!filtrarCol(this.get('columnas')[i])){
                ret = false;
                break;
            }
        }

        return ret;
    },
    onFilter: function(e) {
        this.fire('filtrado')
    }
});
