import React from 'react';
import { CardContent, Typography } from '@mui/material';
import Styles from "./sysCard.styles"

export interface ServiceCardProps {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    actionText: string;
    onClick?: () => void;
}

export const ServiceCard = ({
    title,
    description,
    price,
    imageUrl,
    actionText,
    onClick
}: ServiceCardProps) => {
    return (
        <Styles.Card onClick={onClick}>
            <Styles.ImageContainer>
                <Styles.StyledImage image={imageUrl} title={title} />
            </Styles.ImageContainer>

            <CardContent sx={{ p: 3 }}>
                <Styles.Title variant="h6" component="h3" color="primary" >
                    {title}
                </Styles.Title>

                <Styles.Description variant="body2" color="text.secondary">
                    {description}
                </Styles.Description>

                <Styles.PriceContainer>
                    <Typography variant="subtitle1" color="primary">
                        {price}
                    </Typography>

                    <Styles.ActionText variant="body2" color="secondary" className="action-text">
                        {actionText} &rarr;
                    </Styles.ActionText>
                </Styles.PriceContainer>
            </CardContent>
        </Styles.Card>
    );
};