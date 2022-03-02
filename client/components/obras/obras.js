import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../../../lib/collections/tratamientos';
import { Profesionales } from '../../../lib/collections/profesionales';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Obras } from '../../../lib/collections/obras';
import { Turnos } from '../../../lib/collections/turnos';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.obras.onCreated(function(){     
  this.selObraEliminar = new ReactiveVar(null);
  this.selObraInfo = new ReactiveVar(null);
  this.selObraEditar = new ReactiveVar(null);
});

Template.obras.helpers({
  	searchAttributes() {
    	return {
      		placeholder: 'Buscar ...',
    	};
  	},

   	obraEliminar: function() {     
    	return Template.instance().selObraEliminar.get();        
  	},

  	obraInfo: function() {     
    	return Template.instance().selObraInfo.get();        
  	},

  	obraEditar: function() {     
    	return Template.instance().selObraEditar.get();        
  	},
});


Template.obras.events({
	'click .remove': function(event, template){		
		Meteor.call('obras.remove',this._id);
	},

	'click .modalObraInfo': function(event, template){   
      var obra = Obras.findOne({"_id":this._id});      
      Template.instance().selObraInfo.set(obra);
      $('#modalObraInfo').modal('show');
    }, 

    'click .modalRemoveObra': function(event, template){		
    	var obra = Obras.findOne({"_id":this._id});	    
	    Template.instance().selObraEliminar.set(obra);
	    $('#modalEliminarObra').modal('show');
  	},

  	'click ._remove': function(event, template){ 
	    var obra = Template.instance().selObraEliminar.get();
	    Meteor.call('obras.remove',obra._id);
	    $('#modalEliminarObra').modal('hide');
	},

	'click .modalObraEditar': function(event, template){   
      	var obra = Obras.findOne({"_id":this._id});      
      	Template.instance().selObraEditar.set(obra);
      	$('#modalObraEditar').modal('show');
    }, 

  	'submit #formModificarObra':function(event) {
      	// Prevent default browser form submit
      	event.preventDefault();

        // Get value from form element
        const target = event.target;

      	var obra = Template.instance().selObraEditar.get();

      	Obras.update({_id:obra._id},{$set: {
        	nombre : target.nombre.value,
        	telefono: target.telefono.value,
        	direccion: target.direccion.value,
        	localidad: target.localidad.value,
        	provincia: target.provincia.value,
        	cuil: target.cuil.value,
        	descripcion: target.descripcion.value,        	
      	}});


        var obraSeleccionada = Obras.findOne({_id:obra._id});        

        //tengo que modificar todos los tratamientos de los pacientes
        //lo que hago es eliminar e insertar el tratamientos en los pacientes     
        var cursor = Pacientes.find({});
        cursor.forEach(function(d){       
          var pacienteId = d._id;
          if (d.misobras) {
            var tratamientos = d.misobras;
            tratamientos.forEach(function(ob){
              if (obra._id == ob._id){

                //ELIMINO EL TRATAMIENTO              
                Meteor.call('pacientes.removeObra',pacienteId, ob._id);  

                //INSERTO EL TRATAMIENTO
              var obr= {  
                _id: obraSeleccionada._id,
                nombre : obraSeleccionada.nombre,
                telefono: obraSeleccionada.telefono,
                direccion: obraSeleccionada.direccion,
                localidad: obraSeleccionada.localidad,
                provincia: obraSeleccionada.provincia,
                cuil: obraSeleccionada.cuil,
                descripcion: obraSeleccionada.descripcion,
                owner:obraSeleccionada.owner,
              };             

              //inserto los datos en el arreglo
              Pacientes.update({_id:pacienteId},{$push:{misobras:obr}});  
              }
            })
          }       
        });   
      

      	$('#modalObraEditar').modal('hide'); //CIERRO LA VENTANA MODAL
      
  	},
})

