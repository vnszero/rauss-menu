# RaussTuna's Bar Menu

This is a online menu for RaussTuna's bar that dynamically generates menu categories and items based on a CSV file.

## How It Works

The application dynamically reads data from a CSV file, organizes it by categories, and generates a complete menu with navigation and category-specific images.

### CSV File Structure

The menu data must be provided in a CSV file with the following structure:

```csv
category;name;value
starter;Salada;3.0
drinks;Cerveja;3.5
desserts;Gelado;4.0
```

category: The category of the item (e.g., starter, drinks, desserts).
name: The name of the menu item (e.g., Salada, Cerveja, Gelado).
value: The price of the item (use a decimal point for floating values).

### Image Naming
Each category must have a corresponding image file named as follows:

```bash
assets/menu-items/{category}.jpg
```

For example:
assets/menu-items/starter.jpg

### Folder Structure
Ensure the following folder structure is in place:

```bash
project/
│
├── assets/
│   ├── menu-items/
│   │   ├── starter.jpg
│   │   ├── drinks.jpg
│   │   ├── desserts.jpg
│   │   └── (other category images)
│   └── store/
│       └── logo.png
├── menu.csv
├── menu.js
├── styles.css
├── index.html
└── README.md
```

### Getting Started

1. Place Your CSV File
Add the menu.csv file to the root directory of the project.

2. Add Category Images
Save images for each category in the assets/menu-items/ directory, ensuring their names match the category IDs.

3. Run the Project
Open index.html in your browser to see the dynamically generated menu.

### Features
- Dynamic category and menu item generation based on the CSV file.
- Auto-updated navigation bar reflecting all categories in the CSV.
- Lazy loading of images for performance optimization.
- Fully responsive design, compatible with both desktop and mobile devices.