import { Profesionales } from '../../../lib/collections/profesionales';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);



Template.profesionalModificar.helpers({
	formCollection() {
		return Profesionales;
	}
})

Template.profesionalModificar.onCreated(function()
{
	AutoForm.addHooks(['profesionalModificar'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/profesionales');
		}
	});
})

Template.profesionalModificar.events({
	//************************************** FORMULARIO MODAL PARA RESERVAR UN TURNO **********************************
  'submit #formModificarProfesional':function(event) {


      //------------------ ESTO TIENE QUE ESTAR AL PRINCIPIO SINO DAN ERROR LAS VENTANAS MODALES ------------
      //Prevent default browser form submit
      event.preventDefault();
      // Get value from form element
      const target = event.target;
      var profesionalId = this._id;

      Profesionales.update({_id:this._id},{$set: {
      	nombreApellido : target.nombreApellido.value,
      	dni: target.dni.value,
      	especialidad: target.especialidad.value,
      	telefono: target.telefono.value,
      	email: target.email.value,
      	fechaNacimiento: target.fechaNacimiento.value,
      	sexo: target.sexo.value,
      	descripcion: target.descripcion.value,      	
      }});

      Router.go('/profesionales');     
  },

})