// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'http://localhost:8989/api/recipes';

// ---------------- REQUIRE -------------------------------------------------------------------------------------------------------------------------------
import { fetchData } from './helpers/fetch.js';
import { renderDetailItem, renderEditDetailForm } from './helpers/rendering/recipes.js';
import { putData } from './helpers/put.js';
import { deleteData } from './helpers/delete.js';
import { changeToDarkMode } from './helpers/dark.js';

// ---------------- ELEMENTS ------------------------------------------------------------------------------------------------------------------------------
const $detailContent = document.getElementById('detail')
const $recipeDetailElement = document.getElementById('recipe-detail');
const $editRecipeElement = document.getElementById('editRecipe');
const $deleteRecipeElement = document.getElementById('deleteRecipe');


// ---------------- GET THE SELECTED ID -------------------------------------------------------------------------------------------------------------------
function getSelectedRecipeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

// ---------------- EDIT RECIPE ---------------------------------------------------------------------------------------------------------------------------
function showRecipeForm(recipe) {
    $editRecipeElement.addEventListener('click', () => {
        renderEditDetailForm($detailContent, recipe);

        // Edit the recipe when clicking on the submit button
        const $editRecipeFormElement = document.getElementById('editRecipe');
        submitEvent($editRecipeFormElement);
    });
};

function submitEvent($form) {
    $form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        handleFormSubmit($form);
    })
};

// ---------------- HANDLE FORM ---------------------------------------------------------------------------------------------------------------------------
function handleFormSubmit($form) {
    const formData = new FormData($form);
    // Get all the data from the form
    const recipeTitle = formData.get('title');
    const recipeCategory = formData.get('category');
    const recipeIngredients = formData.get('ingredients');
    // Parse ingredients input for the json
    const recipeIngredientsArray = recipeIngredients.split('\n').map(function (line) {
        const parts = line.split(', ');
        return {
            name: parts[0],
            amount: parts[1]
        };
    });
    const recipeInstructions = formData.get('instructions');
    const recipeCookingTime = formData.get('cookingTime');
    const recipeDifficulty = formData.get('difficulty');
    const recipeServings = formData.get('servings');

    let recipe = {
        title: recipeTitle,
        category: recipeCategory,
        ingredients: recipeIngredientsArray,
        instructions: recipeInstructions,
        cookingTime: recipeCookingTime,
        difficulty: recipeDifficulty,
        servings: recipeServings
    };

    putData(`${API_URL}/${getSelectedRecipeId()}`, recipe).then(
        (onFulfilled) => {
            $detailContent.innerHTML = ''
            $detailContent.innerHTML = `
            <p class="feedback">Recept: <strong>"${recipeTitle}"</strong> Adjustment successful!</p>
            `
        },
        (onRejected) => {
            $detailContent.innerHTML = ''
            $detailContent.innerHTML = `
            <p class="feedback">Recept: <strong>"${recipeTitle}"</strong> Adjustment failed!</p>
            <a class="cta" href="../index.html" role="button">Try again?</a>
            `
        }
    )
};

// ---------------- DELETE RECIPE -------------------------------------------------------------------------------------------------------------------------
async function deleteRecipe() {
    $deleteRecipeElement.addEventListener('click', async () => {
        // Ask for confirmation
        const confirmed = window.confirm('Are you sure the following recipe can be deleted?');
        if (confirmed) {
            // Delete the recipe
            await deleteData(`${API_URL}/${getSelectedRecipeId()}`);
            // Go back to home
            window.location.href = './';
        }
    });
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
async function initialize () {
    // Function to delete a recipe
    deleteRecipe();

    fetchData(`${API_URL}/${getSelectedRecipeId()}`, data => {
        // Show the recipe detail from the id
        renderDetailItem($recipeDetailElement, data);
        // Show recipe form
        showRecipeForm(data)
    });
    // Change to dark mode
    changeToDarkMode();
};

// Call the function for the application
initialize();