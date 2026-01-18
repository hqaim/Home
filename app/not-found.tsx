import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030712',
      color: '#fff',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#06b6d4' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Intelligence Not Found</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/" style={{ padding: '0.8rem 1.5rem', background: '#06b6d4', borderRadius: '0.5rem', color: '#000', fontWeight: 'bold', textDecoration: 'none' }}>
          Return Home
        </Link>
        <a href="/contact" style={{ padding: '0.8rem 1.5rem', border: '1px solid #333', borderRadius: '0.5rem', color: '#fff', textDecoration: 'none' }}>
          Contact Support
        </a>
      </div>
    </div>
  );
}
