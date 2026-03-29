import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Network, MessageSquare, ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../context/ThemeContext';

const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'readme', label: 'Generated README', icon: FileText },
    { id: 'chat', label: 'Q&A Chat', icon: MessageSquare },
];

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const repoUrl = location.state?.repoUrl;
    const [activeTab, setActiveTab] = useState('overview');
    const { theme } = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({ overview: '', architecture: '', readme: '' });

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        if (!repoUrl) {
            navigate('/');
            return;
        }

        const analyzeRepo = async () => {
            try {
                setIsLoading(true);
                const res = await axios.post('http://localhost:8000/analyze-repo', { url: repoUrl });
                setData({
                    overview: res.data.overview || 'No overview generated.',
                    architecture: res.data.architecture_diagram || 'graph TD;\\n  A[No diagram] --> B[generated]',
                    readme: res.data.readme || '# No README generated.',
                });
            } catch (err) {
                setError(err.response?.data?.detail || err.message || 'Failed to analyze repository');
            } finally {
                setIsLoading(false);
            }
        };

        analyzeRepo();
    }, [repoUrl, navigate]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const query = chatInput.trim();
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setIsChatLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/ask-question', {
                repo_url: repoUrl,
                question: query
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: Failed to get an answer.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (!repoUrl) return null;

    const repoName = repoUrl.replace('https://github.com/', '');

    return (
        <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col"
            style={{ color: 'var(--text-primary)' }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center gap-4 mb-6 pb-4"
                style={{ borderBottom: '1px solid var(--border)' }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                    }}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Analysis Results
                    </h1>
                    <p className="font-mono text-sm mt-1 gradient-text">{repoName}</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* ── Sidebar ── */}
                <aside className="w-64 flex flex-col gap-2 flex-shrink-0">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                disabled={isLoading}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm"
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.12))'
                                        : 'transparent',
                                    border: `1px solid ${isActive ? 'rgba(102,126,234,0.25)' : 'transparent'}`,
                                    color: isActive ? '#667eea' : 'var(--text-muted)',
                                    boxShadow: isActive ? '0 0 20px rgba(102,126,234,0.08)' : 'none',
                                    opacity: isLoading ? 0.5 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Content Area ── */}
                <main
                    className="flex-1 rounded-2xl p-6 overflow-y-auto relative"
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--border)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                                <Loader2 className="w-14 h-14 animate-spin text-purple-500" />
                                <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full" />
                            </div>
                            <p className="text-lg animate-pulse" style={{ color: 'var(--text-muted)' }}>
                                Cloning repository and analyzing codebase...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div
                                className="p-6 rounded-2xl text-center max-w-md"
                                style={{
                                    background: 'rgba(239,68,68,0.08)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                }}
                            >
                                <h3 className="font-bold text-lg mb-2 text-red-400">Analysis Failed</h3>
                                <p className="text-red-300 text-sm">{error}</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: 'rgba(239,68,68,0.15)',
                                        color: '#f87171',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                    }}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="h-full"
                            >
                                {/* ── Overview Tab ── */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold pb-2 gradient-text flex items-center gap-2"
                                            style={{ borderBottom: '1px solid var(--border)' }}>
                                            <Sparkles className="w-5 h-5 text-purple-400" /> Project Overview
                                        </h2>
                                        <div
                                            className="p-6 rounded-xl prose max-w-none"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.overview}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {/* ── Architecture Tab ── */}
                                {activeTab === 'architecture' && (
                                    <div className="space-y-6 h-full flex flex-col">
                                        <h2 className="text-xl font-semibold pb-2 gradient-text flex items-center gap-2"
                                            style={{ borderBottom: '1px solid var(--border)' }}>
                                            <Network className="w-5 h-5 text-blue-400" /> Architecture Diagram
                                        </h2>
                                        <div
                                            className="flex-1 p-6 rounded-xl overflow-auto font-mono text-xs whitespace-pre"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            {data.architecture}
                                        </div>
                                    </div>
                                )}

                                {/* ── README Tab ── */}
                                {activeTab === 'readme' && (
                                    <div className="space-y-6 h-full flex flex-col">
                                        <h2 className="text-xl font-semibold pb-2 gradient-text flex items-center gap-2"
                                            style={{ borderBottom: '1px solid var(--border)' }}>
                                            <FileText className="w-5 h-5 text-cyan-400" /> Generated README
                                        </h2>
                                        <div
                                            className="flex-1 overflow-auto p-6 rounded-xl prose max-w-none"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.readme}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {/* ── Chat Tab ── */}
                                {activeTab === 'chat' && (
                                    <div className="flex flex-col h-full space-y-4">
                                        <h2 className="text-xl font-semibold pb-2 gradient-text flex items-center gap-2 flex-shrink-0"
                                            style={{ borderBottom: '1px solid var(--border)' }}>
                                            <MessageSquare className="w-5 h-5 text-pink-400" /> Q&A Chat
                                        </h2>

                                        <div
                                            className="flex-1 rounded-xl p-4 overflow-y-auto space-y-4 flex flex-col"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                            }}
                                        >
                                            {messages.length === 0 ? (
                                                <div className="m-auto text-center max-w-sm" style={{ color: 'var(--text-muted)' }}>
                                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                    <p>Ask anything about the codebase. RAG will retrieve the context and formulate an answer.</p>
                                                </div>
                                            ) : (
                                                messages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div
                                                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                                                                }`}
                                                            style={msg.role === 'user'
                                                                ? {
                                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                                    color: '#fff',
                                                                }
                                                                : {
                                                                    background: theme === 'dark'
                                                                        ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                                                    border: '1px solid var(--border)',
                                                                    color: 'var(--text-secondary)',
                                                                }
                                                            }
                                                        >
                                                            {msg.role === 'user' ? (
                                                                msg.content
                                                            ) : (
                                                                <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-secondary)' }}>
                                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}

                                            {isChatLoading && (
                                                <div className="flex justify-start">
                                                    <div
                                                        className="rounded-2xl px-5 py-3 rounded-tl-sm flex items-center gap-2"
                                                        style={{
                                                            background: 'var(--bg-card)',
                                                            border: '1px solid var(--border)',
                                                        }}
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0 relative">
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="e.g. Where is the database connection initialized?"
                                                className="flex-1 rounded-xl pl-4 pr-12 py-3 transition-all duration-200 outline-none"
                                                style={{
                                                    background: 'var(--input-bg)',
                                                    border: '1px solid var(--input-border)',
                                                    color: 'var(--input-text)',
                                                }}
                                                disabled={isChatLoading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={isChatLoading || !chatInput.trim()}
                                                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center rounded-lg transition-all duration-200 text-white disabled:opacity-40"
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                }}
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
}
