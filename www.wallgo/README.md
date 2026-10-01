# WallGo 🚀

<p align="center">
  <b>A modern full-stack web application for sharing moments, preserving time capsules, and connecting in real-time.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## 📌 About WallGo
**WallGo** is a feature-rich full-stack web platform designed to capture and share life's memories. Whether it's posting everyday updates, locking away memories in **Time Capsules** for the future, or engaging in real-time conversations, WallGo delivers a seamless, high-performance user experience.

---

## ✨ Core Features
- **Smart Posts & Feed**: Share and explore interactive media feeds with instant updates.
- **Time Capsules**: Seal messages, photos, and media to be unlocked at a specific future date.
- **Real-time Chat**: Connect with other users instantly through a responsive messaging interface.
- **Secure Authentication**: Robust user management and session handling.
- **AI-Powered Enhancements**: Automated image analysis, captioning, and metadata generation.

---

## 🛠️ Tech Stack

### **Backend (`/api.wallgo`)**
- **Framework**: Laravel 11 (PHP 8.4)
- **Database**: PostgreSQL
- **Environment**: Laravel Herd / Composer

### **Frontend (`/www.wallgo`)**
- **Library**: React with TypeScript
- **Styling**: Tailwind CSS / SCSS
- **State & Routing**: React Router, TanStack Query / Redux Toolkit

---

## 📁 Project Architecture

```text
wallgo_project/
├── api.wallgo/          # Laravel 11 Backend API
│   ├── app/
│   ├── database/
│   └── routes/
└── www.wallgo/          # React Frontend Application
    ├── src/
    │   ├── assets/      # Images, icons, and styles
    │   ├── components/  # Reusable UI components
    │   ├── layouts/     # Application layouts
    │   ├── pages/       # Main views (Feed, Capsule, Messages, Auth)
    │   └── router/      # Route configurations
    └── package.json