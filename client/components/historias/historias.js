import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Historias } from '../../../lib/collections/historias';
import { Pacientes } from '../../../lib/collections/pacientes';
import { Router } from 'meteor/iron:router';


import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';

import { Template } from 'meteor/templating';
import { Images } from '/lib/collections/images';
import './historias.html';

Template.historias.onCreated(function(){   
  this.selCargarOtraImagen = new ReactiveVar(false);
  this.currentUpload = new ReactiveVar(false);
  this.selHistoriaRecuperada = new ReactiveVar(null);
  this.selHistoriaRecuperada2 = new ReactiveVar(null);  
});

Template.historias.helpers({

	historiaInfo: function() {     
    	return Template.instance().selHistoriaRecuperada2.get();        
  	},

  	historiaEditar: function() {     
    	return Template.instance().selHistoriaRecuperada.get();        
  	},

  	cargarOtraImagen: function() {     
    	return Template.instance().selCargarOtraImagen.get();        
  	},

	currentUpload: function () {
	    return Template.instance().currentUpload.get();
	},
	file() {
	    return Images.findOne();
	},
	formCollection() {
		return Historias;
	},
	formCollection() {
		return Pacientes;
	},
	searchAttributes() {
    return {
      placeholder: 'Buscar ...',
    };

  },
})

Template.registerHelper('formatDate2', function(date) {
  return moment(date).format('DD-MM-YYYY');
});

Template.historias.events({	 
	  'submit #formEditarHistoria':function(event,template) {       

	      event.preventDefault(); 

	      const target = event.target; 
	      
	      var otraImg = target.idCheckOtraImg.checked;
	      console.log(otraImg);
	      var paciente = template.data.paciente;//obtengo el paciente
		  var historia = Template.instance().selHistoriaRecuperada.get();			    
	      

	      var idImage = null;
	      var name = null;	 
	      var extension = null;     
	      var linkImage = null;

	      if (otraImg){
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
	            extension = uploadInstance.file.extension;

	            console.log(uploadInstance);

	            linkImage = "http://localhost:3000/cdn/storage/Images/".concat(idImage,"/original/",idImage,".",extension);
	          }
	        }

	        Images.remove({_id: historia.idImage}); 
	      } else{
		      var idImage = historia.idImage;
		      var name = historia.name;		      
		      var linkImage = historia.linkImage;
	      }          
	      

	      // ELIMINO LA HISTORIA CLINICA			
			Meteor.call('pacientes.removeHistoria',paciente._id, historia._id);	
			
		// INGRESO LA HISTORIA CLINICA
			
			var ingresoComentario = target.comentario.value;       
	      
		    let hist= { comentario: ingresoComentario,
		                  idImage: idImage,
		                  link: linkImage,
		                  name: name,
		    };  
		
	      Pacientes.update({_id:paciente._id},{$push:{mishistorias:hist}});   
	      $('#modalEditarHistoria2').modal('hide'); //CIERRO LA VENTANA MODAL
	  },

	'click #modalEditarHistoria1': function(event, template){             
      Template.instance().selHistoriaRecuperada.set(this);//recupero la historia clinica a editar
      $('#modalEditarHistoria2').modal('show');
    }, 


  	'click #modalInfoHistoria1': function(event, template){             
      Template.instance().selHistoriaRecuperada2.set(this);//recupero la historia clinica a editar
      $('#modalInfoHistoria2').modal('show');
    }, 

    
	'click .agregarHistoria': function(event, template){		
		let historiaSeleccionada = Historias.findOne({"_id":this._id});//obtengo el tratamiento seleccionado (objeto)

		let pacientes = template.data.pacientes;//obtengo el _id del paciente
		
		//recupero los datos a insertar
		let hist= {	_id: historiaSeleccionada._id,
					idConsultorio:historiaSeleccionada.idConsultorio,
					fecha:historiaSeleccionada.fecha,
					imagen:historiaSeleccionada.imagen,					
					comentarios:historiaSeleccionada.comentarios,
					owner:historiaSeleccionada.owner,
		};

		//inserto los datos en el arreglo
		Pacientes.update({_id:pacientes._id},{$push:{mishistorias:hist}});		
	},	

	'click #idCheckOtraImg': function(event, template) {		
		var x = event.target.checked;
		console.log(x);
		Template.instance().selCargarOtraImagen.set(x);  		
    },
})

Template.historias.onRendered(function() {   

    //---------------------BORRO LOS DATOS DE LA VENTANAS MODALES-------------------  
    /*$("#modalEditarHistoria2").on("hidden.bs.modal", function(){        
        $(this).find("input,textarea,select").val('').end();
    });   */

    $("#modalInfoPaciente").on("hidden.bs.modal", function(){        
        $(this).find().val('').end();
    });    
});