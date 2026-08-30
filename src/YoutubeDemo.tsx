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
    bg: '#0f0f0f',
    text: '#f1f1f1',
    secondaryText: '#aaa',
    red: '#FF0000',
    searchBar: '#121212',
    searchBorder: '#333',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    cardHover: 'rgba(255, 255, 255, 0.05)',
};

const VideoCard: React.FC<{
    title: string;
    views: string;
    time: string;
    channel: string;
    index: number;
    gradient: string;
}> = ({ title, views, time, channel, index, gradient }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const anim = spring({
        frame: frame - (index * 2),
        fps,
        config: { damping: 12 },
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            opacity: anim,
            transform: `translateY(${interpolate(anim, [0, 1], [30, 0])}px)`,
        }}>
            {/* Thumbnail */}
            <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: gradient,
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${THEME.searchBorder}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                }}>
                    12:45
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, #333, #666)`,
                    flexShrink: 0,
                    border: '1px solid #444',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{
                        color: THEME.text,
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: 'Inter',
                        lineHeight: '20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {title}
                    </div>
                    <div style={{
                        color: THEME.secondaryText,
                        fontSize: 14,
                        fontFamily: 'Inter',
                    }}>
                        {channel}
                    </div>
                    <div style={{
                        color: THEME.secondaryText,
                        fontSize: 14,
                        fontFamily: 'Inter',
                    }}>
                        {views} • {time}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const YoutubeDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const sidebarWidth = 240;
    const headerHeight = 56;

    const videos = [
        { title: 'The Future of AI in 2026', channel: 'Tech Insider', views: '1.2M views', time: '2 days ago', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        { title: 'Why I Switched to Remotion for Video Apps', channel: 'Code With Me', views: '500k views', time: '1 week ago', gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)' },
        { title: 'The $7 Trillion AI Bet: What You Need to Know', channel: 'Finance Hub', views: '3M views', time: '5 hours ago', gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)' },
        { title: 'Living in a Mars Colony: Full Documentary', channel: 'SpaceX Today', views: '10M views', time: '1 month ago', gradient: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)' },
        { title: 'How Nuclear Fusion Will Solve Energy Forever', channel: 'Science Weekly', views: '2.5M views', time: '3 days ago', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' },
        { title: 'Modern UI Design: Back to Basics', channel: 'Design Pro', views: '100k views', time: '10 hours ago', gradient: 'linear-gradient(135deg, #701a75 0%, #d946ef 100%)' },
        { title: 'Quantum Computing Explained in 5 Minutes', channel: 'Physics Girl', views: '800k views', time: '1 day ago', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' },
        { title: 'The Mystery of the Deep Ocean', channel: 'Discovery', views: '4.2M views', time: '2 weeks ago', gradient: 'linear-gradient(135deg, #164e63 0%, #06b6d4 100%)' },
    ];

    const searchAnim = spring({
        frame,
        fps,
        config: { damping: 15 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.bg,
            fontFamily: 'Inter, sans-serif',
            color: THEME.text,
            overflow: 'hidden',
        }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                
                .header-blur {
                    backdrop-filter: blur(8px);
                    background-color: rgba(15, 15, 15, 0.8);
                }
                `}
            </style>

            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />

            {/* Header */}
            <div className="header-blur" style={{
                height: headerHeight,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                position: 'fixed',
                top: 0,
                zIndex: 10,
                borderBottom: `1px solid ${THEME.searchBorder}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
                    </svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                            width: 32,
                            height: 22,
                            backgroundColor: THEME.red,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -1 }}>YouTube</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 0.6,
                    maxWidth: 720,
                    opacity: searchAnim,
                }}>
                    <div style={{
                        flex: 1,
                        height: 40,
                        backgroundColor: THEME.searchBar,
                        border: `1px solid ${THEME.searchBorder}`,
                        borderRadius: '40px 0 0 40px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        color: '#888',
                        fontSize: 16,
                    }}>
                        Search
                    </div>
                    <div style={{
                        width: 64,
                        height: 40,
                        backgroundColor: '#222',
                        border: `1px solid ${THEME.searchBorder}`,
                        borderLeft: 'none',
                        borderRadius: '0 40px 40px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                        </svg>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-9h4v7h-4V6zm1-1h3v9h-3V5z" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.84c0-1.1.9-2 2-2s2 .9 2 2v.84c2.44.76 4 3.06 4 5.98v5.15l2 1.88z" />
                    </svg>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, #3ea6ff, #0055ff)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: 14,
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                        J
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                top: headerHeight,
                left: 0,
                width: sidebarWidth,
                bottom: 0,
                backgroundColor: THEME.bg,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderRight: `1px solid ${THEME.searchBorder}`,
            }}>
                {['Home', 'Shorts', 'Subscriptions', 'Library', 'History'].map((item, i) => (
                    <div key={item} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 24,
                        padding: '10px 12px',
                        borderRadius: 10,
                        backgroundColor: i === 0 ? THEME.sidebarHover : 'transparent',
                        fontWeight: i === 0 ? '600' : '400',
                        color: i === 0 ? 'white' : THEME.secondaryText,
                    }}>
                        <div style={{ width: 24, height: 24, backgroundColor: i === 0 ? 'white' : '#444', borderRadius: 6 }} />
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: sidebarWidth,
                marginTop: headerHeight,
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '40px 20px',
                height: `calc(100vh - ${headerHeight}px)`,
                overflow: 'hidden',
            }}>
                {videos.map((vid, i) => (
                    <VideoCard key={i} index={i} {...vid} />
                ))}
            </div>

            {/* Cursor */}
            <div style={{
                position: 'absolute',
                top: interpolate(frame, [0, 90, 150, 240, 300], [800, 400, 40, 40, 200], { extrapolateRight: 'clamp' }),
                left: interpolate(frame, [0, 90, 150, 240, 300], [1000, 600, 400, 900, 1200], { extrapolateRight: 'clamp' }),
                zIndex: 100,
                pointerEvents: 'none',
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}>
                    <path d="M7 2l12 11.23-5.85.91 3.48 6.75-1.7.88-3.52-6.81L7 22V2z" stroke="black" strokeWidth="1.5" />
                </svg>
            </div>
        </AbsoluteFill>
    );
};
