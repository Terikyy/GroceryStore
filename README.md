# GroceryStore

An **Online Grocery Store** built using **PHP**, **JavaScript**, **CSS**, and **HTML** as part of **Assignment 1** for POTI 2025 at UTS.

## Technology Stack

- **Frontend**:
    - **HTML**: Structure of the web pages.
    - **CSS**: Styling and layout.
    - **JavaScript**: Interactivity and dynamic content.

- **Backend**:
    - **PHP**: Server-side scripting and business logic.
    - **MySQL**: Database management (via XAMPP phpMyAdmin).

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- XAMPP installed (includes Apache, PHP, and MySQL).
- Access to phpMyAdmin to import the database.
- A browser to access the application.

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Terikyy/GroceryStore.git
   ```
2. Move into the project directory:
   ```bash
   cd GroceryStore
   ```
3. Place the project in your server's document root (e.g., `htdocs` for XAMPP).

4. Start XAMPP and enable **Apache** and **MySQL**.

5. Access phpMyAdmin:
    - Open your browser.
    - Navigate to `http://localhost/phpmyadmin`.

6. Set up the database:
    - Create a new database (e.g., `grocery_store`).
    - Import the provided database export file (`database.sql`) into the newly created database.

7. Update the database configuration in `src/db.php` to match your local setup:
   ```php
   <?php
   $host = "localhost";
   $user = "root"; // default user for XAMPP
   $password = ""; // default password for XAMPP
   $database = "grocery_store";

   $connection = new mysqli($host, $user, $password, $database);

   if ($connection->connect_error) {
       die("Connection failed: " . $connection->connect_error);
   }
   ?>
   ```

8. Start your web server and access the project in your browser at:
   ```
   http://localhost/GroceryStore/public/index.html
   ```

## Project Structure

```
GroceryStore/
├── public/                         # Publicly accessible files
│   ├── css/                        # Stylesheets
│   │   ├── base/                   # Base CSS files
│   │   ├── components/             # Component-specific styles
│   │   ├── layout/                 # Layout styles
│   │   ├── checkout.css            # Checkout styles
│   │   ├── confirmation.css        # Confirmation styles
│   │   └── index.css               # Landing page styles
│   ├── images/                     # Images and other media
│   ├── js/                         # JavaScript files
│   │   ├── modules/                # Modularized JS code
│   │   │   ├── checkout/           # Checkout-specific modules
│   │   │   └── index/              # Index-specific modules
│   │   ├── checkout.js             # Script for checkout page
│   │   └── index.js                # Script for index page
│   ├── checkout.html               # Checkout page
│   ├── confirmation.html           # Confirmation page
│   └── index.html                  # Landing page
├── src/                            # Backend PHP scripts
│   ├── api.php                     # API endpoints
│   └── db.php                      # Database connection
├── db_export.sql                   # Database export file
└── README.md                       # Project documentation
```

---
