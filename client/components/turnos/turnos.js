import { Meteor } from 'meteor/meteor';


Template.turnos.events({
	'click .remove': function(event, template){		
		Meteor.call('turnos.remove',this._id);
	}
})

Template.turnos.helpers({
  searchAttributes() {
    return {
      placeholder: 'Buscar ...',
    };
  },
});

//FUNCION QUE TRANSFORMA EL FORMATO DE FECHA
Template.registerHelper('formatDate', function(date) {
  return moment(date).format("DD-MM-YYYY HH:mm");
});