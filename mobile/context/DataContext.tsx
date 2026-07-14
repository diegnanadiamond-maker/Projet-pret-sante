import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type KycDocs = {
  cni: boolean;
  bulletins: boolean;
  releve: boolean;
  devis: boolean;
};

export type BankOffer = {
  bank: string;
  bankFullName: string;
  rate: number;
  delay: string;
};

// The only banks Prêt Santé can disburse to — matched against the bank the
// client registered during identity verification (see (kyc)/bank-info.tsx).
export const BANK_OFFERS: BankOffer[] = [
  { bank: 'SGCI Santé +', bankFullName: "Société Générale Côte d'Ivoire", rate: 7.9, delay: '48h' },
  { bank: 'BNI Crédit Santé', bankFullName: "Banque Nationale d'Investissement", rate: 9.2, delay: '72h' },
  { bank: 'ECOBANK Flex', bankFullName: "Ecobank Côte d'Ivoire", rate: 10.5, delay: '5 jours' },
];

export type LoanRequest = {
  id: string;
  loanType: number;
  establishment: string;
  loanAmount: number;
  loanDuration: number;
  selectedOffer: BankOffer | null;
  status: 'in_review' | 'active';
  createdAt: number;
};

type DataContextType = {
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  identityVerified: boolean;
  setIdentityVerified: (val: boolean) => void;

  bankName: string;
  setBankName: (val: string) => void;
  bankAccountNumber: string;
  setBankAccountNumber: (val: string) => void;
  bankRibIban: string;
  setBankRibIban: (val: string) => void;

  // Draft fields for the request currently being built in the (loan-request) wizard.
  loanAmount: number;
  setLoanAmount: (val: number) => void;
  loanDuration: number;
  setLoanDuration: (val: number) => void;
  loanType: number;
  setLoanType: (val: number) => void;
  establishment: string;
  setEstablishment: (val: string) => void;

  kycDocs: KycDocs;
  setKycDocs: React.Dispatch<React.SetStateAction<KycDocs>>;
  kycPct: number;

  selectedOffer: BankOffer | null;

  // Every request the client has submitted — each tracked independently so a
  // new request can be started without losing the ones already in progress.
  loans: LoanRequest[];
  addLoan: () => string;

  calculateMonthly: (amount: number, duration: number, ratePct?: number) => number;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [fullName, setFullName] = useState('Kouamé Adou');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);

  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankRibIban, setBankRibIban] = useState('');

  const [loanAmount, setLoanAmount] = useState(250000);
  const [loanDuration, setLoanDuration] = useState(12);
  const [loanType, setLoanType] = useState(1);
  const [establishment, setEstablishment] = useState('Clinique Avicenne – Abidjan');

  const [kycDocs, setKycDocs] = useState<KycDocs>({
    cni: false,
    bulletins: false,
    releve: false,
    devis: false,
  });
  const [kycPct, setKycPct] = useState(0);

  const selectedOffer = useMemo(
    () => BANK_OFFERS.find((o) => bankName && o.bank.toLowerCase().includes(bankName.toLowerCase())) ?? null,
    [bankName],
  );

  const [loans, setLoans] = useState<LoanRequest[]>([]);

  const addLoan = () => {
    const id = `loan-${Date.now()}`;
    const newLoan: LoanRequest = {
      id,
      loanType,
      establishment,
      loanAmount,
      loanDuration,
      selectedOffer,
      status: 'in_review',
      createdAt: Date.now(),
    };
    setLoans((prev) => [newLoan, ...prev]);
    return id;
  };

  useEffect(() => {
    const total = Object.values(kycDocs).length;
    const completed = Object.values(kycDocs).filter(Boolean).length;
    setKycPct(Math.round((completed / total) * 100));
  }, [kycDocs]);

  const calculateMonthly = (amount: number, duration: number, ratePct = 8.5) => {
    const rate = ratePct / 100 / 12;
    return Math.round((amount * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1));
  };

  return (
    <DataContext.Provider
      value={{
        fullName, setFullName,
        phone, setPhone,
        email, setEmail,
        isAuthenticated, setIsAuthenticated,
        identityVerified, setIdentityVerified,
        bankName, setBankName,
        bankAccountNumber, setBankAccountNumber,
        bankRibIban, setBankRibIban,
        loanAmount, setLoanAmount,
        loanDuration, setLoanDuration,
        loanType, setLoanType,
        establishment, setEstablishment,
        kycDocs, setKycDocs,
        kycPct,
        selectedOffer,
        loans,
        addLoan,
        calculateMonthly,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
