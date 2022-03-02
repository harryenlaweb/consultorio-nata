import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../../../lib/collections/tratamientos';
import { Profesionales } from '../../../lib/collections/profesionales';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Turnos } from '../../../lib/collections/turnos';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.tratamientos.onCreated(function(){     
  this.selTratamientoEliminar = new ReactiveVar(null);
  this.selTratamientoInfo = new ReactiveVar(null);
  this.selTratamientoEditar = new ReactiveVar(null);
});

Template.tratamientos.helpers({
  	searchAttributes() {
    	return {
      	placeholder: 'Buscar ...',
    	};
  	},

  	formCollection() {
		return Tratamientos;
	},
	formCollection() {
		return Profesionales;
	},

  	tratamientoEliminar: function() {     
    	return Template.instance().selTratamientoEliminar.get();        
  	},

  	tratamientoInfo: function() {     
    	return Template.instance().selTratamientoInfo.get();        
  	},

  	tratamientoEditar: function() {     
    	return Template.instance().selTratamientoEditar.get();        
  	},

});


Template.tratamientos.events({
	'click .remove': function(event, template){		
		Meteor.call('tratamientos.remove',this._id);
	},

	'click .modalRemoveTratamiento': function(event, template){		
    	var tratamiento = Tratamientos.findOne({"_id":this._id});	     	
	    Template.instance().selTratamientoEliminar.set(tratamiento);
	    $('#modalEliminarTratamiento').modal('show');
  	},

  	'click ._remove': function(event, template){ 
	    var tratamiento = Template.instance().selTratamientoEliminar.get();
	    Meteor.call('tratamientos.remove',tratamiento._id);

	    //tengo que eliminar todos los tratamientos de los profesionales
	    var cursor = Profesionales.find({});
	    cursor.forEach(function(d){	    	
	    	var profesionalId = d._id;
	    	if (d.mistratamientos) {
	    		var tratamientos = d.mistratamientos;
		    	tratamientos.forEach(function(trat){
		    		if (tratamiento._id == trat._id){		    			
		    			Meteor.call('profesionales.removeTrat',profesionalId, trat._id);	
		    		}
		    	})
	    	}	    	
	    });

	    $('#modalEliminarTratamiento').modal('hide');
	},

	'click .modalTratamientoInfo': function(event, template){   
		var tratamiento = Tratamientos.findOne({"_id":this._id});      
		Template.instance().selTratamientoInfo.set(tratamiento);	

      	$('#modalTratamientoInfo').modal('show');
    },

    'click .modalTratamientoEditar': function(event, template){   
      var tratamiento = Tratamientos.findOne({"_id":this._id});      
      Template.instance().selTratamientoEditar.set(tratamiento);
      $('#modalTratamientoEditar').modal('show');
    }, 

  	'submit #formModificarTratamiento':function(event) {
      	// Prevent default browser form submit
      	event.preventDefault();

      	// Get value from form element
      	const target = event.target;
      	var tratamiento = Template.instance().selTratamientoEditar.get();

      	
      	//if (target.sobreturno.value){var ingresoSobreturno = target.sobreturno.checked};            

      	Tratamientos.update({_id:tratamiento._id},{$set: {
	        nombre : target.nombre.value,
	        duracion: target.duracion.value,
	        importe: target.importe.value,	        
	        //frecuencia: target.frecuencia.value,	        
	        //sexo: target.sexo.value,
	        descripcion: target.descripcion.value,        
	        //sobreturno : ingresoSobreturno,
	    }});

	    var tratamientoSeleccionado = Tratamientos.findOne({_id:tratamiento._id});	    

	    //tengo que modificar todos los tratamientos de los profesionales
	    //lo que hago es eliminar e insertar el tratamientos en los profesionales	    
	    var cursor = Profesionales.find({});
	    cursor.forEach(function(d){	    	
	    	var profesionalId = d._id;
	    	if (d.mistratamientos) {
	    		var tratamientos = d.mistratamientos;
		    	tratamientos.forEach(function(trat){
		    		if (tratamiento._id == trat._id){

		    			//ELIMINO EL TRATAMIENTO		    			
		    			Meteor.call('profesionales.removeTrat',profesionalId, trat._id);	

		    			//INSERTO EL TRATAMIENTO
						var trata= {	_id: tratamientoSeleccionado._id,
									nombre:tratamientoSeleccionado.nombre,
									duracion:tratamientoSeleccionado.duracion,
									importe: tratamientoSeleccionado.importe,
									//sexo:tratamientoSeleccionado.sexo,
									//frecuencia:tratamientoSeleccionado.frecuencia,
									descripcion:tratamientoSeleccionado.descripcion,
									//sobreturno:tratamientoSeleccionado.sobreturno,
									owner:tratamientoSeleccionado.owner,
						};						

						//inserto los datos en el arreglo
						Profesionales.update({_id:profesionalId},{$push:{mistratamientos:trata}});	
		    		}
		    	})
	    	}	    	
	    });      

      	$('#modalTratamientoEditar').modal('hide'); //CIERRO LA VENTANA MODAL
      
  	},

})

