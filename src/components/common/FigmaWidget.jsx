import { useState, useEffect } from 'react'
import './FigmaWidget.css'
import { Close } from './Icon'
import { messagesByContact, contacts, currentUser } from '../../data'
import { Avatar, DemoArrow } from './index'

function FigmaPreviewContent({ scenario, onEditClick, showEditArrow, onEditArrowDismiss }) {
  const handleEditClick = (e) => {
    onEditArrowDismiss()
    if (scenario === 'scenario2' || scenario === 'scenario3') {
      e.preventDefault()
      if (onEditClick) onEditClick()
    }
    // For scenario1, let the link open naturally
  }

  return (
    <div className="figma-widget-mock-canvas">
      <div className="figma-mock-frame">
        <div className="figma-mock-shape figma-mock-rect" style={{ top: '15%', left: '10%', width: '30%', height: '20%' }} />
        <div className="figma-mock-shape figma-mock-circle" style={{ top: '15%', left: '50%', width: '15%', height: '26%' }} />
        <div className="figma-mock-shape figma-mock-rect" style={{ top: '50%', left: '10%', width: '55%', height: '8%' }} />
        <div className="figma-mock-shape figma-mock-rect" style={{ top: '62%', left: '10%', width: '45%', height: '8%' }} />
        <div className="figma-mock-shape figma-mock-rect figma-mock-primary" style={{ top: '75%', left: '10%', width: '25%', height: '12%' }} />
      </div>
      {showEditArrow && (
        <div className="figma-edit-arrow" style={{ pointerEvents: 'none' }}>
          <DemoArrow direction="left" size={24} />
        </div>
      )}
      <a
        href="https://figma.com"
        target={scenario === 'scenario1' ? '_blank' : undefined}
        rel={scenario === 'scenario1' ? 'noopener noreferrer' : undefined}
        onClick={handleEditClick}
        className="figma-edit-button"
      >
        Edit in Figma
      </a>
    </div>
  )
}

function CollabStage({ link, onClose, scenario }) {
  const NORTHWIND_CORE_ID = 21
  const northwindCore = contacts.find(c => c.id === NORTHWIND_CORE_ID)
  const allMessages = messagesByContact[NORTHWIND_CORE_ID] || []

  // In Scenario 3, only show the thread for Sarah's Figma message
  const messages = scenario === 'scenario3'
    ? (() => {
        const figmaMessage = allMessages.find(m => m.id === 7)
        if (!figmaMessage) return []
        // Show the parent message + its thread replies
        return [figmaMessage, ...(figmaMessage.replies || [])]
      })()
    : allMessages.slice(-10)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="collab-stage-overlay" onClick={onClose}>
      <div className="collab-stage-container" onClick={(e) => e.stopPropagation()}>
        {/* Left side: Figma preview */}
        <div className="collab-stage-left">
          <div className="collab-stage-header">
            <div className="figma-widget-logo">
              <svg width="16" height="16" viewBox="0 0 38 57">
                <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0z"/>
                <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
                <path fill="#A259FF" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
                <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
                <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
              </svg>
            </div>
            <div className="collab-stage-title">
              <div className="figma-widget-name">{link.title}</div>
              <div className="figma-widget-subtitle">{link.subtitle}</div>
            </div>
          </div>
          <div className="collab-stage-figma-preview">
            <div className="figma-widget-mock-canvas">
              <div className="figma-mock-frame">
                <div className="figma-mock-shape figma-mock-rect" style={{ top: '15%', left: '10%', width: '30%', height: '20%' }} />
                <div className="figma-mock-shape figma-mock-circle" style={{ top: '15%', left: '50%', width: '15%', height: '26%' }} />
                <div className="figma-mock-shape figma-mock-rect" style={{ top: '50%', left: '10%', width: '55%', height: '8%' }} />
                <div className="figma-mock-shape figma-mock-rect" style={{ top: '62%', left: '10%', width: '45%', height: '8%' }} />
                <div className="figma-mock-shape figma-mock-rect figma-mock-primary" style={{ top: '75%', left: '10%', width: '25%', height: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Northwind Core chat */}
        <div className="collab-stage-right">
          <div className="collab-stage-chat-header">
            <Avatar contact={northwindCore} size={24} />
            {scenario === 'scenario3' ? (
              <div className="collab-stage-breadcrumb">
                <span className="breadcrumb-segment">Threads</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-segment breadcrumb-current">Design specs updated. Feedback?</span>
              </div>
            ) : (
              <span className="collab-stage-chat-name">{northwindCore.name}</span>
            )}
            <button
              type="button"
              className="collab-stage-close"
              onClick={onClose}
              aria-label="Close"
            >
              <Close size={20} />
            </button>
          </div>
          <div className="collab-stage-messages">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === 'me'
              const sender = isMe ? currentUser : contacts.find(c => c.id === msg.senderId)
              const isActiveFigma = msg.link && msg.link.source === 'figma' && msg.link.url === link.url
              // First message in scenario3 is the parent, rest are thread replies
              const isParentMessage = scenario === 'scenario3' && index === 0

              return (
                <div key={msg.id} className={`collab-stage-message ${isMe ? 'collab-stage-message-mine' : ''}`}>
                  {!isMe && (
                    <div className="collab-stage-message-avatar">
                      <Avatar contact={sender} size={24} hideStatus />
                    </div>
                  )}
                  <div className="collab-stage-message-content">
                    {!isMe && <div className="collab-stage-message-sender">{sender.name}</div>}
                    <div className="collab-stage-message-bubble">
                      {msg.text}
                      {isActiveFigma && isParentMessage && (
                        <div className="collab-stage-figma-placeholder">
                          <svg width="14" height="14" viewBox="0 0 38 57">
                            <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0z"/>
                            <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
                            <path fill="#A259FF" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
                            <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
                            <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
                          </svg>
                          <span>Viewing in collab stage</span>
                        </div>
                      )}
                    </div>
                    <div className="collab-stage-message-time">{msg.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="collab-stage-compose">
            <input
              type="text"
              placeholder="Type a message..."
              className="collab-stage-compose-input"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FigmaModal({ link, onClose, scenario, onShowCollabStage, showEditArrow, onEditArrowDismiss }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="figma-modal-overlay" onClick={onClose}>
      <div className="figma-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="figma-modal-header">
          <div className="figma-modal-header-left">
            <div className="figma-widget-logo">
              <svg width="16" height="16" viewBox="0 0 38 57">
                <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0z"/>
                <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
                <path fill="#A259FF" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
                <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
                <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
              </svg>
            </div>
            <div className="figma-modal-title">
              <div className="figma-widget-name">{link.title}</div>
              <div className="figma-widget-subtitle">{link.subtitle}</div>
            </div>
          </div>
          <button
            type="button"
            className="figma-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <Close size={20} />
          </button>
        </div>
        <div className="figma-modal-preview">
          <FigmaPreviewContent
            scenario={scenario}
            onEditClick={onShowCollabStage}
            showEditArrow={showEditArrow}
            onEditArrowDismiss={onEditArrowDismiss}
          />
        </div>
      </div>
    </div>
  )
}

export default function FigmaWidget({ link, scenario = 'scenario1' }) {
  // For prototype purposes, show a styled placeholder instead of loading real Figma embeds.
  // In a production implementation, use real Figma embed URLs:
  // https://www.figma.com/embed?embed_host=teams&url=<encoded-file-url>

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCollabStage, setShowCollabStage] = useState(false)
  const [showExpandArrow, setShowExpandArrow] = useState(scenario === 'scenario1')
  // In Scenario 1: edit arrow shows after modal dismissed
  // In Scenarios 2 & 3: edit arrow shows immediately (no expand step)
  const [showEditArrow, setShowEditArrow] = useState(scenario !== 'scenario1')

  // Reset arrow visibility when scenario changes
  useEffect(() => {
    setShowExpandArrow(scenario === 'scenario1')
    setShowEditArrow(scenario !== 'scenario1')
  }, [scenario])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setShowCollabStage(false)
    // Show edit arrow after modal is dismissed
    setShowEditArrow(true)
  }

  const handleShowCollabStage = () => {
    setIsModalOpen(false)
    setShowCollabStage(true)
  }

  const handleExpandClick = () => {
    setShowExpandArrow(false)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="figma-widget">
        <div className="figma-widget-header">
          <div className="figma-widget-logo">
            <svg width="16" height="16" viewBox="0 0 38 57">
              <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 1 1-19 0z"/>
              <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
              <path fill="#A259FF" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
              <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
              <path fill="#FF7262" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
            </svg>
          </div>
          <div className="figma-widget-title">
            <div className="figma-widget-name">{link.title}</div>
            <div className="figma-widget-subtitle">{link.subtitle}</div>
          </div>
          <div style={{ position: 'relative' }}>
            {showExpandArrow && scenario === 'scenario1' && (
              <div className="figma-expand-arrow" style={{ pointerEvents: 'none' }}>
                <DemoArrow direction="left" size={20} />
              </div>
            )}
            <button
              type="button"
              className="figma-widget-expand-btn"
              onClick={handleExpandClick}
              aria-label="Expand"
              title="Expand"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V2.707l-3.146 3.147a.5.5 0 0 1-.708-.708L13.293 2H10.5a.5.5 0 0 1-.5-.5zM1.5 10a.5.5 0 0 1 .5.5v2.793l3.146-3.147a.5.5 0 0 1 .708.708L2.707 14H5.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="figma-widget-preview">
          {/* Mock Figma canvas for prototype - replace with real iframe for production */}
          <FigmaPreviewContent
            scenario={scenario}
            onEditClick={handleShowCollabStage}
            showEditArrow={showEditArrow}
            onEditArrowDismiss={() => setShowEditArrow(false)}
          />
        </div>
      </div>
      {isModalOpen && (
        <FigmaModal
          link={link}
          onClose={handleCloseModal}
          scenario={scenario}
          onShowCollabStage={handleShowCollabStage}
          showEditArrow={showEditArrow}
          onEditArrowDismiss={() => setShowEditArrow(false)}
        />
      )}
      {showCollabStage && (
        <CollabStage link={link} onClose={handleCloseModal} scenario={scenario} />
      )}
    </>
  )
}
