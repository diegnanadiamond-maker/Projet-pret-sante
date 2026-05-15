import { useState } from 'react';
import './App.css';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('accueil'); // 'accueil', 'dashboard', 'demande', 'offres', 'profil'
  
  // Loan Request Form State
  const [careType, setCareType] = useState(1); // 1: Dentaire, 2: Accouchement, 3: Bilan, 4: Autre
  const [hospital, setHospital] = useState('Clinique Avicenne – Abidjan');
  const [amount, setAmount] = useState(250000);
  const [duration, setDuration] = useState(12);
  
  // KYC State
  const [kycDocs, setKycDocs] = useState({
    cni: true,
    salaire: true,
    releve: false,
    devis: false
  });
  
  // Toast Notification State
  const [toast, setToast] = useState(null);
  
  const showToast = (text) => {
    setToast(text);
    setTimeout(() => {
      setToast((current) => current === text ? null : current);
    }, 4000);
  };

  // Helper formatting function
  const formatFCFA = (value) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(value)) + ' FCFA';
  };

  // Dynamic simulation calculator
  const calculateLoanSim = (principal, months, annualRate = 0.085) => {
    const monthlyRate = annualRate / 12;
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    return {
      monthly: Math.round(monthlyPayment),
      total: Math.round(totalPayment),
      rate: annualRate * 100
    };
  };

  const currentSim = calculateLoanSim(amount, duration);
  
  // Specific Bank offers simulation based on dynamic inputs
  const sgciSim = calculateLoanSim(amount, duration, 0.079);
  const bniSim = calculateLoanSim(amount, duration, 0.092);
  const ecobankSim = calculateLoanSim(amount, duration, 0.105);

  // Dynamic KYC progression calculation
  const totalKycDocs = 4;
  const verifiedKycDocs = Object.values(kycDocs).filter(Boolean).length;
  const kycPercentage = Math.round((verifiedKycDocs / totalKycDocs) * 100);
  const missingDocsCount = totalKycDocs - verifiedKycDocs;

  // Handle uploading simulation
  const handleSimulateUpload = (docKey, docName) => {
    setKycDocs(prev => ({ ...prev, [docKey]: true }));
    showToast(`Document "${docName}" téléversé et vérifié avec succès !`);
  };

  // Handle tab switcher with feedback
  const navigateToTab = (tabId, feedbackMsg = null) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (feedbackMsg) {
      showToast(feedbackMsg);
    }
  };

  // Mapping tab identifiers to mobile navigation bottom tabs indices
  const getBottomNavActive = () => {
    switch(activeTab) {
      case 'accueil':
      case 'dashboard': return 'home';
      case 'demande': return 'loan';
      case 'offres': return 'banks';
      case 'profil': return 'profile';
      default: return 'home';
    }
  };

  return (
    <div className="app-container">
      {/* Premium Web Header */}
      <header className="app-header">
        <div className="brand-logo">
          <div className="brand-icon-wrapper">
            <i className="ti ti-heart-rate-monitor"></i>
          </div>
          <span>Prêt Santé <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-brand-accent)', textTransform: 'uppercase', padding: '2px 6px', background: 'var(--color-brand-light)', borderRadius: '4px', marginLeft: '4px' }}>Portail Web</span></span>
        </div>

        {/* Top Navbar */}
        <nav className="header-nav">
          <button 
            className={`nav-pill ${activeTab === 'accueil' ? 'active' : ''}`}
            onClick={() => navigateToTab('accueil')}
          >
            <i className="ti ti-home-heart"></i>
            <span>Accueil</span>
          </button>
          
          <button 
            className={`nav-pill ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateToTab('dashboard')}
          >
            <i className="ti ti-layout-dashboard"></i>
            <span>Tableau de bord</span>
          </button>

          <button 
            className={`nav-pill ${activeTab === 'demande' ? 'active' : ''}`}
            onClick={() => navigateToTab('demande')}
          >
            <i className="ti ti-file-plus"></i>
            <span>Demande de prêt</span>
          </button>

          <button 
            className={`nav-pill ${activeTab === 'offres' ? 'active' : ''}`}
            onClick={() => navigateToTab('offres')}
          >
            <i className="ti ti-building-bank"></i>
            <span>Offres banques</span>
          </button>

          <button 
            className={`nav-pill ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => navigateToTab('profil')}
          >
            <i className="ti ti-user-check"></i>
            <span>Mon profil KYC</span>
          </button>
        </nav>

        {/* User Identity Indicator */}
        <div className="header-profile">
          <div className="user-meta">
            <span className="user-name">Kouamé Adou</span>
            <span className="user-role"><i className="ti ti-shield-check"></i> Assuré Principal</span>
          </div>
          <div className="avatar-mini">KA</div>
        </div>
      </header>

      {/* Main Multi-Column Content Area */}
      <main className="main-content-wrapper">
        
        {/* Left Column - Optimized Web App Module Rendering */}
        <section className="workspace-panel">
          
          {/* MODULE 0: ACCUEIL / ONBOARDING */}
          {activeTab === 'accueil' && (
            <div className="module-card animate-fade-in">
              <div className="module-hero-banner">
                <h1 className="module-hero-title">Votre Prêt Santé Accessible</h1>
                <p className="module-hero-subtitle">
                  Financement rapide et sécurisé pour vos soins médicaux en Côte d'Ivoire. Suivez vos étapes en toute transparence et choisissez les meilleures offres de nos banques partenaires.
                </p>
              </div>

              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon green">
                    <i className="ti ti-clipboard-heart"></i>
                  </div>
                  <div className="feature-text">
                    <h3>Soins financés rapidement</h3>
                    <p>Couverture immédiate pour soins dentaires, accouchements, bilans de santé généraux et autres urgences.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon blue">
                    <i className="ti ti-building-bank"></i>
                  </div>
                  <div className="feature-text">
                    <h3>Banques partenaires</h3>
                    <p>Comparez en temps réel et choisissez en toute liberté l'offre au meilleur taux et aux meilleures conditions.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon amber">
                    <i className="ti ti-shield-lock"></i>
                  </div>
                  <div className="feature-text">
                    <h3>100% sécurisé & chiffré</h3>
                    <p>Données personnelles et médicales strictement confidentielles, conformité totale avec la législation locale.</p>
                  </div>
                </div>
              </div>

              <div className="btn-actions-row" style={{ justifyContent: 'center', paddingBottom: '3rem' }}>
                <button 
                  className="btn-premium primary"
                  onClick={() => navigateToTab('dashboard', "Bienvenue sur votre espace de gestion santé.")}
                >
                  Accéder à mon tableau de bord <i className="ti ti-arrow-right"></i>
                </button>
                <button 
                  className="btn-premium secondary"
                  onClick={() => navigateToTab('demande')}
                >
                  Simuler un prêt directement
                </button>
              </div>
            </div>
          )}

          {/* MODULE 1: TABLEAU DE BORD */}
          {activeTab === 'dashboard' && (
            <div className="module-card animate-fade-in">
              <div className="section-wrapper" style={{ paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Espace Assuré</span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Bonjour 👋 Kouamé Adou</h2>
                  </div>
                  <span className="status-pill active" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                    <i className="ti ti-circle-check-filled"></i> Compte Actif
                  </span>
                </div>

                {/* Main Dashboard Financial Focus Card */}
                <div className="metric-card highlight" style={{ marginBottom: '2rem' }}>
                  <div className="metric-header">
                    <span className="metric-label">Engagement Global en Cours</span>
                    <span className="status-pill active" style={{ background: 'white', border: '1px solid var(--color-brand-light)' }}>Prêt Santé en cours</span>
                  </div>
                  <div className="metric-val">350 000 FCFA</div>
                  <div className="metric-sub">
                    <i className="ti ti-calendar-event"></i> Prochain prélèvement / versement : 25 juin
                  </div>
                </div>

                {/* Grid Grouping Actions & Activity side by side on large desktop */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  
                  {/* Actions Rapides Web Component */}
                  <div>
                    <div className="section-head">
                      <h3 className="section-title">Actions Rapides</h3>
                    </div>
                    <div className="quick-actions-web">
                      <div className="qa-card green" onClick={() => navigateToTab('demande')}>
                        <i className="ti ti-plus"></i>
                        <span>Nouveau prêt</span>
                      </div>
                      
                      <div className="qa-card blue" onClick={() => navigateToTab('offres')}>
                        <i className="ti ti-building-bank"></i>
                        <span>Banques</span>
                      </div>

                      <div className="qa-card amber" onClick={() => navigateToTab('profil')}>
                        <i className="ti ti-file-upload"></i>
                        <span>Documents</span>
                      </div>

                      <div className="qa-card red" onClick={() => showToast("Votre échéancier détaillé est parfaitement à jour pour la période.")}>
                        <i className="ti ti-calendar-stats"></i>
                        <span>Échéancier</span>
                      </div>
                    </div>
                  </div>

                  {/* Activité Récente Web Component */}
                  <div>
                    <div className="section-head">
                      <h3 className="section-title">Activité Récente</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-brand-secondary)', fontWeight: 600 }}>En direct</span>
                    </div>
                    <div className="activity-list-web">
                      <div className="activity-row">
                        <div className="act-left">
                          <div className="act-icon-box teal">
                            <i className="ti ti-tooth"></i>
                          </div>
                          <div className="act-details">
                            <h4>Prothèse dentaire</h4>
                            <p>Clinique Avicenne · 15 mai</p>
                          </div>
                        </div>
                        <span className="status-pill active" style={{ background: 'var(--color-status-success-bg)', color: 'var(--color-status-success)' }}>
                          Accepté
                        </span>
                      </div>

                      <div className="activity-row">
                        <div className="act-left">
                          <div className="act-icon-box blue">
                            <i className="ti ti-stethoscope"></i>
                          </div>
                          <div className="act-details">
                            <h4>Bilan de santé</h4>
                            <p>Centre Médical IBK · 2 mai</p>
                          </div>
                        </div>
                        <span className="status-pill pending">
                          En cours
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: DEMANDE DE PRÊT */}
          {activeTab === 'demande' && (
            <div className="module-card animate-fade-in">
              <div className="section-wrapper" style={{ paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <button onClick={() => navigateToTab('dashboard')} style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-bg-secondary)' }}>
                    <i className="ti ti-arrow-left" style={{ fontSize: '1.2rem', color: 'var(--color-text-main)' }}></i>
                  </button>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Nouvelle Demande de Prêt Santé</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Configurez les paramètres de vos soins pour estimer votre financement.</p>
                  </div>
                </div>

                <div className="form-grid">
                  
                  {/* Care Type Selection */}
                  <div className="field-group">
                    <label className="field-label">
                      <span>Type de soin requis</span>
                      <span className="hint">Sélectionnez la catégorie principale</span>
                    </label>
                    <div className="care-types-grid">
                      <div 
                        className={`care-type-card ${careType === 1 ? 'selected' : ''}`}
                        onClick={() => setCareType(1)}
                      >
                        <i className="ti ti-tooth"></i>
                        <span>Prothèse dentaire</span>
                      </div>

                      <div 
                        className={`care-type-card ${careType === 2 ? 'selected' : ''}`}
                        onClick={() => setCareType(2)}
                      >
                        <i className="ti ti-baby-carriage"></i>
                        <span>Accouchement</span>
                      </div>

                      <div 
                        className={`care-type-card ${careType === 3 ? 'selected' : ''}`}
                        onClick={() => setCareType(3)}
                      >
                        <i className="ti ti-activity"></i>
                        <span>Bilan de santé</span>
                      </div>

                      <div 
                        className={`care-type-card ${careType === 4 ? 'selected' : ''}`}
                        onClick={() => setCareType(4)}
                      >
                        <i className="ti ti-plus"></i>
                        <span>Autre soin</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital Establishment Selection */}
                  <div className="field-group" style={{ marginTop: '0.5rem' }}>
                    <label className="field-label">
                      <span>Établissement de santé conventionné</span>
                      <span className="hint">Réseau partenaire certifié</span>
                    </label>
                    <select 
                      className="custom-select"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                    >
                      <option value="Clinique Avicenne – Abidjan">Clinique Avicenne – Abidjan</option>
                      <option value="Centre Médical IBK – Plateau">Centre Médical IBK – Plateau</option>
                      <option value="Polyclinique Internationale">Polyclinique Internationale – Cocody</option>
                    </select>
                  </div>

                  {/* Amount requested Showcase & Slider */}
                  <div className="field-group" style={{ marginTop: '0.5rem' }}>
                    <label className="field-label">
                      <span>Montant du financement souhaité</span>
                      <span className="hint">Ajustable par paliers de 10 000 FCFA</span>
                    </label>
                    <div className="amount-showcase">
                      <div className="amount-display-value">{formatFCFA(amount)}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Déplacez le curseur horizontal pour calibrer l'estimation</p>
                      
                      <input 
                        type="range" 
                        className="amount-slider" 
                        min="50000" 
                        max="1000000" 
                        step="10000" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                      
                      <div className="slider-limits">
                        <span>50 000 FCFA</span>
                        <span>1 000 000 FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* Repayment Term */}
                  <div className="field-group" style={{ marginTop: '0.5rem' }}>
                    <label className="field-label">
                      <span>Durée de remboursement ciblée</span>
                      <span className="hint">Étalement conseillé</span>
                    </label>
                    <select 
                      className="custom-select"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      <option value={6}>6 mois</option>
                      <option value={12}>12 mois</option>
                      <option value={18}>18 mois</option>
                      <option value={24}>24 mois</option>
                    </select>
                  </div>

                </div>

                {/* Interactive Dynamic Simulation Bar Showcase */}
                <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
                  <span className="section-title" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Simulation Standard (Taux indicatif 8,5%)</span>
                </div>
                
                <div className="simulation-card">
                  <div className="sim-item-web">
                    <div className="value">{formatFCFA(currentSim.monthly)}</div>
                    <div className="label">Mensualité</div>
                  </div>
                  
                  <div className="sim-item-web">
                    <div className="value">{currentSim.rate.toFixed(1)}%</div>
                    <div className="label">Taux Annuel</div>
                  </div>

                  <div className="sim-item-web">
                    <div className="value">{formatFCFA(currentSim.total)}</div>
                    <div className="label">Coût Total Estimé</div>
                  </div>
                </div>

                <div style={{ padding: '0 1.5rem 1rem' }}>
                  <button 
                    className="btn-premium primary" 
                    style={{ width: '100%' }}
                    onClick={() => navigateToTab('offres', `Consultation des banques partenaires pour un prêt de ${formatFCFA(amount)}.`)}
                  >
                    Comparer les offres des banques <i className="ti ti-arrow-right"></i>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* MODULE 3: OFFRES DES BANQUES */}
          {activeTab === 'offres' && (
            <div className="module-card animate-fade-in">
              <div className="section-wrapper" style={{ paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <button onClick={() => navigateToTab('demande')} style={{ padding: '8px', borderRadius: '50%', background: 'var(--color-bg-secondary)' }}>
                    <i className="ti ti-arrow-left" style={{ fontSize: '1.2rem', color: 'var(--color-text-main)' }}></i>
                  </button>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Offres de Financement Disponibles</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Résultats personnalisés pour votre simulation en direct.</p>
                  </div>
                </div>

                <div style={{ background: 'var(--color-bg-secondary)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', margin: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
                    Paramètres actifs : <strong>{formatFCFA(amount)}</strong> sur <strong>{duration} mois</strong>
                  </span>
                  <button 
                    onClick={() => navigateToTab('demande')} 
                    style={{ fontSize: '0.8rem', color: 'var(--color-brand-secondary)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Modifier
                  </button>
                </div>

                {/* Grid of Available Offers */}
                <div className="offers-grid-web">
                  
                  {/* Offer 1 - Best Offer */}
                  <div className="offer-item-card recommended">
                    <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                      <span className="badge-best"><i className="ti ti-star-filled"></i> Recommandé · Meilleure offre</span>
                    </div>

                    <div className="offer-header-web" style={{ marginTop: '8px' }}>
                      <div className="bank-info">
                        <h3>SGCI Santé +</h3>
                        <p>Société Générale Côte d'Ivoire</p>
                      </div>
                      <div style={{ width: '40px', height: '40px', background: 'var(--color-brand-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-brand-primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                        SG
                      </div>
                    </div>

                    <div className="offer-metrics-row">
                      <div className="offer-metric-box">
                        <div className="num">7,9%</div>
                        <div className="txt">Taux TAEG</div>
                      </div>

                      <div className="offer-metric-box" style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                        <div className="num">{formatFCFA(sgciSim.monthly).replace(' FCFA', '')}</div>
                        <div className="txt">/ mois (FCFA)</div>
                      </div>

                      <div className="offer-metric-box">
                        <div className="num">48h</div>
                        <div className="txt">Délai moyen</div>
                      </div>
                    </div>

                    <button 
                      className="btn-select-offer premium"
                      onClick={() => navigateToTab('profil', "Offre SGCI Santé + présélectionnée. Veuillez finaliser votre dossier KYC.")}
                    >
                      Souscrire à cette offre
                    </button>
                  </div>

                  {/* Offer 2 */}
                  <div className="offer-item-card">
                    <div className="offer-header-web">
                      <div className="bank-info">
                        <h3>BNI Crédit Santé</h3>
                        <p>Banque Nationale d'Investissement</p>
                      </div>
                      <div style={{ width: '40px', height: '40px', background: 'var(--color-status-info-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-status-info)', fontWeight: 700, fontSize: '0.8rem' }}>
                        BNI
                      </div>
                    </div>

                    <div className="offer-metrics-row">
                      <div className="offer-metric-box">
                        <div className="num">9,2%</div>
                        <div className="txt">Taux TAEG</div>
                      </div>

                      <div className="offer-metric-box" style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                        <div className="num">{formatFCFA(bniSim.monthly).replace(' FCFA', '')}</div>
                        <div className="txt">/ mois (FCFA)</div>
                      </div>

                      <div className="offer-metric-box">
                        <div className="num">72h</div>
                        <div className="txt">Délai moyen</div>
                      </div>
                    </div>

                    <button 
                      className="btn-select-offer outline"
                      onClick={() => navigateToTab('profil', "Offre BNI Crédit Santé retenue. Finalisez votre dossier ci-dessous.")}
                    >
                      Choisir cette alternative
                    </button>
                  </div>

                  {/* Offer 3 */}
                  <div className="offer-item-card">
                    <div className="offer-header-web">
                      <div className="bank-info">
                        <h3>ECOBANK Flex Santé</h3>
                        <p>Ecobank Côte d'Ivoire</p>
                      </div>
                      <div style={{ width: '40px', height: '40px', background: 'var(--color-status-warning-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-status-warning)', fontWeight: 700, fontSize: '0.8rem' }}>
                        ECO
                      </div>
                    </div>

                    <div className="offer-metrics-row">
                      <div className="offer-metric-box">
                        <div className="num">10,5%</div>
                        <div className="txt">Taux TAEG</div>
                      </div>

                      <div className="offer-metric-box" style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                        <div className="num">{formatFCFA(ecobankSim.monthly).replace(' FCFA', '')}</div>
                        <div className="txt">/ mois (FCFA)</div>
                      </div>

                      <div className="offer-metric-box">
                        <div className="num">5 jours</div>
                        <div className="txt">Délai moyen</div>
                      </div>
                    </div>

                    <button 
                      className="btn-select-offer outline"
                      onClick={() => navigateToTab('profil', "Offre ECOBANK Flex Santé retenue.")}
                    >
                      Choisir cette alternative
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* MODULE 4: MON PROFIL / KYC */}
          {activeTab === 'profil' && (
            <div className="module-card animate-fade-in">
              {/* Profile Identity Banner */}
              <div className="profile-meta-banner">
                <div className="profile-avatar-large">
                  <i className="ti ti-user"></i>
                </div>
                <div className="profile-info">
                  <h2>Kouamé Adou</h2>
                  <p>
                    <i className="ti ti-mail" style={{ marginRight: '4px' }}></i> koua.adou@email.com · <i className="ti ti-phone" style={{ margin: '0 4px 0 8px' }}></i> +225 07 00 00 00
                  </p>
                </div>
              </div>

              {/* Progress Tracker Card */}
              <div className="kyc-tracker-card">
                <div className="kyc-top-line">
                  <h4>Progression du dossier de conformité (KYC)</h4>
                  <span>{kycPercentage}% complété</span>
                </div>
                
                <div className="tracker-bar-bg">
                  <div className="tracker-bar-fill" style={{ width: `${kycPercentage}%` }}></div>
                </div>

                <div className="tracker-footer-text">
                  {missingDocsCount > 0 ? (
                    <span style={{ color: 'var(--color-status-warning)', fontWeight: 500 }}>
                      <i className="ti ti-alert-circle"></i> {missingDocsCount} document{missingDocsCount > 1 ? 's' : ''} manquant{missingDocsCount > 1 ? 's' : ''} pour débloquer le décaissement immédiat.
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>
                      <i className="ti ti-circle-check"></i> Dossier complet et certifié. Transmission automatique validée.
                    </span>
                  )}
                </div>
              </div>

              {/* Documents Status Checklist */}
              <div className="section-head" style={{ padding: '0 2rem' }}>
                <h3 className="section-title">Pièces justificatives requises</h3>
              </div>

              <div className="kyc-docs-list">
                
                {/* Doc 1 - CNI */}
                <div className="kyc-doc-item">
                  <div className="doc-info-left">
                    <i className="ti ti-id-badge doc-ico"></i>
                    <div className="doc-labels">
                      <h5>Carte Nationale d'Identité</h5>
                      <p>Copie recto-verso scellée · Examen automatique réussi</p>
                    </div>
                  </div>
                  <div className="doc-action-right">
                    <div className="status-badge-verified" title="Vérifié">
                      <i className="ti ti-check"></i>
                    </div>
                  </div>
                </div>

                {/* Doc 2 - Salaire */}
                <div className="kyc-doc-item">
                  <div className="doc-info-left">
                    <i className="ti ti-file-text doc-ico"></i>
                    <div className="doc-labels">
                      <h5>Bulletins de salaire</h5>
                      <p>3 derniers mois de certification d'employeur</p>
                    </div>
                  </div>
                  <div className="doc-action-right">
                    <div className="status-badge-verified" title="Vérifié">
                      <i className="ti ti-check"></i>
                    </div>
                  </div>
                </div>

                {/* Doc 3 - Relevé Bancaire */}
                <div className="kyc-doc-item">
                  <div className="doc-info-left">
                    <i className={`ti ti-building-bank doc-ico ${!kycDocs.releve ? 'pending' : ''}`}></i>
                    <div className="doc-labels">
                      <h5>Relevé d'Identité Bancaire (RIB / Relevé)</h5>
                      <p>
                        {!kycDocs.releve ? 'Non fourni · Requis pour versement' : 'Téléversé · Chiffré et conforme'}
                      </p>
                    </div>
                  </div>
                  <div className="doc-action-right">
                    {kycDocs.releve ? (
                      <div className="status-badge-verified" title="Vérifié">
                        <i className="ti ti-check"></i>
                      </div>
                    ) : (
                      <button 
                        className="btn-upload-action"
                        onClick={() => handleSimulateUpload('releve', "Relevé bancaire")}
                      >
                        <i className="ti ti-upload"></i> Téléverser
                      </button>
                    )}
                  </div>
                </div>

                {/* Doc 4 - Devis Médical */}
                <div className="kyc-doc-item">
                  <div className="doc-info-left">
                    <i className={`ti ti-notes-medical doc-ico ${!kycDocs.devis ? 'pending' : ''}`}></i>
                    <div className="doc-labels">
                      <h5>Devis médical conventionné</h5>
                      <p>
                        {!kycDocs.devis ? 'Non fourni · Délivré par la clinique' : 'Téléversé · Traçabilité assurée'}
                      </p>
                    </div>
                  </div>
                  <div className="doc-action-right">
                    {kycDocs.devis ? (
                      <div className="status-badge-verified" title="Vérifié">
                        <i className="ti ti-check"></i>
                      </div>
                    ) : (
                      <button 
                        className="btn-upload-action"
                        onClick={() => handleSimulateUpload('devis', "Devis médical conventionné")}
                      >
                        <i className="ti ti-upload"></i> Téléverser
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Option line */}
                <div className="kyc-doc-item" style={{ background: 'transparent', borderStyle: 'dashed', marginTop: '4px' }}>
                  <div className="doc-info-left">
                    <i className="ti ti-settings doc-ico" style={{ color: 'var(--color-text-muted)' }}></i>
                    <div className="doc-labels">
                      <h5>Paramètres de sécurité & notifications</h5>
                      <p>Gérer les alertes SMS, clés d'accès chiffrées et préférences</p>
                    </div>
                  </div>
                  <i className="ti ti-chevron-right" style={{ color: 'var(--color-text-muted)' }}></i>
                </div>

              </div>

            </div>
          )}

        </section>

        {/* Right Column - Authentic Live Interactive Device Simulator Frame */}
        <section className="mobile-preview-panel">
          <div className="preview-header-meta">
            <span className="preview-title">
              <i className="ti ti-device-mobile"></i> Simulation Version Mobile Originale
            </span>
            <span 
              className="toggle-preview-mode"
              onClick={() => showToast("La version mobile est synchronisée en direct avec vos saisies sur le portail web.")}
            >
              <i className="ti ti-refresh"></i> Live Sync
            </span>
          </div>

          <div className="authentic-phone-frame">
            {/* Authentic Phone Header Status Bar */}
            <div className="phone-status-bar">
              <span>9:41</span>
              <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <i className="ti ti-wifi"></i>
                <i className="ti ti-battery-2"></i>
              </span>
            </div>

            {/* Viewport Inside Phone mirroring exact mockup styling context */}
            <div className="phone-screen-viewport">
              
              {/* MOBILE VIEWPORT 0: ACCUEIL */}
              {activeTab === 'accueil' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ background: 'linear-gradient(160deg, #0F6E56 0%, #1D9E75 60%, #5DCAA5 100%)', padding: '30px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'white', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                      <i className="ti ti-heart-rate-monitor"></i>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Prêt Santé</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4 }}>Financement rapide pour vos soins médicaux, en quelques étapes simples.</p>
                  </div>

                  <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e1f5ee', color: '#0f6e56', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-clipboard-heart" style={{ fontSize: '1rem' }}></i>
                      </div>
                      <div style={{ lineHeight: 1.2 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Soins financés rapidement</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Dentaire, accouchement, bilans…</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-building-bank" style={{ fontSize: '1rem' }}></i>
                      </div>
                      <div style={{ lineHeight: 1.2 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Banques partenaires</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Comparez la meilleure offre</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-shield-lock" style={{ fontSize: '1rem' }}></i>
                      </div>
                      <div style={{ lineHeight: 1.2 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)' }}>100% sécurisé</p>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Données chiffrées locales</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      onClick={() => navigateToTab('dashboard')}
                      style={{ background: '#1d9e75', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      Créer un compte <i className="ti ti-arrow-right"></i>
                    </button>
                    <button 
                      onClick={() => navigateToTab('dashboard')}
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)', padding: '10px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}
                    >
                      J'ai déjà un compte
                    </button>
                  </div>
                </div>
              )}

              {/* MOBILE VIEWPORT 1: TABLEAU DE BORD */}
              {activeTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ background: '#0f6e56', padding: '12px 16px 16px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.65rem', opacity: 0.8 }}>Bonjour 👋</p>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>Kouamé Adou</h4>
                      </div>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                        <i className="ti ti-user"></i>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 12px', marginTop: '-10px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Prêt en cours</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>350 000 FCFA</div>
                        <div style={{ fontSize: '0.6rem', color: '#1d9e75', marginTop: '2px' }}>Prochain versement : 25 juin</div>
                      </div>
                      <span style={{ background: '#e1f5ee', color: '#0f6e56', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 600 }}>
                        <i className="ti ti-check" style={{ fontSize: '0.65rem' }}></i> Actif
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '12px 12px 6px', display: 'block' }}>Actions rapides</span>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '0 12px' }}>
                    <div onClick={() => navigateToTab('demande')} style={{ background: 'var(--color-bg-secondary)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-plus" style={{ fontSize: '1.1rem', color: '#1d9e75' }}></i>
                      <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--color-text-muted)', marginTop: '2px' }}>Nouveau prêt</span>
                    </div>

                    <div onClick={() => navigateToTab('offres')} style={{ background: 'var(--color-bg-secondary)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-building-bank" style={{ fontSize: '1.1rem', color: '#3b82f6' }}></i>
                      <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--color-text-muted)', marginTop: '2px' }}>Banques</span>
                    </div>

                    <div onClick={() => navigateToTab('profil')} style={{ background: 'var(--color-bg-secondary)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-file-upload" style={{ fontSize: '1.1rem', color: '#f59e0b' }}></i>
                      <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--color-text-muted)', marginTop: '2px' }}>Documents</span>
                    </div>

                    <div onClick={() => showToast("Échéancier synchronisé.")} style={{ background: 'var(--color-bg-secondary)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-calendar" style={{ fontSize: '1.1rem', color: '#ef4444' }}></i>
                      <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--color-text-muted)', marginTop: '2px' }}>Échéancier</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '12px 12px 6px', display: 'block' }}>Activité récente</span>
                  
                  <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#e1f5ee', color: '#0f6e56', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="ti ti-tooth" style={{ fontSize: '0.85rem' }}></i>
                        </div>
                        <div style={{ lineHeight: 1.1 }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Prothèse dentaire</p>
                          <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Clinique Avicenne · 15 mai</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6rem', background: '#e1f5ee', color: '#0f6e56', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>Accepté</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#dbeafe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="ti ti-stethoscope" style={{ fontSize: '0.85rem' }}></i>
                        </div>
                        <div style={{ lineHeight: 1.1 }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Bilan de santé</p>
                          <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Centre Médical IBK · 2 mai</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6rem', background: '#fef3c7', color: '#f59e0b', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>En cours</span>
                    </div>
                  </div>

                </div>
              )}

              {/* MOBILE VIEWPORT 2: DEMANDE DE PRÊT */}
              {activeTab === 'demande' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ background: '#0f6e56', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <i className="ti ti-arrow-left" onClick={() => navigateToTab('dashboard')} style={{ fontSize: '1.1rem', cursor: 'pointer' }}></i>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Nouvelle demande de prêt</h4>
                  </div>

                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                    
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Type de soin</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <div onClick={() => setCareType(1)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${careType === 1 ? '#1d9e75' : 'var(--color-border)'}`, background: careType === 1 ? '#e1f5ee' : 'var(--color-bg-secondary)', textAlign: 'center' }}>
                          <i className="ti ti-tooth" style={{ fontSize: '1.2rem', color: careType === 1 ? '#1d9e75' : 'var(--color-text-muted)' }}></i>
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: careType === 1 ? 600 : 500, marginTop: '2px' }}>Prothèse dentaire</span>
                        </div>

                        <div onClick={() => setCareType(2)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${careType === 2 ? '#1d9e75' : 'var(--color-border)'}`, background: careType === 2 ? '#e1f5ee' : 'var(--color-bg-secondary)', textAlign: 'center' }}>
                          <i className="ti ti-baby-carriage" style={{ fontSize: '1.2rem', color: careType === 2 ? '#1d9e75' : 'var(--color-text-muted)' }}></i>
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: careType === 2 ? 600 : 500, marginTop: '2px' }}>Accouchement</span>
                        </div>

                        <div onClick={() => setCareType(3)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${careType === 3 ? '#1d9e75' : 'var(--color-border)'}`, background: careType === 3 ? '#e1f5ee' : 'var(--color-bg-secondary)', textAlign: 'center' }}>
                          <i className="ti ti-activity" style={{ fontSize: '1.2rem', color: careType === 3 ? '#1d9e75' : 'var(--color-text-muted)' }}></i>
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: careType === 3 ? 600 : 500, marginTop: '2px' }}>Bilan de santé</span>
                        </div>

                        <div onClick={() => setCareType(4)} style={{ padding: '8px', borderRadius: '8px', border: `1px solid ${careType === 4 ? '#1d9e75' : 'var(--color-border)'}`, background: careType === 4 ? '#e1f5ee' : 'var(--color-bg-secondary)', textAlign: 'center' }}>
                          <i className="ti ti-plus" style={{ fontSize: '1.2rem', color: careType === 4 ? '#1d9e75' : 'var(--color-text-muted)' }}></i>
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: careType === 4 ? 600 : 500, marginTop: '2px' }}>Autre soin</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Établissement de santé</span>
                      <select 
                        style={{ width: '100%', padding: '6px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                      >
                        <option>Clinique Avicenne – Abidjan</option>
                        <option>Centre Médical IBK – Plateau</option>
                        <option>Polyclinique Internationale</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Montant souhaité</span>
                      <div style={{ textAlign: 'center', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f6e56' }}>{formatFCFA(amount)}</div>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>Ajustez avec le curseur</span>
                      </div>
                      
                      <input 
                        type="range" 
                        style={{ width: '100%', accentColor: '#1d9e75', marginTop: '6px' }}
                        min="50000" 
                        max="1000000" 
                        step="10000" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
                        <span>50 000</span><span>1 000 000 FCFA</span>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Durée de remboursement</span>
                      <select 
                        style={{ width: '100%', padding: '6px 8px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      >
                        <option value="6">6 mois</option>
                        <option value="12">12 mois</option>
                        <option value="18">18 mois</option>
                        <option value="24">24 mois</option>
                      </select>
                    </div>

                    <div style={{ background: '#e1f5ee', padding: '10px', borderRadius: '8px', border: '1px solid #9fe1cb', display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '4px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f6e56' }}>{formatFCFA(currentSim.monthly)}</div>
                        <span style={{ fontSize: '0.55rem', color: '#1d9e75', display: 'block' }}>/ MOIS</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f6e56' }}>8,5%</div>
                        <span style={{ fontSize: '0.55rem', color: '#1d9e75', display: 'block' }}>TAUX</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f6e56' }}>{formatFCFA(currentSim.total)}</div>
                        <span style={{ fontSize: '0.55rem', color: '#1d9e75', display: 'block' }}>TOTAL</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigateToTab('offres')}
                      style={{ background: '#1d9e75', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}
                    >
                      Voir les offres <i className="ti ti-arrow-right"></i>
                    </button>

                  </div>
                </div>
              )}

              {/* MOBILE VIEWPORT 3: OFFRES BANQUES */}
              {activeTab === 'offres' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ background: '#0f6e56', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <i className="ti ti-arrow-left" onClick={() => navigateToTab('demande')} style={{ fontSize: '1.1rem', cursor: 'pointer' }}></i>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Offres des banques</h4>
                  </div>

                  <div style={{ padding: '8px 12px', fontSize: '0.65rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-secondary)' }}>
                    3 offres disponibles pour {formatFCFA(amount)} sur {duration} mois
                  </div>

                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
                    
                    {/* Mockup Offer 1 */}
                    <div style={{ border: '1.5px solid #1d9e75', borderRadius: '10px', padding: '10px', background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>SGCI Santé +</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Société Générale CI</div>
                        </div>
                        <span style={{ background: '#1d9e75', color: 'white', fontSize: '0.55rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>Meilleure offre</span>
                      </div>

                      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>7,9%</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Taux</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatFCFA(sgciSim.monthly).replace(' FCFA','')}</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>/ mois (FCFA)</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>48h</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Délai</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigateToTab('profil')}
                        style={{ width: '100%', background: '#1d9e75', color: 'white', padding: '6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}
                      >
                        Choisir cette offre
                      </button>
                    </div>

                    {/* Mockup Offer 2 */}
                    <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '10px', background: 'white' }}>
                      <div style={{ marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>BNI Crédit Santé</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Banque Nationale d'Investissement</div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>9,2%</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Taux</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatFCFA(bniSim.monthly).replace(' FCFA','')}</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>/ mois (FCFA)</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>72h</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Délai</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigateToTab('profil')}
                        style={{ width: '100%', background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', padding: '6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 500 }}
                      >
                        Choisir cette offre
                      </button>
                    </div>

                    {/* Mockup Offer 3 */}
                    <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '10px', background: 'white' }}>
                      <div style={{ marginBottom: '6px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>ECOBANK Flex</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Ecobank Côte d'Ivoire</div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>10,5%</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Taux</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{formatFCFA(ecobankSim.monthly).replace(' FCFA','')}</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>/ mois (FCFA)</span>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>5 jours</div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>Délai</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigateToTab('profil')}
                        style={{ width: '100%', background: 'var(--color-bg-secondary)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', padding: '6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 500 }}
                      >
                        Choisir cette offre
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* MOBILE VIEWPORT 4: MON PROFIL / KYC */}
              {activeTab === 'profil' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ background: '#0f6e56', padding: '14px 12px 24px', textAlign: 'center', color: 'white' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 6px' }}>
                      <i className="ti ti-user"></i>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Kouamé Adou</h4>
                    <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>koua.adou@email.com · +225 07 00 00 00</span>
                  </div>

                  <div style={{ padding: '0 12px', marginTop: '-12px' }}>
                    <div style={{ background: 'white', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Profil KYC complété</div>
                      <div style={{ height: '5px', background: 'var(--color-bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ height: '100%', background: '#1d9e75', width: `${kycPercentage}%` }}></div>
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#1d9e75', textAlign: 'right', fontWeight: 600 }}>
                        {kycPercentage}% — {missingDocsCount} document{missingDocsCount > 1 ? 's' : ''} manquant{missingDocsCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-id-badge" style={{ fontSize: '1.1rem', color: '#1d9e75' }}></i>
                      <div style={{ flex: 1, lineHeight: 1.1 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>Carte Nationale d'Identité</p>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>Recto-verso · Vérifié</span>
                      </div>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1d9e75', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="ti ti-check" style={{ fontSize: '0.55rem' }}></i>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-file-text" style={{ fontSize: '1.1rem', color: '#1d9e75' }}></i>
                      <div style={{ flex: 1, lineHeight: 1.1 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>Bulletins de salaire</p>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>3 derniers mois · Vérifié</span>
                      </div>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1d9e75', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="ti ti-check" style={{ fontSize: '0.55rem' }}></i>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-building-bank" style={{ fontSize: '1.1rem', color: kycDocs.releve ? '#1d9e75' : '#854f0b' }}></i>
                      <div style={{ flex: 1, lineHeight: 1.1 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>Relevé bancaire</p>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
                          {kycDocs.releve ? 'Conforme · Vérifié' : 'Non fourni · En attente'}
                        </span>
                      </div>
                      {kycDocs.releve ? (
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1d9e75', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="ti ti-check" style={{ fontSize: '0.55rem' }}></i>
                        </div>
                      ) : (
                        <i 
                          className="ti ti-upload" 
                          style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                          onClick={() => handleSimulateUpload('releve', "Relevé bancaire")}
                        ></i>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <i className="ti ti-notes-medical" style={{ fontSize: '1.1rem', color: kycDocs.devis ? '#1d9e75' : '#854f0b' }}></i>
                      <div style={{ flex: 1, lineHeight: 1.1 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>Devis médical</p>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
                          {kycDocs.devis ? 'Conforme · Vérifié' : 'Non fourni · En attente'}
                        </span>
                      </div>
                      {kycDocs.devis ? (
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#1d9e75', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="ti ti-check" style={{ fontSize: '0.55rem' }}></i>
                        </div>
                      ) : (
                        <i 
                          className="ti ti-upload" 
                          style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                          onClick={() => handleSimulateUpload('devis', "Devis médical")}
                        ></i>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', marginTop: '2px' }}>
                      <i className="ti ti-settings" style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}></i>
                      <div style={{ flex: 1, lineHeight: 1.1 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>Paramètres du compte</p>
                        <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>Sécurité, notifications</span>
                      </div>
                      <i className="ti ti-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}></i>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Authentic Phone Bottom Navigation Syncing states */}
            <div className="phone-bottom-nav">
              <div 
                className={`pnav-btn ${getBottomNavActive() === 'home' ? 'active' : ''}`}
                onClick={() => navigateToTab('dashboard')}
              >
                <i className="ti ti-home"></i>
                <span>Accueil</span>
              </div>

              <div 
                className={`pnav-btn ${getBottomNavActive() === 'loan' ? 'active' : ''}`}
                onClick={() => navigateToTab('demande')}
              >
                <i className="ti ti-plus-circle"></i>
                <span>Prêt</span>
              </div>

              <div 
                className={`pnav-btn ${getBottomNavActive() === 'banks' ? 'active' : ''}`}
                onClick={() => navigateToTab('offres')}
              >
                <i className="ti ti-building-bank"></i>
                <span>Banques</span>
              </div>

              <div 
                className={`pnav-btn ${getBottomNavActive() === 'profile' ? 'active' : ''}`}
                onClick={() => navigateToTab('profil')}
              >
                <i className="ti ti-user"></i>
                <span>Profil</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Dynamic Interactive Toasts Feedback */}
      {toast && (
        <div className="toast-container animate-slide-in">
          <div className="toast-msg">
            <i className="ti ti-info-circle"></i>
            <p>{toast}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
