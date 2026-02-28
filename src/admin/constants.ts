export const ADMIN_EMAILS = ['support@exactawebsolution.com'];

export const ENQUIRY_STATUS_OPTIONS = ['new', 'contacted', 'closed'] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUS_OPTIONS)[number];
