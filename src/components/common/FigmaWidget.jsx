import './FigmaWidget.css'

export default function FigmaWidget({ link }) {
  // For prototype purposes, show a styled placeholder instead of loading real Figma embeds.
  // In a production implementation, use real Figma embed URLs:
  // https://www.figma.com/embed?embed_host=teams&url=<encoded-file-url>

  return (
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
        <a
          href={link.url}
          className="figma-widget-open-link"
          onClick={(e) => e.preventDefault()}
          title="Open in Figma"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 2.5A1.5 1.5 0 0 0 12.5 1h-9A1.5 1.5 0 0 0 2 2.5v4a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-4a.5.5 0 0 0 0 1h4a1.5 1.5 0 0 0 1.5-1.5v-9zM8.354 9.854l5-5a.5.5 0 0 0-.708-.708L8.5 8.293V3.5a.5.5 0 0 0-1 0v4.793L3.354 4.146a.5.5 0 1 0-.708.708l5 5a.5.5 0 0 0 .708 0z"/>
          </svg>
        </a>
      </div>
      <div className="figma-widget-preview">
        {/* Mock Figma canvas for prototype - replace with real iframe for production */}
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
  )
}
