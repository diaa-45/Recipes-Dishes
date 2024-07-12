const fsp = require('fs/promises');
const path = require('path');
const { v4: generateRandomId } = require('uuid');

// ---------------- REUSED FUNCTIONS ----------------------------------------------------------------------------------------------------------------------
// Set status to 500 and show error message
function showErrorMessage(res, error) {
    return res.status(500).json({
        message: error.message
    })
}

// Get the recipes from the file
async function getRecipesFromFile(filePath) {
    try {
        const data = await fsp.readFile(filePath);
        return JSON.parse(data);
    } catch (error) {
        return `there is error ${error.message}`
    }
};

// Upload the edited file again
async function uploadRecipesToFile(filePath, recipes) {
    try {
        return await fsp.writeFile(filePath, JSON.stringify(recipes, null, 4));
    } catch (error) {
        return `Error ${error.message}`
    }
};

// ---------------- RECIPES FILEPATH ----------------------------------------------------------------------------------------------------------------------
const recipesFilePath = path.join(__dirname, '..', 'data', 'recipes.json');

// ---------------- GET RECIPES ---------------------------------------------------------------------------------------------------------------------------
async function getRecipes(req, res) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        const value = req.query.filter;
        if (value) {
            const filteredRecipes = recipes.filter(recipe => {
                return (
                    recipe.title.toLowerCase().includes(value.toLowerCase()) ||
                    recipe.category.toLowerCase().includes(value.toLowerCase())
                )
            });
            // Give back the filtered recipes
            res.json(filteredRecipes);
        } else {
            // No filter parameter? return all recipes
            res.json(recipes);
        }
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- GET A RECIPE --------------------------------------------------------------------------------------------------------------------------
async function getRecipe(req, res) {
    try {
        // Get the recipe id from the req parameters
        const {id} = req.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id (only if it exist)
        const recipe = recipes.find((recipe) => recipe.id == id);
        if (recipe === undefined) {
            res.status(404)
            res.send(`No recipes with ID: ${id}`)
        }
        // Give back the recipe with the correct id
        res.json(recipe);
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- ADD RECIPE ----------------------------------------------------------------------------------------------------------------------------
async function addRecipe(req, res) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Push the new recipe to the rest of the recipes (only if the body is not empty en there is no id)
        if (Object.keys(req.body).length === 0) {
            res.status(400)
            res.send('There is no recipes , add recipes please ')
        } else if ("id" in req.body) {
            res.status(403)
            res.send('You do not have permission to provide an ID')
        }
        recipes.push({
            ...req.body,
            id: generateRandomId()
        })

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, recipes);
        res.send(`New recipe with name ${req.body.title} has been added.`);
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- EDIT RECIPE ---------------------------------------------------------------------------------------------------------------------------
async function editRecipe(req, res) {
    try {
        // Get the recipe id from the req parameters
        const {id} = req.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id (only if it exist)
        const recipeIndex = recipes.findIndex((recipe) => recipe.id == id);
        if (recipeIndex === -1) {
            res.status(404)
            res.send(`No recipe found with id: ${id}`)
        }
        // Replace the old recipe with the new updated
        recipes[recipeIndex] = {
            ...recipes[recipeIndex],
            ...req.body
        };

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, recipes);
        res.send(`Recipe updated with id: ${id}!`);
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- REMOVE RECIPE -------------------------------------------------------------------------------------------------------------------------
async function removeRecipe(req, res) {
    try {
        // Get the recipe id from the req parameters
        const {id} = req.params;
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Find recipe with given id and filter it out
        const filteredRecipes = recipes.filter((recipe) => recipe.id != id);
        // If the array is still the same length then no recipe was deleted
        if (filteredRecipes.length === recipes.length) {
            res.status(404)
            res.send(`No recipe found with id:${id} to delete`)
        }

        // Upload the edited file again
        await uploadRecipesToFile(recipesFilePath, filteredRecipes);
        res.send(`Recept met id:${id} is verwijdert.`);
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ================ EXCELEREN =============================================================================================================================
// ---------------- GET CATEGORIES ------------------------------------------------------------------------------------------------------------------------
async function getCategories(req, res) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique categories
        const categories = [...new Set(recipes.map(recipe => recipe.category))];
        // Give back the recipes categories (only if they exist)
        if (categories.length === 0) {
            res.status(404)
            res.send('No categories found');
        }
        res.json(categories);
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- GET INGREDIENTS -----------------------------------------------------------------------------------------------------------------------
async function getIngredients(req, res) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique ingredients
        const ingredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.name)))];
        // Give back the recipes ingredients (only if they exist)
        if (ingredients.length === 0) {
            res.status(404)
            res.send('No ingredients found');
        }
        res.json(ingredients)
    } catch (error) {
        showErrorMessage(res, error);
    }
};

// ---------------- GET DIFFICULTY LEVELS -----------------------------------------------------------------------------------------------------------------
async function getDifficultyLevels(req, res) {
    try {
        // Get the recipes from the file
        const recipes = await getRecipesFromFile(recipesFilePath);
        // Extract unique difficultyLevels
        const difficultyLevels = [...new Set(recipes.map(recipe => recipe.difficulty))];
        // Give back the recipes difficultyLevels
        if (difficultyLevels.length === 0) {
            res.status(404)
            res.send('No difficulty Levels found');
        }
        res.json(difficultyLevels);
    } catch (error) {
        showErrorMessage(res, error);
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