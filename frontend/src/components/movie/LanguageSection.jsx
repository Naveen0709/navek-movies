import React from 'react';
import './LanguageSection.css';

const languages = [
    { name: 'Tamil', code: 'ta', image: '/languages/ajith.png', color: '#ff4d4d' },
    { name: 'Telugu', code: 'te', image: '/languages/prabhas.png', color: '#4d94ff' },
    { name: 'English', code: 'en', image: '/languages/ana.png', color: '#47d147' },
    { name: 'Japanese', code: 'ja', image: '/languages/japanese.png', color: '#9933ff' },
    { name: 'Korean', code: 'ko', image: '/languages/donlee.png', color: '#ff66b2' },
    { name: 'Hindi', code: 'hi', image: '/languages/srk.png', color: '#ffcc00' }
];

const LanguageSection = ({ onLanguageSelect }) => {
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="language-section">
            <h2 className="section-title">Explore by Language</h2>
            <div className="language-slider-container">
                <button className="language-arrow left" onClick={() => scroll('left')}>‹</button>
                <div className="language-grid" ref={scrollRef}>
                    {languages.map((lang, index) => (
                        <div
                            key={index}
                            className="language-card"
                            onClick={() => onLanguageSelect(lang.code, lang.name)}
                            style={{ '--accent-color': lang.color }}
                        >
                            <div className="language-card-inner">
                                <img
                                    src={lang.image}
                                    alt={lang.name}
                                    className="language-img"
                                />
                                <div className="language-overlay">
                                    <span className="language-name">{lang.name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="language-arrow right" onClick={() => scroll('right')}>›</button>
            </div>
        </div>
    );
};

export default LanguageSection;
