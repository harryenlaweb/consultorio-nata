import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Obras = new Mongo.Collection('obras');

export const ObrasIndex = new EasySearch.Index({
	collection: Obras,
	fields: ['nombre','telefono'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})

Obras.attachSchema(new SimpleSchema({
	
	nombre: {type: String, label: 'Nombre'},

	telefono: {	type: String, label: 'Telefono', optional: true },

	direccion: { type: String, label: 'Direccion', optional: true },

	localidad: { type: String, label: 'Localidad', optional: true },

	provincia: { type: String, label: 'provincia', optional: true },

	cuil: {	type: String, label: 'CUIL', optional: true}, 	 

	descripcion:{ type: String, label: 'Descripción de la Obra Social', optional: true, 		
		autoform:{ type: "textarea", row: 10, class: "textarea"	}
	}﻿,

	owner:{	type: String, label: "Propietario",
		autoValue() {return this.userId	},
		autoform: {	type: "hidden"}
	},
	created: { type: Date,
			autoValue() {return new Date()},
		autoform: {	type: "hidden"}
	},	
	
}));

Obras.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},	
	update: function(userId, doc){
		return doc.owner === userId;
	}
});

Obras.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'obras.remove'(obraId){
		check(obraId, String);
		Obras.remove(obraId);
	},	
});