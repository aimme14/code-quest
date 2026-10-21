import { useMemo, useState } from 'react'

const USER = {
  firstName: 'Andrea',
  lastName: 'J.',
  role: 'Estudiante',
  initials: 'AJ',
  streak: 4,
  xp: '1.250',
  completed: 12,
}

const LEVELS = [
  {
    id: 1,
    name: 'Abstracción',
    tagline: 'Identifica lo esencial',
    progress: 100,
    color: 'blue',
    action: 'Continuar',
    detail:
      'Aprendiste a separar lo importante de lo accidental. Sigue practicando con retos de modelado.',
  },
  {
    id: 2,
    name: 'Patrones',
    tagline: 'Encuentra la lógica',
    progress: 65,
    color: 'purple',
    action: 'Continuar',
    detail:
      'Estás a mitad de camino. Reconoce repeticiones, analogías y estructuras que se reutilizan.',
  },
  {
    id: 3,
    name: 'Algoritmos',
    tagline: 'Resuelve paso a paso',
    progress: 0,
    color: 'green',
    action: 'Comenzar nivel',
    detail:
      'Cuando termines Patrones, desbloquearás recetas claras para resolver problemas en pasos.',
  },
]

const RETOS = [
  { id: 1, title: 'El mapa de ideas', level: 'Abstracción', status: 'Completado', xp: 80 },
  { id: 2, title: '¿Qué sobra aquí?', level: 'Abstracción', status: 'Completado', xp: 90 },
  { id: 3, title: 'Encuentra el ritmo', level: 'Patrones', status: 'En curso', xp: 110 },
  { id: 4, title: 'La receta secreta', level: 'Algoritmos', status: 'Bloqueado', xp: 130 },
]

const LOGROS = [
  { id: 1, title: 'Primera llama', desc: 'Mantén 3 días de racha', unlocked: true },
  { id: 2, title: 'Exploradora', desc: 'Alcanza el nivel 02', unlocked: true },
  { id: 3, title: 'Coleccionista XP', desc: 'Gana 1.000 puntos', unlocked: true },
  { id: 4, title: 'Maestra de patrones', desc: 'Termina el nivel 02', unlocked: false },
]

function RobotLogo() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <circle cx="21" cy="6" r="2.2" fill="#C4B5FD" />
      <path d="M21 8.2V13" stroke="#C4B5FD" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="7" y="13" width="28" height="22" rx="11" fill="#F8FAFF" />
      <circle cx="16.2" cy="24" r="2.4" fill="#171C4A" />
      <circle cx="25.8" cy="24" r="2.4" fill="#171C4A" />
      <path d="M17.5 29.2c1.4 1.6 5.6 1.6 7 0" stroke="#171C4A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function Icon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const paths = {
    home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />,
    levels: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
    flag: <path d="M6 21V4m0 0h10l-2 4 2 4H6" />,
    star: <path d="m12 3 2.6 6.3L21 10l-4.5 4.3L17.8 21 12 17.6 6.2 21l1.3-6.7L3 10l6.4-.7z" />,
    headset: (
      <>
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <rect x="3" y="13" width="4" height="7" rx="2" />
        <rect x="17" y="13" width="4" height="7" rx="2" />
      </>
    ),
    search: <path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />,
    fire: <path d="M12 3s6 5 6 10a6 6 0 1 1-9.5-4.8C9 10 10 10.5 12 8c0 0 0 4 3 5-3 0-7-2-7-6 0-1.5.7-3.2 2-4z" />,
    check: <path d="M20 6 9 17l-5-5" />,
    diamond: <path d="m12 3 8 9-8 9-8-9z" />,
    nodes: (
      <>
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <path d="M8 12h8M16.2 7.6 8.8 11M16.2 16.4 8.8 13" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

function ProgressRings() {
  const outer = 2 * Math.PI * 84
  const inner = 2 * Math.PI * 64
  return (
    <div className="rings">
      <div className="ring-wrap">
        <svg width="196" height="196" viewBox="0 0 210 210">
          <defs>
            <linearGradient id="outerRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="innerRing" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <circle cx="105" cy="105" r="84" stroke="rgba(255,255,255,0.14)" strokeWidth="13" fill="none" />
          <circle
            cx="105"
            cy="105"
            r="84"
            stroke="url(#outerRing)"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${outer * 0.82} ${outer}`}
            transform="rotate(-90 105 105)"
          />
          <circle cx="105" cy="105" r="64" stroke="rgba(255,255,255,0.12)" strokeWidth="11" fill="none" />
          <circle
            cx="105"
            cy="105"
            r="64"
            stroke="url(#innerRing)"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${inner * 0.68} ${inner}`}
            transform="rotate(-90 105 105)"
          />
          <circle cx="105" cy="105" r="46" fill="rgba(255,255,255,0.07)" />
        </svg>
        <div className="ring-label">Nivel 02 · Explorador</div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('inicio')
  const [query, setQuery] = useState('')
  const [openLevel, setOpenLevel] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredLevels = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return LEVELS
    return LEVELS.filter((level) => `${level.name} ${level.tagline}`.toLowerCase().includes(q))
  }, [query])

  const go = (next) => {
    setPage(next)
    setSidebarOpen(false)
  }

  const continueLearning = () => {
    const next = LEVELS.find((level) => level.progress < 100) ?? LEVELS[0]
    setOpenLevel(next)
  }

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <RobotLogo />
          <div className="brand-copy">
            <strong>CodeQuest</strong>
            <span>APRENDE PROGRAMANDO</span>
          </div>
        </div>

        <nav className="nav">
          <button className={`nav-btn ${page === 'inicio' ? 'active' : ''}`} onClick={() => go('inicio')}>
            <Icon name="home" /> Inicio
          </button>
          <button className={`nav-btn ${page === 'niveles' ? 'active' : ''}`} onClick={() => go('niveles')}>
            <Icon name="levels" /> Mis niveles
          </button>
          <button className={`nav-btn ${page === 'retos' ? 'active' : ''}`} onClick={() => go('retos')}>
            <Icon name="flag" /> Retos
          </button>
          <button className={`nav-btn ${page === 'logros' ? 'active' : ''}`} onClick={() => go('logros')}>
            <Icon name="star" /> Logros
          </button>
        </nav>

        <div className="space-label">TU ESPACIO</div>
        <button className={`help-btn ${page === 'ayuda' ? 'active' : ''}`} onClick={() => go('ayuda')}>
          <Icon name="headset" /> ¿Necesitas ayuda?
        </button>

        <div className="sidebar-foot">
          <div className="q-mark">?</div>
          <div>
            <h4>Sigue explorando</h4>
            <p>Cada reto te acerca más.</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <button className="mobile-toggle" onClick={() => setSidebarOpen((v) => !v)} aria-label="Menú">
              <Icon name="menu" />
            </button>
            <div className="greeting">
              <h1>¡Hola, {USER.firstName}! 👋</h1>
              <p>Tu próxima aventura de programación empieza aquí.</p>
            </div>
          </div>
          <div className="top-actions">
            <label className="search">
              <Icon name="search" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
              />
            </label>
            <div className="profile">
              <div className="avatar">{USER.initials}</div>
              <div>
                <strong>
                  {USER.firstName} {USER.lastName}
                </strong>
                <span>{USER.role}</span>
              </div>
            </div>
          </div>
        </header>

        {page === 'inicio' && (
          <section className="page">
            <div className="hero">
              <div>
                <p className="kicker">TU CAMINO DE APRENDIZAJE</p>
                <h2>¡Conviértete en una leyenda del código!</h2>
                <p>Completa retos, gana puntos y desbloquea nuevas habilidades.</p>
                <button className="cta" onClick={continueLearning}>
                  Continuar aprendiendo →
                </button>
              </div>
              <ProgressRings />
            </div>

            <div className="stats">
              <article className="stat">
                <div className="icon-box orange">
                  <Icon name="fire" />
                </div>
                <div>
                  <span>Racha actual</span>
                  <strong>{USER.streak} días</strong>
                </div>
              </article>
              <article className="stat">
                <div className="icon-box yellow">
                  <Icon name="star" />
                </div>
                <div>
                  <span>Puntos ganados</span>
                  <strong>{USER.xp} XP</strong>
                </div>
              </article>
              <article className="stat">
                <div className="icon-box green">
                  <Icon name="check" />
                </div>
                <div>
                  <span>Retos completados</span>
                  <strong>{USER.completed} retos</strong>
                </div>
              </article>
            </div>

            <div className="section-head">
              <h3>Continúa tu aventura</h3>
              <button className="link" onClick={() => go('niveles')}>
                Ver todos los niveles
              </button>
            </div>

            <div className="levels">
              {filteredLevels.map((level) => (
                <article className="level-card" key={level.id}>
                  <div className="level-top">
                    <div className={`icon-box ${level.color}`}>
                      <Icon name={level.color === 'blue' ? 'diamond' : level.color === 'purple' ? 'levels' : 'nodes'} />
                    </div>
                    <span className="level-tag">NIVEL 0{level.id}</span>
                  </div>
                  <h4>{level.name}</h4>
                  <p className="meta">{level.tagline}</p>
                  <div className={`bar ${level.color}`}>
                    <span style={{ width: `${level.progress}%` }} />
                  </div>
                  <div className="level-bottom">
                    <span className="pct">{level.progress}%</span>
                    <button className={`btn ${level.color}`} onClick={() => setOpenLevel(level)}>
                      {level.action} →
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {filteredLevels.length === 0 && <p className="muted">No hay niveles que coincidan con “{query}”.</p>}
            <p className="page-foot">Pequeños pasos, grandes ideas. ¡Tú puedes!</p>
          </section>
        )}

        {page === 'niveles' && (
          <section className="page">
            <div className="section-head">
              <h3>Mis niveles</h3>
            </div>
            <div className="levels">
              {LEVELS.map((level) => (
                <article className="level-card" key={level.id}>
                  <div className="level-top">
                    <div className={`icon-box ${level.color}`}>
                      <Icon name={level.color === 'blue' ? 'diamond' : level.color === 'purple' ? 'levels' : 'nodes'} />
                    </div>
                    <span className="level-tag">NIVEL 0{level.id}</span>
                  </div>
                  <h4>{level.name}</h4>
                  <p className="meta">{level.tagline}</p>
                  <p className="muted">{level.detail}</p>
                  <div className={`bar ${level.color}`}>
                    <span style={{ width: `${level.progress}%` }} />
                  </div>
                  <div className="level-bottom">
                    <span className="pct">{level.progress}%</span>
                    <button className={`btn ${level.color}`} onClick={() => setOpenLevel(level)}>
                      {level.action} →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'retos' && (
          <section className="page">
            <div className="section-head">
              <h3>Retos</h3>
            </div>
            <div className="reto-list">
              {RETOS.map((reto) => (
                <article className="reto-card" key={reto.id}>
                  <div>
                    <h4 style={{ margin: 0 }}>{reto.title}</h4>
                    <p className="muted">
                      {reto.level} · {reto.xp} XP
                    </p>
                  </div>
                  <span className={`chip ${reto.status === 'Completado' ? 'done' : reto.status === 'Bloqueado' ? 'lock' : ''}`}>
                    {reto.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'logros' && (
          <section className="page">
            <div className="section-head">
              <h3>Logros</h3>
            </div>
            <div className="badge-grid">
              {LOGROS.map((item) => (
                <article className={`badge-card ${item.unlocked ? '' : 'locked'}`} key={item.id}>
                  <div className={`icon-box ${item.unlocked ? 'yellow' : ''}`}>
                    <Icon name="star" />
                  </div>
                  <h4 style={{ marginBottom: 4 }}>{item.title}</h4>
                  <p className="muted">{item.desc}</p>
                  <span className={`chip ${item.unlocked ? 'done' : 'lock'}`}>
                    {item.unlocked ? 'Desbloqueado' : 'Por desbloquear'}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'ayuda' && (
          <section className="page grid-2">
            <article className="panel help-card">
              <div className="icon-box purple">
                <Icon name="headset" />
              </div>
              <div>
                <h3>¿Necesitas ayuda?</h3>
                <p className="muted">
                  Estamos para acompañarte. Revisa las pistas de cada reto o continúa desde el último nivel que dejaste a medias.
                </p>
                <button className="cta" onClick={continueLearning}>
                  Seguir donde me quedé →
                </button>
              </div>
            </article>
            <article className="panel">
              <h3>Consejo del día</h3>
              <p className="muted">
                Si un reto se siente grande, divídelo. Esa es exactamente la idea detrás de Abstracción y Algoritmos.
              </p>
            </article>
          </section>
        )}
      </main>

      {openLevel && (
        <div className="modal-backdrop" onClick={() => setOpenLevel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="kicker" style={{ color: '#8b91ab' }}>
              NIVEL 0{openLevel.id}
            </p>
            <h3>{openLevel.name}</h3>
            <p className="muted">{openLevel.detail}</p>
            <div className={`bar ${openLevel.color}`}>
              <span style={{ width: `${openLevel.progress}%` }} />
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setOpenLevel(null)}>
                Cerrar
              </button>
              <button className={`btn ${openLevel.color}`} onClick={() => setOpenLevel(null)}>
                {openLevel.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
