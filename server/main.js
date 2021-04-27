import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
Accounts.config({
forbidClientAccountCreation: true,
})

var contador=Meteor.users.find().count(); 
console.log(contador);
  if (contador===0){          
    id = Accounts.createUser({     
        email: "admin@sacarunturno.com",
        password: "Gr8eHYMvs28HnjRq",
        profile: {
          name:  "Admin User",
        }
      });    
    Roles.addUsersToRoles(id, "admin");
    console.log(id);
       return id;
    }
})
