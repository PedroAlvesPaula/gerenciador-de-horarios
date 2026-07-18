import { type ReactNode } from "react";
import SysIcon from "../../../components/icons/SysIcon";
import Styles from "../Auth.styles";

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthPageLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthPageLayoutProps) => (
  <Styles.PageWrapper>
    <Styles.AuthCard>
      <Styles.ImageColumn>
        <SysIcon name="verticalLogo" width={300} height={300} />
      </Styles.ImageColumn>

      <Styles.FormColumn>
        <Styles.HeaderContainer>
          <Styles.Title variant="h4" component="h1">
            {title}
          </Styles.Title>
          <Styles.Subtitle>{subtitle}</Styles.Subtitle>
        </Styles.HeaderContainer>

        {children}
        <Styles.FooterContainer>{footer}</Styles.FooterContainer>
      </Styles.FormColumn>
    </Styles.AuthCard>
  </Styles.PageWrapper>
);

export default AuthPageLayout;
