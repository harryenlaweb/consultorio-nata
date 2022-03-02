import { Operadores } from '../../../lib/collections/operadores';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);




Template.operadorForm.helpers({
	formCollection() {
		return Operadores;
	},
	
})

Template.operadorForm.onCreated(function()
{
	AutoForm.addHooks(['operadorForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/operadores');
		}
	});
})

Template.operadorForm.events({  

    'submit #formOperador':function(event) {
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
		};
		//if (target.sexo.value){var ingresoSexo = target.sexo.value};  
		if (target.descripcion.value){var ingresoDescripcion = target.descripcion.value};         
	    
	    var usuarioLogueado = Meteor.userId(); // EL ID DEL CONSULTORIO ES EL ID DEL ADMINISTRADOR LOGUEADO

	    var usuario= new Object();            
		usuario.email=ingresoEmail;   
		usuario.pass=ingresoDni;   //SETEA LA CONTRASEÑA CON EL EMAIL
		usuario.name=ingresoNombre;
		usuario.idConsultorio=usuarioLogueado;
		usuario.cargo_roles="operador";  
		
		Meteor.call("new_user_consultorio", usuario, function(error, result){  //llamo al metedo que crea el usuario del lado servidor      
	       if(error){
	         alert(error.message);         
	       }
	       if(result){         
	         Operadores.insert({	
	         	idUsuario: result,			
		        nombreApellido : ingresoNombre,
		        idConsultorio: usuarioLogueado,
		        dni : ingresoDni,		        
		        telefono : ingresoTelefono,
		        email : ingresoEmail,
		        fechaNacimiento : ingresoFechaNacimiento,
		        //sexo : ingresoSexo,
		        descripcion : ingresoDescripcion,  
			});

	        Router.go('operadores'); //al crear el usuario devuelvo el perfil creado
	       }
	     });	    
	}
});


Template.operadorForm.onRendered(function() {
	//$('.fechaNacimiento').mask('dd/mm/aaaa');
	$("#fechaNacimiento").inputmask("d-m-y");
	$("#fechaIngreso").inputmask("d-m-y");

	Meteor.typeahead.inject();
});