import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraphHome } from './routes/GraphHome';
import { TopicPage } from './routes/TopicPage';
import { NotePage } from './routes/NotePage';
import { About } from './routes/About';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="font-display text-7xl font-semibold tracking-tight text-text-primary mb-2">
          ESE 2030
        </h1>
        <p className="font-display text-2xl italic text-text-secondary mb-1">
          Linear Algebra: Essence &amp; Form
        </p>
        <p className="font-mono text-sm text-text-tertiary mt-4 mb-12">
          v0.1 &middot; scaffold
        </p>
        <motion.button
          onClick={() => navigate('/graph')}
          className="
            px-8 py-3
            font-sans font-semibold text-sm tracking-widest uppercase
            text-accent bg-transparent
            border border-border-glow rounded
            glow-cyan
            cursor-pointer
            transition-all duration-300
            hover:bg-bg-elevated hover:text-accent-bright
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base
          "
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          ENTER
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Landing />} />
        <Route path="/graph"        element={<GraphHome />} />
        <Route path="/concept/:id"  element={<TopicPage />} />
        <Route path="/note/:id"     element={<NotePage />} />
        <Route path="/about"        element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
