import { useState, useCallback } from 'react'
import { agentSessions as initialSessions, activityEvents as seedActivityEvents } from './data'
import NavRail from './components/NavRail'
import ChatList from './components/ChatList'
import ChatView from './components/ChatView'
import ActivityList from './components/ActivityList'
import TitleBar from './components/TitleBar'
import { FreModal } from './components/common'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState('chat') // 'chat' | 'activity'
  const [activeChatId, setActiveChatId] = useState(1)
  const [readChatIds, setReadChatIds] = useState(() => new Set([1]))
  const [sessions, setSessions] = useState(initialSessions)
  const [dynamicSessionMessages, setDynamicSessionMessages] = useState({})
  // Activity feed: persist which events the user has opened so unread decorations clear.
  const [activityEvents, setActivityEvents] = useState(seedActivityEvents)
  const [activeActivityId, setActiveActivityId] = useState(null)
  // When navigating to a chat, optionally tell ChatView to open a specific
  // session (sessions rail), open a specific channel thread, or flash a
  // specific message so the user can see where a notification landed.
  const [navIntent, setNavIntent] = useState(null)
  // FRE shows on every load while iterating on the prototype — dismiss only
  // hides it for the current session. Swap to localStorage gating later if a
  // real first-run-only behavior is needed.
  const [showFre, setShowFre] = useState(true)
  // Figma scenario selection: 'scenario1' = edit outside Teams, 'scenario2' = edit in Teams Collab Stage
  const [figmaScenario, setFigmaScenario] = useState('scenario1')

  const dismissFre = useCallback(() => setShowFre(false), [])

  const selectChat = useCallback((chatId) => {
    setActiveChatId(chatId)
    setReadChatIds(prev => (prev.has(chatId) ? prev : new Set(prev).add(chatId)))
  }, [])

  const navigateToChat = useCallback((chatId, { showSessions, sessionId } = {}) => {
    selectChat(chatId)
    if (showSessions) setNavIntent({ chatId, sessionId: sessionId || null })
  }, [selectChat])

  const clearNavIntent = useCallback(() => setNavIntent(null), [])

  const addSession = useCallback((agentId, session, messages) => {
    setSessions(prev => ({
      ...prev,
      [agentId]: [session, ...(prev[agentId] || [])],
    }))
    if (messages) {
      setDynamicSessionMessages(prev => ({ ...prev, [session.id]: messages }))
    }
  }, [])

  const updateSession = useCallback((agentId, sessionId, updates) => {
    setSessions(prev => ({
      ...prev,
      [agentId]: (prev[agentId] || []).map(s =>
        s.id === sessionId ? { ...s, ...updates } : s
      ),
    }))
  }, [])

  const updateSessionMessages = useCallback((sessionId, messages) => {
    setDynamicSessionMessages(prev => ({ ...prev, [sessionId]: messages }))
  }, [])

  const selectActivity = useCallback((event) => {
    setActiveActivityId(event.id)
    setActivityEvents(prev =>
      prev.map(e => (e.id === event.id && e.unread ? { ...e, unread: false } : e))
    )
    setActiveChatId(event.chatId)
    setReadChatIds(prev => (prev.has(event.chatId) ? prev : new Set(prev).add(event.chatId)))
    setNavIntent({
      chatId: event.chatId,
      channelThreadPostId: event.postId || null,
      highlightMessageId: event.messageId || null,
    })
  }, [])

  const activityUnreadCount = activityEvents.reduce((n, e) => n + (e.unread ? 1 : 0), 0)

  return (
    <div className="app">
      <TitleBar onShowFre={() => setShowFre(true)} />
      <div className="app-body">
        <NavRail
          activeView={activeView}
          onSelectView={setActiveView}
          activityUnreadCount={activityUnreadCount}
        />
        {activeView === 'activity' ? (
          <ActivityList
            events={activityEvents}
            activeEventId={activeActivityId}
            onSelectEvent={selectActivity}
          />
        ) : (
          <ChatList
            activeChatId={activeChatId}
            onSelectChat={selectChat}
            readChatIds={readChatIds}
          />
        )}
        <ChatView
          activeChatId={activeChatId}
          onSelectChat={navigateToChat}
          sessions={sessions}
          addSession={addSession}
          updateSession={updateSession}
          updateSessionMessages={updateSessionMessages}
          dynamicSessionMessages={dynamicSessionMessages}
          navIntent={navIntent}
          clearNavIntent={clearNavIntent}
          figmaScenario={figmaScenario}
        />
      </div>
      {showFre && (
        <FreModal
          title="Figma HTML Widget Demo"
          subtitle="View and edit Figma designs directly in Teams chat messages."
          onDismiss={dismissFre}
        >
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="scenario-select" style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
              Select Scenario:
            </label>
            <select
              id="scenario-select"
              value={figmaScenario}
              onChange={(e) => setFigmaScenario(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <option value="scenario1">Scenario 1: Edit Figma outside of Teams (most common in MCP apps)</option>
              <option value="scenario2">Scenario 2: Edit Figma in Teams Collab Stage side-by-side</option>
            </select>
          </div>

          <h3 className="fre-section-title">About This Demo</h3>
          <p>
            This prototype demonstrates Figma HTML widgets embedded in Teams chat messages.
            Click the expand button on any Figma widget to view the design in a modal, then
            click "Edit in Figma" to open the design for editing.
          </p>

          <h3 className="fre-section-title">Scenario 1: Edit Outside Teams</h3>
          <p>
            Opens figma.com in a new browser tab. This is the most common pattern in MCP apps
            where external tools are accessed via browser windows.
          </p>

          <h3 className="fre-section-title">Scenario 2: Edit in Collab Stage</h3>
          <p>
            Opens Figma in Teams Collab Stage, allowing side-by-side editing within Teams.
            The Figma editor appears alongside the chat, keeping context visible.
          </p>
        </FreModal>
      )}
    </div>
  )
}
