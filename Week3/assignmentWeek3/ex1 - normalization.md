# Exercise 1: SQL Normalization – Dinner Club

## Step 1: Violation of 1NF (First Normal Form)

**1NF Rule**: Each field must contain only **atomic** (indivisible) values.

### ❌ Violations of 1NF:
- **`food_code`** and **`food_description`** contain **multiple values** separated by commas (e.g., `"C1, C2"`, `"Curry, Cake"`).
- **`dinner_date`** has **inconsistent formats** (e.g., `"2020-03-15"`, `"20-03-2020"`, `"Mar 25 '20"`), violating domain consistency.

---

## Step 2: Recognized Entities

Based on the table, we can identify the following entities:

1. **Member** – identified by `member_id`.
2. **Dinner** – identified by `dinner_id`.
3. **Venue** – identified by `venue_code`.
4. **Food** – identified by `food_code`.
5. **Dinner Participation** – mapping between members and dinners (many-to-many).
6. **Dinner Food** – mapping between dinners and foods served (many-to-many).

---

## Step 3: 3NF-Compliant Tables and Attributes

### 1. **Members**
| Column Name     | Type        |
|-----------------|-------------|
| member_id (PK)  | INTEGER     |
| member_name     | TEXT        |
| member_address  | TEXT        |

---

### 2. **Venues**
| Column Name         | Type    |
|---------------------|---------|
| venue_code (PK)     | TEXT    |
| venue_description   | TEXT    |

---

### 3. **Dinners**
| Column Name     | Type      |
|-----------------|-----------|
| dinner_id (PK)  | TEXT      |
| dinner_date     | DATE      |
| venue_code (FK) | TEXT      |

---

### 4. **Foods**
| Column Name        | Type    |
|--------------------|---------|
| food_code (PK)     | TEXT    |
| food_description   | TEXT    |

---

### 5. **Dinner_Participation** (Many-to-Many: members attend multiple dinners)
| Column Name        | Type    |
|--------------------|---------|
| member_id (FK)     | INTEGER |
| dinner_id (FK)     | TEXT    |

**Primary Key**: (member_id, dinner_id)

---

### 6. **Dinner_Food** (Many-to-Many: dinners serve multiple foods)
| Column Name        | Type    |
|--------------------|---------|
| dinner_id (FK)     | TEXT    |
| food_code (FK)     | TEXT    |

**Primary Key**: (dinner_id, food_code)

---

## Summary of Normalization

- The **original table** violates **1NF** due to multi-valued fields and inconsistent formats.
- We **decomposed** the table into **six 3NF-compliant tables** by:
  - Ensuring atomicity of values,
  - Removing transitive and partial dependencies,
  - Isolating repeating groups into separate relations.