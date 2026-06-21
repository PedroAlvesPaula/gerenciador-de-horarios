import Box from "@mui/material/Box";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import Styles from "./Profile.styles";
import { type Transaction } from "./Profile.controller";

interface ProfileSummary {
  balance: number;
  income: number;
  expense: number;
}

interface ProfileViewProps {
  transactions: Transaction[];
  summary: ProfileSummary;
  formatCurrency: (value: number) => string;
}

const ProfileView = ({
  transactions,
  summary,
  formatCurrency,
}: ProfileViewProps) => {
  return (
    <Styles.PageWrapper>
      <Styles.HeaderTitle variant="h5">
        Meu Perfil & Finanças
      </Styles.HeaderTitle>

      <Styles.SummaryGrid>
        <Styles.SummaryCard fullwidth>
          <Styles.SummaryLabel>Saldo do Mês</Styles.SummaryLabel>
          <Styles.SummaryValue color="primary">
            {formatCurrency(summary.balance)}
          </Styles.SummaryValue>
        </Styles.SummaryCard>

        <Styles.SummaryCard>
          <Styles.SummaryLabel>Entradas</Styles.SummaryLabel>
          <Styles.SummaryValue color="success">
            {formatCurrency(summary.income)}
          </Styles.SummaryValue>
        </Styles.SummaryCard>

        <Styles.SummaryCard>
          <Styles.SummaryLabel>Saídas</Styles.SummaryLabel>
          <Styles.SummaryValue color="error">
            {formatCurrency(summary.expense)}
          </Styles.SummaryValue>
        </Styles.SummaryCard>
      </Styles.SummaryGrid>

      <Box sx={{ mt: 2 }}>
        <Styles.SectionTitle>Últimas Movimentações</Styles.SectionTitle>

        <Styles.TransactionList>
          {transactions.map((transaction) => (
            <Styles.TransactionItem key={transaction.id}>
              <Styles.TransactionInfo>
                <Styles.TransactionIcon type={transaction.type}>
                  {transaction.type === "income" ? (
                    <TrendingUpIcon />
                  ) : (
                    <TrendingDownIcon />
                  )}
                </Styles.TransactionIcon>

                <Styles.TransactionDetails>
                  <Styles.TransactionDescription>
                    {transaction.description}
                  </Styles.TransactionDescription>
                  <Styles.TransactionDate>
                    {transaction.date}
                  </Styles.TransactionDate>
                </Styles.TransactionDetails>
              </Styles.TransactionInfo>

              <Styles.TransactionAmount type={transaction.type}>
                {transaction.type === "income" ? "+ " : "- "}
                {formatCurrency(transaction.amount)}
              </Styles.TransactionAmount>
            </Styles.TransactionItem>
          ))}
        </Styles.TransactionList>
      </Box>
    </Styles.PageWrapper>
  );
};

export default ProfileView;
