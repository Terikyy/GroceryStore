<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the database connection file
require_once 'db.php';

// Function to handle API routing
function handleRequest(): void
{
    $method = $_SERVER['REQUEST_METHOD'];
    $endpoint = $_GET['endpoint'] ?? '';

    try {
        switch ($endpoint) {
            case 'all-products':
                if ($method === 'GET') {
                    getAllProducts();
                }
                break;

            case 'product-by-name':
                if ($method === 'GET') {
                    getProductByName();
                }
                break;

            case 'products-by-category':
                if ($method === 'GET') {
                    getProductsByCategory();
                }
                break;

            case 'check-stock':
                if ($method === 'GET') {
                    checkProductStock();
                }
                break;

            case 'update-quantity':
                if ($method === 'POST') {
                    updateProductQuantity();
                }
                break;

            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// Get all products
function getAllProducts(): void
{
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM products");
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// Get product by name
function getProductByName(): void
{
    global $conn;
    $name = $_GET['name'] ?? '';

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(["error" => "Product name is required"]);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM products WHERE product_name LIKE ?");
    $searchName = "%$name%";
    $stmt->bind_param("s", $searchName);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// Get products by category
function getProductsByCategory(): void
{
    global $conn;
    $category = $_GET['category'] ?? '';

    if (empty($category)) {
        http_response_code(400);
        echo json_encode(["error" => "Category is required"]);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM products WHERE subcategory LIKE ?");
    $searchCategory = "%$category%";
    $stmt->bind_param("s", $searchCategory);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// Check product stock
function checkProductStock(): void
{
    global $conn;
    $productId = $_GET['product_id'] ?? '';

    if (empty($productId)) {
        http_response_code(400);
        echo json_encode(["error" => "Product ID is required"]);
        return;
    }

    $stmt = $conn->prepare("SELECT product_name, in_stock FROM products WHERE product_id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "product_name" => $row['product_name'],
            "in_stock" => $row['in_stock']
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Product not found"]);
    }
}

// Update product quantity
function updateProductQuantity(): void
{
    global $conn;

    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    $productId = $data['product_id'] ?? '';
    $quantityChange = $data['quantity_change'] ?? '';

    if (empty($productId) || $quantityChange === '') {
        http_response_code(400);
        echo json_encode(["error" => "Product ID and quantity change are required"]);
        return;
    }

    // Start a transaction
    $conn->begin_transaction();

    try {
        // First, check current stock
        $stmt = $conn->prepare("SELECT in_stock FROM products WHERE product_id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!($row = $result->fetch_assoc())) {
            throw new Exception("Product not found");
        }

        $currentStock = $row['in_stock'];
        $newStock = $currentStock - $quantityChange;

        if ($newStock < 0) {
            throw new Exception("Insufficient stock");
        }

        // Update stock
        $updateStmt = $conn->prepare("UPDATE products SET in_stock = ? WHERE product_id = ?");
        $updateStmt->bind_param("ii", $newStock, $productId);
        $updateStmt->execute();

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "old_stock" => $currentStock,
            "new_stock" => $newStock
        ]);
    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();

        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// Run the API
handleRequest();