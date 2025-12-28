// AUTH GUARD
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
    window.location.href = "login.html";
}

const API_URL = "http://localhost:3001/recipes";
let allRecipes = [];
let currentPage = 1;
const recipesPerPage = 6;

// Load recipes from JSON
async function loadRecipes() {
    const response = await fetch(API_URL);
    return await response.json();
}

// Initialize app
async function init() {
    allRecipes = await loadRecipes();
    renderPage();
}

// Pagination
function renderPage(recipes = allRecipes) {
    const start = (currentPage - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    displayRecipes(recipes.slice(start, end));
    renderPagination(recipes.length);
}

function changePage(page) {
    currentPage = page;
    renderPage();
}

function renderPagination(totalRecipes) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        pagination.innerHTML += `<button onclick="changePage(${currentPage - 1})">Prev</button>`;
    }

    pagination.innerHTML += `<span> Page ${currentPage} of ${totalPages} </span>`;

    if (currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
}

// Display recipes
function displayRecipes(recipes) {
    const container = document.getElementById("recipeContainer");
    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found</p>";
        return;
    }

    recipes.forEach(recipe => {
        const isFav = getFavorites().includes(String(recipe.id));

        const ingredientsHTML = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.filter(i => i.trim() !== "").map(i => `<li>${i}</li>`).join("")
            : `<li>${recipe.ingredients || "No ingredients listed"}</li>`;

        let instructionsArray = [];
        if (Array.isArray(recipe.instructions)) {
            instructionsArray = recipe.instructions;
        } else if (typeof recipe.instructions === "string") {
            instructionsArray = recipe.instructions.split("\n");
        }

        const instructionsHTML = instructionsArray
            .filter(step => step.trim() !== "")
            .map(step => `<li>${step}</li>`).join("");

        container.innerHTML += `
            <div class="recipe-card">
                <img src="${recipe.image || 'https://via.placeholder.com/300x200'}"
                     onerror="this.src='https://via.placeholder.com/300x200'">

                <div class="card-content">
                    <h3>${recipe.name || "Unnamed Recipe"}</h3>
                    <p><strong>${recipe.cuisine || "Unknown"}</strong> | ${recipe.category || "Unknown"}</p>

                    <button class="show-recipe-btn" onclick="showRecipeDetails('${recipe.id}')">
                        View Recipe
                    </button>

                    <button class="fav-btn" onclick="toggleFavorite('${recipe.id}')">
                        <i class="fas fa-heart"></i> ${isFav ? "Unfavorite" : "Favorite"}
                    </button>
                </div>
            </div>
        `;
    });
}

// Show recipe details modal
function showRecipeDetails(id) {
    const recipe = allRecipes.find(r => String(r.id) === String(id));
    if (!recipe) {
        alert("Recipe not found");
        return;
    }

    const name = recipe.name || "Unnamed Recipe";

    const ingredientsHTML = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.filter(i => i.trim() !== "").map(i => `<li>${i}</li>`).join("")
        : `<li>${recipe.ingredients || "No ingredients listed"}</li>`;

    let instructionsArray = [];
    if (Array.isArray(recipe.instructions)) {
        instructionsArray = recipe.instructions;
    } else if (typeof recipe.instructions === "string") {
        instructionsArray = recipe.instructions.split("\n");
    }

    const instructionsHTML = instructionsArray
        .filter(step => step.trim() !== "")
        .map(step => `<li>${step}</li>`).join("");

    document.getElementById("modalContent").innerHTML = `
        <h2>${name}</h2>
        <img src="${recipe.image || 'https://via.placeholder.com/600x400'}"
             style="width:100%; border-radius:12px; margin-bottom:20px;"
             onerror="this.src='https://via.placeholder.com/600x400'">
        <h3>Ingredients</h3>
        <ul>${ingredientsHTML}</ul>
        <h3>Instructions</h3>
        <ol>${instructionsHTML}</ol>
    `;

    document.getElementById("recipeModal").style.display = "block";
}

// Close modal
document.getElementById("closeBtn").onclick = () =>
    document.getElementById("recipeModal").style.display = "none";

window.onclick = e => {
    if (e.target === document.getElementById("recipeModal")) {
        document.getElementById("recipeModal").style.display = "none";
    }
};

// Search functionality
function searchRecipes() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    currentPage = 1;

    if (!query) {
        renderPage(allRecipes);
        return;
    }

    const filtered = allRecipes.filter(r =>
        (r.name || "").toLowerCase().includes(query) ||
        (r.cuisine || "").toLowerCase().includes(query) ||
        (r.category || "").toLowerCase().includes(query)
    );

    renderPage(filtered);
}

document.getElementById("searchBtn").addEventListener("click", searchRecipes);
document.getElementById("searchInput").addEventListener("keypress", e => {
    if (e.key === "Enter") searchRecipes();
});

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Favorite management
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(id) {
    let favorites = getFavorites();
    id = String(id);

    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        alert("Removed from favorites");
    } else {
        favorites.push(id);
        alert("Added to favorites ❤️");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderPage(); // Refresh buttons to reflect favorite changes
}

init();

// Show only favorite recipes
function showFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        alert("No favorite recipes yet!");
        return;
    }

    const favoriteRecipes = allRecipes.filter(r => favorites.includes(String(r.id)));
    currentPage = 1;
    renderPage(favoriteRecipes);
}

