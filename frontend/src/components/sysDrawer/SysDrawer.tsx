import {
    cloneElement,
    useState,
    type MouseEventHandler,
    type ReactElement,
    type ReactNode,
} from 'react';
import { Drawer } from '@mui/material';
import Styles from "./SysDrawer.styles"

interface MobileMenuProps {
    trigger: ReactElement<{ onClick?: MouseEventHandler }>;
    children: ReactNode;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const MobileMenu = ({ trigger, children, anchor = 'right' }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            {cloneElement(trigger, {
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
