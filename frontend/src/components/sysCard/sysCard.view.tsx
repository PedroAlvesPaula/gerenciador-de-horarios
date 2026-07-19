import type { ElementType, ReactNode } from "react";
import {
  Button,
  CardContent,
  Typography,
  type ButtonProps,
} from "@mui/material";
import Styles from "./sysCard.styles";

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
  onClick,
}: ServiceCardProps) => (
  <Styles.Card onClick={onClick}>
    <Styles.ImageContainer>
      <Styles.StyledImage image={imageUrl} title={title} />
    </Styles.ImageContainer>

    <CardContent sx={{ p: 3 }}>
      <Styles.Title variant="h6" component="h3" color="primary">
        {title}
      </Styles.Title>

      <Styles.Description variant="body2" color="text.secondary">
        {description}
      </Styles.Description>

      <Styles.PriceContainer>
        <Typography variant="subtitle1" color="primary">
          {price}
        </Typography>

        <Styles.ActionText
          variant="body2"
          color="secondary"
          className="action-text"
        >
          {actionText} &rarr;
        </Styles.ActionText>
      </Styles.PriceContainer>
    </CardContent>
  </Styles.Card>
);

export interface EntityCardAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  color?: ButtonProps["color"];
  disabled?: boolean;
  ariaLabel?: string;
}

export interface EntityCardProps {
  title: ReactNode;
  children?: ReactNode;
  leading?: ReactNode;
  meta?: ReactNode;
  actions?: EntityCardAction[];
  titleComponent?: ElementType;
}

export const EntityCard = ({
  title,
  children,
  leading,
  meta,
  actions = [],
  titleComponent = "h3",
}: EntityCardProps) => (
  <Styles.EntityCardRoot>
    <Styles.EntityCardHeader>
      {leading}
      <Styles.EntityCardContent>
        <Typography variant="h6" component={titleComponent}>
          {title}
        </Typography>
        {children}
      </Styles.EntityCardContent>
    </Styles.EntityCardHeader>

    {meta && <Styles.EntityCardMeta>{meta}</Styles.EntityCardMeta>}

    {actions.length > 0 && (
      <Styles.EntityCardActions>
        {actions.map((action) => (
          <Button
            key={action.label}
            size="small"
            color={action.color}
            startIcon={action.icon}
            disabled={action.disabled}
            aria-label={action.ariaLabel}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </Styles.EntityCardActions>
    )}
  </Styles.EntityCardRoot>
);
