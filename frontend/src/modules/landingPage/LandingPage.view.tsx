import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Styles from './LandingPage.styles';
import { useLandingPage } from './LandingPage.context';
import { ServiceCard } from '../../components/sysCard/sysCard.view';

const LandingPageView = () => {
    const { servicesList, handleBookService, handleHeroAction, t } = useLandingPage();

    return (
        <main>
            <Styles.HeroWrapper>
                <Styles.HeroContent maxWidth="lg">
                    <Styles.HeroTitle1 variant="h2" component="h1">
                        {t('hero.title1')}
                    </Styles.HeroTitle1>

                    <Styles.HeroTitle2 variant="h2" component="span">
                        {t('hero.title2')}
                    </Styles.HeroTitle2>

                    <Styles.HeroDescription variant="h6">
                        {t('hero.description')}
                    </Styles.HeroDescription>

                    <Styles.HeroButton
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleHeroAction}
                    >
                        {t('hero.bookButton')}
                    </Styles.HeroButton>
                </Styles.HeroContent>
            </Styles.HeroWrapper>

            <Styles.ServicesWrapper id="services">
                <Container maxWidth="lg">
                    <Styles.SectionHeaderContainer>
                        <Styles.OverlineText variant="overline">
                            O que oferecemos
                        </Styles.OverlineText>

                        <Styles.SectionTitle variant="h3" component="h2">
                            Nossos Serviços
                        </Styles.SectionTitle>
                    </Styles.SectionHeaderContainer>

                    <Grid container spacing={4}>
                        {servicesList.map((service) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                                <ServiceCard
                                    title={service.title}
                                    description={service.description}
                                    price={service.price}
                                    imageUrl={service.imageUrl}
                                    actionText={t('hero.bookButton')}
                                    onClick={() => handleBookService(service.title)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Styles.ServicesWrapper>

            <Styles.AboutWrapper id="about">
                <Container maxWidth="lg">
                    <Grid container spacing={6}>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Styles.AboutImageContainer>
                                <Styles.AboutImage
                                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800"
                                    alt="Interior da Barbearia"
                                />
                            </Styles.AboutImageContainer>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <Styles.AboutContentContainer>
                                <Styles.OverlineText variant="overline">
                                    {t('about.overline')}
                                </Styles.OverlineText>

                                <Styles.SectionTitle variant="h3" component="h2" gutterBottom>
                                    {t('about.title')}
                                </Styles.SectionTitle>

                                <Styles.AboutText variant="body1">
                                    {t('about.description1')}
                                </Styles.AboutText>

                                <Styles.AboutText variant="body1">
                                    {t('about.description2')}
                                </Styles.AboutText>

                                <Styles.StatsContainer>
                                    <Styles.StatItem>
                                        <Styles.StatNumber>{t('about.stat1Number')}</Styles.StatNumber>
                                        <Styles.StatLabel>{t('about.stat1Label')}</Styles.StatLabel>
                                    </Styles.StatItem>

                                    <Styles.StatItem>
                                        <Styles.StatNumber>{t('about.stat2Number')}</Styles.StatNumber>
                                        <Styles.StatLabel>{t('about.stat2Label')}</Styles.StatLabel>
                                    </Styles.StatItem>
                                </Styles.StatsContainer>

                            </Styles.AboutContentContainer>
                        </Grid>

                    </Grid>
                </Container>
            </Styles.AboutWrapper>
        </main>
    );
};

export default LandingPageView;