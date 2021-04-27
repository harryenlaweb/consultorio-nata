import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const ObrasPaciente = new SimpleSchema({
	_id: {type: String},
	nombre: {type: String,	label: 'Nombre'	},

	carnet: {type: String, label: 'Carnet',	optional: true},

	telefono: {type: String, label: 'Telefono',	optional: true},

	direccion: {type: String, label: 'Direccion', optional: true},

	localidad: {type: String, label: 'Localidad', optional: true},

	provincia: {type: String, label: 'provincia', optional: true},

	cuil: {type: String, label: 'CUIL',	optional: true}, 

	descripcion:{ type: String, label: 'Descripción de la Obra Social', optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea"}
	}﻿,

	owner:{	type: String, label: "Propietario",
		autoValue() {return this.userId	},
		autoform: {	type: "hidden"}
	},
	created: {type: Date,
		autoValue() {return new Date()},
		autoform: {	type: "hidden"}
	},	
	
});

