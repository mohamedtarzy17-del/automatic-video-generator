import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
} from 'remotion';

const THEME = {
    bg: '#212121',
    sidebar: '#171717',
    userBubble: '#2F2F2F',
    text: '#FFFFFF',
    secondaryText: '#B4B4B4',
    inputBg: '#303030',
    inputBorder: 'rgba(255, 255, 255, 0.15)',
    accent: '#10a37f', // OpenAI Green
};

const TypingText: React.FC<{ text: string; startFrame: number; speed?: number }> = ({ text, startFrame, speed = 1 }) => {
    const frame = useCurrentFrame();
    const charsToShow = Math.floor(Math.max(0, (frame - startFrame) * speed));
    const isDone = charsToShow >= text.length;

    return (
        <div style={{ display: 'inline', position: 'relative' }}>
            {text.slice(0, charsToShow)}
            {!isDone && (
                <span style={{
                    display: 'inline-block',
                    width: 10,
                    height: 18,
                    backgroundColor: THEME.text,
                    marginLeft: 2,
                    verticalAlign: 'middle',
                    animation: 'blink 0.8s infinite',
                }} />
            )}
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const ChatMessage: React.FC<{
    role: 'user' | 'assistant';
    text: string;
    startFrame: number;
    delay?: number;
}> = ({ role, text, startFrame, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const anim = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 15 },
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: role === 'user' ? 'flex-end' : 'flex-start',
            gap: 8,
            marginBottom: 24,
            opacity: anim,
            transform: `translateY(${interpolate(anim, [0, 1], [20, 0])}px)`,
            width: '100%',
        }}>
            <div style={{
                display: 'flex',
                gap: 12,
                flexDirection: role === 'user' ? 'row-reverse' : 'row',
                maxWidth: '80%',
            }}>
                {/* Avatar */}
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    backgroundColor: role === 'user' ? '#5436DA' : THEME.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 'bold',
                }}>
                    {role === 'user' ? 'J' : 'GPT'}
                </div>

                <div style={{
                    padding: '12px 16px',
                    borderRadius: 20,
                    backgroundColor: role === 'user' ? THEME.userBubble : 'transparent',
                    color: THEME.text,
                    fontSize: 16,
                    lineHeight: 1.5,
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}>
                    {role === 'user' ? text : <TypingText text={text} startFrame={startFrame + 15} speed={0.8} />}
                </div>
            </div>
        </div>
    );
};

export const ChatGPTDemo: React.FC = () => {
    const frame = useCurrentFrame();

    const sidebarWidth = 260;

    const messages = [
        { role: 'user', text: "Explain quantum computing in simple terms.", start: 30 },
        { role: 'assistant', text: "Imagine you're trying to find a treasure in a huge maze. A normal computer is like a person who tries one path at a time. A quantum computer is like a mist that can explore every path simultaneously...", start: 90 },
        { role: 'user', text: "Wow, that's clear! Now write a haiku about it.", start: 360 },
        { role: 'assistant', text: "Qubits dance in states,\nMany paths explored at once,\nLogic blooms in mist.", start: 420 },
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.bg,
            color: THEME.text,
            fontFamily: 'Inter, sans-serif',
            overflow: 'hidden',
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                `}
            </style>

            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.05} />

            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: sidebarWidth,
                bottom: 0,
                backgroundColor: THEME.sidebar,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 10,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 20,
                }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid white' }} />
                    <span style={{ fontWeight: 500 }}>New Chat</span>
                </div>

                {['Quantum Computing Intro', 'Healthy Recipes', 'Travel Plan Paris'].map((chat, i) => (
                    <div key={chat} style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: 14,
                        color: i === 0 ? 'white' : THEME.secondaryText,
                        backgroundColor: i === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}>
                        {chat}
                    </div>
                ))}
            </div>

            {/* Main Chat Area */}
            <div style={{
                marginLeft: sidebarWidth,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
                {/* Header */}
                <div style={{
                    height: 60,
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>ChatGPT 4o</div>
                </div>

                {/* Messages Container */}
                <div style={{
                    flex: 1,
                    padding: '40px 15% 120px 15%',
                    overflow: 'hidden',
                }}>
                    {messages.map((msg, i) => (
                        frame >= msg.start && (
                            <ChatMessage key={i} role={msg.role as any} text={msg.text} startFrame={msg.start} />
                        )
                    ))}
                </div>

                {/* Input Bar Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 180,
                    background: `linear-gradient(to top, ${THEME.bg} 60%, transparent)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 15%',
                }}>
                    <div style={{
                        width: '100%',
                        height: 52,
                        backgroundColor: THEME.inputBg,
                        border: `1px solid ${THEME.inputBorder}`,
                        borderRadius: 26,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '0 16px',
                        position: 'relative',
                    }}>
                        <div style={{ color: THEME.secondaryText, fontSize: 16 }}>Ask anything...</div>
                        <div style={{
                            position: 'absolute',
                            right: 8,
                            width: 36,
                            height: 36,
                            backgroundColor: THEME.text,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cursor Animation */}
            <div style={{
                position: 'absolute',
                top: interpolate(frame, [0, 60, 240, 360, 500, 600], [800, 950, 950, 950, 500, 300], { extrapolateRight: 'clamp' }),
                left: interpolate(frame, [0, 60, 240, 360, 500, 600], [1200, 1000, 500, 400, 600, 800], { extrapolateRight: 'clamp' }),
                zIndex: 100,
                pointerEvents: 'none',
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>
                    <path d="M7 2l12 11.23-5.85.91 3.48 6.75-1.7.88-3.52-6.81L7 22V2z" stroke="black" strokeWidth="1.5" />
                </svg>
                {/* Click Ripple effect at specific moments */}
                {(frame === 30 || frame === 360) && (
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        left: -20,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '2px solid white',
                        animation: 'ripple 0.5s ease-out forwards',
                    }} />
                )}
            </div>

            <style>{`
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `}</style>
        </AbsoluteFill>
    );
};
