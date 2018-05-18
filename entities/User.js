import uuid from 'uuid-js';

export default class {
  static constraints = {
    email: {
      presence: true,
      email: true,
      // uniq
    },
    password: {
      presence: true,
      length: {
        minimum: 1,
      },
    },
  };

  constructor(email, password, firstName, lastName) {
    this.id = uuid.create().toString();
    this.email = email;
    // this.password = encrypt(passwor);
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = new Date();
  }
}
