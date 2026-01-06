import { Link, useNavigate } from 'react-router-dom';
const LoginHome = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); 
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="home-container" style={styles.container}>
      <div style={styles.card}>
        <h1>Welcome to SattaKing 🚀</h1>
        <p style={styles.subtitle}>
          Secure Authentication System with OTP & Email Verification
        </p>
        <div style={styles.buttonGroup}>
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/hidden-dashboard')} 
                style={{ ...styles.button, ...styles.primaryBtn }}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleLogout} 
                style={{ ...styles.button, ...styles.secondaryBtn }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/hidden-login" style={{ ...styles.button, ...styles.primaryBtn }}>
                Login
              </Link>
              <Link to="/hidden-register" style={{ ...styles.button, ...styles.secondaryBtn }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    display: 'inline-block',
    padding: '12px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    border: 'none',
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  secondaryBtn: {
    backgroundColor: '#6c757d',
    color: '#fff',
  }
};

export default LoginHome;