import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Profesionales } from '/lib/collections/profesionales';
import { Pacientes } from '/lib/collections/pacientes';
import { Turnos } from '/lib/collections/turnos';
import { Images } from '/lib/collections/images';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';
import './calendarprofesional.html';

Template.calendarprofesional.onCreated(function(){   
  this.selProfesionales = new ReactiveVar(null);  
  this.selPaciente = new ReactiveVar(null);  
  this.selMostrarInfoTurno = new ReactiveVar(false);  
  this.selDia = new ReactiveVar(null);  
  this.selModalInfoPaciente = new ReactiveVar();
  this.selModalInfoTratamientos = new ReactiveVar([]);
  this.selModalHistoriaClinica = new ReactiveVar(null);
  this.selModalInfoTurno = new ReactiveVar(null);
  this.selActualizarVista = new ReactiveVar(true);
  this.currentUpload = new ReactiveVar(false);
});

//OBTIENE LOS MINUTOS ENTRE DOS FECHAS TIPO DATE
function diferenciaMinutos( startTime, endTime ){
  var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
  var resultInMinutes = Math.round(difference / 60000);  
  return Number(resultInMinutes);
}

Template.registerHelper('formatDate1', function(date) {
  return moment(date).format("HH:mm");
});

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});

Template.registerHelper('formatDate3', function(date) {
  return moment(date).format('DD-MM-YYYY HH:mm');
});

Template.registerHelper('compare', function(v1, v2) {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2); // do a object comparison
  } else {
    return v1 === v2;
  }
});


Template.registerHelper('iguales', function(string_a, string_b) {
  var resultado = string_a.localeCompare(string_b);
  if (resultado === 0){
    return true;
  }
  else{
    return false;
  }
});

let arr = [];

Template.calendarprofesional.helpers({  

  formCollection() {
    return Turnos;
  },


  searchAttributes() {
    return {
      placeholder: 'Buscar ...',
    };
  },

//-------------------IMAGES------------------
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },
  uploadedFiles: function () {   
    return Images.find();
  },

//-------------------INFORMACION PARA LA VENTANA MODAL DE LOS TURNOS ------------------------------
  
  'ModalInfoPaciente': function(){
    return Template.instance().selModalInfoPaciente.get();
  },  

  'ModalInfoTurno': function(){
    return Template.instance().selModalInfoTurno.get();
  },

  'ModalInfoTratamientos': function(){
    return Template.instance().selModalInfoTratamientos.get();
  },

  'ActualizarVista': function(){
    var recuperar = Template.instance().selActualizarVista.get();    
    return recuperar;
    
  },

  //--------------------------------------------------------------------------------------
  
  dia: function() {    
    var diaSel = Template.instance().selDia.get();
    return diaSel;
  },
 
  turnos: function() {    
    //recupero el profesional seleccionado
    var idpro = Meteor.userId();    
    var pro1 = Profesionales.findOne({"idUsuario":idpro});
    idProfesional = pro1._id;
    
    Template.instance().selProfesionales.set(idProfesional);
    var profesionalId = Template.instance().selProfesionales.get();    
    
    //recupero el dia seleccionado
    var diaSeleccionado = Template.instance().selDia.get();     
    
    //CONVIERTO LAS FECHAS A FORMATO ISO   
    var iso1 = new Date(diaSeleccionado);
    var iso2 = new Date(diaSeleccionado);
    var diaiso2 = iso2.getDate()+1; //le sumo un dia a la fecha para buscar en dos rangos de fechas HOY<X<MAÑANA
    iso2.setDate(diaiso2);
    

    if (profesionalId) {
      var tur = Turnos.find({"profesional._id":profesionalId,"inicio" : {"$gte" : iso1, "$lt" : iso2}},{sort: {inicio: 1}});
      return tur; 
    }    
  },
  
});


Template.calendarprofesional.events({ 


  //----------------SELECT DIA DEL CALENDARIO -------------------
  'dp.change #datetimepicker1': function(event, instance) {    
    var eleccion = event.date._d;    
    instance.selDia.set(eleccion);     
  },

  
  //************************************** FORMULARIO MODAL PARA CARGAR HISTORIA CLINICA **********************************
  'submit #formHistoriaClinica':function(event,template) {       

      event.preventDefault();     
      const target = event.target;      

      var idImage,name,type, extension;
      var linkImage = null;

      if (target.fileInput.files && target.fileInput.files[0]) {      
          var file = target.fileInput.files[0];
          if (file) {
            var uploadInstance = Images.insert({
              file: file,
              chunkSize: 'dynamic'
            }, false);

            uploadInstance.on('start', function() {              
              template.currentUpload.set(this);
            });

            uploadInstance.on('end', function(error, fileObj) {               
              template.currentUpload.set(false);
            });
            uploadInstance.start();            

            idImage = uploadInstance.config.fileId;  
            name = uploadInstance.file.name;
            type = uploadInstance.file.type;
            extension = uploadInstance.file.extension;

            linkImage = "http://localhost:3000/cdn/storage/Images/".concat(idImage,"/original/",idImage,".",extension);
          }
        }                       

      
      var ingresoComentario = target.comentario.value;       
      
      let hist= { comentario: ingresoComentario,
                  idImage: idImage,
                  link: linkImage,
                  name: name,
      };   
      
      var turno = Template.instance().selModalHistoriaClinica.get();      
      idPaciente = turno.paciente._id;

      Pacientes.update({_id:idPaciente},{$push:{mishistorias:hist}});   

      //CUANDO EL PROFESIONAL LOS RECIBE, DEBE CARGAR LA HISTORIA CLINICA Y AL GUARDARLA CAMBIA A "ATENDIDO"
      Turnos.update({_id: turno._id},{$set: {estado :  "ATENDIDO"}});    

      //TAMBIEN DEBE BORRAR EL BOTON PARA ASIGNAR UNA HISTORIA CLINICA
      

      $('#modalHistoriaClinica2').modal('hide'); //CIERRO LA VENTANA MODAL
  },

  //*******************************MUESTRO LOS DATOS DE LOS TRATAMIENTOS DEL TURNO********************************
  'click #modalHistoriaClinica1': function(event, template){       
      var turnoId = this._id;
      var turno = Turnos.findOne({"_id":turnoId});       
      Template.instance().selModalHistoriaClinica.set(turno);//recupero el turno seleccionado      
      $('#modalHistoriaClinica2').modal('show');
    },      



  //*******************************MUESTRO LOS DATOS DEL PACIENTE DEL TURNO********************************
  'click #modalInfoPaciente': function(event, template){       
      var turnoId = this._id;      
      var turno = Turnos.findOne({"_id":turnoId});            
      Template.instance().selModalInfoPaciente.set(turno.paciente);  
      $('#modalInfoPaciente').modal('show');
    },  

  //*******************************MUESTRO LOS DATOS DE LOS TRATAMIENTOS DEL TURNO********************************
  'click #modalInfoTratamientos': function(event, template){       
      var turnoId = this._id;
      var turno = Turnos.findOne({"_id":turnoId});      
      Template.instance().selModalInfoTurno.set(turno);      
      Template.instance().selModalInfoTratamientos.set(turno.tratamientos);      
      $('#modalInfoTratamientos').modal('show');
    },

});

Template.calendarprofesional.onRendered(function() {
    //const instance = Template.instance();

    $('#datetimepicker1').datetimepicker({
        inline: true,
        format:'L', 
        locale: 'es',       
    });


    //---------------------BORRO LOS DATOS DE LA VENTANAS MODALES-------------------  
    $("#modalHistoriaClinica2").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });   

    $("#modalInfoPaciente").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });
    
    $('#example-multiple-selected').multiselect();

    Meteor.typeahead.inject();    
});