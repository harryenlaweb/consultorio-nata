import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Cajas = new SimpleSchema({
	_id: {
	    type: String,
	    autoValue: function() {return Random.id()}
    },
	
	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},

	idOperador:{type: String},

	nombreOperador:{type: String},	
	
	ingreso: {	type: Number},
	
	egreso: { type: Number},

	total: { type: Number},

	fecha: { type: Date},

	notas:{ type: String, label: 'Notas', optional: true,
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