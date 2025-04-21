import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// types
interface AvatarProps extends Omit<MuiAvatarProps, 'color'> {
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
    outline?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
    src?: string;
    sx?: Record<string, any>;
    children?: React.ReactNode;
    alt?: string;
}

// Create a styled component that doesn't require theme
const StyledAvatar = styled(MuiAvatar)<{
    $size?: number;
    $bgcolor?: string;
    $textcolor?: string;
    $outlineBorder?: string;
    $outlineBg?: string;
    $outlineColor?: string;
}>(({ $size, $bgcolor, $textcolor, $outlineBorder, $outlineBg, $outlineColor }) => ({
    ...$bgcolor && $textcolor ? { backgroundColor: $bgcolor, color: $textcolor } : {},
    ...($outlineBorder && $outlineBg && $outlineColor) ? {
        border: $outlineBorder,
        backgroundColor: $outlineBg,
        color: $outlineColor
    } : {},
    width: $size,
    height: $size,
    fontSize: $size ? `${$size / 2}px` : undefined
}));

// Avatar component
const Avatar: React.FC<AvatarProps> = (props) => {
    const {
        children,
        color,
        outline,
        size,
        ...rest
    } = props;

    const theme = useTheme();

    // Get size in pixels
    const getSizeInPx = (size?: 'sm' | 'md' | 'lg' | 'xl' | number): number => {
        if (typeof size === 'number') return size;

        const sizeValues = {
            sm: 32,
            md: 40,
            lg: 56,
            xl: 72
        };

        return sizeValues[size || 'md'] || 40;
    };

    // Calculate size value
    const sizeValue = getSizeInPx(size);

    // Handle color
    let bgColor = '';
    let textColor = '#fff';

    if (color && color !== 'default') {
        if (color === 'primary' || color === 'secondary' || color === 'error' ||
            color === 'warning' || color === 'info' || color === 'success') {
            bgColor = theme.palette[color].main;
        }
    }

    // Handle outline
    let outlineBorder = '';
    let outlineBg = '';
    let outlineColor = '';

    if (outline) {
        outlineBorder = `2px solid ${theme.palette.background.paper}`;
        outlineBg = theme.palette.background.paper;

        if (color && color !== 'default') {
            if (color === 'primary' || color === 'secondary' || color === 'error' ||
                color === 'warning' || color === 'info' || color === 'success') {
                outlineColor = theme.palette[color].main;
            } else {
                outlineColor = theme.palette.primary.main;
            }
        } else {
            outlineColor = theme.palette.primary.main;
        }
    }

    return (
        <StyledAvatar
            $size={sizeValue}
            $bgcolor={bgColor || undefined}
            $textcolor={textColor}
            $outlineBorder={outlineBorder || undefined}
            $outlineBg={outlineBg || undefined}
            $outlineColor={outlineColor || undefined}
            {...rest}
        >
            {children}
        </StyledAvatar>
    );
};

export default Avatar; 