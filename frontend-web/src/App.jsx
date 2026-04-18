import { useState } from 'react'
import logoIcon from './assets/icon128.png'
import phishingVid from './assets/Phising.mp4'
import './index.css'

function App() {
    const [count, setCount] = useState(0)
    const [view, setView] = useState('home') // Toggle between 'home' and 'login'

    // ── LOGIN VIEW ──────────────────────────────────────
    if (view === 'login') {
        return (
            <div className="app-wrapper">
                <header className="site-header">
                    <div className="header-left">
                        <span className="brand" onClick={() => setView('home')} style={{cursor: 'pointer'}}>
                            Block<span className="orange-text">OFF</span>
                        </span>
                        <nav className="side-nav">
                            <a href="#" className="nav-link" onClick={() => setView('home')}>Home</a>
                        </nav>
                    </div>
                </header>

                <main className="auth-container">
                    <div className="card card-dark auth-card">
                        <h2 className="auth-title">LOG IN HERE</h2>
                        <p className="auth-subtitle">Enter your details to help protect others:</p>

                        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <label>Your email:</label>
                                <input type="email" placeholder="name@example.com" required />
                            </div>

                            <div className="input-group">
                                <label>Password:</label>
                                <input type="password" placeholder="••••••••" required />
                            </div>

                            <button className="btn btn-primary btn-full">Sign In</button>
                        </form>

                        <p className="card-highlight auth-footer">
                            Don't have an account? <span className="orange-text link-style">Create Profile</span>
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // ── HOME VIEW ───────────────────────────────────────
    return (
        <div className="app-wrapper">
            <header className="site-header">
                <div className="header-left">
                    <span className="brand">Block<span className="orange-text">OFF</span></span>
                    <nav className="side-nav">
                        <a href="/" className="nav-link">Home</a>
                    </nav>
                </div>

                <div className="header-right">
                    <nav className="side-nav">
                        <a href="#" className="nav-link" onClick={() => setView('login')}>Log in</a>
                    </nav>
                    <button className="counter" onClick={() => setCount((c) => c + 1)}>
                        {count} Scammers Blocked
                    </button>
                </div>
            </header>

            <main>
                <section className="hero-section">
                    <img src={logoIcon} width="128" height="128" alt="Block OFF Icon" className="hero-img" />
                    <h1>Your shield against <span className="orange-text">Phishing</span></h1>
                    <p className="tagline">Block OFF identifies scammers and warns you about sketchy links, emails, and messages — before it's too late.</p>
                    <div className="cta-row">
                        <a href="#" className="btn btn-primary">Web Extension</a>
                        <a href="#" className="btn btn-outline">Download App (Soon)</a>
                    </div>
                </section>

                <section className="cards-section">
                    <div className="card card-dark">
                        <h2>What is Phishing?</h2>
                        <p>Phishing is a cybercrime where scammers impersonate legitimate institutions to steal sensitive data or money. They use emails, fake websites, and phone calls to deceive victims.</p>
                        <p className="card-highlight">Block OFF detects these threats in real time and keeps you one step ahead. Users help users feel safe on the internet.</p>
                    </div>

                    <div className="card card-video">
                        <h2>See it in action</h2>
                        <div className="video-container">
                            <video src={phishingVid} autoPlay loop muted playsInline className="phishing-video" />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="footer-col">
                    <h3>Documentation</h3>
                    <p>Learn how Block OFF keeps you safe.</p>
                    <ul>
                        <li><a href="#">Security Guide</a></li>
                        <li><a href="#">API Docs</a></li>
                    </ul>
                </div>
                <div className="footer-divider" />
                <div className="footer-col">
                    <h3>Connect</h3>
                    <p>Join our community for updates.</p>
                    <ul>
                        <li><a href="https://github.com">GitHub</a></li>
                        <li><a href="https://x.com">X / Twitter</a></li>
                    </ul>
                    <div className="contact-area">
                        <span className="contact-label">Contact the team: </span>
                        <a href="mailto:BlockOFFService@gmail.com" className="email-display">
                            BlockOFFService@gmail.com
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App