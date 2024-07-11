// ---------------- RENDER ONE RECIPE ---------------------------------------------------------------------------------------------------------------------
function renderItemContent(item) {
    return `
    <a href="./detail.html?id=${item.id}" class="recipe-teaser">
        <div class ="recipe-top">
            <h3>${item.title}</h3>
            <div class="quick-info">
                <p class="servings">${item.servings} pers.</p>
                <p class="cookingTime">${item.cookingTime} min.</p>
            </div>
        </div>
        <div class ="recipe-middle">
            <p class="ingredients"><strong>Needed:</strong> ${item.ingredients.map(ingredient => `<span>${ingredient.name}: ${ingredient.amount}</span>`).join(', ')}</p>
        </div>
        <div class ="recipe-bottom">
            ${item.difficulty === 'Easy' ? `<p class="difficulty"><img src="./static/img/easy.png" alt=""> ${item.difficulty}</p>` : ''}
            ${item.difficulty === 'Medium' ? `<p class="difficulty"><img src="./static/img/medium.png" alt=""> ${item.difficulty}</p>` : ''}
            ${item.difficulty === 'Hard' ? `<p class="difficulty"><img src="./static/img/hard.png" alt=""> ${item.difficulty}</p>` : ''}
            <button class="detail-link">Instructions</button>
        
        </div>
    </a>
    `
}

function renderRecipe($element, item) {
    $element.innerHTML += `
    ${renderItemContent(item)}
    `;
};

// ---------------- RENDER DETAIL RECIPE ------------------------------------------------------------------------------------------------------------------
export function renderDetailItem($element, item) {
    $element.innerHTML = '';
    $element.innerHTML += `
    <section href="./detail.html?id=${item.id}" class="recipe-detail">
        <div class="recipe-top">
            <div>
                <h1>${item.title}</h1>
                <p>Category: ${item.category}</p>
            </div>
            <button onclick="history.back()" class="go-back">Back</button>
        </div>
        <div class="recipe-detail__content">
            <div class="recipe-middle">
                <div class="ingredietns__wrapper">
                    <p><strong>What do you need?</strong></p> ${item.ingredients.map(ingredient => `<p>${ingredient.name}: ${ingredient.amount}</p>`).join('')}
                </div>
                <div class="instrcutions__wrapper">
                    <p class="instructions"><strong>Instrcuctions:</strong></p><p class="instructions">${item.instructions}</p>
                </div>
            </div>
            <div class="recipe-bottom">
                <p class="servings">For ${item.servings} people</p>
                <p class="cookingTime">Cooking time: ${item.cookingTime} minutes</p>
                ${item.difficulty === 'Easy' ? `<p class="difficulty"><img src="./static/img/easy.png" alt=""> ${item.difficulty}</p>` : ''}
                ${item.difficulty === 'Medium' ? `<p class="difficulty"><img src="./static/img/medium.png" alt=""> ${item.difficulty}</p>` : ''}
                ${item.difficulty === 'Hard' ? `<p class="difficulty"><img src="./static/img/hard.png" alt=""> ${item.difficulty}</p>` : ''}

            </div>
        </div>
    </section>
    `;
};

// ---------------- RENDER DETAIL RECIPE FORM -------------------------------------------------------------------------------------------------------------
export function renderEditDetailForm($element, item) {
    $element.innerHTML = '';
    $element.innerHTML = `
    <section class="form__wrapper" id="form">
        <div class="recipe-top">
            <h1>Edit recipe</h1>
            <a href="./detail.html?id=${item.id}" class="go-back go-back--cancel">Cancel</a>
        </div>
        <form class="form" id="editRecipe">
            <section class="form__top">
                <div>
                    <label for="recipeTitle"><strong>Recipe name</strong></label>
                    <input type="text" id="recipeTitle" name="title" value="${item.title}" maxlength="40" required>
                </div>
                <div>
                    <label for="recipeCategory"><strong>Category:</strong></label>
                    <input type="text" id="recipeCategory" name="category" value="${item.category}" maxlength="40" required>
                </div>
            </section>
            <section class="form__middle">
                <div>
                    <label for="recipeIngredients"><strong>Ingredient (ingredient: Quantity):</strong></label>
                    <textarea id="recipeIngredients" name="ingredients" required>${item.ingredients && item.ingredients.map(ingredient => `${ingredient.name}: ${ingredient.amount}`).join('\n')}</textarea>
                </div>
                <div>
                    <label for="recipeInstructions"><strong>Instructions (maximum 120 characters):</strong></label>
                    <textarea id="recipeInstructions" name="instructions" maxlength="120" required>${item.instructions}</textarea>
                </div>
            </section>
            <section class="form__bottom">
                <div>
                    <label for="recipeCookingTime"><strong>Cooking Time (in minuten):</strong></label>
                    <input type="number" id="recipeCookingTime" name="cookingTime" value="${item.cookingTime}" required>
                </div>
                <div>
                    <label for="recipeDifficulty"><strong>Difficulty level:</strong></label>
                    <select id="recipeDifficulty" name="difficulty" required>
                        <option value="Easy" ${item.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                        <option value="Medium" ${item.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="Hard" ${item.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>

                    </select>
                </div>
                <div>
                    <label for="recipeServings"><strong>For how many people:</strong></label>
                    <input type="number" id="recipeServings" name="servings" value="${item.servings}" required>
                </div>
                <button class="cta" type="submit">Submit</button>
            </section>
        </form>
    </section>
    `;
}

// ---------------- RENDER RECIPES ------------------------------------------------------------------------------------------------------------------------
export function renderData($element, recipes) {
    $element.innerHTML = '';
    recipes.forEach(recipe => {
        renderRecipe($element, recipe)
    });
};

// ---------------- RENDER RANDOM RECIPES -----------------------------------------------------------------------------------------------------------------
export function renderRandomData($element, recipes, amount) {
    // Shuffle the recipes (https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
    const shuffledRecipes = recipes.sort(() => Math.random() - 0.5);
    // Take the first 'amount' from the shuffled recipes array
    const randomRecipes = shuffledRecipes.slice(0, amount);
    $element.innerHTML = '';
    randomRecipes.forEach(recipe => {
        renderRecipe($element, recipe)
    });
}