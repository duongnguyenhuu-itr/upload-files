export enum AppFlowActions {
  USER_UPDATED = 'USER_UPDATED',
  LOGOUT_REQUEST = 'LOGOUT_REQUEST',
  EXPIRE_TOKEN = 'EXPIRE_TOKEN',
}

export const ERROR_ACCESS_TOKEN = 'ERROR_ACCESS_TOKEN' as const;

export const PATH_NAME = {
  SIGN_IN: '/sign-in',
  AUTHORIZE: '/authorize',
  DASHBOARD: '/dashboard',
  VERIFY_EMAIL: '/verify-email',
  TASKS: '/tasks',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  REPORTS: '/reports',
  SCHEDULES: '/schedules',
  SETTINGS: '/settings',
  VIDEO_CALL: '/video-call',
  HEALTH_DATA: '/health-data',
  UPCOMING: '/upcoming',
  HISTORY: '/history',
} as const;

export const ACCEPTED_FACILITIES_STATUS = ['Active', 'Test', 'Eval'] as const;

export const EMITTER_CONSTANTS = {
  SYNC_DEVICE_DATA: 'SYNC_DEVICE_DATA',
} as const;

export enum EventEmitter {
  CheckStudyDeviceConnection = 'CheckStudyDeviceConnection',
  StartStreamingStudyEcgPortal = 'StartStreamingStudyEcgPortal',
  ConnectedDevice = 'ConnectedDevice',
}

export const THEME_COLOR = {
  colorPrimary: '#025EFC',
  borderRadius: 6,
  fontFamily: 'Inter',
  colorWhite: '#FFFFFF',
  colorText: '#000000e0',
  colorSplit: '#0000000F',
  colorBgContainer: '#FFFFFF',
  controlItemBgHover: '#0000000A',
  rowHoverBg: '#FAFAFA',
  optionSelectedBg: '#E6F3FF',
} as const;

// USER
export enum UserStatusEnum {
  ACTIVE = 'Active',
  DEACTIVATED = 'Deactived',
}

export enum RoleEnum {
  CLINIC_TECHNICIAN = 'Clinic Technician',
  CLINIC_PHYSICIAN = 'Clinic Physician',
  CARE_TEAM = 'Care team',
  FACILITY_ADMIN = 'Facility Admin',
}
