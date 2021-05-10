import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Tratamientos = new Mongo.Collection('tratamientos');

export const TratamientosIndex = new EasySearch.Index({
	collection: Tratamientos,
	fields: ['nombre'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})

Tratamientos.attachSchema(new SimpleSchema({
	
	nombre: { type: String, label: 'Nombre de especialidad', optional: true},

	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},

	duracion: {	type: Number, label: 'Duracion',
				autoform: {
		            afFieldInput: {
		                type: "number"
		            }
		        }
		},
	
	importe: { type: Number, label: 'Importe',
				autoform: {
		            afFieldInput: {
		                type: "number"
		            }
		        }
			},
	
	//sexo: { type: String, label: '¿La especialidad es para un Hombre o Mujer?',  optional: true },    
	
	descripcion:{ type: String, label: 'Descripción de la especialidad', optional: true, 
		autoform:{ type: "textarea", row: 10, class: "textarea"	}
	}﻿,	

	//sobreturno: {type: Boolean, label: '¿Es un sobreturno?', optional: true},

	owner:{	type: String, label: "Propietario",
		autoValue() { return this.userId },
		autoform: {	type: "hidden" }
	},

	created: { type: Date,
		autoValue() { return new Date() },
		autoform: { type: "hidden" }
	},	
	
}));

Tratamientos.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},
	update: function(userId, doc){
		return doc.owner === userId;
	}
});

Tratamientos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'tratamientos.remove'(tratamientoId){
		check(tratamientoId, String);
		Tratamientos.remove(tratamientoId);
	}
})
