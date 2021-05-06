import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Tratamientos, TratamientosIndex } from '../lib/collections/tratamientos';
import { Profesionales, ProfesionalesIndex } from '../lib/collections/profesionales';
import { Turnos, TurnosIndex } from '../lib/collections/turnos';
import { Pacientes, PacientesIndex } from '../lib/collections/pacientes';
import { Obras, ObrasIndex } from '../lib/collections/obras';
import { Consultorios, ConsultoriosIndex } from '../lib/collections/consultorios';
import { Operadores, OperadoresIndex } from '../lib/collections/operadores';

Router.onBeforeAction(function () {  

  if (!Meteor.userId()) {    
    Router.go('home');    
  } else {  	
    if(Router.current().route.getName() === 'home'){
       //Router.go('calendar');       
       var loggedInUser = Meteor.user();
       if (Roles.userIsInRole(loggedInUser, ['adminconsultorio'])) {
		    Router.go('profesionales');       
		} else {
			if (Roles.userIsInRole(loggedInUser, ['admin'])) {
				Router.go('consultorios');       
			} else {
				if (Roles.userIsInRole(loggedInUser, ['profesional','operador'])) {
				    Router.go('calendar');       
				};
			}
		}

    }        
  }
  this.next();
  
});

Router.configure({
	layoutTemplate: 'baseLayout',
	waitOn:function() {
			 	return [				 	
				 	function() { return Meteor.subscribe('tratamientos'); },
				 	function() { return Meteor.subscribe('profesionales'); },
				 	function() { return Meteor.subscribe('turnos'); },
				 	function() { return Meteor.subscribe('pacientes'); },
				 	function() { return Meteor.subscribe('tratamientosProfesional'); },
				 	function() { return Meteor.subscribe('obras'); },
				 	function() { return Meteor.subscribe('consultorios'); },
				 	function() { return Meteor.subscribe('operadores'); },

			 	];			 	
	},	
});

Router.route('/', {
  name: 'home'
});



//-------------------------------SECCION TRATAMIENTOS----------------------------------
Router.route('/tratamientos',{
	name: 'tratamientos',
	data: {
		tratamientos(){
			return TratamientosIndex;
		}
	}
})

Router.route('/tratamiento_form', {
	name: 'tratamiento_form'
})

Router.route('/tratamiento/:_id', function(){
	let tratamiento = Tratamientos.findOne({_id: this.params._id});
	if (!tratamiento){
		Router.go('tratamientos');
	}
	else{
		this.render('tratamiento_detail',{
			data: {
				tratamiento: tratamiento
			}
		})
	}
}, {
	name: 'tratamiento_detail'
})


//-------------------------------SECCION PROFESIONALES----------------------------------
Router.route('/profesionales',{
	name: 'profesionales',
	data: {
		profesionales(){
			return ProfesionalesIndex;
		}
	}
})

Router.route('/profesional_form', {
	name: 'profesional_form'
})

Router.route('/profesional/:_id', function(){
	let profesional = Profesionales.findOne({_id: this.params._id});
	if (!profesional){
		Router.go('profesionales');
	}
	else{
		this.render('profesional_detail',{
			data: {
				profesional: profesional
			}
		})
	}
}, {
	name: 'profesional_detail'
})

Router.route('/profesional_modificar/:_id', function(){
	let profesional = Profesionales.findOne({_id: this.params._id});
	if (!profesional){
		Router.go('profesionales');
	}
	else{
		this.render('profesional_modificar',{
			data: {
				profesional: profesional
			}
		})
	}
}, {
	name: 'profesional_modificar'
})

Router.route('/profesional_tratamiento/:_id', function(){
	let profesional = Profesionales.findOne({_id: this.params._id});
	if (!profesional){
		Router.go('profesionales');
	}
	else{
		this.render('profesional_tratamiento',{
			data: {
				profesional: profesional,
				tratamientos(){
					return TratamientosIndex;
				}
			}
		})
	}
}, {
	name: 'profesional_tratamiento',	
})

//-------------------------------SECCION PROFILE----------------------------------
Router.route('/profile', {
	name: 'profile',
	data: {
		user() {
			if(Meteor.user()){
				return {
				id: Meteor.user()._id,
				email: Meteor.user().emails[0].address
				}
			}
			
		}
	}
})

//-------------------------------SECCION CALENDARIO----------------------------------

Router.route('/calendar',{
	name: 'calendar',
	data: {
		profesionales(){
			return ProfesionalesIndex;
		},
		tratamientos(){
			return TratamientosIndex;
		},
		turnos(){
			return TurnosIndex;
		},
		pacientes(){
			return PacientesIndex;
		},
	}
})

//-------------------------------SECCION TURNOS----------------------------------

Router.route('/turnos',{
	name: 'turnos',
	data: {
		turnos(){
			return TurnosIndex;
		}
	}
})

Router.route('/turno_form', {
	name: 'turno_form',
	data: {		
		turnos(){
			return Turnos;
		}
	}
})

Router.route('/turno_tratamiento/:_id', function(){
	let turno = Turnos.findOne({_id: this.params._id});
	if (!turno){
		Router.go('turnos');
	}
	else{
		this.render('turno_tratamiento',{
			data: {
				turno: turno,
				tratamientos(){
					return TratamientosIndex;
				},
				pacientes(){
					return PacientesIndex;
				},
			}
		})
	}
}, {
	name: 'turno_tratamiento',	
})

//-------------------------------SECCION PACIENTES----------------------------------
Router.route('/pacientes',{
	name: 'pacientes',
	data: {
		pacientes(){
			return PacientesIndex;
		}
	}
})

Router.route('/paciente_form', {
	name: 'paciente_form'
})

Router.route('/historias/:_id', function(){
	let paciente = Pacientes.findOne({_id: this.params._id});
	if (!paciente){
		Router.go('pacientes');
	}
	else{
		this.render('historias',{
			data: {
				paciente: paciente,
				pacientes(){
					return PacientesIndex;
				}
			}
		})
	}
}, {
	name: 'historias',	
})
//-------------------------------SECCION OBRAS----------------------------------
Router.route('/obras',{
	name: 'obras',
	data: {
		obras(){
			return ObrasIndex;
		}
	}
})

Router.route('/obra_form', {
	name: 'obra_form'
})

Router.route('/obra/:_id', function(){
	let obra = Obras.findOne({_id: this.params._id});
	if (!obra){
		Router.go('obras');
	}	
	else{
		this.render('obra_detail',{
			data: {
				obra: obra
			}
		})
	}
}, {
	name: 'obra_detail'
})

Router.route('/obra_modificar/:_id', function(){
	let obra = Obras.findOne({_id: this.params._id});
	if (!obra){
		Router.go('obras');
	}
	else{
		this.render('obra_modificar',{
			data: {
				obra: obra
			}
		})
	}
}, {
	name: 'obra_modificar'
})

Router.route('/paciente_obra/:_id', function(){
	let paciente = Pacientes.findOne({_id: this.params._id});
	if (!paciente){
		Router.go('pacientes');
	}
	else{
		this.render('paciente_obra',{
			data: {
				paciente: paciente,
				obras(){
					return ObrasIndex;
				}
			}
		})
	}
}, {
	name: 'paciente_obra',	
})

//-------------------------------SECCION CONSULTORIOS------------------------
Router.route('/consultorios',{
	name: 'consultorios',
	data: {
		consultorios(){
			return ConsultoriosIndex;
		}
	}
})

Router.route('/consultorio_form', {
	name: 'consultorio_form'
})

//-------------------------------SECCION OPERADORES------------------------
Router.route('/operadores',{
	name: 'operadores',
	data: {
		operadores(){
			return OperadoresIndex;
		}
	}
})

Router.route('/operador_form', {
	name: 'operador_form'
})

