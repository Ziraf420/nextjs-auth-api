import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db';

const SECRET = process.env.JWT_SECRET || 'secretbanget';

export async function POST(req: Request) {
  try {
    // Cek Content-Type untuk menentukan format data
    const contentType = req.headers.get('content-type');
    
    let email: string;
    let password: string;
    
    if (contentType?.includes('application/json')) {
      // Data dalam format JSON
      const jsonData = await req.json();
      email = jsonData.email;
      password = jsonData.password;
    } else {
      // Data dalam format FormData
      const formData = await req.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
    }

    if (!email || !password) {
      return NextResponse.json({ 
        statusCode: 403,
        message: 'Email atau password tidak boleh kosong' 
      }, { status: 403 });
    }

    const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    
    if (!user) {
      return NextResponse.json({ 
        statusCode: 404, 
        message: 'Email tidak ditemukan' 
      }, { status: 404 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ 
        statusCode: 403, 
        message: 'Password salah' 
      }, { status: 403 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
    await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    delete user.password;
    user.token = token;
    
    return NextResponse.json({ 
      statusCode: 200,
      message: 'Login sukses', 
      user 
    }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      statusCode: 500,
      message: 'Terjadi kesalahan server' 
    }, { status: 500 });
  }
}
