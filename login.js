document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    message.textContent = "Logging in...";
    message.style.color = "#2563eb";

    try {
      const response = await fetch(
        "https://student-portal-n9fs.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();
      console.log("Attendance API data:", data);

      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("studentUser", JSON.stringify(data.user));

        message.textContent = "Login successful!";
        message.style.color = "green";

        // Redirect directly to the portal
        window.location.href = "./index.html";
      } else {
        message.textContent = data.message || "Login failed";
        message.style.color = "red";
      }
    } catch (error) {
      console.error("Login error:", error);

      message.textContent =
        "Cannot connect to server. Make sure the backend is running.";

      message.style.color = "red";
    }
  });
