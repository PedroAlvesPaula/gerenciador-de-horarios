import React from 'react';
import { Container } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import Styles from './SysFooter.styles';

const SysFooter = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <Styles.FooterWrapper>
            <Container maxWidth="lg">

                <Styles.BrandContainer>
                    <Styles.LogoText variant="h5">
                        P.H. BARBER
                    </Styles.LogoText>

                    <Styles.InfoText variant="body2">
                        {t('footer.brandDescription')}
                    </Styles.InfoText>

                    <Styles.SocialContainer>
                        <Styles.SocialButton size="small">
                            <InstagramIcon fontSize="small" />
                        </Styles.SocialButton>
                        <Styles.SocialButton size="small">
                            <WhatsAppIcon fontSize="small" />
                        </Styles.SocialButton>
                        <Styles.SocialButton size="small">
                            <FacebookIcon fontSize="small" />
                        </Styles.SocialButton>
                    </Styles.SocialContainer>
                </Styles.BrandContainer>

                <Styles.CopyrightWrapper>
                    <Styles.CopyrightText variant="body2">
                        © {currentYear} P.H. Barber. {t('footer.rights')}
                    </Styles.CopyrightText>
                </Styles.CopyrightWrapper>

            </Container>
        </Styles.FooterWrapper>
    );
};

export default SysFooter;