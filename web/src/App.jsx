import { useState, useEffect } from 'react';
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
  const [logs, setLogs] = useState(MOCK_LOGS);

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

  const handlePurgeLogs = () => {
    if (window.confirm("Voulez-vous vraiment purger tous les journaux système ?")) {
      setLogs([]);
      showToast("Journaux système purgés");
    }
  };

  const handleExportCSV = () => {
    showToast("Préparation de l'export CSV...");
    setTimeout(() => {
      showToast("Export terminé (pret_sante_logs.csv)");
    }, 2000);
  };

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

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.user.toLowerCase().includes(searchQuery.toLowerCase())
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
        <header className="top-bar">
          <div className="search-box glass-panel-premium">
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Recherche globale (Prêts, Assurés, Banques...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && showToast(`Résultats pour : ${searchQuery}`)}
            />
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
                  onClick={() => { handleRoleSwitch('user'); showToast("Mode Client activé"); }}
                >
                  <i className="ti ti-user"></i>
                  <span>Client</span>
                </button>
                <button
                  className={`role-tab ${userRole === 'bank' ? 'active' : ''}`}
                  onClick={() => { handleRoleSwitch('bank'); showToast("Mode Banque activé"); }}
                >
                  <i className="ti ti-building-bank"></i>
                  <span>Banque</span>
                </button>
                <button
                  className={`role-tab ${userRole === 'admin' ? 'active' : ''}`}
                  onClick={() => { handleRoleSwitch('admin'); showToast("Mode Admin activé"); }}
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
          {activeTab === 'dashboard' && (
            userRole === 'admin' ? (
              <AdminDashboard
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                handleGlobalReport={handleGlobalReport}
                showToast={showToast}
                logs={logs.filter(l => l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.user.toLowerCase().includes(searchQuery.toLowerCase()))}
                banks={banks.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.fullName.toLowerCase().includes(searchQuery.toLowerCase()))}
              />
            ) : userRole === 'bank' ? (
              <BankDashboard showToast={showToast} />
            ) : (
              <UserDashboard navigateToTab={navigateToTab} kycPercentage={kycPercentage} showToast={showToast} />
            )
          )}
          {(activeTab === 'requests' || activeTab === 'risk') && <BankDashboard showToast={showToast} />}
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
          {activeTab === 'simulateur' && <SimulationView
            careType={careType}
            setCareType={setCareType}
            amount={amount}
            setAmount={setAmount}
            duration={duration}
            setDuration={setDuration}
            currentSim={currentSim}
            formatFCFA={formatFCFA}
            navigateToTab={navigateToTab}
            showToast={showToast}
          />}
          {activeTab === 'documents' && <DocumentsView
            kycDocs={kycDocs}
            setKycDocs={setKycDocs}
            showToast={showToast}
          />}
          {activeTab === 'logs' && <LogsListView logs={filteredLogs} handlePurgeLogs={handlePurgeLogs} handleExportCSV={handleExportCSV} showToast={showToast} />}
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
          {(activeTab !== 'dashboard' && activeTab !== 'simulateur' && activeTab !== 'documents' && activeTab !== 'users' && activeTab !== 'banks' && activeTab !== 'logs' && activeTab !== 'help' && activeTab !== 'settings' && activeTab !== 'requests' && activeTab !== 'risk') && (
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

const LogsListView = ({ logs, handlePurgeLogs, handleExportCSV }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1>Logs de Sécurité & Activité</h1>
        <p className="subtitle">Traçabilité complète des actions du système en temps réel</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium secondary" onClick={handlePurgeLogs}><i className="ti ti-trash"></i> Purger</button>
        <button className="btn-premium primary" onClick={handleExportCSV}><i className="ti ti-file-export"></i> Exporter CSV</button>
      </div>
    </div>
    <div className="glass-panel logs-list-full-container">
      {logs.map(log => (
        <div className="log-entry-premium" key={log.id}>
          <div className={`log-type-indicator ${log.type.toLowerCase()}`}></div>
          <div className="log-content-wrapper">
            <div className="log-main">
              <div className="log-action-text">{log.action}</div>
              <div className="log-user-text">Initié par <b>{log.user}</b></div>
            </div>
            <div className="log-meta">
              <div className="log-time-text">{log.time}</div>
              <span className={`log-badge ${log.type.toLowerCase()}`}>{log.type}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BankDashboard = ({ showToast }) => (
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
                <button className="icon-btn" onClick={() => showToast("Vous avez 3 nouvelles notifications d'audit")}><i className="ti ti-bell"></i><div className="dot"></div></button>
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

const DocumentsView = ({ kycDocs, setKycDocs, showToast }) => (
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
            <button className={`btn-doc ${doc.status ? 'valid' : 'upload'}`} onClick={() => {
              if (!doc.status) {
                setKycDocs(p => ({ ...p, [doc.id]: true }));
                showToast(`Document ${doc.id.toUpperCase()} chargé avec succès`);
              }
            }}>
              {doc.status ? <i className="ti ti-check"></i> : 'Charger'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HelpCenterView = ({ handleSearchHelp, helpSearchQuery, showToast }) => {
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

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="header-text">
          <h1>Centre d'Aide & Support</h1>
          <p className="subtitle">Besoin d'aide ? Nos experts sont là pour vous accompagner.</p>
        </div>
      </div>
      <div className="help-container">
        <div className="glass-panel-premium support-hero-premium">
          <div className="hero-content">
            <i className="ti ti-help-hexagon hero-icon"></i>
            <h1>Comment pouvons-nous vous aider ?</h1>
            <p>Recherchez dans notre base de connaissances ou contactez un expert.</p>
          </div>
          <div className="search-box-premium">
            <i className="ti ti-search"></i>
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
              <div className="glass-panel-premium help-card-premium" key={cat.id} onClick={() => showToast(`Chargement : ${cat.title}`)}>
                <div className={`h-icon-wrapper ${cat.type}`}><i className={`ti ${cat.icon}`}></i></div>
                <div className="h-body">
                  <h4>{cat.title}</h4>
                  <p>{cat.text}</p>
                </div>
                <i className="ti ti-chevron-right"></i>
              </div>
            ))
          ) : (
            <div className="empty-search-help">
              <i className="ti ti-search-off" style={{ fontSize: '48px', opacity: 0.3, marginBottom: '15px' }}></i>
              <p>Aucun guide ou FAQ ne correspond à "<b>{helpSearchQuery}</b>"</p>
              <button className="btn-premium secondary" onClick={() => handleSearchHelp("")}>Réinitialiser la recherche</button>
            </div>
          )}
        </div>

        <div className="glass-panel-premium faq-section-premium">
          <div className="section-title">
            <i className="ti ti-list-details"></i>
            <h3>Questions Fréquentes</h3>
          </div>
          <div className="faq-grid">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div className="faq-card" key={idx} onClick={() => showToast(`Détails FAQ : ${faq.tag}`)}>
                  <strong>{faq.q}</strong>
                  <p>{faq.a}</p>
                </div>
              ))
            ) : (
              <p className="no-faq-match">Aucune question fréquente ne correspond à votre recherche.</p>
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
