Polymer({
    is: 'kd-tabla',
    behaviors: [kdBaseBehavior, kdTablaBehavior],
    properties: {
        url: {
            type: String,
            value: ''
        },
        idCampo: {
            type: String,
            value: ''
        },
        columnas: {
            type: Array,
            value: []
        },
        editable: {
            type: Boolean,
            value: false
        },
        persistir: {
            type: Boolean,
            value: true
        },
        orden: {
            type: Array,
            value: []
        },
        filtrar: {
            type: Boolean,
            value: true
        },



        cargando: {
            type: Boolean,
            value: false
        },
        celdaEditar: {
            type: Object,
            value: null
        },
        sortedData: {
            type: Array,
            computed: 'getSortedData(data, orden, columnas, datasetCombo)'
        },
        data: {
            type: Array,
            value: []
        },
        rawData: {
            type: Array,
            value: [],
            notify: true,
            observer: 'onRawDataChanged'
        },
        datasetCombo: {
            type: Object,
            value: {},
            observer: 'mostrarEvento'
        }
    },
    getDatasets: function(columnas) {
        var ret = [];

        for (var i = 0 ; i < columnas.length ; i++) {
            if (this.editarCombo(columnas[i]) && !~ret.indexOf(columnas[i].tipo.url)) {
                ret.push(columnas[i].tipo.url);
            }
        }

        return ret;
    },
    necesitaDatasetCombo: function(col) {
        return this.editarCombo(col) && !this.get('datasetCombo')[col.tipo.url];
    },
    getTextoColumna: function(columna) {
        return columna.texto ? columna.texto : columna.campo;
    },
    getValorCeldaTexto: function(item, columna, dataset) {
        var ret = item[columna.campo];

        if (this.editarCombo(columna)) {
            if (dataset) {
                var data = dataset[columna.tipo.url];
                if (data) {
                    var itemDataset = data.buscar(columna.tipo.id, ret);
                    if (itemDataset) {
                        ret = itemDataset[columna.tipo.texto];
                    }
                }
            }
        } else if (this.editarCheckbox(columna)) {
            ret = ret ? 'X' : '';
        }

        return ret;
    },
    getDatasetCombo: function(datasetCombo, col) {
        return datasetCombo[col.tipo.url];
    },
    isLoading: function() {
        var ret = false;
        var ajax = Polymer.dom(this.root).querySelectorAll('iron-ajax');
        for (var i = 0 ; i < ajax.length ; i++) {
            if (ajax[i].loading) {
                ret = true;
                break;
            }
        }

        return ret;
    },
    mostrarVelo: function(cargando) {
        return cargando ? '' : 'hidden';
    },
    recargar: function() {
        this.set('data', []);
        setTimeout(function () {
            this.get('rawData') && this.set('data', this.get('rawData'));
        }.bind(this), 100);
    },
    editarCelda: function(celdaEditar, item, idCampo, campo) {
        return celdaEditar != null && celdaEditar.id == item[idCampo] && celdaEditar.campo == campo;
    },
    mostrarOrden: function(orden, columna, desc) {
        var obj = orden.buscar('campo', columna.campo);
        return obj && ((obj.ascendente && !desc) || (!(obj.ascendente) && desc));
    },
    mostrarOrdenAsc: function(orden, columna) {
        return this.mostrarOrden(orden, columna);
    },
    mostrarOrdenDesc: function(orden, columna) {
        return this.mostrarOrden(orden, columna, true);
    },
    quitarOrden: function(e) {
        e.stopPropagation();
        var campo = e.currentTarget.getAttribute('campo');
        var orden = this.get('orden');
        var ordenItem = orden.buscar('campo', campo);
        if (ordenItem) {
            orden.splice(orden.indexOf(ordenItem), 1);
        }

        this.set('orden', []);
        this.set('orden', orden);
    },
    getSortedData: function(data, orden, columnas, datasetCombo) {
        var ret = [];

        var appendSorted = function(a) {
            var ordenar = function(b) {
                var ordenarItem = function(col, asc) {
                    var valA = a[col.campo]
                    var valB = b[col.campo]
                    if (this.editarCombo(col)) {
                        var dataset = datasetCombo[col.tipo.url];
                        if (dataset) {
                            var getVal = function (val) {
                                var ret = dataset.buscar(col.tipo.id, val);
                                if (ret) {
                                    ret = ret[col.tipo.texto];
                                }
                                return ret;
                            }.bind(this)
                            valA = getVal(valA);
                            valB = getVal(valB);
                        }
                    } else if (this.editarCheckbox(col)) {
                        valA = !!valA;
                        valB = !!valB;
                    }

                    return valA == valB ? 0 : ((valA < valB && asc) ||
                                                (valA > valB && !asc)) ? 1 : -1;
                }.bind(this);
                for (var i = 0 ; i < orden.length ; i++) {
                    var item = orden[i];
                    var col = columnas.buscar('campo', item.campo);

                    if (col) {
                        var resOrdenar = ordenarItem(col, item.ascendente);
                        if (resOrdenar) {
                            return !!~resOrdenar;
                        }
                    }
                }

                return false;
            }.bind(this);
            var index = -1;
            for (var i = 0 ; i < ret.length ; i++) {
                var item = ret[i];

                if (ordenar(item)) {
                    index = i;
                    break;
                }
            }
            if (!~index) {
                ret.push(a);
            } else {
                ret.splice(index, 0, a);
            }
        }.bind(this);

        for (var i = 0 ; i < data.length ; i++) {
            var item = data[i];
            appendSorted(item);
        }

        return ret;
    },
    onRequest: function() {
        this.set('cargando', true);
    },
    onResponse: function() {
        if (!this.isLoading()) {
            this.set('cargando', false);
        }
    },
    onResponseEditar: function(e, ironRequest) {
        this.set('celdaEditar', null);
        this.onResponse();
    },
    onResponseDatasetCombo: function(e, ironRequest) {
        var datasetCombo = this.get('datasetCombo');
        datasetCombo[ironRequest.url] = e.detail.response;
        this.set('datasetCombo', datasetCombo);
        this.recargar();
        var filtros = this.$$('#filtros');
        filtros && filtros.set('datasetCombo', datasetCombo);
        this.onResponse();
    },
    onRawDataChanged: function(e) {
        this.recargar();
    },
    onSort: function(e) {
        var campo = e.currentTarget.getAttribute('campo');
        //var columna = this.get('columnas').buscar('campo', campo);
        var orden = this.get('orden');
        var ordenItem = orden.buscar('campo', campo);
        if (ordenItem) {
            orden.splice(orden.indexOf(ordenItem), 1);
        } else {
            ordenItem = {
                campo: campo
            };
        }
        ordenItem.ascendente = !ordenItem.ascendente;

        orden.unshift(ordenItem);

        this.set('orden', []);
        this.set('orden', orden);

        return;






        var sortOrder = this.get('orden');
        var sortProperty = this.get('columnas')[sortOrder.column].name;
        var sortDirection = sortOrder.direction;
        e.currentTarget.items.sort(function(a, b) {
            var res;
            var path = sortProperty.split('.');
            for (var i = 0; i < path.length; i++) {
                a = a[path[i]];
                b = b[path[i]];
            }
            if (!isNaN(a)) {
                res = parseInt(a, 10) - parseInt(b, 10);
            } else {
                res = a.localeCompare(b);
            }

            if ('desc' === sortDirection) {
                res *= -1;
            }
            return res;
        });
    },
    onFilter: function (e) {
        var items = this.get('rawData');
        if (items) {
            var filtros = this.$$('#filtros');
            items = items.filter(filtros ? filtros.filtrar.bind(filtros) : function(){return true;});
            this.set('data', items);
        }
    },
    onClickCelda: function(e) {
        if (this.get('editable')) {
            var celdaEditar = {
                id: e.currentTarget.getAttribute('idfila'),
                campo: e.currentTarget.getAttribute('campo')
            };
            this.set('celdaEditar', celdaEditar);
        }
    },
    onFocusInput: function(e) {
        e.currentTarget.$.input.select();
    },
    onBlur: function() {
        this.set('celdaEditar', null);
    },
    onGuardar: function(e) {
        var id = e.currentTarget.getAttribute('idfila')
        var campo = e.currentTarget.getAttribute('campo');
        if (campo) {
            var valor = e.currentTarget.get('value');
            var params = this.buscarArray('data', this.get('idCampo'), id);
            if (params[campo] != valor) {
                params[campo] = valor;

                if (this.get('persistir')) {
                    var url = this.get('url');
                    var metodo = 'post';

                    if (id) {
                        url += '/' + id;
                        metodo = 'put';
                    }

                    this.$.ajaxEditar.set('url', url);
                    this.$.ajaxEditar.set('method', metodo);
                    this.$.ajaxEditar.set('body', this.getQueryString(params));

                    this.$.ajaxEditar.generateRequest();
                } else {
                    this.set('celdaEditar', null);
                }
            } else {
                this.set('celdaEditar', null);
            }
        }
    }
});
