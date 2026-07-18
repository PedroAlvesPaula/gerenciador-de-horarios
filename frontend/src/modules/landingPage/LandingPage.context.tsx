import { createContext, useContext } from 'react';
import { type TFunction } from 'i18next';

export interface ServiceType {
    id: number;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
}

export interface LandingPageContextData {
    servicesList: ServiceType[];
    handleBookService: (serviceTitle: string) => void;
    handleHeroAction: () => void;
    t: TFunction<'translation', undefined>;
}

export const LandingPageContext = createContext<LandingPageContextData>({} as LandingPageContextData);

export const useLandingPage = () => useContext(LandingPageContext);
