import { useMemo } from "react";
import ProfileView from "./Profile.view";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Corte + Barba (João)",
    amount: 80.0,
    type: "income",
    date: "Hoje, 14:30",
  },
  {
    id: "2",
    description: "Abastecimento Moto",
    amount: 50.0,
    type: "expense",
    date: "Hoje, 09:15",
  },
  {
    id: "3",
    description: "Corte Clássico (Marcos)",
    amount: 45.0,
    type: "income",
    date: "Ontem, 18:00",
  },
  {
    id: "4",
    description: "Reposição Lâminas",
    amount: 25.5,
    type: "expense",
    date: "Ontem, 10:00",
  },
];

const ProfileController = () => {
  const summary = useMemo(() => {
    const totalIncome = mockTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = mockTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      balance: totalIncome - totalExpense,
      income: totalIncome,
      expense: totalExpense,
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <ProfileView
      transactions={mockTransactions}
      summary={summary}
      formatCurrency={formatCurrency}
    />
  );
};

export default ProfileController;
