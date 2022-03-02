import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Consultorios } from '../../../lib/collections/consultorios';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.consultorios.onCreated(function(){       
  this.selConsultorioInfo = new ReactiveVar(null);
  this.selConsultorioEditar = new ReactiveVar(null);  
  this.selConsultorioChangePass = new ReactiveVar(null);  
});

Template.consultorios.helpers({
    searchAttributes() {
      return {
          placeholder: 'Buscar ...',
      };
    },    

    consultorioInfo: function() {     
      return Template.instance().selConsultorioInfo.get();        
    },

    consultorioEditar: function() {     
      return Template.instance().selConsultorioEditar.get();        
    },

    consultorioChangePass: function() {     
      return Template.instance().selConsultorioChangePass.get();        
    },

    
});


Template.consultorios.events({
  'click .remove': function(event, template){   
    Meteor.call('consultorios.remove',this._id);
  },

  'click .modalConsultorioInfo': function(event, template){   
    var consultorio = Consultorios.findOne({"_id":this._id});      
    Template.instance().selConsultorioInfo.set(consultorio);
    $('#modalConsultorioInfo').modal('show');
    },    

    'click .modalConsultorioEditar': function(event, template){   
      var consultorio = Consultorios.findOne({"_id":this._id});      
      Template.instance().selConsultorioEditar.set(consultorio);
      $('#modalConsultorioEditar').modal('show');
    }, 

    'click .modalConsultorioChangePass': function(event, template){   
      var consultorio = Consultorios.findOne({"_id":this._id});      
      Template.instance().selConsultorioChangePass.set(consultorio);
      $('#modalConsultorioChangePass').modal('show');
    }, 

    'submit #formChangePassConsultorio': function(event){
        event.preventDefault();        
        var newpass = event.target.newpass.value;
        var newpassaux = event.target.newpassaux.value;        
        var consultorio = Template.instance().selConsultorioChangePass.get();
        var idUser = consultorio.idUser;

        console.log(idUser);
        console.log(newpass);
            if (newpass == newpassaux){ //puedo proceder a cambiar el password                            
              Meteor.call('changePass',idUser,newpass,function(err,result){
                if(!err){
                 console.log("Congrats you change the password")
                 $('#modalConsultorioChangePass').modal('hide'); //CIERRO LA VENTANA MODAL
                }else{
                  console.log("pup there is an error caused by " + err.reason)
                }
              })              
            } else{              
              alert("Las contraseñas no coinciden");
            }                  
    },

    'submit #formModificarConsultorio':function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;  

      if (target.nombreApellido.value){var ingresoNombre = target.nombreApellido.value};
      if (target.dni.value){var ingresoDni = target.dni.value};      
      if (target.legajo.value){var ingresoLegajo = target.legajo.value};      
      if (target.telefono.value){var ingresoTelefono = target.telefono.value};
      if (target.direccion.value){var ingresoDireccion = target.direccion.value};   
      if (target.localidad.value){var ingresoLocalidad = target.localidad.value};   
      if (target.provincia.value){var ingresoProvincia = target.provincia.value};   
      if (target.email.value){var ingresoEmail = target.email.value};         
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
      
      var consultorio = Template.instance().selConsultorioEditar.get();

      Consultorios.update({_id:consultorio._id},{$set: {
        nombreApellido:ingresoNombre, 
        dni:ingresoDni, 
        legajo:ingresoLegajo,
        nombreDni:combinacion,        
        telefono:ingresoTelefono,
        direccion:ingresoDireccion,
        localidad:ingresoLocalidad,
        provincia:ingresoProvincia,
        email:ingresoEmail,        
        fechaNacimiento:ingresoFechaNacimiento,
        fechaIngreso:ingresoFechaIngreso,
        descripcion:ingresoDescripcion,        
      }});

      $('#modalConsultorioEditar').modal('hide'); //CIERRO LA VENTANA MODAL
      
  },
})


Template.consultorios.onRendered(function() {
  //$('.fechaNacimiento').mask('dd/mm/aaaa');
  $("#fechaNacimiento2").inputmask("d-m-y");
  $("#fechaIngreso2").inputmask("d-m-y");

  Meteor.typeahead.inject();

});
