import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Operadores = new Mongo.Collection('operadores');

export const OperadoresIndex = new EasySearch.Index({
	collection: Operadores,
	fields: ['nombreApellido','dni'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})


Operadores.attachSchema(new SimpleSchema({	

	nombreApellido: {type: String, label: 'Nombre y apellido'},

	dni: {type: String, label: 'DNI'},	

	idConsultorio:{type: String, label: "idConsultorio",autoform: {type: "hidden"}},

	email: {type: String, label: 'email'},
	
	telefono: {type: String, label: 'Telefono', optional: true},

	fechaNacimiento: {type: Date, label: 'Fecha de Nacimiento',	optional: true,

		autoform:{ type: "datetime", row: 10, class: "datetime"}
	},

	sexo: {type: String, label: '¿El operador es Hombre o Mujer?', optional: true},  	

	descripcion:{ type: String, label: 'Descripción del operador', optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea"}
	},

	owner:{type: String, label: "Propietario",
		autoValue() {return this.userId},
		autoform: {type: "hidden"}
	},
	created: {type: Date,
		autoValue() {return new Date()},
		autoform: {type: "hidden"}
	},	
	
}));

Operadores.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},	
	update: function(userId, doc){
		return doc.owner === userId;
	}
});

Operadores.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'operadores.remove'(operadorlId){
		check(operadorlId, String);
		Operadores.remove(operadorlId);
	},	
})

Meteor.methods({
    'operadores.removeTrat'(memberID, subID) {
        //console.log("MemberID: " + memberID + " | " + "SubID: " + subID);
        Operadores.update(
            {_id: memberID},
            {$pull:{mistratamientos: {_id: subID}}}, {getAutoValues: false});
    }
});
