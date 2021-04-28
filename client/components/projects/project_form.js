import { Projects } from '../../../lib/collections/projects';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);



Template.projectForm.helpers({
	formCollection() {
		return Projects;
	}
})

Template.projectForm.onCreated(function()
{
	AutoForm.addHooks(['projectForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/projects');
		}
	});
})