import copy from './prepared-content.json';
import {
  HeartHandshake,
  Heart,
  CookingPot,
  House,
  Pill,
  Accessibility,
  UserRound,
  Car,
} from 'lucide-react';

export { contact, areas } from './business';
export const services = copy.home.services.map(([title, description], i) => ({
  id: [
    'personal-care',
    'companion-care',
    'meal-preparation',
    'home-help',
    'medication-reminders',
    'mobility-support',
  ][i],
  title,
  description,
  icon: [HeartHandshake, Heart, CookingPot, House, Pill, Accessibility][i],
}));
// Detailed service groups from the supplied In-Home Care page reference.
export const inHomeCareServices = [
  {
    id: 'personal-care',
    title: 'Personal Care',
    icon: UserRound,
    aliases: [],
    details: [
      'Bathing, toileting, dressing',
      'Personal hygiene',
      'Routine skin care',
      'Transfers and mobility help',
      'Personal comfort and dignity',
    ],
  },
  {
    id: 'home-help',
    title: 'Home Helper Services',
    icon: House,
    aliases: ['meal-preparation'],
    details: [
      'Light housekeeping',
      'Laundry and ironing',
      'Plan and prepare meals',
      'Monitor diet and eating',
      'Care for houseplants',
      'Organize and clean closets',
      'Assist with pet care',
    ],
  },
  {
    id: 'activity-support',
    title: 'Activity Support',
    icon: Car,
    aliases: [],
    details: [
      'Arrange appointments',
      'Assist with entertaining',
      'Medical appointment trips',
      'Errands and shopping',
      'Trip to social events',
      'Physical therapy exercise assistance',
    ],
  },
  {
    id: 'health-safety-support',
    title: 'Health & Safety Support',
    icon: Pill,
    aliases: ['medication-reminders', 'mobility-support', 'companion-care'],
    details: [
      'Medication reminders',
      'Help with daily routines',
      'Monitor diet and nutrition',
      'Fall prevention',
      'Mobility assistance',
      'Companionship and supervision',
    ],
  },
];
