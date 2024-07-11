// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'http://localhost:8989/api/';

// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { fetchData } from './helpers/fetch.js';
import { renderData } from './helpers/rendering/recipes.js';
import { renderCategories } from './helpers/rendering/categories.js';
import { changeToDarkMode } from './helpers/dark.js';

// ---------------- ELEMENTS ------------------------------------------------------------------------------------------------------------------------------
const $recipesElement = document.getElementById('recipes');
const $searchBar = document.getElementById('recipeQuery');
const $categoriesElement = document.getElementById('categories');
const $resetButton = document.getElementById('resetFilters');

// ---------------- FILTER ON CATEGORY --------------------------------------------------------------------------------------------------------------------
function filterRecipesByCategory(recipes, selectedCategory) {
    return recipes.filter((recipe) => recipe.category === selectedCategory)
};

function removeActiveCateogry() {
    const $previouslyActiveCategory = document.querySelector('.category--active');
    if ($previouslyActiveCategory) {
        $previouslyActiveCategory.classList.remove('category--active');
    }
}

function resetRecipesFitlter(data) {
    $resetButton.addEventListener('click', () => {
        removeActiveCateogry()
        renderData($recipesElement, data);
    });
};

function showFilteredRecipes(data) {
    // Add click event listener to each category button
    const $categoryButtons = document.querySelectorAll('.category');
    $categoryButtons.forEach(($categoryButton) => {
        $categoryButton.addEventListener('click', () => {
            removeActiveCateogry()
            $categoryButton.classList.add('category--active');
            const selectedCategory = $categoryButton.dataset.category; // Assuming data-category attribute contains the category value
            const filteredRecipes = filterRecipesByCategory(data, selectedCategory);
            // Show the filtered recipes
            renderData($recipesElement, filteredRecipes);
        });
    });
    // Reset the applied filter
    resetRecipesFitlter(data);
};

// ---------------- SCROLL DOWN ---------------------------------------------------------------------------------------------------------------------------
function scrollEvents() {
    const $scrollDownElement = document.getElementById('scrollDown');
    $scrollDownElement.addEventListener('click', () => {
        $categoriesElement.scrollBy(0, 150);
    });
};

// ---------------- GET URL PARAMS ------------------------------------------------------------------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const filterValue = urlParams.get('filter');

// ---------------- CHANGE INPUT VALUE --------------------------------------------------------------------------------------------------------------------
function changeInputValue(value) {
    return $searchBar.value = value;
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
async function initialize () {
    fetchData(`${API_URL}categories`, data => {
        // Show all categories
        renderCategories($categoriesElement, data);
    });
    fetchData(`${API_URL}recipes?filter=${filterValue}`, data => {
        if (filterValue !== null) { // filterValue is given and not null
            if (data.length === 0) { // Found no recipe as match for the filterValue
                return $recipesElement.innerHTML = `
                <p>No results for <strong>"${filterValue}"</strong></p>
                `
            } else { // Recipes found for the filterValue
                // Render the filtered recipes
                renderData($recipesElement, data)
                // Show filtered recipes
                showFilteredRecipes(data)
            }
        } else { // No filter given?
            // Show al the recipes
            fetchData(`${API_URL}recipes`, data => {
                renderData($recipesElement, data)
                // Show filtered recipes
                showFilteredRecipes(data)
            })
        }
    });
    // Change to dark mode
    changeToDarkMode();
    // Show the filterValue in the input field
    changeInputValue(filterValue)
    // Scroll down the categories
    scrollEvents()
};

// Call the function for the application
initialize();