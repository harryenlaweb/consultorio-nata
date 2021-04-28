import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Notes } from './notes';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { EasySearch } from 'meteor/easy:search';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Projects = new Mongo.Collection('projects');

export const ProjectsIndex = new EasySearch.Index({
	collection: Projects,
	fields: ['name', 'summary'],
	engine: new EasySearch.Minimongo(),
	defaultSearchOptions: {limit: 2}
})
Projects.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: 'Nombre del proyecto',
		max: 200
	},
	owner:{
		type: String,
		label: "Propietario",
		autoValue() {
			return this.userId
		},
		autoform: {
			type: "hidden"
		}
	},
	created: {
		type: Date,
		autoValue() {
			return new Date()
		},
		autoform: {
			type: "hidden"
		}
	},
	summary:{ 
		type: String, 
		label: 'Detalle del Proyecto', 
		optional: true, 
		max: 2000, 
		autoform:{ 
			type: "textarea", 
			row: 10, 
			//class: "materialize-textarea"
			class: "textarea"
		}
	}﻿,
	
	notes: {
    type: Array,
    optional: true,    
  	},
  	'notes.$': Notes
}));

Projects.allow({
	insert: function(userId, doc){
		return doc.owner === userId;
	}
})

Meteor.methods({
	'projects.remove'(projectId){
		check(projectId, String);
		Projects.remove(projectId);
	}
})