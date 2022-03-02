import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const TratamientosProfesional = new SimpleSchema({
	_id: { type: String },
	
	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},

	nombre: { type: String,	label: 'Nombre' },
	duracion: {	type: String, label: 'Duracion', optional: true },
	importe: { type: String, label: 'Importe', optional: true },
	sexo: { type: String, label: '¿El tratamiento es para un Hombre o Mujer?', optional: true },
    frecuencia: { type: String, label: 'Frecuencia', optional: true },
	descripcion:{ type: String, label: 'Descripción del tratamiento', optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea" }
	}﻿,

	owner:{	type: String, label: "Propietario",
		autoValue() { return this.userId },
		autoform: {	type: "hidden" }
	},
	created: { type: Date,
		autoValue() { return new Date()},
		autoform: { type: "hidden" }
	},	
	
});

