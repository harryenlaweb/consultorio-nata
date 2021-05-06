import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Historias } from '../../../lib/collections/historias';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

//const Messages = new Mongo.Collection('messages');

Template.historias.helpers({
	formCollection() {
		return Historias;
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

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});

Template.historias.events({
	'click .agregarHistoria': function(event, template){		
		let historiaSeleccionada = Historias.findOne({"_id":this._id});//obtengo el tratamiento seleccionado (objeto)

		let pacientes = template.data.pacientes;//obtengo el _id del paciente
		
		//recupero los datos a insertar
		let hist= {	_id: historiaSeleccionada._id,
					idConsultorio:historiaSeleccionada.idConsultorio,
					fecha:historiaSeleccionada.fecha,
					imagen:historiaSeleccionada.imagen,					
					comentarios:historiaSeleccionada.comentarios,
					owner:historiaSeleccionada.owner,
		};

		//inserto los datos en el arreglo
		Pacientes.update({_id:pacientes._id},{$push:{mishistorias:hist}});		
	},
	'click .removerHistoria': function(event, template){	

		let historiaSeleccionada = Historias.findOne({"_id":this._id});//obtengo el tratamiento seleccionado (objeto)
		let pacientes = template.data.pacientes;//obtengo el _id del pacientes

		Meteor.call('pacientes.removeTrat',pacientes._id, historiaSeleccionada._id);	
		
	}
})