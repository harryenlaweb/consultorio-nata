import { Tratamientos } from '../../../lib/collections/tratamientos';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);



Template.tratamientoForm.helpers({
	formCollection() {
		return Tratamientos;
	},	
})

Template.tratamientoForm.onCreated(function()
{
	AutoForm.addHooks(['tratamientoForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/tratamientos');
		}
	});
})