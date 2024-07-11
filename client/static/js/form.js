// ---------------- API URL -------------------------------------------------------------------------------------------------------------------------------
const API_URL = 'http://localhost:8989/api/recipes';

// ---------------- IMPORT --------------------------------------------------------------------------------------------------------------------------------
import { postData } from './helpers/post.js';
import { changeToDarkMode } from './helpers/dark.js';

// ---------------- ELEMENTS ------------------------------------------------------------------------------------------------------------------------------
const $formContent = document.getElementById('form');
const $addRecipeFormElement = document.getElementById('addRecipe');

// ---------------- HANDLE FORM ---------------------------------------------------------------------------------------------------------------------------
function handleFormSubmit($form) {
    const formData = new FormData($form);
    // Get all the data from the form
    const recipeTitle = formData.get('title');
    const recipeCategory = formData.get('category');
    const recipeIngredients = formData.get('ingredients');
    // Parse ingredients input for the json
    const recipeIngredientsArray = recipeIngredients.split('\n').map(function (line) {
        const parts = line.split(': ');
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

    postData(API_URL, recipe).then(
        (onFulfilled) => {
            $formContent.innerHTML = ''
            $formContent.innerHTML = `
            <p class="feedback">Recept: <strong>"${recipeTitle}"</strong> addition successful!</p>
            <a class="cta" href="../recipeForm.html">Another recipe?</a>
            `
        },
        (onRejected) => {
            $formContent.innerHTML = ''
            $formContent.innerHTML = `
            <p class="feedback">Recept: <strong>"${recipeTitle}"</strong> addition failed!</p>
            <a class="cta" href="../recipeForm.html">Try again?</a>
            `
        }
    )
};

function submitEvent($form) {
    $form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        handleFormSubmit($form);
    })
};

// ---------------- INITIALIZE APPLICATION ----------------------------------------------------------------------------------------------------------------
// Start the application
async function initialize () {
    submitEvent($addRecipeFormElement);
    // Change to dark mode
    changeToDarkMode();
};

// Call the function for the application
initialize();