// src/components/MobileMenu/MobileMenu.tsx
import React, { useState } from 'react';
import { Drawer, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Styles from "./SysDrawer.styles"

interface MobileMenuProps {
    trigger: React.ReactElement;
    children: React.ReactNode;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const MobileMenu = ({ trigger, children, anchor = 'right' }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            {React.cloneElement(trigger, {
                //@ts-ignore
                onClick: handleOpen
            })}

            <Drawer
                anchor={anchor}
                open={isOpen}
                onClose={handleClose}
            >
                <Styles.MenuContent
                    role="presentation"
                    onClick={handleClose}
                >
                    {children}
                </Styles.MenuContent>
            </Drawer>
        </>
    );
};

export default MobileMenu;