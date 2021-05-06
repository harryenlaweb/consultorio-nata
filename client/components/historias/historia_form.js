import { Pacientes } from '../../../lib/collections/pacientes';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { Historias } from '../../../lib/collections/historias';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

Template.historiaForm.onCreated(function(){    
  this.selObra2 = new ReactiveVar(null);


});



Template.historiaForm.helpers({
	formCollection() {
		return Pacientes;
	},

	//FUNCION DE TYPEAHEAD PARA AUTOCOMPLETAR LA OBRA SOCIAL Y SELECCIONARLA
	selecObra: function(event, suggestion, datasetName) {
		Template.instance().selObra2.set(suggestion.id);  
		//suggestion.id=null;
	},

	obras1: function() {     
		return Obras.find().fetch().map(function(object){ return {id: object._id, value: object.nombre}; });    
	},
})

Template.historiaForm.onCreated(function()
{
	AutoForm.addHooks(['historiaForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/pacientes');
		}
	});
})

Template.historiaForm.events({  

    'submit #formPaciente':function(event) {
	    // Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target;	
		var ingresoNombre = null; var ingresoDni = null; var ingresoCarnet = null; var ingresoObra = null; var ingresoNombre = null; var ingresoNombre = null;
		var ingresoTelefono = null; var ingresoDireccion = null; var ingresoLocalidad = null; var ingresoProvincia = null; var ingresoEmail = null; var ingresoProfesion = null;
		var ingresoFechaNacimiento = null; var ingresoFechaIngreso = null; var ingresoDescripcion = null; var ob = []; var obraSeleccionada = null;

		console.log(ingresoFechaNacimiento);


		if (target.nombreApellido.value){ingresoNombre = target.nombreApellido.value};
		if (target.dni.value){ingresoDni = target.dni.value};		
		if (target.carnet.value){ingresoCarnet = target.carnet.value};
		ingresoObra = Template.instance().selObra2.get();      
		if (target.telefono.value){ingresoTelefono = target.telefono.value};
		if (target.direccion.value){ingresoDireccion = target.direccion.value};		
		if (target.localidad.value){ingresoLocalidad = target.localidad.value};		
		if (target.provincia.value){ingresoProvincia = target.provincia.value};		
		if (target.email.value){ingresoEmail = target.email.value};		
		if (target.profesion.value){ingresoProfesion = target.profesion.value};		

		if (target.fechaNacimiento.value){			
			ingresoFechaNacimiento = target.fechaNacimiento.value;		
			ingresoFechaNacimiento = moment(ingresoFechaNacimiento, "DD-MM-YYYY");
			ingresoFechaNacimiento = new Date(ingresoFechaNacimiento);//.toDateString("dd-MM-yyyy");
			console.log("TAMBIEN ENTRO ACA!!!");
		};		
		if (target.fechaIngreso.value){
			ingresoFechaIngreso = target.fechaIngreso.value;
			ingresoFechaIngreso = moment(ingresoFechaIngreso, "DD-MM-YYYY");
			ingresoFechaIngreso = new Date(ingresoFechaIngreso);//.toDateString("dd-MM-yyyy");
		};
		
		if (target.descripcion.value){ingresoDescripcion = target.descripcion.value};			

		var espacio = " "; 
		var combinacion = ingresoNombre.concat(espacio);
		combinacion = combinacion.concat(ingresoDni);

		var obraSeleccionada = Obras.findOne({"_id":ingresoObra});//obtengo la Obra Social seleccionada (objeto)     
		if (obraSeleccionada){
			obraSeleccionada = obraSeleccionada.nombre;	
		} 

		/*if (obraSeleccionada){
		//recupero los datos a insertar
	      var ob= [{ _id: obraSeleccionada._id,
	                nombre:obraSeleccionada.nombre,
	                telefono:obraSeleccionada.telefono,
	                direccion: obraSeleccionada.direccion,
	                localidad:obraSeleccionada.localidad,
	                provincia:obraSeleccionada.provincia,
	                descripcion:obraSeleccionada.descripcion,
	                carnet:ingresoCarnet,
	                cuil:obraSeleccionada.cuil,
	                owner:obraSeleccionada.owner,
	      }];       
	  	};*/

	  	if (ingresoFechaNacimiento !== null){
			if (ingresoFechaIngreso !== null){
				Pacientes.insert({
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
					misobras:ob,
				});
				console.log("ENTRO ACA!!");
			}else{
				Pacientes.insert({
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
					descripcion:ingresoDescripcion,
					misobras:ob,
				});
			}
		}else{
			if (ingresoFechaIngreso !== null){
				Pacientes.insert({
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
					fechaIngreso:ingresoFechaIngreso,
					descripcion:ingresoDescripcion,
					misobras:ob,
				});
			} else{
				Pacientes.insert({
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
						descripcion:ingresoDescripcion,
						misobras:ob,
					});
			}
		}
		
			
	    Router.go('/pacientes');
		}
	


});


Template.historiaForm.onRendered(function() {
	//$('.fechaNacimiento').mask('dd/mm/aaaa');
	$("#fechaNacimiento").inputmask("d-m-y");
	$("#fechaIngreso").inputmask("d-m-y");

	Meteor.typeahead.inject();
});