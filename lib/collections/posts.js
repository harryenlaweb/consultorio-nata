import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);


export const Posts = new Mongo.Collection('posts');
//Posts   = new Meteor.Collection('posts');
Posts.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 60
  },
  picture: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        uploadTemplate: 'uploadField', // <- Optional
        previewTemplate: 'uploadPreview', // <- Optional
        insertConfig: { // <- Optional, .insert() method options, see: https://github.com/veliovgroup/Meteor-Files/blob/master/docs/insert.md
          meta: {},
          isBase64: false,
          transport: 'ddp',
          chunkSize: 'dynamic',
          allowWebWorkers: true
        }
      }
    }
  }
}));

Posts.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});