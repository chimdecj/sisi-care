import { HeartHandshake, Heart, CookingPot, House, Pill, Accessibility } from 'lucide-react';

export const contact = {
  phone: '(206) 334-3505', tel: '+12063343505', email: 'info@sisicares.com',
  address: '11522 84th Ave NE', city: 'Kirkland, WA 98034',
  maps: 'https://www.google.com/maps/search/?api=1&query=11522+84th+Ave+NE+Kirkland+WA+98034',
};
export const services = [
  { id: 'personal-care', title: 'Personal care', description: 'A helping hand with daily routines, always with dignity and respect.', icon: HeartHandshake, details: ['Bathing, dressing & personal hygiene', 'Routine skin care', 'Toileting assistance', 'Personal comfort and dignity'] },
  { id: 'companion-care', title: 'Companion care', description: 'Good conversation, shared moments, and a familiar face to brighten the day.', icon: Heart, details: ['Conversation and companionship', 'Favorite hobbies and activities', 'Social outings and appointments', 'Respite for family caregivers'] },
  { id: 'meal-preparation', title: 'Meal preparation', description: 'Thoughtful, nourishing meals that suit individual tastes and routines.', icon: CookingPot, details: ['Meal planning and preparation', 'Grocery shopping and errands', 'Support with eating', 'Help following dietary preferences'] },
  { id: 'home-help', title: 'Help around home', description: 'A clean, comfortable space that keeps home feeling like home.', icon: House, details: ['Light housekeeping', 'Laundry and ironing', 'Organizing everyday spaces', 'Help with plants and pets'] },
  { id: 'medication-reminders', title: 'Medication reminders', description: 'Gentle reminders and everyday support for a reassuring routine.', icon: Pill, details: ['Non-medical medication reminders', 'Support with daily routines', 'Appointment reminders', 'Companionship and supervision'] },
  { id: 'mobility-support', title: 'Mobility support', description: 'Patient assistance to move through the day with more confidence.', icon: Accessibility, details: ['Walking and transfer assistance', 'Support getting around the home', 'Help attending appointments', 'Assistance with everyday activities'] },
];
export const testimonials = [
  { quote: 'Tsegi gave loving, attentive and professional care to my parents for over ten years. She attended to their every need graciously and happily.', name: 'Robert H. Campbell', context: 'A letter from a grateful family', initials: 'RC' },
  { quote: 'You made our lives happier and easier because we trusted your care of Hugh so completely.', name: 'Susan', context: 'The Mann & Metter families', initials: 'S' },
  { quote: 'Amy and Mina cared for both our parents until their end of life and they were so incredibly caring and patient.', name: 'Nancy Thomas Uhrich', context: 'The Thomas family', initials: 'NT' },
];
export const areas = ['Bellevue', 'Kirkland', 'Redmond', 'Sammamish', 'Issaquah'];
