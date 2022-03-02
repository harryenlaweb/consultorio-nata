import { Turnos } from '../../../lib/collections/turnos';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';

Template.calendar.created = function() {     
  this.selDia = new ReactiveVar(new Date());
  this.selInicio = new ReactiveVar(null);
  this.selFin = new ReactiveVar(null);  
}

//FUNCION QUE TRANSFORMA EL FORMATO DE FECHA
Template.registerHelper('formatDate', function(date) {
  return moment(date).format("DD-MM-YYYY, h:mm:ss a");
});

//SimpleSchema.setDefaultTemplate('materialize');
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);


Template.turnoForm.helpers({
	formCollection() {
		return Turnos;
	}
})

Template.turnoForm.onCreated(function()
{
	AutoForm.addHooks(['turnoForm'],{
		onSuccess: function(operation, result, template)
		{
			Router.go('/turnos');
		}
	});
});

Template.turnoForm.events({  

    'submit .form-horizontal':function(event) {
	    // Prevent default browser form submit
	    event.preventDefault();

	    // Get value from form element
	    const target = event.target;
	    const text = target.text.value; 	    
	    const text2 = target.text2.value; 	

	    var iso1 = new Date(text);   
	    var iso2 = new Date(text2);

	    Turnos.insert({inicio:iso1,fin:iso2});

	    Router.go('/turnos');	   
	},


});

Template.turnoForm.onRendered(function() {
   $('#datetimepicker1').datetimepicker({
	    //inline: true,
	    sideBySide: true,
	    //format:'L',      
	});
   $('#datetimepicker2').datetimepicker({
	    //inline: true,
	    sideBySide: true,
	    //format:'L',      
	});
   
});