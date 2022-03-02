import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../../../lib/collections/tratamientos';
import { Operadores } from '../../../lib/collections/operadores';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.operadores.onCreated(function(){     
  this.selOperadorEliminar = new ReactiveVar(null);
  this.selOperadorInfo = new ReactiveVar(null);
  this.selOperadorEditar = new ReactiveVar(null);
});


Template.operadores.helpers({
  searchAttributes() {
    return {
      placeholder: 'Buscar ...',
    };
  },
  
  operadorEliminar: function() {     
    return Template.instance().selOperadorEliminar.get();        
  },
  operadorInfo: function() {     
    return Template.instance().selOperadorInfo.get();        
  },
  operadorEditar: function() {     
    return Template.instance().selOperadorEditar.get();        
  },
});


Template.operadores.events({

  'click .modalOperadorInfo': function(event, template){        
      var operador = Operadores.findOne({"_id":this._id});      
      Template.instance().selOperadorInfo.set(operador);      
      $('#modalOperadorInfo').modal('show');
    }, 

	'click .modalRemoveOperador': function(event, template){		
    	var operador = Operadores.findOne({"_id":this._id});	    
	    Template.instance().selOperadorEliminar.set(operador);
	    $('#modalEliminarOperador').modal('show');
  	},

  'click ._remove': function(event, template){ 
	    var operador = Template.instance().selOperadorEliminar.get();
	    Meteor.call('operadores.remove',operador._id);
	    $('#modalEliminarOperador').modal('hide');
	}, 

  'click .modalOperadorEditar': function(event, template){   
      var operador = Operadores.findOne({"_id":this._id});      
      Template.instance().selOperadorEditar.set(operador);
      $('#modalOperadorEditar').modal('show');
    }, 

  'submit #formModificarOperador':function(event) {
     // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;      
      
      var ingresoNombre = null; 
      var ingresoDni = null;       
      var ingresoTelefono = null;    
      var ingresoEmail = null;
      var ingresoFechaNacimiento = null;
      //var ingresoSexo = null;
      var ingresoDescripcion = null;    
      
      if (target.nombreApellido.value){var ingresoNombre = target.nombreApellido.value};
      if (target.dni.value){var ingresoDni = target.dni.value};      
      if (target.telefono.value){var ingresoTelefono = target.telefono.value};
      if (target.email.value){var ingresoEmail = target.email.value};   
      if (target.fechaNacimiento.value){      
        ingresoFechaNacimiento = target.fechaNacimiento.value;    
        ingresoFechaNacimiento = moment(ingresoFechaNacimiento, "DD-MM-YYYY");
        ingresoFechaNacimiento = new Date(ingresoFechaNacimiento);//.toDateString("dd-MM-yyyy");
        console.log("TAMBIEN ENTRO ACA!!!");
      };
      //if (target.sexo.value){var ingresoSexo = target.sexo.value};  
      if (target.descripcion.value){var ingresoDescripcion = target.descripcion.value};          
      
      var operador = Template.instance().selOperadorEditar.get();             

      Operadores.update({_id:operador._id},{$set: {                
        nombreApellido : ingresoNombre,
        dni : ingresoDni,        
        telefono : ingresoTelefono,
        email : ingresoEmail,
        fechaNacimiento : ingresoFechaNacimiento,
        //sexo : ingresoSexo,
        descripcion : ingresoDescripcion,            
      }});
      

      $('#modalOperadorEditar').modal('hide'); //CIERRO LA VENTANA MODAL
      
  },


})



Template.operadores.onRendered(function() {

    $('#datetimepicker2').datetimepicker({
        //inline: true,
        format:'L', 
        locale: 'es',       
    });   
});

