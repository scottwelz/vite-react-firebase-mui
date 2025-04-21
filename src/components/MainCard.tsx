import { forwardRef, ReactNode } from 'react';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SxProps } from '@mui/material';

interface MainCardProps {
    border?: boolean;
    boxShadow?: boolean;
    children: ReactNode;
    subheader?: ReactNode;
    content?: boolean;
    contentSX?: SxProps;
    darkTitle?: boolean;
    divider?: boolean;
    elevation?: number;
    secondary?: ReactNode;
    shadow?: string;
    sx?: SxProps;
    title?: ReactNode;
    modal?: boolean;
    [key: string]: any;
}

// header style
const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
    (
        {
            border = true,
            boxShadow,
            children,
            subheader,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            secondary,
            shadow,
            sx = {},
            title,
            modal = false,
            ...others
        },
        ref
    ) => {
        return (
            <Card
                elevation={elevation || 0}
                ref={ref}
                sx={{
                    position: 'relative',
                    border: border ? '1px solid' : 'none',
                    borderRadius: 1,
                    borderColor: 'divider',
                    boxShadow: boxShadow && !border ? shadow || '0px 2px 8px rgba(0, 0, 0, 0.15)' : 'inherit',
                    ':hover': {
                        boxShadow: boxShadow ? shadow || '0px 2px 8px rgba(0, 0, 0, 0.15)' : 'inherit'
                    },
                    ...(modal && {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 'calc(100% - 50px)', sm: 'auto' },
                        maxWidth: 768,
                        '& .MuiCardContent-root': { overflowY: 'auto', minHeight: 'auto', maxHeight: 'calc(100vh - 200px)' }
                    }),
                    ...sx
                }}
                {...others}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader sx={headerSX} title={title} action={secondary} subheader={subheader} />
                )}

                {/* content & header divider */}
                {title && divider && <Divider />}

                {/* card content */}
                {content && <CardContent sx={contentSX}>{children}</CardContent>}
                {!content && children}
            </Card>
        );
    }
);

export default MainCard; 