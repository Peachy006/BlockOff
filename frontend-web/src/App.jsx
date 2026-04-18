import { useState } from 'react'
import heroImg from './assets/hero.png'
import phishingVid from './assets/Phising.mp4'
import './index.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="app-wrapper">

            <header className="site-header">
                <span className="brand">Block<span className="orange-text">OFF</span></span>
                <button className="counter" onClick={() => setCount((c) => c + 1)}>
                    {count} Scammers Blocked
                </button>
            </header>

            <main>
                <section className="hero-section">
                    <img src={heroImg} width="140" height="147" alt="Block OFF Logo" className="hero-img" />
                    <h1>Your shield against <span className="orange-text">Phishing</span></h1>
                    <p className="tagline">Block OFF identifies scammers and warns you about sketchy links, emails, and calls — before it's too late.</p>
                    <div className="cta-row">
                        <a href="#" className="btn btn-primary">Web Extension</a>
                        <a href="#" className="btn btn-outline">Download App (Soon)</a>
                    </div>
                </section>

                <section className="cards-section">
                    <div className="card card-dark">
                        <h2>What is Phishing?</h2>
                        <p>Phishing is a cybercrime where scammers impersonate legitimate institutions to steal sensitive data or money. They use emails, fake websites, and phone calls to deceive victims.</p>
                        <p className="card-highlight">Block OFF detects these threats in real time and keeps you one step ahead.</p>
                    </div>

                    <div className="card card-video">
                        <h2>See it in action</h2>
                        <div className="video-container">
                            <video
                                src={phishingVid}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="phishing-video"
                            />
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
                        <span className="contact-label">Contact the team</span>
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
