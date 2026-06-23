import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <Navbar />
      
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-20">
        <h1 className="text-9xl font-black mb-4 tracking-tighter text-gray-900">404</h1>
        <h2 className="text-3xl font-bold mb-6 uppercase tracking-wider">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md text-lg">The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.</p>
        <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors shadow-lg inline-block">
          Return to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
