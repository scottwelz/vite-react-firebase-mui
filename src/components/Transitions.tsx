import { forwardRef, ReactNode } from 'react';

// material-ui
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';

interface TransitionsProps {
    children: ReactNode;
    position?: 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom';
    type?: 'grow' | 'fade' | 'collapse' | 'slide' | 'zoom';
    direction?: 'up' | 'down' | 'left' | 'right';
    [key: string]: any;
}

const Transitions = forwardRef<HTMLDivElement, TransitionsProps>(
    ({ children, position = 'top-left', type = 'grow', direction = 'up', ...others }, ref) => {
        let positionSX = {
            transformOrigin: '0 0 0'
        };

        switch (position) {
            case 'top-right':
                positionSX = {
                    transformOrigin: 'top right'
                };
                break;
            case 'top':
                positionSX = {
                    transformOrigin: 'top'
                };
                break;
            case 'bottom-left':
                positionSX = {
                    transformOrigin: 'bottom left'
                };
                break;
            case 'bottom-right':
                positionSX = {
                    transformOrigin: 'bottom right'
                };
                break;
            case 'bottom':
                positionSX = {
                    transformOrigin: 'bottom'
                };
                break;
            case 'top-left':
            default:
                positionSX = {
                    transformOrigin: '0 0 0'
                };
                break;
        }

        return (
            <Box ref={ref}>
                {type === 'grow' && (
                    <Grow
                        {...others}
                        timeout={{
                            appear: 0,
                            enter: 150,
                            exit: 150
                        }}
                    >
                        <Box sx={positionSX}>{children}</Box>
                    </Grow>
                )}

                {type === 'collapse' && (
                    <Collapse {...others} sx={positionSX}>
                        {children}
                    </Collapse>
                )}

                {type === 'fade' && (
                    <Fade
                        {...others}
                        timeout={{
                            appear: 0,
                            enter: 300,
                            exit: 150
                        }}
                    >
                        <Box sx={positionSX}>{children}</Box>
                    </Fade>
                )}

                {type === 'slide' && (
                    <Slide
                        {...others}
                        timeout={{
                            appear: 0,
                            enter: 150,
                            exit: 150
                        }}
                        direction={direction}
                    >
                        <Box sx={positionSX}>{children}</Box>
                    </Slide>
                )}

                {type === 'zoom' && (
                    <Zoom {...others}>
                        <Box sx={positionSX}>{children}</Box>
                    </Zoom>
                )}
            </Box>
        );
    }
);

export default Transitions;

interface PopupTransitionProps {
    children: ReactNode;
    [key: string]: any;
}

export const PopupTransition = forwardRef<HTMLDivElement, PopupTransitionProps>(({ children, ...props }, ref) => (
    <Zoom ref={ref} timeout={200} {...props}>
        {children}
    </Zoom>
)); 