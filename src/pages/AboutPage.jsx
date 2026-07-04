import React from 'react'

function AboutPage() {
  return (
    <div className="content-page">
      <div className="about-hero">
        <div className="eyebrow">About Budget Advisor</div>
        <h2>Built to give you <span>financial clarity</span></h2>
        <p>Budget Advisor transforms monthly income and expenses into clear insights, practical goals, and smart next steps — through a polished, privacy-first interface.</p>
      </div>

      <h3 className="about-section-title">Why it <span>helps</span></h3>
      <div className="about-why-grid">
        <div className="about-card">
          <div className="about-card-icon">🔍</div>
          <h4>Spot trends fast</h4>
          <p>Breaks down spending into meaningful categories so you can instantly identify where your money is going and what's eating into your savings.</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">📈</div>
          <h4>Know where you stand</h4>
          <p>Highlights your savings rate and surplus/deficit so you always have a clear picture of your financial health at a glance.</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">💡</div>
          <h4>Practical recommendations</h4>
          <p>Offers easy-to-follow, personalized recommendations tailored to your unique budget — no generic advice, just what applies to you.</p>
        </div>
        <div className="about-card">
          <div className="about-card-icon">🔒</div>
          <h4>Privacy first</h4>
          <p>Keeps your data local in the browser so your sensitive financial details never leave your device. No servers. No databases. No risk.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">15K+</div>
          <div className="stat-label">Active users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1.2K+</div>
          <div className="stat-label">Budgets created</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">95%</div>
          <div className="stat-label">Users feel more confident</div>
        </div>
      </div>

      <h3 className="about-section-title">How it <span>works</span></h3>
      <div className="about-how-grid">
        <div className="about-how-card">
          <span className="about-step-num">01</span>
          <h4>Enter your data</h4>
          <p>Start by entering your monthly income and expense amounts across all categories.</p>
        </div>
        <div className="about-how-card">
          <span className="about-step-num">02</span>
          <h4>Instant analysis</h4>
          <p>The app calculates your budget balance, spending mix, and savings potential automatically.</p>
        </div>
        <div className="about-how-card">
          <span className="about-step-num">03</span>
          <h4>Get AI guidance</h4>
          <p>Receive AI-powered advice and recommendations presented in a clean, readable dashboard.</p>
        </div>
      </div>

      <h3 className="about-section-title">What makes it <span>different</span></h3>
      <div className="about-diff-grid">
        <div className="about-diff-card">
          <div className="about-diff-check">✓</div>
          <div>
            <strong>Zero finance jargon</strong>
            <p>Simple setup and plain language throughout — no complicated terminology to decode.</p>
          </div>
        </div>
        <div className="about-diff-card">
          <div className="about-diff-check">✓</div>
          <div>
            <strong>Engaging visuals</strong>
            <p>Responsive cards and interactive charts that guide your next decision with clarity.</p>
          </div>
        </div>
        <div className="about-diff-card">
          <div className="about-diff-check">✓</div>
          <div>
            <strong>AI-powered guidance</strong>
            <p>Turns raw numbers into genuinely useful, actionable advice you can act on today.</p>
          </div>
        </div>
        <div className="about-diff-card">
          <div className="about-diff-check">✓</div>
          <div>
            <strong>Long-term habit focus</strong>
            <p>Designed around saving, spending discipline, and planning for emergencies month after month.</p>
          </div>
        </div>
      </div>

      <div className="about-approach">
        <h3>Our approach</h3>
        <p>We believe budgeting should be empowering, not overwhelming. Budget Advisor helps you build a practical financial routine by showing where your money goes, what you can improve, and how to stay on track month after month.</p>
      </div>
    </div>
  )
}

export default AboutPage
