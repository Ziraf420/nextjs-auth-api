import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = formData.get('token') as string;

  if (!token) return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 400 });

  await db.query('UPDATE users SET token = NULL WHERE token = ?', [token]);

  return NextResponse.json({ message: 'Logout berhasil' });
}
