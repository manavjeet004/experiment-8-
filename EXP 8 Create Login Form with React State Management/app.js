import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
    } else {
      setErrorMsg('');
      console.log('Username:', username);
      console.log('Password:', password);
      // You can optionally show a success message or reset the form here
    }
  };

  return (
    <div style={{
      maxWidth: 320, 
      margin: "60px auto", 
      padding: "28px 18px", 
      border: "1px solid #ddd", 
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(160,160,160,0.1)"
    }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{marginBottom:14}}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{display:'block',width:'100%',padding:5,marginTop:4}}
              autoComplete="username"
            />
          </label>
        </div>
        <div style={{marginBottom:14}}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{display:'block',width:'100%',padding:5,marginTop:4}}
              autoComplete="current-password"
            />
          </label>
        </div>
        {errorMsg && <div style={{color:'red', marginBottom:8}}>{errorMsg}</div>}
        <button type="submit" style={{width:'100%',padding:7,fontWeight:'bold'}}>Login</button>
      </form>
    </div>
  );
}

export default App;
