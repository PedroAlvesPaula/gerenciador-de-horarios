import { createContext, useContext } from 'react';

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
    t: any;
}

export const LandingPageContext = createContext<LandingPageContextData>({} as LandingPageContextData);

export const useLandingPage = () => useContext(LandingPageContext);