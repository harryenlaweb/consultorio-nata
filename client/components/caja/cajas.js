import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Operadores } from '../../../lib/collections/operadores';
import { Cajas } from '../../../lib/collections/cajas';
import { Turnos } from '../../../lib/collections/turnos';
import { Router } from 'meteor/iron:router';


import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';


Template.cajas.onCreated(function(){  
  this.operador = new ReactiveVar(null);  
  this.selCajaRecuperada = new ReactiveVar(null); 
  this.selSumaTurnosAtendidos = new ReactiveVar(0);
});

Template.cajas.helpers({

  operador: function() {       
      var idU = Meteor.userId();
      var op = Operadores.findOne({"idUsuario": idU});
      Template.instance().operador.set(op);      
      return op;
    },
    cajaEditar: function() {     
      return Template.instance().selCajaRecuperada.get();        
    },
    sumaTurnosAtendidos: function() {     
      return Template.instance().selSumaTurnosAtendidos.get();        
    },
})

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});

Template.cajas.events({  

//**********************INGRESAR CAJA ***************
  'submit #formIngresarCaja':function(event,template) {        

        var operador = Template.instance().operador.get();                       
        
        event.preventDefault();
        const target = event.target;

        var ingreso = null;
        var egreso = null;
        var notas = null;
        var fecha = new Date();
        var total = null;
            
        if (target.ingreso.value){ingreso = target.ingreso.value};
        if (target.egreso.value){egreso = target.egreso.value};
        if (target.notas.value){notas = target.notas.value};

        if (ingreso != null && egreso != null){
          total = ingreso - egreso;
        };       
        
        let ca = { 
              ingreso: ingreso,
              egreso: egreso,
              total: total,
              notas: notas,
              fecha: fecha,
        };  
        
        Operadores.update({_id:operador._id},{$push:{miscajas:ca}});   
        
        $('#modalIngresarCaja2').modal('hide'); //CIERRO LA VENTANA MODAL
    },


  'click #modalIngresarCaja1': function(event, template){             
      var operador = Template.instance().operador.get();                       
        
        var iso1 = new Date();iso1.setHours(0,0,0,0);        
        var iso2 = new Date();iso2.setHours(0,0,0,0);
        var diaiso2 = iso2.getDate()+1; //le sumo un dia a la fecha para buscar en dos rangos de fechas HOY<X<MAÑANA
        iso2.setDate(diaiso2);
        //var turnos = Turnos.find({"owner":operador._id,"inicio" : {"$gte" : iso1, "$lt" : iso2}},{sort: {inicio: 1}});
        var turnos = Turnos.find({"owner":operador.idUsuario, "estado": "OCUPADO", "inicio" : {"$gte" : iso1, "$lt" : iso2}},{sort: {inicio: 1}});
        //console.log("OPERADOR:", operador.idUsuario);
        //var turnos = Turnos.findOne({"owner":operador.idUsuario});
        var suma = 0;
        if (turnos && turnos.count() >0){
          turnos.forEach(function(turno){
            if (turno.estado ==="OCUPADO"){
              var importe = turno.importe;
              console.log(importe);
              suma = suma + importe;
            }
            console.log(turno.estado);
          });
        }; 

        Template.instance().selSumaTurnosAtendidos.set(suma);//recupero la caja a editar
        
      $('#modalIngresarCaja2').modal('show');
    }, 


//*************************** EDITAR CAJA***************************
'submit #formEditarCaja':function(event,template) {       

        var operador = Template.instance().operador.get(); 

        var caja = Template.instance().selCajaRecuperada.get();                        
        
        event.preventDefault();
        const target = event.target;

        var ingreso = null;
        var egreso = null;
        var notas = null;        
        var total = null;
        var fecha = caja.fecha;
            
        if (target.ingreso.value){ingreso = target.ingreso.value};
        if (target.egreso.value){egreso = target.egreso.value};
        if (target.notas.value){notas = target.notas.value};

        if (ingreso != null && egreso != null){
          total = ingreso - egreso;
        };       
        
        let ca = { 
              ingreso: ingreso,
              egreso: egreso,
              total: total,
              notas: notas,
              fecha: fecha,              
        };  

        // ELIMINO LA CAJA      
        Meteor.call('operadores.removeCaja',operador._id, caja._id); 
        
        Operadores.update({_id:operador._id},{$push:{miscajas:ca}});   
        
        $('#modalEditarCaja2').modal('hide'); //CIERRO LA VENTANA MODAL
    },


  'click #modalEditarCaja1': function(event, template){             
      Template.instance().selCajaRecuperada.set(this);//recupero la caja a editar
      $('#modalEditarCaja2').modal('show');
    }, 
})

Template.cajas.onRendered(function() {   

    //---------------------BORRO LOS DATOS DE LA VENTANAS MODALES-------------------  
    /*$("#modalEditarHistoria2").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });   */

    $("#modalEditarCaja2").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });    
});