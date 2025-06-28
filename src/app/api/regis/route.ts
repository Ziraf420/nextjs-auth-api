import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    // Cek semua headers untuk debugging
    const headers = Object.fromEntries(req.headers.entries());
    console.log('Request headers:', headers);
    
    // Cek Content-Type untuk menentukan format data
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    let fullname: string;
    let username: string;
    let email: string;
    let password: string;
    let category: string;
    
    // Buat salinan request untuk debugging
    const reqClone = req.clone();
    
    if (contentType?.includes('application/json')) {
      // Data dalam format JSON
      const jsonData = await req.json();
      console.log('Raw JSON data received:', jsonData);
      fullname = jsonData.fullname;
      username = jsonData.username;
      email = jsonData.email;
      password = jsonData.password;
      category = jsonData.category;
    } else {
      // Coba parse sebagai JSON dulu untuk debugging
      try {
        const textData = await reqClone.text();
        console.log('Raw request body as text:', textData);
        try {
          const jsonFromText = JSON.parse(textData);
          console.log('Parsed JSON from text:', jsonFromText);
        } catch (e) {
          console.log('Failed to parse as JSON, probably FormData');
        }
      } catch (e) {
        console.log('Failed to get request body as text');
      }
      
      // Data dalam format FormData
      try {
        const formData = await req.formData();
        console.log('FormData entries:', Array.from(formData.entries()));
        fullname = formData.get('fullname') as string;
        username = formData.get('username') as string;
        email = formData.get('email') as string;
        password = formData.get('password') as string;
        category = formData.get('category') as string;
      } catch (e) {
        console.error('Error parsing FormData:', e);
        return NextResponse.json({ 
          statusCode: 400,
          message: 'Format data tidak valid' 
        }, { status: 400 });
      }
    }

    console.log('Data yang diterima:', { fullname, username, email, password: '***', category });
  
    if (!email || !password) {
      console.log('Error: Field email atau password kosong');
      return NextResponse.json({ 
        statusCode: 403,
        message: 'Field email atau password kosong' 
      }, { status: 403 });
    }

    const [existing]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Hasil cek email:', existing);
    
    if (existing.length > 0) {
      console.log('Error: Email sudah terdaftar');
      return NextResponse.json({ 
        statusCode: 403,
        message: 'Email sudah terdaftar' 
      }, { status: 403 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (fullname, username, email, password, category) VALUES (?, ?, ?, ?, ?)',
      [fullname, username, email, hashed, category]
    );

    const [userRow]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRow[0];
    delete user.password;

    return NextResponse.json({ 
      statusCode: 200,
      message: 'Registrasi berhasil', 
      user 
    }, { status: 200 });
  } catch (error) {
    console.error('Error dalam proses registrasi:', error);
    return NextResponse.json({ 
      statusCode: 500,
      message: 'Terjadi kesalahan server' 
    }, { status: 500 });
  }
}
