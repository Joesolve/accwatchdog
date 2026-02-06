import { PrismaClient, PropertyType, PropertyStatus, ContentStatus, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@acc.gov.sl" },
    update: {},
    create: {
      email: "admin@acc.gov.sl",
      passwordHash: adminPassword,
      name: "System Administrator",
      role: UserRole.ADMIN,
    },
  });
  console.log("Created admin user:", admin.email);

  // Create sample properties
  const properties = [
    {
      referenceNumber: "ACC-PROP-2024-001",
      title: "3-Bedroom Residential Property in Hill Station",
      slug: "3-bedroom-residential-hill-station",
      description:
        "A well-maintained 3-bedroom residential property located in the prestigious Hill Station area. Features include modern amenities, spacious living areas, and a beautiful garden. This property was recovered from a corruption case involving public fund misappropriation.",
      type: PropertyType.RESIDENTIAL,
      status: PropertyStatus.AVAILABLE,
      region: "Western Area Urban",
      district: "Freetown",
      address: "15 Hill Station Road, Freetown",
      latitude: 8.4657,
      longitude: -13.2317,
      estimatedValue: 2500000000,
      minimumBid: 2000000000,
      auctionDate: new Date("2024-04-15"),
      auctionVenue: "ACC Headquarters, Freetown",
      size: "450 sqm",
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 2018,
      features: ["Garden", "Parking", "Security", "Generator"],
      caseReference: "ACC/2023/045",
      formerOwner: "Confiscated Asset",
      isFeatured: true,
    },
    {
      referenceNumber: "ACC-PROP-2024-002",
      title: "Commercial Building in Central Freetown",
      slug: "commercial-building-central-freetown",
      description:
        "Prime commercial property in the heart of Freetown's business district. Three-story building with office spaces, suitable for various business operations. Recovered through successful prosecution of a procurement fraud case.",
      type: PropertyType.COMMERCIAL,
      status: PropertyStatus.AVAILABLE,
      region: "Western Area Urban",
      district: "Freetown",
      address: "25 Siaka Stevens Street, Freetown",
      latitude: 8.4844,
      longitude: -13.2299,
      estimatedValue: 5000000000,
      minimumBid: 4000000000,
      auctionDate: new Date("2024-04-20"),
      auctionVenue: "ACC Headquarters, Freetown",
      size: "800 sqm",
      features: ["Elevator", "Parking", "24/7 Security", "Conference Room"],
      caseReference: "ACC/2022/089",
      formerOwner: "Confiscated Asset",
      isFeatured: true,
    },
    {
      referenceNumber: "ACC-PROP-2024-003",
      title: "Agricultural Land in Kenema",
      slug: "agricultural-land-kenema",
      description:
        "Fertile agricultural land in Kenema district, suitable for farming operations. The land includes access to water sources and is ideal for cash crop cultivation. Seized as part of an embezzlement investigation.",
      type: PropertyType.LAND,
      status: PropertyStatus.AVAILABLE,
      region: "Kenema",
      district: "Kenema",
      address: "Blama Road, Kenema",
      latitude: 7.8762,
      longitude: -11.1903,
      estimatedValue: 500000000,
      minimumBid: 350000000,
      auctionDate: new Date("2024-04-25"),
      auctionVenue: "Kenema District Council Hall",
      size: "10 hectares",
      features: ["Water Access", "Road Access", "Fertile Soil"],
      caseReference: "ACC/2023/112",
      formerOwner: "Confiscated Asset",
      isFeatured: false,
    },
    {
      referenceNumber: "ACC-PROP-2024-004",
      title: "Toyota Land Cruiser V8 2020",
      slug: "toyota-land-cruiser-v8-2020",
      description:
        "Well-maintained Toyota Land Cruiser V8, 2020 model. Low mileage, excellent condition. This vehicle was seized during an investigation into misuse of public funds.",
      type: PropertyType.VEHICLE,
      status: PropertyStatus.UNDER_AUCTION,
      region: "Western Area Urban",
      address: "ACC Impound Lot, Freetown",
      estimatedValue: 350000000,
      minimumBid: 280000000,
      auctionDate: new Date("2024-04-10"),
      auctionVenue: "ACC Headquarters, Freetown",
      features: ["Leather Interior", "Sunroof", "4WD", "Low Mileage"],
      caseReference: "ACC/2023/078",
      formerOwner: "Confiscated Asset",
      isFeatured: true,
    },
    {
      referenceNumber: "ACC-PROP-2024-005",
      title: "Construction Equipment Set",
      slug: "construction-equipment-set",
      description:
        "Complete set of construction equipment including excavator, bulldozer, and cement mixers. Equipment is in working condition. Recovered from a case involving inflated government contracts.",
      type: PropertyType.EQUIPMENT,
      status: PropertyStatus.AVAILABLE,
      region: "Western Area Urban",
      address: "ACC Storage Facility, Wellington",
      estimatedValue: 800000000,
      minimumBid: 600000000,
      auctionDate: new Date("2024-05-01"),
      auctionVenue: "Wellington Industrial Area",
      features: ["Working Condition", "Recent Service", "Complete Documentation"],
      caseReference: "ACC/2022/156",
      formerOwner: "Confiscated Asset",
      isFeatured: false,
    },
  ];

  for (const propertyData of properties) {
    const property = await prisma.property.upsert({
      where: { slug: propertyData.slug },
      update: {},
      create: {
        ...propertyData,
        publishedAt: new Date(),
      },
    });
    console.log("Created property:", property.title);
  }

  // Create recovery statistics
  const statistics = [
    {
      period: "2023",
      periodType: "yearly",
      totalRecovered: 45000000000,
      cashRecovered: 25000000000,
      assetsRecovered: 20000000000,
      fundsToTreasury: 40000000000,
      casesOpened: 156,
      casesClosed: 134,
      prosecutions: 89,
      convictions: 78,
      acquittals: 11,
      propertiesSeized: 45,
      propertiesAuctioned: 32,
      sectorBreakdown: {
        "Public Administration": 15000000000,
        "Health": 8000000000,
        "Education": 7000000000,
        "Infrastructure": 10000000000,
        "Other": 5000000000,
      },
      regionBreakdown: {
        "Western Area Urban": 20000000000,
        "Western Area Rural": 5000000000,
        "Bo": 4000000000,
        "Kenema": 6000000000,
        "Bombali": 5000000000,
        "Other": 5000000000,
      },
    },
    {
      period: "2024-Q1",
      periodType: "quarterly",
      totalRecovered: 12000000000,
      cashRecovered: 7000000000,
      assetsRecovered: 5000000000,
      fundsToTreasury: 10000000000,
      casesOpened: 42,
      casesClosed: 38,
      prosecutions: 25,
      convictions: 22,
      acquittals: 3,
      propertiesSeized: 12,
      propertiesAuctioned: 8,
    },
  ];

  for (const stat of statistics) {
    await prisma.recoveryStatistic.upsert({
      where: {
        period_periodType: {
          period: stat.period,
          periodType: stat.periodType,
        },
      },
      update: {},
      create: stat,
    });
    console.log("Created statistic:", stat.period);
  }

  // Create case highlights
  const cases = [
    {
      title: "Former Minister Convicted in Embezzlement Case",
      slug: "former-minister-embezzlement-conviction",
      summary:
        "A former government minister was convicted for embezzling over Le 5 billion from public funds intended for infrastructure development.",
      content: `
        <h2>Case Overview</h2>
        <p>The Anti-Corruption Commission successfully prosecuted a former government minister who was found guilty of embezzling public funds earmarked for infrastructure development projects across multiple districts.</p>

        <h2>Investigation</h2>
        <p>The investigation, which lasted 18 months, uncovered a sophisticated scheme involving shell companies and offshore accounts. Key evidence included bank records, witness testimonies, and forensic analysis of financial transactions.</p>

        <h2>Verdict and Sentence</h2>
        <p>The court found the defendant guilty on all counts and sentenced them to 15 years imprisonment. Additionally, the court ordered the forfeiture of all illegally acquired assets, valued at over Le 3 billion.</p>

        <h2>Impact</h2>
        <p>This case demonstrates the ACC's commitment to holding public officials accountable regardless of their position. The recovered funds have been returned to the Consolidated Revenue Fund for public use.</p>
      `,
      caseNumber: "ACC/2023/045",
      defendant: "Former Minister",
      charges: ["Embezzlement", "Abuse of Office", "Money Laundering"],
      verdict: "Guilty",
      sentence: "15 years imprisonment",
      amountInvolved: 5000000000,
      amountRecovered: 3200000000,
      sector: "Public Administration",
      region: "Western Area Urban",
      caseDate: new Date("2022-06-15"),
      verdictDate: new Date("2023-11-20"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Procurement Fraud Ring Dismantled",
      slug: "procurement-fraud-ring-dismantled",
      summary:
        "ACC investigation leads to the prosecution of 8 individuals involved in a procurement fraud scheme affecting multiple government ministries.",
      content: `
        <h2>Case Overview</h2>
        <p>A major procurement fraud ring involving government officials and private contractors was successfully dismantled following an extensive ACC investigation.</p>

        <h2>The Scheme</h2>
        <p>The fraud involved inflated contracts, kickbacks, and the supply of substandard goods to government agencies. The scheme operated across three ministries over a period of four years.</p>

        <h2>Prosecution Results</h2>
        <p>All eight defendants were found guilty. Sentences ranged from 5 to 12 years depending on their level of involvement. The total amount recovered exceeded Le 2 billion.</p>
      `,
      caseNumber: "ACC/2022/089",
      defendant: "Multiple Defendants",
      charges: ["Procurement Fraud", "Conspiracy", "Corruption"],
      verdict: "Guilty (All Defendants)",
      sentence: "5-12 years imprisonment",
      amountInvolved: 3500000000,
      amountRecovered: 2100000000,
      sector: "Procurement",
      region: "Multiple Regions",
      caseDate: new Date("2021-03-10"),
      verdictDate: new Date("2023-08-15"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const caseData of cases) {
    await prisma.caseHighlight.upsert({
      where: { slug: caseData.slug },
      update: {},
      create: caseData,
    });
    console.log("Created case:", caseData.title);
  }

  // Create news updates
  const news = [
    {
      title: "ACC Launches New Public Education Campaign",
      slug: "acc-launches-public-education-campaign",
      excerpt:
        "The Anti-Corruption Commission has launched a nationwide campaign to educate citizens about corruption prevention and reporting.",
      content: `
        <p>The Anti-Corruption Commission (ACC) today launched a comprehensive public education campaign aimed at raising awareness about corruption and its impact on national development.</p>

        <p>The campaign, titled "Clean Hands, Clean Sierra Leone," will run for six months and include:</p>
        <ul>
          <li>Radio and television programs in English and local languages</li>
          <li>Community outreach events across all districts</li>
          <li>School-based anti-corruption clubs</li>
          <li>Social media awareness campaigns</li>
        </ul>

        <p>Commissioner Francis Ben Kaifala stated, "This campaign is about empowering every Sierra Leonean to be part of the fight against corruption. Knowledge is power, and we want our citizens to know their rights and how to report corruption."</p>
      `,
      category: "Campaigns",
      tags: ["education", "campaign", "awareness"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Quarterly Asset Recovery Report Released",
      slug: "quarterly-asset-recovery-report-q1-2024",
      excerpt:
        "ACC announces record-breaking asset recovery figures for Q1 2024, with over Le 12 billion recovered.",
      content: `
        <p>The Anti-Corruption Commission has released its quarterly asset recovery report, showing significant progress in the fight against corruption.</p>

        <h3>Key Highlights:</h3>
        <ul>
          <li>Total assets recovered: Le 12 billion</li>
          <li>Cash recovered: Le 7 billion</li>
          <li>Properties seized: 12</li>
          <li>Conviction rate: 88%</li>
        </ul>

        <p>The full report is available for download on our transparency dashboard.</p>
      `,
      category: "Reports",
      tags: ["statistics", "recovery", "report"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const newsData of news) {
    await prisma.newsUpdate.upsert({
      where: { slug: newsData.slug },
      update: {},
      create: newsData,
    });
    console.log("Created news:", newsData.title);
  }

  // Create educational resources
  const resources = [
    {
      title: "Understanding Corruption: A Citizen's Guide",
      slug: "understanding-corruption-citizens-guide",
      description:
        "A comprehensive guide explaining different forms of corruption, their impact on society, and how citizens can help combat them.",
      content: `
        <h2>What is Corruption?</h2>
        <p>Corruption is the abuse of entrusted power for private gain. It can take many forms and affects every aspect of society...</p>

        <h2>Types of Corruption</h2>
        <ul>
          <li><strong>Bribery:</strong> Offering or accepting payment to influence decisions</li>
          <li><strong>Embezzlement:</strong> Theft of public funds by those entrusted with them</li>
          <li><strong>Nepotism:</strong> Favoritism shown to relatives in employment or contracts</li>
          <li><strong>Fraud:</strong> Deception for personal or financial gain</li>
        </ul>

        <h2>How to Report Corruption</h2>
        <p>If you witness or have information about corrupt activities, you can report through our secure reporting system...</p>
      `,
      category: "Guides",
      resourceType: "ARTICLE",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Anti-Corruption Laws in Sierra Leone",
      slug: "anti-corruption-laws-sierra-leone",
      description:
        "An overview of the legal framework governing anti-corruption efforts in Sierra Leone, including the Anti-Corruption Act.",
      category: "Legal",
      resourceType: "PDF",
      fileUrl: "/uploads/resources/anti-corruption-act.pdf",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "How to Report Corruption - Video Guide",
      slug: "how-to-report-corruption-video",
      description:
        "Step-by-step video tutorial on how to submit a corruption report through the ACC's official channels.",
      category: "Tutorials",
      resourceType: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=example",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const resource of resources) {
    await prisma.educationalResource.upsert({
      where: { slug: resource.slug },
      update: {},
      create: resource,
    });
    console.log("Created resource:", resource.title);
  }

  // Create site settings
  const settings = [
    {
      key: "site_name",
      value: { en: "ACC Sierra Leone", kri: "ACC Salone" },
    },
    {
      key: "contact_email",
      value: "info@anticorruption.gov.sl",
    },
    {
      key: "contact_phone",
      value: "+232 22 228 092",
    },
    {
      key: "office_address",
      value: "3 Gloucester Street, Freetown, Sierra Leone",
    },
    {
      key: "social_media",
      value: {
        facebook: "https://facebook.com/accsl",
        twitter: "https://twitter.com/accsl",
        youtube: "https://youtube.com/accsl",
      },
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
    console.log("Created setting:", setting.key);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
