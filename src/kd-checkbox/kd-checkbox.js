Polymer({
    is: 'kd-checkbox',
    properties: {
        value: {
            type: Boolean,
            value: false
        }
    },
    onChange: function (e) {
        e.stopPropagation();
        this.fire('change');
    }
});
