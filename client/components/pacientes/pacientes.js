import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Obras } from '../../../lib/collections/obras';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Turnos } from '../../../lib/collections/turnos';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.pacientes.onCreated(function(){     
  this.selPacienteEliminar = new ReactiveVar(null);
  this.selPacienteInfo = new ReactiveVar(null);
  this.selPacienteEditar = new ReactiveVar(null);
  this.selObra2 = new ReactiveVar(null);  

});

Template.pacientes.helpers({
  	searchAttributes() {
    	return {
      		placeholder: 'Buscar ...',
    	};
  	},

   	pacienteEliminar: function() {     
    	return Template.instance().selPacienteEliminar.get();        
  	},

  	pacienteInfo: function() {     
    	return Template.instance().selPacienteInfo.get();        
  	},

  	pacienteEditar: function() {     
    	return Template.instance().selPacienteEditar.get();        
  	},

    //FUNCION DE TYPEAHEAD PARA AUTOCOMPLETAR LA OBRA SOCIAL Y SELECCIONARLA
    selecObra: function(event, suggestion, datasetName) {
      Template.instance().selObra2.set(suggestion.id);  
      //suggestion.id=null;
    },

    obras1: function() {     
      return Obras.find().fetch().map(function(object){ return {id: object._id, value: object.nombre}; });    
    },    
});


Template.pacientes.events({ 

	'click .remove': function(event, template){		
		Meteor.call('pacientes.remove',this._id);
	},

	'click .modalPacienteInfo': function(event, template){   
		var paciente = Pacientes.findOne({"_id":this._id});      
		Template.instance().selPacienteInfo.set(paciente);
		$('#modalPacienteInfo').modal('show');
    },

    'click .modalRemovePaciente': function(event, template){		
    	var paciente = Pacientes.findOne({"_id":this._id});	    
	    Template.instance().selPacienteEliminar.set(paciente);
	    $('#modalEliminarPaciente').modal('show');
  	},

  	'click ._remove': function(event, template){ 
	    var paciente = Template.instance().selPacienteEliminar.get();
	    Meteor.call('pacientes.remove',paciente._id);
	    $('#modalEliminarPaciente').modal('hide');
    }, 

    'click .modalPacienteEditar': function(event, template){   
      var paciente = Pacientes.findOne({"_id":this._id});      
      Template.instance().selPacienteEditar.set(paciente);
      $('#modalPacienteEditar').modal('show');
    }, 

    'submit #formModificarPaciente':function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;  

      if (target.nombreApellido.value){var ingresoNombre = target.nombreApellido.value};
      if (target.dni.value){var ingresoDni = target.dni.value};
      if (target.carnet.value){var ingresoCarnet = target.carnet.value};      
      ingresoObra = Template.instance().selObra2.get();      
      if (target.telefono.value){var ingresoTelefono = target.telefono.value};
      if (target.direccion.value){var ingresoDireccion = target.direccion.value};   
      if (target.localidad.value){var ingresoLocalidad = target.localidad.value};   
      if (target.provincia.value){var ingresoProvincia = target.provincia.value};   
      if (target.email.value){var ingresoEmail = target.email.value};   
      if (target.profesion.value){var ingresoProfesion = target.profesion.value};   
      if (target.fechaNacimiento2.value){
        var ingresoFechaNacimiento = target.fechaNacimiento2.value;
        ingresoFechaNacimiento = moment(ingresoFechaNacimiento, "DD-MM-YYYY");
        ingresoFechaNacimiento = new Date(ingresoFechaNacimiento);//.toDateString("dd-MM-yyyy");
        
      };
      if (target.fechaIngreso2.value){
        var ingresoFechaIngreso = target.fechaIngreso2.value;
        ingresoFechaIngreso = moment(ingresoFechaIngreso, "DD-MM-YYYY");
        ingresoFechaIngreso = new Date(ingresoFechaIngreso);//.toDateString("dd-MM-yyyy");        
      };
      if (target.descripcion.value){var ingresoDescripcion = target.descripcion.value};        

      var espacio = " "; 
      var combinacion = ingresoNombre.concat(espacio);
      combinacion = combinacion.concat(ingresoDni);

      var obraSeleccionada = Obras.findOne({"_id":ingresoObra});//obtengo la Obra Social seleccionada (objeto)     
      if (obraSeleccionada){
        obraSeleccionada = obraSeleccionada.nombre; 
      }

      var paciente = Template.instance().selPacienteEditar.get();

      Pacientes.update({_id:paciente._id},{$set: {
        nombreApellido:ingresoNombre, 
        dni:ingresoDni, 
        nombreDni:combinacion,
        obra:obraSeleccionada, 
        carnet:ingresoCarnet,
        telefono:ingresoTelefono,
        direccion:ingresoDireccion,
        localidad:ingresoLocalidad,
        provincia:ingresoProvincia,
        email:ingresoEmail,
        profesion:ingresoProfesion,     
        fechaNacimiento:ingresoFechaNacimiento,
        fechaIngreso:ingresoFechaIngreso,
        descripcion:ingresoDescripcion,        
      }});

      $('#modalPacienteEditar').modal('hide'); //CIERRO LA VENTANA MODAL
      
  },
})


Template.pacientes.onRendered(function() {
  //$('.fechaNacimiento').mask('dd/mm/aaaa');
  $("#fechaNacimiento2").inputmask("d-m-y");
  $("#fechaIngreso2").inputmask("d-m-y");

  Meteor.typeahead.inject();

});
