import React, { useState, useEffect } from 'react';

export default function PretSanteMobile() {
  const [currentScreen, setCurrentScreen] = useState(0); // 0: Onboarding, 1: Dashboard, 2: Loan Request, 3: Bank Offers, 4: Profile
  const [careType, setCareType] = useState('dentaire');
  const [amount, setAmount] = useState(250000);
  const [duration, setDuration] = useState(12);
  const [kycDocs, setKycDocs] = useState({
    cni: true,
    salaire: true,
    releve: false,
    devis: false
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Simulation calculations
  const rate = 8.5; // Base Rate %
  const monthlyInterest = (rate / 100) / 12;
  const monthlyPayment = Math.round(
    (amount * monthlyInterest * Math.pow(1 + monthlyInterest, duration)) /
    (Math.pow(1 + monthlyInterest, duration) - 1)
  );
  const totalRepayment = monthlyPayment * duration;

  const handleDocUpload = (docId, docName) => {
    setKycDocs(prev => ({ ...prev, [docId]: true }));
    showToast(`"${docName}" chargé et vérifié avec succès !`);
  };

  const getKycProgress = () => {
    const total = Object.keys(kycDocs).length;
    const uploaded = Object.values(kycDocs).filter(Boolean).length;
    return Math.round((uploaded / total) * 100);
  };

  const formatFCFA = (val) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center justify-center font-sans antialiased text-slate-900">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg border border-emerald-500 animate-bounce flex items-center gap-2 font-medium">
          <i className="ti ti-circle-check text-xl"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
              <span className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                <i className="ti ti-heart-rate-monitor text-2xl"></i>
              </span>
              Prêt Santé
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Démonstrateur interactif de l'application de financement de soins médicaux.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Onboarding', screen: 0 },
              { label: 'Dashboard', screen: 1 },
              { label: 'Simulation', screen: 2 },
              { label: 'Offres', screen: 3 },
              { label: 'Profil KYC', screen: 4 }
            ].map(tab => (
              <button
                key={tab.screen}
                onClick={() => setCurrentScreen(tab.screen)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                  currentScreen === tab.screen
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presentation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Column: Description / Features */}
          <div className="space-y-6 px-2">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Rendu Professionnel
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Financement instantané pour vos imprévus médicaux
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Notre solution aide les assurés à simuler, postuler et obtenir des prêts de santé à taux préférentiels auprès de nos banques partenaires directement depuis leur smartphone.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                  <i className="ti ti-activity-heartbeat text-xl"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800">Simulateur en Temps Réel</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Calculez instantanément vos mensualités et le coût global de votre financement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
                  <i className="ti ti-building-bank text-xl"></i>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800">Comparateur Offres Partenaires</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Comparez instantanément les taux d'intérêt et délais de traitement des banques.</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-lg text-white flex items-center gap-2">
                <i className="ti ti-discount-check text-xl text-emerald-400"></i>
                Règles de design respectées
              </h4>
              <ul className="space-y-2 text-sm text-emerald-200/90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Aération via des conteneurs Flex/Grid robustes (`gap-4`, `gap-6`)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Paddings optimisés (`p-4`, `p-6`) pour un affichage agréable
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Hauteurs de ligne adaptées pour une typographie lisible (`leading-relaxed`)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Mise en page récursive et responsive (`md:`)
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Phone Mockup Frame */}
          <div className="flex justify-center">
            <div className="relative w-[360px] h-[680px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col overflow-hidden">
              
              {/* iPhone Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                <div className="w-3.5 h-1 rounded-full bg-slate-900"></div>
              </div>

              {/* Internal Screen Content */}
              <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative">
                
                {/* Top Status Bar */}
                <div className="bg-emerald-900 text-white px-6 pt-5 pb-3 flex justify-between items-center text-[10px] font-bold tracking-wider z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <i className="ti ti-wifi"></i>
                    <i className="ti ti-battery-4"></i>
                  </div>
                </div>

                {/* Main Screen Router Body */}
                <div className="flex-1 overflow-y-auto flex flex-col">
                  
                  {/* SCREEN 0: Onboarding */}
                  {currentScreen === 0 && (
                    <div className="flex-1 flex flex-col">
                      <div className="bg-gradient-to-b from-emerald-900 to-emerald-700 text-white px-6 py-8 flex flex-col items-center text-center gap-4 rounded-b-[2rem] shadow-md">
                        <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                          <i className="ti ti-heart-rate-monitor text-3xl text-emerald-300"></i>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold tracking-tight">Prêt Santé</h3>
                          <p className="text-xs text-emerald-100/80 leading-relaxed">
                            Financement rapide de vos soins médicaux en quelques étapes simples.
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 p-6 flex flex-col gap-4 justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                              <i className="ti ti-clipboard-heart text-base"></i>
                            </span>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-semibold text-slate-800">Soins Financés Rapidement</h5>
                              <p className="text-[10px] text-slate-400">Dentaire, accouchement, bilans, chirurgie...</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="p-2 bg-blue-50 rounded-lg text-blue-700">
                              <i className="ti ti-building-bank text-base"></i>
                            </span>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-semibold text-slate-800">Partenaires Bancaires</h5>
                              <p className="text-[10px] text-slate-400">Comparez et choisissez la meilleure offre</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="p-2 bg-amber-50 rounded-lg text-amber-700">
                              <i className="ti ti-shield-lock text-base"></i>
                            </span>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-semibold text-slate-800">Sécurité 100% Garantie</h5>
                              <p className="text-[10px] text-slate-400">Données chiffrées et conformité locale</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-4">
                          <button
                            onClick={() => setCurrentScreen(1)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
                          >
                            Créer un compte
                            <i className="ti ti-arrow-right"></i>
                          </button>
                          <button
                            onClick={() => setCurrentScreen(1)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition-all"
                          >
                            J'ai déjà un compte
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 1: Home Dashboard */}
                  {currentScreen === 1 && (
                    <div className="flex-1 flex flex-col gap-5 pb-6">
                      <div className="bg-emerald-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-emerald-100/70">Bonjour 👋</p>
                          <h4 className="text-sm font-bold tracking-tight">Kouamé Adou</h4>
                        </div>
                        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                          <i className="ti ti-user text-sm"></i>
                        </div>
                      </div>

                      {/* Active Loan Card */}
                      <div className="px-4 -mt-9">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400">Prêt en cours</span>
                            <div className="text-lg font-bold text-slate-900">350 000 FCFA</div>
                            <span className="text-[9px] text-emerald-600 font-medium">Prochain prélèvement : 25 Juin</span>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-1 text-[9px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Actif
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions Grid */}
                      <div className="px-4 space-y-2">
                        <h5 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1">Actions rapides</h5>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => setCurrentScreen(2)}
                            className="bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 transition-all text-emerald-700 shadow-sm"
                          >
                            <i className="ti ti-plus text-base"></i>
                            <span className="text-[8px] font-bold text-slate-600 text-center">Nouveau prêt</span>
                          </button>
                          <button
                            onClick={() => setCurrentScreen(3)}
                            className="bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 transition-all text-blue-700 shadow-sm"
                          >
                            <i className="ti ti-building-bank text-base"></i>
                            <span className="text-[8px] font-bold text-slate-600 text-center">Banques</span>
                          </button>
                          <button
                            onClick={() => setCurrentScreen(4)}
                            className="bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 transition-all text-amber-700 shadow-sm"
                          >
                            <i className="ti ti-file-text text-base"></i>
                            <span className="text-[8px] font-bold text-slate-600 text-center">KYC Docs</span>
                          </button>
                          <button
                            onClick={() => showToast("Calendrier des paiements ouvert")}
                            className="bg-white hover:bg-emerald-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 transition-all text-red-700 shadow-sm"
                          >
                            <i className="ti ti-calendar text-base"></i>
                            <span className="text-[8px] font-bold text-slate-600 text-center">Échéancier</span>
                          </button>
                        </div>
                      </div>

                      {/* Recent Activities */}
                      <div className="px-4 flex-1 flex flex-col gap-2">
                        <h5 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1">Activité récente</h5>
                        <div className="space-y-2 overflow-y-auto">
                          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
                                <i className="ti ti-tooth"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Prothèse dentaire</h6>
                                <p className="text-[9px] text-slate-400">Clinique Avicenne · 15 Mai</p>
                              </div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 text-[8px] font-bold border border-emerald-100">
                              Accepté
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-blue-50 text-blue-700 rounded-lg text-xs">
                                <i className="ti ti-activity"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Bilan de santé</h6>
                                <p className="text-[9px] text-slate-400">Centre Médical IBK · 2 Mai</p>
                              </div>
                            </div>
                            <span className="bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 text-[8px] font-bold border border-amber-100">
                              En cours
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: Loan Simulator Form */}
                  {currentScreen === 2 && (
                    <div className="flex-1 flex flex-col pb-6">
                      <div className="bg-emerald-900 text-white px-5 py-4 flex items-center gap-3 shadow-md">
                        <button onClick={() => setCurrentScreen(1)} className="hover:opacity-80">
                          <i className="ti ti-arrow-left text-lg"></i>
                        </button>
                        <h4 className="text-sm font-bold">Nouvelle demande</h4>
                      </div>

                      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
                        {/* Care Type Selection */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type de soin</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'dentaire', label: 'Prothèse Dentaire', icon: 'ti-tooth' },
                              { id: 'maternite', label: 'Accouchement', icon: 'ti-baby-carriage' },
                              { id: 'bilan', label: 'Bilan de santé', icon: 'ti-activity' },
                              { id: 'autre', label: 'Autre Soin', icon: 'ti-plus' }
                            ].map(type => (
                              <button
                                key={type.id}
                                onClick={() => setCareType(type.id)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                                  careType === type.id
                                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700 ring-1 ring-emerald-500/20'
                                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <i className={`ti ${type.icon} text-lg`}></i>
                                <span className="text-[9px] font-bold">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Medical Facility */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Établissement</label>
                          <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600">
                            <option>Clinique Avicenne – Abidjan</option>
                            <option>Centre Médical IBK – Plateau</option>
                            <option>Polyclinique Internationale</option>
                          </select>
                        </div>

                        {/* Loan Amount Slider */}
                        <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-100 shadow-inner">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Montant souhaité</label>
                          <div className="text-center space-y-1">
                            <div className="text-xl font-extrabold text-emerald-800 tracking-tight">{formatFCFA(amount)}</div>
                            <span className="text-[9px] text-slate-400">Glissez pour ajuster le montant</span>
                          </div>
                          <input
                            type="range"
                            min="50000"
                            max="1000000"
                            step="10000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 px-0.5">
                            <span>50 000</span>
                            <span>1 000 000 FCFA</span>
                          </div>
                        </div>

                        {/* Remboursement Duration */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Durée de remboursement</label>
                          <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          >
                            <option value={6}>6 mois</option>
                            <option value={12}>12 mois</option>
                            <option value={18}>18 mois</option>
                            <option value={24}>24 mois</option>
                          </select>
                        </div>

                        {/* Cost Recap */}
                        <div className="bg-emerald-550 bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 flex justify-between items-center text-center">
                          <div className="space-y-0.5">
                            <div className="text-sm font-bold text-emerald-800">{formatFCFA(monthlyPayment)}</div>
                            <span className="text-[9px] font-medium text-emerald-600">/ mois</span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-sm font-bold text-emerald-800">8.5%</div>
                            <span className="text-[9px] font-medium text-emerald-600">Taux fixe</span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-sm font-bold text-emerald-800">{formatFCFA(totalRepayment)}</div>
                            <span className="text-[9px] font-medium text-emerald-600">Total</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setCurrentScreen(3)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
                        >
                          Voir les offres
                          <i className="ti ti-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: Bank Offers List */}
                  {currentScreen === 3 && (
                    <div className="flex-1 flex flex-col pb-6">
                      <div className="bg-emerald-900 text-white px-5 py-4 flex items-center gap-3 shadow-md">
                        <button onClick={() => setCurrentScreen(2)} className="hover:opacity-80">
                          <i className="ti ti-arrow-left text-lg"></i>
                        </button>
                        <h4 className="text-sm font-bold">Offres des banques</h4>
                      </div>

                      <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        3 offres pour {formatFCFA(amount)} sur {duration} mois
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {/* Offer 1 - Best */}
                        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-4 shadow-md space-y-3 relative overflow-hidden">
                          <span className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-xl text-[8px] font-bold tracking-wider uppercase">
                            Meilleure Offre
                          </span>
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-slate-800">SGCI Santé +</h5>
                            <p className="text-[9px] text-slate-400">Société Générale Côte d'Ivoire</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-1 text-center">
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">7.9%</div>
                              <span className="text-[8px] text-slate-400">Taux</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">
                                {formatFCFA(Math.round(monthlyPayment * 0.98)).split(' ')[0]}
                              </div>
                              <span className="text-[8px] text-slate-400">/ mois</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">48h</div>
                              <span className="text-[8px] text-slate-400">Délai</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              showToast("Offre SGCI sélectionnée");
                              setCurrentScreen(4);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                          >
                            Choisir cette offre
                          </button>
                        </div>

                        {/* Offer 2 */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-slate-800">BNI Crédit Santé</h5>
                            <p className="text-[9px] text-slate-400">Banque Nationale d'Investissement</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-1 text-center">
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">9.2%</div>
                              <span className="text-[8px] text-slate-400">Taux</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">
                                {formatFCFA(Math.round(monthlyPayment * 1.01)).split(' ')[0]}
                              </div>
                              <span className="text-[8px] text-slate-400">/ mois</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">72h</div>
                              <span className="text-[8px] text-slate-400">Délai</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              showToast("Offre BNI sélectionnée");
                              setCurrentScreen(4);
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                          >
                            Choisir cette offre
                          </button>
                        </div>

                        {/* Offer 3 */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-slate-800">ECOBANK Flex</h5>
                            <p className="text-[9px] text-slate-400">Ecobank Côte d'Ivoire</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-1 text-center">
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">10.5%</div>
                              <span className="text-[8px] text-slate-400">Taux</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">
                                {formatFCFA(Math.round(monthlyPayment * 1.03)).split(' ')[0]}
                              </div>
                              <span className="text-[8px] text-slate-400">/ mois</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                              <div className="text-xs font-extrabold text-slate-800">5j</div>
                              <span className="text-[8px] text-slate-400">Délai</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              showToast("Offre Ecobank sélectionnée");
                              setCurrentScreen(4);
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200"
                          >
                            Choisir cette offre
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 4: Profile / KYC Docs */}
                  {currentScreen === 4 && (
                    <div className="flex-1 flex flex-col pb-6">
                      <div className="bg-emerald-900 text-white px-6 py-5 flex items-center gap-4 shadow-md">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                          <i className="ti ti-user text-xl"></i>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold leading-none">Kouamé Adou</h4>
                          <p className="text-[9px] text-emerald-100/70">koua.adou@email.com · +225 07 00 00</p>
                        </div>
                      </div>

                      {/* Progress Bar Area */}
                      <div className="px-4 -mt-4 mb-4">
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                            <span>Profil KYC complété</span>
                            <span className="text-emerald-700 font-bold">{getKycProgress()}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 transition-all duration-550" style={{ width: `${getKycProgress()}%` }}></div>
                          </div>
                          <p className="text-[9px] text-slate-400">
                            {getKycProgress() === 100 ? 'Félicitations, dossier complet !' : '2 documents nécessaires pour finaliser.'}
                          </p>
                        </div>
                      </div>

                      {/* Documents Checklist */}
                      <div className="px-4 flex-1 flex flex-col gap-2 overflow-y-auto">
                        <h5 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1">Documents requis</h5>
                        
                        <div className="space-y-2">
                          {/* CNI */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
                                <i className="ti ti-id-badge"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Carte d'Identité (CNI)</h6>
                                <p className="text-[8px] text-slate-400">Recto-verso · Vérifié</p>
                              </div>
                            </div>
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                              <i className="ti ti-check font-bold"></i>
                            </span>
                          </div>

                          {/* Bulletins de Salaire */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
                                <i className="ti ti-file-text"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Bulletins de salaire</h6>
                                <p className="text-[8px] text-slate-400">3 derniers mois · Vérifié</p>
                              </div>
                            </div>
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                              <i className="ti ti-check font-bold"></i>
                            </span>
                          </div>

                          {/* Relevé Bancaire */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className={`p-2 rounded-lg text-xs ${kycDocs.releve ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                <i className="ti ti-building-bank"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Relevé Bancaire</h6>
                                <p className="text-[8px] text-slate-400">
                                  {kycDocs.releve ? 'Téléversé' : 'Non fourni · En attente'}
                                </p>
                              </div>
                            </div>
                            {kycDocs.releve ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                                <i className="ti ti-check font-bold"></i>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDocUpload('releve', 'Relevé Bancaire')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 transition-all"
                              >
                                Charger
                              </button>
                            )}
                          </div>

                          {/* Devis Medical */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className={`p-2 rounded-lg text-xs ${kycDocs.devis ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                <i className="ti ti-notes-medical"></i>
                              </span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">Devis médical</h6>
                                <p className="text-[8px] text-slate-400">
                                  {kycDocs.devis ? 'Téléversé' : 'Non fourni · En attente'}
                                </p>
                              </div>
                            </div>
                            {kycDocs.devis ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                                <i className="ti ti-check font-bold"></i>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDocUpload('devis', 'Devis médical')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 transition-all"
                              >
                                Charger
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Navigation Menu */}
                <div className="bg-white border-t border-slate-100 px-4 py-2 flex justify-around items-center z-20">
                  <button
                    onClick={() => setCurrentScreen(1)}
                    className={`flex flex-col items-center gap-0.5 text-center transition-all ${
                      currentScreen === 1 ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <i className="ti ti-home text-lg"></i>
                    <span className="text-[8px] font-bold">Accueil</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen(2)}
                    className={`flex flex-col items-center gap-0.5 text-center transition-all ${
                      currentScreen === 2 ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <i className="ti ti-plus-circle text-lg"></i>
                    <span className="text-[8px] font-bold">Prêt</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen(3)}
                    className={`flex flex-col items-center gap-0.5 text-center transition-all ${
                      currentScreen === 3 ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <i className="ti ti-building-bank text-lg"></i>
                    <span className="text-[8px] font-bold">Banques</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen(4)}
                    className={`flex flex-col items-center gap-0.5 text-center transition-all ${
                      currentScreen === 4 ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <i className="ti ti-user text-lg"></i>
                    <span className="text-[8px] font-bold">Profil</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
