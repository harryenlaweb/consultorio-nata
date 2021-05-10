import SimpleSchema from 'simpl-schema';
import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

//const Images = new FilesCollection();

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Historias = new SimpleSchema({	
	
	_id: {
	    type: String,
	    autoValue: function() {return Random.id()}
    },

    idImage: { type: String, optional: true},
    link: { type: String, optional: true},
    name: { type: String, optional: true},

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