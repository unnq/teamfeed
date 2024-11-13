async function loadPosts() {
    try {
        const response = await fetch("/posts/getPosts");
        const posts = await response.json();
        console.log(posts); // Check if each post object contains `iduserposts`


        const postsContainer = document.getElementById("postsContainer");

        posts.forEach(post => {
            // Create HTML elements for each post
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            const title = document.createElement("h2");
            title.innerText = post.title;
            postElement.appendChild(title);

            const body = document.createElement("p");
            body.innerText = post.body;
            postElement.appendChild(body);

            
            // Create a link for the username that points to the specific post page
            const usernameLink = document.createElement("a");
            usernameLink.href = `/post/${post.iduserposts}`; // Link to individual post page
            usernameLink.classList.add("username");
            usernameLink.innerText = `Posted by ${post.username}`;
            postElement.appendChild(usernameLink);
            
            
            //Old username line
            // const username = document.createElement("span");
            // username.classList.add("username");
            // username.innerText = `Posted by ${post.username}`;
            // postElement.appendChild(username);

            const date = document.createElement("span");
            date.classList.add("date");
            date.innerText = ` on ${new Date(post.date).toLocaleString()}`;
            postElement.appendChild(date);

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

// Load posts when the page loads
window.onload = loadPosts;
