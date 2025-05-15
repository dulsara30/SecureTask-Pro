
# SecureTask Pro 🔐

SecureTask Pro is a full-stack task management web app built with the **MERN stack** (MongoDB, Express.js, React, Node.js) + TypeScript and Vite.  
This project was created as a learning and practice ground to deeply understand modern **web security techniques**, **API protection**, and how to defend apps from **injection attacks**, **XSS**, **CSRF**, and other hacker-related vulnerabilities.

---

## 🚀 Tech Stack

### 💻 Frontend
- Vite + React + TypeScript
- Tailwind CSS
- Axios
- React Router
- DOMPurify for XSS sanitization

### 🔧 Backend
- Express.js + Node.js + TypeScript
- MongoDB (Mongoose)
- JWT Auth in HttpOnly Secure Cookies
- Helmet.js, express-rate-limit, cors
- express-validator for input validation

---

## 🔐 Security Features Practiced

- **XSS protection** using DOMPurify  
- **CSRF protection** using SameSite cookie flags  
- **NoSQL Injection prevention**  
- **JWT stored in HttpOnly, Secure cookies**  
- **Role-based access control**  
- **Rate limiting**, **CORS**, and **Helmet headers**  

---

## ⚙️ Dev vs Production Modes

This project uses `process.env.NODE_ENV` to toggle features:
- 🧪 Dev mode: relaxed security for testing, allows HTTP, no secure cookies
- 🔐 Production: enables `secure`, `httpOnly`, `sameSite=strict`, and requires HTTPS

---

## 💡 Purpose

> This project was built not just to create a task manager — but to **gain hands-on experience with secure web application development** using modern technologies and best practices.  
> Every implementation in this app is a step toward understanding **real-world hacker defenses** and writing **clean, secure, production-level code**.

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/SecureTask-Pro.git
````

### 2. Install dependencies

```bash
# Backend
cd SecureTask-Pro/server
npm install

# Frontend
cd ../securetask-pro-frontend
npm install
```

### 3. Setup environment variables

Create `.env` files in both `/server` and `/securetask-pro-frontend` directories.

Example `.env` for backend:

```env
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Start development servers

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../securetask-pro-frontend
npm run dev
```

---

## 🙏 Acknowledgements

* [DOMPurify](https://github.com/cure53/DOMPurify)
* [Express](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [JWT](https://jwt.io/)
* And all the legends of Stack Overflow & GitHub 😎

---

## 🧠 Author

* **Name:** \[Dulsara Manakal]
* **GitHub:** [@dulsara30](https://github.com/dulsara30)

---

## 📘 License

This project is for educational use only.
You are free to fork, study, and improve it for learning purposes.

---

````
