import SimpleSchema from 'simpl-schema';
// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

export const Notes = new SimpleSchema({
	note: {
		type: String,
		label: "Nota"
	}
})