This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Setup

### MySQL Setup

1. Download dan install MySQL dari [situs resmi MySQL](https://dev.mysql.com/downloads/mysql/) atau menggunakan package manager:

```bash
# Ubuntu
sudo apt install mysql-server

# macOS dengan Homebrew
brew install mysql
```

2. Jalankan MySQL server:

```bash
# Ubuntu
sudo systemctl start mysql

# macOS
brew services start mysql
```

3. Masuk ke MySQL shell dan buat database:

```bash
mysql -u root -p
```

4. Di dalam MySQL shell, buat database baru:

```sql
CREATE DATABASE myapp_db;
USE myapp_db;
```

5. Buat tabel users:

```sql
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  token VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Konfigurasi Database

Proyek ini menggunakan koneksi database yang dikonfigurasi di file `src/app/lib/db.ts`. Sesuai konfigurasi saat ini:

```typescript
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'myapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
```

Anda dapat mengubah konfigurasi ini sesuai dengan pengaturan database lokal Anda. Untuk pengaturan yang lebih aman, Anda bisa menggunakan environment variables dengan membuat file `.env.local`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=myapp_db
JWT_SECRET=secret_key_anda
```

Kemudian ubah file `db.ts` menjadi:

```typescript
import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'myapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
```

### DBeaver Setup

[DBeaver](https://dbeaver.io/) adalah aplikasi client database universal yang dapat digunakan untuk mengelola MySQL database:

1. Download DBeaver dari [situs resmi DBeaver](https://dbeaver.io/download/)

2. Install dan jalankan DBeaver

3. Tambahkan koneksi database baru:
   - Klik pada "New Database Connection"
   - Pilih MySQL
   - Masukkan detail:
     - Server Host: localhost
     - Port: 3306 (default)
     - Database: myapp_db
     - Username: root (atau username yang Anda buat)
     - Password: root (atau password yang Anda gunakan)

4. Setelah terhubung, Anda dapat melihat dan mengelola tabel, menjalankan query, dan melakukan operasi database lainnya.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
