import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Article from './pages/Article';
import Category from './pages/Category';
import Admin from './pages/Admin';
import About from './pages/About';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<Article />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/about" element={<About />} />
      <Route path="/hq-login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
