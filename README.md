# Blog Application

A full-stack web application that allows users to create, view, and interact with blog posts. The application features two separate interfaces—one for authors to create and manage posts and another for readers to view posts, leave comments, and engage with content.

# Link to Project
Link to Reader: https://cosmic-shortbread-e51ae5.netlify.app
Link to Author: https://amazing-alfajores-f6b45b.netlify.app

# How It’s Made
Tech Used: React, Node.js, Express, Prisma ORM, PostgreSQL

This Blog Application leverages React for the front-end, split into two separate user experiences—one for authors and one for readers. The Node.js and Express backend serves a REST API and connects to a PostgreSQL database, managed by Prisma ORM.

Author Dashboard: A React-based interface for authors to create, edit, and manage blog posts.
Reader Interface: A separate React front-end where users can browse blog posts, leave comments, and view content details.

# Features 
## User Roles
Author: Can create, edit, and manage blog posts.
Reader: Can view blog posts and submit comments.

## Frontend Features
Author Dashboard: Includes a post editor with rich-text capabilities, allowing authors to create, update, and delete posts.
Reader Interface: Readers can view posts, leave comments, and interact with blog content.

## Backend Features
REST API: Handles CRUD operations for blog posts, user comments, and user authentication.
Prisma ORM: Manages the PostgreSQL database, including schema migrations and data relationships.
Authentication & Authorization: Role-based access controls ensure authors and readers have the right level of access.
Data Validation: Implements error handling for secure data processing.

# Implementation Details
Backend Server: Built with Node.js and Express. The server defines API endpoints for managing posts, comments, and user roles, as well as user authentication and authorization.

Database: Prisma ORM and PostgreSQL store user data, posts, and comments. Each post and comment has relationships that connect it to the respective user.

Authentication: User roles are authenticated with JWT tokens, providing secure, role-based access control across the application.

# Lessons Learned
Building this blog application provided extensive experience with React for a multi-interface project and highlighted the importance of creating a seamless user experience for different user types. Working with Prisma ORM and PostgreSQL also reinforced database schema design principles and data relationships. Role-based access control provided a strong foundation in managing secure, scalable features.

