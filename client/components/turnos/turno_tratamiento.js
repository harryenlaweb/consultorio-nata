import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../../../lib/collections/tratamientos';
import { Turnos } from '../../../lib/collections/turnos';
import { Profesionales } from '../../../lib/collections/profesionales';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

const Messages2 = new Mongo.Collection('messages2');

Template.turnoTratamiento.helpers({
	formCollection() {
		return Tratamientos;
	},
	formCollection() {
		return Turnos;
	},
	formCollection() {
		return Profesionales;
	},
	formCollection() {
		return Pacientes;
	},
	searchAttributes() {
    return {
      placeholder: 'Buscar ...',
    };
  },
})

Template.turnoTratamiento.events({
	'click .agregarTratamiento': function(event, template){

		//RECUPERO EL TRATAMIENTO SELECCIONADO (OBJETO)
		let tratamientoSeleccionado = Tratamientos.findOne({"_id":this._id});//obtengo el tratamiento seleccionado (objeto)

		let turno = template.data.turno;//obtengo el _id del turno		
		
		

		//RECUPERO EL TRATAMIENTO A INSERTAR
		let trat= {	_id: tratamientoSeleccionado._id,
					nombre:tratamientoSeleccionado.nombre,
					duracion:tratamientoSeleccionado.duracion,					
		};	
		//inserto los datos en el arreglo		
		Turnos.update({_id:turno._id},{$set:{tratamiento:trat,estado:"OCUPADO"}});		

		

		//RECUPERO EL PROFESIONAL DEL TRATAMIENTO A INSERTAR
		let profesional = Profesionales.findOne({"mistratamientos._id":this._id});
		let prof={ _id:profesional._id,
					nombreApellido:	profesional.nombreApellido,
		};
		
		Turnos.update({_id:turno._id},{$set:{profesional:prof}});
	},
	'click .agregarPaciente': function(event, template){		
		
		//OBTENGO EL PACIENTE SELECCIONADO (OBJETO)
		let pacienteSeleccionado = Pacientes.findOne({"_id":this._id});		

		let turno = template.data.turno;//obtengo el turno		
		
		
		//RECUPERO EL PACIENTE DEL TRATAMIENTO
		let pac={ 	_id:pacienteSeleccionado._id,
					nombreApellido:	pacienteSeleccionado.nombreApellido,
					dni: pacienteSeleccionado.dni,
		};
		
		Turnos.update({_id:turno._id},{$set:{paciente:pac}});
	}
})