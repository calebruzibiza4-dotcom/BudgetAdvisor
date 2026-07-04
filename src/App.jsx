import React, { useState, useEffect, useRef } from 'react'
import { CURRENCIES, CATEGORIES } from './constants'
import BarChart from './components/BarChart'
import MessageBubble from './components/MessageBubble'
import { sendMessage } from './gemini'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EnterPage from './pages/EnterPage'
import AuthForm from './pages/AuthForm'
import IntroPage from './pages/IntroPage'
import SetupPage from './pages/SetupPage'
import SiteFooter from './components/SiteFooter'

function NavBar({ active, onNavigate }) {
  return (
    <nav className="site-nav">
      <div className="nav-brand">Budget Advisor</div>
      <div className="nav-links">
        <button className={`nav-link ${active === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>Home</button>
        <button className={`nav-link ${active === 'about' ? 'active' : ''}`} onClick={() => onNavigate('about')}>About</button>
        <button className={`nav-link ${active === 'enter' ? 'active' : ''}`} onClick={() => onNavigate('enter')}>Enter</button>
      </div>
    </nav>
  )
}

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [view, setView] = useState('home')
  const [authMode, setAuthMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('budgetAdvisorTheme') || 'dark')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('budgetAdvisorUser'))
    } catch {
      return null
    }
  })
  const [currency, setCurrency] = useState(CURRENCIES[1])
  const [budget, setBudget] = useState({})
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState('gemini')
  const [providerStatus, setProviderStatus] = useState('Gemini active')
  const msgRef = useRef(null)

  const userName = user?.email?.split('@')[0] || 'User'
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
    localStorage.setItem('budgetAdvisorTheme', theme)
  }, [theme])

  useEffect(() => {
    if (user && screen === 'landing') {
      setScreen('intro')
    }
  }, [user, screen])

  useEffect(()=>{
    if(screen==='dashboard'){
      (async ()=>{
        const initial = {role:'user', content:'Please analyze my budget and give me your top 3 observations and recommendations.'}
        setMessages([initial])
        setLoading(true)
        try{
          const financial = buildFinancial(budget,currency)
          const resp = await sendMessage([initial], financial, provider)
          setProviderStatus(resp.fallback ? 'Using local fallback' : `${resp.provider === 'gemini' ? 'Gemini active' : resp.provider === 'local' ? 'Local provider active' : 'Gemini active'}`)
          setMessages([initial,{role:'assistant',content:resp.reply}])
        }catch(e){
          setMessages([initial,{role:'assistant',content:`Sorry, an error occurred: ${e.message}`}])
          setProviderStatus('Provider error')
        }finally{setLoading(false)}
      })()
    }
  },[screen, provider])

  useEffect(()=>{
    if(msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight
  },[messages,loading])

  const persistAccounts = (accounts) => {
    localStorage.setItem('budgetAdvisorAccounts', JSON.stringify(accounts))
  }

  const loadAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem('budgetAdvisorAccounts')) || {}
    } catch {
      return {}
    }
  }

  const handleAuthSubmit = ({ email, password, confirm }) => {
    setAuthError('')
    if (!email || !password) {
      setAuthError('Email and password are required.')
      return
    }
    const normalizedEmail = email.trim().toLowerCase()
    const accounts = loadAccounts()

    if (authMode === 'login') {
      const account = accounts[normalizedEmail]
      if (!account || account.password !== password) {
        setAuthError('Invalid email or password.')
        return
      }
      setUser({ email: normalizedEmail })
      localStorage.setItem('budgetAdvisorUser', JSON.stringify({ email: normalizedEmail }))
      setScreen('intro')
      return
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setAuthError('Passwords do not match.')
      return
    }
    if (accounts[normalizedEmail]) {
      setAuthError('An account with that email already exists.')
      return
    }
    accounts[normalizedEmail] = { email: normalizedEmail, password }
    persistAccounts(accounts)
    setUser({ email: normalizedEmail })
    localStorage.setItem('budgetAdvisorUser', JSON.stringify({ email: normalizedEmail }))
    setScreen('intro')
  }

  const handleLogout = () => {
    setUser(null)
    setScreen('landing')
    setView('home')
    localStorage.removeItem('budgetAdvisorUser')
  }

  const clearChat = ()=> setMessages([])

  const handleAnalyze = async ({ totalExpenses, balance }) => {
    setScreen('dashboard')
  }

  const sendUserMessage = async (text) => {
    if(!text) return
    const userMsg = {role:'user',content:text}
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setLoading(true)
    try{
      const financial = buildFinancial(budget,currency)
      const resp = await sendMessage(newHistory, financial, provider)
      setProviderStatus(resp.fallback ? 'Using local fallback' : `${resp.provider === 'gemini' ? 'Gemini active' : resp.provider === 'local' ? 'Local provider active' : 'Gemini active'}`)
      setMessages(prev=>[...prev,{role:'assistant',content:resp.reply}])
    }catch(e){
      setMessages(prev=>[...prev,{role:'assistant',content:`Sorry, an error occurred: ${e.message}`}])
      setProviderStatus('Provider error')
    }finally{setLoading(false)}
  }

  const buildFinancial = (budgetData, currencyData) => {
    const expenses = {}
    CATEGORIES.forEach(c=> expenses[c.label] = Number(budgetData[c.key]||0))
    const total_expenses = Object.values(expenses).reduce((s,v)=>s+v,0)
    const income = Number(budgetData.income||0)
    const balance = income - total_expenses
    const savings_rate = income>0? Math.round(((income - total_expenses)/income)*100):0
    return {
      currency_name: currencyData.code,
      currency_symbol: currencyData.symbol,
      income,
      expenses,
      total_expenses,
      balance,
      savings_rate
    }
  }

  if (!user) {
    return (
      <div className="container">
        <NavBar active={view} onNavigate={(page) => {
          setView(page)
          setAuthError('')
          setScreen(page === 'enter' ? 'enter' : 'landing')
        }} />

        {screen === 'auth' ? (
          <AuthForm mode={authMode} onSubmit={handleAuthSubmit} onSwitch={(mode) => { setAuthMode(mode); setAuthError('') }} error={authError} />
        ) : (
          <>
            {view === 'home' && <HomePage onEnter={() => { setView('enter'); setScreen('enter') }} />}
            {view === 'about' && <AboutPage />}
            {view === 'enter' && <EnterPage onLogin={() => { setAuthMode('login'); setScreen('auth') }} onSignup={() => { setAuthMode('signup'); setScreen('auth') }} />}
          </>
        )}
      </div>
    )
  }

  if (screen === 'intro') return (
    <div className="container">
      <div className="topbar">
        <div>Logged in as <strong>{user.email}</strong></div>
        <button className="btn secondary" onClick={handleLogout}>Log out</button>
      </div>
      <IntroPage onStart={() => setScreen('setup')} currency={currency} setCurrency={setCurrency} />
      <SiteFooter />
    </div>
  )

  if (screen === 'setup') return (
    <div className="container">
      <div className="topbar">
        <div>Logged in as <strong>{user.email}</strong></div>
        <button className="btn secondary" onClick={handleLogout}>Log out</button>
      </div>
      <SetupPage currency={currency} onBack={() => setScreen('intro')} onAnalyze={handleAnalyze} budget={budget} setBudget={setBudget} />
      <SiteFooter />
    </div>
  )

  const totalExpenses = CATEGORIES.reduce((s,c)=>s + (Number(budget[c.key]||0)),0)
  const income = Number(budget.income||0)
  const balance = income - totalExpenses
  const savingsRate = income > 0 ? Math.round(((income - totalExpenses) / income) * 100) : 0
  const budgetHealthScore = Math.min(100, Math.max(0, 70 + Math.round((balance / (income || 1)) * 30)))
  const budgetHealth = budgetHealthScore >= 50 ? 'Healthy' : 'Needs review'
  const budgetAdvice = balance >= 0 ? "You're currently under your monthly spending plan. Keep focusing on saving more each month." : 'Your expenses are above your income. Trim optional costs and update your budget categories.'

  const expenseItems = CATEGORIES.map(category => ({
    ...category,
    amount: Number(budget[category.key] || 0)
  })).filter(item => item.amount > 0)

  const savings = Number(budget.savings || 0)
  const goalProgress = Math.min(100, income ? Math.round((savings / income) * 100) : 0)
  const topCategories = [...expenseItems].sort((a,b)=>b.amount - a.amount).slice(0, 4)
  const primaryCategory = topCategories[0]
  const primaryCategoryPct = primaryCategory && totalExpenses ? Math.round((primaryCategory.amount / totalExpenses) * 100) : 0
  const insights = [
    balance >= 0 ? 'You are in surplus, which is a strong foundation for savings.' : 'Your spending currently exceeds your income, so review optional expenses first.',
    primaryCategory ? `${primaryCategory.label} accounts for ${primaryCategoryPct}% of your spending.` : 'Complete your budget to generate category insights.',
    savingsRate >= 20 ? 'Your savings rate is healthy — keep building on it.' : 'Try increasing savings by 5–10% next month.'
  ]

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <div className="dashboard-welcome">{greeting}, <strong>{userName}</strong></div>
          <div className="dashboard-subtitle">Premium finance insights for your monthly goals.</div>
        </div>

        <div className="topbar-actions">
          <button className="btn secondary" onClick={()=>{setScreen('setup'); clearChat()}}>Edit budget</button>
          <button className="btn secondary" onClick={toggleTheme}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          <button className="btn secondary" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className="dashboard-status-row">
        <div className="status-panel card">
          <div className="status-panel-label">Budget health</div>
          <div className="status-panel-value">{budgetHealth}</div>
          <div className="status-panel-copy">{budgetAdvice}</div>
        </div>

        <div className="status-panel card">
          <div className="status-panel-label">Provider status</div>
          <div className={`provider-status ${providerStatus.includes('fallback') ? 'status-fallback' : providerStatus === 'Provider error' ? 'status-error' : 'status-active'}`}>
            {providerStatus}
          </div>
          <div className="status-panel-copy">Choose Gemini AI or local fallback for trusted guidance.</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card dashboard-overview-card">
          <div className="dashboard-card-header">
            <div>
              <div className="summary-label">Performance overview</div>
              <h3>Where your money is going this month</h3>
            </div>
            <div className="dashboard-chip">Score {budgetHealthScore}%</div>
          </div>

          <div className="metrics dashboard-metrics">
            <div className="metric">
              <div className="label">Income</div>
              <div className="value">{currency.symbol}{income.toLocaleString()}</div>
            </div>
            <div className="metric">
              <div className="label">Expenses</div>
              <div className="value">{currency.symbol}{totalExpenses.toLocaleString()}</div>
            </div>
            <div className="metric">
              <div className="label">Net balance</div>
              <div className="value" style={{color: balance >= 0 ? 'var(--brand)' : '#fca5a5'}}>{currency.symbol}{balance.toLocaleString()}</div>
            </div>
            <div className="metric">
              <div className="label">Savings rate</div>
              <div className="value">{savingsRate}%</div>
            </div>
          </div>

          <div className="overview-tiles">
            <div className="tile card">
              <div className="tile-label">Emergency fund progress</div>
              <div className="tile-value">{goalProgress}%</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
              </div>
            </div>
            <div className="tile card">
              <div className="tile-label">Top expense</div>
              <div className="tile-value">{topCategories[0]?.label || 'No expenses yet'}</div>
            </div>
          </div>
        </section>

        <aside className="card dashboard-highlights-card">
          <div className="dashboard-card-header">
            <div>
              <div className="summary-label">Insights</div>
              <h3>Quick growth checks</h3>
            </div>
          </div>

          <div className="highlight-list">
            <div className="highlight-item">
              <span>Housing</span>
              <strong>{currency.symbol}{Number(budget.housing || 0).toLocaleString()}</strong>
            </div>
            <div className="highlight-item">
              <span>Food & wellness</span>
              <strong>{currency.symbol}{Number(budget.food || 0).toLocaleString()}</strong>
            </div>
            <div className="highlight-item">
              <span>Transportation</span>
              <strong>{currency.symbol}{Number(budget.transportation || 0).toLocaleString()}</strong>
            </div>
            <div className="highlight-item">
              <span>Discretionary</span>
              <strong>{currency.symbol}{Number(budget.entertainment || 0).toLocaleString()}</strong>
            </div>
          </div>
        </aside>

        <section className="card dashboard-insights-card">
          <div className="dashboard-card-header">
            <div>
              <div className="summary-label">Recommended next steps</div>
              <h3>Actionable insights</h3>
            </div>
          </div>
          <ul className="insights-list">
            {insights.map((text, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card dashboard-breakdown-card">
          <div className="dashboard-card-header">
            <div>
              <div className="summary-label">Spending breakdown</div>
              <h3>Category-level visibility</h3>
            </div>
          </div>
          <BarChart breakdown={CATEGORIES.reduce((acc,c)=>{acc[c.key]=Number(budget[c.key]||0);return acc},{})} currencySymbol={currency.symbol} />
        </section>

        <section className="card dashboard-chat-card">
          <div className="dashboard-card-header">
            <div>
              <div className="summary-label">AI advisor</div>
              <h3>{provider === 'gemini' ? 'Gemini conversational coach' : 'Local finance assistant'}</h3>
            </div>
            <button className="btn secondary" onClick={() => setProvider(provider === 'gemini' ? 'local' : 'gemini')}>
              Switch to {provider === 'gemini' ? 'Local' : 'Gemini'}
            </button>
          </div>

          <div className="chat">
            <div className="messages" ref={msgRef}>
              {messages.map((m,i)=> <MessageBubble key={i} role={m.role} text={m.content} loading={false} />)}
              {loading && <MessageBubble role="assistant" loading />}
            </div>

            <div className="suggestions">
              {['How can I save more each month?','Am I spending too much on housing?','How do I build an emergency fund?','What\'s a good savings target for my income?'].map((s,i)=>(
                <div className="chip" key={i} onClick={()=>sendUserMessage(s)}>{s}</div>
              ))}
            </div>

            <ChatInput onSend={sendUserMessage} />
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}

function ChatInput({ onSend }){
  const [text,setText] = useState('')
  const onKey = (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }
  const send = ()=>{ if(!text.trim()) return; onSend(text.trim()); setText('') }
  return (
    <div className="chat-send-row">
      <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey} placeholder="Ask the AI advisor anything…" className="chat-input" />
      <button className="btn" onClick={send}>Send</button>
    </div>
  )
}
