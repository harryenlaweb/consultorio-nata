import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Turnos = new Mongo.Collection('turnos');

export const TurnosIndex = new EasySearch.Index({
	collection: Turnos,
	fields: ['dia','duracion','inicio','fin','_id','owner'],
	placeholder: "Search...",
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 100}
})

//*********************************************TRATAMIENTO********************************
let TurnoTratamiento = new SimpleSchema({
	_id: {type: String,optional: true},

	nombre: {type: String,optional: true},

	duracion: {type: Number,optional: true},

	importe: {type: String,optional: true},

	sexo: {type: String,optional: true},

    frecuencia: {type: String,optional: true},	
    
	descripcion:{ type: String, optional: true,
		autoform:{ 
			type: "textarea", 
			row: 10, 			
			class: "textarea"
		}
	}﻿,
});

//******************************************************PROFESIONAL************************************
let TurnoProfesional = new SimpleSchema({
	_id: {type: String, optional: true},

	nombreApellido: {type: String, optional: true},

	dni: {type: String,	optional: true},

	especialidad: {type: String, optional: true,		
	},
});


//*********************************************PACIENTE***************************************************
let TurnoPaciente = new SimpleSchema({

	_id: {type: String, optional: true},

	nombreApellido: {type: String, optional: true},

	dni: {type: String,	optional: true},

	nombreDni: {type: String, optional: true,
			autoform: {
			type: "hidden"
		}
	},

	carnet: {type: String, optional: true},

	telefono: {type: String, optional: true},

	direccion: {type: String, optional: true},

	localidad: {type: String, optional: true},

	provincia: {type: String, optional: true},

	email: {type: String, optional: true},

	profesion: {type: String, optional: true},

	fechaNacimiento: {type: Date, optional: true},

	fechaIngreso: {type: Date, optional: true},

	sexo: {type: String,        
        optional: true
    },  	

	comentarios:{ type: String, optional: true,
		autoform:{ type: "textarea", row: 10, class: "textarea"}
	}﻿,
});

//*************************************************TURNO****************************************************
Turnos.attachSchema(new SimpleSchema({	
	inicio: {type: Date,  optional: true},

	fin: { type: Date, optional: true},

	idConsultorio:{type: String, label: "idConsultorio",
		autoValue() {return Meteor.user().profile.idConsultorio},
		autoform: {type: "hidden"}
	},

	importe: {type: Number, optional: true},

	duracion: {	type: Number, optional: true},
	
	//los posibles estados que puede tomar el turno son ASISTIO, FALTO, OCUPADO, CONFIRMADO, ATENDIDO
    estado: {type: String, optional: true},
	motivo:{ type: String, optional: true, 		
		autoform:{ type: "textarea", row: 10, class: "textarea"}
	}﻿,  	

  	tratamiento: {type: TurnoTratamiento, optional:true},

	tratamientos: {type: Array, optional: true},
  	'tratamientos.$': TurnoTratamiento,  	  	  	

  	profesional: { type: TurnoProfesional, optional: true},  	

  	paciente: { type: TurnoPaciente, optional: true},

  	idOperador: {type: String, optional: true},

	owner:{ type: String, label: "Propietario",
		autoValue() { return this.userId },
		autoform: { type: "hidden" }
	},

	created: { type: Date, 
		autoValue() {return new Date()},
		autoform: { type: "hidden" }
	},	
	
}));

Turnos.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	},
	update: function(userId, doc){
		return doc.owner === userId;
	}
});

Turnos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
	'turnos.remove'(turnoId){
		check(turnoId, String);
		Turnos.remove(turnoId);
	}
})