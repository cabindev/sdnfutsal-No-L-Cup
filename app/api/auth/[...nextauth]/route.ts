import NextAuth from 'next-auth';
import authOptions from '@/app/lib/configs/auth/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

