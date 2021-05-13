import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';
import { Cajas } from './cajas';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const CajasAdmin = new Mongo.Collection('cajasAdmin');

export const PacientesIndex = new EasySearch.Index({
	collection: CajasAdmin,
	fields: ['fecha', 'ingreso', 'egreso', 'total',],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})

CajasAdmin.attachSchema(new SimpleSchema({	

	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},	

	fecha:{type: Date},	

	ingreso: {	type: Number, label: 'Duracion',
				autoform: {
		            afFieldInput: {
		                type: "number"
		            }
		        }
		},
	
	egreso: { type: Number, label: 'Importe',
				autoform: {
		            afFieldInput: {
		                type: "number"
		            }
		        }
			},

	total: { type: Number, label: 'Importe',
				autoform: {
		            afFieldInput: {
		                type: "number"
		            }
		        }
			},

  	lascajas: { type: Array, optional: true, 
  		autoform: {type: "hidden"}   
  	},
  	'lascajas.$': Cajas, 
	

	owner:{type: String, label: "Propietario",
		autoValue() {return this.userId},
		autoform: {type: "hidden"}
	},
	created: {type: Date,
		autoValue() {return new Date()},
		autoform: {type: "hidden"}
	},		
}));

/*

CajasAdmin.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},	
	update: function(userId, doc){
		return doc.owner === userId;
	}
});*/

CajasAdmin.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

/*
Meteor.methods({
	'cajasAdmin.remove'(cajaId){
		check(cajaId, String);
		CajasAdmin.remove(cajaId);
	}
})*/
/*
Meteor.methods({
    'cajasAdmin.removeCajaAdmin'(memberID, subID) {        
        CajasAdmin.update(
            {_id: memberID},
            {$pull:{lascajas: {_id: subID}}}, {getAutoValues: false});
    }
});*/