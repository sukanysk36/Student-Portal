document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    message.textContent = "Creating account...";
    message.style.color = "#2563eb";

    try {
      const response = await fetch(
        "https://student-portal-32te.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        message.textContent =
          "Registration successful! Redirecting to login...";
        message.style.color = "green";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } else {
        message.textContent = data.message || "Registration failed";
        message.style.color = "red";
      }
    } catch (error) {
      console.error("Registration error:", error);

      message.textContent =
        "Cannot connect to server. Make sure the backend is running.";
      message.style.color = "red";
    }
  });
