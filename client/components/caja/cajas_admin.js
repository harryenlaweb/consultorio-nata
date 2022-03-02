import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { CajasAdmin, CajitasIndex } from '../../../lib/collections/cajasAdmin';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var'

Template.cajasAdmin.onCreated(function(){     
  
  this.selCajasAdminInfo = new ReactiveVar(null);
  

});

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});

Template.cajasAdmin.helpers({
  	searchAttributes() {
    	return {
      		placeholder: 'Buscar ...',
    	};
  	},

  	cajasAdminInfo: function() {     
    	return Template.instance().selCajasAdminInfo.get();        
  	},
});


Template.cajasAdmin.events({ 

	
	'click #modalInfoCajasAdmin': function(event, template){        
      var cajita = CajasAdmin.findOne({"_id":this._id});      
      Template.instance().selCajasAdminInfo.set(cajita);      
      $('#modalInfoCajasAdmin2').modal('show');
    }, 

})


Template.cajasAdmin.onRendered(function() {
  

  

});
