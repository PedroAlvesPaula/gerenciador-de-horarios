// src/components/sysIcon/SysIcon.tsx
import React, { SVGProps } from 'react';

import horizontalLogo from '../../assets/icons/horizontalLogo.svg?react';
import verticalLogo from '../../assets/icons/verticalLogo.svg?react';
import icon from '../../assets/icons/iconLogo.svg?react';
import brand from '../../assets/icons/brand.svg?react';

const iconMap = {
    'horizontalLogo': horizontalLogo,
    'verticalLogo': verticalLogo,
    'icon': icon,
    "brand": brand
};

export type IconName = keyof typeof iconMap;

interface SysIconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
}

const SysIcon = ({ name, ...props }: SysIconProps) => {
    const IconComponent = iconMap[name];

    console.log("IconComponent: ", IconComponent);

    if (!IconComponent) {
        console.warn(`Ícone "${name}" não foi encontrado no SysIcon.`);
        return null;
    }
    return <IconComponent {...props} />;
};

export default SysIcon;