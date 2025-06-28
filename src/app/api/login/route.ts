import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db';

const SECRET = process.env.JWT_SECRET || 'secretbanget';

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: 'Password salah' }, { status: 401 });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
  await db.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

  delete user.password;
  return NextResponse.json({ message: 'Login sukses', token, user });
}
