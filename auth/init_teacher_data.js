document.addEventListener("DOMContentLoaded", () => {
  // Check if teacher data already exists in local storage
  if (!localStorage.getItem("teacher")) {
    const teachers = [
      {
        id: 1,
        username: "omar_teacher",
        password: "mhmd2003",
        name: "Omar",
        course: "Animals",
      },
      {
        id: 2,
        username: "mona_teacher",
        password: "mhmd2003",
        name: "Mona",
        course: "Plants",
      },
      {
        id: 3,
        username: "yassen_teacher",
        password: "mhmd2003",
        name: "Yassen",
        course: "Planets",
      },
    ];

    // Save the initial teacher data to local storage
    localStorage.setItem("teacher", JSON.stringify(teachers));
    console.log("Initial teacher data has been set.");
  }
});
