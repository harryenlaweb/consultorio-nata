import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '../lib/collections/tratamientos';
import { Profesionales } from '../lib/collections/profesionales';
import { Turnos } from '../lib/collections/turnos';
import { Pacientes } from '../lib/collections/pacientes';
import { Obras } from '../lib/collections/obras';
import { Consultorios } from '../lib/collections/consultorios';
import { Operadores } from '../lib/collections/operadores';


Meteor.publish('tratamientos', function tratamientosPublication()
{
	return Tratamientos.find({owner: this.userId});
});

Meteor.publish('profesionales', function profesionalesPublication()
{
	return Profesionales.find({owner: this.userId});
});

Meteor.publish('turnos', function projectsPublication()
{
	return Turnos.find({owner: this.userId, created:{$gte: new Date((new Date().getTime() - (360 * 24 * 60 * 60 * 1000)))}});
	//return Turnos.find({owner: this.userId});
});

Meteor.publish('pacientes', function projectsPublication()
{
	return Pacientes.find({owner: this.userId});
});

Meteor.publish('obras', function projectsPublication()
{
	return Obras.find({owner: this.userId});
});

Meteor.publish('consultorios', function projectsPublication()
{
	return Consultorios.find({owner: this.userId});
});

Meteor.publish('operadores', function projectsPublication()
{
	return Operadores.find({owner: this.userId});
});