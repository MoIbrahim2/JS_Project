const student_storage_key = "student";
const teacher_storage_key = "teacher";
const loged_in_user_storage_key = "logged_in_user";

export class Student {
  constructor(username, password, grade = null, phone = null, picture = null) {
    this.username = username;
    this.password = password;
    this.grade = grade;
    this.phone = phone;
    this.picture = picture;
  }
  signup() {
    const students = localStorage.getItem(student_storage_key)
      ? JSON.parse(localStorage.getItem(student_storage_key))
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
    localStorage.setItem(student_storage_key, JSON.stringify(students));
  }
  login() {
    const students = localStorage.getItem(student_storage_key)
      ? JSON.parse(localStorage.getItem(student_storage_key))
      : [];
    const student = students.find((s) => s.username === this.username);

    if (!student) {
      return { success: false, reason: "username" }; // User not found
    }

    if (student.password === this.password) {
      localStorage.setItem(loged_in_user_storage_key, JSON.stringify(student));
      return { success: true };
    } else {
      return { success: false, reason: "password" }; // Incorrect password
    }
  }
}
export class Teacher {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
  login() {
    const teachers = localStorage.getItem(teacher_storage_key)
      ? JSON.parse(localStorage.getItem(teacher_storage_key))
      : [];
    console.log(teachers);
    const teacher = teachers.find((t) => t.username === this.username);

    if (!teacher) {
      return { success: false, reason: "username" }; // Teacher not found
    }

    if (teacher.password === this.password) {
      localStorage.setItem(loged_in_user_storage_key, JSON.stringify(teacher));
      return { success: true };
    } else {
      return { success: false, reason: "password" };
    }
  }
}
