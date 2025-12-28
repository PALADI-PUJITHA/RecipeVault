// REGISTER
function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("All fields are required!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if email already exists
    if (users.some(user => user.email === email)) {
        alert("Email already registered!");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful ✅");
    window.location.href = "login.html";
}

function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // 🔑 ADMIN LOGIN (hardcoded)
    if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("loggedInUser", JSON.stringify({
            email,
            role: "admin"
        }));
        alert("Admin Login Successful 👑");
        window.location.href = "admin.html";
        return;
    }

    // 👤 NORMAL USER LOGIN
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
        user => user.email === email && user.password === password
    );

    if (!validUser) {
        alert("Invalid email or password ❌");
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    alert("Login Successful 🎉");
    window.location.href = "index.html";
}

