document.addEventListener("DOMContentLoaded", () => {
  // ==================== LOAD ATTENDANCE ====================

  async function loadAttendance() {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

      if (!loggedInUser || !loggedInUser.id) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/attendance/${loggedInUser.id}`,
      );

      const data = await response.json();

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
    } catch (error) {
      console.error("Attendance loading error:", error);
    }
  }

  loadAttendance();

  const currentUser = localStorage.getItem("studentUser");

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  /* =================================================
       HELPER FUNCTIONS
  ================================================= */

  const getElement = (id) => document.getElementById(id);

  const goToSection = (sectionId) => {
    const section = getElement(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =================================================
       ELEMENTS
  ================================================= */

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
  const clearNotifications = getElement("clearNotifications");
  const notificationList = getElement("notificationList");
  const notificationCount = getElement("notificationCount");

  const topBtn = getElement("topBtn");

  /* =================================================
       LOGO
  ================================================= */

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

  /* =================================================
       HERO BUTTONS
  ================================================= */

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

  /* =================================================
       MOBILE MENU
  ================================================= */

  const closeMobileMenu = () => {
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
  };

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

  /* =================================================
       DARK / LIGHT MODE
  ================================================= */

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

  /* =================================================
       SEARCH
  ================================================= */

  const closeSearch = () => {
    if (searchBox) {
      searchBox.classList.remove("active");
    }

    if (searchInput) {
      searchInput.value = "";
    }
  };

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
            "web",
            "network",
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

  /* =================================================
       NOTIFICATIONS
  ================================================= */

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
            <strong>All caught up!</strong>
            <small>You have no new notifications.</small>
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
        if (notificationPanel) {
          notificationPanel.classList.remove("active");
        }

        goToSection(target);
      }
    });
  }

  /* =================================================
       DASHBOARD / QUICK ACTIONS
  ================================================= */

  document.querySelectorAll(".action-card, .stat-card").forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.target;

      if (!target) {
        return;
      }

      if (
        card.classList.contains("action-card") &&
        target === "profile" &&
        typeof openProfileModal === "function"
      ) {
        openProfileModal();
        return;
      }

      goToSection(target);
    });
  });

  /* =================================================
       SUBJECT MODAL
  ================================================= */

  const subjectModal = getElement("subjectModal");

  const subjects = {
    "Data Structures": {
      topics: "Arrays, Linked Lists, Stacks, Queues, Trees and Graphs.",
      difficulty: "Medium",
      progress: 65,
    },

    "Database Management": {
      topics:
        "SQL, Tables, Primary Keys, Foreign Keys, Normalization, Joins and Transactions.",
      difficulty: "Medium",
      progress: 55,
    },

    "Web Development": {
      topics: "HTML, CSS, JavaScript, DOM, Events and Responsive Design.",
      difficulty: "Easy",
      progress: 75,
    },

    "Computer Networks": {
      topics:
        "OSI Model, TCP/IP, IP Addressing, Routing, DNS and Network Protocols.",
      difficulty: "Hard",
      progress: 40,
    },
  };

  document.querySelectorAll(".subject-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const subject = subjects[button.dataset.subject];

      if (!subject || !subjectModal) {
        return;
      }

      const subjectName = getElement("modalSubjectName");
      const topics = getElement("modalTopics");
      const difficulty = getElement("modalDifficulty");
      const progressBar = getElement("progressBar");
      const progressText = getElement("progressText");

      if (subjectName) {
        subjectName.textContent = button.dataset.subject;
      }

      if (topics) {
        topics.textContent = subject.topics;
      }

      if (difficulty) {
        difficulty.textContent = subject.difficulty;
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

  /* =================================================
       NOTES MODAL
  ================================================= */

  const notesModal = getElement("notesModal");

  const notes = {
    "Data Structures":
      "Study Arrays, Linked Lists, Stacks, Queues, Trees, Graphs and common algorithms. Focus on time complexity and implementation.",

    Database:
      "Study SQL queries, primary keys, foreign keys, normalization, joins, transactions and relational database concepts.",

    "Web Development":
      "Study HTML structure, CSS styling, JavaScript fundamentals, DOM manipulation, events and responsive website design.",
  };

  document.querySelectorAll(".view-notes-btn").forEach((button) => {
    button.addEventListener("click", () => {
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
        text.textContent = notes[noteName] || "Notes are not available.";
      }

      notesModal.classList.add("active");
    });
  });

  /* =================================================
       PROFILE
  ================================================= */

  const profileModal = getElement("profileModal");
  const profileForm = getElement("profileForm");

  const profileFields = [
    ["studentName", "profileNameInput", "studentName"],
    ["studentBranch", "profileBranchInput", "studentBranch"],
    ["studentYear", "profileYearInput", "studentYear"],
    ["studentCollege", "profileCollegeInput", "studentCollege"],
    ["studentEmail", "profileEmailInput", "studentEmail"],
  ];

  function openProfileModal() {
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
  }

  const editProfileBtn = getElement("editProfileBtn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openProfileModal);
  }

  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

      if (!loggedInUser || !loggedInUser.id) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
      }

      const updatedProfile = {
        name: getElement("profileNameInput").value.trim(),
        course: getElement("profileBranchInput").value.trim(),
        year: getElement("profileYearInput").value.trim(),
        college: getElement("profileCollegeInput").value.trim(),
      };

      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/profile/${loggedInUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProfile),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Profile update failed.");
          return;
        }

        // Update the displayed profile
        getElement("studentName").textContent = data.user.name;
        getElement("studentBranch").textContent = data.user.course;
        getElement("studentYear").textContent = data.user.year;
        getElement("studentCollege").textContent =
          data.user.college || "My College";
        getElement("studentEmail").textContent = data.user.email;

        // Update localStorage
        localStorage.setItem("studentName", data.user.name);

        localStorage.setItem("studentBranch", data.user.course);

        localStorage.setItem("studentYear", data.user.year);

        localStorage.setItem(
          "studentCollege",
          data.user.college || "My College",
        );

        // Update logged-in user data
        loggedInUser.name = data.user.name;
        loggedInUser.course = data.user.course;
        loggedInUser.year = data.user.year;

        localStorage.setItem("studentUser", JSON.stringify(loggedInUser));

        if (profileModal) {
          profileModal.classList.remove("active");
        }

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update error:", error);

        alert("Cannot connect to server. Make sure the backend is running.");
      }
    });
  }

  /* =================================================
       HELP MODAL
  ================================================= */

  const helpModal = getElement("helpModal");
  const helpBtn = getElement("helpBtn");

  if (helpBtn && helpModal) {
    helpBtn.addEventListener("click", () => {
      helpModal.classList.add("active");
    });
  }

  /* =================================================
       TASKS
  ================================================= */

  const taskModal = getElement("taskModal");
  const markTaskBtn = getElement("markTaskBtn");

  let selectedTask = null;

  const updatePendingTaskCount = () => {
    const pendingTasks = document.querySelectorAll(
      ".task-item:not(.completed)",
    ).length;

    const pendingHeading = document.querySelector("#tasks .section-heading h2");

    const dashboardNumber = document.querySelector(
      '.stat-card[data-target="tasks"] h3',
    );

    if (dashboardNumber) {
      dashboardNumber.textContent = pendingTasks;
    }

    if (pendingHeading) {
      pendingHeading.textContent = "Pending Tasks";
    }
  };

  document.querySelectorAll(".task-item").forEach((task) => {
    task.addEventListener("click", () => {
      if (task.classList.contains("completed")) {
        alert("This task is already completed.");
        return;
      }

      selectedTask = task;

      const title = getElement("taskModalTitle");
      const text = getElement("taskModalText");

      if (title) {
        title.textContent = task.dataset.task || "Task";
      }

      if (text) {
        text.textContent =
          "This task is currently pending. Complete it and mark it as done when finished.";
      }

      if (markTaskBtn) {
        markTaskBtn.style.display = "inline-flex";
      }

      if (taskModal) {
        taskModal.classList.add("active");
      }
    });
  });

  if (markTaskBtn) {
    markTaskBtn.addEventListener("click", () => {
      if (!selectedTask) {
        return;
      }

      selectedTask.classList.add("completed");

      selectedTask.setAttribute(
        "aria-label",
        `${selectedTask.dataset.task} completed`,
      );

      const smallText = selectedTask.querySelector("small");

      if (smallText) {
        smallText.textContent = "Completed";
      }

      const arrow = selectedTask.querySelector(".fa-arrow-right");

      if (arrow) {
        arrow.classList.remove("fa-arrow-right");
        arrow.classList.add("fa-check");
      }

      if (taskModal) {
        taskModal.classList.remove("active");
      }

      updatePendingTaskCount();

      alert("Task marked as completed!");

      selectedTask = null;
    });
  }

  updatePendingTaskCount();

  /* =================================================
       CLOSE MODALS
  ================================================= */

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("active");
    }
  }

  const closeButtons = [
    ["closeSubjectModal", subjectModal],
    ["closeNotesModal", notesModal],
    ["closeNotesBtn", notesModal],
    ["closeProfileModal", profileModal],
    ["cancelProfileBtn", profileModal],
    ["closeHelpModal", helpModal],
    ["closeHelpBtn", helpModal],
    ["closeTaskModal", taskModal],
  ];

  closeButtons.forEach(([buttonId, modal]) => {
    const button = getElement(buttonId);

    if (button) {
      button.addEventListener("click", () => {
        closeModal(modal);
      });
    }
  });

  /* =================================================
       OUTSIDE CLICK
  ================================================= */

  document.addEventListener("click", (event) => {
    if (
      searchBox &&
      searchBtn &&
      !searchBox.contains(event.target) &&
      !searchBtn.contains(event.target)
    ) {
      searchBox.classList.remove("active");
    }

    if (
      notificationPanel &&
      notificationBtn &&
      !notificationPanel.contains(event.target) &&
      !notificationBtn.contains(event.target)
    ) {
      notificationPanel.classList.remove("active");
    }

    [subjectModal, notesModal, profileModal, helpModal, taskModal].forEach(
      (modal) => {
        if (modal && event.target === modal) {
          closeModal(modal);
        }
      },
    );
  });

  /* =================================================
       ESC KEY
  ================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    [subjectModal, notesModal, profileModal, helpModal, taskModal].forEach(
      closeModal,
    );

    if (searchBox) {
      searchBox.classList.remove("active");
    }

    if (notificationPanel) {
      notificationPanel.classList.remove("active");
    }

    closeMobileMenu();
  });

  /* =================================================
       LOGIN USER → PROFILE
  ================================================= */

  const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

  if (loggedInUser) {
    localStorage.setItem("studentName", loggedInUser.name || "");

    localStorage.setItem("studentEmail", loggedInUser.email || "");

    localStorage.setItem(
      "studentBranch",
      loggedInUser.course || "Computer Science",
    );

    localStorage.setItem("studentYear", loggedInUser.year || "3rd Year");
  }

  /* =================================================
       LOAD SAVED PROFILE
  ================================================= */

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

  /* =================================================
       BACK TO TOP
  ================================================= */

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

  /* =================================================
       INITIAL ACCESSIBILITY
  ================================================= */

  if (themeBtn) {
    const isDark = document.body.classList.contains("dark");

    themeBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }

  console.log("Student Portal JavaScript loaded successfully.");
});

// ==================== LOGOUT ====================

// ==================== LOGOUT ====================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.clear();
      window.location.href = "login.html";
    }
  });
}

// ==================== LOAD TASKS ====================

// ==================== LOAD TASKS FROM MONGODB ====================

async function loadTasks() {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

    if (!loggedInUser || !loggedInUser.id) {
      return;
    }

    const taskList = document.getElementById("taskList");

    if (!taskList) {
      console.error("Task list element not found");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/auth/tasks/${loggedInUser.id}`,
    );

    const tasks = await response.json();

    if (!response.ok) {
      console.error("Failed to load tasks:", tasks.message);
      return;
    }

    // Clear old tasks
    taskList.innerHTML = "";

    // If there are no tasks
    if (!tasks.length) {
      taskList.innerHTML = `
        <p class="no-tasks">
          No pending tasks 🎉
        </p>
      `;
      return;
    }

    // Create task buttons
    tasks.forEach((task) => {
      const taskButton = document.createElement("button");

      taskButton.className = "task-item";

      taskButton.setAttribute("data-task", task.title);

      taskButton.innerHTML = `
        <i class="fa-solid fa-list-check"></i>

        <span>
          <strong>
            ${task.title}
          </strong>

          <small>
            ${task.dueDate || "No due date"}
          </small>
        </span>

        <i class="fa-solid fa-arrow-right"></i>
      `;

      taskList.appendChild(taskButton);
    });

    console.log("Tasks loaded from MongoDB:", tasks);
  } catch (error) {
    console.error("Task loading error:", error);
  }
}

loadTasks();

// ==================== TASK MODAL ====================

const taskModal = document.getElementById("taskModal");
const taskModalTitle = document.getElementById("taskModalTitle");
const taskModalText = document.getElementById("taskModalText");
const closeTaskModal = document.getElementById("closeTaskModal");
const markTaskBtn = document.getElementById("markTaskBtn");

let selectedTask = null;

// OPEN TASK MODAL
document.addEventListener("click", function (event) {
  const taskButton = event.target.closest(".task-item");

  if (!taskButton) {
    return;
  }

  const taskTitle = taskButton.getAttribute("data-task");

  const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

  if (!loggedInUser || !loggedInUser.id) {
    return;
  }

  fetch(`http://localhost:5000/api/auth/tasks/${loggedInUser.id}`)
    .then((response) => response.json())
    .then((tasks) => {
      selectedTask = tasks.find((task) => task.title === taskTitle);

      if (!selectedTask) {
        return;
      }

      taskModalTitle.textContent = selectedTask.title;

      taskModalText.innerHTML = `
        ${selectedTask.description || "No description"}
        <br><br>
        <strong>
          Due: ${selectedTask.dueDate || "No due date"}
        </strong>
      `;

      markTaskBtn.textContent = selectedTask.completed
        ? "Completed ✓"
        : "Mark as Completed";

      markTaskBtn.disabled = selectedTask.completed;

      taskModal.classList.add("active");
    })
    .catch((error) => {
      console.error("Task modal error:", error);
    });
});

// CLOSE TASK MODAL
if (closeTaskModal) {
  closeTaskModal.addEventListener("click", function () {
    taskModal.classList.remove("active");

    selectedTask = null;
  });
}

// MARK TASK AS COMPLETED
if (markTaskBtn) {
  markTaskBtn.addEventListener("click", async function () {
    if (!selectedTask) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/tasks/${selectedTask._id}`,
        {
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not update task.");

        return;
      }

      selectedTask = data.task;

      markTaskBtn.textContent = "Completed ✓";

      markTaskBtn.disabled = true;

      alert("Task marked as completed!");

      loadTasks();
    } catch (error) {
      console.error("Task update error:", error);

      alert("Cannot connect to server.");
    }
  });
}

// ==================== DASHBOARD STATISTICS ====================

async function loadDashboardStats() {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("studentUser"));

    if (!loggedInUser || !loggedInUser.id) {
      return;
    }

    // ==================== ATTENDANCE ====================

    const attendanceResponse = await fetch(
      `http://localhost:5000/api/auth/attendance/${loggedInUser.id}`,
    );

    const attendanceData = await attendanceResponse.json();

    if (attendanceResponse.ok) {
      const attended = Number(attendanceData.attended) || 0;

      const totalClasses = Number(attendanceData.totalClasses) || 0;

      let percentage = 0;

      if (totalClasses > 0) {
        percentage = Math.round((attended / totalClasses) * 100);
      }

      const dashboardAttendance = document.getElementById(
        "dashboardAttendance",
      );

      const dashboardAttendanceStatus = document.getElementById(
        "dashboardAttendanceStatus",
      );

      if (dashboardAttendance) {
        dashboardAttendance.textContent = `${percentage}%`;
      }

      if (dashboardAttendanceStatus) {
        if (percentage >= Number(attendanceData.minimumTarget || 75)) {
          dashboardAttendanceStatus.innerHTML = `
            <i class="fa-solid fa-arrow-up"></i>
            Good standing
          `;
        } else {
          dashboardAttendanceStatus.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            Below target
          `;
        }
      }
    }

    // ==================== TASKS ====================

    const tasksResponse = await fetch(
      `http://localhost:5000/api/auth/tasks/${loggedInUser.id}`,
    );

    const tasks = await tasksResponse.json();

    if (tasksResponse.ok) {
      const pendingTasks = tasks.filter((task) => task.completed === false);

      const dashboardTasks = document.getElementById("dashboardTasks");

      if (dashboardTasks) {
        dashboardTasks.textContent = pendingTasks.length;
      }
    }

    console.log("Dashboard statistics loaded successfully");
  } catch (error) {
    console.error("Dashboard statistics error:", error);
  }
}

loadDashboardStats();

// ==================== SUBJECTS & NOTES STATISTICS ====================

function loadSubjectsAndNotesStats() {
  // ==================== SUBJECTS ====================

  const subjectItems = document.querySelectorAll("#subjects .subject-card");

  const dashboardSubjects = document.getElementById("dashboardSubjects");

  if (dashboardSubjects) {
    dashboardSubjects.textContent = subjectItems.length || 4;
  }

  // ==================== NOTES ====================

  const noteItems = document.querySelectorAll("#notes .note-card");

  const dashboardNotes = document.getElementById("dashboardNotes");

  if (dashboardNotes) {
    dashboardNotes.textContent = noteItems.length || 24;
  }
}

loadSubjectsAndNotesStats();

// ==================== NOTES BUTTONS ====================

// ==================== NOTES MODAL ====================

const notesModal = document.getElementById("notesModal");

const closeNotesModal = document.getElementById("closeNotesModal");

const notesModalTitle = document.getElementById("notesModalTitle");

const notesModalText = document.getElementById("notesModalText");

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

// OPEN NOTES MODAL

document.addEventListener("click", function (event) {
  const button = event.target.closest(".view-notes-btn");

  if (!button) {
    return;
  }

  const noteName = button.getAttribute("data-note");

  if (!notesModal) {
    return;
  }

  notesModalTitle.textContent = `${noteName} Notes`;

  notesModalText.innerHTML =
    notesContent[noteName] || "<p>No notes available.</p>";

  notesModal.classList.add("active");
});

// CLOSE NOTES MODAL

if (closeNotesModal) {
  closeNotesModal.addEventListener("click", function () {
    notesModal.classList.remove("active");
  });
}

// ==================== SEARCH ====================

// ==================== SMART SEARCH ====================

const searchInput = document.getElementById("searchInput");

const searchBox = document.getElementById("searchBox");

const closeSearchBtn = document.getElementById("closeSearchBtn");

const searchTargets = {
  "data structures": "subjects",
  database: "subjects",
  "database management": "subjects",
  "web development": "subjects",
  "computer networks": "subjects",

  notes: "notes",
  "study notes": "notes",

  attendance: "attendance",

  tasks: "tasks",
  "pending tasks": "tasks",

  timetable: "timetable",

  profile: "profile",
  "student profile": "profile",

  dashboard: "dashboard",
  home: "home",
};

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();

    if (!searchText) {
      return;
    }

    let targetSection = null;

    // Exact / partial keyword matching

    for (const keyword in searchTargets) {
      if (keyword.includes(searchText)) {
        targetSection = searchTargets[keyword];

        break;
      }
    }

    // Search section directly

    if (!targetSection) {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        if (targetSection) {
          return;
        }

        const text = section.textContent.toLowerCase();

        if (text.includes(searchText)) {
          targetSection = section.id;
        }
      });
    }

    if (targetSection) {
      const section = document.getElementById(targetSection);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
}

// ==================== CLOSE SEARCH ====================

if (closeSearchBtn) {
  closeSearchBtn.addEventListener("click", function () {
    if (searchInput) {
      searchInput.value = "";
    }

    if (searchBox) {
      searchBox.classList.remove("active");
    }
  });
}

/* =====================================================
   SUBJECT DETAILS MODAL
===================================================== */

const subjectModal = document.getElementById("subjectModal");
const closeSubjectModal = document.getElementById("closeSubjectModal");

const modalSubjectName = document.getElementById("modalSubjectName");
const modalTopics = document.getElementById("modalTopics");
const modalDifficulty = document.getElementById("modalDifficulty");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const subjectDetails = {
  "Data Structures": {
    topics: "Arrays, linked lists, stacks, queues, trees and graphs.",
    difficulty: "Medium",
    progress: 70,
  },

  "Database Management": {
    topics: "SQL, tables, keys, normalization, joins and transactions.",
    difficulty: "Medium",
    progress: 65,
  },

  "Web Development": {
    topics: "HTML, CSS, JavaScript, DOM, events and responsive design.",
    difficulty: "Easy",
    progress: 80,
  },

  "Computer Networks": {
    topics: "OSI model, TCP/IP, IP addressing, routing and protocols.",
    difficulty: "Medium",
    progress: 60,
  },
};

/* OPEN SUBJECT MODAL */

document.addEventListener("click", function (event) {
  const button = event.target.closest(".subject-btn");

  if (!button) {
    return;
  }

  const subjectName = button.getAttribute("data-subject");

  const subject = subjectDetails[subjectName];

  if (!subject || !subjectModal) {
    return;
  }

  modalSubjectName.textContent = subjectName;

  modalTopics.textContent = subject.topics;

  modalDifficulty.textContent = subject.difficulty;

  progressBar.style.width = `${subject.progress}%`;

  progressText.textContent = `${subject.progress}% completed`;

  subjectModal.classList.add("active");
});

/* CLOSE SUBJECT MODAL */

if (closeSubjectModal) {
  closeSubjectModal.addEventListener("click", function () {
    subjectModal.classList.remove("active");
  });
}
const closeNotesBtn = document.getElementById("closeNotesBtn");

if (closeNotesBtn) {
  closeNotesBtn.addEventListener("click", function () {
    notesModal.classList.remove("active");
  });
}

/* =====================================================
   TIMETABLE DETAILS MODAL
===================================================== */

const timetableModal = document.getElementById("timetableModal");

const closeTimetableModal = document.getElementById("closeTimetableModal");

const timetableModalSubject = document.getElementById("timetableModalSubject");

const timetableModalDay = document.getElementById("timetableModalDay");

const timetableModalTime = document.getElementById("timetableModalTime");

const timetableModalRoom = document.getElementById("timetableModalRoom");

const timetableModalStatus = document.getElementById("timetableModalStatus");

/* OPEN TIMETABLE MODAL */

document.addEventListener("click", function (event) {
  const timetableItem = event.target.closest(".timetable-item");

  if (!timetableItem) {
    return;
  }

  const subject = timetableItem.getAttribute("data-subject");

  const day = timetableItem.getAttribute("data-day");

  const time = timetableItem.getAttribute("data-time");

  const room = timetableItem.getAttribute("data-room");

  if (!timetableModal) {
    return;
  }

  timetableModalSubject.textContent = subject || "Class Details";

  timetableModalDay.textContent = day || "Day not available";

  timetableModalTime.textContent = time || "Time not available";

  timetableModalRoom.textContent = room || "Room 101";

  timetableModalStatus.textContent = "Scheduled";

  timetableModal.classList.add("active");
});

/* CLOSE TIMETABLE MODAL */

if (closeTimetableModal) {
  closeTimetableModal.addEventListener("click", function () {
    timetableModal.classList.remove("active");
  });
}

/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();

    const email = document.getElementById("contactEmail").value.trim();

    const subject = document.getElementById("contactSubject").value.trim();

    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");

      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/messages", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
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
