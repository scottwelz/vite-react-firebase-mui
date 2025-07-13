import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackEvent, trackUserIdentity, trackUserProperties } from '../firebaseConfig';

/**
 * Hook to use Google Analytics throughout the app
 */
export const useAnalytics = () => {
    const location = useLocation();


    // Track page views
    useEffect(() => {
        // Page view tracking
        trackEvent('page_view', {
            page_path: location.pathname,
            page_location: window.location.href,
            page_title: document.title
        });
    }, [location]);

    // Track user identity when they log in
    // useEffect(() => {
    //     if (currentUser?.uid) {
    //         // Identify user for analytics
    //         trackUserIdentity(currentUser.uid);

    //         // Set user properties
    //         trackUserProperties({
    //             user_id: currentUser.uid,
    //             email_verified: currentUser.emailVerified,
    //             // Add any other properties you want to track
    //         });
    //     }
    // }, [currentUser]);

    return {
        // Return our tracking functions for use in components
        trackEvent,
        trackUserIdentity,
        trackUserProperties,

        // Some common event tracking helpers
        trackButtonClick: (buttonName: string, additionalParams = {}) => {
            trackEvent('button_click', {
                button_name: buttonName,
                ...additionalParams
            });
        },

        trackAlertCreated: (alertId: string, permitAreaId: string) => {
            trackEvent('alert_created', {
                alert_id: alertId,
                permit_area_id: permitAreaId
            });
        },

        trackSearch: (searchTerm: string, resultCount: number) => {
            trackEvent('search', {
                search_term: searchTerm,
                result_count: resultCount
            });
        },

        trackError: (errorCode: string, errorMessage: string) => {
            trackEvent('app_error', {
                error_code: errorCode,
                error_message: errorMessage
            });
        }
    };
}; 