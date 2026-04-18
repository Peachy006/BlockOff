import { useState } from 'react'
import logoIcon from './assets/icon128.png'
import phishingVid from './assets/Phising.mp4'
import './index.css'

function App() {
    const [view, setView] = useState('home')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [reportingType, setReportingType] = useState(null); // 'website', 'phone', or 'email'

    // Central User State
    const [userData, setUserData] = useState({
        email: 'Guest',
        phone: '',
        countryCode: '+45',
        globalBlocked: 0,
        points: 1250,
        reported: 14,
        warned: 432
    });

    const [signupData, setSignupData] = useState({
        email: '', countryCode: '+45', phone: '', pass1: '', pass2: ''
    });

    const handleSignupInput = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setUserData(prev => ({
            ...prev,
            email: signupData.email,
            phone: signupData.phone,
            countryCode: signupData.countryCode
        }));
        setIsLoggedIn(true);
        setView('profile');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const emailInput = e.target.elements[0].value;
        setUserData(prev => ({ ...prev, email: emailInput }));
        setIsLoggedIn(true);
        setView('profile');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView('home');
    };

    const submitReport = (e) => {
        e.preventDefault();
        setUserData(prev => ({
            ...prev,
            points: prev.points + 50,
            reported: prev.reported + 1
        }));
        setReportingType(null);
        alert("Report received! +50 Hunter Points awarded.");
    };

    // ── SHARED COMPONENTS ──────────────────────────────
    const Header = () => (
        <header className="site-header">
            <div className="header-left">
                <span className="brand" onClick={() => setView('home')}>
                    Block<span className="orange-text">OFF</span>
                </span>
            </div>
            <div className="header-right">
                <nav className="side-nav">
                    {isLoggedIn ? (
                        <a href="#" className="nav-link profile-link" onClick={() => setView('profile')}>My Profile</a>
                    ) : (
                        <a href="#" className="nav-link" onClick={() => setView('login')}>Log in</a>
                    )}
                </nav>
                <div className="counter-badge">
                    {userData.globalBlocked.toLocaleString()} Scammers Blocked
                </div>
            </div>
        </header>
    );

    const Footer = () => (
        <footer className="site-footer">
            <div className="footer-col">
                <h3>Documentation</h3>
                <ul>
                    <li><a href="#">Security Guide</a></li>
                    <li><a href="#">API Docs</a></li>
                </ul>
            </div>
            <div className="footer-divider" />
            <div className="footer-col">
                <h3>Connect</h3>
                <div className="contact-area">
                    <span className="contact-label">Contact: </span>
                    <a href="mailto:Blockoffservice@gmail.com" className="email-display">Blockoffservice@gmail.com</a>
                </div>
            </div>
        </footer>
    );

// ── VIEW: PROFILE ──────────────────────────────────
    if (view === 'profile') {
        return (
            <div className="app-wrapper">
                <Header />
                <main className="profile-container">
                    <section className="profile-hero">
                        <div className="avatar-circle">{userData.email[0].toUpperCase()}</div>
                        <h2 className="auth-title">Welcome back, Hunter</h2>
                        <p className="auth-subtitle">Status: <span className="orange-text">Junior Shield</span></p>
                    </section>

                    <div className="profile-grid">
                        {/* Box 1: Total Score */}
                        <div className="card card-dark stat-card highlight-card">
                            <h3>Total Score</h3>
                            <div className="stat-number">{userData.points.toLocaleString()}</div>
                            <p className="stat-label">Your points</p>
                        </div>

                        {/* Box 2: Reports & Warned */}
                        <div className="card card-dark stat-card">
                            <div className="mini-stats">
                                <div className="mini-stat-item">
                                    <span className="mini-stat-value">{userData.reported}</span>
                                    <span className="mini-stat-desc">Reports</span>
                                </div>
                                <div className="mini-stat-divider"></div>
                                <div className="mini-stat-item">
                                    <span className="mini-stat-value">{userData.warned}</span>
                                    <span className="mini-stat-desc">Warned</span>
                                </div>
                            </div>
                            <p className="impact-text" style={{color: 'var(--dust-grey)', fontStyle: 'italic'}}>Your reports keep the community safe.</p>
                        </div>

                        {/* Box 3: SIMPLIFIED REPORTING TOOL (Stretches full width) */}
                        <div className="card card-dark stat-card report-action-card">
                            <h3 className="report-title">Report Threat</h3>
                            <p className="report-desc">Enter a suspicious URL, email, or phone number below.</p>

                            <form onSubmit={submitReport} className="mini-report-form">
                                <input
                                    type="text"
                                    placeholder="Type the threat here..."
                                    className="report-input"
                                    required
                                />
                                <button type="submit" className="btn btn-primary btn-full">
                                    Submit Report
                                </button>
                            </form>
                        </div>

                        {/* Box 4: Account Details */}
                        <div className="card card-video account-details">
                            <h3>Account Info</h3>
                            <div className="detail-row"><span>Email:</span> <strong>{userData.email}</strong></div>
                            <div className="detail-row"><span>Phone:</span> <strong>{userData.countryCode} {userData.phone || "---"}</strong></div>
                            <button className="btn btn-outline btn-logout" onClick={handleLogout}>Log Out</button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // SIGNUP & LOGIN VIEWS
    if (view === 'signup') {
        const passwordsMatch = signupData.pass1 === signupData.pass2;
        const phoneIsValid = /^\d{8}$/.test(signupData.phone);
        return (
            <div className="app-wrapper">
                <Header />
                <main className="auth-container">
                    <div className="card card-dark auth-card">
                        <h2 className="auth-title">CREATE PROFILE HERE</h2>
                        <form className="auth-form" onSubmit={handleSignupSubmit}>
                            <div className="input-group"><label>Your email:</label><input name="email" type="email" placeholder="name@example.com" onChange={handleSignupInput} required /></div>
                            <div className="input-group">
                                <label>Your phone number:</label>
                                <div className="phone-input-container">
                                    <select name="countryCode" className="country-select" value={signupData.countryCode} onChange={handleSignupInput}>
                                        <option value="+45">+45 (DK)</option><option value="+46">+46 (SE)</option><option value="+1">+1 (US)</option>
                                    </select>
                                    <input name="phone" type="tel" className="phone-digits" placeholder="00000000" onChange={handleSignupInput} required />
                                </div>
                                {!phoneIsValid && signupData.phone.length > 0 && <span className="validation-error">Must be 8 digits</span>}
                            </div>
                            <div className="input-group"><label>New password:</label><input name="pass1" type="password" placeholder="••••••••" onChange={handleSignupInput} required /></div>
                            <div className="input-group">
                                <label>Repeat password:</label><input name="pass2" type="password" placeholder="••••••••" onChange={handleSignupInput} required />
                                {!passwordsMatch && signupData.pass2.length > 0 && <span className="validation-error">Passwords do not match</span>}
                            </div>
                            <button className="btn btn-primary btn-full" disabled={!passwordsMatch || !phoneIsValid}>Create Profile</button>
                        </form>
                        <p className="auth-footer">Already have an account? <span className="orange-text link-style" onClick={() => setView('login')}>Log In</span></p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (view === 'login') {
        return (
            <div className="app-wrapper">
                <Header />
                <main className="auth-container">
                    <div className="card card-dark auth-card">
                        <h2 className="auth-title">LOG IN HERE</h2>
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="input-group"><label>Your email:</label><input type="email" placeholder="name@example.com" required /></div>
                            <div className="input-group"><label>Password:</label><input type="password" placeholder="••••••••" required /></div>
                            <button className="btn btn-primary btn-full">Sign In</button>
                        </form>
                        <p className="auth-footer">Don't have an account? <span className="orange-text link-style" onClick={() => setView('signup')}>Create Profile</span></p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // HOME VIEW
    return (
        <div className="app-wrapper">
            <Header />
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
                        <p>Phishing is a cybercrime where scammers impersonate legitimate institutions. Users help users feel safe on the internet.</p>
                        <p className="card-highlight">Block OFF detects these threats in real time.</p>
                    </div>
                    <div className="card card-video">
                        <div className="video-container"><video src={phishingVid} autoPlay loop muted playsInline className="phishing-video" /></div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default App;