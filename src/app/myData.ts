export const personalData = {
  intro: `
  👋  I'm a 3rd year student studying Computer Engineering student at McMaster University, with experience in hardware/software programming, graphic design and computer-aided design.
  I also design and sell playing cards on Kickstarter.

  `,
  links: {
    Resume:
      'https://docs.google.com/document/d/1S-7jjRvNYgbu7KK92ACTwtGsqRwdCmz7yDXLl9j3vfI/edit?usp=sharing',
    Github: 'https://felixha00.github.io/',
    LinkedIn: 'https://www.linkedin.com/in/felixha00/',
  },
};

export const softwareProjects = [
  {
    title: 'Kollabrise',
    link: 'https://kollabrise.web.app',
    img:
      'https://firebasestorage.googleapis.com/v0/b/kollabrise.appspot.com/o/banner.png?alt=media',
    date: '2020 - Present',
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
    title: 'Keybin',
    link: 'https://keybin.herokuapp.com',
    img:
      'https://cdn.shopify.com/s/files/1/0046/9539/2305/articles/IMG_0230_1024x.jpg',
    date: '2020 - Present',
    text: [
      `Developing a keyboard collection website using the MERN (MongoDB, ExpressJS, ReactJS, NodeJS) stack.`,
      `Implemented salting & hashing sensitive data and rate-limiting to prevent abuse of the API.`,
      `Utilizing a production-ready TypeScript boilerplate and deployed with Heroku`,
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
  'Total Raised': '40,000',
  Backers: '1000+',
  Projects: '2',
  'Products Sold': '3900+',
};
export const kickstarterProjects = [
  {
    link:
      'https://www.kickstarter.com/projects/felixha00/prescription-playing-cards',
    img: 'https://felixha00.github.io/assets/img/prescription_pc_cover.png',
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
  },
];
