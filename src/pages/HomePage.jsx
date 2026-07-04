import React from 'react'
import heroImage from '../Pics/hero-design.jpg'
import SiteFooter from '../components/SiteFooter'

function HomePage({ onEnter }) {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Budget Advisor</div>
          <h1>Smart budgeting that helps you keep more of what you <span>earn</span>.</h1>
          <p>Budget Advisor turns your monthly income and expenses into clear financial guidance. Get personalized recommendations, savings targets, and actionable next steps — all in one beautiful dashboard.</p>
          <div className="hero-note">Designed to help you simplify spending, protect your privacy, and take confident daily action.</div>
          <div className="hero-badges">
            <span>Premium finance clarity</span>
            <span>Real-time spending insights</span>
            <span>Privacy-first by design</span>
          </div>
          <div className="hero-actions">
            <button className="btn hero-btn" onClick={onEnter}>Start budgeting now</button>
            <a className="btn secondary hero-btn" href="#trust-section">See why it works</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-frame">
            <div className="visual-glass">
              <img src={heroImage} alt="Budget planning design" />
            </div>
            <div className="visual-accent-card">
              <div className="eyebrow">Made for clarity</div>
              <h3>Refined visuals, effortless budgeting</h3>
              <p>Hover the cards to reveal subtle motion, polished glass textures, and a modern finance workspace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-card-icon">📊</div>
          <h3>Clear financial guidance</h3>
          <p>Receive intelligent observations about your biggest expenses, savings rate, and budget balance.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🏗️</div>
          <h3>Easy budget builder</h3>
          <p>Enter income and expenses once, then let the app analyze your financial picture instantly.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🚀</div>
          <h3>Join and save smarter</h3>
          <p>Create an account to save your progress and jump back into your budget any time.</p>
        </div>
      </section>

      <section className="home-highlights">
        <div className="highlight-card">
          <div className="highlight-value">89%</div>
          <div className="highlight-label">average savings increase in 90 days</div>
        </div>
        <div className="highlight-card">
          <div className="highlight-value">4.8/5</div>
          <div className="highlight-label">user satisfaction score</div>
        </div>
        <div className="highlight-card">
          <div className="highlight-value">1.4K</div>
          <div className="highlight-label">budgets reviewed weekly</div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works-header">
          <div className="eyebrow">How it works</div>
          <h3>Three simple steps to better money decisions.</h3>
        </div>
        <div className="how-it-works-grid">
          <div className="how-step-card">
            <div className="how-step-number">01</div>
            <h4>Enter your budget</h4>
            <p>Add your monthly income and expenses in a few quick steps.</p>
          </div>
          <div className="how-step-card">
            <div className="how-step-number">02</div>
            <h4>Get instant insights</h4>
            <p>See your balance, savings rate, and spending patterns clearly.</p>
          </div>
          <div className="how-step-card">
            <div className="how-step-number">03</div>
            <h4>Follow practical advice</h4>
            <p>Receive clear recommendations to help you save more with confidence.</p>
          </div>
        </div>
      </section>

      <section id="trust-section" className="trust-section">
        <div className="trust-intro">
          <div className="eyebrow">Trusted by thoughtful planners</div>
          <h3>Budgeting that feels calm, clear, and genuinely useful.</h3>
          <p>People use Budget Advisor to turn monthly numbers into confident next steps without the overwhelm of spreadsheets.</p>
        </div>
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-quote">“The advice feels practical, not generic.”</div>
            <div className="trust-name">— Amina, freelance designer</div>
          </div>
          <div className="trust-card">
            <div className="trust-quote">“I finally understand where my money is going.”</div>
            <div className="trust-name">— Daniel, small business owner</div>
          </div>
          <div className="trust-card">
            <div className="trust-quote">“It helped me save without feeling restricted.”</div>
            <div className="trust-name">— Sarah, first-time budgeter</div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

export default HomePage
