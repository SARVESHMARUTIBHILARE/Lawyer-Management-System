import { Client, LawyerProfile, LegalCase, Appointment, MessageThread } from '../types/dashboard';

export interface DetailedLawyerAccount extends LawyerProfile {
  id: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  city: string;
  state: string;
  experienceYears: number;
  qualification: string;
  languages: string[];
  availability: string;
  rating: number;
  reviewCount: number;
  totalCases: number;
  totalClients: number;
  accountStatus: 'Active' | 'On Leave' | 'Trial Counsel';
  demoPassword: string;
}

export interface DetailedClientAccount extends Client {
  gender: 'Male' | 'Female' | 'Non-Binary';
  city: string;
  state: string;
  dateOfBirth: string;
  demoPassword: string;
}

export const SPECIALIZATIONS_LIST = [
  'Criminal Law',
  'Civil Law',
  'Family Law',
  'Corporate Law',
  'Property Law',
  'Cyber Law',
  'Constitutional Law',
  'Consumer Law',
  'Tax Law',
  'Labour Law',
  'Intellectual Property Law',
  'Banking Law',
  'Immigration Law',
  'Real Estate Law',
  'Employment Law'
];

// 50 REALISTIC LAWYERS
export const FIFTY_LAWYERS: DetailedLawyerAccount[] = [
  {
    id: 'law-1',
    name: 'Sarah Vance, Esq.',
    title: 'Lead Counsel & Senior Litigation Partner',
    gender: 'Female',
    city: 'New York',
    state: 'NY',
    barNumber: 'NY-BAR #4982103',
    experienceYears: 16,
    specialization: ['Corporate Law', 'Intellectual Property Law', 'Civil Law'],
    qualification: 'J.D., Columbia Law School (Magna Cum Laude)',
    languages: ['English', 'French'],
    firmName: 'Vance & Sterling LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
    email: 's.vance@vancelawpartners.com',
    phone: '+1 (212) 555-0198',
    officeAddress: '30 Rockefeller Plaza, Suite 4400, New York, NY 10112',
    hourlyRate: 650,
    bio: 'Lead counsel specializing in high-stakes corporate mergers, trade-secret litigation, and complex federal civil defense.',
    availability: 'Accepting New Matters',
    rating: 4.9,
    reviewCount: 84,
    totalCases: 68,
    totalClients: 42,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-2',
    name: 'Marcus Sterling, Esq.',
    title: 'Senior Partner, Complex Trial Practice',
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    barNumber: 'NY-BAR #3819024',
    experienceYears: 22,
    specialization: ['Criminal Law', 'Constitutional Law'],
    qualification: 'LL.M., Harvard Law School; J.D., NYU School of Law',
    languages: ['English'],
    firmName: 'JurisPulse Legal Partners LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'm.sterling@jurispulselegal.com',
    phone: '+1 (212) 555-0182',
    officeAddress: 'Suite 4400, 350 5th Avenue, New York, NY 10118',
    hourlyRate: 850,
    bio: 'Veteran trial attorney with over 22 years of courtroom experience in federal civil trials and defense dockets.',
    availability: 'This Week',
    rating: 4.9,
    reviewCount: 96,
    totalCases: 94,
    totalClients: 58,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-3',
    name: 'Elena Rostova, Esq.',
    title: 'Partner, Intellectual Property & Tech Defense',
    gender: 'Female',
    city: 'San Francisco',
    state: 'CA',
    barNumber: 'CA-BAR #4928104',
    experienceYears: 14,
    specialization: ['Intellectual Property Law', 'Cyber Law'],
    qualification: 'J.D., Stanford Law School (Order of the Coif)',
    languages: ['English', 'Russian'],
    firmName: 'JurisPulse Tech Chambers',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'e.rostova@jurispulselegal.com',
    phone: '+1 (415) 555-0194',
    officeAddress: 'Floor 18, 555 California St, San Francisco, CA 94104',
    hourlyRate: 720,
    bio: 'Lead IP counsel advising tier-1 tech founders and enterprises on patent defense, copyright, and AI licensing disputes.',
    availability: 'Next Day',
    rating: 4.8,
    reviewCount: 62,
    totalCases: 51,
    totalClients: 36,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-4',
    name: 'David Kim, Esq.',
    title: 'Managing Partner, Banking & Cross-Border M&A',
    gender: 'Male',
    city: 'Chicago',
    state: 'IL',
    barNumber: 'IL-BAR #7104928',
    experienceYears: 18,
    specialization: ['Banking Law', 'Corporate Law', 'Tax Law'],
    qualification: 'J.D., University of Chicago Law School',
    languages: ['English', 'Korean'],
    firmName: 'JurisPulse MidWest LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'd.kim@jurispulselegal.com',
    phone: '+1 (312) 555-0145',
    officeAddress: 'Wacker Drive, Suite 2900, Chicago, IL 60606',
    hourlyRate: 790,
    bio: 'Cross-border transactional specialist orchestrating over $4.2B in institutional acquisitions and banking regulatory approvals.',
    availability: 'Accepting New Matters',
    rating: 4.9,
    reviewCount: 78,
    totalCases: 82,
    totalClients: 49,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-5',
    name: 'Ananya Sharma, Adv.',
    title: 'Senior Counsel, Cyber & Privacy Jurisprudence',
    gender: 'Female',
    city: 'Mumbai',
    state: 'MH',
    barNumber: 'BCI-MH #892011',
    experienceYears: 12,
    specialization: ['Cyber Law', 'Intellectual Property Law', 'Consumer Law'],
    qualification: 'LL.M., National Law School of India University (NLSIU)',
    languages: ['English', 'Hindi', 'Marathi'],
    firmName: 'Sharma & Associates Advocates',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'ananya.sharma@sharmalegal.in',
    phone: '+91 98201 55921',
    officeAddress: 'Nariman Point, Marine Drive, Mumbai 400021',
    hourlyRate: 500,
    bio: 'Pioneering technology lawyer handling cross-border data protection, cyber fraud litigation, and digital compliance.',
    availability: 'Immediate',
    rating: 4.8,
    reviewCount: 45,
    totalCases: 43,
    totalClients: 31,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-6',
    name: 'Rajesh Verma, Adv.',
    title: 'Principal Counsel, Real Estate & Property Law',
    gender: 'Male',
    city: 'New Delhi',
    state: 'DL',
    barNumber: 'DHC-BAR #412093',
    experienceYears: 24,
    specialization: ['Real Estate Law', 'Property Law', 'Civil Law'],
    qualification: 'LL.B., Faculty of Law, University of Delhi',
    languages: ['English', 'Hindi', 'Punjabi'],
    firmName: 'Verma Legal Chambers',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'rajesh.verma@vermachambers.com',
    phone: '+91 98110 44920',
    officeAddress: 'Barakhamba Road, Connaught Place, New Delhi 110001',
    hourlyRate: 600,
    bio: 'Practicing before the Delhi High Court and Supreme Court in commercial property disputes, land acquisition, and title deeds.',
    availability: 'This Week',
    rating: 4.9,
    reviewCount: 110,
    totalCases: 145,
    totalClients: 88,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-7',
    name: 'Carlos Mendoza, Esq.',
    title: 'Trial Advocate, Criminal Defense & Constitutional Rights',
    gender: 'Male',
    city: 'Miami',
    state: 'FL',
    barNumber: 'FL-BAR #602918',
    experienceYears: 15,
    specialization: ['Criminal Law', 'Constitutional Law'],
    qualification: 'J.D., University of Florida Levin College of Law',
    languages: ['English', 'Spanish'],
    firmName: 'Mendoza Criminal Defense PA',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'c.mendoza@mendozadefense.com',
    phone: '+1 (305) 555-0144',
    officeAddress: 'Brickell Avenue, Suite 1500, Miami, FL 33131',
    hourlyRate: 580,
    bio: 'Dedicated defender of individual liberties with over 35 felony trial acquittals and appellate constitutional petitions.',
    availability: 'Immediate',
    rating: 4.9,
    reviewCount: 72,
    totalCases: 76,
    totalClients: 52,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-8',
    name: 'Priyanka Sen, Adv.',
    title: 'Partner, Labour & Industrial Employment Law',
    gender: 'Female',
    city: 'Bengaluru',
    state: 'KA',
    barNumber: 'KAR-BAR #771290',
    experienceYears: 11,
    specialization: ['Labour Law', 'Employment Law'],
    qualification: 'LL.M., National Law School of India University',
    languages: ['English', 'Hindi', 'Kannada', 'Bengali'],
    firmName: 'Sen & Partners Industrial Law',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'priyanka.sen@senindustrial.com',
    phone: '+91 99001 22819',
    officeAddress: 'MG Road, Trinity Circle, Bengaluru 560001',
    hourlyRate: 450,
    bio: 'Specialist in collective bargaining, corporate executive contracts, POSH inquiry boards, and tribunal representations.',
    availability: 'Accepting New Matters',
    rating: 4.7,
    reviewCount: 39,
    totalCases: 38,
    totalClients: 29,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-9',
    name: 'Julian Hayes, Esq.',
    title: 'Senior Partner, Tax Planning & Federal Audit Appeals',
    gender: 'Male',
    city: 'Boston',
    state: 'MA',
    barNumber: 'MA-BAR #883910',
    experienceYears: 20,
    specialization: ['Tax Law', 'Corporate Law'],
    qualification: 'LL.M. in Taxation, Boston University; J.D., Harvard',
    languages: ['English'],
    firmName: 'Hayes Tax & Wealth LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'j.hayes@hayestaxlaw.com',
    phone: '+1 (617) 555-0189',
    officeAddress: 'State Street Financial Center, Boston, MA 02109',
    hourlyRate: 750,
    bio: 'Specialized counsel in IRS audit defense, corporate cross-border transfer pricing, and generational estate preservation.',
    availability: 'Next Day',
    rating: 4.8,
    reviewCount: 54,
    totalCases: 64,
    totalClients: 44,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  {
    id: 'law-10',
    name: 'Fatima Al-Mansoor, Esq.',
    title: 'Counsel, Immigration & Global Mobility',
    gender: 'Female',
    city: 'Washington',
    state: 'DC',
    barNumber: 'DC-BAR #559102',
    experienceYears: 13,
    specialization: ['Immigration Law', 'Civil Law'],
    qualification: 'J.D., Georgetown University Law Center',
    languages: ['English', 'Arabic', 'Spanish'],
    firmName: 'Al-Mansoor Global Legal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
    email: 'f.almansoor@globalimmigrate.com',
    phone: '+1 (202) 555-0112',
    officeAddress: 'K Street NW, Washington, DC 20006',
    hourlyRate: 520,
    bio: 'Guiding multinational corporations, research scientists, and diplomatic personnel on EB-1, H-1B, and investor visas.',
    availability: 'Immediate',
    rating: 4.9,
    reviewCount: 88,
    totalCases: 95,
    totalClients: 67,
    accountStatus: 'Active',
    demoPassword: 'lawyer123'
  },
  // Adding remaining 40 lawyers dynamically with realistic, verified attributes
  ...Array.from({ length: 40 }, (_, idx) => {
    const num = idx + 11;
    const names = [
      'Alexander Wright', 'Meera Patel', 'Jonathan Vance', 'Deepak Joshi',
      'Camila Rodriguez', 'Nathaniel Reed', 'Sunita Rao', 'Benjamin Scott',
      'Ayesha Siddiqui', 'Lucas Bernard', 'Tanvi Deshmukh', 'Oliver Bennett',
      'Rohan Malhotra', 'Sophia Martinez', 'Arjun Nambiar', 'Clara Dupont',
      'Vikram Singhania', 'Grace O\'Connor', 'Karan Mehta', 'Isabella Morales',
      'Harish Iyer', 'Ethan Sullivan', 'Neha Kulkarni', 'Dominic Zhang',
      'Pooja Nair', 'Zachary Taylor', 'Kavita Bansal', 'Christian Mueller',
      'Aditi Sen', 'Gabriel Ross', 'Swati Bhat', 'Liam Gallagher',
      'Manish Tiwari', 'Mia Anderson', 'Siddharth Roy', 'Amelia Evans',
      'Tarun Kapoor', 'Chloe Dubois', 'Vivek Chawla', 'Hannah Murphy'
    ];
    const cities = [
      { city: 'New York', state: 'NY' }, { city: 'San Francisco', state: 'CA' },
      { city: 'Mumbai', state: 'MH' }, { city: 'New Delhi', state: 'DL' },
      { city: 'Chicago', state: 'IL' }, { city: 'Austin', state: 'TX' },
      { city: 'Bengaluru', state: 'KA' }, { city: 'London', state: 'UK' },
      { city: 'Boston', state: 'MA' }, { city: 'Seattle', state: 'WA' }
    ];
    const spec = SPECIALIZATIONS_LIST[idx % SPECIALIZATIONS_LIST.length];
    const spec2 = SPECIALIZATIONS_LIST[(idx + 4) % SPECIALIZATIONS_LIST.length];
    const loc = cities[idx % cities.length];
    const name = names[idx % names.length];
    const isFemale = idx % 2 === 0;
    const gender: 'Male' | 'Female' = isFemale ? 'Female' : 'Male';
    const emailPrefix = name.toLowerCase().replace(/['\s]+/g, '.');
    const femaleAvatars = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
    ];
    const maleAvatars = [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256'
    ];
    const avatar = isFemale
      ? femaleAvatars[idx % femaleAvatars.length]
      : maleAvatars[idx % maleAvatars.length];

    const exp = 6 + (idx % 22);
    const rate = 350 + (idx % 12) * 45;

    return {
      id: `law-${num}`,
      name: `${name}, Esq.`,
      title: `Senior Counsel, ${spec}`,
      gender,
      city: loc.city,
      state: loc.state,
      barNumber: `${loc.state}-BAR #${300000 + num * 1234}`,
      experienceYears: exp,
      specialization: [spec, spec2],
      qualification: exp > 15 ? 'LL.M., Senior Bar Honors' : 'J.D., Trial Honors',
      languages: ['English', idx % 3 === 0 ? 'Spanish' : idx % 2 === 0 ? 'Hindi' : 'French'],
      firmName: 'JurisPulse Legal Practice Group',
      avatarUrl: avatar,
      email: `${emailPrefix}@jurispulse.legal`,
      phone: `+1 (${200 + (num % 800)}) 555-01${num < 10 ? '0' + num : num}`,
      officeAddress: `Chambers Suite ${100 + num * 10}, ${loc.city}, ${loc.state}`,
      hourlyRate: rate,
      bio: `Practicing legal counsel specializing in ${spec} and ${spec2} with over ${exp} years of contested trial litigation experience.`,
      availability: idx % 3 === 0 ? 'Immediate' : idx % 2 === 0 ? 'This Week' : 'Accepting New Matters',
      rating: +(4.6 + (idx % 5) * 0.08).toFixed(1),
      reviewCount: 20 + num * 2,
      totalCases: 25 + num * 2,
      totalClients: 15 + num,
      accountStatus: (idx === 12 ? 'On Leave' : 'Active') as 'Active' | 'On Leave' | 'Trial Counsel',
      demoPassword: 'lawyer123'
    };
  })
];

// 50 REALISTIC CLIENTS
export const FIFTY_CLIENTS: DetailedClientAccount[] = [
  {
    id: 'cli-1',
    name: 'Arthur Pendelton',
    email: 'a.pendelton@apexglobal.com',
    phone: '+1 (212) 432-8819',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    dateOfBirth: '1974-06-12',
    address: 'One Financial Center, 38th Floor, New York, NY 10005',
    company: 'Apex Global Industries',
    caseType: 'Corporate Law',
    status: 'Active',
    totalMatters: 3,
    joinedDate: 'Jan 2024',
    retainerBalance: 45000,
    billingRate: 650,
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    preferredChannel: 'Secure Portal',
    notes: 'Chief Legal Officer. Retainer replenished quarterly; active in Delaware Chancery Court and SDNY cross-border asset dispute.',
    emergencyContact: 'Eleanor Vance (Legal Desk) - +1 (212) 432-8800',
    taxOrEntityId: 'EIN #13-9847291',
    demoPassword: 'client123'
  },
  {
    id: 'cli-2',
    name: 'Dr. Helena Rostova',
    email: 'h.rostova@bioventurelabs.org',
    phone: '+1 (415) 890-4321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    gender: 'Female',
    city: 'San Francisco',
    state: 'CA',
    dateOfBirth: '1981-11-24',
    address: '400 Mission Bay Blvd South, San Francisco, CA 94158',
    company: 'BioVenture Therapeutics Inc.',
    caseType: 'Intellectual Property Law',
    status: 'Active',
    totalMatters: 2,
    joinedDate: 'Mar 2025',
    retainerBalance: 32000,
    billingRate: 720,
    leadCounsel: 'Elena Rostova, Esq.',
    conflictStatus: 'Cleared',
    preferredChannel: 'Email',
    notes: 'Federal Circuit patent validity challenge regarding CRISPR delivery mechanism. Regular bi-weekly deposition prep.',
    emergencyContact: 'Dr. Sergei Rostova - +1 (415) 890-4399',
    taxOrEntityId: 'EIN #94-3329104',
    demoPassword: 'client123'
  },
  {
    id: 'cli-3',
    name: 'Marcus Sterling Jr.',
    email: 'm.sterling@sterlingestate.com',
    phone: '+1 (203) 771-0029',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    gender: 'Male',
    city: 'Greenwich',
    state: 'CT',
    dateOfBirth: '1985-03-08',
    address: '88 Round Hill Road, Greenwich, CT 06831',
    company: 'Sterling Family Holdings',
    caseType: 'Property Law',
    status: 'Active',
    totalMatters: 4,
    joinedDate: 'Nov 2023',
    retainerBalance: 60000,
    billingRate: 850,
    leadCounsel: 'Marcus Sterling, Esq.',
    conflictStatus: 'Cleared',
    preferredChannel: 'Encrypted Signal',
    notes: 'Irrevocable generation-skipping trust restructuring and private equity estate allocation advisory.',
    emergencyContact: 'Julian Sterling - +1 (203) 771-0010',
    taxOrEntityId: 'EIN #06-8923019',
    demoPassword: 'client123'
  },
  {
    id: 'cli-4',
    name: 'Claire Beauchamp',
    email: 'c.beauchamp@caldwelltech.io',
    phone: '+1 (646) 302-9988',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    gender: 'Female',
    city: 'New York',
    state: 'NY',
    dateOfBirth: '1988-09-17',
    address: '250 Hudson Street, Suite 800, New York, NY 10013',
    company: 'Caldwell Tech Holdings LLC',
    caseType: 'Employment Law',
    status: 'Active',
    totalMatters: 1,
    joinedDate: 'Aug 2026',
    retainerBalance: 18500,
    billingRate: 650,
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    preferredChannel: 'Secure Portal',
    notes: 'Executive severance, non-compete covenant challenge, and equity acceleration negotiations.',
    emergencyContact: 'Mark Beauchamp - +1 (646) 302-9900',
    taxOrEntityId: 'SSN #***-**-8192',
    demoPassword: 'client123'
  },
  {
    id: 'cli-5',
    name: 'Gregory Finch',
    email: 'greg.finch@finchlogistics.com',
    phone: '+1 (312) 809-5544',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    gender: 'Male',
    city: 'Chicago',
    state: 'IL',
    dateOfBirth: '1970-04-30',
    address: '440 South LaSalle St, Chicago, IL 60605',
    company: 'Finch Global Logistics Corp.',
    caseType: 'Civil Law',
    status: 'Active',
    totalMatters: 2,
    joinedDate: 'Feb 2024',
    retainerBalance: 24000,
    billingRate: 790,
    leadCounsel: 'David Kim, Esq.',
    conflictStatus: 'Cleared',
    preferredChannel: 'Email',
    notes: 'Multi-million interstate fleet breach of supply contract arbitration proceeding before the AAA.',
    emergencyContact: 'Karen Finch - +1 (312) 809-5500',
    taxOrEntityId: 'EIN #36-4491028',
    demoPassword: 'client123'
  },
  // Adding remaining 45 clients dynamically with realistic unique records
  ...Array.from({ length: 45 }, (_, idx) => {
    const num = idx + 6;
    const names = [
      'Vikramaditya Singhania', 'Nathalie Dupont', 'Kavita Krishnamurthy', 'Donald Harrison',
      'Farhan Akhtar', 'Emily Chen', 'Rajeshwari Iyer', 'Samuel Golding',
      'Sunil Gavaskar', 'Olivia Taylor', 'Bhavna Kulkarni', 'Christopher Walker',
      'Aakash Mehta', 'Jessica Alba-Jones', 'Harshita Agarwal', 'Matthew Perryman',
      'Siddharth Malhotra', 'Rachel Green', 'Tanvi Parekh', 'Daniel Craigson',
      'Meenakshi Sundaram', 'Andrew Lincoln', 'Divya Bharti', 'Jonathan Davis',
      'Ashok Leyland Rep', 'Rebecca Ferguson', 'Manoj Bajpayee', 'Kimberly Clark',
      'Deepika Padukone', 'Benjamin Franklin Jr', 'Alok Nath', 'Amanda Seyfried',
      'Karan Johar Group', 'Thomas Shelby', 'Shilpa Shetty Corp', 'Robert Downey',
      'Zoya Akhtar', 'William Shakespeare Ltd', 'Juhi Chawla', 'James Bond Rep',
      'Ravi Shastri', 'Catherine Zeta', 'Sunil Shetty', 'Laura Croft', 'Naveen Jindal'
    ];
    const cities = [
      { city: 'New York', state: 'NY' }, { city: 'Mumbai', state: 'MH' },
      { city: 'San Francisco', state: 'CA' }, { city: 'New Delhi', state: 'DL' },
      { city: 'Chicago', state: 'IL' }, { city: 'Boston', state: 'MA' },
      { city: 'Bengaluru', state: 'KA' }, { city: 'Miami', state: 'FL' },
      { city: 'Seattle', state: 'WA' }, { city: 'Austin', state: 'TX' }
    ];
    const caseTypes = SPECIALIZATIONS_LIST;
    const name = names[idx % names.length];
    const loc = cities[idx % cities.length];
    const isFemale = idx % 2 === 1;
    const gender: 'Male' | 'Female' = isFemale ? 'Female' : 'Male';
    const email = `${name.toLowerCase().replace(/['\s]+/g, '.')}@${idx % 2 === 0 ? 'enterprise' : 'corp'}.com`;
    const femaleAvatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    ];
    const maleAvatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
    ];
    const avatar = isFemale
      ? femaleAvatars[idx % femaleAvatars.length]
      : maleAvatars[idx % maleAvatars.length];

    const caseType = caseTypes[idx % caseTypes.length];
    const status: 'Active' | 'Prospective' | 'Closed' =
      idx % 6 === 0 ? 'Prospective' : idx % 11 === 0 ? 'Closed' : 'Active';

    return {
      id: `cli-${num}`,
      name,
      email,
      phone: `+1 (${300 + (num % 600)}) 456-78${num < 10 ? '0' + num : num}`,
      avatar,
      gender,
      city: loc.city,
      state: loc.state,
      dateOfBirth: `198${(num % 9)}-0${(num % 9) + 1}-1${(num % 8) + 1}`,
      address: `${100 + num * 14} Commercial Blvd, Suite ${num * 5}, ${loc.city}, ${loc.state}`,
      company: `${name.split(' ')[0]} Ventures & Co.`,
      caseType,
      status,
      totalMatters: (num % 4) + 1,
      joinedDate: `${['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'][num % 6]} 202${(num % 3) + 4}`,
      retainerBalance: 15000 + (num % 25) * 2000,
      billingRate: 500 + (num % 8) * 50,
      leadCounsel: FIFTY_LAWYERS[idx % FIFTY_LAWYERS.length].name,
      conflictStatus: 'Cleared' as const,
      preferredChannel: (idx % 3 === 0 ? 'Secure Portal' : idx % 2 === 0 ? 'Email' : 'Phone') as 'Secure Portal' | 'Email' | 'Phone' | 'Encrypted Signal',
      notes: `Registered corporate client for ${caseType} ongoing legal advisory and transactional docket representation.`,
      emergencyContact: `Security Desk - +1 (800) 555-01${num}`,
      taxOrEntityId: `ID #${400000 + num * 881}`,
      demoPassword: 'client123'
    };
  })
];

// REALISTIC INTERLINKED SAMPLE CASES FOR DEMO
export const SAMPLE_CASES: LegalCase[] = [
  {
    id: '#CAS-2026-885',
    title: 'Apex Global Industries vs. Federal Trade Commission',
    clientName: 'Arthur Pendelton',
    caseType: 'Corporate Law',
    caseStatus: 'Active',
    lastUpdated: 'Sep 22, 2026',
    courtJurisdiction: 'U.S. District Court (S.D.N.Y.)',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Oct 14, 2026'
  },
  {
    id: '#CAS-2026-914',
    title: 'BioVenture Therapeutics vs. Genomix Labs Patent Dispute',
    clientName: 'Dr. Helena Rostova',
    caseType: 'Intellectual Property Law',
    caseStatus: 'Discovery',
    lastUpdated: 'Sep 21, 2026',
    courtJurisdiction: 'U.S. Court of Appeals for the Federal Circuit',
    leadCounsel: 'Elena Rostova, Esq.',
    hearingDate: 'Nov 03, 2026'
  },
  {
    id: '#CAS-2026-783',
    title: 'In re Sterling Dynasty Trust Accounting',
    clientName: 'Marcus Sterling Jr.',
    caseType: 'Property Law',
    caseStatus: 'In Review',
    lastUpdated: 'Sep 19, 2026',
    courtJurisdiction: 'New York Surrogate Court',
    leadCounsel: 'Marcus Sterling, Esq.',
    hearingDate: 'Oct 28, 2026'
  },
  {
    id: '#CAS-2026-938',
    title: 'Beauchamp vs. Caldwell Tech Holdings Restrictive Covenant',
    clientName: 'Claire Beauchamp',
    caseType: 'Employment Law',
    caseStatus: 'Pre-Trial',
    lastUpdated: 'Sep 18, 2026',
    courtJurisdiction: 'Delaware Court of Chancery',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Nov 17, 2026'
  },
  {
    id: '#CAS-2026-664',
    title: 'Finch Logistics Fleet Modernization Breach Arbitration',
    clientName: 'Gregory Finch',
    caseType: 'Civil Law',
    caseStatus: 'Active',
    lastUpdated: 'Sep 16, 2026',
    courtJurisdiction: 'American Arbitration Association',
    leadCounsel: 'David Kim, Esq.',
    hearingDate: 'Oct 20, 2026'
  },
  {
    id: '#CAS-2026-522',
    title: 'Singhania Shipping Port Concession Licensing Review',
    clientName: 'Vikramaditya Singhania',
    caseType: 'Banking Law',
    caseStatus: 'Active',
    lastUpdated: 'Sep 23, 2026',
    courtJurisdiction: 'High Court of Judicature at Bombay',
    leadCounsel: 'Ananya Sharma, Adv.',
    hearingDate: 'Nov 25, 2026'
  },
  {
    id: '#CAS-2026-450',
    title: 'Krishnamurthy Cyber Data Breach & Consumer Privacy Action',
    clientName: 'Kavita Krishnamurthy',
    caseType: 'Cyber Law',
    caseStatus: 'Discovery',
    lastUpdated: 'Sep 20, 2026',
    courtJurisdiction: 'National Consumer Disputes Redressal Commission',
    leadCounsel: 'Rajesh Verma, Adv.',
    hearingDate: 'Dec 02, 2026'
  }
];

// REALISTIC INTERLINKED SAMPLE APPOINTMENTS
export const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-50-1',
    clientName: 'Arthur Pendelton',
    clientEmail: 'a.pendelton@apexglobal.com',
    clientPhone: '+1 (212) 432-8819',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '09:30 AM',
    caseType: 'Corporate Law',
    caseId: '#CAS-2026-885',
    appointmentType: 'In-person Consultation',
    status: 'Confirmed',
    duration: '45 mins',
    roomOrLink: 'Chambers Boardroom A',
    notes: 'Review amended asset acquisition schedules and FTC regulatory disclosure waivers.'
  },
  {
    id: 'apt-50-2',
    clientName: 'Dr. Helena Rostova',
    clientEmail: 'h.rostova@bioventurelabs.org',
    clientPhone: '+1 (415) 890-4321',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '11:15 AM',
    caseType: 'Intellectual Property Law',
    caseId: '#CAS-2026-914',
    appointmentType: 'Video Consultation',
    status: 'Pending',
    duration: '60 mins',
    roomOrLink: 'https://jurispulse.legal/meet/rostova-pat',
    notes: 'Review claim construction brief and prior art citations before pre-trial Markman hearing.'
  },
  {
    id: 'apt-50-3',
    clientName: 'Marcus Sterling Jr.',
    clientEmail: 'm.sterling@sterlingestate.com',
    clientPhone: '+1 (203) 771-0029',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '02:00 PM',
    caseType: 'Property Law',
    caseId: '#CAS-2026-783',
    appointmentType: 'In-person Consultation',
    status: 'Confirmed',
    duration: '30 mins',
    roomOrLink: 'Executive Suite 12',
    notes: 'Sign notarized irrevocable generation-skipping trust documents and distribution schedules.'
  },
  {
    id: 'apt-50-4',
    clientName: 'Claire Beauchamp',
    clientEmail: 'c.beauchamp@caldwelltech.io',
    clientPhone: '+1 (646) 302-9988',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    date: 'Tomorrow',
    time: '10:00 AM',
    caseType: 'Employment Law',
    caseId: '#CAS-2026-938',
    appointmentType: 'Settlement Conference',
    status: 'Confirmed',
    duration: '60 mins',
    roomOrLink: 'Conference Room 4B',
    notes: 'Pre-hearing caucus with former employer counsel regarding equity vesting acceleration.'
  },
  {
    id: 'apt-50-5',
    clientName: 'Vikramaditya Singhania',
    clientEmail: 'vikramaditya.singhania@enterprise.com',
    clientPhone: '+1 (306) 456-7806',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: 'Sep 26, 2026',
    time: '03:30 PM',
    caseType: 'Banking Law',
    caseId: '#CAS-2026-522',
    appointmentType: 'Video Consultation',
    status: 'Confirmed',
    duration: '45 mins',
    roomOrLink: 'https://jurispulse.legal/meet/singhania-concession',
    notes: 'Port expansion concession credit guarantees review with institutional banking consortium.'
  }
];

// REALISTIC SAMPLE MESSAGE THREADS FOR CLIENT-LAWYER MESSAGING DEMO
export const SAMPLE_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'thread-demo-1',
    clientId: 'cli-1',
    clientName: 'Arthur Pendelton',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    company: 'Apex Global Industries',
    caseId: '#CAS-2026-885',
    caseType: 'Corporate Law',
    lastMessage: 'I have uploaded the amended asset schedule exhibits for your Markman review.',
    lastTimestamp: '10:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-demo-1',
        sender: 'client',
        text: 'Good morning Counselor Vance, did the court accept our expedited filing yesterday?',
        timestamp: 'Yesterday, 04:30 PM',
        read: true
      },
      {
        id: 'msg-demo-2',
        sender: 'lawyer',
        text: 'Yes Arthur, the Southern District docket accepted our motion under seal. Hearing is set for October 14.',
        timestamp: 'Yesterday, 05:15 PM',
        read: true
      },
      {
        id: 'msg-demo-3',
        sender: 'client',
        text: 'I have uploaded the amended asset schedule exhibits for your Markman review.',
        timestamp: 'Today, 10:45 AM',
        read: false
      }
    ]
  },
  {
    id: 'thread-demo-2',
    clientId: 'cli-2',
    clientName: 'Dr. Helena Rostova',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    company: 'BioVenture Therapeutics Inc.',
    caseId: '#CAS-2026-914',
    caseType: 'Intellectual Property Law',
    lastMessage: 'Let us connect on Zoom 15 minutes before the deposition starts.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-demo-4',
        sender: 'client',
        text: 'Counsel, the opposing expert witness submitted 400 pages of rebuttal citations.',
        timestamp: 'Sep 20, 02:10 PM',
        read: true
      },
      {
        id: 'msg-demo-5',
        sender: 'lawyer',
        text: 'Do not worry Helena. Our patent engineering team has already invalidated claims 14 through 28 based on prior art.',
        timestamp: 'Sep 20, 03:22 PM',
        read: true
      },
      {
        id: 'msg-demo-6',
        sender: 'client',
        text: 'Let us connect on Zoom 15 minutes before the deposition starts.',
        timestamp: 'Yesterday, 09:12 AM',
        read: true
      }
    ]
  },
  {
    id: 'thread-demo-3',
    clientId: 'cli-4',
    clientName: 'Claire Beauchamp',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    company: 'Caldwell Tech Holdings LLC',
    caseId: '#CAS-2026-938',
    caseType: 'Employment Law',
    lastMessage: 'Is the draft non-compete settlement proposal ready for my signature?',
    lastTimestamp: 'Sep 21',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-demo-7',
        sender: 'client',
        text: 'Is the draft non-compete settlement proposal ready for my signature?',
        timestamp: 'Sep 21, 11:05 AM',
        read: false
      }
    ]
  }
];
