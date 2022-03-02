import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Obras } from '../../../lib/collections/obras';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

//const Messages = new Mongo.Collection('messages');

Template.pacienteObra.helpers({
	formCollection() {
		return Obras;
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

Template.pacienteObra.events({
	'click .agregarObra': function(event, template){		
		
		let obraSeleccionada = Obras.findOne({"_id":this._id});//obtengo la Obra Social seleccionada (objeto)

		let paciente = template.data.paciente;//obtengo el _id del paciente
		
		//recupero los datos a insertar
		let ob= {	_id: obraSeleccionada._id,
					nombre:obraSeleccionada.nombre,
					telefono:obraSeleccionada.telefono,
					direccion: obraSeleccionada.direccion,
					localidad:obraSeleccionada.localidad,
					provincia:obraSeleccionada.provincia,
					descripcion:obraSeleccionada.descripcion,
					cuil:obraSeleccionada.cuil,
					owner:obraSeleccionada.owner,
		};

		//inserto los datos en el arreglo
		Pacientes.update({_id:paciente._id},{$push:{misobras:ob}});		
	},
	'click .removerObra': function(event, template){	

		let obraSeleccionada = Obras.findOne({"_id":this._id});//obtengo la Obra Social seleccionada (objeto)
		let paciente = template.data.paciente;//obtengo el _id del paciente

		Meteor.call('pacientes.removeObra',paciente._id, obraSeleccionada._id);	
		
	}
})