import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Operadores } from '../../../lib/collections/operadores';
//import { Cajas } from '../../../lib/collections/cajas';
import { Turnos } from '../../../lib/collections/turnos';
import { CajasAdmin } from '../../../lib/collections/cajasAdmin';
import { Router } from 'meteor/iron:router';


import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';

Template.cajasoperadores.onCreated(function(){  
  this.operador = new ReactiveVar(null);  
  this.selCajaRecuperada = new ReactiveVar(null); 
  this.selCajaRecuperadaInfo = new ReactiveVar(null); 
  this.selSumaTurnosAtendidos = new ReactiveVar(0);
});


Template.cajasoperadores.helpers({

    operador: function() {       
      var idU = Meteor.userId();
      var op = Operadores.findOne({"idUsuario": idU});
      Template.instance().operador.set(op);      
      return op;
    },
    cajaEditar: function() {     
      return Template.instance().selCajaRecuperada.get();        
    },
    cajaInfo: function() {     
      return Template.instance().selCajaRecuperadaInfo.get();        
    },
    sumaTurnosAtendidos: function() {     
      return Template.instance().selSumaTurnosAtendidos.get();        
    },
})

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});



Template.cajasoperadores.events({  

//**********************INGRESAR CAJA ***************
  'submit #formIngresarCaja':function(event,template) {        

        var operador = Template.instance().operador.get();                       
        
        event.preventDefault();
        const target = event.target;

        var ingreso = null;
        var egreso = null;
        var notas = null;
        var fecha = new Date();fecha.setHours(0,0,0,0);
        var total = null;
            
        if (target.ingreso.value){ingreso = Number(target.ingreso.value)};
        if (target.egreso.value){egreso = Number(target.egreso.value)};
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
              idOperador:operador._id,
              nombreOperador: operador.nombreApellido,
        };  
        
        

        var noHayCaja = true;
        //recorro las cajas, porque no puede ingresar dos cajas un mismo dia
        var cursor = Operadores.findOne({_id:operador._id},{'miscajas': 1});
        console.log(cursor.miscajas);

        if (cursor.miscajas != undefined) {
          arr = [];       

          let arreglo = cursor.miscajas;
          let arrayLength = arreglo.length;
          for (var i = 0; i < arrayLength; i++) {
              var elemento = arreglo[i];
              var fechaElemento = new Date(elemento.fecha);           
              
              if (fechaElemento.getTime() == fecha.getTime()){ 
                  noHayCaja = false;
              
              };
          };
        }
        

        if (noHayCaja) {
          Operadores.update({_id:operador._id},{$push:{miscajas:ca}});           
          
            var cajasA = CajasAdmin.findOne( { fecha: { $eq: fecha } } );         

            
            if (cajasA) { 

              var noExisteCaja = true;              

              arr = [];                        
              let arreglo = cajasA.lascajas;
              let arrayLength = arreglo.length;
              var elementoEncontrado;
              for (var i = 0; i < arrayLength; i++) {
                  var elemento = arreglo[i];
                  if (elemento.idOperador === operador._id){                    
                    console.log("CHAMACO YA EXISTE UNA CAJA CON EL MISMO OPERADO!!!!");
                    elementoEncontrado = elemento;
                    noExisteCaja = false;
                  }
                  
              };

              if (noExisteCaja){
                    //ingreso la caja del operador
                    CajasAdmin.update({_id:cajasA._id},{$push:{lascajas:ca}});                  
                    
                    //tengo que actualizar los montos de la caja de esa fecha
                    var ingresoAdmin = cajasA.ingreso;
                    var egresoAdmin = cajasA.egreso;
                    
                    ingresoAdmin = ingresoAdmin + ingreso;
                    egresoAdmin = egresoAdmin + egreso;
                    var totalAdmim = ingresoAdmin - egresoAdmin;

                    CajasAdmin.update({_id:cajasA._id},{$set: {
                          ingreso: ingresoAdmin,
                          egreso: egresoAdmin,
                          total: totalAdmim,        
                    }});           

              } 

            } else{ //tengo que insertar un nuevo documento
                  CajasAdmin.insert({
                        fecha: fecha,
                        ingreso: ingreso,
                        egreso: egreso,
                        total: total,                         
                  });             
                  var cajaInsert = CajasAdmin.findOne( { fecha: { $eq: fecha } } );         
                  CajasAdmin.update({_id:cajaInsert._id},{$push:{lascajas:ca}});                                                          
            }

        } else {
          alert("YA INGRESO UNA CAJA EN EL DIA DE HOY");
        };



        
        
        $('#modalIngresarCaja2').modal('hide'); //CIERRO LA VENTANA MODAL
    },


  'click #modalIngresarCaja1': function(event, template){             
      var operador = Template.instance().operador.get();                       
        
        var iso1 = new Date();iso1.setHours(0,0,0,0);        
        var iso2 = new Date();iso2.setHours(0,0,0,0);
        var diaiso2 = iso2.getDate()+1; //le sumo un dia a la fecha para buscar en dos rangos de fechas HOY<X<MAÑANA
        iso2.setDate(diaiso2);
        
        var turnos = Turnos.find({"idOperador":operador._id, "estado": "ATENDIDO", "inicio" : {"$gte" : iso1, "$lt" : iso2}},{sort: {inicio: 1}});
        
        var suma = 0;
        if (turnos && turnos.count() >0){
          turnos.forEach(function(turno){                         
              suma = suma + turno.importe;                        
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
            
        if (target.ingreso.value){ingreso = Number(target.ingreso.value)};
        if (target.egreso.value){egreso = Number(target.egreso.value)};
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
              idOperador: operador._id, 
              nombreOperador: operador.nombreApellido,         
        };  

        // ELIMINO LA CAJA      
        Meteor.call('operadores.removeCaja',operador._id, caja._id); 
        
        Operadores.update({_id:operador._id},{$push:{miscajas:ca}});





                // TENGO QUE ELIMINAR E INSERTAR DE casjasAdmin  

                var cajasA = CajasAdmin.findOne( { fecha: { $eq: fecha } } );              

                arr = [];                        
                let arreglo = cajasA.lascajas;
                let arrayLength = arreglo.length;
                var elementoEncontrado;
                for (var i = 0; i < arrayLength; i++) {
                    var elemento = arreglo[i];
                    if (elemento.idOperador === operador._id){                    
                      console.log("CHAMACO YA EXISTE UNA CAJA CON EL MISMO OPERADO!!!!");
                      elementoEncontrado = elemento;
                      noExisteCaja = false;
                    }
                    
                };

                Meteor.call('cajasAdmin.removeCajaAdmin',cajasA._id, elementoEncontrado._id); 
                CajasAdmin.update({_id:cajasA._id},{$push:{lascajas:ca}});  

                var ingresoAdmin = cajasA.ingreso;                
                var egresoAdmin = cajasA.egreso; 
                
                ingresoAdmin = ingresoAdmin + ingreso - elementoEncontrado.ingreso;                
                egresoAdmin = egresoAdmin +egreso - elementoEncontrado.egreso;
                
                var totalAdmim = ingresoAdmin - egresoAdmin;
                
                CajasAdmin.update({_id:cajasA._id},{$set: {                          
                      egreso: egresoAdmin,
                      ingreso: ingresoAdmin,
                      total: totalAdmim,        
                }}); 


        
        $('#modalEditarCaja2').modal('hide'); //CIERRO LA VENTANA MODAL
    },


  'click #modalEditarCaja1': function(event, template){             
      Template.instance().selCajaRecuperada.set(this);//recupero la caja a editar
      $('#modalEditarCaja2').modal('show');
    }, 

    'click #modalInfoCaja1': function(event, template){             
      Template.instance().selCajaRecuperadaInfo.set(this);//recupero la caja a editar
      $('#modalInfoCaja2').modal('show');
    }, 
})

Template.cajasoperadores.onRendered(function() {   

    //---------------------BORRO LOS DATOS DE LA VENTANAS MODALES-------------------  
    $("#modalIngresarCaja2").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    }); 

    $("#modalEditarCaja2").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });    
    /*$("#modalIngresarCaja2").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });    */

});