import { useState } from 'react'
import logoIcon from './assets/icon128.png'
import phishingVid from './assets/Phising.mp4'
import './index.css'

function App() {
    const [view, setView] = useState('home')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [reportingType, setReportingType] = useState(null)

    // Central user state
    const [userData, setUserData] = useState({
        id: null,
        email: 'Guest',
        phone: '',
        countryCode: '+45',
        globalBlocked: 0,
        points: 50,
        reported: 4,
        warned: 20
    });

    const [signupData, setSignupData] = useState({
        email: '', countryCode: '+45', phone: '', pass1: '', pass2: ''
    });

    // ── API CALLS
    const createUser = async (email, phoneNumber) => {
        const response = await fetch(
            `http://localhost:8080/users?email=${email}&phoneNumber=${phoneNumber}`,
            { method: 'POST' }
        );
        return await response.json();
    };

    const addReport = async (value, userId) => {
        const response = await fetch(
            `http://localhost:8080/units/${value}?userId=${userId}`,
            { method: 'POST' }
        );
        if (response.status === 409) {
            throw new Error('You have already reported this');
        }
        return await response.json();
    };

    // ── HANDLERS
    const handleSignupInput = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await createUser(signupData.email, signupData.phone);
            setUserData(prev => ({
                ...prev,
                id: user.id, // ID from backend
                email: user.email,
                phone: user.phoneNumber,
            }));
            setIsLoggedIn(true);
            setView('profile');
        } catch (error) {
            alert("Error connecting to server. Is the backend running?");
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const emailInput = e.target.elements[0].value;
        // Mocking a login ID since the login API isn't in your snippet yet
        setUserData(prev => ({ ...prev, email: emailInput, id: prev.id || 123 }));
        setIsLoggedIn(true);
        setView('profile');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView('home');
    };

    const submitReport = async (e) => {
        e.preventDefault();
        const reportValue = e.target.elements[0].value;

        try {
            await addReport(reportValue, userData.id);
            e.target.reset();
            alert("Report Submitted!");
        } catch (error) {
            alert(error.message);
        }
    };

    // ── COMPONENTS ─────────────────────────────────────
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

    // ── VIEWS ──────────────────────────────────────────
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
                        <div className="card card-dark stat-card highlight-card">
                            <h3>Total Score</h3>
                            <div className="stat-number">{userData.points.toLocaleString()}</div>
                            <p className="stat-label">Your points</p>
                        </div>

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
                            <p className="impact-text">Your reports keep the community safe.</p>
                        </div>

                        <div className="card card-dark stat-card report-action-card">
                            <h3 className="report-title">Report Threat</h3>
                            <p className="report-desc">Enter a suspicious URL, email, or phone number below.</p>
                            <form onSubmit={submitReport} className="mini-report-form">
                                <input type="text" placeholder="Type the threat here..." className="report-input" required />
                                <button type="submit" className="btn btn-primary btn-full">Submit Report</button>
                            </form>
                        </div>

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

    if (view === 'signup') {
        const passwordsMatch = signupData.pass1 === signupData.pass2;
        const phoneIsValid = /^\d{8}$/.test(signupData.phone);
        return (
            <div className="app-wrapper">
                <Header />
                <main className="auth-container">
                    <div className="card card-dark auth-card">
                        <h2 className="auth-title">CREATE PROFILE</h2>
                        <form className="auth-form" onSubmit={handleSignupSubmit}>
                            <div className="input-group"><label>Email:</label><input name="email" type="email" placeholder="name@example.com" onChange={handleSignupInput} required /></div>
                            <div className="input-group">
                                <label>Phone Number:</label>
                                <div className="phone-input-container">
                                    <select name="countryCode" className="country-select" value={signupData.countryCode} onChange={handleSignupInput}>
                                        <option value="+45">+45 (DK)</option><option value="+46">+46 (SE)</option><option value="+1">+1 (US)</option>
                                    </select>
                                    <input name="phone" type="tel" className="phone-digits" placeholder="00000000" onChange={handleSignupInput} required />
                                </div>
                                {!phoneIsValid && signupData.phone.length > 0 && <span className="validation-error">Must be 8 digits</span>}
                            </div>
                            <div className="input-group"><label>New password:</label><input name="pass1" type="password" onChange={handleSignupInput} required /></div>
                            <div className="input-group">
                                <label>Repeat password:</label><input name="pass2" type="password" onChange={handleSignupInput} required />
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
                        <p className="auth-footer">No account? <span className="orange-text link-style" onClick={() => setView('signup')}>Create Profile</span></p>
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
                    <img src={logoIcon} width="128" height="128" alt="Icon" className="hero-img" />
                    <h1>Your shield against <span className="orange-text">Phishing</span></h1>
                    <p className="tagline">Block OFF identifies scammers and warns you before it's too late.</p>
                    <div className="cta-row">
                        <a href="#" className="btn btn-primary">Web Extension</a>
                        <a href="#" className="btn btn-outline">Download App</a>
                    </div>
                </section>
                <section className="cards-section">
                    <div className="card card-dark">
                        <h2>What is Phishing?</h2>
                        <p>Phishing is a cybercrime where scammers impersonate legitimate institutions to steal information or money.</p>
                        <p>Join BlockOFF and help us make the internet a safer space for everyone.</p>
                    </div>
                    <div className="card card-video">
                        <div className="video-container">
                            <video src={phishingVid} autoPlay loop muted playsInline className="phishing-video" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default App;