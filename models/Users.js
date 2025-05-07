class Users{
    constructor(userId,username,password,token,contact,roles){
        this.userId=userId
        this.username=username
        this.password=password
        this.token=token
        this.contact=contact
        this.roles=roles
    }
        toJSONForSQLite() {
        return JSON.stringify({
          userId: this.userId,
          username: this.username,
          password: this.password,
          token: this.token,
          contact: this.contact,
          roles: JSON.stringify(this.roles), // Convert the roles array to a JSON string
        });
      }
    
      // Static method to create a Users object from a JSON string retrieved from SQLite
      static fromJSONSQLite(jsonString) {
        const data = JSON.parse(jsonString);
        return new Users(
          data.userId,
          data.username,
          data.password,
          data.token,
          data.contact,
          JSON.parse(data.roles) // Parse the roles string back into an array
        );
      }
}
module.exports = Users;