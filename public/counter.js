let counterDisplayElem = document.querySelector('.counter-display');
let counterMinusElem = document.querySelector('.counter-minus');
let counterPlusElem = document.querySelector('.counter-plus');

let count = 0;

// Fetch the initial counter value from the server
fetch('/counter')
    .then(response => response.json())
    .then(data => {
        count = data.count;
        updateDisplay();
    })
    .catch(err => console.error('Error fetching counter:', err));

// Automatically increment the counter every second
setInterval(() => {
    fetch('/counter/increment', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            count = data.count;
            updateDisplay();
        })
        .catch(err => console.error('Error incrementing counter:', err));
}, 6000);

counterPlusElem.addEventListener("click", () => {
    count++;
    updateDisplay();
});

counterMinusElem.addEventListener("click", () => {
    count--;
    updateDisplay();
});

function updateDisplay() {
    counterDisplayElem.innerHTML = count;
}
