import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    // Cek Content-Type untuk menentukan format data
    const contentType = req.headers.get('content-type');
    
    let token: string;
    
    if (contentType?.includes('application/json')) {
      // Data dalam format JSON
      const jsonData = await req.json();
      token = jsonData.token;
    } else {
      // Data dalam format FormData
      const formData = await req.formData();
      token = formData.get('token') as string;
    }

    if (!token) {
      return NextResponse.json({ 
        statusCode: 400,
        message: 'Token tidak ditemukan' 
      }, { status: 400 });
    }

    const result: any = await db.query('UPDATE users SET token = NULL WHERE token = ?', [token]);
    
    // Cek jika token valid (row affected)
    if (result[0] && result[0].affectedRows === 0) {
      return NextResponse.json({ 
        statusCode: 404,
        message: 'Token tidak valid atau user tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      statusCode: 200,
      message: 'Logout berhasil' 
    }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      statusCode: 500,
      message: 'Terjadi kesalahan server' 
    }, { status: 500 });
  }
}
