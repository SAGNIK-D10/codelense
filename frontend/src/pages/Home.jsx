import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, GitFork, ArrowRight, Loader2, Sparkles, Cpu, Database, MessageCircle, FileText, Network, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import UniverseBackground from '../components/UniverseBackground';
import { useTheme } from '../context/ThemeContext';

// ── Animated Section ──
function AnimatedSection({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ── Services Data ──
const SERVICES = [
    { num: '01', title: 'Deep Code Analysis', icon: Cpu },
    { num: '02', title: 'Vector Search', icon: Database },
    { num: '03', title: 'RAG-Powered Q&A', icon: MessageCircle },
    { num: '04', title: 'Auto Documentation', icon: FileText },
];

// ── Features Data ──
const FEATURES = [
    {
        icon: Cpu,
        title: 'AI-Powered Analysis',
        description: 'GPT-4 breaks down architecture, identifies patterns, and explains complex logic like a senior developer would.',
    },
    {
        icon: Database,
        title: 'Local Vector Search',
        description: 'FAISS stores embeddings locally. Your code never leaves your machine. Lightning-fast similarity retrieval.',
    },
    {
        icon: MessageCircle,
        title: 'Contextual Q&A',
        description: 'Ask anything about the codebase. Context-aware retrieval ensures answers grounded in your actual code.',
    },
    {
        icon: Network,
        title: 'Architecture Diagrams',
        description: 'Mermaid.js flowcharts visualize module relationships, data flow, and entry points automatically.',
    },
    {
        icon: FileText,
        title: 'README Generator',
        description: 'Auto-generate structured README with features, installation, usage, and folder structure.',
    },
    {
        icon: Sparkles,
        title: 'Tech Stack Detection',
        description: 'Automatically identifies frameworks, languages, dependencies, and dev tools used in your project.',
    },
];

export default function Home() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

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

            {/* ═══ PROGRESS BAR ═══ */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 z-[100] origin-left"
                style={{ scaleX: smoothProgress }}
            />

            {/* ═══════════════════════════════════════════
                 HERO SECTION — Folioblox-style
            ═══════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    {/* Hero Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden"
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        {/* Warm glow behind the card */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                            <div className="absolute top-[-50%] left-[20%] w-[60%] h-[200%] opacity-30"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.6) 0%, rgba(139,105,20,0.3) 40%, transparent 70%)',
                                }}
                            />
                        </div>

                        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
                            {/* Left column */}
                            <div className="flex flex-col justify-center">
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-sm font-medium mb-4"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    AI-Powered Codebase Intelligence
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.7 }}
                                    className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <span className="block">Understand</span>
                                    <span className="block gradient-text">Any Code</span>
                                </motion.h1>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col justify-center">
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl font-semibold mb-4"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Great code deserves to be understood.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm leading-relaxed mb-8"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    From legacy monoliths to modern microservices, get instant architectural breakdowns,
                                    auto-generated docs, and AI-powered Q&A—all from a single GitHub URL.
                                </motion.p>

                                {/* GitHub URL form */}
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onSubmit={handleSubmit}
                                    id="get-started"
                                >
                                    <div className="flex items-center gap-2 p-1.5 rounded-xl"
                                        style={{
                                            background: 'var(--input-bg)',
                                            border: '1px solid var(--input-border)',
                                        }}
                                    >
                                        <GitFork className="w-4 h-4 ml-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://github.com/user/repo"
                                            className="flex-1 bg-transparent border-none outline-none text-sm p-2 font-mono"
                                            style={{ color: 'var(--text-primary)' }}
                                            required
                                            pattern="https://github.com/.*"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading || !url}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                                            style={{
                                                background: 'linear-gradient(135deg, #D4A853, #8B6914)',
                                                color: '#fff',
                                            }}
                                        >
                                            {isLoading ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                                            ) : (
                                                <><span>Analyze</span><ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            </div>
                        </div>

                        {/* Bottom numbered services — like the reference */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-px"
                            style={{ borderTop: '1px solid var(--border)' }}
                        >
                            {SERVICES.map((s, i) => (
                                <div
                                    key={i}
                                    className="p-6 flex flex-col gap-2 transition-colors duration-300 hover:bg-white/[0.02]"
                                    style={{
                                        borderRight: i < SERVICES.length - 1 ? '1px solid var(--border)' : 'none',
                                    }}
                                >
                                    <span className="text-xs font-bold" style={{ color: '#D4A853' }}>
                                        #{s.num}
                                    </span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 TRUSTED BY / BRAND BAR
            ═══════════════════════════════════════════ */}
            <section className="relative py-12 px-6">
                <AnimatedSection>
                    <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-10"
                        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}
                    >
                        <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--text-muted)' }}>
                            Built With
                        </span>
                        {['⚡ FastAPI', '🧠 GPT-4', '📦 FAISS', '🔗 LangChain', '⚛️ React', '🎨 Mermaid.js'].map((brand, i) => (
                            <span key={i} className="text-sm font-medium" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                                {brand}
                            </span>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══════════════════════════════════════════
                 ABOUT / "BEHIND THE DESIGNS" SECTION
            ═══════════════════════════════════════════ */}
            <section id="about" className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <AnimatedSection>
                        <p className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: '#D4A853' }}>
                            Behind the Code
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                            Decode Complex<br />
                            Codebases That<br />
                            <span className="gradient-text">Save Hours</span>
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={0.15}>
                        <p className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                            An AI-powered tool focused on making sense of any codebase — from legacy monoliths to modern microservices.
                        </p>
                        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                            CodeLense clones your repository, chunks source code into semantic blocks, generates embeddings with OpenAI,
                            indexes them in FAISS for lightning-fast retrieval, then serves answers through GPT-4 — all locally, all private.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                Let's Explore Together
                            </span>
                            <a
                                href="#get-started"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #D4A853, #8B6914)',
                                    color: '#fff',
                                }}
                            >
                                Get Started
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <ArrowUpRight size={12} />
                                </div>
                            </a>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 FEATURES GRID — 3-column cards
            ═══════════════════════════════════════════ */}
            <section id="features" className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Everything to <span className="gradient-text">decode a repo</span>.
                        </h2>
                        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                            From cloning to conversation — a complete AI pipeline for codebase understanding.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((feature, i) => (
                            <AnimatedSection key={i} delay={i * 0.08}>
                                <div
                                    className="group rounded-2xl p-7 h-full transition-all duration-500 hover:translate-y-[-4px] cursor-default"
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                            background: 'rgba(212,168,83,0.1)',
                                            border: '1px solid rgba(212,168,83,0.2)',
                                        }}
                                    >
                                        <feature.icon className="w-5 h-5" style={{ color: '#D4A853' }} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {feature.description}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 HOW IT WORKS — Numbered Steps
            ═══════════════════════════════════════════ */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            How it <span className="gradient-text">works</span>.
                        </h2>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { step: '01', title: 'Clone & Filter', desc: 'The backend clones the repository using a shallow git fetch, then intelligently filters out binaries, build artifacts, and vendor files.' },
                            { step: '02', title: 'Chunk & Embed', desc: 'Source code is split into semantic chunks, then each chunk is converted into a high-dimensional vector using OpenAI embeddings.' },
                            { step: '03', title: 'Index in FAISS', desc: 'All embeddings are stored in a local FAISS vector index for blazing-fast similarity search. Your code never leaves your machine.' },
                            { step: '04', title: 'Retrieve & Generate', desc: 'The most relevant code chunks are retrieved and passed as context to GPT-4, ensuring accurate, grounded responses.' },
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={i * 0.1}>
                                <div
                                    className="rounded-2xl p-8 h-full transition-all duration-500 hover:translate-y-[-2px] group"
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    <span
                                        className="text-5xl font-black mb-4 block transition-colors duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #f2c36b, #D4A853)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            opacity: 0.6,
                                        }}
                                    >
                                        {item.step}
                                    </span>
                                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                 CTA SECTION
            ═══════════════════════════════════════════ */}
            <section className="relative py-24 px-6">
                <AnimatedSection>
                    <div
                        className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        {/* Warm glow */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-[30%] w-[40%] h-full opacity-20"
                                style={{
                                    background: 'radial-gradient(ellipse at center top, rgba(212,168,83,0.8), transparent 70%)',
                                }}
                            />
                        </div>

                        <div className="relative px-8 md:px-16 py-16 text-center">
                            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                                Ready to decode your next repo?
                            </h2>
                            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                                Stop reading code line by line. Let AI give you the full picture.
                            </p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #D4A853, #8B6914)',
                                    color: '#fff',
                                    boxShadow: '0 8px 32px rgba(212,168,83,0.3)',
                                }}
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>© Sagnik</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Built with ♥ using React + FastAPI</span>
                </div>
            </footer>
        </div>
    );
}
