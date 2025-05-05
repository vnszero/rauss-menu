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

    // Clear existing content
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
        article.classList.add("custom-article");
        article.id = category;

        // Add category title
        const title = document.createElement("h2");
        title.textContent = capitalizeFirstLetter(category.replace("-", " ")); // Beautify title
        article.appendChild(title);

        // Add the category image
        const img = document.createElement("img");
        img.src = `assets/menu-items/${category}.jpg`;
        img.alt = category;
        img.loading = "lazy";
        article.appendChild(img);

        // Add the list of items
        const ul = document.createElement("ul");
        ul.classList.add("custom-list");
        menuByCategory[category].forEach(item => {
            const listItem = document.createElement("li");
            const groupContainer = document.createElement("span");
            const nameSpan = document.createElement("span");
            const valueSpan = document.createElement("span");

            groupContainer.classList.add("value-action-group");

            nameSpan.textContent = item.name;
            valueSpan.textContent = `${item.value.toFixed(2)} €`;

            // Action container (edit + delete)
            const actionContainer = document.createElement("span");
            actionContainer.classList.add("admin-only");
            actionContainer.style.marginLeft = "10px";

            const editIcon = document.createElement("img");
            editIcon.src = "assets/store/edit.png";
            editIcon.alt = "Editar";
            editIcon.classList.add("icon", "edit-item");
            editIcon.style.cursor = "pointer";
            editIcon.style.marginRight = "8px";

            // Add listener
            editIcon.addEventListener("click", () => {
                openEditModal(item);
            });

            const deleteIcon = document.createElement("img");
            deleteIcon.src = "assets/store/delete.png";
            deleteIcon.alt = "Deletar";
            deleteIcon.classList.add("icon", "delete-item");
            deleteIcon.style.cursor = "pointer";

            actionContainer.appendChild(editIcon);
            actionContainer.appendChild(deleteIcon);

            // Append spans to the list item
            listItem.appendChild(nameSpan);
            groupContainer.appendChild(valueSpan);
            groupContainer.appendChild(actionContainer);
            listItem.appendChild(groupContainer);

            ul.appendChild(listItem);
        });
        article.appendChild(ul);

        // Append the article to the section
        sectionElement.appendChild(article);
    });

    // Collapse menu on nav link click
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelector(".nav-links").classList.remove("active");
            document.querySelector(".hamburger").classList.remove("open");
        });
    });
}

async function loadMenuFromFirestore() {
    const menuData = [];
    db.collection('menu').onSnapshot(snapshot => {
        const menuData = []; // Clear previous data on every snapshot

        snapshot.forEach(doc => {
            const data = doc.data();
            menuData.push({
                id: doc.id,
                name: data.name,
                value: parseFloat(data.value),
                category: data.category.toLowerCase()
            });
        });

        // Organize by category
        const menuByCategory = {};
        menuData.forEach(item => {
            const category = item.category;
            if (!menuByCategory[category]) {
                menuByCategory[category] = [];
            }
            menuByCategory[category].push(item);
        });

        generateCategories(menuByCategory);
    })
}

// CSV Parser
// function parseCSV(csvText) {
//     const rows = csvText.trim().split("\n");
//     const headers = rows.shift().split(";");
//     return rows.map(row => {
//         const values = row.split(";");
//         return headers.reduce((obj, header, index) => {
//             obj[header.trim()] = values[index].trim();
//             return obj;
//         }, {});
//     });
// }

// Load and Parse CSV File
// async function loadMenuFromCSV(filePath) {
//     const response = await fetch(filePath);
//     const csvText = await response.text();
//     const menuData = parseCSV(csvText);

//     // Organize items by category dynamically
//     const menuByCategory = {};
//     menuData.forEach(item => {
//         const category = item.category.toLowerCase();
//         if (!menuByCategory[category]) {
//             menuByCategory[category] = [];
//         }
//         menuByCategory[category].push({
//             name: item.name,
//             value: parseFloat(item.value.replace(",", "."))
//         });
//     });

//     // Generate categories dynamically
//     generateCategories(menuByCategory);
// }

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    // Load menu from CSV file
    // loadMenuFromCSV("menu.csv");

    // Load menu from Firestore
    loadMenuFromFirestore();

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
