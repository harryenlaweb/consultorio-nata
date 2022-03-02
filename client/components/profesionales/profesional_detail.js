Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});