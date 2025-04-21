import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

/**
 * Formats a date string into YYYY-MM-DD format (ISO format)
 */
export const formatToISODate = (dateString: string | Date): string => {
    if (!dateString) return '';
    return dayjs(dateString).format('YYYY-MM-DD');
};

/**
 * Formats a date string into a human-readable format (e.g., February 28, 2023)
 */
export const formatToReadableDate = (dateString: string | Date): string => {
    if (!dateString) return '';
    return dayjs(dateString).format('MMMM D, YYYY');
};

/**
 * Formats a date string into a short format (e.g., Feb 28, 2023)
 */
export const formatToShortDate = (dateInput: any): string => {
    if (!dateInput) {
        return '';
    }

    try {
        // If it's a Firestore Timestamp, convert to Date first
        if (typeof dateInput === 'object' && dateInput !== null) {
            // Handle Firestore Timestamp (newer format)
            if (dateInput.seconds !== undefined && dateInput.nanoseconds !== undefined) {
                const date = new Date(dateInput.seconds * 1000);
                return dayjs(date).format('MMM D, YYYY');
            }

            // Handle Firestore Timestamp (older format)
            if (dateInput._seconds !== undefined && dateInput._nanoseconds !== undefined) {
                const date = new Date(dateInput._seconds * 1000);
                return dayjs(date).format('MMM D, YYYY');
            }

            // Check if it's a JavaScript Date object
            if (dateInput instanceof Date) {
                return dayjs(dateInput).format('MMM D, YYYY');
            }

            // Handle possible serialized date objects
            if (dateInput.toDate && typeof dateInput.toDate === 'function') {
                try {
                    const date = dateInput.toDate();
                    return dayjs(date).format('MMM D, YYYY');
                } catch (err) {
                    console.error('Error in toDate():', err);
                }
            }
        }

        // Handle string dates
        if (typeof dateInput === 'string') {
            // Try to handle ISO formatted strings directly
            const parsed = dayjs(dateInput);
            if (parsed.isValid()) {
                return parsed.format('MMM D, YYYY');
            }

            // Try to extract a date from complex strings
            const dateMatch = dateInput.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (dateMatch) {
                const [_, year, month, day] = dateMatch;
                const parsed = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                if (parsed.isValid()) {
                    return parsed.format('MMM D, YYYY');
                }
            }
        }

        // For numbers (timestamps)
        if (typeof dateInput === 'number') {
            return dayjs(new Date(dateInput)).format('MMM D, YYYY');
        }

        // For other formats, try dayjs directly
        const date = dayjs(dateInput);
        if (date.isValid()) {
            return date.format('MMM D, YYYY');
        }

        console.warn('Invalid date in formatToShortDate:', dateInput);
        return 'Invalid date';
    } catch (error) {
        console.error('Error in formatToShortDate:', error, dateInput);
        return 'Date error';
    }
};

/**
 * Parses a date string and returns a dayjs object
 */
export const parseDate = (dateString: string, format?: string): dayjs.Dayjs => {
    if (format) {
        return dayjs(dateString, format);
    }
    return dayjs(dateString);
};

/**
 * Compares two dates to see if they are the same day
 */
export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
    return dayjs(date1).isSame(dayjs(date2), 'day');
};

/**
 * Returns the current date as a string in YYYY-MM-DD format
 */
export const getCurrentDateString = (): string => {
    return dayjs().format('YYYY-MM-DD');
};

/**
 * Convert a date to a Firestore-compatible format
 * This now returns the date object directly, which Firebase will convert to a timestamp
 */
export const toFirestoreDate = (dateInput: any): Date => {
    // If it's already a Date object, return it
    if (dateInput instanceof Date) {
        return dateInput;
    }

    // If it's a Firestore Timestamp, convert to Date
    if (typeof dateInput === 'object' && dateInput !== null) {
        // Handle Firestore Timestamp (newer format)
        if (dateInput.seconds !== undefined && dateInput.nanoseconds !== undefined) {
            return new Date(dateInput.seconds * 1000);
        }

        // Handle Firestore Timestamp (older format)
        if (dateInput._seconds !== undefined && dateInput._nanoseconds !== undefined) {
            return new Date(dateInput._seconds * 1000);
        }
    }

    // For strings and other formats, convert to Date
    return dayjs(dateInput).toDate();
};

/**
 * Parse a Firestore date into a dayjs object
 */
export const fromFirestoreDate = (dateInput: any): dayjs.Dayjs => {
    // If it's a Firestore Timestamp, convert to Date first
    if (typeof dateInput === 'object' && dateInput !== null) {
        // Handle Firestore Timestamp (newer format)
        if (dateInput.seconds !== undefined && dateInput.nanoseconds !== undefined) {
            return dayjs(new Date(dateInput.seconds * 1000));
        }

        // Handle Firestore Timestamp (older format)
        if (dateInput._seconds !== undefined && dateInput._nanoseconds !== undefined) {
            return dayjs(new Date(dateInput._seconds * 1000));
        }

        // If it's a JavaScript Date object
        if (dateInput instanceof Date) {
            return dayjs(dateInput);
        }
    }

    // For strings and other formats
    return dayjs(dateInput);
};

/**
 * Formats a date with time component (e.g., "Feb 28, 2023 2:30 PM")
 * Handles various date formats including Firestore timestamps
 */
export const formatDateWithTime = (dateInput: any): string => {
    if (!dateInput) return 'Unknown date';

    try {
        // First use our shared utility to get the formatted date
        const formattedDate = formatToShortDate(dateInput);

        // If we get a valid date from the utility, add the time component
        if (formattedDate && formattedDate !== 'Invalid date' && formattedDate !== 'Date error') {
            // Parse the date object
            let dateObj: Date;

            // Handle Firestore timestamp (has seconds and nanoseconds)
            if (typeof dateInput === 'object' && dateInput !== null) {
                if (dateInput.seconds !== undefined && dateInput.nanoseconds !== undefined) {
                    dateObj = new Date(dateInput.seconds * 1000);
                } else if (dateInput._seconds !== undefined && dateInput._nanoseconds !== undefined) {
                    dateObj = new Date(dateInput._seconds * 1000);
                } else if (dateInput instanceof Date) {
                    dateObj = dateInput;
                } else {
                    dateObj = new Date(dateInput);
                }
            } else {
                dateObj = new Date(dateInput);
            }

            // Format the time if we have a valid date
            if (!isNaN(dateObj.getTime())) {
                const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `${formattedDate} ${timeString}`;
            }

            return formattedDate;
        }

        return 'Invalid date format';
    } catch (error) {
        console.error('Error formatting date with time:', error, dateInput);
        return 'Date error';
    }
};

export default dayjs; 