# ⚖️ Lawyer Management System

<p align="center">
  <img src="https://img.shields.io/badge/Project-Lawyer%20Management%20System-0A66C2?style=for-the-badge" alt="Project">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

<p align="center">
  <b>A modern digital platform for managing lawyers, clients, cases, appointments, and communication.</b>
</p>

---
### 📸 Screenshots Section 1 ###

<table width="100%">images/a113.png
    <tr>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a11.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a10.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a111.png title="Ai " /></td>
</tr>
 <tr>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a112.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a113.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a113.png title="Ai " /></td>
</tr> 
<tr>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a114.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a115.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a12.png title="Ai " /></td>
</tr> 
<tr>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a13.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a14.png title="Ai " /></td>
        <td width="33%"><img alt="Screenshot of Lawyer management system "src=images/a15.png title="Ai " /></td>
</tr>
</table>


## 📌 About The Project

The **Lawyer Management System** is a web-based application designed to simplify and digitize the interaction between **clients and lawyers**.

The platform provides a centralized system where clients can discover lawyers, view their profiles, book appointments, communicate through messaging, and manage their legal cases.

Lawyers can manage their profiles, clients, appointments, cases, and messages through a dedicated dashboard.

---

## ✨ Key Features

### 👤 Client Management

* Client registration and login
* Client profile management
* Search and browse lawyers
* View lawyer profiles
* Lawyer specialization information
* Book appointments
* Manage appointments
* View case information
* Send messages to lawyers
* Receive lawyer replies
* Notifications
* Appointment and case history

### ⚖️ Lawyer Management

* Lawyer registration and login
* Professional lawyer profile
* Specialization and experience
* Consultation fee management
* Availability management
* Client management
* Appointment management
* Case management
* Client-to-lawyer messaging
* Notifications
* Dashboard statistics

### 💬 Messaging System

* Client → Lawyer messaging
* Lawyer → Client replies
* Conversation history
* Message timestamps
* Read/unread status
* Unread message notifications
* Secure client-lawyer conversations

### 📅 Appointment Management

* Book lawyer appointments
* View upcoming appointments
* Appointment status
* Accept/reject appointments
* Appointment history
* Lawyer availability

### 📁 Case Management

* Create and manage legal cases
* Case status tracking
* Client-case relationship
* Lawyer-case relationship
* Case history
* Case details and updates

### 🔐 Authentication & Security

* Client authentication
* Lawyer authentication
* Role-based access
* Protected dashboards
* Secure data access
* Separate client and lawyer information

### 📊 Dashboard

The system provides separate dashboards for:

**Admin**

* Total lawyers
* Total clients
* Total cases
* Total appointments
* System statistics

**Lawyer**

* Clients
* Cases
* Appointments
* Messages
* Notifications

**Client**

* Lawyers
* Appointments
* Cases
* Messages
* Notifications

---

## 🛠️ Tech Stack

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| 🌐 HTML5          | Website structure              |
| 🎨 CSS3           | Styling & responsive UI        |
| ⚡ JavaScript      | Frontend functionality         |
| ⚛️ React.js       | User interface                 |
| 🟢 Node.js        | Backend runtime                |
| 🚂 Express.js     | Backend/API                    |
| 🗄️ MongoDB       | Database                       |
| 🔑 Authentication | User security                  |
| 📡 REST API       | Frontend–backend communication |

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      CLIENT          │
                    │  Web / Mobile UI     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FRONTEND        │
                    │ React / HTML / CSS   │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │       BACKEND        │
                    │ Node.js + Express    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      DATABASE        │
                    │       MongoDB        │
                    └──────────────────────┘
```

---

## 👥 User Roles

### 👨‍💼 Admin

The administrator can manage the overall system, users, lawyers, appointments, and system information.

### ⚖️ Lawyer

Lawyers can manage their professional profile, clients, cases, appointments, and messages.

### 👤 Client

Clients can search for lawyers, book appointments, manage cases, and communicate with lawyers.

---

## 📂 Project Structure

```text
Lawyer-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── screenshots/
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/lawyer-management-system.git
```

### 2️⃣ Navigate to the Project

```bash
cd lawyer-management-system
```

### 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4️⃣ Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 5️⃣ Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 6️⃣ Start Backend

```bash
npm run dev
```

### 7️⃣ Start Frontend

```bash
cd ../frontend
npm run dev
```

Open the local development URL shown by your frontend server.

---

## 🧑‍⚖️ Demo Data

The project can be populated with demo users for testing.

### Lawyers

**50 demo lawyer accounts**

### Clients

**50 demo client accounts**

Demo data can include:

* Profiles
* Specializations
* Appointments
* Cases
* Messages
* Notifications

> ⚠️ All demo users and information should be fictional and used only for development/testing.

---

## 💬 Client → Lawyer Communication

The system provides direct communication between clients and lawyers.

```text
Client
   │
   │ Send Message
   ▼
Lawyer
   │
   │ Reply
   ▼
Client

Each conversation is associated with the authenticated client and lawyer.
## 👨‍💻 Development Team

| Name                | Enrollment No. | Role                          |
| ------------------- | -------------- | ----------------------------- |
| **Bhilare Sarvesh** | `240860131012` | Developer / Project Developer |
| **Ritesh Bitode**   | `240860131013` | Team Member                   |
| **Taufeek Khan**    | `240860131058` | Team Member                   |
| **PASWAN ABHISHEK** | `250863131004` | Team Member                   |


### 🤝 Team

> This project was developed collaboratively by the above team members as a **Lawyer Management System** project.

---

## 🔮 Future Enhancements

* 📱 Dedicated mobile application
* 🤖 AI-powered legal assistant
* 📄 Digital document management
* 🔔 Real-time notifications
* 🎥 Video consultation
* 💳 Online consultation payments
* 📑 Digital legal document signing
* 🔎 Advanced lawyer search and filtering
* 🌐 Multi-language support
* ☁️ Cloud deployment
* 📊 Advanced analytics
* 🔐 Two-factor authentication

---

## 🎯 Project Objectives

* Digitize lawyer-client interactions
* Simplify appointment management
* Improve case management
* Provide secure communication
* Reduce manual paperwork
* Centralize lawyer and client information
* Improve accessibility of legal services

---

## 📜 License

This project is developed for **educational and demonstration purposes**.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

<p align="center">
  <b>⚖️ Lawyer Management System</b><br>
  <i>Connecting Clients with Legal Professionals</i>
</p>
