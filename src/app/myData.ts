export const personalData = {
  intro: `👋 Hey there! I'm a Computer Engineering graduate from McMaster University. I also design and sell playing cards on Kickstarter.`,
  links: {
    '🦑 GitHub': 'https://github.com/felixha00',
    '👥 LinkedIn': 'https://www.linkedin.com/in/felixha00/',
    '🏬 FH5VE Webstore': 'https://fh5ve.com/',
  },
};

export const softwareProjects = [
  {
    title: 'Keybin',
    link: 'https://keybin.app',
    img: 'https://i.imgur.com/H5faLTG.png',
    date: '2023 - Present',
  },
  // {
  //   title: 'FH5VE Museum',
  //   link: 'https://museum.fh5ve.com/',
  //   img: 'https://i.imgur.com/gVlbsrW.png',
  //   date: '-',
  //   text: [
  //     `Maintaining a website used for archiving backers and decks produced by FH5VE Playing Cards`,
  //     `Built with Next.js + PostgreSQL, implementing Strapi as a content management system (CMS)`,
  //   ],
  //   tags: [
  //     'React (Typescript)',
  //     'Next.js',
  //     'Strapi (Content Management System)',
  //     'Heroku',
  //     'Vercel',
  //     'Frontend',
  //     'Backend',
  //   ],
  // },
  {
    title: 'IEEE McMaster Student Branch Website',
    link: 'https://www.ieeemcmaster.ca/',
    img: 'https://drive.google.com/uc?id=1x-yY9LaYGpqgYlAeBudcjEyYRTMXXy_g',
    date: '-',
    text: [],
    tags: [
      'React (JavaScript)',
      'Next.js',
      'Frontend',
      'Backend',
      'Netlify',
      'Google Calendar API',
    ],
  },
  {
    title: 'Showboat Music Displayer',
    img: 'https://i.imgur.com/NwKHKOC.png',
    date: '-',
    text: [],
    tags: ['React (Typescript)', 'ElectronJS', 'Frontend'],
  },
  {
    title: 'Kollabrise',
    link: 'https://kollabrise.web.app',
    img: 'https://i.imgur.com/NZUzNIj.png',
    date: '2020 - 2021',
    text: [
      `Building a webapp using ReactJS & Firebase that allows creators and businesses to collaborate with each other. `,

      `Utilizing ExpressJS and NodeJS to create a high-performing REST API with a middleware to prevent security exploits`,

      `Manually analyzing and testing the security, reliability, and usability of the app`,
      `Integrated the OAuth library to verify ownership of Instagram, Youtube and Twitch users.`,
      `Constructing attractive and user-friendly UI/UX components in TypeScript by inspecting other websites’ CSS and design styles.
`,
    ],
  },
  {
    title: 'RateMyLandlord',
    link: 'https://github.com/felixha00/rate-my-landlord-webapp',
    img:
      'https://images.pexels.com/photos/2157404/pexels-photo-2157404.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    date: '2019',
    text: [
      `🏅 Winner of 'Best Use of MongoDB'`,
      `A centralized webapp that allows students to review and check landlords that they've rented at. Made at Hack the Valley 4`,
    ],
  },
  {
    title: 'SocialSentiment',
    link: 'https://github.com/BilalShakh/Social-Sentiment',
    img:
      'https://blog-assets.hootsuite.com/wp-content/uploads/2019/04/sentiment-analysis-tools-1.png',
    date: '2019',
    text: [
      `🏅 Made at YHack 2019`,
      `A web-app made designed for the JetBlue challenge. 
     The challenge was to find out what the public thinks of JetBlue and come up with a hypothesis. 
     Uses Google Cloud's Natural Language API to analyze the sentiment from posts scraped on social media and displays the data in a bar graph, as well as the accompanying details.`,
    ],
  },
];

export const kickstarterStats = {
  'Total Raised': 'CAD$40,000+',
  Backers: '1000+',
  Projects: '2',
  'Products Sold': '3900+',
};
export const kickstarterProjects = [
  {
    link:
      'https://www.kickstarter.com/projects/felixha00/prescription-playing-cards',
    img:
      'https://ksr-ugc.imgix.net/assets/027/295/115/632d380c424cb1864dc7367ec94b9c5f_original.png?ixlib=rb-2.1.0&crop=faces&w=1552&h=873&fit=crop&v=1574351392&auto=format&frame=1&q=92&s=933556f07c971612d2adf24a28fdabcc',
    title: 'PRESCRIPTION Playing Cards',
    date: '2020',
    text: [
      `Raised over CA$30'000 from 730+ supporters in 30 days`,
      `Sold over 1800+ units from the Kickstarter alone`,
    ],
  },
  {
    link:
      'https://www.kickstarter.com/projects/felixha00/izo-playing-cards-cards-designed-for-cardists-and?ref=created_projects',
    img:
      'https://ksr-ugc.imgix.net/assets/016/073/434/ed225d7189f3d0c118ed731163f0552a_original.png?ixlib=rb-2.1.0&crop=faces&w=1024&h=576&fit=crop&v=1533749207&auto=format&frame=1&q=92&s=5397795cc4097b3d128e62973079c0b9',
    title: 'IZO Playing Cards',
    date: '2018',
    text: [
      `Raised nearly $10'000 from 340+ supporters in 30 days`,
      `Sold over 900+ units from the Kickstarter alone`,
    ],
  },
];

export const hardwareProjects = [
  {
    img:
      'https://cdn.discordapp.com/attachments/482051217736859648/806048517645926400/download_1.png',
    title: 'Hardware-Implemented Image Compression Project',
    date: '2020',
    text: [
      `
      Implemented an algorithm based on the JPEG standard to compress images in SystemVerilog with hardware.`,
      `Utilized SRAM modules to read & write image data that are converted into RGB via colorspace conversion.`,
      `Developed Dual-Port RAM modules to store and manage computed data taken from the SRAM modules. `,
      `Modified testbenches and used ModelSIM to verify the correctness of the outputted image. `,
    ],
  },
  {
    img: 'https://oceanservice.noaa.gov/facts/lidar-lynhaven.jpg',
    title: 'Time of Flight LIDAR System Prototype',
    date: '2020',
    link: 'https://github.com/felixha00/embedded-time-of-flight-mapper',
    text: [
      `Constructed a Light Detection and Ranging (LIDAR) prototype that maps out a room using a time of 
      flight sensor and a MSP432E401Y microcontroller programmed in C using Keil µVision IDE. `,
      `Documented the functionality and reasoning behind each design decision.`,
      `Implemented a method to process & visualize the data collected using Python’s Open3D library.`,
      `Designed and built a circuit on a breadboard with stop/start push buttons and status LEDs.`,
    ],
  },
  {
    img:
      'https://camo.githubusercontent.com/aa77d49d27ac3e848dc2c32e347b995368ca57ad/68747470733a2f2f692e696d6775722e636f6d2f6e6b365579466e2e6a7067',
    title: '"Low-Cost" Sound Voltex Game Controller',
    date: '2020',
    link: 'https://github.com/felixha00/lowcost-voltex',
    text: [
      `
      Designed, constructed and programmed a functioning budget game controller in C using keyswitches, rotary encoders & an Arduino Pro Micro. `,
      `Creatively adapted and improved existing designs and material choices to reduce costs. `,
      `Successfully built a final product approximately 20 times cheaper than retail prices.`,
    ],
    githubURL: 'https://api.github.com/repos/felixha00/lowcost-voltex',
  },
];
