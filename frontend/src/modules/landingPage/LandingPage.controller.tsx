import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingPageContext } from './LandingPage.context';
import LandingPageView from './LandingPage.view';

const LandingPageController = () => {
    const { t } = useTranslation();

    const servicesList = [
        {
            id: 1,
            title: 'Corte Premium',
            description: 'Degradê, tesoura ou máquina com acabamento impecável.',
            price: 'R$ 50,00',
            imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: 2,
            title: 'Barba Terapia',
            description: 'Modelagem com toalha quente e produtos especiais.',
            price: 'R$ 40,00',
            imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
        },
        {
            id: 3,
            title: 'Combo Completo',
            description: 'Corte + Barba + Sobrancelha. O tratamento real.',
            price: 'R$ 80,00',
            imageUrl: 'https://images.unsplash.com/photo-1599351431202-6e0c06e76519?auto=format&fit=crop&q=80&w=800',
        }
    ];

    const handleBookService = (serviceTitle: string) => {
        alert(`Agendando serviço: ${serviceTitle}`);
    };

    const handleHeroAction = () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    };

    const providerValues = useMemo(() => ({
        servicesList,
        handleBookService,
        handleHeroAction,
        t
    }), [])

    return (
        <LandingPageContext.Provider value={providerValues}>
            <LandingPageView />
        </LandingPageContext.Provider>
    );
};

export default LandingPageController;