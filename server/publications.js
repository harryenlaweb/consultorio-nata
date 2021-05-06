import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../lib/collections/tratamientos';
import { Profesionales } from '../lib/collections/profesionales';
import { Turnos } from '../lib/collections/turnos';
import { Pacientes } from '../lib/collections/pacientes';
import { Obras } from '../lib/collections/obras';
import { Consultorios } from '../lib/collections/consultorios';
import { Operadores } from '../lib/collections/operadores';
import { Historias } from '../lib/collections/historias';


Meteor.publish('tratamientos', function tratamientosPublication()
{
	return Tratamientos.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('profesionales', function profesionalesPublication()
{	
	return Profesionales.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('turnos', function projectsPublication()
{
	return Turnos.find({idConsultorio: Meteor.user().profile.idConsultorio, created:{$gte: new Date((new Date().getTime() - (360 * 24 * 60 * 60 * 1000)))}});
	//return Turnos.find({owner: this.userId});
});

Meteor.publish('pacientes', function projectsPublication()
{
	return Pacientes.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('obras', function projectsPublication()
{
	return Obras.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('consultorios', function projectsPublication()
{
	return Consultorios.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('operadores', function projectsPublication()
{
	return Operadores.find({idConsultorio: Meteor.user().profile.idConsultorio});
});

Meteor.publish('historias', function projectsPublication()
{
	return Historias.find({idConsultorio: Meteor.user().profile.idConsultorio});
});