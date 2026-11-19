// Portfolio data ported from D:\Zachrie\Portfolio

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  role: string;
  bio: string;
  socials: SocialLink[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  location: string;
  desc: string[];
}

export interface Education {
  school: string;
  degree: string;
  duration: string;
}

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  category: string;
  unlocked: boolean;
  date: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  badge: string;
  color: string;
  description: string;
  command: string;
}

export const profileData: ProfileData = {
  name: 'Zachrie Kurniawan',
  role: 'Web Developer & Tech Enthusiast',
  bio: 'An ordinary person with an extraordinary passion for technology, especially in building intuitive and functional web applications.',
  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com/zachriek',
      icon: 'github',
    },
  ],
};

export const educationsData: Education[] = [
  {
    school: 'University of Lampung',
    degree: "Bachelor's degree, Informatics Engineering",
    duration: 'August 2023 - Present',
  },
  {
    school: 'SMK Negeri 1 Bandar Lampung',
    degree: 'Multimedia',
    duration: 'July 2020 - July 2023',
  },
];

export const experiencesData: Experience[] = [
  {
    role: 'Frontend Intern',
    company: 'Core Initiative Studio x Rakamin',
    duration: 'January 2024 - February 2024',
    location: 'Remote',
    desc: [
      'Built a responsive e-commerce UI using Vue.js, focusing on intuitive product listing.',
      'Designed clean layouts with thoughtful color schemes and visual elements.',
      'Improved user experience by optimizing navigation and overall UI appeal.',
    ],
  },
  {
    role: 'Fullstack Intern',
    company: 'Qwords Cloud Web Hosting',
    duration: 'November 2023 - December 2023',
    location: 'Remote',
    desc: [
      'Optimized website frontend using HTML5, CSS, and JavaScript for responsive design.',
      'Redesigned the Qwords website using Laravel to improve functionality and appeal.',
      'Contributed to planning, developing, and implementing new website features.',
    ],
  },
];

export const achievementsData: Achievement[] = [
  {
    id: 1,
    title: 'Junior Web Developer Certification',
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    category: 'Certification',
    unlocked: true,
    date: 'Certified',
    description: 'Standarisasi kompetensi nasional untuk pengembangan aplikasi web front-end dan back-end profesional.',
  },
  {
    id: 2,
    title: 'Gold Medalist National Science Olympiad Mathematics',
    issuer: 'Prestasi Maju Indonesia',
    category: 'Competition',
    unlocked: true,
    date: 'National Level',
    description: 'Meraih medali emas pada olimpiade sains nasional bidang matematika tingkat pelajar/mahasiswa.',
  },
  {
    id: 3,
    title: '1st Place IT Competition (ITC-TI) 2023 Software Engineering',
    issuer: 'Institut Informatika dan Bisnis Darmajaya',
    category: 'Award',
    unlocked: true,
    date: 'Champion',
    description: 'Juara 1 kompetisi rekayasa perangkat lunak (software engineering) tingkat regional/nasional.',
  },
  {
    id: 4,
    title: '4th Place / Medallion for Excellence LKS Web Technologies National',
    issuer: 'Pusat Prestasi Nasional',
    category: 'National LKS',
    unlocked: true,
    date: 'Medallion',
    description: 'Medal of Excellence Lomba Kompetensi Siswa (LKS) Nasional bidang Web Technologies.',
  },
  {
    id: 5,
    title: 'Security & Penetration Testing Arsenal',
    issuer: 'Cybersecurity Lab',
    category: 'Specialization',
    unlocked: true,
    date: 'Active',
    description: 'Penguasaan tool pentest industri: Burp Suite, Nmap, Metasploit, Wireshark, dan SQLMap.',
  },
];

export const pentestToolsData: Tool[] = [
  {
    id: 'burpsuite',
    name: 'Burp Suite',
    category: 'Web Application Security',
    badge: 'Proxy & Scanner',
    color: '#ff793f',
    command: 'burpsuite',
    description: 'Platform standar industri untuk audit keamanan aplikasi web, proxy interceptor, scanner, dan fuzzing.',
  },
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'Network Reconnaissance',
    badge: 'Port Scanner',
    color: '#34ace0',
    command: 'nmap -sV -sC -T4 target.lab',
    description: 'Pemeriksaan port jaringan, pemetaan host aktif, dan deteksi versi layanan dengan Nmap Scripting Engine (NSE).',
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    category: 'Exploitation Framework',
    badge: 'Exploitation',
    color: '#ff5252',
    command: 'msfconsole -q',
    description: 'Framework penetration testing modular untuk verifikasi kerentanan keamanan dan pengujian payload Meterpreter.',
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    category: 'Packet Analysis & Forensics',
    badge: 'Packet Sniffer',
    color: '#2ed573',
    command: 'wireshark -i eth0 -k',
    description: 'Analisis protokol paket data secara real-time untuk digital forensik dan debugging jaringan mendalam.',
  },
  {
    id: 'sqlmap',
    name: 'SQLMap',
    category: 'Database Pentest',
    badge: 'SQL Injection',
    color: '#e056fd',
    command: 'sqlmap -u "target.lab/item.php?id=1" --dbs',
    description: 'Alat otomatisasi pendeteksian dan eksploitasi celah SQL Injection serta audit basis data.',
  },
  {
    id: 'john',
    name: 'John the Ripper',
    category: 'Password Security',
    badge: 'Hash Cracker',
    color: '#ffb142',
    command: 'john --wordlist=rockyou.txt hashes.txt',
    description: 'Audit kekuatan kata sandi dan analisis dekripsi cryptographic hash berbasis kamus dan brute-force.',
  },
  {
    id: 'owasp-zap',
    name: 'OWASP ZAP',
    category: 'Web Application Security',
    badge: 'DAST Scanner',
    color: '#00d2d3',
    command: 'zaproxy -cmd -quickurl https://target.lab',
    description: 'Dynamic Application Security Testing (DAST) scanner open-source dari OWASP untuk pengujian web.',
  },
  {
    id: 'aircrack',
    name: 'Aircrack-ng',
    category: 'Wireless Pentest',
    badge: 'WiFi Security',
    color: '#1dd1a1',
    command: 'aircrack-ng -w wordlist.txt capture.cap',
    description: 'Suite pengujian keamanan jaringan nirkabel 802.11, pemantauan paket, dan audit WPA/WPA2-PSK.',
  },
  {
    id: 'hydra',
    name: 'THC Hydra',
    category: 'Credential Assessment',
    badge: 'Brute-Forcer',
    color: '#ee5253',
    command: 'hydra -L users.txt -P pass.txt target ssh',
    description: 'Pengujian ketahanan otentikasi jaringan multi-protokol berkecepatan tinggi (SSH, HTTP, FTP, MySQL).',
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    category: 'Web & DNS Enumeration',
    badge: 'Directory Buster',
    color: '#10ac84',
    command: 'gobuster dir -u https://target.lab -w common.txt',
    description: 'Pencarian direktori tersembunyi, file backup, dan subdomain DNS berbasis konkurensi bahasa Go.',
  },
];
