import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Consultorios = new Mongo.Collection('consultorios');

export const ConsultoriosIndex = new EasySearch.Index({
	collection: Consultorios,
	fields: ['nombreConsultorio','email'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})


Consultorios.attachSchema(new SimpleSchema({
	idUser : {type: String},
	
	nombreConsultorio: {type: String,	label: 'Nombre del consultorio'},	
	
	direccion: {type: String, optional: true, label: 'Direccion'},

	localidad: {type: String, optional: true, label: 'Localiad'},

	provincia: {type: String, optional: true, label: 'Provincia'},

	email: {type: String, optional: true, label: 'Email'},		

	rol: {type: String, label: 'Rol', optional: true}, 

	descripcion:{ type: String, label: 'Descripción del consultorio', optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea"}
	}﻿,

	owner:{type: String, label: "Propietario",
		autoValue() {return this.userId},
		autoform: {type: "hidden"}
	},
	created: {type: Date,
		autoValue() {return new Date()},
		autoform: {type: "hidden"}
	},	
	
}));

Consultorios.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},	
	update: function(userId, doc){
		return doc.owner === userId;
	}
});

Consultorios.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'consultorios.remove'(consultorioId){
		check(consultorioId, String);
		Consultorios.remove(consultorioId);
	},	
})


