import React, { createContext, useContext, useState, useEffect } from 'react';

type KycDocs = {
  cni: boolean;
  bulletins: boolean;
  releve: boolean;
  devis: boolean;
};

type DataContextType = {
  loanAmount: number;
  setLoanAmount: (val: number) => void;
  loanDuration: number;
  setLoanDuration: (val: number) => void;
  loanType: number;
  setLoanType: (val: number) => void;
  kycDocs: KycDocs;
  setKycDocs: React.Dispatch<React.SetStateAction<KycDocs>>;
  kycPct: number;
  calculateMonthly: (amount: number, duration: number) => number;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [loanDuration, setLoanDuration] = useState(12);
  const [loanType, setLoanType] = useState(1);
  const [kycDocs, setKycDocs] = useState<KycDocs>({
    cni: true,
    bulletins: true,
    releve: false,
    devis: false,
  });

  const [kycPct, setKycPct] = useState(50);

  useEffect(() => {
    const total = Object.values(kycDocs).length;
    const completed = Object.values(kycDocs).filter(v => v).length;
    setKycPct(Math.round((completed / total) * 100));
  }, [kycDocs]);

  const calculateMonthly = (amount: number, duration: number) => {
    const rate = 0.085 / 12;
    return Math.round(amount * rate * Math.pow(1 + rate, duration) / (Math.pow(1 + rate, duration) - 1));
  };

  return (
    <DataContext.Provider value={{
      loanAmount, setLoanAmount,
      loanDuration, setLoanDuration,
      loanType, setLoanType,
      kycDocs, setKycDocs,
      kycPct,
      calculateMonthly
    }}>
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
