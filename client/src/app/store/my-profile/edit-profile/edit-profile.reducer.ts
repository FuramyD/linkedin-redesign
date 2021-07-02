import {
    EditProfileActions,
    SET_ERROR_AD_ALERT_ACTION_TYPE,
    SET_ERROR_LS_ALERT_ACTION_TYPE,
    SET_SUCCESS_AD_ALERT_ACTION_TYPE,
    SET_SUCCESS_LS_ALERT_ACTION_TYPE,
} from './edit-profile.actions'

interface ADAlerts {
    role: string
    // company: string,
    about: string
    profession: string
    locality: string
    contactInfo: string
    projects: string
    experience: string
    education: string
}

interface LSAlerts {
    email: string
    password: string
    phone: string
}

interface EditProfile {
    AD: {
        successAlerts: ADAlerts
        errorAlerts: ADAlerts
    }
    LS: {
        successAlerts: LSAlerts
        errorAlerts: LSAlerts
    }
}

const initialState: EditProfile = {
    AD: {
        successAlerts: {
            role: '',
            // company: '',
            about: '',
            profession: '',
            locality: '',
            contactInfo: '',
            projects: '',
            experience: '',
            education: '',
        },
        errorAlerts: {
            role: '',
            // company: ',
            about: '',
            profession: '',
            locality: '',
            contactInfo: '',
            projects: '',
            experience: '',
            education: '',
        },
    },
    LS: {
        successAlerts: {
            email: '',
            password: '',
            phone: '',
        },
        errorAlerts: {
            email: '',
            password: '',
            phone: '',
        },
    },
}

export const EditProfileReducer: /*EditProfile | void*/ any = (
    state: EditProfile = initialState,
    action: EditProfileActions,
) => {
    switch (action.type) {
        case SET_SUCCESS_AD_ALERT_ACTION_TYPE:
            return
        case SET_SUCCESS_LS_ALERT_ACTION_TYPE:
            return
        case SET_ERROR_AD_ALERT_ACTION_TYPE:
            return
        case SET_ERROR_LS_ALERT_ACTION_TYPE:
            return
    }
}
