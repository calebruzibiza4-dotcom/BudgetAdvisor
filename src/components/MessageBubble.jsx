import React from 'react'

export default function MessageBubble({ role, text, avatar, loading }) {
  const isUser = role === 'user'
  return (
    <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
      {!isUser && <div className="ai-avatar">{avatar || '💡'}</div>}
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        {loading ? (
          <div className="typing">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        ) : (
          <div>{text}</div>
        )}
      </div>
    </div>
  )
}
