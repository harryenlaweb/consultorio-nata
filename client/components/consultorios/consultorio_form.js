import { Consultorios } from '../../../lib/collections/consultorios';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

Template.consultorioForm.helpers({
  formCollection() {
    return Consultorios;
  },
})


Template.consultorioForm.events({

  "submit #consultorioForm": function(event, template){   //captura el evento submit del formulario
    event.preventDefault();
    const target=event.target;

    var ingresoNombreConsultorio = null;        
    var ingresoDireccion = null; 
    var ingresoLocalidad = null; 
    var ingresoProvincia= null;
    var ingresoEmail = null;    
    var ingresoPass = null;
    var ingresoDescripcion = null;

    if (target.nombreConsultorio.value){ingresoNombreConsultorio = target.nombreConsultorio.value};    
    if (target.direccion.value){ingresoDireccion = target.direccion.value};   
    if (target.localidad.value){ingresoLocalidad = target.localidad.value};   
    if (target.provincia.value){ingresoProvincia = target.provincia.value};   
    if (target.email.value){ingresoEmail = target.email.value};       
    if (target.pass.value){ingresoPass = target.pass.value};           

    if (target.descripcion.value){ingresoDescripcion = target.descripcion.value};     

      var usuario= new Object();            
      usuario.email=target.email.value;   
      usuario.pass=target.pass.value;   
      usuario.cargo_roles="adminconsultorio";      

     Meteor.call("new_user", usuario, function(error, result){  //llamo al metedo que crea el usuario del lado servidor      
       if(error){
         alert(error.message);         
       }
       if(result){         
         Consultorios.insert({ 
          idUser:result,
          nombreConsultorio:ingresoNombreConsultorio,           
          direccion:ingresoDireccion,
          localidad:ingresoLocalidad,
          provincia:ingresoProvincia,
          email:ingresoEmail,          
          descripcion:ingresoDescripcion,
          rol:"adminconsultorio",
        });

        Router.go('consultorios'); //al crear el usuario devuelvo el perfil creado
       }
     });


  },
});
Template.consultorioForm.onRendered(function(){
  //$("#dni").inputmask("99999999");
  $("#dni").inputmask("9999999[9]"); //mask with dynamic syntax

})
