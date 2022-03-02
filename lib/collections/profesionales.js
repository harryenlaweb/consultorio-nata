import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { TratamientosProfesional } from './tratamientosProfesional';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Profesionales = new Mongo.Collection('profesionales');

export const ProfesionalesIndex = new EasySearch.Index({
	collection: Profesionales,
	fields: ['nombreApellido','especialidad'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})


Profesionales.attachSchema(new SimpleSchema({

	combos: {type: Boolean, label: '¿Utiliza combos de especialidades?', optional: true},

	idUsuario: {type: String, required: true}, // el usuario de MeteorUser

	idConsultorio:{type: String, label: "idConsultorio",autoform: {type: "hidden"}},

	nombreApellido: {type: String, label: 'Nombre y apellido'},

	dni: {type: String, label: 'DNI'},

	especialidad: {type: String, label: 'Especialidad', optional: true},

	telefono: {type: String, label: 'Telefono', optional: true},

	email: {type: String, label: 'email'},

	fechaNacimiento: {type: Date, label: 'Fecha de Nacimiento',	optional: true,

		autoform:{ type: "datetime", row: 10, class: "datetime"}
	},

	sexo: {type: String, label: '¿El profesional Hombre o Mujer?', optional: true},

  	mistratamientos: { type: Array, optional: true, 
  		autoform: {type: "hidden"}   
  	},
  	'mistratamientos.$': TratamientosProfesional,  	  	

	descripcion:{ type: String, label: 'Descripción del profesional', optional: true,
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

/*Profesionales.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},	
	update: function(userId, doc){
		return doc.owner === userId;
	}
});*/

Profesionales.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'profesionales.remove'(profesionalId){
		check(profesionalId, String);
		Profesionales.remove(profesionalId);
	},	
})

Meteor.methods({
    'profesionales.removeTrat'(memberID, subID) {
        //console.log("MemberID: " + memberID + " | " + "SubID: " + subID);
        Profesionales.update(
            {_id: memberID},
            {$pull:{mistratamientos: {_id: subID}}}, {getAutoValues: false});
    }
});
