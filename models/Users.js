class Users {
  constructor(userId, username, password, token, contact, roles) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.token = token;
    this.contact = contact;
    this.roles = roles;
  }

  toObjectForSQLite() {
    return {
      user_id: this.userId,
      username: this.username,
      password: this.password,
      token: this.token,
      contact: this.contact,
      roles: JSON.stringify(this.roles),
    };
  }

  static fromSQLiteRow(row) {
    return new Users(
      row.user_id,
      row.username,
      row.password,
      row.token,
      row.contact,
      JSON.parse(row.roles)
    );
  }

  toJSON() {
    return {
      userId: this.userId,
      username: this.username,
      password: this.password,
      token: this.token,
      contact: this.contact,
      roles: this.roles,
    };
  }

  static fromJSONSQLite(jsonString) {
    const data = JSON.parse(jsonString);
    return new Users(
      data.userId,
      data.username,
      data.password,
      data.token,
      data.contact,
      JSON.parse(data.roles)
    );
  }
}

module.exports = Users;
