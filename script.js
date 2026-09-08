// Arrays to store course data
let courseNames = [];
let instructors = [];
let grades = [];
let semesters = [];
let credits = [];

// Function to convert number grade to letter grade
function getLetterGrade(grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

// Function to get grade category for filtering
function getGradeCategory(grade) {
  if (grade >= 90) return "Excellent";
  if (grade >= 80) return "Good";
  if (grade >= 70) return "Average";
  return "Failing";
}

// Add a new course grade
function addGrade() {
  let courseName = document.getElementById("courseName").value.trim();
  let instructor = document.getElementById("instructor").value.trim();
  let grade = Number(document.getElementById("grade").value);
  let semester = document.getElementById("semester").value;
  let credit = Number(document.getElementById("credits").value);

  // Validation - check if all fields are filled
  if (courseName === "" || instructor === "" || grade === "" || semester === "" || credit === "") {
    alert("Please fill all fields");
    return;
  }

  // Validation - check if grade is between 0 and 100
  if (grade < 0 || grade > 100) {
    alert("Grade must be between 0 and 100");
    return;
  }

  // Add data to arrays
  courseNames.push(courseName);
  instructors.push(instructor);
  grades.push(grade);
  semesters.push(semester);
  credits.push(credit);

  // Show success message
  alert("Course added successfully!");

  // Clear the form
  document.getElementById("courseName").value = "";
  document.getElementById("instructor").value = "";
  document.getElementById("grade").value = "";
  document.getElementById("semester").value = "";
  document.getElementById("credits").value = "";

  // Update display
  showTable();
  updateDashboard();
}

// Display the grades table with filters
function showTable() {
  let tableBody = document.getElementById("tableBody");
  let noData = document.getElementById("noData");
  tableBody.innerHTML = "";

  // Get filter values
  let searchText = document.getElementById("search").value.toLowerCase();
  let semesterFilter = document.getElementById("semesterFilter").value;
  let gradeFilter = document.getElementById("gradeFilter").value;

  let filteredCount = 0;

  // Loop through all courses
  for (let i = 0; i < courseNames.length; i++) {
    // Check if course matches search text
    let courseMatch = courseNames[i].toLowerCase().includes(searchText);
    let instructorMatch = instructors[i].toLowerCase().includes(searchText);
    let searchMatch = courseMatch || instructorMatch;

    // Check if semester matches filter
    let semesterMatch = (semesterFilter === "All" || semesters[i] === semesterFilter);

    // Check if grade matches filter
    let gradeCategory = getGradeCategory(grades[i]);
    let gradeMatch = (gradeFilter === "All" || gradeCategory === gradeFilter);

    // If all filters match, add row to table
    if (searchMatch && semesterMatch && gradeMatch) {
      filteredCount++;
      let row = document.createElement("tr");

      let letterGrade = getLetterGrade(grades[i]);
      let gradeClass = "grade-" + gradeCategory.toLowerCase();

      row.innerHTML =
        "<td>" + courseNames[i] + "</td>" +
        "<td>" + instructors[i] + "</td>" +
        "<td>" + grades[i] + "</td>" +
        "<td class='" + gradeClass + "'>" + letterGrade + "</td>" +
        "<td>" + semesters[i] + "</td>" +
        "<td>" + credits[i] + "</td>" +
        "<td>" +
          "<button class='btn-edit' data-index='" + i + "'>Edit</button> " +
          "<button class='btn-delete' data-index='" + i + "'>Delete</button>" +
        "</td>";

      tableBody.appendChild(row);
    }
  }

  // Show "no data" message if no courses match filters
  if (filteredCount === 0) {
    noData.style.display = "block";
  } else {
    noData.style.display = "none";
  }

  // Attach button listeners
  addButtonListeners();
}

// Add click listeners to edit and delete buttons
function addButtonListeners() {
  let editButtons = document.querySelectorAll(".btn-edit");
  let deleteButtons = document.querySelectorAll(".btn-delete");

  // Edit button functionality
  editButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      let i = Number(button.dataset.index);
      
      // Populate form with current values
      document.getElementById("courseName").value = courseNames[i];
      document.getElementById("instructor").value = instructors[i];
      document.getElementById("grade").value = grades[i];
      document.getElementById("semester").value = semesters[i];
      document.getElementById("credits").value = credits[i];

      // Delete the old entry
      courseNames.splice(i, 1);
      instructors.splice(i, 1);
      grades.splice(i, 1);
      semesters.splice(i, 1);
      credits.splice(i, 1);

      // Refresh table
      showTable();
      updateDashboard();

      // Scroll to form
      document.getElementById("courseName").focus();
    });
  });

  // Delete button functionality
  deleteButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      let i = Number(button.dataset.index);

      // Confirm before deleting
      if (confirm("Are you sure you want to delete " + courseNames[i] + "?")) {
        // Remove from all arrays
        courseNames.splice(i, 1);
        instructors.splice(i, 1);
        grades.splice(i, 1);
        semesters.splice(i, 1);
        credits.splice(i, 1);

        // Refresh display
        showTable();
        updateDashboard();
      }
    });
  });
}

// Update dashboard statistics
function updateDashboard() {
  let totalCourses = courseNames.length;
  let averageGrade = 0;
  let passingCourses = 0;
  let failingCourses = 0;

  // Calculate statistics
  for (let i = 0; i < totalCourses; i++) {
    averageGrade += grades[i];
    if (grades[i] >= 70) {
      passingCourses++;
    } else {
      failingCourses++;
    }
  }

  // Calculate average
  if (totalCourses > 0) {
    averageGrade = Math.round(averageGrade / totalCourses);
  }

  // Update dashboard display
  document.getElementById("totalCourses").innerText = totalCourses;
  document.getElementById("averageGrade").innerText = averageGrade + "%";
  document.getElementById("passingCourses").innerText = passingCourses;
  document.getElementById("failingCourses").innerText = failingCourses;
}

// Handle form submit
document.getElementById("gradeForm").addEventListener("submit", function(e) {
  e.preventDefault();
  addGrade();
});

// Handle search input
document.getElementById("search").addEventListener("input", showTable);

// Handle semester filter
document.getElementById("semesterFilter").addEventListener("change", showTable);

// Handle grade filter
document.getElementById("gradeFilter").addEventListener("change", showTable);

// Initial load
showTable();
updateDashboard();