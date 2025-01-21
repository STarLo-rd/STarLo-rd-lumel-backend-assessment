# Lumel - Backend Assessment

[Assessment Requirements](https://lumel.notion.site/Backend-Assessment-9e74ff128174464ab0f5f376bd1043e8
)

Backend assessment solution built with **Node.js**, **Express**, and **MongoDB**. The system implements CSV data handling, database normalization, automated refresh mechanisms, and REST APIs for analyzing sales data according to the provided requirements.
---

## **Getting Started**

### **Prerequisites**

- **Node.js** (v16 or above)
- **Yarn** (for dependency management)
- **MongoDB** (local or remote instance)

---

### **Setup and Run**

1. Clone the repository:

   ```bash
   git clone https://github.com/STarLo-rd/lumel-backend-assessment
   cd lumel-backend-assessment
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file and configure the following:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/lumel
   DEFAULT_CSV_PATH=sales_data.csv
   ```

4. Start the application:

   ```bash
   yarn dev
   ```

5. Run tests:
   ```bash
   yarn test
   ```

---

## **API Endpoints**

### **Health Check**

| Route     | Method | Body | Description          | Sample Response      |
| --------- | ------ | ---- | -------------------- | -------------------- |
| `/health` | GET    | None | Checks server health | `{ "status": "ok" }` |

---

### **Data Management**

| Route            | Method | Body                             | Description                      | Sample Response                                                                                  |
| ---------------- | ------ | -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/api/load-data` | POST   | `{ "filePath": "path/to/file" }` | Loads CSV data into the database | `{ "message": "Data loading completed", "stats": { "recordsProcessed": 100, "errorCount": 0 } }` |

---

### **Analytics**

| Route                                     | Method | Query Params                                           | Description                             | Sample Response                                                                                   |
| ----------------------------------------- | ------ | ------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/api/analytics/top-products`             | GET    | `limit` (optional), `startDate`, `endDate`             | Gets top-selling products               | `[ { "productId": "123", "name": "Product A", "category": "Category A", "totalQuantity": 150 } ]` |
| `/api/analytics/top-products-by-category` | GET    | `category` (required), `limit`, `startDate`, `endDate` | Gets top-selling products in a category | `[ { "productId": "123", "name": "Product A", "category": "Category A", "totalQuantity": 120 } ]` |
| `/api/analytics/top-products-by-region`   | GET    | `region` (required), `limit`, `startDate`, `endDate`   | Gets top-selling products in a region   | `[ { "productId": "456", "name": "Product B", "region": "Region x", "totalQuantity": 90 } ]`      |

---

## **Example Requests**

### **Health Check**

```bash
GET /health
```

**Response:**

```json
{ "status": "ok" }
```

---

### **Load Data**

```bash
POST /api/load-data

Body:
{
  "filePath": "path/to/your/file.csv"
}
```

**Response:**

```json
{
  "message": "Data loading completed",
  "stats": {
    "recordsProcessed": 100,
    "errorCount": 0
  }
}
```

---

### **Get Top Products**

```bash
GET /api/analytics/top-products?limit=5&startDate=2025-01-21&endDate=2025-02-07
```

**Response:**

```json
[
  {
    "productId": "P123",
    "name": "Product 1",
    "category": "Electronics",
    "totalQuantity": 150
  }
]
```

---
