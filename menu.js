// Utility function to capitalize first letters
function capitalizeFirstLetter(string) {
    return string
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Function to dynamically generate the categories
function generateCategories(menuByCategory) {
    const sectionElement = document.querySelector("main > section");
    const navLinks = document.querySelector(".nav-links");

    // Clear existing content (optional, if running multiple times)
    sectionElement.innerHTML = "";
    navLinks.innerHTML = "";

    // Iterate through categories
    Object.keys(menuByCategory).forEach(category => {
        // Add link to navigation bar
        const navLink = document.createElement("a");
        navLink.href = `#${category}`;
        navLink.textContent = capitalizeFirstLetter(category.replace("-", " "));
        navLinks.appendChild(navLink);

        // Create the article element
        const article = document.createElement("article");
        article.id = category;

        // Add category title
        const title = document.createElement("h2");
        title.textContent = capitalizeFirstLetter(category.replace("-", " ")); // Beautify title
        article.appendChild(title);

        // Add a horizontal rule
        const hr = document.createElement("hr");
        article.appendChild(hr);

        // Add the list of items
        const ul = document.createElement("ul");
        menuByCategory[category].forEach(item => {
            const listItem = document.createElement("li");
            const nameSpan = document.createElement("span");
            const valueSpan = document.createElement("span");

            nameSpan.textContent = item.name;
            valueSpan.textContent = `${item.value.toFixed(2)} €`;

            listItem.appendChild(nameSpan);
            listItem.appendChild(valueSpan);
            ul.appendChild(listItem);
        });
        article.appendChild(ul);

        // Add the category image
        const img = document.createElement("img");
        img.src = `assets/menu-items/${category}.jpg`;
        img.alt = category;
        img.loading = "lazy";
        article.appendChild(img);

        // Append the article to the section
        sectionElement.appendChild(article);
    });

    // Add event listeners to the navigation links
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            const navLinks = document.querySelector(".nav-links");
            const hamburger = document.querySelector(".hamburger");
            navLinks.classList.remove("active");
            hamburger.classList.remove("open");
        });
    });
}

// CSV Parser
function parseCSV(csvText) {
    const rows = csvText.trim().split("\n");
    const headers = rows.shift().split(";");
    return rows.map(row => {
        const values = row.split(";");
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
}

// Load and Parse CSV File
async function loadMenuFromCSV(filePath) {
    const response = await fetch(filePath);
    const csvText = await response.text();
    const menuData = parseCSV(csvText);

    // Organize items by category dynamically
    const menuByCategory = {};
    menuData.forEach(item => {
        const category = item.category.toLowerCase();
        if (!menuByCategory[category]) {
            menuByCategory[category] = [];
        }
        menuByCategory[category].push({
            name: item.name,
            value: parseFloat(item.value.replace(",", "."))
        });
    });

    // Generate categories dynamically
    generateCategories(menuByCategory);
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    // Load menu from CSV file
    loadMenuFromCSV("menu.csv");

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    // Toggle menu visibility
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("open");
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("open");
        });
    });
});
