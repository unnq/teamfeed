console.log("submitPost.js is loaded");

document.getElementById("postForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    const postData = { title, body, date: new Date().toISOString() };

    try {
        const response = await fetch("/posts/submitPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        const result = await response.json();
        document.getElementById("message").innerText = result.message;
    } catch (error) {
        console.error("Error submitting post:", error);
    }
});
