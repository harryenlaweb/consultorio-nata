import { Obras } from '../../../lib/collections/obras';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);



Template.obraForm.helpers({
	formCollection() {
		return Obras;
	}
})

Template.obraForm.onCreated(function()
{
	AutoForm.addHooks(['obraForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/obras');
		}
	});
})

Template.obraForm.events({  

    


});