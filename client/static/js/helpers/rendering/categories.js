// ---------------- RENDER ONE CATEGORY -------------------------------------------------------------------------------------------------------------------
function renderCategory(item) {
    return `
    <button class="category" data-category="${item}">${item}</button>
    `;
};

// ---------------- RENDER CATEGORIES ---------------------------------------------------------------------------------------------------------------------
export function renderCategories($element, data) {
    $element.innerHTML = '';
    data.forEach(item => {
        const categoryHTML = renderCategory(item);
        $element.innerHTML += categoryHTML;
    });
};