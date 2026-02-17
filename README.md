# Full-Stack Web App: Role-Based SPA Prototype
Developer: Ian Francis M. Loyola

# Tech Stack: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5

# Project Overview
This project is a high-fidelity, Build-From-Scratch "Full-Stack" prototype. It simulates a real-world web application environment using only frontend technologies. It features a custom routing engine, a simulated authentication system, and a local persistence layer to manage accounts, employee data, and user requests.

# Key Features
Role-Based Access Control (RBAC): UI changes dynamically based on whether you are an Admin or a User.

# Single Page Architecture: Smooth navigation between sections without page reloads using JavaScript routing.

Mock Backend: Uses localStorage to save your data, meaning your added employees and requests stay there even if you refresh the page.

Responsive Design: Built with Bootstrap 5 to ensure it looks great on both desktops and mobile devices.

# Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: Bootstrap 5

Storage: Browser LocalStorage API

# Bug Fixes & Improvements
Modal Backdrop Fix: Implemented a cleanup routine in the showPage function to prevent the "dark screen" error when navigating away from modals.

UI Consistency: Standardized bold typography and alert boxes to improve readability and user experience.

# Folder Structure
index.html - The main entry point and UI structure.

style.css - Custom styling and mobile responsiveness.

script.js - The "brain" of the app (routing, logic, and storage).
