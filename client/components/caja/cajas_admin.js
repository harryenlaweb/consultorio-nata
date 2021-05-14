import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { CajasAdmin } from '../../../lib/collections/cajasAdmin';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.cajasAdmin.onCreated(function(){     
  
  this.selCajasAdminInfo = new ReactiveVar(null);
  

});

Template.cajasAdmin.helpers({
  	searchAttributes() {
    	return {
      		placeholder: 'Buscar ...',
    	};
  	},

    cajaA: function() {     
      return CajasAdmin.findOne();        
    },

  	cajasAdminInfo: function() {     
    	return Template.instance().selCajasAdminInfo.get();        
  	},
});


Template.cajasAdmin.events({ 

	
	'click #prueba': function(event, template){   
		var cajasA = CajasAdmin.find();
    var cantidad =CajasAdmin.find().count();
    console.log(cajasA);
		console.log("cantidad: ",cantidad);
    },

})


Template.cajasAdmin.onRendered(function() {
  

  

});
