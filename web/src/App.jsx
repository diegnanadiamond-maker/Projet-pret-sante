import { useState, useEffect } from 'react';
import './App.css';
import PretSanteMobile from './components/PretSanteMobile';

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
  // Restaure une éventuelle session client mémorisée ("Se souvenir de moi")
  const savedSession = (() => {
    try {
      const s = localStorage.getItem('pretSanteSession');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();
  const [isLoggedIn, setIsLoggedIn] = useState(!!savedSession);
  const [userRole, setUserRole] = useState(savedSession ? 'user' : null); // 'user', 'admin', 'bank'
  const [clientProfile, setClientProfile] = useState(savedSession); // infos du client connecté
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
  const handleLogin = (role, profile = null) => {
    setUserRole(role);
    setClientProfile(profile);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    showToast(profile
      ? `Bienvenue ${profile.fullName.split(' ')[0]} !`
      : `Session pilotage active : ${role.toUpperCase()}`);
  };

  const handleRoleSwitch = (role) => {
    setUserRole(role);
    setActiveTab('dashboard');
    showToast(`Mode ${role.toUpperCase()} activé`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setClientProfile(null);
    setActiveTab('dashboard');
    localStorage.removeItem('pretSanteSession');
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
        clientProfile={clientProfile}
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
              <UserDashboard navigateToTab={navigateToTab} kycPercentage={kycPercentage} showToast={showToast} clientProfile={clientProfile} />
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

// --- HELPERS AUTH CLIENT (mock localStorage — remplaçable par une vraie API/bcrypt) ---
const CLIENTS_KEY = 'pretSanteClients';

const getStoredClients = () => {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || [];
  } catch {
    return [];
  }
};
const saveStoredClients = (clients) => localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));

// Hash SIMULÉ — non sécurisé, uniquement pour la démo frontend.
// En production : hash bcrypt côté backend, jamais en clair dans le navigateur.
const mockHash = (pwd) => `mock$${btoa(unescape(encodeURIComponent(pwd)))}`;

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Score de force du mot de passe : 0 (vide) à 4 (excellent)
const passwordScore = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};
const STRENGTH_LABELS = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Excellent'];
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'];

const LoginView = ({ onLogin }) => {
  const [mode, setMode] = useState('welcome'); // 'welcome' | 'register' | 'login'
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reg, setReg] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '', cgu: false });
  const [log, setLog] = useState({ email: '', password: '', remember: false });

  const switchMode = (m) => {
    setError('');
    setInfo('');
    setMode(m);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    const { fullName, email, phone, password, confirm, cgu } = reg;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!isEmailValid(email)) {
      setError('Adresse email invalide.');
      return;
    }
    if (passwordScore(password) < 2) {
      setError('Mot de passe trop faible (min. 8 caractères, avec chiffres et majuscules).');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (!cgu) {
      setError("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }

    const clients = getStoredClients();
    if (clients.some((c) => c.email === email.trim().toLowerCase())) {
      setError('Un compte existe déjà avec cette adresse email.');
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();
    const newClient = {
      id: `client_${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: mockHash(password),
      createdAt: now,
      lastLogin: now,
    };
    saveStoredClients([...clients, newClient]);

    setTimeout(() => {
      setIsSubmitting(false);
      // eslint-disable-next-line no-unused-vars
      const { password: _pwd, ...profile } = newClient;
      onLogin('user', profile);
    }, 700);
  };

  const handleClientLogin = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const { email, password, remember } = log;

    if (!email.trim() || !password) {
      setError('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    const clients = getStoredClients();
    const client = clients.find((c) => c.email === email.trim().toLowerCase());
    if (!client || client.password !== mockHash(password)) {
      setError('Email ou mot de passe incorrect.');
      return;
    }

    setIsSubmitting(true);
    const updated = { ...client, lastLogin: new Date().toISOString() };
    saveStoredClients(clients.map((c) => (c.id === client.id ? updated : c)));
    // eslint-disable-next-line no-unused-vars
    const { password: _pwd, ...profile } = updated;

    if (remember) {
      localStorage.setItem('pretSanteSession', JSON.stringify(profile));
    } else {
      localStorage.removeItem('pretSanteSession');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin('user', profile);
    }, 700);
  };

  const regScore = passwordScore(reg.password);

  return (
    <div className="login-gateway animate-fade-in">
      <div className="gateway-overlay"></div>
      <div className={`login-card-enterprise glass-panel ${mode !== 'welcome' ? 'auth-compact' : ''}`}>
        <div className="brand-header">
          <div className="brand-logo-main">
            <div className="brand-icon-wrapper-large"><i className="ti ti-heart-rate-monitor"></i></div>
            <span>Prêt Santé</span>
          </div>
          <div className="gateway-status">
            <span className="status-dot online"></span>
            Espace Client Sécurisé
          </div>
        </div>

        {/* ÉCRAN 1 — ACCUEIL */}
        {mode === 'welcome' && (
          <div className="auth-welcome animate-fade-in">
            <div className="login-intro">
              <h2>Bienvenue sur votre espace santé</h2>
              <p>Financez vos soins en toute sérénité. Connectez-vous ou créez votre compte pour commencer.</p>
            </div>

            <div className="auth-choice-grid">
              <button className="auth-choice-card" onClick={() => switchMode('login')}>
                <div className="ac-icon login"><i className="ti ti-login-2"></i></div>
                <div className="ac-body">
                  <h3>Se connecter</h3>
                  <p>J'ai déjà un compte client Prêt Santé.</p>
                </div>
                <i className="ti ti-chevron-right ac-arrow"></i>
              </button>

              <button className="auth-choice-card primary" onClick={() => switchMode('register')}>
                <div className="ac-icon register"><i className="ti ti-user-plus"></i></div>
                <div className="ac-body">
                  <h3>Créer un compte</h3>
                  <p>Je suis nouveau et je souhaite m'inscrire.</p>
                </div>
                <i className="ti ti-chevron-right ac-arrow"></i>
              </button>
            </div>

            <div className="auth-quick-access">
              <span className="qa-label">Accès professionnel</span>
              <div className="qa-btns">
                <button onClick={() => onLogin('bank')}><i className="ti ti-building-bank"></i> Espace Banque</button>
                <button onClick={() => onLogin('admin')}><i className="ti ti-shield-lock"></i> Administration</button>
              </div>
            </div>
          </div>
        )}

        {/* ÉCRAN 2 — INSCRIPTION */}
        {mode === 'register' && (
          <form className="auth-form animate-slide-up" onSubmit={handleRegister}>
            <button type="button" className="auth-back-btn" onClick={() => switchMode('welcome')}>
              <i className="ti ti-arrow-left"></i> Retour
            </button>
            <div className="auth-form-head">
              <h2>Créer votre compte</h2>
              <p>Rejoignez Prêt Santé en quelques secondes.</p>
            </div>

            {error && <div className="auth-error"><i className="ti ti-alert-triangle"></i><span>{error}</span></div>}

            <div className="auth-fields">
              <div className="auth-field">
                <label>Nom complet</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-user"></i>
                  <input type="text" placeholder="Ex: Awa Koné" value={reg.fullName} onChange={(e) => setReg({ ...reg, fullName: e.target.value })} />
                </div>
              </div>
              <div className="auth-field">
                <label>Adresse email</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-mail"></i>
                  <input type="email" placeholder="awa@email.com" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
                </div>
              </div>
              <div className="auth-field">
                <label>Téléphone</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-phone"></i>
                  <input type="tel" placeholder="+225 07 00 00 00 00" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} />
                </div>
              </div>
              <div className="auth-field">
                <label>Mot de passe</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock"></i>
                  <input type="password" placeholder="••••••••" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
                </div>
                {reg.password && (
                  <div className="password-strength">
                    <div className="ps-bars">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="ps-bar" style={{ background: i < regScore ? STRENGTH_COLORS[regScore] : 'var(--ps-empty, #e2e8f0)' }}></span>
                      ))}
                    </div>
                    <span className="ps-label" style={{ color: STRENGTH_COLORS[regScore] }}>{STRENGTH_LABELS[regScore]}</span>
                  </div>
                )}
              </div>
              <div className="auth-field">
                <label>Confirmer le mot de passe</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock-check"></i>
                  <input type="password" placeholder="••••••••" value={reg.confirm} onChange={(e) => setReg({ ...reg, confirm: e.target.value })} />
                </div>
              </div>
            </div>

            <label className="auth-checkbox">
              <input type="checkbox" checked={reg.cgu} onChange={(e) => setReg({ ...reg, cgu: e.target.checked })} />
              <span>J'accepte les <b>conditions générales d'utilisation</b> et la politique de confidentialité.</span>
            </label>

            <button type="submit" className={`auth-submit ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? <><i className="ti ti-loader-2 animate-spin"></i> Création...</> : <>Créer mon compte <i className="ti ti-arrow-right"></i></>}
            </button>

            <p className="auth-switch-line">
              Déjà inscrit ? <button type="button" onClick={() => switchMode('login')}>Se connecter</button>
            </p>
          </form>
        )}

        {/* ÉCRAN 3 — CONNEXION */}
        {mode === 'login' && (
          <form className="auth-form animate-slide-up" onSubmit={handleClientLogin}>
            <button type="button" className="auth-back-btn" onClick={() => switchMode('welcome')}>
              <i className="ti ti-arrow-left"></i> Retour
            </button>
            <div className="auth-form-head">
              <h2>Connexion</h2>
              <p>Accédez à votre espace santé personnel.</p>
            </div>

            {error && <div className="auth-error"><i className="ti ti-alert-triangle"></i><span>{error}</span></div>}
            {info && <div className="auth-info"><i className="ti ti-info-circle"></i><span>{info}</span></div>}

            <div className="auth-fields">
              <div className="auth-field">
                <label>Adresse email</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-mail"></i>
                  <input type="email" placeholder="awa@email.com" value={log.email} onChange={(e) => setLog({ ...log, email: e.target.value })} />
                </div>
              </div>
              <div className="auth-field">
                <label>Mot de passe</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock"></i>
                  <input type="password" placeholder="••••••••" value={log.password} onChange={(e) => setLog({ ...log, password: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="auth-form-row">
              <label className="auth-checkbox inline">
                <input type="checkbox" checked={log.remember} onChange={(e) => setLog({ ...log, remember: e.target.checked })} />
                <span>Se souvenir de moi</span>
              </label>
              <button type="button" className="auth-link" onClick={() => { setError(''); setInfo('Un lien de réinitialisation a été envoyé à votre adresse (simulation).'); }}>
                Mot de passe oublié ?
              </button>
            </div>

            <button type="submit" className={`auth-submit ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? <><i className="ti ti-loader-2 animate-spin"></i> Connexion...</> : <>Se connecter <i className="ti ti-arrow-right"></i></>}
            </button>

            <p className="auth-switch-line">
              Pas encore de compte ? <button type="button" onClick={() => switchMode('register')}>Créer un compte</button>
            </p>
          </form>
        )}

        <div className="login-legal">
          <div className="legal-links">
            <span>Mentions Légales</span>
            <span className="dot-sep"></span>
            <span>Sécurité &amp; Confidentialité</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ userRole, activeTab, navigateToTab, handleLogout, clientProfile }) => (
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
        <div className="avatar-mini">
          {userRole === 'user'
            ? (clientProfile?.fullName ? clientProfile.fullName.trim()[0].toUpperCase() : 'C')
            : (userRole ? userRole[0].toUpperCase() : 'A')}
        </div>
        <div className="u-info">
          <strong>
            {userRole === 'admin'
              ? 'Super Admin'
              : userRole === 'bank'
                ? 'SGCI Ops'
                : (clientProfile?.fullName || 'Espace Client')}
          </strong>
          <span>{userRole === 'user' ? 'CLIENT' : userRole ? userRole.toUpperCase() : ''}</span>
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

const BankDashboard = ({ showToast }) => {
  const [activeModal, setActiveModal] = useState(null); // null, 'contract', 'complement'
  const [selectedApp, setSelectedApp] = useState(MOCK_APPLICATIONS[0]);
  const [missingDocs, setMissingDocs] = useState({ releve: true, devis: true, ocr: false });
  const [customComment, setCustomComment] = useState("");

  const handleGenerateContract = () => {
    setActiveModal('contract');
  };

  const handleRequestComplement = () => {
    setActiveModal('complement');
  };

  return (
    <div className="pilotage-view animate-fade-in">
      <div className="view-header">
        <div className="title-group">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Gestionnaire de Crédit · SGCI</h1>
          <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Traitement des formalités et déblocage de fonds</p>
        </div>
        <div className="header-actions">
          <span className="status-pill active-glow">
            <i className="ti ti-antenna mr-2 text-emerald-600"></i> Connecté à Risk-Ops
          </span>
        </div>
      </div>

      <div className="dashboard-grid-requests">
        <div className="requests-list-container">
          <div className="section-header-premium mb-6">
            <h3 className="text-xl font-bold text-slate-800 leading-snug tracking-[-0.01em]">Dossiers en attente de décision</h3>
            <div className="filter-group">
              <button className="filter-btn active">Tout</button>
              <button className="filter-btn" onClick={() => showToast("Filtre appliqué")}>Risque Faible</button>
              <button className="filter-btn" onClick={() => showToast("Filtre appliqué")}>Risque Moyen</button>
            </div>
          </div>
          <div className="requests-vertical-list flex flex-col gap-4">
            {MOCK_APPLICATIONS.map(app => (
              <div 
                className={`request-strip-premium glass-panel w-full flex items-center gap-6 p-5 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all border ${selectedApp?.id === app.id ? 'border-emerald-500 bg-emerald-50/10' : 'border-transparent'}`} 
                key={app.id}
                onClick={() => setSelectedApp(app)}
              >
                <div className="r-avatar-group flex items-center relative">
                  <div className="r-avatar-main w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">{app.user[0]}</div>
                  <div className="r-risk-dot w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-white" style={{ background: app.risk === 'Faible' ? '#10b981' : '#f59e0b' }}></div>
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
                  <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-700" style={{ borderColor: app.scoring > 80 ? '#10b981' : '#f59e0b' }}>
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
                  <button className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all" title="Accorder le prêt" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); handleGenerateContract(); }}><i className="ti ti-check"></i></button>
                  
                  {/* Pushed all the way to the right of the card */}
                  <button 
                    className="relative w-8 h-8 rounded-lg border border-slate-100 hover:border-emerald-100 text-slate-400 hover:text-emerald-700 flex items-center justify-center transition-all bg-white" 
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
              <i className="ti ti-database-check text-emerald-700 text-xl"></i>
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
                <div className="w-4 h-4 rounded-full border-2 border-slate-350 border-t-emerald-600 animate-spin"></div>
              </div>
            </div>

            <div className="risk-meter space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Indice de confiance global</span>
                <strong className="text-emerald-700">89%</strong>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: '89%' }}></div>
              </div>
            </div>

            {/* Interactive functional action triggers */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleGenerateContract}
                className="btn-premium primary w-full cursor-pointer"
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
                <strong className="text-xs font-bold text-emerald-800">450k FCFA</strong>
                <em className="text-[10px] text-slate-400 not-italic">Aujourd'hui</em>
              </div>
              <div className="payout-row flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">M. Keita</span>
                <strong className="text-xs font-bold text-emerald-800">120k FCFA</strong>
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
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 font-mono text-xs space-y-3 text-slate-700 leading-relaxed">
                <div className="text-center font-bold border-b border-emerald-100 pb-2 text-emerald-800 text-sm">
                  ACTE DE CRÉDIT MÉDICAL #CM-{selectedApp?.id}
                </div>
                <div className="flex justify-between"><span>Bénéficiaire:</span><span className="font-bold">{selectedApp?.user}</span></div>
                <div className="flex justify-between"><span>Établissement:</span><span className="font-bold">Clinique Avicenne</span></div>
                <div className="flex justify-between"><span>Besoin de santé:</span><span className="font-bold">{selectedApp?.care}</span></div>
                <div className="flex justify-between"><span>Montant Prêt:</span><span className="font-bold text-emerald-800">{selectedApp?.amount}</span></div>
                <div className="flex justify-between"><span>Taux d'intérêt:</span><span className="font-bold">7.9% SGCI Santé +</span></div>
                <div className="flex justify-between"><span>Durée:</span><span className="font-bold">12 Mois</span></div>
                <div className="flex justify-between"><span>Mensualités:</span><span className="font-bold text-emerald-800">~ 21 875 FCFA / mois</span></div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[70ch] mb-0">
                La validation de cette étape va générer le contrat officiel au format PDF sécurisé, et notifier l'assuré pour signature électronique immédiate sur son espace client.
              </p>
              <div className="modal-actions flex justify-end gap-3 pt-2">
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold" onClick={() => setActiveModal(null)}>Annuler</button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-md shadow-emerald-600/10" 
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
                      className="accent-emerald-600 rounded" 
                      checked={missingDocs.releve} 
                      onChange={(e) => setMissingDocs(p => ({ ...p, releve: e.target.checked }))} 
                    />
                    <span className="text-xs font-semibold text-slate-700">Relevé Bancaire (3 derniers mois)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-all">
                    <input 
                      type="checkbox" 
                      className="accent-emerald-600 rounded" 
                      checked={missingDocs.devis} 
                      onChange={(e) => setMissingDocs(p => ({ ...p, devis: e.target.checked }))} 
                    />
                    <span className="text-xs font-semibold text-slate-700">Devis Médical Établi par la clinique</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl cursor-pointer border border-slate-100 transition-all">
                    <input 
                      type="checkbox" 
                      className="accent-emerald-600 rounded" 
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-emerald-600 min-h-[90px]"
                />
              </div>

              <div className="modal-actions flex justify-end gap-3 pt-2">
                <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold" onClick={() => setActiveModal(null)}>Annuler</button>
                <button 
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-md shadow-emerald-600/10" 
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

const UserDashboard = ({ navigateToTab, kycPercentage, clientProfile }) => {
  const firstName = clientProfile?.fullName?.split(' ')[0] || 'Assuré';
  const initials = clientProfile?.fullName
    ? clientProfile.fullName.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'PS';
  const memberSince = clientProfile?.createdAt
    ? new Date(clientProfile.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <div className="title-group">
        <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Bonjour, {firstName} 👋</h1>
        <p className="text-slate-500 leading-normal tracking-[0.01em] mb-0">Voici l'état de votre santé financière aujourd'hui.</p>
      </div>
      <div className="header-actions">
        <button className="btn-premium primary" onClick={() => navigateToTab('simulateur')}><i className="ti ti-plus"></i> Nouveau Prêt</button>
      </div>
    </div>

    <div className="user-dashboard-grid">
      <div className="u-main-panel">
        <div className="metric-card-premium highlight flex items-center justify-between p-6 bg-emerald-900 text-white rounded-3xl shadow-sm">
          <div className="m-info space-y-1">
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-[0.05em]">PRÊT ACTIF</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">350 000 FCFA</div>
            <span className="text-xs text-emerald-100/80 leading-normal tracking-[0.01em] block">Prochaine échéance : 25 Juin 2024</span>
          </div>
          <div className="m-icon text-3xl text-emerald-300"><i className="ti ti-activity-heartbeat"></i></div>
        </div>

        <div className="glass-panel recent-activity p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 leading-snug tracking-[-0.01em]">Suivi des demandes</h3>
          <div className="activity-track flex flex-col gap-4">
            <div className="track-item current flex items-start gap-4 p-3 bg-slate-50 rounded-2xl">
              <div className="t-ico p-2.5 bg-slate-200 rounded-xl text-slate-600 flex items-center justify-center"><i className="ti ti-loader-2 animate-spin"></i></div>
              <div className="t-det flex-1">
                <strong className="text-xs font-bold text-slate-850 block mb-0.5">Bilan de santé</strong>
                <span className="text-xs text-slate-500 leading-normal">En attente de validation BNI</span>
              </div>
            </div>
            <div className="track-item done flex items-start gap-4 p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
              <div className="t-ico p-2.5 bg-emerald-550 bg-emerald-100 rounded-xl text-emerald-700 flex items-center justify-center"><i className="ti ti-check"></i></div>
              <div className="t-det flex-1">
                <strong className="text-xs font-bold text-emerald-900 block mb-0.5">Soin Dentaire</strong>
                <span className="text-xs text-slate-500 leading-normal">Décaissé par SGCI (12/05)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="u-side-panel">
        <div className="glass-panel client-profile-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
          <div className="cp-head flex items-center gap-4">
            <div className="cp-avatar">{initials}</div>
            <div className="cp-meta min-w-0">
              <strong className="block text-sm font-bold text-slate-800 truncate">{clientProfile?.fullName || 'Compte Assuré'}</strong>
              <span className="text-xs text-slate-500 truncate block">{clientProfile?.email || 'Session invité'}</span>
            </div>
          </div>
          <div className="cp-info-list">
            <div className="cp-info-row"><i className="ti ti-phone"></i><span>{clientProfile?.phone || 'Non renseigné'}</span></div>
            <div className="cp-info-row"><i className="ti ti-calendar-event"></i><span>Membre depuis {memberSince}</span></div>
            <div className="cp-info-row"><i className="ti ti-circle-check"></i><span className="cp-badge">Compte vérifié</span></div>
          </div>
        </div>

        <div className="glass-panel kyc-summary-card p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 flex flex-col">
          <div className="k-header flex justify-between items-center text-sm font-bold">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Mes Formalités</h3>
            <span className="text-emerald-700">{kycPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-700" style={{ width: `${kycPercentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed tracking-[0.01em] mb-4 max-w-[70ch]">
            Complétez votre dossier de formalités pour accélérer l'analyse de vos futures demandes.
          </p>
          <button className="btn-premium secondary w-full py-3 text-xs font-bold rounded-xl border border-slate-200 mt-auto" onClick={() => navigateToTab('documents')}>Gérer mes documents</button>
        </div>
      </div>
    </div>
  </div>
  );
};

const SimulationView = ({ careType, setCareType, amount, setAmount, duration, setDuration, currentSim, formatFCFA, navigateToTab, showToast }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Simulateur de Crédit</h1>
    </div>
    <div className="simulation-workspace glass-panel p-6 bg-white border border-slate-100 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="sim-form flex flex-col gap-5">
        {/* Classy medical care dropdown selector, aligned cleanly and styled premium */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 gap-4 w-full">
          <label className="text-sm font-bold text-slate-700 tracking-tight">Besoin Médical</label>
          <div className="relative">
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer hover:bg-slate-100 transition-all min-w-[190px] shadow-sm appearance-none"
              value={careType}
              onChange={(e) => setCareType(Number(e.target.value))}
            >
              <option value={1}>Chirurgie Générale</option>
              <option value={2}>Soin Dentaire</option>
              <option value={3}>Accouchement / Maternité</option>
              <option value={4}>Bilan & Diagnostic</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <i className="ti ti-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.05em] flex justify-between">
            Montant Souhaité 
            <strong className="text-emerald-800 text-sm font-bold font-mono tracking-tight">{formatFCFA(amount)}</strong>
          </label>
          <input type="range" min="100000" max="2000000" step="50000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.05em]">Durée de remboursement : <strong>{duration} mois</strong></label>
          <div className="duration-presets flex gap-2">
            {[6, 12, 18, 24].map(d => (
              <button key={d} className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${duration === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`} onClick={() => setDuration(d)}>{d} mois</button>
            ))}
          </div>
        </div>
      </div>

      <div className="sim-results bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between gap-5">
        <div className="result-box space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.05em]">Mensualité estimée</span>
          <div className="text-2xl font-extrabold text-emerald-850 tracking-tight font-mono">{formatFCFA(currentSim.monthly)}</div>
        </div>
        <div className="result-details border-t border-slate-200/60 pt-4 flex flex-col gap-2.5">
          <div className="r-line flex justify-between text-xs font-semibold text-slate-500"><span>Taux Annuel (fixe)</span><b className="text-slate-800 font-bold">8.5%</b></div>
          <div className="r-line flex justify-between text-xs font-semibold text-slate-500"><span>Total à rembourser</span><b className="text-slate-800 font-bold font-mono">{formatFCFA(currentSim.total)}</b></div>
        </div>
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 text-sm mt-2" onClick={() => { showToast("Simulation enregistrée"); navigateToTab('dashboard'); }}>Confirmer & Choisir une Banque</button>
      </div>
    </div>
  </div>
);

const DocumentsView = ({ kycDocs, setKycDocs, showToast }) => (
  <div className="pilotage-view animate-fade-in">
    <div className="view-header">
      <h1 className="text-3xl font-extrabold text-slate-900 leading-snug tracking-[-0.02em] mb-2">Dossier de Formalités</h1>
    </div>
    <div className="docs-management glass-panel p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
      <div className="docs-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'cni', name: 'Pièce d\'identité (CNI/Passport)', status: kycDocs.cni },
          { id: 'salaire', name: '3 derniers bulletins de salaire', status: kycDocs.salaire },
          { id: 'releve', name: 'Relevé d\'identité bancaire (RIB)', status: kycDocs.releve },
          { id: 'devis', name: 'Devis de l\'établissement de soin', status: kycDocs.devis },
        ].map(doc => (
          <div className="doc-card flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm" key={doc.id}>
            <div className="flex items-center gap-3">
              <div className={`doc-icon p-2.5 rounded-xl flex items-center justify-center text-lg ${doc.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-200 text-slate-500'}`}><i className={`ti ${doc.status ? 'ti-file-check' : 'ti-file-upload'}`}></i></div>
              <div className="doc-body space-y-0.5">
                <strong className="text-xs font-bold text-slate-800 leading-tight block">{doc.name}</strong>
                <p className="text-[10px] text-slate-450 leading-none mb-0">{doc.status ? 'Document vérifié et validé' : 'Chargement requis'}</p>
              </div>
            </div>
            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${doc.status ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default' : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/10'}`} onClick={() => {
              if (!doc.status) {
                setKycDocs(p => ({ ...p, [doc.id]: true }));
                showToast(`Document ${doc.id.toUpperCase()} chargé avec succès`);
              }
            }}>
              {doc.status ? <i className="ti ti-check font-bold"></i> : 'Charger'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
            <div className="relative aspect-video bg-emerald-950/20 rounded-2xl flex items-center justify-center group cursor-pointer border border-emerald-900/10 shadow-sm" onClick={() => showToast("Lecture du webinaire...")}>
              <span className="p-3 bg-emerald-650 bg-emerald-600 rounded-full text-white text-lg transition-all group-hover:scale-110 shadow-md"><i className="ti ti-player-play"></i></span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest block bg-emerald-50 w-max px-2 py-0.5 rounded-full">WEBINAIRE ADMIN</span>
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
          <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center"><i className="ti ti-headset text-xl"></i></div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white mb-0">Assistance Prêt Santé</h4>
                <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Conseiller en ligne
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed tracking-wide ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-none shadow-sm'}`}>
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
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
            <button type="submit" className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10 transition-all"><i className="ti ti-send text-base"></i></button>
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
                className="glass-panel-premium help-card-premium flex items-center gap-6 p-6 cursor-pointer hover:-translate-y-2 border border-slate-100 hover:border-emerald-500 transition-all rounded-3xl" 
                key={cat.id} 
                onClick={() => {
                  if (cat.id === 'startup' || cat.id === 'training' || cat.id === 'support') {
                    setActiveTopic(cat.id);
                  } else {
                    showToast(`Chargement : ${cat.title}`);
                  }
                }}
              >
                <div className={`h-icon-wrapper w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cat.type === 'startup' ? 'bg-blue-50 text-blue-600' : cat.type === 'support' ? 'bg-emerald-50 text-emerald-600' : cat.type === 'security' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-650'}`}>
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
            <i className="ti ti-list-details text-emerald-700 text-xl"></i>
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
