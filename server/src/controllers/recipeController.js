const fsp = require('fs/promises');
const path = require('path');
const { v4: generateRandomId } = require('uuid');

// ---------------- REUSED FUNCTIONS ----------------------------------------------------------------------------------------------------------------------
// Set status to 500 and show error message
function showErrorMessage(response, error) {
    return response.status(500).json({
        message: error.message
    })
}

// Get the recipes from the file
async function getRecipesFromFile(filePath) {
    try {
        const data = await fsp.readFile(filePath);
        return JSON.parse(data);
    } catch (error) {
        return `Lezen en/of parsen van het bestand niet gelukt: ${error.message}`
    }
};

// Upload the edited file again
async function uploadRecipesToFile(filePath, recipes) {
    try {
        return await fsp.writeFile(filePath, JSON.stringify(recipes, null, 4));
    } catch (error) {
        return `Het bestand updaten is niet gelukt: ${error.message}`
    }
};

// ---------------- RECIPES FILEPATH ----------------------------------------------------------------------------------------------------------------------
const recipesFilePath = path.join(__dirname, '..', 'data', 'recipes.json');

// ---------------- GET RECIPES ---------------------------------------------------------------------------------------------------------------------------
async function getRecipes(request, response) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        const value = request.query.filter;
        if (value) {
            const filteredRecipes = recipes.filter(recipe => {
                return (
                    recipe.title.toLowerCase().includes(value.toLowerCase()) ||
                    recipe.category.toLowerCase().includes(value.toLowerCase())
                )
            });
            // Give back the filtered recipes
            response.json(filteredRecipes);
        } else {
            // No filter parameter? return all recipes
            response.json(recipes);
        }
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- GET A RECIPE --------------------------------------------------------------------------------------------------------------------------
async function getRecipe(request, response) {
    try {
        // Get the recipe id from the request parameters
        const {id} = request.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id (only if it exist)
        const recipe = recipes.find((recipe) => recipe.id == id);
        if (recipe === undefined) {
            response.status(404)
            response.send(`Geen recept gevonden met de id:${id}`)
        }
        // Give back the recipe with the correct id
        response.json(recipe);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- ADD RECIPE ----------------------------------------------------------------------------------------------------------------------------
async function addRecipe(request, response) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Push the new recipe to the rest of the recipes (only if the body is not empty en there is no id)
        if (Object.keys(request.body).length === 0) {
            response.status(400)
            response.send('Gelieve een recept mee te geven!')
        } else if ("id" in request.body) {
            response.status(403)
            response.send('Je hebt geen toestemming om een id mee te geven!')
        }
        recipes.push({
            ...request.body,
            id: generateRandomId()
        })

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, recipes);
        response.send(`Nieuwe recept met naam ${request.body.title} is toegevoegd.`);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- EDIT RECIPE ---------------------------------------------------------------------------------------------------------------------------
async function editRecipe(request, response) {
    try {
        // Get the recipe id from the request parameters
        const {id} = request.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id (only if it exist)
        const recipeIndex = recipes.findIndex((recipe) => recipe.id == id);
        if (recipeIndex === -1) {
            response.status(404)
            response.send(`Geen recept gevonden met de id:${id}`)
        }
        // Replace the old recipe with the new updated
        recipes[recipeIndex] = {
            ...recipes[recipeIndex],
            ...request.body
        };

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, recipes);
        response.send(`Recept updated met id: ${id}!`);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- REMOVE RECIPE -------------------------------------------------------------------------------------------------------------------------
async function removeRecipe(request, response) {
    try {
        // Get the recipe id from the request parameters
        const {id} = request.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id and filter it out
        const filteredRecipes = recipes.filter((recipe) => recipe.id != id);
        // If the array is still the same length then no recipe was deleted
        if (filteredRecipes.length === recipes.length) {
            response.status(404)
            response.send(`Geen recept gevonden met de id:${id} om te verwijderen`)
        }

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, filteredRecipes);
        response.send(`Recept met id:${id} is verwijdert.`);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ================ EXCELEREN =============================================================================================================================
// ---------------- GET CATEGORIES ------------------------------------------------------------------------------------------------------------------------
async function getCategories(request, response) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique categories
        const categories = [...new Set(recipes.map(recipe => recipe.category))];
        // Give back the recipes categories (only if they exist)
        if (categories.length === 0) {
            response.status(404)
            response.send('Geen categorieën gevonden');
        }
        response.json(categories);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- GET INGREDIENTS -----------------------------------------------------------------------------------------------------------------------
async function getIngredients(request, response) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique ingredients
        const ingredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.name)))];
        // Give back the recipes ingredients (only if they exist)
        if (ingredients.length === 0) {
            response.status(404)
            response.send('Geen ingrediënten gevonden');
        }
        response.json(ingredients)
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- GET DIFFICULTY LEVELS -----------------------------------------------------------------------------------------------------------------
async function getDifficultyLevels(request, response) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique difficultyLevels
        const difficultyLevels = [...new Set(recipes.map(recipe => recipe.difficulty))];
        // Give back the recipes difficultyLevels
        if (difficultyLevels.length === 0) {
            response.status(404)
            response.send('Geen moeilijkheidsgraden gevonden');
        }
        response.json(difficultyLevels);
    } catch (error) {
        showErrorMessage(response, error);
    }
};

// ---------------- EXPORT MODULES ------------------------------------------------------------------------------------------------------------------------
module.exports = {
    getRecipes,
    getRecipe,
    addRecipe,
    editRecipe,
    removeRecipe,
    getCategories,
    getIngredients,
    getDifficultyLevels,
}