import { useState } from 'react';
import './App.css';

// --- MOCK DATA ---
const MOCK_USERS = [
  { id: 1, name: 'Kouamé Adou', email: 'koua.adou@email.com', role: 'Assuré Principal', status: 'Actif', lastActive: 'Il y a 5 min', loanAmount: '350 000 FCFA', progression: 75, registrationDate: '12/01/2024' },
  { id: 2, name: 'Awa Koné', email: 'awa.kone@test.ci', role: 'Assuré Principal', status: 'En attente', lastActive: 'Il y a 2h', loanAmount: '120 000 FCFA', progression: 40, registrationDate: '15/02/2024' },
  { id: 3, name: 'Marc Traoré', email: 'm.traore@web.com', role: 'Assuré Secondaire', status: 'Inactif', lastActive: 'Hier', loanAmount: '0 FCFA', progression: 10, registrationDate: '01/03/2024' },
  { id: 4, name: 'Fatou Diallo', email: 'fatou.d@email.ci', role: 'Assuré Principal', status: 'Actif', lastActive: 'Il y a 10 min', loanAmount: '750 000 FCFA', progression: 100, registrationDate: '20/12/2023' },
];

const MOCK_BANKS = [
  { id: 1, name: 'SGCI', fullName: 'Société Générale Côte d\'Ivoire', activeLoans: 145, rate: '7.9%', liquidity: 'Haute', status: 'Online', processingTime: '2.4 jours' },
  { id: 2, name: 'BNI', fullName: 'Banque Nationale d\'Investissement', activeLoans: 89, rate: '9.2%', liquidity: 'Moyenne', status: 'Online', processingTime: '3.1 jours' },
  { id: 3, name: 'Ecobank', fullName: 'Ecobank Côte d\'Ivoire', activeLoans: 210, rate: '10.5%', liquidity: 'Très Haute', status: 'Offline', processingTime: '1.8 jours' },
];

const MOCK_APPLICATIONS = [
  { id: 'APP-001', user: 'Awa Koné', amount: '120 000 FCFA', care: 'Bilan de santé', date: '16 Mai 2024', status: 'Nouveau', risk: 'Faible', docs: ['CNI', 'Salaire', 'RIB'], scoring: 82 },
  { id: 'APP-002', user: 'Jean Koffi', amount: '450 000 FCFA', care: 'Dentaire', date: '15 Mai 2024', status: 'En examen', risk: 'Moyen', docs: ['CNI', 'Salaire'], scoring: 64 },
  { id: 'APP-003', user: 'Saliou Diop', amount: '900 000 FCFA', care: 'Accouchement', date: '14 Mai 2024', status: 'Vérification', risk: 'Faible', docs: ['CNI', 'Salaire', 'RIB', 'Devis'], scoring: 91 },
];

const MOCK_LOGS = [
  { id: 1, action: 'Nouvelle Simulation', user: 'Kouamé Adou', time: '14:20', type: 'System' },
  { id: 2, action: 'Document Validé', user: 'SGCI (Admin)', time: '13:45', type: 'Security' },
  { id: 3, action: 'Tentative de Connexion', user: 'Inconnu (IP: 192.168.1.1)', time: '12:10', type: 'Warning' },
  { id: 4, action: 'Mise à jour Taux', user: 'Admin', time: '10:00', type: 'Config' },
];

function App() {
  // --- AUTH & GLOBAL STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'user', 'admin', 'bank'
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [toast, setToast] = useState(null);

  // --- USER SPECIFIC STATE ---
  const [careType, setCareType] = useState(1);
  const [amount, setAmount] = useState(250000);
  const [duration, setDuration] = useState(12);
  const [kycDocs, setKycDocs] = useState({ cni: true, salaire: true, releve: false, devis: false });

  // --- UTILS ---
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(prev => prev === text ? null : prev), 4000);
  };

  const formatFCFA = (val) => new Intl.NumberFormat('fr-FR').format(Math.round(val)) + ' FCFA';

  const calculateLoanSim = (principal, months, annualRate = 0.085) => {
    const r = annualRate / 12;
    const m = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    return { monthly: Math.round(m), total: Math.round(m * months), rate: annualRate * 100 };
  };

  const currentSim = calculateLoanSim(amount, duration);
  const kycPercentage = Math.round((Object.values(kycDocs).filter(Boolean).length / 4) * 100);

  // --- ACTIONS ---
  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    showToast(`Session pilotage active : ${role.toUpperCase()}`);
  };

  const handleRoleSwitch = (role) => {
    setUserRole(role);
    setActiveTab('dashboard');
    showToast(`Mode ${role.toUpperCase()} activé`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab('dashboard');
  };

  const navigateToTab = (id) => {
    console.log(`Navigating to tab: ${id}`);
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- MAIN RENDER ---
  if (!isLoggedIn) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      {toast && <div className="toast-notification animate-slide-in"><i className="ti ti-circle-check"></i><span>{toast}</span></div>}
      
      <Sidebar 
        userRole={userRole} 
        activeTab={activeTab} 
        navigateToTab={navigateToTab} 
        handleLogout={handleLogout} 
      />

      <main className="app-main-content">
        <header className="top-bar">
          <div className="search-box">
            <i className="ti ti-search"></i>
            <input type="text" placeholder="Rechercher un dossier, un patient..." />
          </div>
          
          <div className="top-actions">
            <div className="pilotage-control glass-panel">
              <div className="control-header">
                <i className="ti ti-adjustments-horizontal"></i>
                <span>Pilotage Système</span>
              </div>
              <div className="role-switcher-tabs">
                <button 
                  className={`role-tab ${userRole === 'user' ? 'active' : ''}`} 
                  onClick={() => handleRoleSwitch('user')}
                >
                  <i className="ti ti-user"></i>
                  <span>Client</span>
                </button>
                <button 
                  className={`role-tab ${userRole === 'bank' ? 'active' : ''}`} 
                  onClick={() => handleRoleSwitch('bank')}
                >
                  <i className="ti ti-building-bank"></i>
                  <span>Banque</span>
                </button>
                <button 
                  className={`role-tab ${userRole === 'admin' ? 'active' : ''}`} 
                  onClick={() => handleRoleSwitch('admin')}
                >
                  <i className="ti ti-shield-check"></i>
                  <span>Admin</span>
                </button>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <button className="icon-btn" onClick={() => showToast("Notifications consultées")}>
              <i className="ti ti-bell"></i>
              <span className="dot"></span>
            </button>
            
            <div className="system-status">
              <span className="status-dot online"></span>
              <span className="status-text">API Cloud Online</span>
            </div>
          </div>
        </header>

        <div className="content-container">
          {userRole === 'admin' && activeTab === 'dashboard' && <AdminDashboard />}
          {userRole === 'bank' && activeTab === 'dashboard' && <BankDashboard />}
          {userRole === 'user' && activeTab === 'dashboard' && <UserDashboard navigateToTab={navigateToTab} kycPercentage={kycPercentage} />}
          {activeTab === 'simulateur' && <SimulationView careType={careType} setCareType={setCareType} amount={amount} setAmount={setAmount} duration={duration} setDuration={setDuration} currentSim={currentSim} formatFCFA={formatFCFA} navigateToTab={navigateToTab} showToast={showToast} />}
          {activeTab === 'documents' && <DocumentsView kycDocs={kycDocs} setKycDocs={setKycDocs} />}
          {userRole === 'admin' && activeTab === 'users' && <UsersListView />}
          {userRole === 'admin' && activeTab === 'banks' && <BanksListView />}
          {userRole === 'admin' && activeTab === 'logs' && <LogsListView />}
          {activeTab === 'help' && <HelpCenterView />}
          {activeTab === 'settings' && <SettingsView />}
          
          {/* Fallback for tabs in development */}
          {(activeTab !== 'dashboard' && activeTab !== 'simulateur' && activeTab !== 'documents' && activeTab !== 'users' && activeTab !== 'banks' && activeTab !== 'logs' && activeTab !== 'help' && activeTab !== 'settings') && (
            <div className="empty-state animate-fade-in">
              <i className="ti ti-tool"></i>
              <h2>Module en cours de déploiement</h2>
              <p>L'interface de pilotage pour <b>{activeTab}</b> est en cours de configuration par l'équipe technique.</p>
              <button className="btn-premium secondary" onClick={() => setActiveTab('dashboard')}>Retour au Dashboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (Outside for stability) ---

const LoginView = ({ onLogin }) => (
  <div className="login-gateway animate-fade-in">
    <div className="gateway-overlay"></div>
    <div className="login-card-enterprise glass-panel">
      <div className="brand-header">
        <div className="brand-logo-main">
          <div className="brand-icon-wrapper-large"><i className="ti ti-heart-rate-monitor"></i></div>
          <span>Prêt Santé</span>
        </div>
        <div className="gateway-status">
          <span className="status-dot online"></span>
          Interface de Pilotage v2.1
        </div>
      </div>
      
      <div className="login-intro">
        <h2>Portail d'Accès Sécurisé</h2>
        <p>Veuillez sélectionner votre espace de travail pour accéder aux outils de gestion.</p>
      </div>

      <div className="role-grid-enterprise">
        <div className="role-card admin" onClick={() => onLogin('admin')}>
          <div className="role-card-icon"><i className="ti ti-shield-lock"></i></div>
          <div className="role-card-body">
            <h3>Super Administrateur</h3>
            <p>Contrôle total, monitoring réseau et logs de sécurité.</p>
          </div>
          <div className="role-card-arrow"><i className="ti ti-chevron-right"></i></div>
        </div>

        <div className="role-card bank" onClick={() => onLogin('bank')}>
          <div className="role-card-icon"><i className="ti ti-building-bank"></i></div>
          <div className="role-card-body">
            <h3>Établissement Bancaire</h3>
            <p>Gestion des risques, validation KYC et déblocage de fonds.</p>
          </div>
          <div className="role-card-arrow"><i className="ti ti-chevron-right"></i></div>
        </div>

        <div className="role-card user" onClick={() => onLogin('user')}>
          <div className="role-card-icon"><i className="ti ti-user-circle"></i></div>
          <div className="role-card-body">
            <h3>Espace Client</h3>
            <p>Suivi de santé financière, simulations et formalités.</p>
          </div>
          <div className="role-card-arrow"><i className="ti ti-chevron-right"></i></div>
        </div>
      </div>

      <div className="login-legal">
        <p>Accès strictement réservé aux personnels autorisés. Les activités de pilotage sont journalisées.</p>
        <div className="legal-links">
          <span>Mentions Légales</span>
          <span className="dot-sep"></span>
          <span>Sécurité & Confidentialité</span>
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = ({ userRole, activeTab, navigateToTab, handleLogout }) => (
  <aside className="app-sidebar">
    <div className="sidebar-brand">
      <div className="brand-icon-wrapper mini"><i className="ti ti-heart-rate-monitor"></i></div>
      <span>Prêt Santé</span>
    </div>
    <div className="sidebar-nav">
      <div className="nav-group">
        <label>MENU PRINCIPAL</label>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => navigateToTab('dashboard')}>
          <i className="ti ti-layout-dashboard"></i> Vue d'ensemble
        </button>
        {userRole === 'admin' && (
          <>
            <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => navigateToTab('users')}>
              <i className="ti ti-users"></i> Utilisateurs
            </button>
            <button className={`nav-item ${activeTab === 'banks' ? 'active' : ''}`} onClick={() => navigateToTab('banks')}>
              <i className="ti ti-building-community"></i> Réseau Bancaire
            </button>
            <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => navigateToTab('logs')}>
              <i className="ti ti-history"></i> Logs Système
            </button>
          </>
        )}
        {userRole === 'bank' && (
          <>
            <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => navigateToTab('requests')}>
              <i className="ti ti-file-description"></i> Demandes en cours
            </button>
            <button className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => navigateToTab('risk')}>
              <i className="ti ti-chart-dots"></i> Analyse de Risque
            </button>
          </>
        )}
        {userRole === 'user' && (
          <>
            <button className={`nav-item ${activeTab === 'simulateur' ? 'active' : ''}`} onClick={() => navigateToTab('simulateur')}>
              <i className="ti ti-calculator"></i> Simulateur
            </button>
            <button className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => navigateToTab('documents')}>
              <i className="ti ti-file-certificate"></i> Mes Formalités
            </button>
          </>
        )}
      </div>
      <div className="nav-group">
        <label>ASSISTANCE</label>
        <button className={`nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => navigateToTab('help')}>
          <i className="ti ti-help-octagon"></i> Centre d'aide
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => navigateToTab('settings')}>
          <i className="ti ti-settings"></i> Système
        </button>
      </div>
    </div>
    <div className="sidebar-footer">
      <div className="user-profile-summary">
        <div className="avatar-mini">{userRole ? userRole[0].toUpperCase() : 'A'}</div>
        <div className="u-info">
          <strong>{userRole === 'admin' ? 'Super Admin' : userRole === 'bank' ? 'SGCI Ops' : 'K. Adou'}</strong>
          <span>{userRole ? userRole.toUpperCase() : ''}</span>
        </div>
        <button className="btn-logout-icon" onClick={handleLogout} title="Déconnexion"><i className="ti ti-logout"></i></button>
      </div>
    </div>
  </aside>
);

const AdminDashboard = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Vision 360° du Système</h1>
        <p className="subtitle">Supervision en temps réel des flux de santé et financiers</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium secondary"><i className="ti ti-refresh"></i> Actualiser</button>
        <button className="btn-premium primary"><i className="ti ti-download"></i> Rapport Global</button>
      </div>
    </div>
    
    <div className="stats-strip">
      <div className="mini-stat">
        <div className="m-icon-mini system"><i className="ti ti-users"></i></div>
        <div className="m-data"><span>Utilisateurs Actifs</span><strong>1,420</strong><em className="up">+12%</em></div>
      </div>
      <div className="mini-stat">
        <div className="m-icon-mini finance"><i className="ti ti-currency-bitcoin"></i></div>
        <div className="m-data"><span>Volume Crédit</span><strong>142.5 M</strong><em className="up">+5.8%</em></div>
      </div>
      <div className="mini-stat">
        <div className="m-icon-mini bank"><i className="ti ti-building-community"></i></div>
        <div className="m-data"><span>Banques Partenaires</span><strong>8</strong><em>Stable</em></div>
      </div>
      <div className="mini-stat">
        <div className="m-icon-mini speed"><i className="ti ti-bolt"></i></div>
        <div className="m-data"><span>Temps de Réponse</span><strong>1.2s</strong><em className="up">Excellent</em></div>
      </div>
    </div>

    <div className="dashboard-grid-360">
      <div className="grid-main-card glass-panel">
        <div className="card-header">
          <h3>Monitoring des Flux (24h)</h3>
          <div className="header-tabs">
            <button className="active">Utilisateurs</button>
            <button>Banques</button>
            <button>Système</button>
          </div>
        </div>
        <div className="logs-timeline enterprise">
          {MOCK_LOGS.map(log => (
            <div className="log-entry-premium" key={log.id}>
              <div className={`log-type-indicator ${log.type.toLowerCase()}`}></div>
              <div className="log-content">
                <div className="log-row">
                  <span className="log-action-text">{log.action}</span>
                  <span className="log-time-text">{log.time}</span>
                </div>
                <div className="log-row">
                  <span className="log-user-text">Par <b>{log.user}</b></span>
                  <span className={`log-badge ${log.type.toLowerCase()}`}>{log.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid-side-panel">
        <div className="glass-panel status-card-premium">
          <h3>Santé du Réseau Bancaire</h3>
          <div className="network-health-list">
            {MOCK_BANKS.map(b => (
              <div className="bank-status-row" key={b.id}>
                <div className="bank-meta">
                  <div className="bank-name-group">
                    <strong>{b.name}</strong>
                    <span className={`status-pill-mini ${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                  <span className="bank-load">{b.activeLoans} prêts actifs</span>
                </div>
                <div className="bank-perf-bar">
                  <div className="perf-fill" style={{ width: b.id === 1 ? '85%' : b.id === 2 ? '70%' : '20%', background: b.status === 'Online' ? 'var(--color-brand-primary)' : '#94a3b8' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel security-card-premium">
          <div className="card-header">
            <h3>Alertes de Sécurité</h3>
            <span className="alert-count">2</span>
          </div>
          <div className="alert-list-premium">
            <div className="alert-item-premium high">
              <i className="ti ti-shield-alert"></i>
              <div className="alert-text">
                <strong>Anomalie KYC</strong>
                <p>Détection de documents non conformes (IP: 192.168.1.1)</p>
              </div>
            </div>
            <div className="alert-item-premium info">
              <i className="ti ti-settings-automation"></i>
              <div className="alert-text">
                <strong>Optimisation Cloud</strong>
                <p>Mise à jour des clusters prévue à 02:00 GMT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel performance-card-premium">
          <h3>Performance Clusters</h3>
          <div className="performance-grid">
            <div className="perf-node"><span>CPU</span><div className="node-val">24%</div></div>
            <div className="perf-node"><span>RAM</span><div className="node-val">4.2GB</div></div>
            <div className="perf-node"><span>DISK</span><div className="node-val">62%</div></div>
            <div className="perf-node"><span>NET</span><div className="node-val">12ms</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UsersListView = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Gestion des Utilisateurs</h1>
        <p className="subtitle">Base de données des assurés et suivi des dossiers individuels</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium secondary"><i className="ti ti-filter"></i> Filtrer</button>
        <button className="btn-premium primary"><i className="ti ti-user-plus"></i> Ajouter un assuré</button>
      </div>
    </div>

    <div className="glass-panel table-container-premium">
      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Identité</th>
              <th>Status</th>
              <th>Rôle</th>
              <th>Crédit Actif</th>
              <th>Progression</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-profile-cell">
                    <div className="avatar-mini">{user.name[0]}</div>
                    <div className="u-meta">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill-mini ${user.status === 'Actif' ? 'online' : user.status === 'En attente' ? 'warning' : 'offline'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.role}</td>
                <td className="font-mono">{user.loanAmount}</td>
                <td>
                  <div className="progress-container-mini">
                    <div className="progress-bar-mini">
                      <div className="fill" style={{ width: `${user.progression}%` }}></div>
                    </div>
                    <span>{user.progression}%</span>
                  </div>
                </td>
                <td>{user.registrationDate}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon-btn" title="Voir le profil"><i className="ti ti-eye"></i></button>
                    <button className="action-icon-btn" title="Modifier"><i className="ti ti-edit"></i></button>
                    <button className="action-icon-btn delete" title="Suspendre"><i className="ti ti-ban"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const BanksListView = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Réseau Bancaire Partenaire</h1>
        <p className="subtitle">Gestion des établissements, taux en vigueur et liquidités</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium primary"><i className="ti ti-plus"></i> Nouveau Partenaire</button>
      </div>
    </div>
    <div className="glass-panel table-container-premium">
      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Banque</th>
              <th>Nom Complet</th>
              <th>Prêts Actifs</th>
              <th>Taux Moyen</th>
              <th>Liquidité</th>
              <th>Temps de Traitement</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BANKS.map(bank => (
              <tr key={bank.id}>
                <td className="font-bold">{bank.name}</td>
                <td>{bank.fullName}</td>
                <td>{bank.activeLoans}</td>
                <td className="font-mono text-brand">{bank.rate}</td>
                <td>
                  <span className={`status-pill-mini ${bank.liquidity === 'Haute' || bank.liquidity === 'Très Haute' ? 'online' : 'warning'}`}>
                    {bank.liquidity}
                  </span>
                </td>
                <td>{bank.processingTime}</td>
                <td><span className={`status-dot ${bank.status.toLowerCase()}`}></span> {bank.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const LogsListView = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Journal d'Audit Système</h1>
        <p className="subtitle">Traçabilité complète des actions utilisateurs et événements de sécurité</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium secondary"><i className="ti ti-trash"></i> Purger</button>
        <button className="btn-premium primary"><i className="ti ti-download"></i> Exporter CSV</button>
      </div>
    </div>
    <div className="glass-panel logs-list-full">
      {MOCK_LOGS.map(log => (
        <div className="log-entry-premium" key={log.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '1.25rem' }}>
          <div className={`log-type-indicator ${log.type.toLowerCase()}`}></div>
          <div className="log-content" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="log-main">
              <div className="log-action-text" style={{ fontSize: '1rem', fontWeight: '600' }}>{log.action}</div>
              <div className="log-user-text">Initié par <b>{log.user}</b></div>
            </div>
            <div className="log-meta" style={{ textAlign: 'right' }}>
              <div className="log-time-text" style={{ fontWeight: '700' }}>{log.time}</div>
              <span className={`log-badge ${log.type.toLowerCase()}`}>{log.type}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BankDashboard = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Gestionnaire de Crédit · SGCI</h1>
        <p className="subtitle">Traitement des formalités et déblocage de fonds</p>
      </div>
      <div className="header-actions">
        <span className="status-pill active-glow">
          <i className="ti ti-antenna"></i> Connecté à Risk-Ops
        </span>
      </div>
    </div>

    <div className="dashboard-grid-requests">
      <div className="requests-list-container">
        <div className="section-header-premium">
          <h3>Dossiers en attente de décision</h3>
          <div className="filter-group">
            <button className="filter-btn active">Tout</button>
            <button className="filter-btn">Risque Faible</button>
            <button className="filter-btn">Risque Moyen</button>
          </div>
        </div>
        <div className="requests-vertical-list">
          {MOCK_APPLICATIONS.map(app => (
            <div className="request-strip-premium glass-panel" key={app.id}>
              <div className="r-avatar-group">
                <div className="r-avatar-main">{app.user[0]}</div>
                <div className="r-risk-dot" style={{ background: app.risk === 'Faible' ? 'var(--color-status-success)' : 'var(--color-status-warning)' }}></div>
              </div>
              <div className="r-main-info">
                <div className="r-header-line">
                  <strong>{app.user}</strong>
                  <span className="r-id">{app.id}</span>
                </div>
                <div className="r-meta-line">
                  <span>{app.care}</span>
                  <span className="dot-sep"></span>
                  <span>{app.date}</span>
                </div>
              </div>
              <div className="r-scoring-premium">
                <div className="score-ring" style={{ borderLeftColor: app.scoring > 80 ? 'var(--color-status-success)' : 'var(--color-status-warning)' }}>
                  {app.scoring}
                </div>
                <div className="score-lbl">Score Risk</div>
              </div>
              <div className="r-amount-premium">
                <span className="amount-val">{app.amount}</span>
                <span className="amount-label">Montant demandé</span>
              </div>
              <div className="r-actions-premium">
                <button className="btn-action view" title="Examiner les formalités"><i className="ti ti-file-search"></i></button>
                <button className="btn-action approve" title="Accorder le prêt"><i className="ti ti-check"></i></button>
                <button className="btn-action reject" title="Rejeter"><i className="ti ti-x"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="risk-summary-panel">
        <div className="glass-panel audit-panel-premium">
          <div className="audit-header">
            <i className="ti ti-database-check"></i>
            <h3>Audit IA-KYC</h3>
          </div>
          <p className="audit-intro">Vérification temps réel des documents fournis par l'assuré.</p>
          
          <div className="doc-audit-stack">
            <div className="audit-item success">
              <div className="ai-ico"><i className="ti ti-id"></i></div>
              <div className="ai-body">
                <strong>CNI / Passeport</strong>
                <span>Validité : 100% · OCR OK</span>
              </div>
              <i className="ti ti-circle-check"></i>
            </div>
            <div className="audit-item success">
              <div className="ai-ico"><i className="ti ti-file-analytics"></i></div>
              <div className="ai-body">
                <strong>Bulletins Salaire</strong>
                <span>Revenu stable détecté</span>
              </div>
              <i className="ti ti-circle-check"></i>
            </div>
            <div className="audit-item pending">
              <div className="ai-ico"><i className="ti ti-building-bank"></i></div>
              <div className="ai-body">
                <strong>Relevé Bancaire</strong>
                <span>Analyse des flux en cours</span>
              </div>
              <div className="loader-mini"></div>
            </div>
          </div>
          
          <div className="risk-meter">
            <div className="meter-label"><span>Indice de confiance global</span><strong>89%</strong></div>
            <div className="meter-bar"><div className="meter-fill" style={{ width: '89%' }}></div></div>
          </div>
          
          <button className="btn-premium primary w-full">Générer Contrat de Prêt</button>
          <button className="btn-premium secondary w-full">Demander Complément</button>
        </div>

        <div className="glass-panel payout-history-card">
          <div className="card-header">
            <h3>Décaissements Récents</h3>
            <i className="ti ti-receipt"></i>
          </div>
          <div className="payout-list">
            <div className="payout-row">
              <span>S. Touré</span>
              <strong>450k</strong>
              <em className="date">Aujourd'hui</em>
            </div>
            <div className="payout-row">
              <span>M. Keita</span>
              <strong>120k</strong>
              <em className="date">Hier</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UserDashboard = ({ navigateToTab, kycPercentage }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <h1>Mon Espace Santé</h1>
      <div className="header-actions"><button className="btn-premium primary" onClick={() => navigateToTab('simulateur')}><i className="ti ti-plus"></i> Nouveau Prêt</button></div>
    </div>

    <div className="user-dashboard-grid">
      <div className="u-main-panel">
        <div className="metric-card-premium highlight">
          <div className="m-info">
            <span className="m-label">PRÊT ACTIF</span>
            <div className="m-val">350 000 FCFA</div>
            <span className="m-sub">Prochaine échéance : 25 Juin 2024</span>
          </div>
          <div className="m-icon"><i className="ti ti-activity-heartbeat"></i></div>
        </div>
        
        <div className="glass-panel recent-activity">
          <h3>Suivi des demandes</h3>
          <div className="activity-track">
            <div className="track-item current">
              <div className="t-ico"><i className="ti ti-loader-2 animate-spin"></i></div>
              <div className="t-det"><strong>Bilan de santé</strong><span>En attente de validation BNI</span></div>
            </div>
            <div className="track-item done">
              <div className="t-ico"><i className="ti ti-check"></i></div>
              <div className="t-det"><strong>Soin Dentaire</strong><span>Décaissé par SGCI (12/05)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="u-side-panel">
        <div className="glass-panel kyc-summary-card">
          <div className="k-header"><h3>Mes Formalités</h3><span>{kycPercentage}%</span></div>
          <div className="k-bar"><div className="fill" style={{ width: `${kycPercentage}%` }}></div></div>
          <p className="p-muted">Complétez votre dossier pour accélérer vos demandes.</p>
          <button className="btn-premium secondary w-full" onClick={() => navigateToTab('documents')}>Gérer mes documents</button>
        </div>
      </div>
    </div>
  </div>
);

const SimulationView = ({ careType, setCareType, amount, setAmount, duration, setDuration, currentSim, formatFCFA, navigateToTab, showToast }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <h1>Simulateur de Crédit</h1>
    </div>
    <div className="simulation-workspace glass-panel">
      <div className="sim-form">
        <div className="field-group">
          <label>Besoin Médical</label>
          <select 
            className="premium-select" 
            value={careType} 
            onChange={(e) => setCareType(Number(e.target.value))}
          >
            <option value={1}>Chirurgie Générale</option>
            <option value={2}>Soin Dentaire</option>
            <option value={3}>Accouchement / Maternité</option>
            <option value={4}>Bilan & Diagnostic</option>
          </select>
        </div>
        <div className="field-group">
          <label>Montant Souhaité : <strong>{formatFCFA(amount)}</strong></label>
          <input type="range" min="100000" max="2000000" step="50000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="premium-range" />
        </div>
        <div className="field-group">
          <label>Durée de remboursement : <strong>{duration} mois</strong></label>
          <div className="duration-presets">
            {[6, 12, 18, 24].map(d => (
              <button key={d} className={`preset-btn ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>{d}m</button>
            ))}
          </div>
        </div>
      </div>
      <div className="sim-results">
        <div className="result-box">
          <span>Mensualité estimée</span>
          <strong>{formatFCFA(currentSim.monthly)}</strong>
        </div>
        <div className="result-details">
          <div className="r-line"><span>Taux Annuel</span><b>8.5%</b></div>
          <div className="r-line"><span>Total à rembourser</span><b>{formatFCFA(currentSim.total)}</b></div>
        </div>
        <button className="btn-premium primary w-full" onClick={() => { showToast("Simulation enregistrée"); navigateToTab('dashboard'); }}>Confirmer & Choisir une Banque</button>
      </div>
    </div>
  </div>
);

const DocumentsView = ({ kycDocs, setKycDocs }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header"><h1>Dossier de Formalités</h1></div>
    <div className="docs-management glass-panel">
      <div className="docs-grid">
        {[
          { id: 'cni', name: 'Pièce d\'identité (CNI/Passport)', status: kycDocs.cni },
          { id: 'salaire', name: '3 derniers bulletins de salaire', status: kycDocs.salaire },
          { id: 'releve', name: 'Relevé d\'identité bancaire (RIB)', status: kycDocs.releve },
          { id: 'devis', name: 'Devis de l\'établissement de soin', status: kycDocs.devis },
        ].map(doc => (
          <div className="doc-card" key={doc.id}>
            <div className="doc-icon"><i className={`ti ${doc.status ? 'ti-file-check' : 'ti-file-upload'}`}></i></div>
            <div className="doc-body">
              <strong>{doc.name}</strong>
              <p>{doc.status ? 'Document vérifié' : 'Action requise'}</p>
            </div>
            <button className={`btn-doc ${doc.status ? 'valid' : 'upload'}`} onClick={() => !doc.status && setKycDocs(p => ({...p, [doc.id]: true}))}>
              {doc.status ? <i className="ti ti-check"></i> : 'Charger'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HelpCenterView = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header"><h1>Centre d'Aide & Support</h1></div>
    <div className="help-grid">
      <div className="glass-panel support-hero">
        <h3>Comment pouvons-nous vous aider ?</h3>
        <div className="search-box help-search"><i className="ti ti-search"></i><input type="text" placeholder="Rechercher un guide, une procédure..." /></div>
      </div>
      <div className="help-categories">
        <div className="glass-panel help-cat">
          <i className="ti ti-book"></i>
          <h4>Guides de démarrage</h4>
          <p>Apprenez à utiliser l'interface de pilotage et les outils de gestion.</p>
        </div>
        <div className="glass-panel help-cat">
          <i className="ti ti-message-dots"></i>
          <h4>Support Technique</h4>
          <p>Ouvrez un ticket pour signaler un bug ou une anomalie système.</p>
        </div>
        <div className="glass-panel help-cat">
          <i className="ti ti-shield-check"></i>
          <h4>Sécurité & Accès</h4>
          <p>Gérez vos habilitations et la double authentification.</p>
        </div>
      </div>
      <div className="glass-panel faq-section">
        <h3>Questions Fréquentes</h3>
        <div className="faq-item"><strong>Quel est le délai moyen de validation KYC ?</strong><p>Généralement entre 24h et 48h ouvrées selon la banque choisie.</p></div>
        <div className="faq-item"><strong>Puis-je modifier une simulation validée ?</strong><p>Oui, tant que le dossier n'a pas été soumis à l'étude bancaire.</p></div>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header"><h1>Paramètres du Système</h1></div>
    <div className="settings-container">
      <div className="glass-panel settings-section">
        <h3>Préférences de Compte</h3>
        <div className="setting-row">
          <div className="s-info"><strong>Mode Sombre</strong><span>Activer l'interface à haut contraste pour le travail nocturne.</span></div>
          <div className="s-action"><input type="checkbox" className="premium-toggle" /></div>
        </div>
        <div className="setting-row">
          <div className="s-info"><strong>Notifications Email</strong><span>Recevoir des alertes lors de la validation d'un dossier.</span></div>
          <div className="s-action"><input type="checkbox" className="premium-toggle" defaultChecked /></div>
        </div>
      </div>
      <div className="glass-panel settings-section">
        <h3>Sécurité & Confidentialité</h3>
        <button className="btn-premium secondary w-full" style={{ marginBottom: '1rem' }}><i className="ti ti-lock"></i> Changer le mot de passe</button>
        <button className="btn-premium secondary w-full"><i className="ti ti-device-laptop"></i> Gérer les sessions actives</button>
      </div>
      <div className="glass-panel settings-section version-info">
        <div className="r-line"><span>Version App</span><b>2.1.0-stable</b></div>
        <div className="r-line"><span>Dernier Sync</span><b>Il y a 2 min</b></div>
      </div>
    </div>
  </div>
);

export default App;
