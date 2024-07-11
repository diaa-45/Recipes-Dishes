// ---------------- FETCH THE DATA ------------------------------------------------------------------------------------------------------------------------
export async function fetchData(url, callback) {
    try {
        const response = await fetch(url);
        switchResponseStatus(response, callback);
    } catch (error) {
        console.error(error.message);
    }
};

// ---------------- DISPLAY ERROR MESSAGE -----------------------------------------------------------------------------------------------------------------
export function displayErrorMessage(message) {
    const mainElement = document.getElementById('main');
    mainElement.textContent = message;
};

// ---------------- SWITCH STATEMENT ----------------------------------------------------------------------------------------------------------------------
export async function switchResponseStatus(response, callback) {
    switch (response.status) {
        case 200:
            const data = await response.json();
            callback(data)
            break;
        case 404:
            displayErrorMessage('Recipe not found.');
            break;
        case 400:
                displayErrorMessage('Please provide a recipe!');
            break;
        case 403:
            displayErrorMessage('You do not have permission to perform this action!');
            break;
        default:
            throw new Error('Something went wrong with the API.');
    };
};