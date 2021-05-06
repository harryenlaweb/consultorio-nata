import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Historias = new SimpleSchema({	
	
	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},

	fecha: { type: Date,
		autoValue() { return new Date()},
		autoform: { type: "hidden" }
	},

	comentario:{ type: String, label: 'Comentario', optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea" }
	}﻿,

	imagen: {
	    type: String, 
	    max: 200,
	    optional: true,
	    autoform: {
	      afFieldInput: {
	        type: 'fileUpload',
	        collection: 'Images',
	        accept: 'image/*',
	        label: 'Elija archivo'
	      }
	    }
	},

	owner:{	type: String, label: "Propietario",
		autoValue() { return this.userId },
		autoform: {	type: "hidden" }
	},
	created: { type: Date,
		autoValue() { return new Date()},
		autoform: { type: "hidden" }
	},		
});

/*

Historias.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});*/
