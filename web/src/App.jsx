import { useState, useEffect } from 'react';
import './App.css';
import sgciLogo from './assets/banks/sgci.png';
import bniLogo from './assets/banks/bni.png';
import ecobankLogo from './assets/banks/ecobank.png';

// --- MOCK DATA ---
const MOCK_USERS = [
  { id: 1, name: 'Kouamé Adou', email: 'koua.adou@email.com', role: 'Assuré Principal', status: 'Actif', lastActive: 'Il y a 5 min', loanAmount: '350 000 FCFA', progression: 75, registrationDate: '12/01/2024' },
  { id: 2, name: 'Awa Koné', email: 'awa.kone@test.ci', role: 'Assuré Principal', status: 'En attente', lastActive: 'Il y a 2h', loanAmount: '120 000 FCFA', progression: 40, registrationDate: '15/02/2024' },
  { id: 3, name: 'Marc Traoré', email: 'm.traore@web.com', role: 'Assuré Secondaire', status: 'Inactif', lastActive: 'Hier', loanAmount: '0 FCFA', progression: 10, registrationDate: '01/03/2024' },
  { id: 4, name: 'Fatou Diallo', email: 'fatou.d@email.ci', role: 'Assuré Principal', status: 'Actif', lastActive: 'Il y a 10 min', loanAmount: '750 000 FCFA', progression: 100, registrationDate: '20/12/2023' },
];

const MOCK_BANKS = [
  { id: 1, name: 'SGCI', fullName: 'Société Générale Côte d\'Ivoire', activeLoans: 145, rate: '7.9%', liquidity: 'Haute', status: 'Online', processingTime: '2.4 jours', logo: sgciLogo },
  { id: 2, name: 'BNI', fullName: 'Banque Nationale d\'Investissement', activeLoans: 89, rate: '9.2%', liquidity: 'Moyenne', status: 'Online', processingTime: '3.1 jours', logo: bniLogo },
  { id: 3, name: 'Ecobank', fullName: 'Ecobank Côte d\'Ivoire', activeLoans: 210, rate: '10.5%', liquidity: 'Très Haute', status: 'Offline', processingTime: '1.8 jours', logo: ecobankLogo },
];

const MOCK_APPLICATIONS = [
  { id: 'APP-001', user: 'Awa Koné', amount: '120 000 FCFA', care: 'Bilan de santé', date: '16 Mai 2024', status: 'Nouveau', risk: 'Faible', docs: ['CNI', 'Salaire', 'RIB'], scoring: 82 },
  { id: 'APP-002', user: 'Jean Koffi', amount: '450 000 FCFA', care: 'Dentaire', date: '15 Mai 2024', status: 'En examen', risk: 'Moyen', docs: ['CNI', 'Salaire'], scoring: 64 },
  { id: 'APP-003', user: 'Saliou Diop', amount: '900 000 FCFA', care: 'Accouchement', date: '14 Mai 2024', status: 'Vérification', risk: 'Faible', docs: ['CNI', 'Salaire', 'RIB', 'Devis'], scoring: 91 },
  { id: 'APP-004', user: 'Fatou Diallo', amount: '600 000 FCFA', care: 'Chirurgie', date: '13 Mai 2024', status: 'Nouveau', risk: 'Élevé', docs: ['CNI'], scoring: 41 },
];

const RISK_COLORS = { 'Faible': '#10b981', 'Moyen': '#f59e0b', 'Élevé': '#ef4444' };

const MOCK_LOGS = [
  { id: 1, action: 'Nouvelle Simulation', user: 'Kouamé Adou', time: '14:20', type: 'System' },
  { id: 2, action: 'Document Validé', user: 'SGCI (Admin)', time: '13:45', type: 'Security' },
  { id: 3, action: 'Tentative de Connexion', user: 'Inconnu (IP: 192.168.1.1)', time: '12:10', type: 'Warning' },
  { id: 4, action: 'Mise à jour Taux', user: 'Admin', time: '10:00', type: 'Config' },
];

function App() {
  // --- AUTH & GLOBAL STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'bank'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pretSanteDarkMode');
    return saved === null ? false : saved === 'true';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('pretSanteNotifications');
    return saved === null ? true : saved !== 'false';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [reportingProgress, setReportingProgress] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- UTILS ---
  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(prev => prev === text ? null : prev), 4000);
  };

  // --- ACTIONS ---
  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    showToast(`Session pilotage active : ${role.toUpperCase()}`);
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

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('pretSanteDarkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('pretSanteNotifications', emailNotifications);
  }, [emailNotifications]);

  // --- DATA STATE (to allow interactions) ---
  const [users, setUsers] = useState(MOCK_USERS);
  const [banks, setBanks] = useState(MOCK_BANKS);
  const logs = MOCK_LOGS;

  // --- HANDLERS ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast("Synchronisation des données...");
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Données à jour");
    }, 1500);
  };

  const handleAddUser = () => setActiveModal('user');
  const handleNewPartner = () => setActiveModal('bank');

  const handleGlobalReport = () => {
    setActiveModal('report');
    setReportingProgress(0);
    const interval = setInterval(() => {
      setReportingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setActiveModal(null), 1000);
          showToast("Rapport généré avec succès");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSearchHelp = (q) => {
    setHelpSearchQuery(q);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Actif' ? 'Suspendu' : 'Actif' } : u));
    showToast("Statut utilisateur mis à jour");
  };

  // --- FILTERING LOGIC ---
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- MAIN RENDER ---
  if (!isLoggedIn) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      {toast && (
        <div className="toast-notification animate-slide-in">
          <div className="toast-content">
            <i className="ti ti-circle-check-filled"></i>
            <span>{toast}</span>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <Sidebar
        userRole={userRole}
        activeTab={activeTab}
        navigateToTab={navigateToTab}
        handleLogout={handleLogout}
      />

      <main className="app-main-content">
        <div className="content-container">
          {activeTab === 'dashboard' && (
            userRole === 'admin' ? (
              <AdminDashboard
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                handleGlobalReport={handleGlobalReport}
                showToast={showToast}
                logs={logs}
                banks={banks}
              />
            ) : (
              <BankOverviewView navigateToTab={navigateToTab} />
            )
          )}
          {activeTab === 'requests' && <BankRequestsView showToast={showToast} />}
          {activeTab === 'risk' && <BankRiskView />}
          {activeTab === 'users' && <UsersListView
            users={filteredUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showToast={showToast}
            toggleUserStatus={toggleUserStatus}
            handleAddUser={handleAddUser}
            setActiveModal={setActiveModal}
            setSelectedUser={setSelectedUser}
          />}
          {activeTab === 'banks' && <BanksListView
            banks={filteredBanks}
            handleNewPartner={handleNewPartner}
            showToast={showToast}
          />}
          {activeTab === 'help' && <HelpCenterView handleSearchHelp={handleSearchHelp} helpSearchQuery={helpSearchQuery} showToast={showToast} />}
          {activeTab === 'settings' && <SettingsView
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            setActiveModal={setActiveModal}
            showToast={showToast}
          />}

          {/* Fallback for tabs in development */}
          {(activeTab !== 'dashboard' && activeTab !== 'users' && activeTab !== 'banks' && activeTab !== 'help' && activeTab !== 'settings' && activeTab !== 'requests' && activeTab !== 'risk') && (
            <div className="empty-state animate-fade-in">
              <i className="ti ti-tool"></i>
              <h2>Module en cours de déploiement</h2>
              <p>L'interface de pilotage pour <b>{activeTab}</b> est en cours de configuration par l'équipe technique.</p>
              <button className="btn-premium secondary" onClick={() => setActiveTab('dashboard')}>Retour au Dashboard</button>
            </div>
          )}
        </div>
      </main>

      {/* --- MODALS --- */}
      {activeModal === 'report' && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Génération du Rapport</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loader-large"></div>
              <p style={{ marginTop: '1.5rem', fontWeight: 600 }}>Analyse des flux de santé en cours...</p>
              <div className="progress-bar-premium" style={{ marginTop: '1rem' }}>
                <div className="fill" style={{ width: `${reportingProgress}%` }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>{reportingProgress}% complété</span>
            </div>
          </div>
        </div>
      )}

      {(activeModal === 'user' || activeModal === 'add-user') && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up">
            <div className="modal-header">
              <h3>Nouvel Assuré</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Nom Complet</label>
                  <input type="text" id="new-user-name" placeholder="Ex: Jean Kouassi" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" id="new-user-email" placeholder="jean@example.com" />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-premium secondary" onClick={() => setActiveModal(null)}>Annuler</button>
                <button className="btn-premium primary" onClick={() => {
                  const name = document.querySelector('#new-user-name')?.value || "Nouvel Assuré";
                  const email = document.querySelector('#new-user-email')?.value || "user@test.ci";
                  const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    role: 'Assuré Principal',
                    status: 'Actif',
                    lastActive: 'À l\'instant',
                    loanAmount: '0 FCFA',
                    progression: 0,
                    registrationDate: new Date().toLocaleDateString('fr-FR')
                  };
                  setUsers([newUser, ...users]);
                  setActiveModal(null);
                  showToast("Compte assuré créé avec succès");
                }}>Créer le compte</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeModal === 'view-user' || activeModal === 'edit-user') && selectedUser && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up">
            <div className="modal-header">
              <h3>{activeModal === 'view-user' ? 'Profil Assuré' : 'Modifier Assuré'}</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="user-detail-header">
                <div className="avatar-large">{selectedUser.name[0]}</div>
                <div className="ud-meta">
                  <h2>{selectedUser.name}</h2>
                  <span>{selectedUser.email}</span>
                </div>
              </div>
              <div className="ud-stats">
                <div className="ud-stat-item"><span>Status</span><strong>{selectedUser.status}</strong></div>
                <div className="ud-stat-item"><span>Crédit</span><strong>{selectedUser.loanAmount}</strong></div>
                <div className="ud-stat-item"><span>Inscription</span><strong>{selectedUser.registrationDate}</strong></div>
              </div>
              <div className="modal-actions">
                <button className="btn-premium secondary" onClick={() => setActiveModal(null)}>Fermer</button>
                {activeModal === 'edit-user' && <button className="btn-premium primary" onClick={() => { setActiveModal(null); showToast("Modifications enregistrées"); }}>Sauvegarder</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'bank' && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up">
            <div className="modal-header">
              <h3>Nouveau Partenaire Bancaire</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="field">
                  <label>Nom de la Banque</label>
                  <input type="text" id="new-bank-name" placeholder="Ex: BOA" />
                </div>
                <div className="field">
                  <label>Taux de base (%)</label>
                  <input type="number" id="new-bank-rate" step="0.1" placeholder="8.5" />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-premium secondary" onClick={() => setActiveModal(null)}>Annuler</button>
                <button className="btn-premium primary" onClick={() => {
                  const name = document.querySelector('#new-bank-name')?.value || "Nouvelle Banque";
                  const rate = document.querySelector('#new-bank-rate')?.value || "8.5";
                  const newBank = {
                    id: Date.now(),
                    name,
                    fullName: `${name} Côte d'Ivoire`,
                    activeLoans: 0,
                    rate: `${rate}%`,
                    liquidity: 'Moyenne',
                    status: 'Online',
                    processingTime: 'En attente'
                  };
                  setBanks([newBank, ...banks]);
                  setActiveModal(null);
                  showToast("Banque partenaire ajoutée");
                }}>Initialiser Partenariat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'password' && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up">
            <div className="modal-header">
              <h3>Modifier le Mot de Passe</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group-premium">
                <label>Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '15px' }} />
              </div>
              <div className="form-group-premium">
                <label>Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '15px' }} />
              </div>
              <div className="form-group-premium">
                <label>Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '20px' }} />
              </div>
              <button className="btn-premium primary w-full" onClick={() => { setActiveModal(null); showToast("Mot de passe mis à jour"); }}>Mettre à jour</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'sessions' && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-card glass-panel-premium animate-slide-up">
            <div className="modal-header">
              <h3>Sessions Actives</h3>
              <button className="icon-btn-close" onClick={() => setActiveModal(null)}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                <div className="session-item-premium" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)' }}>
                  <i className="ti ti-device-laptop" style={{ fontSize: '24px', color: 'var(--color-brand-primary)' }}></i>
                  <div className="s-info" style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>Windows 11 · Chrome</strong>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>Abidjan, Côte d'Ivoire · Actuel</span>
                  </div>
                  <span className="status-pill-mini online">Active</span>
                </div>
                <div className="session-item-premium" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)' }}>
                  <i className="ti ti-device-mobile" style={{ fontSize: '24px', color: 'var(--color-brand-primary)' }}></i>
                  <div className="s-info" style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>iPhone 15 · Safari</strong>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>Dernière activité : Il y a 2h</span>
                  </div>
                  <button className="btn-premium secondary" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => showToast("Session révoquée")}>Révoquer</button>
                </div>
              </div>
              <button className="btn-premium secondary w-full" onClick={() => { setActiveModal(null); showToast("Toutes les autres sessions ont été fermées"); }}>Fermer toutes les autres sessions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

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
            <p>Contrôle total, monitoring réseau et gestion des partenaires.</p>
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
          <strong>{userRole === 'admin' ? 'Super Admin' : 'SGCI Ops'}</strong>
          <span>{userRole ? userRole.toUpperCase() : ''}</span>
        </div>
        <button className="btn-logout-icon" onClick={handleLogout} title="Déconnexion"><i className="ti ti-logout"></i></button>
      </div>
    </div>
  </aside>
);

const AdminDashboard = ({ handleRefresh, isRefreshing, handleGlobalReport, showToast, logs, banks }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Vision 360° du Système</h1>
        <p className="subtitle">Supervision en temps réel des flux de santé et financiers</p>
      </div>
      <div className="header-actions">
        <button
          className={`btn-premium primary ${isRefreshing ? 'loading' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <i className={`ti ${isRefreshing ? 'ti-loader-2 animate-spin' : 'ti-refresh'}`}></i>
          {isRefreshing ? 'Chargement...' : 'Actualiser'}
        </button>
        <button className="btn-premium secondary" onClick={handleGlobalReport}>
          <i className="ti ti-file-analytics"></i>
          Rapport global
        </button>
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
      <div className="grid-main-card glass-panel-premium">
        <div className="card-header">
          <div className="header-title">
            <i className="ti ti-activity"></i>
            <h3>Monitoring des Flux (24h)</h3>
          </div>
          <div className="header-tabs">
            <button className="active">Utilisateurs</button>
            <button onClick={() => showToast("Filtre Banques appliqué")}>Banques</button>
            <button onClick={() => showToast("Filtre Système appliqué")}>Système</button>
          </div>
        </div>
        <div className="logs-timeline enterprise">
          {logs.slice(0, 5).map(log => (
            <div className="log-entry-premium" key={log.id}>
              <div className={`log-avatar ${log.type.toLowerCase()}`}>{log.user.charAt(0)}</div>
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
            {banks.map(b => (
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

const UsersListView = ({ users, toggleUserStatus, setActiveModal, setSelectedUser, showToast, handleAddUser, searchQuery, setSearchQuery }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Annuaire des Assurés</h1>
        <p className="subtitle">Contrôle des identités, éligibilité et status des dossiers</p>
      </div>
      <div className="search-box glass-panel-premium">
        <i className="ti ti-search"></i>
        <input
          type="text"
          placeholder="Rechercher un assuré..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="header-actions">
        <button className="icon-btn" onClick={() => { setSearchQuery(""); showToast("Filtres réinitialisés") }}>
          <i className="ti ti-filter"></i>
        </button>
        <button className="btn-premium primary" onClick={handleAddUser}>
          <i className="ti ti-user-plus"></i>
          Ajouter un assuré
        </button>
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
            {users.map((user) => (
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
                    <button className="action-icon-btn" onClick={() => { setSelectedUser(user); setActiveModal('view-user'); }}>
                      <i className="ti ti-eye"></i>
                    </button>
                    <button className="action-icon-btn" onClick={() => { setSelectedUser(user); setActiveModal('edit-user'); }}>
                      <i className="ti ti-pencil"></i>
                    </button>
                    <button
                      className={`action-icon-btn ${user.status === 'Actif' ? 'delete' : 'success'}`}
                      onClick={() => toggleUserStatus(user.id)}
                      title={user.status === 'Actif' ? 'Suspendre' : 'Réactiver'}
                    >
                      <i className={`ti ${user.status === 'Actif' ? 'ti-circle-off' : 'ti-circle-check'}`}></i>
                    </button>
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

const BanksListView = ({ banks, handleNewPartner, showToast }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Réseau Bancaire Partenaire</h1>
        <p className="subtitle">Gestion des établissements, taux en vigueur et liquidités</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium primary" onClick={() => { handleNewPartner(); showToast("Ouverture du formulaire partenaire..."); }}><i className="ti ti-plus"></i> Nouveau Partenaire</button>
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
            {banks.map(bank => (
              <tr key={bank.id}>
                <td className="font-bold">
                  <div className="bank-name-cell">
                    <img src={bank.logo} alt={bank.name} className="bank-logo-mini" />
                    {bank.name}
                  </div>
                </td>
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


const BankOverviewView = ({ navigateToTab }) => {
  const pendingCount = MOCK_APPLICATIONS.length;
  const priorityApps = [...MOCK_APPLICATIONS].sort((a, b) => b.scoring - a.scoring).slice(0, 2);
  const riskCounts = { Faible: 0, Moyen: 0, Élevé: 0 };
  MOCK_APPLICATIONS.forEach(a => { riskCounts[a.risk] += 1; });

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="title-group">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Vue d'ensemble · SGCI</h1>
          <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Aperçu de votre activité de financement santé</p>
        </div>
        <div className="header-actions">
          <button className="btn-premium primary" onClick={() => navigateToTab('requests')}>
            <i className="ti ti-file-description"></i> Voir les demandes
          </button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="mini-stat">
          <div className="m-icon-mini system"><i className="ti ti-file-description"></i></div>
          <div className="m-data"><span>Dossiers en attente</span><strong>{pendingCount}</strong><em>À traiter</em></div>
        </div>
        <div className="mini-stat">
          <div className="m-icon-mini finance"><i className="ti ti-cash"></i></div>
          <div className="m-data"><span>Décaissé ce mois</span><strong>570k</strong><em className="up">+8.2%</em></div>
        </div>
        <div className="mini-stat">
          <div className="m-icon-mini bank"><i className="ti ti-percentage"></i></div>
          <div className="m-data"><span>Taux moyen accordé</span><strong>8.5%</strong><em>Stable</em></div>
        </div>
        <div className="mini-stat">
          <div className="m-icon-mini speed"><i className="ti ti-clock-hour-4"></i></div>
          <div className="m-data"><span>Délai moyen</span><strong>2.4j</strong><em className="up">Rapide</em></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="glass-panel-premium rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800">Dossiers prioritaires</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700" onClick={() => navigateToTab('requests')}>Voir tout</button>
          </div>
          <div className="flex flex-col gap-3">
            {priorityApps.map(app => (
              <div key={app.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-all" onClick={() => navigateToTab('requests')}>
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">{app.user[0]}</div>
                <div className="flex-1 min-w-0">
                  <strong className="text-sm font-bold text-slate-800 block">{app.user}</strong>
                  <span className="text-xs text-slate-500">{app.care} · {app.amount}</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-700" style={{ borderColor: RISK_COLORS[app.risk] }}>
                  {app.scoring}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel-premium rounded-3xl p-6 border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all" onClick={() => navigateToTab('risk')}>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Répartition des risques</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(riskCounts).map(([risk, count]) => (
                <div key={risk} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[risk] }}></span>
                    <span className="text-xs font-semibold text-slate-600">Risque {risk}</span>
                  </div>
                  <strong className="text-sm font-bold text-slate-800">{count}</strong>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-4 mb-0">Cliquez pour voir l'analyse complète →</p>
          </div>

          <div className="glass-panel-premium rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Décaissements récents</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">S. Touré</span>
                <strong className="text-xs font-bold text-blue-700">450k FCFA</strong>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">M. Keita</span>
                <strong className="text-xs font-bold text-blue-700">120k FCFA</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankRequestsView = ({ showToast }) => {
  const [activeModal, setActiveModal] = useState(null); // null, 'contract', 'complement'
  const [selectedApp, setSelectedApp] = useState(MOCK_APPLICATIONS[0]);
  const [missingDocs, setMissingDocs] = useState({ releve: true, devis: true, ocr: false });
  const [customComment, setCustomComment] = useState("");
  const [riskFilter, setRiskFilter] = useState('Tout');

  const handleGenerateContract = (app = selectedApp) => {
    if (!app?.docs?.includes('Devis')) {
      showToast('Facture pro-forma manquante : impossible de générer le contrat sans ce justificatif.');
      return;
    }
    setActiveModal('contract');
  };

  const handleRequestComplement = () => {
    setActiveModal('complement');
  };

  const visibleApplications = riskFilter === 'Tout' ? MOCK_APPLICATIONS : MOCK_APPLICATIONS.filter(a => a.risk === riskFilter);

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="title-group">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Demandes en cours · SGCI</h1>
          <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Traitement des formalités et déblocage de fonds</p>
        </div>
        <div className="header-actions">
          <span className="status-pill active-glow">
            <i className="ti ti-antenna mr-2 text-blue-600"></i> Connecté à Risk-Ops
          </span>
        </div>
      </div>

      <div className="dashboard-grid-requests">
        <div className="requests-list-container">
          <div className="section-header-premium mb-6">
            <h3 className="text-xl font-bold text-slate-800 leading-snug tracking-[-0.01em]">Dossiers en attente de décision</h3>
            <div className="filter-group">
              {['Tout', 'Faible', 'Moyen', 'Élevé'].map(f => (
                <button key={f} className={`filter-btn ${riskFilter === f ? 'active' : ''}`} onClick={() => setRiskFilter(f)}>
                  {f === 'Tout' ? 'Tout' : `Risque ${f}`}
                </button>
              ))}
            </div>
          </div>
          <div className="requests-vertical-list flex flex-col gap-4">
            {visibleApplications.map(app => (
              <div
                className={`request-strip-premium glass-panel w-full flex items-center gap-6 p-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all border ${selectedApp?.id === app.id ? 'border-blue-500 bg-blue-50/10' : 'border-transparent'}`}
                key={app.id}
                onClick={() => setSelectedApp(app)}
              >
                <div className="r-avatar-group flex items-center relative">
                  <div className="r-avatar-main w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">{app.user[0]}</div>
                  <div className="r-risk-dot w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white" style={{ background: RISK_COLORS[app.risk] }}></div>
                </div>

                <div className="r-main-info flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm font-bold text-slate-800 tracking-tight">{app.user}</strong>
                    <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span>{app.care}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{app.date}</span>
                  </div>
                </div>

                <div className="r-scoring-premium flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-700" style={{ borderColor: RISK_COLORS[app.risk] }}>
                    {app.scoring}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score Risk</span>
                </div>

                <div className="r-amount-premium flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-slate-800 tracking-tight">{app.amount}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">Montant</span>
                </div>

                {/* Notification bell and action buttons pushed completely to the right */}
                <div className="ml-auto flex items-center gap-3">
                  <button className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all" title="Examiner les formalités" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); showToast(`Examen du dossier de ${app.user}`); }}><i className="ti ti-file-search"></i></button>
                  <button className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all" title="Accorder le prêt" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); handleGenerateContract(app); }}><i className="ti ti-check"></i></button>
                  
                  {/* Pushed all the way to the right of the card */}
                  <button 
                    className="relative w-8 h-8 rounded-lg border border-slate-100 hover:border-blue-100 text-slate-400 hover:text-blue-700 flex items-center justify-center transition-all bg-white" 
                    onClick={(e) => { e.stopPropagation(); showToast(`Rapport d'audit pour ${app.user} disponible`); }}
                  >
                    <i className="ti ti-bell"></i>
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="risk-summary-panel flex flex-col gap-6">
          <div className="glass-panel audit-panel-premium p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
            <div className="audit-header flex items-center gap-3">
              <i className="ti ti-database-check text-blue-700 text-xl"></i>
              <h3 className="text-lg font-bold text-slate-800">Audit IA-KYC</h3>
            </div>
            <p className="text-slate-500 text-xs leading-normal tracking-[0.01em] mb-0">
              Vérification en temps réel des pièces justificatives fournies par <strong>{selectedApp?.user}</strong>.
            </p>

            <div className="doc-audit-stack flex flex-col gap-3">
              <div className="audit-item success flex items-center justify-between p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="ai-ico w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="ti ti-id"></i></div>
                  <div className="flex flex-col gap-0.5">
                    <strong className="text-xs font-semibold text-slate-800">CNI / Passeport</strong>
                    <span className="text-[10px] text-slate-400">Validité : 100% · OCR OK</span>
                  </div>
                </div>
                <i className="ti ti-circle-check text-emerald-600"></i>
              </div>
              <div className="audit-item success flex items-center justify-between p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="ai-ico w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="ti ti-file-analytics"></i></div>
                  <div className="flex flex-col gap-0.5">
                    <strong className="text-xs font-semibold text-slate-800">Bulletins de Salaire</strong>
                    <span className="text-[10px] text-slate-400">Revenu stable détecté</span>
                  </div>
                </div>
                <i className="ti ti-circle-check text-emerald-600"></i>
              </div>
              <div className="audit-item flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="ai-ico w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="ti ti-building-bank"></i></div>
                  <div className="flex flex-col gap-0.5">
                    <strong className="text-xs font-semibold text-slate-800">Relevé Bancaire</strong>
                    <span className="text-[10px] text-slate-400">Vérification en attente</span>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-slate-350 border-t-blue-600 animate-spin"></div>
              </div>
              {selectedApp?.docs?.includes('Devis') ? (
                <div className="audit-item success flex items-center justify-between p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="ai-ico w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="ti ti-file-invoice"></i></div>
                    <div className="flex flex-col gap-0.5">
                      <strong className="text-xs font-semibold text-slate-800">Facture pro-forma</strong>
                      <span className="text-[10px] text-slate-400">Justifie le montant demandé</span>
                    </div>
                  </div>
                  <i className="ti ti-circle-check text-emerald-600"></i>
                </div>
              ) : (
                <div className="audit-item flex items-center justify-between p-3 bg-amber-50/40 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="ai-ico w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="ti ti-file-invoice"></i></div>
                    <div className="flex flex-col gap-0.5">
                      <strong className="text-xs font-semibold text-slate-800">Facture pro-forma</strong>
                      <span className="text-[10px] text-amber-600">Manquante — requise avant décaissement</span>
                    </div>
                  </div>
                  <i className="ti ti-alert-triangle text-amber-500"></i>
                </div>
              )}
            </div>

            <div className="risk-meter space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Indice de confiance global</span>
                <strong className="text-blue-700">89%</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '89%' }}></div>
              </div>
            </div>

            {/* Interactive functional action triggers */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleGenerateContract()}
                disabled={!selectedApp?.docs?.includes('Devis')}
                className="btn-premium primary w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Générer Contrat de Prêt
              </button>
              <button 
                onClick={handleRequestComplement}
                className="btn-premium secondary w-full cursor-pointer"
              >
                Demander Complément
              </button>
            </div>
          </div>

          <div className="glass-panel payout-history-card p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="card-header flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Décaissements Récents</h3>
              <i className="ti ti-receipt text-slate-400"></i>
            </div>
            <div className="payout-list flex flex-col gap-3">
              <div className="payout-row flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">S. Touré</span>
                <strong className="text-xs font-bold text-blue-800">450k FCFA</strong>
                <em className="text-[10px] text-slate-400 not-italic">Aujourd'hui</em>
              </div>
              <div className="payout-row flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">M. Keita</span>
                <strong className="text-xs font-bold text-blue-800">120k FCFA</strong>
                <em className="text-[10px] text-slate-400 not-italic">Hier</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Contract Generation (Interactive) */}
      {activeModal === 'contract' && (
        <div className="modal-overlay animate-fade-in flex items-center justify-center z-[3000] fixed inset-0 bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="modal-card bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-slide-up">
            <div className="modal-header px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug tracking-tight">Générer Contrat de Prêt</h3>
              <button className="icon-btn-close w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all text-slate-400" onClick={() => setActiveModal(null)}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-5">
              <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 font-mono text-xs space-y-3 text-slate-700 leading-relaxed">
                <div className="text-center font-bold border-b border-blue-100 pb-2 text-blue-800 text-sm">
                  ACTE DE CRÉDIT MÉDICAL #CM-{selectedApp?.id}
                </div>
                <div className="flex justify-between"><span>Bénéficiaire:</span><span className="font-bold">{selectedApp?.user}</span></div>
                <div className="flex justify-between"><span>Besoin de santé:</span><span className="font-bold">{selectedApp?.care}</span></div>
                <div className="flex justify-between"><span>Montant Prêt:</span><span className="font-bold text-blue-800">{selectedApp?.amount}</span></div>
                <div className="flex justify-between"><span>Taux d'intérêt:</span><span className="font-bold">7.9% SGCI Santé +</span></div>
                <div className="flex justify-between"><span>Durée:</span><span className="font-bold">12 Mois</span></div>
                <div className="flex justify-between"><span>Mensualités:</span><span className="font-bold text-blue-800">~ 21 875 FCFA / mois</span></div>
                <div className="flex justify-between border-t border-blue-100 pt-2"><span>Décaissé à:</span><span className="font-bold">Clinique Avicenne</span></div>
                <div className="flex justify-between"><span>Justificatif:</span><span className="font-bold">Facture pro-forma #{selectedApp?.id}</span></div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[70ch] mb-0">
                Conformément à notre politique de décaissement, les fonds sont versés directement à l'établissement de santé sur présentation de la facture pro-forma — jamais sur le compte de l'assuré. La validation de cette étape génère le contrat officiel au format PDF sécurisé et notifie l'assuré pour signature électronique.
              </p>
              <div className="modal-actions flex justify-end gap-3 pt-2">
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold" onClick={() => setActiveModal(null)}>Annuler</button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-md shadow-blue-600/10" 
                  onClick={() => {
                    showToast(`Contrat de prêt généré avec succès pour ${selectedApp?.user} !`);
                    setActiveModal(null);
                  }}
                >
                  Confirmer & Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Complement (Interactive) */}
      {activeModal === 'complement' && (
        <div className="modal-overlay animate-fade-in flex items-center justify-center z-[3000] fixed inset-0 bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="modal-card bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-slide-up">
            <div className="modal-header px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug tracking-tight">Demander un Complément de Dossier</h3>
              <button className="icon-btn-close w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all text-slate-400" onClick={() => setActiveModal(null)}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            <div className="modal-body p-6 flex flex-col gap-5">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sélectionner les documents requis :</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-all">
                    <input 
                      type="checkbox" 
                      className="accent-blue-600 rounded" 
                      checked={missingDocs.releve} 
                      onChange={(e) => setMissingDocs(p => ({ ...p, releve: e.target.checked }))} 
                    />
                    <span className="text-xs font-semibold text-slate-700">Relevé Bancaire (3 derniers mois)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-all">
                    <input 
                      type="checkbox" 
                      className="accent-blue-600 rounded" 
                      checked={missingDocs.devis} 
                      onChange={(e) => setMissingDocs(p => ({ ...p, devis: e.target.checked }))} 
                    />
                    <span className="text-xs font-semibold text-slate-700">Devis Médical Établi par la clinique</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-all">
                    <input 
                      type="checkbox" 
                      className="accent-blue-600 rounded" 
                      checked={missingDocs.ocr} 
                      onChange={(e) => setMissingDocs(p => ({ ...p, ocr: e.target.checked }))} 
                    />
                    <span className="text-xs font-semibold text-slate-700">Justificatif d'Adresse ou Hébergement</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instructions complémentaires :</span>
                <textarea 
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Ex: Merci de fournir un devis signé avec le cachet du médecin conseil..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-600 min-h-[90px]"
                />
              </div>

              <div className="modal-actions flex justify-end gap-3 pt-2">
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold" onClick={() => setActiveModal(null)}>Annuler</button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-md shadow-blue-600/10" 
                  onClick={() => {
                    showToast(`Demande de documents complémentaires envoyée à ${selectedApp?.user} !`);
                    setActiveModal(null);
                  }}
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RISK_FACTORS = [
  { label: 'Historique de crédit', impact: 85 },
  { label: 'Stabilité des revenus', impact: 70 },
  { label: 'Complétude du dossier', impact: 60 },
  { label: 'Zone géographique', impact: 45 },
];

const BankRiskView = () => {
  const total = MOCK_APPLICATIONS.length;
  const byRisk = { Faible: [], Moyen: [], Élevé: [] };
  MOCK_APPLICATIONS.forEach(a => byRisk[a.risk].push(a));

  const parseAmount = (str) => parseInt(str.replace(/[^\d]/g, ''), 10);
  const totalAmount = MOCK_APPLICATIONS.reduce((sum, a) => sum + parseAmount(a.amount), 0);

  const sortedApps = [...MOCK_APPLICATIONS].sort((a, b) => {
    const order = { 'Élevé': 0, 'Moyen': 1, 'Faible': 2 };
    return order[a.risk] - order[b.risk];
  });

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="title-group">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Analyse de Risque</h1>
          <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Exposition et facteurs de risque du portefeuille de prêts santé</p>
        </div>
        <div className="header-actions">
          <span className="status-pill active-glow">
            Exposition totale · {new Intl.NumberFormat('fr-FR').format(totalAmount)} FCFA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(byRisk).map(([risk, apps]) => {
          const amount = apps.reduce((sum, a) => sum + parseAmount(a.amount), 0);
          const pct = total ? Math.round((apps.length / total) * 100) : 0;
          return (
            <div key={risk} className="glass-panel-premium rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[risk] }}></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Risque {risk}</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{apps.length} <span className="text-sm font-semibold text-slate-400">dossier{apps.length > 1 ? 's' : ''}</span></div>
              <div className="text-xs text-slate-500 mt-1">{new Intl.NumberFormat('fr-FR').format(amount)} FCFA · {pct}% du portefeuille</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: RISK_COLORS[risk] }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="glass-panel-premium rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Dossiers triés par risque</h3>
          <div className="flex flex-col gap-3">
            {sortedApps.map(app => (
              <div key={app.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">{app.user[0]}</div>
                <div className="flex-1 min-w-0">
                  <strong className="text-sm font-bold text-slate-800 block">{app.user}</strong>
                  <span className="text-xs text-slate-500">{app.care} · {app.amount}</span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: `${RISK_COLORS[app.risk]}1A`, color: RISK_COLORS[app.risk] }}
                >
                  {app.risk}
                </span>
                <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-700" style={{ borderColor: RISK_COLORS[app.risk] }}>
                  {app.scoring}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel-premium rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Facteurs de risque</h3>
          <div className="flex flex-col gap-4">
            {RISK_FACTORS.map(f => (
              <div key={f.label}>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>{f.label}</span>
                  <span>{f.impact}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${f.impact}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-5 mb-0">Poids estimé de chaque facteur dans le score de risque global calculé par le moteur IA-KYC.</p>
        </div>
      </div>
    </div>
  );
};

const HelpCenterView = ({ handleSearchHelp, helpSearchQuery, showToast }) => {
  const [activeTopic, setActiveTopic] = useState(null); // null, 'startup', 'training', 'support'
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Bonjour ! Comment puis-je vous aider aujourd'hui concernant la plateforme Prêt Santé ?", sender: 'agent', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        text: "Merci pour votre message. Un agent de support de notre équipe technique a été alerté et va prendre le relais sous quelques minutes. N'hésitez pas à décrire tout problème avec précision.",
        sender: 'agent',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  const categories = [
    { id: 'startup', icon: 'ti-rocket', title: 'Guides de démarrage', text: "Maîtrisez l'interface de pilotage en moins de 5 minutes.", type: 'startup' },
    { id: 'support', icon: 'ti-headset', title: 'Support Technique', text: "Signaler une anomalie ou demander une assistance prioritaire.", type: 'support' },
    { id: 'security', icon: 'ti-shield-lock', title: 'Sécurité & Accès', text: "Habilitations, double authentification et gestion des rôles.", type: 'security' },
    { id: 'docs', icon: 'ti-code', title: 'Documentation API', text: "Intégrez nos services directement dans vos systèmes.", type: 'docs' },
    { id: 'billing', icon: 'ti-credit-card', title: 'Facturation & Paiements', text: "Suivez vos transactions et gérez vos abonnements banques.", type: 'billing' },
    { id: 'training', icon: 'ti-video', title: 'Académie Prêt Santé', text: "Tutoriels vidéo et webinaires pour les administrateurs.", type: 'training' },
  ];

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(helpSearchQuery.toLowerCase()) ||
    cat.text.toLowerCase().includes(helpSearchQuery.toLowerCase())
  );

  const faqs = [
    { q: "Quel est le délai moyen de validation KYC ?", a: "Généralement entre 24h et 48h ouvrées selon la banque choisie et la complétude du dossier.", tag: "Délai KYC" },
    { q: "Puis-je modifier une simulation validée ?", a: "Oui, tant que le dossier n'a pas été officiellement soumis à l'étude par l'établissement bancaire.", tag: "Modification simulation" },
    { q: "Quels sont les critères d'éligibilité santé ?", a: "Nos partenariats couvrent 95% des interventions chirurgicales et soins spécialisés en Côte d'Ivoire.", tag: "Éligibilité" },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(helpSearchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(helpSearchQuery.toLowerCase())
  );

  // REDIRECTED PAGE 1: Guides de démarrage (Startup)
  if (activeTopic === 'startup') {
    return (
      <div className="pilotage-view animate-fade-in">
        <div className="view-header flex items-center justify-between mb-6">
          <div className="title-group">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Guides de Démarrage</h1>
            <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Documents explicatifs et tutoriels pour maîtriser la plateforme rapidement.</p>
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm" onClick={() => setActiveTopic(null)}>
            <i className="ti ti-arrow-left"></i> Retour à l'aide
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-[-0.01em]">Bienvenue sur Prêt Santé</h3>
              <p className="text-slate-600 leading-relaxed tracking-[0.01em] mb-5 max-w-[70ch]">
                La plateforme Prêt Santé relie de manière sécurisée les assurés, les établissements de santé et les partenaires bancaires pour offrir des financements médicaux instantanés.
              </p>
              <h4 className="text-lg font-bold text-slate-800 leading-snug tracking-[-0.01em]">Étape 1 : Effectuer une simulation</h4>
              <p className="text-slate-600 leading-relaxed tracking-[0.01em] mb-5 max-w-[70ch]">
                L'assuré sélectionne son type de soin, saisit le montant souhaité ainsi que la durée de remboursement sur le simulateur. La plateforme calcule instantanément la mensualité estimée au taux de base de 8.5%.
              </p>
              <h4 className="text-lg font-bold text-slate-800 leading-snug tracking-[-0.01em]">Étape 2 : Compléter le dossier KYC</h4>
              <p className="text-slate-600 leading-relaxed tracking-[0.01em] mb-5 max-w-[70ch]">
                Pour qu'une banque accepte d'octroyer le prêt, vous devez téléverser les justificatifs requis (CNI, bulletins de salaire, relevés bancaires récents, et devis clinique). L'analyse par notre algorithme IA-KYC accélère grandement le traitement.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Vidéo d'Introduction</h4>
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center group shadow-md cursor-pointer" onClick={() => showToast("Lecture du tutoriel...")}>
                <div className="w-12 h-12 bg-white/20 border border-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110">
                  <i className="ti ti-player-play-filled"></i>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold">03:45 min</div>
              </div>
              <p className="text-xs text-slate-400 leading-normal tracking-[0.01em] mb-0 text-center">Tutoriel interactif d'initiation et de configuration du compte.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REDIRECTED PAGE 2: Académie Prêt Santé (Webinars)
  if (activeTopic === 'training') {
    return (
      <div className="pilotage-view animate-fade-in">
        <div className="view-header flex items-center justify-between mb-6">
          <div className="title-group">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Académie Prêt Santé</h1>
            <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Tutoriels vidéos et webinaires avancés pour les administrateurs et banques partenaires.</p>
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm" onClick={() => setActiveTopic(null)}>
            <i className="ti ti-arrow-left"></i> Retour à l'aide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-4">
            <div className="relative aspect-video bg-indigo-950/20 rounded-2xl flex items-center justify-center group cursor-pointer border border-indigo-900/10 shadow-sm" onClick={() => showToast("Lecture du webinaire...")}>
              <span className="p-3 bg-indigo-600 rounded-full text-white text-lg transition-all group-hover:scale-110 shadow-md"><i className="ti ti-player-play"></i></span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest block bg-indigo-50 w-max px-2 py-0.5 rounded-full">WEBINAIRE ADMIN</span>
              <h4 className="text-base font-bold text-slate-800 leading-snug">Gestion des Risques & Scoring IA</h4>
              <p className="text-xs text-slate-500 leading-relaxed tracking-[0.01em] max-w-[70ch] mb-0">Apprenez à interpréter le score d'audit KYC et les alertes automatisées.</p>
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-4">
            <div className="relative aspect-video bg-blue-950/20 rounded-2xl flex items-center justify-center group cursor-pointer border border-blue-900/10 shadow-sm" onClick={() => showToast("Lecture du guide...")}>
              <span className="p-3 bg-blue-600 rounded-full text-white text-lg transition-all group-hover:scale-110 shadow-md"><i className="ti ti-player-play"></i></span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest block bg-blue-50 w-max px-2 py-0.5 rounded-full font-mono">TUTORIEL VIDEO</span>
              <h4 className="text-base font-bold text-slate-800 leading-snug">Configuration des Taux d'Intérêts</h4>
              <p className="text-xs text-slate-500 leading-relaxed tracking-[0.01em] max-w-[70ch] mb-0">Comment ajuster les grilles de taux partenaires et gérer l'échéancier des versements.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REDIRECTED PAGE 3: Support Technique (Live Chat)
  if (activeTopic === 'support') {
    return (
      <div className="pilotage-view animate-fade-in">
        <div className="view-header flex items-center justify-between mb-6">
          <div className="title-group">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Support Technique en Ligne</h1>
            <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Discutez en temps réel avec notre équipe de support informatique et d'audit.</p>
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm" onClick={() => setActiveTopic(null)}>
            <i className="ti ti-arrow-left"></i> Retour
          </button>
        </div>

        <div className="max-w-2xl mx-auto glass-panel bg-white border border-slate-100 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[500px]">
          <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-800 border-2 border-blue-400 flex items-center justify-center"><i className="ti ti-headset text-xl"></i></div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white mb-0">Assistance Prêt Santé</h4>
                <span className="text-[10px] text-blue-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Conseiller en ligne
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed tracking-wide ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold px-1">{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="self-start flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-450 bg-slate-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-450 bg-slate-400 animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-450 bg-slate-400 animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
            <input 
              type="text" 
              placeholder="Écrivez votre message ici..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
            <button type="submit" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/10 transition-all"><i className="ti ti-send text-base"></i></button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="header-text">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Centre d'Aide & Support</h1>
          <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Besoin d'aide ? Nos experts sont là pour vous accompagner.</p>
        </div>
      </div>
      <div className="help-container">
        <div className="glass-panel-premium support-hero-premium">
          <div className="hero-content">
            <i className="ti ti-help-hexagon hero-icon"></i>
            <h1 className="text-white leading-snug tracking-[-0.02em]">Comment pouvons-nous vous aider ?</h1>
            <p className="text-slate-200/90 leading-normal mb-0">Recherchez dans notre base de connaissances ou contactez un expert.</p>
          </div>
          <div className="search-box-premium">
            <i className="ti ti-search text-white"></i>
            <input
              type="text"
              placeholder="Guides, procédures, assistance technique..."
              value={helpSearchQuery}
              onChange={(e) => handleSearchHelp(e.target.value)}
            />
          </div>
        </div>

        <div className="help-categories-premium">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(cat => (
              <div 
                className="glass-panel-premium help-card-premium flex items-center gap-6 p-6 cursor-pointer hover:-translate-y-2 border border-slate-100 hover:border-blue-500 transition-all rounded-3xl"
                key={cat.id} 
                onClick={() => {
                  if (cat.id === 'startup' || cat.id === 'training' || cat.id === 'support') {
                    setActiveTopic(cat.id);
                  } else {
                    showToast(`Chargement : ${cat.title}`);
                  }
                }}
              >
                <div className={`h-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cat.type === 'startup' ? 'bg-blue-50 text-blue-600' : cat.type === 'support' ? 'bg-cyan-50 text-cyan-600' : cat.type === 'security' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-650'}`}>
                  <i className={`ti ${cat.icon}`}></i>
                </div>
                <div className="h-body flex-1 min-w-0">
                  <h4 className="text-base font-bold text-slate-800 leading-snug mb-1">{cat.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed tracking-[0.01em] mb-0">{cat.text}</p>
                </div>
                <i className="ti ti-chevron-right text-slate-350"></i>
              </div>
            ))
          ) : (
            <div className="empty-search-help text-center py-8">
              <i className="ti ti-search-off text-5xl text-slate-300 mb-4 block"></i>
              <p className="text-sm text-slate-600 leading-relaxed tracking-[0.01em] mb-4">Aucun guide ou FAQ ne correspond à "<b>{helpSearchQuery}</b>"</p>
              <button className="btn-premium secondary" onClick={() => handleSearchHelp("")}>Réinitialiser la recherche</button>
            </div>
          )}
        </div>

        <div className="glass-panel-premium faq-section-premium p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="section-title flex items-center gap-3">
            <i className="ti ti-list-details text-blue-700 text-xl"></i>
            <h3 className="text-lg font-bold text-slate-800">Questions Fréquentes</h3>
          </div>
          <div className="faq-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div className="faq-card p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white transition-all shadow-sm flex flex-col gap-2" key={idx} onClick={() => showToast(`Détails FAQ : ${faq.tag}`)}>
                  <strong className="text-sm font-bold text-slate-800 leading-snug">{faq.q}</strong>
                  <p className="text-xs text-slate-500 leading-relaxed tracking-[0.01em] mb-0">{faq.a}</p>
                </div>
              ))
            ) : (
              <p className="no-faq-match text-xs text-slate-400">Aucune question fréquente ne correspond à votre recherche.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ isDarkMode, setIsDarkMode, emailNotifications, setEmailNotifications, setActiveModal, showToast }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header"><h1>Paramètres du Système</h1></div>
    <div className="settings-grid-premium">
      <div className="settings-main-column">
        <div className="glass-panel-premium settings-card-premium">
          <div className="card-header-premium">
            <i className="ti ti-palette"></i>
            <h3>Préférences d'Affichage</h3>
          </div>
          <div className="setting-control-stack">
            <div className="setting-control-row">
              <div className="s-info">
                <strong>Mode Sombre</strong>
                <span>Optimise l'interface pour les environnements peu éclairés.</span>
              </div>
              <div className="s-action">
                <label className="switch-premium">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => {
                      setIsDarkMode(e.target.checked);
                      showToast(e.target.checked ? "Mode sombre activé" : "Mode clair activé");
                    }}
                  />
                  <span className="slider-premium"></span>
                </label>
              </div>
            </div>
            <div className="setting-control-row">
              <div className="s-info">
                <strong>Notifications Email</strong>
                <span>Recevoir un récapitulatif quotidien des activités de pilotage.</span>
              </div>
              <div className="s-action">
                <label className="switch-premium">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => {
                      setEmailNotifications(e.target.checked);
                      showToast(e.target.checked ? "Notifications activées" : "Notifications désactivées");
                    }}
                  />
                  <span className="slider-premium"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel-premium settings-card-premium">
          <div className="card-header-premium">
            <i className="ti ti-shield-check"></i>
            <h3>Sécurité du Compte</h3>
          </div>
          <div className="security-actions-group">
            <div className="security-item" onClick={() => setActiveModal('password')}>
              <div className="sec-icon"><i className="ti ti-key"></i></div>
              <div className="sec-text">
                <strong>Changer le mot de passe</strong>
                <span>Dernière modification : Il y a 3 mois</span>
              </div>
              <i className="ti ti-chevron-right"></i>
            </div>
            <div className="security-item" onClick={() => setActiveModal('sessions')}>
              <div className="sec-icon"><i className="ti ti-device-laptop"></i></div>
              <div className="sec-text">
                <strong>Gérer les sessions actives</strong>
                <span>2 appareils connectés actuellement</span>
              </div>
              <i className="ti ti-chevron-right"></i>
            </div>
            <div className="security-item" onClick={() => showToast("Configuration 2FA...")}>
              <div className="sec-icon"><i className="ti ti-shield-half-filled"></i></div>
              <div className="sec-text">
                <strong>Authentification à deux facteurs</strong>
                <span>Renforcez la sécurité de votre accès</span>
              </div>
              <i className="ti ti-chevron-right"></i>
            </div>
            <div className="security-item" onClick={() => showToast("Historique de connexion...")}>
              <div className="sec-icon"><i className="ti ti-history"></i></div>
              <div className="sec-text">
                <strong>Journal de connexion</strong>
                <span>Dernière connexion : Aujourd'hui à 14:22</span>
              </div>
              <i className="ti ti-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-side-column">
        <div className="glass-panel-premium system-status-card">
          <div className="card-header-premium">
            <i className="ti ti-activity"></i>
            <h3>État du Système</h3>
          </div>
          <div className="status-metric">
            <div className="m-label">Version du Noyau</div>
            <div className="m-val">v2.4.5-pro</div>
          </div>
          <div className="status-metric">
            <div className="m-label">Région de Déploiement</div>
            <div className="m-val">Abidjan Nord (Côte d'Ivoire)</div>
          </div>
          <div className="status-metric">
            <div className="m-label">Dernière Synchronisation</div>
            <div className="m-val">Il y a 45 secondes</div>
          </div>
          <div className="status-indicator-full online">
            <i className="ti ti-circle-check"></i>
            <span>Système Critique Opérationnel</span>
          </div>
        </div>

        <div className="glass-panel-premium system-status-card">
          <div className="card-header-premium">
            <i className="ti ti-cloud-computing"></i>
            <h3>Infrastructure</h3>
          </div>
          <div className="status-metric">
            <div className="m-label">Utilisation CPU</div>
            <div className="m-val">12%</div>
          </div>
          <div className="status-metric">
            <div className="m-label">Mémoire Vive</div>
            <div className="m-val">4.2 GB / 16 GB</div>
          </div>
          <div className="status-indicator-full info">
            <i className="ti ti-info-circle"></i>
            <span>Optimisation Automatique Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;
