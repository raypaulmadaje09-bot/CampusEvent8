
export type EventCategory = 'Academic' | 'Social' | 'Sports' | 'Workshops' | 'Career' | 'Arts' | 'Tech';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  organizer: string;
  attendees: number;
  image: string;
  isPopular?: boolean;
  isLive?: boolean;
  status: 'Approved' | 'Pending';
}

export type UserRole = 'MasterAdmin' | 'Admin' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  department?: string;
  canRequestEvents?: boolean; // Permission to suggest events
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  type: 'EVNT' | 'USER' | 'SYS' | 'AUTH' | 'CMS';
  details: string;
}

export interface FeedbackMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientId: string; // ID of the admin or 'All'
  subject: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
  replies: {
    sender: 'Admin' | 'Student';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface UserScheduleItem {
  eventId: string;
  reminderSet: boolean;
}
