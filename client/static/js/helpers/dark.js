const $darkModeButton = document.getElementById('darkModeButton');
const $bodyElement = document.body;

// Check for users preference
if (localStorage.getItem('darkMode') === 'enabled') {
    activateDarkMode();
}

// ---------------- CHANGE TO DARK/LIGHT MODE -------------------------------------------------------------------------------------------------------------
export function changeToDarkMode() {
    $darkModeButton.addEventListener('click', () => {
        if ($bodyElement.classList.contains('dark')) {
            disableDarkMode();
        } else {
            activateDarkMode();
        }
    })
}

function activateDarkMode() {
    $darkModeButton.classList.add('dark-mode');
    $bodyElement.classList.add('dark');
    // Store user preference
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    $darkModeButton.classList.remove('dark-mode');
    $bodyElement.classList.remove('dark');
    // Update user preference
    localStorage.setItem('darkMode', null);
}