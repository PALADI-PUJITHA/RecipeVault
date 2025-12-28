// AUTH GUARD
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "admin") {
    alert("Access denied");
    window.location.href = "login.html";
}

const API_URL = "https://recipevault-f2q0.onrender.com/recipes";

// ADD
async function addRecipe() {
    const recipe = {
        name: name.value,
        image: image.value,
        cuisine: cuisine.value,
        category: category.value,
        ingredients: ingredients.value.split(",").map(i => i.trim()),
        instructions: instructions.value.split("\n").map(i => i.trim())
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
    });

    clearForm();
    loadAdminRecipes();
}

// LOAD
async function loadAdminRecipes() {
    const res = await fetch(API_URL);
    const data = await res.json();

    adminRecipeList.innerHTML = "";
    data.forEach(r => {
        adminRecipeList.innerHTML += `
        <div class="recipe-card">
            <h4>${r.name || "Unnamed Recipe"}</h4>
            <button onclick="deleteRecipe('${r.id}')">Delete</button>
        </div>`;
    });
}

// DELETE (FIXED)
async function deleteRecipe(id) {
    if (!confirm("Delete this recipe?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadAdminRecipes();
}

function clearForm() {
    document.querySelectorAll("input, textarea").forEach(i => i.value = "");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

loadAdminRecipes();
