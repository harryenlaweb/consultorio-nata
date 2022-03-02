import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tratamientos } from '/lib/collections/tratamientos';
import { Profesionales } from '/lib/collections/profesionales';
import { Pacientes } from '/lib/collections/pacientes';
import { Turnos } from '/lib/collections/turnos';
import { Obras } from '/lib/collections/obras';
import { Images } from '/lib/collections/images';
import { Router } from 'meteor/iron:router';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';
import './calendar.html';

Template.calendar.onCreated(function(){   
  this.selProfesionales = new ReactiveVar(null);
  this.selTratamiento = new ReactiveVar(null); 
  this.selTratamientos = new ReactiveVar([]);
  this.selPaciente = new ReactiveVar(null);
  this.selPacienteBuscar = new ReactiveVar(null);
  this.selMostrarInfoTurno = new ReactiveVar(false);
  this.selTurnoLibre = new ReactiveVar(null);   
  this.selDia = new ReactiveVar(null);
  this.selDuracion = new ReactiveVar(0);
  this.selImporte = new ReactiveVar(0);  
  this.selModalInfoPaciente = new ReactiveVar();
  this.selModalInfoTratamientos = new ReactiveVar([]);
  this.selModalHistoriaClinica = new ReactiveVar(null);
  this.selModalInfoTurno = new ReactiveVar(null);
  this.selTurnoEliminar = new ReactiveVar(null);
  this.selMyMenuItems = new ReactiveVar([]);  
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

Template.calendar.helpers({  
  formCollection() {
    return Profesionales;
  },
  formCollection() {
    return Pacientes;
  },
  formCollection() {
    return Turnos;
  },
  formCollection() {
    return Obras;
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

//--------------------------------------------------------------------------------------------------
  'myMenuItems': function selectedItems() {   
   
    //return Template.instance().selMyMenuItems.get();
     var profesionalId = Template.instance().selProfesionales.get();  
    var cursor = Profesionales.findOne({_id:profesionalId},{'mistratamientos': 1});      
    arr = [];
    
   // var cursor = Profesionales.findOne({nombreApellido:"DEPILACION MEDICA DEFINITIVA CON LASER"},{'mistratamientos': 1});    

    let arreglo = cursor.mistratamientos;
    let arrayLength = arreglo.length;
    for (var i = 0; i < arrayLength; i++) {
        var elemento = arreglo[i];
        let obj = {};
        obj.value = elemento._id;
        if (elemento.duracion !== undefined){
          obj.caption = (elemento.nombre).concat(" / ").concat(elemento.duracion).concat(" min");
        }
        else{
          obj.caption = elemento.nombre;
        }        
        obj.selected = false;
        arr[i] = obj;        
    };

    Template.instance().selMyMenuItems.set(arr);
    
    return arr;
  },

  'mySelectedList': function selectedList() {
    let retVal = arr.filter(function aFilter(elem) {return elem.selected;})
    .map(function aMap(elem) {return elem.value;});
    return retVal ? retVal : [];
  },

  'myConfigOptions': function configOptions() {
    //CON ESTO PUEDO LLAMAR A Template.instance() DENTRO DE LA FUNCION onChange()
    Template.instance().selDuracion.set(0);
    Template.instance().selImporte.set(0);
    const instance = Template.instance();
    return {

      'nonSelectedText': 'Seleccione tratamientos',
      //'buttonClass': 'btn btn-primary',
      'numberDisplayed': 1,
      //'includeSelectAllOption':true,
      'onChange': function onChange(option, checked) {
        let index = $(option).val();
        let tra = Tratamientos.findOne({_id:index});
        let dur = instance.selDuracion.get();
        let imp = instance.selImporte.get();

        var arreglo = instance.selTratamientos.get();

        if (tra.duracion !== undefined){
          if (checked === true){
            tra_dura = Number(tra.duracion);
            tra_imp = Number(tra.importe);
            
            let trat= { _id: tra._id,
                        nombre:tra.nombre,
                        duracion:tra_dura,
                        importe:tra_imp };

            var encontro = false;
            var indice = 0;
            for(var i =0, len = arreglo.length; i < len; i++){
                var item = arreglo[i];
                if (item._id === trat._id){
                  encontro = true;
                  indice = i;
                }
            }
            if (!encontro){
               arreglo.push(trat);
            }
            else{
              console.log("YA INSERTO ESTE TRATAMIENTO");
            }            

            dur = Number(dur);
            imp = Number(imp);
            dur = dur + tra_dura;
            imp = imp + tra_imp;
            instance.selDuracion.set(dur);
            instance.selImporte.set(imp);
          }
          else{
            tra_dura = Number(tra.duracion);
            tra_imp = Number(tra.importe);

            let trat= { _id: tra._id,
                        nombre:tra.nombre,
                        duracion:tra_dura,
                        importe:tra_imp };

            var encontro = false;
            var indice = 0;
            for(var i =0, len = arreglo.length; i < len; i++){
                var item = arreglo[i];
                if (item._id === trat._id){
                  encontro = true;
                  indice = i;
                }
            }
            if (encontro){
              arreglo.splice(indice, 1);
            }
            else{
              console.log("NO SE ELIMINO NADA YA INSERTO ESTE TRATAMIENTO");
            }               
            
            dur = Number(dur);
            imp = Number(imp);
            dur = dur - tra_dura;
            imp = imp - tra_imp;
            instance.selDuracion.set(dur);
            instance.selImporte.set(imp)
;          }
          
        }        
        arr.indexOf(index).selected = checked;
      }

    };
  },

  //--------------------------------------------------------------------------------------

  duracion1: function() {     
    return Template.instance().selDuracion.get();        
  },

  importe1: function() {     
    return Template.instance().selImporte.get();        
  },

  turnoEliminar: function() {     
    return Template.instance().selTurnoEliminar.get();        
  },

  //FUNCION DE TYPEAHEAD PARA AUTOCOMPLETAR EL PACIENTE Y SELECCIONARLO
  selecPaciente: function(event, suggestion, datasetName) {
    Template.instance().selPaciente.set(suggestion.id);  
    //suggestion.id=null;
  },

  

  pacientes1: function() {     
    return Pacientes.find().fetch().map(function(object){ return {id: object._id, value: object.nombreDni}; });    
  },

  //--------------------------INFO VENTANA EMERGENTE PARA BUSCAR TURNOS DEL PACIENTE ------------------------------------

  //FUNCION DE TYPEAHEAD PARA AUTOCOMPLETAR EL PACIENTE Y SELECCIONARLO
  selecPacienteBuscar: function(event, suggestion, datasetName) {
    Template.instance().selPacienteBuscar.set(suggestion.id);  
    Template.instance().selMostrarInfoTurno.set(true);  
    //suggestion.id=null;
  },

  pacientesBuscar: function() {     
    return Pacientes.find().fetch().map(function(object){ return {id: object._id, value: object.nombreDni}; });    
  },

  turnosBuscar: function() {    
    //recupero el paciente seleccionado
    var pacienteId = Template.instance().selPacienteBuscar.get();
    var mostrar = Template.instance().selMostrarInfoTurno.get();

    if (mostrar){
      if (pacienteId) {
      var tur = Turnos.find({"paciente._id":pacienteId},{sort: {inicio: 1}});
      return tur; 
      } 
    }
    else{      
      return null;
    }
    
           
  },

  //recupero los tratamientos del profesional seleccionado
  tratamientos1: function() {
    var profesionalId = Template.instance().selProfesionales.get();     
    var cursor = Profesionales.findOne({_id:profesionalId},{'mistratamientos': 1});      
    var campo = cursor.mistratamientos;   
    return campo;
  },

  profesionales1: function() {
    var prof = Profesionales.find();
    return prof;
  },

  //RECUPERO EL TRATAMIENTO SELECCIONADO PARA PODER INSERTAR EL TURNO
  tratamiento1: function() {    
    var tratamientoId = Template.instance().selTratamiento.get();
    var tra = Tratamientos.findOne({"_id":tratamientoId});
    Template.instance().selDuracion.set(tra.duracion);
    return tra;
  },

 //FUNCION DE TYPEAHEAD PARA AUTOCOMPLETAR LA OBRA SOCIAL Y SELECCIONARLA
  selecObra: function(event, suggestion, datasetName) {
    Template.instance().selObra2.set(suggestion.id);  
    //suggestion.id=null;
  },

  obras1: function() {     
    return Obras.find().fetch().map(function(object){ return {id: object._id, value: object.nombre}; });    
  },

  dia: function() {    
    var diaSel = Template.instance().selDia.get();
    return diaSel;
  },
  profesional1: function() {    
    var profesionalesId = Template.instance().selProfesionales.get();
    var pro = Profesionales.findOne({"_id":profesionalesId});
    return pro;
  },
  
  turnos: function() {    
    //recupero el profesional seleccionado
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


Template.calendar.events({ 
  //----------------SELECT PROFESIONAL ---------------------
  'change #profesionales1': function(event, instance) {
    var profesionalesId = $(event.target).val();    
    instance.selProfesionales.set(profesionalesId);
    instance.selTratamiento.set(null);
    var arr = [];
    instance.selTratamientos.set(arr);
    instance.selMyMenuItems.set([]);
    instance.selDuracion.set(0);
    instance.selImporte.set(0);
    var recuperar = instance.selActualizarVista.get(); 
    if (recuperar){
      instance.selActualizarVista.set(false);
    } else{
      instance.selActualizarVista.set(true);
    }


  },


  //----------------SELECT TRATAMIENTO----------------------
  'change #tratamiento1': function(event, instance) {
    var eleccion = $(event.target).val();
    instance.selTratamiento.set(eleccion);
    
    //RECUPERO LOS TURNOS DEL PROFESIONAL
    var profesionalesId = Template.instance().selProfesionales.get();
    
    var turnos = Turnos.findOne({"profesional._id":profesionalesId});   
  },  

  //----------------SELECT DIA DEL CALENDARIO -------------------
  'dp.change #datetimepicker1': function(event, instance) {    
    var eleccion = event.date._d;    
    instance.selDia.set(eleccion);     
  },

  //************************************** FORMULARIO MODAL PARA CREAR UN PACIENTE **********************************
  'submit #formPaciente':function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      var ingresoNombre = target.nombreApellido.value;      
      var ingresoDni = target.dni.value;
      var ingresoTelefono = target.telefono.value; 

      var espacio = " "; 
      var combinacion = ingresoNombre.concat(espacio);
      combinacion = combinacion.concat(ingresoDni);

      Pacientes.insert({nombreApellido:ingresoNombre, dni:ingresoDni, nombreDni:combinacion, telefono:ingresoTelefono});

      $('#modalIngresoPaciente').modal('hide'); //CIERRO LA VENTANA MODAL
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
            if (error) {
                window.alert('Error during upload: ' + error.reason);
              } else {
                window.alert('File "' + fileObj.name + '" successfully uploaded');
              }           
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
      

      var turno = Template.instance().selModalHistoriaClinica.get();      
      idPaciente = turno.paciente._id;
      var ingresoComentario = target.comentario.value;       
      
      let hist= { comentario: ingresoComentario,
                  idImage: idImage,
                  link: linkImage,
                  name: name,
      };   
      
      
      Pacientes.update({_id:idPaciente},{$push:{mishistorias:hist}});     

      $('#modalHistoriaClinica2').modal('hide'); //CIERRO LA VENTANA MODAL
  },



  //*******************************MUESTRO LOS DATOS DEL PACIENTE DEL TURNO********************************
  'click #modalInfoPaciente': function(event, template){       
      var turnoId = this._id;
      console.log(turnoId);
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

    //*******************************MUESTRO LOS DATOS DE LOS TRATAMIENTOS DEL TURNO********************************
  'click #modalHistoriaClinica1': function(event, template){       
      var turnoId = this._id;
      var turno = Turnos.findOne({"_id":turnoId});       
      Template.instance().selModalHistoriaClinica.set(turno);//recupero el turno seleccionado      
      $('#modalHistoriaClinica2').modal('show');
    },      

  //***********************************ELIMINO UN TURNO*****************************************

  'click .modalRemoveTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Template.instance().selTurnoEliminar.set(turno);
    $('#modalEliminarTurno').modal('show');
  },

  'click .asistioTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "ASISTIO"}});    
  },

  'click .faltoTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "FALTO"}});    
  },

  'click .ocupadoTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "OCUPADO"}});    
  },

  'click .confirmadoTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "CONFIRMADO"}});    
  },
  'click .atendidoTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "ATENDIDO"}});    
  }, 
  'click .atendidoSobreTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "SOBRETURNO ATENDIDO"}});    
  },  
   'click .faltoSobreTurno': function(event, template){
    var turnoId = this._id;
    var turno = Turnos.findOne({"_id":turnoId});
    Turnos.update({_id: turno._id},{$set: {estado :  "SOBRETURNO FALTO"}});    
  },
  
  'click ._remove': function(event, template){ 

    var turno = Template.instance().selTurnoEliminar.get();

    if ((turno.estado === "SOBRETURNO") || (turno.estado === "SOBRETURNO ATENDIDO")){
      Turnos.remove({"_id": turno._id});
    }
    else{      
      var profesionalId = turno.profesional._id;

      var apertura = 7;
      var cierre = 22;

      var diaSeleccionado = Template.instance().selDia.get();

      var fapertura = new Date(diaSeleccionado); fapertura.setHours(apertura,0,0); //TENGO QUE SETEAR LA HORA DE APERTURA DEL CONSULTORIO
      var fcierre = new Date(diaSeleccionado);  fcierre.setHours(cierre,0,0); //TENGO QUE SETEAR LA HORA DE CIERRE DEL CONSULTORIO

      var iso1 = turno.inicio;
      var iso2 = turno.fin;
      
      var base = iso1;
      var tope = iso2;

      //BUSCO UN TURNO LIBRE, DE ESE PROFESIONAL, ANTES QUE ESTE PEGADO
      var turnoAntes = Turnos.findOne({"profesional._id":profesionalId, "estado": "LIBRE", fin : iso1});      
      if (turnoAntes){      
        base = turnoAntes.inicio;
        Turnos.remove({"_id": turnoAntes._id});
      }

      //BUSCO UN TURNO LIBRE, DE ESE PROFESIONAL, DESPUES QUE ESTE PEGADO    
      var turnoDespues = Turnos.findOne({"profesional._id":profesionalId, "estado": "LIBRE", inicio : iso2});      
      if (turnoDespues){      
        tope = turnoDespues.fin;
        Turnos.remove({"_id": turnoDespues._id});
      }

      Turnos.remove({"_id": turno._id});

      var diffMins = diferenciaMinutos(base, tope); var prof = turno.profesional;    

      //--------------------------------------------------------------- inicio >= fapertura y inicio <= fcierre -------
      var col = Turnos.find({"profesional._id":profesionalId,"turno.nombre": { $ne: "SOBRETURNO" },"turno.nombre": { $ne: "SOBRETURNO ATENDIDO" }, "inicio" : {"$gte" : fapertura, "$lte" : fcierre}});  
      //SI ELIMINO TODOS LOS TURNOS NO TENGO QUE GENERAR UN TURNO VACIO
      if (col.count() !== 0){      
        Turnos.insert({inicio:base, fin: tope, duracion: diffMins, estado:"LIBRE", profesional:prof});  
      } 
    }
    
    $('#modalEliminarTurno').modal('hide');
  },

  'click .borrarInfoBuscar': function(event, template){
    Template.instance().selMostrarInfoTurno.set(false);     
  },
  
  //************************************** FORMULARIO MODAL PARA RESERVAR UN TURNO **********************************
  'submit #formSobreTurno':function(event) {

      var apertura = 8;
      var cierre = 22;

      //------------------ ESTO TIENE QUE ESTAR AL PRINCIPIO SINO DAN ERROR LAS VENTANAS MODALES ------------
      //Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;  

      var mot = target.motivo.value;

      //-----------------------RECUPERO EL PROFESIONAL SELECCIONADO-----------------------------
      var profesionalId = Template.instance().selProfesionales.get();
      if (profesionalId === null) {
        $('#modalNoIngresoTratamiento').modal('show');        
      };

      //RECUPERO EL PROFESIONAL DEL TRATAMIENTO A INSERTAR
      let profesional = Profesionales.findOne({"_id":profesionalId});
      let prof={  _id:profesional._id,
                  nombreApellido: profesional.nombreApellido,
      };
      //----------------------RECUPERO EL PACIENTE SELECCIONADO----------------------------

      var pacienteId = Template.instance().selPaciente.get();  
      if (pacienteId === null) {
        $('#modalNoIngresoPaciente').modal('show');        
      };
      let paciente = Pacientes.findOne({"_id":pacienteId});      
      let pac= {   _id: paciente._id,
                    nombreApellido:paciente.nombreApellido,
                    dni:paciente.dni,
                    telefono:paciente.telefono,         
      }; 

      //-----------------------RECUPERO EL TRATAMIENTO SELECCIONADO----------------------------

      var imp;
      var trat;
      //if (prof.nombreApellido == "DEPILACION MEDICA DEFINITIVA CON LASER"){                                         
      if (prof.combos == true){                                         
        trat = Template.instance().selTratamientos.get();        
        imp = Template.instance().selImporte.get();//RECUPERO EL IMPORTE DE LOS TRATAMIENTOS
      }
      else{        
        var tratamientoId = Template.instance().selTratamiento.get();
        if (tratamientoId === null) {
          $('#modalNoIngresoTratamiento').modal('show');        
        };

        //RECUPERO EL TRATAMIENTO SELECCIONADO (OBJETO)
        let tratamiento = Tratamientos.findOne({"_id":tratamientoId});
        var dur = Number(tratamiento.duracion);
        trat= [{ _id: tratamiento._id,
                    nombre:tratamiento.nombre,
                    duracion:dur,
                    importe:tratamiento.importe,
        }];
        imp = tratamiento.importe;//RECUPERO EL IMPORTE DEL TRATAMIENTO;
      }

      //--------------------------RECUPERO LOS HORARIOS DEL TURNO-------------------------
      var horaInicio = Number(target.selHoraInicio.value);       
      var minutosInicio = Number(target.selMinutosInicio.value);      
      
      //--------------------------SETEO HORA INICIO Y FIN ------------------------------------

      //RECUPERO EL DIA SELECCIONADO
      var diaSeleccionado = Template.instance().selDia.get();           
      
      var date1 = moment(diaSeleccionado);
      var date2 = moment(diaSeleccionado);

      //SETEO LA HORA DE INICIO      
      date1.set({hour:horaInicio,minute:minutosInicio});
      

      //TENGO QUE CALCULAR LA HORA DE FIN CON LA DURACION DEL TRATAMIENTO
      if (target.selHoraFin === undefined) {             

        //SETEO LA HORA DE FIN PARA SUMARLE LA DURACION DEL TRATAMIENTO                
        date2.set({hour:horaInicio,minute:minutosInicio});     

        //RECUPERO LA DURACION DEL TRATAMIENTO DESDE LA VARIABLE REACTIVA
        numberDuracion = Template.instance().selDuracion.get();


        //LE SUMO LOS MINUTOS DEL TRATAMIENTO
        date2 = moment(date2).add(numberDuracion, 'minutes');

        var horaFin = moment(date2).get('hour');
        var minutosFin = moment(date2).get('minute');
      }
      else{
        var horaFin = Number(target.selHoraFin.value);
        var minutosFin = Number(target.selMinutosFin.value);

        //SETEO LAS HORA DE FIN                
        date2.set({hour:horaFin,minute:minutosFin});
      };

     
      //-----------------------------------------------------INSERCION DEL TURNO-------------------------------------                                 

        var fapertura = new Date(diaSeleccionado); fapertura.setHours(apertura,0,0); //TENGO QUE SETEAR LA HORA DE APERTURA DEL CONSULTORIO
        var fcierre = new Date(diaSeleccionado);  fcierre.setHours(cierre,0,0); //TENGO QUE SETEAR LA HORA DE CIERRE DEL CONSULTORIO
        var iso1 = new Date(date1);  
        var iso2 = new Date (date2);    

        if (iso2 > fcierre){          
          $('#modalHorarioValido').modal('show');           
        }
        else{

           //--------------------------------------------------------------- inicio >= fapertura y inicio <= fcierre -------
          var tur = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"},{estado: "LIBRE"},{estado: "SOBRETURNO"}], inicio : {$gte : fapertura, $lte : fcierre}},{sort: {inicio: 1}});  
          //NO HAY NINGUN TURNO
          if (tur.count()===0){                      
            var difTurno = diferenciaMinutos(iso1, iso2);
            Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"SOBRETURNO", importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO            
            
            Turnos.insert({inicio:fapertura, fin:fcierre, estado:"LIBRE", profesional:prof});//DESPUES
          }
          else{
            var difTurno = diferenciaMinutos(iso1, iso2);
            Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"SOBRETURNO", importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO
          }
          
          $('#modalIngresoSobreTurno').modal('hide');
        }    
  },


  //************************************** FORMULARIO MODAL PARA RESERVAR UN TURNO **********************************
  'submit #formTurno':function(event) {

      var apertura = 7;
      var cierre = 22;

      //------------------ ESTO TIENE QUE ESTAR AL PRINCIPIO SINO DAN ERROR LAS VENTANAS MODALES ------------
      //Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;  

      var mot = target.motivo.value;

      //-----------------------RECUPERO EL PROFESIONAL SELECCIONADO-----------------------------
      var profesionalId = Template.instance().selProfesionales.get();
      if (profesionalId === null) {
        $('#modalNoIngresoTratamiento').modal('show');        
      };

      //RECUPERO EL PROFESIONAL DEL TRATAMIENTO A INSERTAR
      let profesional = Profesionales.findOne({"_id":profesionalId});
      let prof={  _id:profesional._id,
                  nombreApellido: profesional.nombreApellido,
                  combos: profesional.combos,
      };
      //----------------------RECUPERO EL PACIENTE SELECCIONADO----------------------------

      var pacienteId = Template.instance().selPaciente.get();  
      if (pacienteId === null) {
        $('#modalNoIngresoPaciente').modal('show');        
      };
      let paciente = Pacientes.findOne({"_id":pacienteId});      
      let pac= {   _id: paciente._id,
                    nombreApellido:paciente.nombreApellido,
                    dni:paciente.dni,
                    telefono:paciente.telefono,         
      }; 

      //-----------------------RECUPERO EL TRATAMIENTO SELECCIONADO----------------------------

      var imp;
      var trat;
      console.log("es un combo??:", prof.combos);
      if (prof.combos === true){                                         
        trat = Template.instance().selTratamientos.get();        
        imp = Template.instance().selImporte.get();//RECUPERO EL IMPORTE DE LOS TRATAMIENTOS
      }
      else{        
        var tratamientoId = Template.instance().selTratamiento.get();
        if (tratamientoId === null) {
          $('#modalNoIngresoTratamiento').modal('show');        
        };

        //RECUPERO EL TRATAMIENTO SELECCIONADO (OBJETO)
        let tratamiento = Tratamientos.findOne({"_id":tratamientoId});
        var dur = Number(tratamiento.duracion);
        trat= [{ _id: tratamiento._id,
                    nombre:tratamiento.nombre,
                    duracion:dur,
                    importe:tratamiento.importe,
        }];
        imp = tratamiento.importe;//RECUPERO EL IMPORTE DEL TRATAMIENTO;
      }

      //--------------------------RECUPERO LOS HORARIOS DEL TURNO-------------------------
      var horaInicio = Number(target.selHoraInicio.value);             
      var minutosInicio = Number(target.selMinutosInicio.value);      
      
      //--------------------------SETEO HORA INICIO Y FIN ------------------------------------

      //RECUPERO EL DIA SELECCIONADO
      var diaSeleccionado = Template.instance().selDia.get();           
      
      var date1 = moment(diaSeleccionado);
      var date2 = moment(diaSeleccionado);

      //SETEO LA HORA DE INICIO      
      date1.set({hour:horaInicio,minute:minutosInicio});
      

      //TENGO QUE CALCULAR LA HORA DE FIN CON LA DURACION DEL TRATAMIENTO
      if (target.selHoraFin === undefined) {             

        //SETEO LA HORA DE FIN PARA SUMARLE LA DURACION DEL TRATAMIENTO                
        date2.set({hour:horaInicio,minute:minutosInicio});     

        //RECUPERO LA DURACION DEL TRATAMIENTO DESDE LA VARIABLE REACTIVA
        numberDuracion = Template.instance().selDuracion.get();


        //LE SUMO LOS MINUTOS DEL TRATAMIENTO
        date2 = moment(date2).add(numberDuracion, 'minutes');

        var horaFin = moment(date2).get('hour');
        var minutosFin = moment(date2).get('minute');
      }
      else{
        var horaFin = Number(target.selHoraFin.value);
        var minutosFin = Number(target.selMinutosFin.value);

        //SETEO LAS HORA DE FIN                
        date2.set({hour:horaFin,minute:minutosFin});
      };

     
      //-----------------------------------------------------INSERCION DEL TURNO-------------------------------------                                 

        var fapertura = new Date(diaSeleccionado); fapertura.setHours(apertura,0,0); //TENGO QUE SETEAR LA HORA DE APERTURA DEL CONSULTORIO
        var fcierre = new Date(diaSeleccionado);  fcierre.setHours(cierre,0,0); //TENGO QUE SETEAR LA HORA DE CIERRE DEL CONSULTORIO
        var iso1 = new Date(date1);  
        var iso2 = new Date (date2);    

        if ((iso2 > fcierre) || (horaInicio === 0)){          
          $('#modalHorarioValido').modal('show');           
        }
        else{

          //--------------------------------------------------------------- inicio >= fapertura y inicio <= fcierre -------
          var tur = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"},{estado: "LIBRE"}],  inicio : {$gte : fapertura, $lte : fcierre}},{sort: {inicio: 1}}); 

           
          if (tur.count()===1){
            var tur2 = Turnos.findOne({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"},{estado: "LIBRE"}],  inicio : {$gte : fapertura, $lte : fcierre}},{sort: {inicio: 1}});
            Turnos.remove({"_id": tur2._id});
          }

          var tur = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"},{estado: "LIBRE"}],  inicio : {$gte : fapertura, $lte : fcierre}},{sort: {inicio: 1}}); 

          //NO HAY NINGUN TURNO
          if (tur.count()===0){ 
            //ESPACIO ANTES
            //PRIMER HORARIO          
            if ((horaInicio === apertura) && (minutosInicio === 0)){             
              
              var difTurno = diferenciaMinutos(iso1, iso2);
              Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO", importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO
              
              var difDespues = diferenciaMinutos(iso2, fcierre);
              Turnos.insert({inicio:iso2, fin:fcierre, duracion: difDespues, estado:"LIBRE", profesional:prof});//DESPUES
            }
            //HORARIO DEL MEDIO apertura<HORARIO<cierre
            else{
              horaF = Number(horaFin); //convierto la hora de string a number            
              if (horaF < cierre){  
                var difAntes = diferenciaMinutos(fapertura, iso1);              
                Turnos.insert({inicio:fapertura, fin:iso1, duracion: difAntes, estado:"LIBRE", profesional:prof});//ANTES 
                  
                var difTurno = diferenciaMinutos(iso1, iso2);              
                Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO", importe:imp,tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO

                
                var difDespues = diferenciaMinutos(iso2, fcierre);              
                Turnos.insert({inicio:iso2, fin:fcierre, duracion: difDespues, estado:"LIBRE", profesional:prof});//DESPUES              
              }
              //ES EL ULTIMO HORARIO
              else{                
                  
                var difAntes = diferenciaMinutos(fapertura, fin);
                Turnos.insert({inicio:fapertura, fin:iso1, duracion: difAntes, estado:"LIBRE", profesional:prof});//ANTES

                var difTurno = diferenciaMinutos(iso1, iso2);
                Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO",importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO            
              }
            }
            $('#modalIngresoTurno').modal('hide');          
          }
          //HAY TURNOS
          else{
            //QUE SE QUIERA METER EN EL MEDIO DE UN TURNO OCUPADO
            var condicion1 = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$lte : iso1}, fin : {$gte : iso2}});

            //QUE SE QUIERA METER SOLAPADO CON EL INICIO DE UN TURNO
            var condicion2 = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$gt : iso1, $lt : iso2}});

            //QUE SE QUIERA METER SOLAPADO CON EL FIN DE UN TURNO
            var condicion3 = Turnos.find({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],fin : {$gt : iso1, $lt : iso2}});

            //SI NO SE SOLAPA CON NINGUN TURNO
            if ((condicion1.count()===0) && (condicion2.count()===0) && (condicion3.count()===0)) {
              
              //PRIMER HORARIO
              horaI = Number(horaInicio); //convierto la hora de string a number
              minutosI = Number(minutosInicio); //convierto la hora de string a number
              if ((horaI === apertura) && (minutosI === 0)){              
                //TENGO QUE ENCONTRAR EL TOPE
                var colTope = Turnos.findOne({"profesional._id":profesionalId, $or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$gte : iso2,$lte:fcierre}},{sort: {inicio: 1}});  
                //NO ENCUENTRA UN TOPE ==> TOPE ES iso2
                
                //TIENE QUE HABER POR LO MENOS UN TURNO QUE HAGA DE TOPE                           
                var tope = colTope.inicio;
                var base = iso1;

                if ((base.getTime() === iso1.getTime()) && (tope.getTime() === iso2.getTime())){
                    
                  var difTurno = diferenciaMinutos(iso1, iso2);
                  Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO",importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO 
                }
                else{
                    
                  var difTurno = diferenciaMinutos(iso1, iso2);
                  Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO",importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO
                   
                  if ( iso2.getTime() !== tope.getTime() ){
                    var difDespues = diferenciaMinutos(iso2, tope);
                    Turnos.insert({inicio:iso2, fin:tope, duracion: difDespues, estado:"LIBRE", profesional:prof});//DESPUES                              
                  }
                }                
              }
              //A BUSCAR LA BASE Y EL TOPE
              else{
                //RECUPERO EL MENOR DE LA FECHA FIN QUE SE APROXIMA A iso1
                var colBase = Turnos.findOne({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$gte : fapertura, $lte : fcierre},fin : {$lte : iso1}},{sort: {inicio: -1}});
                
                //*********************************************************
                if (colBase) {                 
                  var base = colBase.fin;
                  //RECUPERO EL MAYOR DE LA FECHA INICIO QUE SE APROXIMA A iso2
                  var colTope = Turnos.findOne({"profesional._id":profesionalId,inicio : {$gte : fapertura, $lte : fcierre},$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$gte : iso2, $lte:fcierre}},{sort: {inicio: 1}});
                  if (colTope) {
                    var tope = colTope.inicio;
                  }
                  else{
                    var tope = fcierre;
                  }
                  if ((base.getTime() === iso1.getTime()) && (tope.getTime() === iso2.getTime())){
                      
                    var difTurno = diferenciaMinutos(iso1, iso2);
                    Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO", importe:imp,tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO 
                  }
                  else{                    
                    
                    if ( base.getTime() !== iso1.getTime() ){
                      var difAntes = diferenciaMinutos(base, iso1);
                      Turnos.insert({inicio:base, fin:iso1, duracion: difAntes, estado:"LIBRE", profesional:prof});//ANTES 
                    } 
                      
                    var difTurno = diferenciaMinutos(iso1, iso2);
                    Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO", importe:imp,tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO                    
                    
                    if ( iso2.getTime() !== tope.getTime() && (iso2 <= fcierre)){
                      var difDespues = diferenciaMinutos(iso2, tope);
                      Turnos.insert({inicio:iso2, fin:tope, duracion: difDespues, estado:"LIBRE", profesional:prof});//DESPUES
                    }
                  }                
                }              
                else{ //LA BASE ES LA APERTURA DEL CONSULTORIO
                  
                  base = fapertura;
                  var colTope = Turnos.findOne({"profesional._id":profesionalId,$or: [ {estado: "OCUPADO"}, {estado: "ASISTIO"} ,{estado: "FALTO"},
                                        {estado: "CONFIRMADO"},{estado: "ATENDIDO"}],inicio : {$gte : fapertura, $lte : fcierre},inicio : {$gte : iso2}},{sort: {inicio: 1}});
                  var tope = colTope.inicio;
                  if ((base.getTime() === iso1.getTime()) && (tope.getTime() === iso2.getTime())){
                      
                    var difTurno = diferenciaMinutos(iso1, iso2);
                    Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO",importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO 
                  }
                  else{                    

                    if ( base.getTime() !== iso1.getTime() ){                        
                      var difAntes = diferenciaMinutos(base, iso1);
                      Turnos.insert({inicio:base, fin:iso1, duracion: difAntes, estado:"LIBRE", profesional:prof});//ANTES 
                    }
                      
                    var difTurno = diferenciaMinutos(iso1, iso2);
                    Turnos.insert({inicio:iso1, fin:iso2, duracion: difTurno, estado:"OCUPADO",importe:imp, tratamientos:trat, profesional:prof, paciente: pac ,motivo:mot}); //TURNO                  
                    
                    if ( (iso2.getTime() !== tope.getTime()) && (tope <= fcierre)){
                      var difDespues = diferenciaMinutos(iso2, tope);
                      Turnos.insert({inicio:iso2, fin:tope, duracion: difDespues, estado:"LIBRE", profesional:prof});//DESPUES   
                    }
                  }
                  
                }
              }

              //TENGO QUE ELIMINAR EL TURNO LIBRE DONDE SE INSERTO EL TURNO            
              var turnoLibre = Turnos.findOne({"profesional._id":profesionalId,"estado":"LIBRE",inicio : {$lte : iso1}, fin : {$gte : iso2}}); 
              Turnos.remove({_id: turnoLibre._id});  

              Template.instance().selPaciente.set(null);
              Template.instance().selTratamiento.set(null);       
              
              
              $('#modalIngresoTurno').modal('hide'); //CIERRO LA VENTANA MODAL
            }
            else{
              $('#modalTurnoOcupado').modal('show');            
            }
          }
        }    
  },

});

Template.calendar.onRendered(function() {
    //const instance = Template.instance();

    $('#datetimepicker1').datetimepicker({
        inline: true,
        format:'L', 
        locale: 'es',       
    });

    /*var eventDates = {};
    eventDates[ new Date( '10/10/2017')] = new Date( '10/10/2017');
    eventDates[ new Date( '10/23/2017')] = new Date( '10/23/2017');
    eventDates[ new Date( '10/31/2017')] = new Date( '10/31/2017');
    eventDates[ new Date( '10/06/2017')] = new Date( '10/06/2017');

    $( "#datepicker" ).datepicker({
      //numberOfMonths: [3,1],
      onSelect: function(dateText) {
        var eleccion = new Date(this.value);         
        instance.selDia.set(eleccion);        
      },
      beforeShowDay: function(dateText){
        var highliht = eventDates[dateText];
        if (highliht){
          return [true, "event", "Tooltip text"];
        }
        else{
          return [true, '', ''];
        }
      }
    }); */    

    //---------------------BORRO LOS DATOS DE LA VENTANAS MODALES-------------------  
    $("#modalIngresoPaciente").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });
    $("#modalIngresoTurno").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });

    $("#modalBuscarTurnos").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });

    $("#modalIngresoSobreTurno").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });

    $("#modalInfoPaciente").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });
    
    $('#example-multiple-selected').multiselect();

    Meteor.typeahead.inject();    
});