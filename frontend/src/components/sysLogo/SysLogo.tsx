import React from 'react';
import { useTheme } from '@mui/material/styles';

const SysLogo = () => {
    const theme = useTheme();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 160"
            width="100%"
            height="100%"
        >
            <defs>
                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
                        .main-text {
                            font-family: 'Playfair Display', serif;
                            font-size: 48px;
                            font-weight: 700;
                            fill: ${theme.palette.common.white};
                            letter-spacing: 2px;
                        }
                        .sub-text {
                            font-family: 'Playfair Display', serif;
                            font-size: 16px;
                            font-style: italic;
                            fill: ${theme.palette.common.white};
                            letter-spacing: 4px;
                        }
                    `}
                </style>
            </defs>

            {/* Linha Dourada Superior com Losango */}
            <path
                d="M 50,40 L 180,40 L 200,25 L 220,40 L 350,40"
                fill="none"
                stroke={theme.palette.secondary.main}
                strokeWidth="2"
            />

            {/* Texto Principal */}
            <text x="200" y="95" textAnchor="middle" className="main-text">
                PH BARBEARIA
            </text>

            {/* Linha Dourada Inferior com Losango */}
            <path
                d="M 120,120 L 180,120 L 200,135 L 220,120 L 280,120"
                fill="none"
                stroke={theme.palette.secondary.main}
                strokeWidth="2"
            />

            {/* Texto Secundário */}
            <text x="200" y="150" textAnchor="middle" className="sub-text">
                DESDE 2018
            </text>
        </svg>
    );
};

export default SysLogo;