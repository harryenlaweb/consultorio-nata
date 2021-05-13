import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../lib/collections/tratamientos';
import { Profesionales } from '../lib/collections/profesionales';
import { Turnos } from '../lib/collections/turnos';
import { Pacientes } from '../lib/collections/pacientes';
import { Obras } from '../lib/collections/obras';
import { Consultorios } from '../lib/collections/consultorios';
import { Operadores } from '../lib/collections/operadores';
import { Historias } from '../lib/collections/historias';
import { Images } from '../lib/collections/images';
import { Cajas } from '../lib/collections/cajas';
import { CajasAdmin } from '../lib/collections/cajasAdmin';

Meteor.publish('tratamientos', function(){
	return Tratamientos.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('profesionales', function(){	
	if (Roles.userIsInRole(Meteor.user(), ['adminconsultorio'])) {
			return Profesionales.find({idConsultorio: this.userId});
		} else{
		return Profesionales.find({idConsultorio: Meteor.user().profile.idConsultorio});
	}
	//return Profesionales.find({});
});

Meteor.publish('turnos', function(){
	//return Turnos.find({created:{$gte: new Date((new Date().getTime() - (360 * 24 * 60 * 60 * 1000)))}});
	return Turnos.find({idConsultorio: Meteor.user().profile.idConsultorio, created:{$gte: new Date((new Date().getTime() - (360 * 24 * 60 * 60 * 1000)))}});
	//return Turnos.find({owner: this.userId});
});

Meteor.publish('pacientes', function(){
	return Pacientes.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('obras', function(){
	return Obras.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('consultorios', function(){
	return Consultorios.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('operadores', function(){
	if (Roles.userIsInRole(Meteor.user(), ['adminconsultorio'])) {
			return Operadores.find({idConsultorio: this.userId});
		} else{
		return Operadores.find({idConsultorio: Meteor.user().profile.idConsultorio});
	}
});

Meteor.publish('historias', function(){
	return Historias.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('files.images.all', function () {
  	return Images.find().cursor;
});

Meteor.publish('cajas', function(){	
	if (Roles.userIsInRole(Meteor.user(), ['adminconsultorio'])) {
		return Cajas.find({idConsultorio: this.userId});
	} else{
	return Cajas.find({owner: this.userId});
	}	
});

Meteor.publish('cajasAdmin', function(){	
	//if (Roles.userIsInRole(Meteor.user(), ['adminconsultorio'])) {
		return CajasAdmin.find({});
	//}
});