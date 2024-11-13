// auth.js - Shared authentication code for login check

async function checkLoginStatus() {
    try {
        const response = await fetch('http://localhost:3000/user-info', {
            credentials: 'include' // Sends cookies with the request
        });

        if (response.ok) {
            const data = await response.json();
            const welcomeMessage = document.getElementById("welcomeMessage");
            const loggedInContent = document.getElementById("loggedInContent");
            const guestContent = document.getElementById("guestContent");

            // Update welcome message if element is present on the page
            if (welcomeMessage) welcomeMessage.textContent = `Welcome to the site, ${data.username}`;
            
            // Show logged-in content if available
            if (loggedInContent) loggedInContent.style.display = "block";
            if (guestContent) guestContent.style.display = "none";
        } else {
            // Show guest content if available
            const guestContent = document.getElementById("guestContent");
            if (guestContent) guestContent.style.display = "block";
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        // If there's an error, default to showing guest content
        const guestContent = document.getElementById("guestContent");
        if (guestContent) guestContent.style.display = "block";
    }
}

// Automatically check login status on page load
window.addEventListener("load", checkLoginStatus);
