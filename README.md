Sure! Here's a concise **functional requirements document** for your "Shopping List" app. You can pass this to another LLM or use it as context in documentation, planning, or development prompts:

---

# 📝 Functional Requirements: Shopping List App (React Native + Expo)

## 1. **Overview**

A mobile application built with **React Native** using **Expo**, that allows users to manage a shopping list. The app supports manual product entry as well as barcode scanning. Data is stored locally using **SQLite**. The app is styled using **Material Design 3** principles.

---

## 2. **Core Functional Requirements**

### 2.1. Shopping List Management

- View a list of products to buy
- Add new product manually
- Add new product by scanning a barcode
- Mark product as purchased (checkbox)
- Delete product from the list

### 2.2. Data Persistence

- Store all items locally using **SQLite**
- Automatically create database table on first launch
- Persist checked/unchecked state of items across sessions

### 2.3. Barcode Scanning

- Use device camera to scan product barcodes
- Fill product name automatically using scanned barcode (or placeholder like "Product {code}")
- Request and handle camera permissions gracefully

### 2.4. User Interface

- Use components styled with **Material Design 3**
- Ensure mobile-friendly layout with:

    - List view
    - Add form with input and button(s)
    - Consistent buttons and colors

- Use `react-native-paper` or equivalent library

---

## 3. **Navigation**

- Use expo navigation with stack navigation
- Screens:

    - `ShoppingListScreen`: default screen, list of products
    - `AddItemScreen`: form and barcode scanner access

---

## 4. **Non-Functional Requirements**

- Should work fully offline (all logic and storage local)
- Compatible with Android (target device)
- Code written in JavaScript (React Native with Expo)
- Responsive performance for small data sets
- Use modern React features (e.g. hooks)

---

## 5. **Libraries & Tools**

`

- Expo CLI
- `expo-sqlite`
- `expo-barcode-scanner`
- `react-native-paper`
- `@react-navigation/native` & stack navigator

---
