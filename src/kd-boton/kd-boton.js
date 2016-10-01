/**
 * Created by porrito on 9/09/16.
 */
Polymer({
    is: 'kd-boton',
    properties: {
        tag: {
            type: String,
            value: ''
        }
    },
    accion: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.fire('accion', {
        	tag: this.get('tag'),
        	boton: this
    	});
    }
});
