import React, { useState } from 'react'

function AuthForm({ mode, onSubmit, onSwitch, error }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ email, password, confirm })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="eyebrow">Budget Advisor</div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Sign in to access your budget insights.' : 'Start your financial journey with a free account.'}</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />

          {mode === 'signup' && (
            <>
              <label>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} placeholder="••••••••" />
            </>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="btn" type="submit" style={{ marginTop: 8 }}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <div className="auth-switch">
          {mode === 'login' ? (
            <span>New here? <button type="button" className="link-button" onClick={() => onSwitch('signup')}>Create an account</button></span>
          ) : (
            <span>Already have an account? <button type="button" className="link-button" onClick={() => onSwitch('login')}>Log in</button></span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
