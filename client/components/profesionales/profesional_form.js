import { Profesionales } from '../../../lib/collections/profesionales';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);




Template.profesionalForm.helpers({
	formCollection() {
		return Profesionales;
	},
	
})

Template.profesionalForm.onCreated(function()
{
	AutoForm.addHooks(['profesionalForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/profesionales');
		}
	});
})

Template.profesionalForm.events({  

    'submit #formProfesional':function(event) {
	    // Prevent default browser form submit
	    event.preventDefault();

	    // Get value from form element
	    const target = event.target; 	  

	    var ingresoCombos = null;        
		var ingresoNombre = null; 
	    var ingresoDni = null; 
	    var ingresoEspecialidad= null;
	    var ingresoTelefono = null;    
	    var ingresoEmail = null;
	    var ingresoFechaNacimiento = null;
	    //var ingresoSexo = null;
	    var ingresoDescripcion = null;    

		//if (target.combos.value){var ingresoCombos = target.combos.checked};            
		//console.log('combos:',ingresoCombos);
		if (target.nombreApellido.value){var ingresoNombre = target.nombreApellido.value};
		if (target.dni.value){var ingresoDni = target.dni.value};
		if (target.especialidad.value){var ingresoEspecialidad = target.especialidad.value};
		if (target.telefono.value){var ingresoTelefono = target.telefono.value};
		if (target.email.value){var ingresoEmail = target.email.value};   
		if (target.fechaNacimiento.value){			
			ingresoFechaNacimiento = target.fechaNacimiento.value;		
			ingresoFechaNacimiento = moment(ingresoFechaNacimiento, "DD-MM-YYYY");
			ingresoFechaNacimiento = new Date(ingresoFechaNacimiento);//.toDateString("dd-MM-yyyy");
			
		};
		//if (target.sexo.value){var ingresoSexo = target.sexo.value};  
		if (target.descripcion.value){var ingresoDescripcion = target.descripcion.value}; 

		var usuarioLogueado = Meteor.userId(); // EL ID DEL CONSULTORIO ES EL ID DEL ADMINISTRADOR LOGUEADO
	    
	    var usuario= new Object();            
		usuario.email=ingresoEmail;   
		usuario.pass=ingresoDni;   //SETEA LA CONTRASEÑA CON EL EMAIL
		usuario.name=ingresoNombre;
		usuario.idConsultorio=usuarioLogueado;
		usuario.cargo_roles="profesional";  
		
		Meteor.call("new_user_consultorio", usuario, function(error, result){  //llamo al metedo que crea el usuario del lado servidor      
	       if(error){
	         alert(error.message);         
	       }
	       if(result){  	       	
	         Profesionales.insert({
	         	idUsuario: result,
	         	idConsultorio: usuarioLogueado,
				combos : ingresoCombos,
		        nombreApellido : ingresoNombre,
		        dni : ingresoDni,
		        especialidad : ingresoEspecialidad,
		        telefono : ingresoTelefono,
		        email : ingresoEmail,
		        fechaNacimiento : ingresoFechaNacimiento,
		        //sexo : ingresoSexo,
		        descripcion : ingresoDescripcion,  
			});

	        Router.go('profesionales'); //al crear el usuario devuelvo el perfil creado
	       }
	     });	    
	}
	


});


Template.profesionalForm.onRendered(function() {
	//$('.fechaNacimiento').mask('dd/mm/aaaa');
	$("#fechaNacimiento").inputmask("d-m-y");
	$("#fechaIngreso").inputmask("d-m-y");

	Meteor.typeahead.inject();
});