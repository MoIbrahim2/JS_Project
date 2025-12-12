const user_storage_key = "student";
export class Student {
  constructor(username, password, grade, phone, picture) {
    this.username = username;
    this.password = password;
    this.grade = grade;
    this.phone = phone;
    this.picture = picture;
  }
  signup() {
    const students = localStorage.getItem(user_storage_key)
      ? JSON.parse(localStorage.getItem(user_storage_key))
      : [];

    const newUser = {
      id: Date.now(),
      username: this.username,
      password: this.password,
      grade: this.grade,
      phone: this.phone,
      picture: this.picture,
    };
    students.push(newUser);
    localStorage.setItem(user_storage_key, JSON.stringify(students));
  }
  login() {}
}
export class Teacher {
  constructor() {}
  signup() {}
  login() {}
}
