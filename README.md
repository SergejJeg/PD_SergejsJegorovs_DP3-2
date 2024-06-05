# Project Setup Guide

This guide will walk you through setting up a project and running the server.

# Tools used for development

- HTML
- CSS
- JavaScript
- Laragon
- VSCode

## Prerequisites

- MySQL
- Node.js

## Step 1: Download and run the database. 

Unzip library-backend.zip in Website folder. Open Laragon and import database.sql file. In the server.js on lines 21 and 22 change user and password to mach your Laragon user and password if required.

## Step 2: Run the server.

Open Command Prompt and run the following command in your project directory:
```
node server.js
```

## Step 3:

## 5 Test cases
| **Test Case ID** | **File**   | **Method**            | **Test Description**                                             | **Expected Outcome**                                             | **Result** |
|------------------|------------------|-----------------------|------------------------------------------------------------------|------------------------------------------------------------------|------------|
| TC01             | tests.js         | testSignUp            | Verify that sign up endpoint adds user in database | The method should return success response and add user into database | Passed |
| TC02             | tests.js         | testLogin            | Verify that login endpoint gives access to the user account | The method should return success response and give access to the account | Passed |
| TC03             | tests.js         | createGenre            | Verify that create genre endpoint adds genre in database | The method should return success response and add genre into database | Passed |
| TC04             | tests.js         | testGetUserData            | Verify that user endpoint adds user in database | The method should return success response with user data from database | Passed |
| TC05             | tests.js         | testUpdatePassword            | Verify that change password endpoint changes user password | The method should return success response and change user password in database | Passed |
