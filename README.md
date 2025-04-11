# VeriCart 🛒🚀  
A **lightweight e-commerce API** built with **Node.js, Express, MongoDB**, and **RabbitMQ** for real-time messaging.  
VeriCart handles **user authentication, product management, order processing, and RabbitMQ-based notifications**.

---

## **📌 Features**
- 🍽️ **Product Management**: Create, retrieve, and update product listings.
- 📝 **Order Processing**: Users can place orders, and orders are validated.
- 🔑 **User Authentication**: Secure login & JWT-based authentication.
- 📩 **RabbitMQ Messaging**: Order notifications using RabbitMQ queues.
- 🛋️ **MongoDB Database**: Stores users, products, and orders.
- 🐳 **Dockerized Setup**: Runs using **Docker Compose**.

---

## **⚡ Tech Stack**
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Queue Processing**: RabbitMQ (via `amqplib`)
- **Containerization**: Docker & Docker Compose

---

## **🛠 Setup & Installation**
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/yourusername/VeriCart.git
cd VeriCart
```

### **2️⃣ Setup environment variables**
Create a `.env` file and configure:
```env
MONGO_URI=mongodb://vericart-mongodb-1:27017/vericart
JWT_SECRET=my_secret_key
RABBITMQ_HOST=vericart-rabbitmq-1
```

### **3️⃣ Start the application (Dockerized)**
```sh
docker compose up --build --force-recreate -d
```

This starts:
- **MongoDB** (`vericart-mongodb-1`)
- **RabbitMQ** (`vericart-rabbitmq-1`)
- **API Server** (`vericart-api-1`)

---

## **🛠 API Endpoints**
### **🔑 Authentication**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| POST   | `/register`   | Register a new user |
| POST   | `/login`      | Login & receive JWT |

### **🍽️ Products**
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| GET    | `/api/products`   | Get all products |
| POST   | `/api/products`   | Add a new product (Admin) |

### **🛋️ Orders**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | `/api/orders` | View all orders (Admin) |
| POST   | `/api/orders` | Place a new order |

---

## **💼 RabbitMQ Messaging**
- **Queue**: `order_notifications`
- **When an order is placed**, it is **published to RabbitMQ**, and a **consumer listens** for order processing.

---

## **🐳 Docker Commands**
Check running containers:
```sh
docker ps
```
View logs:
```sh
docker logs vericart-api-1 --tail=50
```
Restart a container:
```sh
docker restart vericart-api-1
```

---

## **📌 To-Do / Next Steps**
✅ **Integrate Admin Panel for Order Management**  
✅ **Enhance RabbitMQ Message Processing**  
🔲 **Add Payment Gateway (Stripe, PayPal, etc.)**  
🔲 **Improve Order Tracking with WebSockets**  

---

## **📝 Author**
👤 **Yusuf Nimrod**  
💎]  

---

## **📜 License**
This project is **open-source** and available under the **MIT License**.

