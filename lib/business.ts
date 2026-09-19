// Public business details shared by visible content and search metadata.
export const contact = {
  phone: '(206) 334-3505',
  tel: '+12063343505',
  email: 'info@sisicarewa.com',
  address: '11522 84th Ave NE',
  city: 'Kirkland, WA 98034',
  maps: 'https://www.google.com/maps/search/?api=1&query=11522+84th+Ave+NE+Kirkland+WA+98034',
};
export const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: contact.address,
  addressLocality: 'Kirkland',
  addressRegion: 'WA',
  postalCode: '98034',
  addressCountry: 'US',
};
export const areas = ['Bellevue', 'Kirkland', 'Redmond', 'Sammamish', 'Issaquah'];
