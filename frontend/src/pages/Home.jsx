import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, GitFork, ArrowRight, Loader2, Sparkles, Cpu, Database, MessageCircle, FileText, Network, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import UniverseBackground from '../components/UniverseBackground';
import { useTheme } from '../context/ThemeContext';

// ── Animated Section Component ──
function AnimatedSection({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 80, rotateX: 8 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ── 3D Card Component ──
function Card3D({ children, className = '' }) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouse = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotateX(-y * 15);
        setRotateY(x * 15);
    };

    return (
        <div
            className={`perspective-container ${className}`}
            onMouseMove={handleMouse}
            onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
        >
            <motion.div
                animate={{ rotateX, rotateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {children}
            </motion.div>
        </div>
    );
}



// ── FEATURES DATA ──
const FEATURES = [
    { icon: Cpu, title: 'AI-Powered Analysis', description: 'GPT-4 breaks down architecture, identifies patterns, and explains complex logic like a senior dev.', color: '#4facfe' },
    { icon: Database, title: 'Local Vector Search', description: 'FAISS stores embeddings locally. Your code never leaves your machine. Fast similarity retrieval.', color: '#a855f7' },
    { icon: MessageCircle, title: 'RAG-Powered Q&A', description: 'Ask anything. Context-aware retrieval ensures answers are grounded in your actual codebase.', color: '#f093fb' },
    { icon: FileText, title: 'README Generator', description: 'Auto-generate a structured README with features, installation, usage, and folder structure.', color: '#00f2fe' },
    { icon: Network, title: 'Architecture Diagrams', description: 'Mermaid.js flowcharts visualize module relationships, data flow, and entry points.', color: '#f5576c' },
    { icon: Sparkles, title: 'Tech Stack Detection', description: 'Automatically identifies frameworks, languages, dependencies, and dev tools used in the project.', color: '#fbbf24' },
];

// ── MAIN HOME COMPONENT ──
export default function Home() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Parallax transforms
    const heroY = useTransform(smoothProgress, [0, 0.3], [0, -150]);
    const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.85]);
    const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
    const orbScale = useTransform(smoothProgress, [0, 0.5], [1, 1.5]);
    const orbRotate = useTransform(smoothProgress, [0, 1], [0, 180]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard', { state: { repoUrl: url } });
        }, 1500);
    };

    return (
        <div ref={containerRef} className="relative noise-overlay">
            {isDark && <UniverseBackground />}
            {!isDark && <div className="light-bg-pattern" />}

            {/* ══════════ PROGRESS BAR ══════════ */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-[100] origin-left"
                style={{ scaleX: smoothProgress }}
            />

            {/* ══════════ HERO SECTION ══════════ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated orbs */}
                <motion.div className="orb w-[600px] h-[600px] bg-blue-600 top-[-200px] left-[-200px]" style={{ scale: orbScale, rotate: orbRotate }} />
                <motion.div className="orb w-[500px] h-[500px] bg-purple-600 bottom-[-150px] right-[-150px]" style={{ scale: orbScale, rotate: orbRotate }} />
                <motion.div className="orb w-[300px] h-[300px] bg-pink-500 top-[40%] left-[60%]" style={{ scale: orbScale }} />

                <motion.div
                    style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            Powered by GPT-4 + FAISS Vector Search
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <span className="block">Understand</span>
                        <span className="block gradient-text">Any Codebase</span>
                        <span className="block text-5xl md:text-7xl font-light mt-2" style={{ color: 'var(--text-muted)' }}>in Seconds.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Paste a GitHub URL. Get a senior developer's architectural breakdown,
                        auto-generated README, interactive diagrams, and AI-powered Q&A.
                    </motion.p>

                    {/* ── INPUT FORM ── */}
                    <motion.form
                        initial={{ opacity: 0, y: 40, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        onSubmit={handleSubmit}
                        className="max-w-2xl mx-auto"
                    >
                        <Card3D>
                            <div className="animated-border rounded-2xl">
                                <div className="glass-strong rounded-2xl p-2 flex items-center gap-2">
                                    <div className="pl-4 text-gray-500">
                                        <GitFork className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://github.com/username/repository"
                                        className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-600 p-3 font-mono"
                                        style={{ color: 'var(--text-primary)' }}
                                        required
                                        pattern="https://github.com/.*"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !url}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg shadow-purple-500/20"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                                        ) : (
                                            <><span>Analyze</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Card3D>
                    </motion.form>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="flex flex-col items-center gap-2 text-gray-500 text-sm"
                        >
                            <span>Scroll to explore</span>
                            <ChevronDown className="w-5 h-5" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════════ FEATURES SECTION ══════════ */}
            <section className="relative py-32 px-6 grid-bg">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            Everything you need to <span className="gradient-text-cyan">decode a repo</span>.
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            From cloning to conversation — a complete AI pipeline for codebase understanding.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, i) => (
                            <AnimatedSection key={i} delay={i * 0.1}>
                                <Card3D>
                                    <div className="feature-card glass rounded-2xl p-8 h-full cursor-default" style={{ transformStyle: 'preserve-3d' }}>
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                                            style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                                        >
                                            <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                                        <p className="leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                                    </div>
                                </Card3D>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ HOW IT WORKS ══════════ */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="orb w-[400px] h-[400px] bg-cyan-500 top-[20%] right-[-100px]" />

                <div className="max-w-5xl mx-auto">
                    <AnimatedSection className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            How it <span className="gradient-text">works</span>.
                        </h2>
                    </AnimatedSection>

                    <div className="space-y-24">
                        {[
                            { step: '01', title: 'Clone & Filter', desc: 'The backend clones the repository using a shallow git fetch, then intelligently filters out binaries, build artifacts, and vendor files.', align: 'left' },
                            { step: '02', title: 'Chunk & Embed', desc: 'Source code is split into semantic chunks (150-300 lines), then each chunk is converted into a high-dimensional vector using OpenAI embeddings.', align: 'right' },
                            { step: '03', title: 'Index in FAISS', desc: 'All embeddings are stored in a local FAISS vector index for blazing-fast similarity search. Your code never leaves your machine.', align: 'left' },
                            { step: '04', title: 'Retrieve & Generate', desc: 'When you ask a question, the most relevant code chunks are retrieved and passed as context to GPT-4, ensuring accurate, grounded responses.', align: 'right' },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={0.1}>
                                <div className={`flex items-center gap-12 ${item.align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center">
                                            <span className="text-4xl font-black gradient-text">{item.step}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CTA SECTION ══════════ */}
            <section className="relative py-32 px-6">
                <AnimatedSection className="max-w-4xl mx-auto text-center">
                    <Card3D>
                        <div className="animated-border rounded-3xl">
                            <div className="glass-strong rounded-3xl px-12 py-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                    Ready to decode your next repo?
                                </h2>
                                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                                    Stop reading code line by line. Let AI give you the full picture.
                                </p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                                >
                                    Get Started →
                                </button>
                            </div>
                        </div>
                    </Card3D>
                </AnimatedSection>
            </section>

            {/* ══════════ FOOTER ══════════ */}
            <footer className="border-t py-8 px-6" style={{ borderColor: 'var(--border)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span>© Sagnik</span>
                </div>
            </footer>
        </div>
    );
}
