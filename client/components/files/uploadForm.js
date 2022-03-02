import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '/lib/collections/images';
//import Images from '/lib/images.collection.js';
import './uploadForm.html';


Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },
  file() {
    return Images.findOne();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    var img = Images.find();
    console.log(img);
    if (e.currentTarget.files && e.currentTarget.files[0]) {      
      var file = e.currentTarget.files[0];
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
      }
    }
  }
});