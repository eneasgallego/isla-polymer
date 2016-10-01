Polymer({
    is: 'kd-combo',
    behaviors: [kdBaseBehavior],
    properties: {
        texto: {
            type: String,
            value: ''
        },
        value: {
            type: String,
            value: '-1'
        },
        dataset: {
            type: Array,
            value: [],
            observable: 'onDatasetChanged'
        },
        fieldId: {
            type: String,
            value: 'id'
        },
        fieldTexto: {
            type: String,
            value: 'texto'
        },
        hasFocus: {
            type: Boolean,
            value: true
        },
        blurFired: {
            type: Boolean,
            value: false
        }
    },
    ready: function() {
        this.focus();
    },
    getSelected: function (item, field, value) {
        return this.getValorDataset(item, field) == value;
    },
    focus: function () {
        setTimeout(function() {
            this.$.menu.$$('paper-input').focus();
        }.bind(this), 100);
    },
    onIronSelect: function(e) {
        this.fire('change');
    },
    onDatasetChanged: function(e) {
        this.$.list.set('selected', this.get('value'));
    },
    onFocus: function() {
        this.set('hasFocus', true);
        this.set('blurFired', false);
    },
    onBlur: function (e) {
        e.stopPropagation();
        this.set('hasFocus', false);
        this.timeout = setTimeout(function() {
            if ((!this.get('blurFired')) && !this.get('hasFocus')) {
                this.set('blurFired', true);
                this.fire('blur', {
                    combo: this
                });
            }
        }.bind(this), 500);
        /*if (!Polymer.dom(this.$.menu).activeElement &&
            !this.$.menu.activeElement) {
            var items = Polymer.dom(this.root).querySelectorAll('paper-item');
            for (var i = 0 ; i < items.length ; i++) {
                if (items[i].activeElement) {
                    return;
                }
            }
            this.fire('blur', {
                combo: this
            });
        }*/
    },
    onChange: function (e) {
        e.stopPropagation();
        this.set('value', e.currentTarget.value);
        this.fire('change', {
            combo: this
        });
    },
    onClick: function (e) {
        e.stopPropagation();
        this.fire('click', {
            combo: this
        });
    },
    getIdItem: function (item, fieldId) {
        return 'item_' + item[fieldId];
    }
});
