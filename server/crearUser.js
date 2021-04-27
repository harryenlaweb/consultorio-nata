Meteor.methods({
    'new_user':function(usuario){
        var loggedInUser = Meteor.user();
        if (Roles.userIsInRole(loggedInUser, ['admin']) || Roles.userIsInRole(loggedInUser, ['adminconsultorio']))  {
          id = Accounts.createUser({      
          email: usuario.email,
          password: usuario.pass,
          profile: {
            name:  usuario.name,          
          }
        });
      Roles.addUsersToRoles(id, usuario.cargo_roles);    
        return id;
      }
      else {
        throw new Meteor.Error(403, "No esta Autorizado a crear Usuarios");
      }
    }, 
    'new_user_consultorio':function(usuario){
        var loggedInUser = Meteor.user();
        if (Roles.userIsInRole(loggedInUser, ['adminconsultorio']))  {
          id = Accounts.createUser({      
          email: usuario.email,
          password: usuario.pass,
          profile: {
            name:  usuario.name, 
            idConsultorio: usuario.idConsultorio         
          }
        });
      Roles.addUsersToRoles(id, usuario.cargo_roles);    
        return id;
      }
      else {
        throw new Meteor.Error(403, "No esta Autorizado a crear Usuarios");
      }
    }, 

  'changePass':function(userId, newPassword){
    Accounts.setPassword(userId, newPassword);
  }
  
  
  }); 
  
  