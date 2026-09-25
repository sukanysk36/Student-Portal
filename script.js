/* =========================================================
   STUDENT PORTAL - MAIN JAVASCRIPT
   Backend:
   https://student-portal-32te.vercel.app
========================================================= */

const API_BASE = "https://student-portal-32te.vercel.app/api/auth";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     LOGIN CHECK
  ======================================================= */

  const currentUser = localStorage.getItem("studentUser");

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  /* =======================================================
     HELPER FUNCTIONS
  ======================================================= */

  const getElement = (id) => {
    return document.getElementById(id);
  };

  const goToSection = (sectionId) => {
    const section = getElement(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =======================================================
     USER DATA
  ======================================================= */

  let loggedInUser = null;

  try {
    loggedInUser = JSON.parse(localStorage.getItem("studentUser"));
  } catch (error) {
    console.error("User data error:", error);
  }

  if (!loggedInUser || !loggedInUser.id) {
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const logoBtn = getElement("logoBtn");
  const footerLogoBtn = getElement("footerLogoBtn");

  const exploreBtn = getElement("exploreBtn");
  const profileHeroBtn = getElement("profileHeroBtn");

  const menuBtn = getElement("menuBtn");
  const navLinks = getElement("navLinks");

  const themeBtn = getElement("themeBtn");
  const themeIcon = getElement("themeIcon");

  const searchBtn = getElement("searchBtn");
  const searchBox = getElement("searchBox");
  const searchInput = getElement("searchInput");
  const closeSearchBtn = getElement("closeSearchBtn");

  const notificationBtn = getElement("notificationBtn");

  const notificationPanel = getElement("notificationPanel");

  const notificationList = getElement("notificationList");

  const notificationCount = getElement("notificationCount");

  const clearNotifications = getElement("clearNotifications");

  const topBtn = getElement("topBtn");

  /* =======================================================
     LOGO
  ======================================================= */

  if (logoBtn) {
    logoBtn.addEventListener("click", () => {
      goToSection("home");
    });
  }

  if (footerLogoBtn) {
    footerLogoBtn.addEventListener("click", (event) => {
      event.preventDefault();
      goToSection("home");
    });
  }

  /* =======================================================
     HERO BUTTONS
  ======================================================= */

  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      goToSection("dashboard");
    });
  }

  if (profileHeroBtn) {
    profileHeroBtn.addEventListener("click", () => {
      goToSection("profile");
    });
  }

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  function closeMobileMenu() {
    if (navLinks) {
      navLinks.classList.remove("active");
    }

    if (menuBtn) {
      const icon = menuBtn.querySelector("i");

      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }

      menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  if (menuBtn && navLinks) {
    menuBtn.setAttribute("aria-expanded", "false");

    menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = navLinks.classList.toggle("active");

      const icon = menuBtn.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);

        icon.classList.toggle("fa-xmark", isOpen);
      }

      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  /* =======================================================
     DARK / LIGHT MODE
  ======================================================= */

  const savedTheme = localStorage.getItem("studentPortalTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");

    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");

      themeIcon.classList.add("fa-sun");
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");

      if (themeIcon) {
        themeIcon.classList.toggle("fa-moon", !isDark);

        themeIcon.classList.toggle("fa-sun", isDark);
      }

      localStorage.setItem("studentPortalTheme", isDark ? "dark" : "light");

      themeBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );

      themeBtn.setAttribute(
        "title",
        isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
      );
    });
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  function closeSearch() {
    if (searchBox) {
      searchBox.classList.remove("active");
    }

    if (searchInput) {
      searchInput.value = "";
    }
  }

  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = searchBox.classList.toggle("active");

      if (isOpen && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener("click", closeSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      const query = searchInput.value.toLowerCase().trim();

      if (!query) {
        alert("Please enter something to search.");

        return;
      }

      const searchMap = [
        {
          words: [
            "subject",
            "subjects",
            "data structure",
            "database",
            "web development",
            "network",
            "computer networks",
          ],
          target: "subjects",
        },

        {
          words: ["note", "notes", "study"],
          target: "notes",
        },

        {
          words: ["profile", "student"],
          target: "profile",
        },

        {
          words: ["time", "class", "schedule", "timetable"],
          target: "timetable",
        },

        {
          words: ["attendance", "present"],
          target: "attendance",
        },

        {
          words: ["task", "tasks", "assignment", "pending"],
          target: "tasks",
        },

        {
          words: ["dashboard", "home", "progress"],
          target: "dashboard",
        },

        {
          words: ["contact", "help", "support"],
          target: "contact",
        },
      ];

      const result = searchMap.find((item) =>
        item.words.some((word) => query.includes(word)),
      );

      if (result) {
        closeSearch();

        goToSection(result.target);
      } else {
        alert(
          "No matching section found.\n\nTry: subjects, notes, profile, timetable, attendance, tasks or dashboard.",
        );
      }
    });
  }

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      notificationPanel.classList.toggle("active");
    });
  }

  if (clearNotifications) {
    clearNotifications.addEventListener("click", () => {
      if (notificationList) {
        notificationList.innerHTML = `
            <div class="notification-empty">
              <i class="fa-solid fa-circle-check"></i>

              <strong>
                All caught up!
              </strong>

              <small>
                You have no new notifications.
              </small>
            </div>
          `;
      }

      if (notificationCount) {
        notificationCount.textContent = "0";

        notificationCount.style.display = "none";
      }
    });
  }

  if (notificationList) {
    notificationList.addEventListener("click", (event) => {
      const item = event.target.closest(".notification-item");

      if (!item) {
        return;
      }

      const target = item.dataset.target;

      if (target) {
        notificationPanel?.classList.remove("active");

        goToSection(target);
      }
    });
  }

  /* =======================================================
     DASHBOARD QUICK ACTIONS
  ======================================================= */

  document.querySelectorAll(".action-card, .stat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.target;

      if (!target) {
        return;
      }

      if (card.classList.contains("action-card") && target === "profile") {
        openProfileModal();

        return;
      }

      goToSection(target);
    });
  });

  /* =======================================================
     LOAD ATTENDANCE
  ======================================================= */

  async function loadAttendance() {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

      if (!loggedInUser || !loggedInUser.id) {
        return;
      }

      const response = await fetch(
        `https://student-portal-32te.vercel.app/api/auth/attendance/${loggedInUser.id}`,
      );

      const data = await response.json();

      console.log("Attendance API data:", data);

      if (!response.ok) {
        console.error("Failed to load attendance:", data.message);
        return;
      }

      const attended = Number(data.attended) || 0;
      const totalClasses = Number(data.totalClasses) || 0;
      const minimumTarget = Number(data.minimumTarget) || 75;

      let percentage = 0;

      if (totalClasses > 0) {
        percentage = Math.round((attended / totalClasses) * 100);
      }

      const missed = Math.max(totalClasses - attended, 0);

      const overallAttendance = document.getElementById("overallAttendance");
      const classesAttended = document.getElementById("classesAttended");
      const classesMissed = document.getElementById("classesMissed");
      const minimumTargetElement = document.getElementById("minimumTarget");
      const attendanceStatus = document.getElementById("attendanceStatus");

      if (overallAttendance) {
        overallAttendance.textContent = `${percentage}%`;
      }

      if (classesAttended) {
        classesAttended.textContent = `${attended} / ${totalClasses}`;
      }

      if (classesMissed) {
        classesMissed.textContent = `${missed} classes missed`;
      }

      if (minimumTargetElement) {
        minimumTargetElement.textContent = `${minimumTarget}%`;
      }

      if (attendanceStatus) {
        attendanceStatus.textContent =
          percentage >= minimumTarget
            ? "Good standing"
            : "Below minimum target";
      }

      console.log(
        `Attendance updated: ${attended}/${totalClasses} = ${percentage}%`,
      );
    } catch (error) {
      console.error("Attendance loading error:", error);
    }
  }
  /* =======================================================
     LOAD ATTENDANCE ONCE
  ======================================================= */

  loadAttendance();

  /* =======================================================
     LOAD SUBJECTS / NOTES COUNTS
  ======================================================= */

  function loadSubjectsAndNotesStats() {
    const subjectItems = document.querySelectorAll("#subjects .subject-card");

    const dashboardSubjects = getElement("dashboardSubjects");

    if (dashboardSubjects) {
      dashboardSubjects.textContent = subjectItems.length || 4;
    }

    const noteItems = document.querySelectorAll("#notes .note-card");

    const dashboardNotes = getElement("dashboardNotes");

    if (dashboardNotes) {
      dashboardNotes.textContent = noteItems.length || 24;
    }
  }

  loadSubjectsAndNotesStats();

  /* =======================================================
     SUBJECT DETAILS
  ======================================================= */

  const subjectModal = getElement("subjectModal");

  const subjectDetails = {
    "Data Structures": {
      topics: "Arrays, Linked Lists, Stacks, Queues, Trees and Graphs.",

      difficulty: "Medium",

      progress: 70,
    },

    "Database Management": {
      topics:
        "SQL, Tables, Primary Keys, Foreign Keys, Normalization, Joins and Transactions.",

      difficulty: "Medium",

      progress: 65,
    },

    "Web Development": {
      topics: "HTML, CSS, JavaScript, DOM, Events and Responsive Design.",

      difficulty: "Easy",

      progress: 80,
    },

    "Computer Networks": {
      topics:
        "OSI Model, TCP/IP, IP Addressing, Routing, DNS and Network Protocols.",

      difficulty: "Medium",

      progress: 60,
    },
  };

  document.querySelectorAll(".subject-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const subjectName = button.dataset.subject;

      const subject = subjectDetails[subjectName];

      if (!subject || !subjectModal) {
        return;
      }

      const modalSubjectName = getElement("modalSubjectName");

      const modalTopics = getElement("modalTopics");

      const modalDifficulty = getElement("modalDifficulty");

      const progressBar = getElement("progressBar");

      const progressText = getElement("progressText");

      if (modalSubjectName) {
        modalSubjectName.textContent = subjectName;
      }

      if (modalTopics) {
        modalTopics.textContent = subject.topics;
      }

      if (modalDifficulty) {
        modalDifficulty.textContent = subject.difficulty;
      }

      if (progressBar) {
        progressBar.style.width = `${subject.progress}%`;
      }

      if (progressText) {
        progressText.textContent = `${subject.progress}% completed`;
      }

      subjectModal.classList.add("active");
    });
  });

  /* =======================================================
     NOTES
  ======================================================= */

  const notesModal = getElement("notesModal");

  const notesContent = {
    "Data Structures": `
      <h3>Data Structures</h3>

      <p>
        Data structures are ways of organizing
        and storing data so that it can be
        accessed and modified efficiently.
      </p>

      <h4>Important Topics</h4>

      <ul>
        <li>Arrays</li>
        <li>Linked Lists</li>
        <li>Stacks</li>
        <li>Queues</li>
        <li>Trees</li>
        <li>Graphs</li>
        <li>Searching and Sorting</li>
      </ul>
    `,

    Database: `
      <h3>Database Management</h3>

      <p>
        A database is an organized collection
        of data that can be stored, managed
        and retrieved efficiently.
      </p>

      <h4>Important Topics</h4>

      <ul>
        <li>SQL</li>
        <li>Tables</li>
        <li>Primary Key</li>
        <li>Foreign Key</li>
        <li>Normalization</li>
        <li>Relationships</li>
        <li>CRUD Operations</li>
      </ul>
    `,

    "Web Development": `
      <h3>Web Development</h3>

      <p>
        Web development is the process of
        creating websites and web applications.
      </p>

      <h4>Important Topics</h4>

      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>DOM</li>
        <li>Responsive Design</li>
        <li>APIs</li>
        <li>Frontend and Backend</li>
      </ul>
    `,
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".view-notes-btn");

    if (!button) {
      return;
    }

    if (!notesModal) {
      return;
    }

    const noteName = button.dataset.note;

    const title = getElement("notesModalTitle");

    const text = getElement("notesModalText");

    if (title) {
      title.textContent = `${noteName} Notes`;
    }

    if (text) {
      text.innerHTML = notesContent[noteName] || "<p>No notes available.</p>";
    }

    notesModal.classList.add("active");
  });

  /* =======================================================
     PROFILE
  ======================================================= */

  const profileModal = getElement("profileModal");

  const profileForm = getElement("profileForm");

  const profileFields = [
    ["studentName", "profileNameInput", "studentName"],

    ["studentBranch", "profileBranchInput", "studentBranch"],

    ["studentYear", "profileYearInput", "studentYear"],

    ["studentCollege", "profileCollegeInput", "studentCollege"],

    ["studentEmail", "profileEmailInput", "studentEmail"],
  ];

  window.openProfileModal = function () {
    if (!profileModal) {
      return;
    }

    profileFields.forEach(([displayId, inputId, storageKey]) => {
      const display = getElement(displayId);

      const input = getElement(inputId);

      if (!display || !input) {
        return;
      }

      const savedValue = localStorage.getItem(storageKey);

      input.value = savedValue || display.textContent.trim();
    });

    profileModal.classList.add("active");

    const firstInput = getElement("profileNameInput");

    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  };

  const editProfileBtn = getElement("editProfileBtn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", window.openProfileModal);
  }

  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = getElement("profileNameInput");

      const branchInput = getElement("profileBranchInput");

      const yearInput = getElement("profileYearInput");

      const collegeInput = getElement("profileCollegeInput");

      if (!nameInput || !branchInput || !yearInput || !collegeInput) {
        return;
      }

      const updatedProfile = {
        name: nameInput.value.trim(),

        course: branchInput.value.trim(),

        year: yearInput.value.trim(),

        college: collegeInput.value.trim(),
      };

      try {
        const response = await fetch(`${API_BASE}/profile/${loggedInUser.id}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedProfile),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Profile update failed.");

          return;
        }

        if (data.user) {
          loggedInUser.name = data.user.name;

          loggedInUser.course = data.user.course;

          loggedInUser.year = data.user.year;

          loggedInUser.college = data.user.college || "My College";

          loggedInUser.email = data.user.email || loggedInUser.email;
        }

        localStorage.setItem("studentUser", JSON.stringify(loggedInUser));

        localStorage.setItem("studentName", loggedInUser.name);

        localStorage.setItem("studentEmail", loggedInUser.email);

        localStorage.setItem("studentBranch", loggedInUser.course);

        localStorage.setItem("studentYear", loggedInUser.year);

        localStorage.setItem("studentCollege", loggedInUser.college);

        loadProfile();

        profileModal?.classList.remove("active");

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update error:", error);

        alert("Cannot connect to server. Make sure the backend is running.");
      }
    });
  }

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  function loadProfile() {
    profileFields.forEach(([displayId, , storageKey]) => {
      const display = getElement(displayId);

      if (!display) {
        return;
      }

      const savedValue = localStorage.getItem(storageKey);

      if (savedValue) {
        display.textContent = savedValue;
      }
    });
  }

  loadProfile();

  /* =======================================================
     HELP MODAL
  ======================================================= */

  const helpModal = getElement("helpModal");

  const helpBtn = getElement("helpBtn");

  if (helpBtn && helpModal) {
    helpBtn.addEventListener("click", () => {
      helpModal.classList.add("active");
    });
  }

  /* =======================================================
     TIMETABLE MODAL
  ======================================================= */

  const timetableModal = getElement("timetableModal");

  document.addEventListener("click", (event) => {
    const item = event.target.closest(".timetable-item");

    if (!item) {
      return;
    }

    if (!timetableModal) {
      return;
    }

    const subject = item.dataset.subject || "Class Details";

    const day = item.dataset.day || "Day not available";

    const time = item.dataset.time || "Time not available";

    const room = item.dataset.room || "Room 101";

    const modalSubject = getElement("timetableModalSubject");

    const modalDay = getElement("timetableModalDay");

    const modalTime = getElement("timetableModalTime");

    const modalRoom = getElement("timetableModalRoom");

    const modalStatus = getElement("timetableModalStatus");

    if (modalSubject) {
      modalSubject.textContent = subject;
    }

    if (modalDay) {
      modalDay.textContent = day;
    }

    if (modalTime) {
      modalTime.textContent = time;
    }

    if (modalRoom) {
      modalRoom.textContent = room;
    }

    if (modalStatus) {
      modalStatus.textContent = "Scheduled";
    }

    timetableModal.classList.add("active");
  });

  /* =======================================================
     CONTACT FORM
  ======================================================= */

  const contactForm = getElement("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = getElement("contactName")?.value.trim();

      const email = getElement("contactEmail")?.value.trim();

      const subject = getElement("contactSubject")?.value.trim();

      const message = getElement("contactMessage")?.value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");

        return;
      }

      try {
        const response = await fetch(`${API_BASE}/messages`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to send message.");

          return;
        }

        alert("Your message has been sent successfully!");

        contactForm.reset();

        console.log("Contact message saved:", data.data);
      } catch (error) {
        console.error("Contact form error:", error);

        alert("Cannot connect to server. Make sure the backend is running.");
      }
    });
  }

  /* =======================================================
     CLOSE MODALS
  ======================================================= */

  const modalIds = [
    "subjectModal",

    "notesModal",

    "profileModal",

    "helpModal",

    "taskModal",

    "timetableModal",
  ];

  function closeModalById(id) {
    const modal = getElement(id);

    if (modal) {
      modal.classList.remove("active");
    }
  }

  const closeButtonMap = {
    closeSubjectModal: "subjectModal",

    closeNotesModal: "notesModal",

    closeNotesBtn: "notesModal",

    closeProfileModal: "profileModal",

    cancelProfileBtn: "profileModal",

    closeHelpModal: "helpModal",

    closeHelpBtn: "helpModal",

    closeTaskModal: "taskModal",

    closeTimetableModal: "timetableModal",
  };

  Object.entries(closeButtonMap).forEach(([buttonId, modalId]) => {
    const button = getElement(buttonId);

    if (button) {
      button.addEventListener("click", () => {
        closeModalById(modalId);
      });
    }
  });

  /* =======================================================
     OUTSIDE MODAL CLICK
  ======================================================= */

  modalIds.forEach((modalId) => {
    const modal = getElement(modalId);

    if (!modal) {
      return;
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("active");
      }
    });
  });

  /* =======================================================
     ESC KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    modalIds.forEach(closeModalById);

    closeSearch();

    if (notificationPanel) {
      notificationPanel.classList.remove("active");
    }

    closeMobileMenu();
  });

  /* =======================================================
     BACK TO TOP
  ======================================================= */

  window.addEventListener("scroll", () => {
    if (topBtn) {
      topBtn.classList.toggle("show", window.scrollY > 400);
    }
  });

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* =======================================================
     INITIAL MESSAGE
  ======================================================= */

  console.log("Student Portal JavaScript loaded successfully.");
});

/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.clear();

      window.location.href = "login.html";
    }
  });
}

/* =========================================================
   TASK MANAGEMENT
========================================================= */

let selectedTask = null;

/* =========================================================
   LOAD TASKS FROM MONGODB
========================================================= */

async function loadTasks() {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

    if (!loggedInUser || !loggedInUser.id) {
      return;
    }

    const taskList = document.getElementById("taskList");

    if (!taskList) {
      return;
    }

    const response = await fetch(`${API_BASE}/tasks/${loggedInUser.id}`);

    const tasks = await response.json();

    if (!response.ok) {
      console.error("Failed to load tasks:", tasks.message);

      return;
    }

    taskList.innerHTML = "";

    if (!Array.isArray(tasks)) {
      console.error("Invalid task data.");

      return;
    }

    if (tasks.length === 0) {
      taskList.innerHTML = `
        <p class="no-tasks">
          No pending tasks 🎉
        </p>
      `;

      updateDashboardTaskCount([]);

      return;
    }

    tasks.forEach((task) => {
      const taskButton = document.createElement("button");

      taskButton.type = "button";

      taskButton.className = "task-item";

      if (task.completed) {
        taskButton.classList.add("completed");
      }

      taskButton.dataset.task = task.title;

      taskButton.dataset.id = task._id;

      taskButton.innerHTML = `

          <i class="fa-solid fa-list-check"></i>

          <span>

            <strong>
              ${escapeHTML(task.title || "Task")}
            </strong>

            <small>
              ${escapeHTML(task.dueDate || "No due date")}
            </small>

          </span>

          <i class="fa-solid ${
            task.completed ? "fa-check" : "fa-arrow-right"
          }"></i>

        `;

      taskList.appendChild(taskButton);
    });

    updateDashboardTaskCount(tasks);

    console.log("Tasks loaded from MongoDB:", tasks);
  } catch (error) {
    console.error("Task loading error:", error);
  }
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}

/* =========================================================
   DASHBOARD TASK COUNT
========================================================= */

function updateDashboardTaskCount(tasks) {
  const pendingTasks = tasks.filter((task) => task.completed !== true);

  const dashboardTasks = document.querySelectorAll("#dashboardTasks");

  dashboardTasks.forEach((element) => {
    element.textContent = pendingTasks.length;
  });
}

/* =========================================================
   TASK CLICK
========================================================= */

document.addEventListener("click", async (event) => {
  const taskButton = event.target.closest(".task-item");

  if (!taskButton) {
    return;
  }

  const taskId = taskButton.dataset.id;

  const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

  if (!loggedInUser || !loggedInUser.id || !taskId) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tasks/${loggedInUser.id}`);

    const tasks = await response.json();

    if (!response.ok) {
      return;
    }

    selectedTask = tasks.find((task) => String(task._id) === String(taskId));

    if (!selectedTask) {
      return;
    }

    const taskModal = document.getElementById("taskModal");

    const taskModalTitle = document.getElementById("taskModalTitle");

    const taskModalText = document.getElementById("taskModalText");

    const markTaskBtn = document.getElementById("markTaskBtn");

    if (taskModalTitle) {
      taskModalTitle.textContent = selectedTask.title || "Task";
    }

    if (taskModalText) {
      taskModalText.innerHTML = `

          ${escapeHTML(selectedTask.description || "No description")}

          <br><br>

          <strong>
            Due:
            ${escapeHTML(selectedTask.dueDate || "No due date")}
          </strong>

        `;
    }

    if (markTaskBtn) {
      markTaskBtn.textContent = selectedTask.completed
        ? "Completed ✓"
        : "Mark as Completed";

      markTaskBtn.disabled = selectedTask.completed;
    }

    if (taskModal) {
      taskModal.classList.add("active");
    }
  } catch (error) {
    console.error("Task modal error:", error);
  }
});

/* =========================================================
   MARK TASK COMPLETED
========================================================= */

const markTaskBtn = document.getElementById("markTaskBtn");

if (markTaskBtn) {
  markTaskBtn.addEventListener("click", async () => {
    if (!selectedTask) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tasks/${selectedTask._id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: selectedTask.title,

          description: selectedTask.description,

          dueDate: selectedTask.dueDate,

          completed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update task.");

        return;
      }

      markTaskBtn.textContent = "Completed ✓";

      markTaskBtn.disabled = true;

      alert("Task marked as completed!");

      const taskModal = document.getElementById("taskModal");

      if (taskModal) {
        taskModal.classList.remove("active");
      }

      selectedTask = null;

      await loadTasks();
    } catch (error) {
      console.error("Task update error:", error);

      alert("Cannot connect to server.");
    }
  });
}

/* =========================================================
   LOAD TASKS
========================================================= */

loadTasks();

/* =========================================================
   FINAL DASHBOARD STATS
========================================================= */

async function loadDashboardStats() {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

    if (!loggedInUser || !loggedInUser.id) {
      return;
    }

    /* -----------------------------------------------------
       ATTENDANCE
    ----------------------------------------------------- */

    const attendanceResponse = await fetch(
      `${API_BASE}/attendance/${loggedInUser.id}`,
    );

    const attendanceData = await attendanceResponse.json();

    if (attendanceResponse.ok) {
      const attended = Number(attendanceData.attended) || 0;

      const totalClasses = Number(attendanceData.totalClasses) || 0;

      const minimumTarget = Number(attendanceData.minimumTarget) || 75;

      let percentage = 0;

      if (totalClasses > 0) {
        percentage = Math.round((attended / totalClasses) * 100);
      }

      /*
        IMPORTANT:
        Use querySelectorAll instead of
        getElementById.

        If the HTML accidentally contains
        duplicate dashboardAttendance IDs,
        BOTH values will now update.
      */

      document.querySelectorAll("#dashboardAttendance").forEach((element) => {
        element.textContent = `${percentage}%`;
      });

      document
        .querySelectorAll("#dashboardAttendanceStatus")
        .forEach((element) => {
          if (percentage >= minimumTarget) {
            element.innerHTML = `
                <i class="fa-solid fa-arrow-up"></i>
                Good standing
              `;
          } else {
            element.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                Below target
              `;
          }
        });
    }

    /* -----------------------------------------------------
       TASKS
    ----------------------------------------------------- */

    const tasksResponse = await fetch(`${API_BASE}/tasks/${loggedInUser.id}`);

    const tasks = await tasksResponse.json();

    if (tasksResponse.ok && Array.isArray(tasks)) {
      updateDashboardTaskCount(tasks);
    }

    console.log("Dashboard statistics loaded successfully");
  } catch (error) {
    console.error("Dashboard statistics error:", error);
  }
}

loadDashboardStats();
