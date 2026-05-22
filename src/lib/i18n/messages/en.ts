export const en = {
  nav: {
    phoneLine: "Phone line",
    services: "Services",
    serviceAi: "AI Receptionist",
    serviceVoc: "Voice of Customer",
    pricing: "Pricing",
    about: "About",
    news: "News",
    ctaPricing: "Pricing",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  logo: { ariaHome: "RingsAway home" },
  hero: {
    eyebrow: "For salons, clinics, trades & local shops",
    title: "Your phone line, answered",
    titleHighlight: "24/7",
    subtitle:
      "Customers ring your normal business number. RingsAway picks up and books appointments. Each month we prepare a customer feedback report (VoC): what people are saying, what to fix, and how to act on Google.",
    bullets: [
      "Answer your real business number 24/7",
      "Capture bookings automatically",
      "Monthly customer feedback reports (VoC)",
    ],
    viewPricing: "View pricing",
  },
  agent: {
    speaking: "Speaking…",
    listening: "Listening…",
    connected: "Connected",
    trySaying: "Try saying",
    prompts: [
      "Can you tell me more about the business?",
      "I'd like to book an appointment",
      "What's your availability?",
      "How much does it cost?",
      "Where are you located?",
      "Can I reschedule my appointment?",
    ],
    connecting: "Connecting…",
    startCall: "Start a call",
    callOr: "or call",
    callSuffix: "to talk to the AI Agent",
    endCall: "End call",
    errorConnection: "Connection error. Please try again.",
    errorMic: "Allow microphone access to speak with our AI agent.",
  },
  industries: {
    eyebrow: "Live demos",
    title: "Hear RingsAway by industry",
    subtitle:
      "Try a live AI receptionist tuned for your type of business. More industries are on the way.",
    comingSoon: "Coming soon",
    tryDemo: "Try live demo",
    restaurantWorkflow: {
      packageLabel: "Package 1 — AI Receptionist",
      viewWorkflow: "Workflow",
      modalTitle: "La Vista Marina — Package 1 workflow",
      modalDescription:
        "How calls reach your AI receptionist, then how bookings and cancellations sync to Google Calendar and email.",
      caption:
        "Customers call your real number. When you are busy, the call forwards to a virtual line where the AI receptionist answers using your knowledge base — then booking actions run automatically.",
      callPathTitle: "How the call reaches your AI",
      callPathBadge: "Phone line",
      automationTitle: "After the AI takes the booking action",
      flowBadge: "Automation",
      newBookingTitle: "New booking",
      cancelTitle: "Cancel booking",
      callPath: {
        customerCall: "Customer calls",
        yourNumber: "Your business number",
        yourNumberHint: "Same number on Google & signage",
        lineBusy: "Line busy / no answer",
        forward: "Forward to virtual number",
        forwardHint: "RingsAway routing",
        voiceAgent: "AI voice receptionist",
        voiceAgentHint: "Answers 24/7 in EN / ES",
        knowledgeBase: "Business knowledge base",
        knowledgeBaseHint: "Menu, hours, FAQs, policies",
      },
      nodes: {
        webhook: "Webhook",
        calendarGet: "Get booking",
        calendarCreate: "Create event",
        calendarDelete: "Delete event",
        if: "If",
        ifHint: "Booking found?",
        branchNo: "Not found",
        branchYes: "Found",
        gmailGuest: "Email guest",
        gmailOwner: "Email you",
        merge: "Merge",
        respond: "Respond to AI",
      },
    },
    items: {
      restaurant: {
        name: "Restaurant",
        venue: "La Vista Marina, Manilva",
        description:
          "Table bookings, opening hours, dietary questions, and busy service nights handled on your line.",
        modalTitle: "La Vista Marina, Manilva",
        modalDescription:
          "Speak with the AI receptionist for La Vista Marina. Allow the microphone when prompted.",
        prompts: [
          "I'd like to book a table for four tonight",
          "Do you have vegetarian options?",
          "What are your opening hours on Sunday?",
          "Can I change my reservation to 8pm?",
        ],
      },
      salon: {
        name: "Salon",
        description:
          "Appointment booking, stylist availability, and service questions while your team is with clients.",
        modalTitle: "Salon demo",
        modalDescription: "Coming soon.",
        prompts: [],
      },
      estateAgency: {
        name: "Estate agency",
        description:
          "Viewing requests, property questions, and callback capture for buyers and renters.",
        modalTitle: "Estate agency demo",
        modalDescription: "Coming soon.",
        prompts: [],
      },
      clinic: {
        name: "Clinic",
        description:
          "Appointment scheduling, location and hours, and calm handling of patient enquiries.",
        modalTitle: "Clinic demo",
        modalDescription: "Coming soon.",
        prompts: [],
      },
    },
  },
  stats: {
    title: "Built for how local customers actually call you",
    subtitle:
      "Your real business number, answered around the clock, plus monthly reports our UX research agent builds from your reviews and feedback.",
    body: "Salons, clinics, trades and shops use RingsAway on the line customers already trust, not a separate app or chat widget.",
    stat1Value: "24/7",
    stat1Label: "Phone line coverage",
    stat2Value: "3×",
    stat2Label: "More booking capture",
    stat3Value: "100+",
    stat3Label: "Reviews read per report",
    quote:
      "We stopped losing evening calls. Bookings come through while we're still with clients. The phone just works now.",
    quoteAuthor: "Sarah M., salon owner",
  },
  phone: {
    eyebrow: "How it works",
    title: "Real phone calls. Answered by AI.",
    subtitle:
      "RingsAway is built for the way local customers actually reach you: by dialling your business number.",
    badge: "Your real number",
    lineLabel: "Your business line",
    lineCaption: "Same number on Google, website & signage",
    flowGoogle: "Google",
    flowLine: "Your line",
    flowBrand: "RingsAway",
    flowBadge: "Line active 24/7",
    clarifiers: [
      "Works with your existing business phone number",
      "Callers use any phone, mobile or landline",
      "Not a website chatbot or app your customers install",
    ],
    steps: [
      {
        title: "Customers call your number",
        text: "They ring the same number on Google, your website, or shop sign. A normal phone call.",
      },
      {
        title: "Your AI receptionist answers",
        text: "RingsAway picks up, handles enquiries, books appointments, and answers FAQs.",
        badge: "AI receptionist on your line",
      },
      {
        title: "You stay in the loop",
        text: "Bookings hit your calendar and you get summaries of what callers asked for.",
      },
    ],
    step: "Step",
  },
  problem: {
    eyebrow: "The problem",
    title: "Local businesses lose customers in two ways",
    subtitle: "Missed calls, ignored reviews, and follow-up that never happens.",
    cards: [
      { title: "Missed enquiries", text: "Customers call while staff are busy and go to someone who answers." },
      { title: "Unseen customer feedback", text: "Reviews contain valuable insight but rarely get turned into a clear monthly plan." },
      { title: "Poor follow-up", text: "Leads and opportunities fall through the cracks after the first contact." },
    ],
  },
  solution: {
    eyebrow: "Services",
    title: "Two services. Clear roles.",
    subtitle:
      "Your phone line and your customer feedback are different jobs. RingsAway offers AI Receptionist and Voice of Customer (VoC) as separate services, or together on one plan.",
    pickerLabel: "Choose a service",
    tabs: {
      ai: "AI Receptionist",
      voc: "Voice of Customer",
    },
    ai: {
      badge: "Service 1",
      title: "AI Receptionist",
      tagline: "Your business number, answered 24/7",
      description:
        "A dedicated AI agent on your existing phone line. It picks up when you cannot, books appointments, answers FAQs, and sends confirmations. This is phone operations, not review analysis.",
      features: [
        "Answers your real business phone line",
        "Books appointments and handles FAQs",
        "Sends confirmations automatically",
        "English and Spanish callers supported",
      ],
      howItWorks: "How the phone line works",
      liveOnLine: "Live on your line",
      pickup: "24/7 pickup",
      aiTrained: "AI trained on your business",
    },
    voc: {
      badge: "Service 2",
      title: "Voice of Customer (VoC)",
      tagline: "Monthly reports from what customers actually say",
      priceOneOff: "€89 per report",
      priceShort: "€89",
      description:
        "A separate monthly report built by our UX research agent. We read Google Reviews, Trustpilot, and TripAdvisor — additional review sites can be added on request — plus website feedback and surveys, then deliver complaints, praise, sentiment trends, competitor mentions, reply ideas, and a prioritised action plan. One-off reports are €89.",
      highlights: [
        "Google Reviews, Trustpilot, TripAdvisor — more sources on request",
        "Top complaints and praise themes",
        "Sentiment trends month to month",
        "Suggested Google review replies",
        "Google Business strategy included",
      ],
      cta: "See what goes in your report",
      reviewSources: {
        google: "Google",
        trustpilot: "Trustpilot",
        tripadvisor: "TripAdvisor",
      },
      floatingReviews: [
        {
          quote:
            "Best paella we've had on the coast — staff even remembered our anniversary.",
          author: "Claire M.",
          stars: 5,
          source: "google",
        },
        {
          quote: "Great food but we waited 25 minutes for a table on Friday night.",
          author: "James T.",
          stars: 3,
          source: "trustpilot",
        },
        {
          quote: "Lovely terrace and atmosphere. We'll definitely be back.",
          author: "Antonio R.",
          stars: 5,
          source: "tripadvisor",
        },
      ],
    },
  },
  vocDemos: {
    eyebrow: "Client reports",
    title: "Real VoC reports from Google reviews",
    subtitle:
      "Scores and themes from real businesses we analyse. Open a report to see sentiment, complaints, praise, and monthly actions — the same deliverable you receive.",
    tabsLabel: "Industry",
    viewReport: "View report",
    hideReport: "Hide report",
    getMyReport: "Get my report — €89",
    comingSoon: "Coming soon",
    comingSoonBlurb: "VoC report for this industry is on the way.",
    scoreLabel: "VoC score",
    tiers: {
      great: "Great",
      good: "Good",
      fair: "Fair",
      bad: "Poor",
    },
    sourceGoogle: "Google",
    sourceTrustpilot: "Trustpilot",
    sourceTripadvisor: "TripAdvisor",
    reviewsAnalyzed: "{{count}} reviews analyzed",
    report: {
      sampleHeading: "What goes into your monthly report",
      trendingTitle: "Trending topics",
      replyLabel: "Suggested Google reply",
    },
    industries: {
      restaurant: {
        available: true,
        tabName: "Restaurant",
        businessName: "La Vista Marina",
        location: "Manilva, Spain",
        listingGapsTitle: "Listing & menu gaps",
        source: "google",
        reviewCount: 128,
        score: 72,
        scoreLabel: "Good",
        period: "March 2026",
        metrics: [
          { key: "service", label: "Service", value: 88, color: "violet" },
          { key: "food", label: "Food quality", value: 76, color: "amber" },
          { key: "atmosphere", label: "Atmosphere", value: 82, color: "green" },
          { key: "value", label: "Value for money", value: 64, color: "red" },
        ],
        sentiment: {
          chartLabel: "Sentiment score",
          trend: "↑ Improving",
          months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          bars: [48, 52, 55, 61, 68, 72],
        },
        menuGaps: [
          "Evening menu not visible on Google Photos",
          "Vegetarian options missing from Business description",
          "Sunday hours outdated on listing",
        ],
        trending: [
          { topic: "Wait times", count: 24, tone: "negative" },
          { topic: "Fresh seafood", count: 31, tone: "positive" },
          { topic: "Marina views", count: 18, tone: "positive" },
          { topic: "Friday bookings", count: 14, tone: "negative" },
          { topic: "Phone reservations", count: 12, tone: "positive" },
        ],
        positives: [
          "Fresh seafood and daily catch praised in 31 reviews",
          "Friendly team — phone bookings described as effortless",
          "Marina views mentioned repeatedly as a reason to return",
        ],
        negatives: [
          "Friday night booking delays and overwhelmed front-of-house",
          "Limited vegan options called out in 9 reviews",
          "Parking directions unclear for first-time visitors",
        ],
        recommendations: [
          { priority: "High", text: "Update Sunday hours on Google Business this week" },
          { priority: "High", text: "Reply to 4 unresolved 3-star reviews from February" },
          { priority: "Medium", text: "Add evening menu photos and vegetarian dish tags" },
          { priority: "Low", text: "Post parking tip in listing Q&A" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Wait times on busy nights (24 mentions)",
              "Friday booking handoff (14 mentions)",
              "Parking and directions (6 mentions)",
            ],
            review: {
              author: "James T.",
              source: "Google",
              stars: 2,
              quote:
                "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed on a Friday night.",
              tags: ["Wait times", "Booking"],
            },
          },
          praise: {
            themes: [
              "Fresh seafood and daily catch (31 mentions)",
              "Easy phone reservations (12 mentions)",
              "Marina views and atmosphere (18 mentions)",
            ],
            review: {
              author: "Sarah M.",
              source: "Google",
              stars: 5,
              quote:
                "Called after hours and got booked straight away. Friendly team and exactly the slot we wanted.",
              tags: ["Booking ease", "After hours"],
            },
          },
          competitors: {
            chartLabel: "Average rating when mentioned",
            note: "From 12 comparison mentions this month",
            rows: [
              { name: "La Vista Marina", rating: 4.6, highlight: true },
              { name: "Coastal Bistro", rating: 4.2, highlight: false },
              { name: "Harbour Kitchen", rating: 4.4, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "3-star review",
            reviewAuthor: "James T.",
            reviewQuote:
              "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed.",
            replyLabel: "Suggested Google reply",
            replyText:
              "Thank you for telling us, James. We missed your booking slot on Friday and that is on us. Please call us — we will reserve your next visit and include a complimentary starter.",
          },
          googleStrategy: [
            "Prioritise replies to 3-star reviews from the last 30 days",
            "Post one photo update per week (menu, terrace, team)",
            "Highlight Sunday hours and holiday exceptions on the listing",
          ],
        },
      },
      salon: {
        available: true,
        tabName: "Salon",
        businessName: "Coastal Hair Studio",
        location: "Estepona, Spain",
        listingGapsTitle: "Listing & service gaps",
        source: "google",
        reviewCount: 94,
        score: 78,
        scoreLabel: "Good",
        period: "March 2026",
        metrics: [
          { key: "styling", label: "Styling skill", value: 91, color: "green" },
          { key: "booking", label: "Booking ease", value: 74, color: "amber" },
          { key: "atmosphere", label: "Salon experience", value: 85, color: "green" },
          { key: "value", label: "Value", value: 70, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Sentiment score",
          trend: "↑ Improving",
          months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          bars: [58, 61, 63, 70, 74, 78],
        },
        menuGaps: [
          "Full price list not on Google Business",
          "Bridal and event styling not mentioned in services",
          "Online booking link in listing goes to outdated page",
        ],
        trending: [
          { topic: "Colour correction", count: 22, tone: "positive" },
          { topic: "Stylist consistency", count: 19, tone: "positive" },
          { topic: "Saturday wait", count: 16, tone: "negative" },
          { topic: "Walk-in availability", count: 11, tone: "neutral" },
          { topic: "Scalp treatments", count: 9, tone: "positive" },
        ],
        positives: [
          "Colour and balayage work praised in 22 reviews",
          "Same stylist requests — clients trust the team",
          "Clean, relaxed salon atmosphere mentioned often",
        ],
        negatives: [
          "Saturday appointments running late in 16 reviews",
          "Price surprises when extras added at checkout",
          "Phone not answered during peak colour sessions",
        ],
        recommendations: [
          { priority: "High", text: "Publish full service menu and price ranges on Google" },
          { priority: "High", text: "Reply to 3 recent reviews mentioning Saturday delays" },
          { priority: "Medium", text: "Fix booking URL and add bridal styling to services list" },
          { priority: "Low", text: "Post walk-in policy in listing Q&A" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Saturday appointment delays (16 mentions)",
              "Price clarity at checkout (11 mentions)",
              "Calls not answered during colour sessions (8 mentions)",
            ],
            review: {
              author: "Elena R.",
              source: "Google",
              stars: 2,
              quote:
                "Love my colour but waited 40 minutes past my appointment time on Saturday. Nobody explained the delay.",
              tags: ["Wait times", "Communication"],
            },
          },
          praise: {
            themes: [
              "Colour and balayage results (22 mentions)",
              "Same stylist loyalty (19 mentions)",
              "Relaxed salon atmosphere (14 mentions)",
            ],
            review: {
              author: "Michelle K.",
              source: "Google",
              stars: 5,
              quote:
                "Best balayage I have had on the coast. Emma listened, the result looks natural, and the salon feels calm.",
              tags: ["Colour", "Stylist"],
            },
          },
          competitors: {
            chartLabel: "Average rating when mentioned",
            note: "From 9 comparison mentions this month",
            rows: [
              { name: "Coastal Hair Studio", rating: 4.7, highlight: true },
              { name: "Studio 45 Estepona", rating: 4.4, highlight: false },
              { name: "Hair Lounge Marbella", rating: 4.3, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "3-star review",
            reviewAuthor: "Elena R.",
            reviewQuote:
              "Love my colour but waited 40 minutes past my appointment time on Saturday.",
            replyLabel: "Suggested Google reply",
            replyText:
              "Thank you, Elena — waiting that long is not acceptable. Please message us with your next preferred slot and we will prioritise you with a complimentary treatment add-on.",
          },
          googleStrategy: [
            "Publish full price list and bridal services on the listing",
            "Reply to reviews mentioning Saturday waits within 48 hours",
            "Add fresh interior and colour result photos monthly",
          ],
        },
      },
      estateAgency: {
        available: true,
        tabName: "Estate agency",
        businessName: "Marbella Homes",
        location: "Marbella, Spain",
        listingGapsTitle: "Listing & profile gaps",
        source: "tripadvisor",
        reviewCount: 67,
        score: 69,
        scoreLabel: "Fair",
        period: "March 2026",
        metrics: [
          { key: "listings", label: "Property listings", value: 82, color: "green" },
          { key: "response", label: "Response time", value: 58, color: "red" },
          { key: "communication", label: "Communication", value: 71, color: "amber" },
          { key: "trust", label: "Trust & transparency", value: 75, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Sentiment score",
          trend: "↑ Improving",
          months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          bars: [52, 54, 56, 62, 66, 69],
        },
        menuGaps: [
          "English-speaking team not highlighted on TripAdvisor profile",
          "New-build portfolio photos missing from listing",
          "Area guides for Manilva and Estepona not linked",
        ],
        trending: [
          { topic: "Viewing punctuality", count: 18, tone: "negative" },
          { topic: "Sea-view apartments", count: 25, tone: "positive" },
          { topic: "Rental management", count: 14, tone: "positive" },
          { topic: "Follow-up speed", count: 21, tone: "negative" },
          { topic: "Local knowledge", count: 17, tone: "positive" },
        ],
        positives: [
          "Strong knowledge of Costa del Sol neighbourhoods",
          "Sea-view and marina properties well presented",
          "Rental clients praise ongoing management contact",
        ],
        negatives: [
          "Slow callback after enquiries mentioned in 21 reviews",
          "Viewings rescheduled without notice in several cases",
          "Fees and commission clarity questioned in 8 reviews",
        ],
        recommendations: [
          { priority: "High", text: "Respond to all TripAdvisor enquiries within 4 business hours" },
          { priority: "High", text: "Add new-build gallery and English team note to profile" },
          { priority: "Medium", text: "Standardise viewing confirmation SMS for every booking" },
          { priority: "Low", text: "Publish fee structure FAQ on profile" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "Slow follow-up after enquiries (21 mentions)",
              "Viewings rescheduled without notice (12 mentions)",
              "Fee transparency questions (8 mentions)",
            ],
            review: {
              author: "David P.",
              source: "TripAdvisor",
              stars: 2,
              quote:
                "Interested in a sea-view rental but took three days to hear back. Viewing was then moved twice.",
              tags: ["Response time", "Viewings"],
            },
          },
          praise: {
            themes: [
              "Local area knowledge (17 mentions)",
              "Sea-view property presentation (25 mentions)",
              "Rental management contact (14 mentions)",
            ],
            review: {
              author: "Claire W.",
              source: "TripAdvisor",
              stars: 5,
              quote:
                "Honest advice on neighbourhoods, smooth viewing, and they handled every question on our rental professionally.",
              tags: ["Local knowledge", "Rentals"],
            },
          },
          competitors: {
            chartLabel: "Average rating when mentioned",
            note: "From 11 comparison mentions this month",
            rows: [
              { name: "Marbella Homes", rating: 4.5, highlight: true },
              { name: "Costa Living Estates", rating: 4.3, highlight: false },
              { name: "Puerto Banús Properties", rating: 4.4, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "3-star review",
            reviewAuthor: "David P.",
            reviewQuote:
              "Interested in a sea-view rental but took three days to hear back. Viewing was then moved twice.",
            replyLabel: "Suggested reply",
            replyText:
              "David, thank you for your patience — our response should have been same day. We have assigned a dedicated contact for your search and will confirm your next viewing by SMS.",
          },
          googleStrategy: [
            "Highlight English-speaking team on TripAdvisor profile",
            "Add new-build photo gallery and area guides for Manilva / Estepona",
            "Post viewing availability updates weekly during peak season",
          ],
        },
      },
      clinic: {
        available: true,
        tabName: "Clinic",
        businessName: "Manilva Medical Centre",
        location: "Manilva, Spain",
        listingGapsTitle: "Profile & service gaps",
        source: "google",
        reviewCount: 103,
        score: 81,
        scoreLabel: "Great",
        period: "March 2026",
        metrics: [
          { key: "care", label: "Patient care", value: 89, color: "green" },
          { key: "appointments", label: "Appointments", value: 76, color: "amber" },
          { key: "staff", label: "Staff & bedside manner", value: 84, color: "green" },
          { key: "facility", label: "Facility", value: 78, color: "amber" },
        ],
        sentiment: {
          chartLabel: "Sentiment score",
          trend: "↑ Improving",
          months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          bars: [65, 68, 70, 74, 78, 81],
        },
        menuGaps: [
          "Accepted insurance providers not listed on Google",
          "Urgent appointment hours unclear in listing",
          "Parking and access instructions missing for new patients",
        ],
        trending: [
          { topic: "GP wait times", count: 20, tone: "negative" },
          { topic: "Friendly nurses", count: 28, tone: "positive" },
          { topic: "English spoken", count: 24, tone: "positive" },
          { topic: "Telephone booking", count: 15, tone: "positive" },
          { topic: "Prescription delays", count: 11, tone: "negative" },
        ],
        positives: [
          "Nursing staff warmth praised in 28 reviews",
          "English and Spanish both handled well at reception",
          "Telephone booking described as quick and clear",
        ],
        negatives: [
          "GP appointment availability frustrating in 20 reviews",
          "Prescription collection wait times in 11 reviews",
          "First-visit parking confusion for 6 reviewers",
        ],
        recommendations: [
          { priority: "High", text: "List accepted insurers and urgent-care hours on Google" },
          { priority: "High", text: "Reply to February reviews about GP wait times" },
          { priority: "Medium", text: "Add parking map and access notes to Business profile" },
          { priority: "Low", text: "Post prescription collection times in Q&A" },
        ],
        monthlyReport: {
          complaints: {
            themes: [
              "GP appointment availability (20 mentions)",
              "Prescription collection waits (11 mentions)",
              "Parking for first visits (6 mentions)",
            ],
            review: {
              author: "Robert H.",
              source: "Google",
              stars: 2,
              quote:
                "Nurses were lovely but could not get a GP slot for two weeks. Felt stuck for a simple issue.",
              tags: ["GP access", "Appointments"],
            },
          },
          praise: {
            themes: [
              "Nursing staff warmth (28 mentions)",
              "English and Spanish at reception (24 mentions)",
              "Clear telephone booking (15 mentions)",
            ],
            review: {
              author: "Linda S.",
              source: "Google",
              stars: 5,
              quote:
                "Reception sorted my appointment in English quickly. Nurses were kind and explained everything clearly.",
              tags: ["Staff", "Booking"],
            },
          },
          competitors: {
            chartLabel: "Average rating when mentioned",
            note: "From 7 comparison mentions this month",
            rows: [
              { name: "Manilva Medical Centre", rating: 4.5, highlight: true },
              { name: "Clínica Estepona", rating: 4.2, highlight: false },
              { name: "Sabinillas Health", rating: 4.1, highlight: false },
            ],
          },
          suggestions: {
            reviewLabel: "3-star review",
            reviewAuthor: "Robert H.",
            reviewQuote:
              "Nurses were lovely but could not get a GP slot for two weeks. Felt stuck for a simple issue.",
            replyLabel: "Suggested Google reply",
            replyText:
              "Robert, we are sorry you struggled to book. We have opened extra GP telephone slots this month — please call reception and we will fit you in or direct you to the right urgent pathway.",
          },
          googleStrategy: [
            "List accepted insurers and urgent-care hours prominently",
            "Reply to reviews about GP waits with clear next steps",
            "Add parking map and first-visit instructions to photos and Q&A",
          ],
        },
      },
    },
  },
  caseStudies: {
    carouselEyebrow: "Client reports",
    carouselTitle: "Real VoC reports from Google reviews",
    filterAll: "All",
    viewReport: "View report",
    scrollPrev: "Previous",
    scrollNext: "Next",
    loadingCarousel: "Loading reports…",
    loadingReport: "Loading report…",
    reportUnavailable: "This report could not be loaded.",
    defaultTitle: "VoC report",
    previewFootnote: "Monthly VoC reports prepared for your business by RingsAway.",
    paywallTitle: "To see the full report",
    paywallBody:
      "Complaints, praise, competitor benchmarks, reply drafts, and your action plan for {{business}} are in the complete monthly deliverable.",
    getFullReport: "Get full report",
    reportPrice: "€89 per report",
    reportPriceCta: "Get full report — €89",
    getInTouch: "Get in touch",
    emptyGridHint:
      "Publish a ready report from the dashboard (Landing case study → VoC reports row) to show it here.",
    searchPlaceholder: "Search reports by name or location…",
    noSearchResults: "No reports match your search or filter.",
  },
  integrations: {
    eyebrow: "Integrations",
    title: "Works with the tools you already use",
    subtitle:
      "Connect calendars, booking platforms, messaging, and CRMs. We wire RingsAway to your stack during setup.",
    footnote:
      "Need something else? Tell us on the contact form — custom integrations are available on Enterprise.",
    categories: {
      restaurants: {
        title: "Restaurants",
        items: {
          coverManager: "CoverManager",
          openTable: "OpenTable",
          googleCalendar: "Google Calendar",
        },
      },
      salonsBeauty: {
        title: "Salons & beauty",
        items: {
          timely: "Timely",
          fresha: "Fresha",
          treatwell: "Treatwell",
        },
      },
      propertyTourism: {
        title: "Property & tourism",
        items: {
          airbnb: "Airbnb",
          bookingCom: "Booking.com",
        },
      },
      communication: {
        title: "Communication",
        items: {
          twilio: "Twilio",
          whatsapp: "WhatsApp",
          gmail: "Gmail",
          zadarma: "Zadarma",
        },
      },
      businessTools: {
        title: "Business tools",
        items: {
          googleCalendar: "Google Calendar",
          outlook: "Outlook",
          hubspot: "HubSpot",
        },
      },
    },
  },
  pipeline: {
    eyebrow: "How it works",
    title: "How RingsAway works for your business",
    subtitle:
      "AI Receptionist handles live calls. VoC turns reviews and feedback into monthly actions. Together they cover the full loop.",
    inLabel: "In",
    inItems: ["Calls to your number", "Customer reviews", "Enquiries"],
    brandLabel: "RingsAway",
    brandItems: ["AI answers & books"],
    outLabel: "Out",
    outItems: ["Bookings captured", "Feedback report prepared", "Google plan & actions"],
    youLabel: "You get",
    youItems: [
      "Calendar updates",
      "Email confirmations",
      "Monthly feedback report",
      "Google Business strategy",
    ],
  },
  voc: {
    eyebrow: "Customer feedback reports",
    title: "Voice of the Customer, explained in plain English",
    introBefore: "VoC is not jargon for big corporations. It is listening to what customers say, understanding the patterns, and",
    introEmphasis: "doing something about it",
    introAfter:
      ", including your Google Business profile, where many people decide whether to call you.",
    viewDemoReports: "View client reports",
    whatTitle: "What is VoC?",
    whatBody:
      "Voice of the Customer (VoC) means listening to what people say about your business: Google reviews, your website, surveys, and feedback after visits. Then we help you make sense of it together.",
    whyTitle: "Why it matters",
    whyBody:
      "Star ratings alone do not tell you what to fix. VoC shows the real themes (wait times, staff, pricing, quality) so you improve what customers actually care about, not what you guess.",
    actionTitle: "Action + Google",
    actionBody:
      "Each month we turn feedback into clear next steps: what to change in the business, how to reply on Google, and a practical Google Business strategy so your listing works harder for you.",
    monthlyNote:
      "Each month our UX research agent prepares your report. We read Google Business reviews, your website, surveys, and customer satisfaction feedback, so you get themes, actions, and a Google plan you can actually follow.",
    accordionHeading: "What goes into your monthly report",
    panels: {
      complaints: {
        title: "Top complaints",
        description:
          "We read your Google reviews, website feedback, and surveys, then call out what people complain about most so you fix the right thing first.",
      },
      praise: {
        title: "Top praise themes",
        description:
          "We highlight what customers love in their own words: the phrases and experiences that show up again and again in five-star reviews.",
      },
      sentiment: {
        title: "Customer sentiment",
        description:
          "We track whether mood is improving month to month from your reviews and satisfaction feedback, not just your star average.",
      },
      competitors: {
        title: "Competitor comparison",
        description: "When reviewers mention rivals, we note why, and where you are already winning in their eyes.",
      },
      suggestions: {
        title: "Review response ideas",
        description: "Optional wording we suggest for Google replies. You choose what to post, in your voice.",
      },
      google: {
        title: "Google Business strategy",
        description:
          "Practical guidance for your Google Business profile: which reviews to answer, what to post, what to highlight in photos or offers, and how feedback should shape how you show up in local search.",
        imageAlt: "Google Business Profile",
      },
      actions: {
        title: "Monthly action plan",
        description:
          "A short, prioritised list for this month: fixes in the business, reputation tasks, and Google steps ranked by what will help you most.",
      },
    },
    previews: {
      complaints: {
        author: "James T.",
        source: "Google",
        stars: 2,
        quote:
          "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed on a Friday night.",
        tags: ["Wait times", "Booking"],
      },
      praise: {
        author: "Sarah M.",
        source: "Google",
        stars: 5,
        quote:
          "Called after hours and got booked straight away. Friendly team and exactly the slot we wanted.",
        tags: ["Booking ease", "After hours"],
      },
      sentiment: {
        chartLabel: "Sentiment score",
        trend: "↑ Improving",
        months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        bars: [42, 48, 45, 58, 64, 72],
      },
      competitors: {
        chartLabel: "Average rating when mentioned",
        note: "From 12 comparison mentions this month",
        rows: [
          { name: "Your business", rating: 4.6, highlight: true },
          { name: "Coastal Bistro", rating: 4.2, highlight: false },
          { name: "Harbour Kitchen", rating: 4.4, highlight: false },
        ],
      },
      suggestions: {
        reviewLabel: "3-star review",
        reviewAuthor: "James T.",
        reviewQuote:
          "Waited 25 minutes for a table we had booked. Staff were polite but clearly overwhelmed.",
        replyLabel: "Suggested Google reply",
        replyText:
          "Thank you for telling us, James. We missed your booking slot on Friday and that is on us. Please message us or call — we will reserve your next visit and include a complimentary starter.",
      },
      actions: {
        title: "March priorities",
        items: [
          { priority: "High", text: "Reply to 3 negative reviews from February" },
          { priority: "High", text: "Fix Friday booking handoff with front-of-house" },
          { priority: "Medium", text: "Post weekly hours update on Google" },
          { priority: "Low", text: "Add photos of new evening menu items" },
        ],
      },
    },
  },
  news: {
    eyebrow: "News",
    title: "Updates and guides",
    subtitle:
      "Product news and practical tips for phone-first local businesses, from our team in Manilva, Spain.",
    latest: "Latest",
    viewAll: "View all articles",
    viewAllMobile: "View all articles →",
    readMore: "Read more",
    categoryArticle: "Article",
    categoryUpdate: "Update",
    readArticle: "Read article",
    fromTeam: "From the RingsAway team",
    allNews: "All news",
    backToHomepage: "Back to homepage",
    backHome: "← Back to homepage",
    indexTitle: "Updates and guides",
    indexSubtitle:
      "Product news and practical tips for phone-first local businesses, from our team in Manilva, Spain.",
    items: [
      {
        slug: "best-bars-sotogrande",
        category: "article" as const,
        title:
          "Best Bars in Sotogrande: A Local Guide to Drinks, Sport, Cocktails and Marina Views",
        excerpt:
          "A practical guide to Sotogrande bars, from marina terraces and rooftop cocktails to sports pubs and late-night venues, with links to every venue and category on Sotogrande Guide.",
        readTime: "6 min read",
        tags: ["Local SEO", "Sotogrande", "Hospitality"],
        imageAlt: "Cocktails and marina bar terraces in Sotogrande",
        body: [],
      },
      {
        slug: "google-listing-phone-line",
        category: "article" as const,
        title: "Your Google listing phone line is your busiest storefront",
        excerpt:
          "Most local customers still call before they book online. If that number rings out, you're losing jobs to whoever answers first.",
        readTime: "4 min read",
        tags: ["Local SEO", "Phone"],
        imageAlt: "Google listing on a phone with an incoming call",
        body: [
          "For most local businesses, the phone number on your Google listing gets more serious enquiries than your contact form. Someone ready to book a haircut, a dental check-up, or an emergency plumber does not want to wait until Monday morning.",
          "When that call goes to voicemail or rings out while you are with a client, they rarely leave a message. They call the next result on Google. That is not a branding problem; it is lost revenue you never see in your analytics.",
          "RingsAway answers on your existing business number, so the experience stays familiar for callers. They dial the same digits they already trust from your shop sign, website, or Maps listing.",
          "You still get summaries, bookings in your calendar, and confirmation emails. The difference is that your line is covered when you cannot physically pick up: evenings, weekends, and busy hours included.",
          "If you are investing in local SEO and Google reviews, treating your listed phone line as a first-class channel is the highest-leverage fix most owners skip.",
        ],
      },
      {
        slug: "bilingual-receptionist",
        category: "article" as const,
        title: "English and Spanish callers on one business number",
        excerpt:
          "Mixed-language enquiries are common in many markets. Here's how we train RingsAway to handle both without awkward handoffs.",
        readTime: "5 min read",
        tags: ["Bilingual", "Setup"],
        imageAlt: "English and Spanish callers on one business phone line",
        body: [
          "Walk into many salons, clinics, and trade businesses in bilingual areas and you will hear both English and Spanish in the same afternoon. Your phone line should reflect that reality, not force callers to press 1 for a language they may not speak.",
          "We configure RingsAway with your preferred greeting, FAQs, and booking rules in both languages. The agent detects which language the caller uses and stays in that language for the rest of the conversation unless they switch.",
          "That matters for tone as much as comprehension. A nervous new patient or a holiday homeowner calling about a leak wants to feel understood, not routed through a generic script.",
          "During setup we capture how you actually speak to customers: your services, your hours, what you need before confirming a booking, and what counts as urgent. That knowledge lives in both languages from day one.",
          "Owners tell us the biggest relief is not translating everything themselves. It is knowing evening and weekend calls are handled properly whether the caller starts in English or Spanish.",
          "If you serve a mixed community, one bilingual receptionist on your real number is simpler than maintaining separate lines, chat widgets, and voicemail boxes nobody checks.",
        ],
      },
      {
        slug: "voc-reports-march",
        category: "update" as const,
        title: "What's new in monthly customer feedback reports",
        excerpt:
          "Clearer VoC explainers, action lists, competitor mentions, and Google Business guidance, all built by our UX research agent from owner feedback.",
        readTime: "3 min read",
        tags: ["Product"],
        imageAlt: "Monthly customer feedback and VoC report",
        body: [
          "Monthly customer feedback reports (Voice of the Customer, or VoC) are only useful if you open them and know what to do next, including on Google. This update is based on feedback from owners who wanted less jargon, less data, and more direction.",
          "When we prepare your report, action lists are ranked by likely impact: what to fix this month, what can wait, and what is already working from praise in your Google reviews.",
          "We also note when competitors are mentioned by name, so you can see why customers compare you and where you are already winning.",
          "Themes that repeat across multiple months are called out explicitly, so slow-burn problems (wait times, parking, pricing confusion) do not get buried under newer five-star comments.",
          "Reports stay short by design: a summary you can read in a few minutes, with optional detail if you want to dig into specific reviews, website feedback, or survey responses.",
          "Growth and Premium plans include these reports; if you are on Starter, ask us about upgrading when you are ready to turn reviews into a monthly habit rather than a guilty backlog.",
        ],
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Simple pricing for growing businesses",
    subtitle:
      "Start with an AI receptionist, then add customer insight as your business grows.",
    flexNote:
      "Month-to-month only — not a subscription lock-in. Cancel anytime, add or remove services, and turn on features as you need them.",
    popular: "MOST POPULAR",
    setupLabel: "Setup",
    monthlyLabel: "Monthly",
    includedMinutesLabel: "Included minutes",
    includedLabel: "Included",
    overageLabel: "Overage",
    customPrice: "Custom",
    perMonth: "/month",
    excludesVat: "excl. IVA",
    bookDemo: "Book a demo",
    contactUs: "Contact us",
    setupNote:
      "Standard setup is €499. Extra setup fees only apply for complex integrations such as WhatsApp Business, table booking systems, CRMs or custom workflows.",
    overageNote:
      "Additional AI minutes are billed transparently once your included monthly allowance is exceeded.",
    addOnsTitle: "Optional add-ons",
    plans: {
      receptionist: {
        name: "Package 1 — AI Receptionist",
        description:
          "For businesses that want calls answered, FAQs handled and appointments booked.",
        setup: "€499 setup",
        monthly: "€179",
        minutes: "300 AI call minutes/month",
        overage: "€0.35/min after included minutes",
        features: [
          "AI receptionist",
          "Business knowledge base",
          "Answers FAQs",
          "Books appointments",
          "Cancels appointments",
          "Google Calendar integration",
          "Customer confirmation emails",
          "Owner notification emails",
        ],
        highlight: "",
        cta: "bookDemo",
      },
      bundle: {
        name: "Package 2 — Receptionist + Insight",
        description:
          "For businesses that want call handling plus monthly customer insight.",
        setup: "€499 setup",
        monthly: "€249",
        minutes: "500 AI call minutes/month",
        overage: "€0.30/min after included minutes",
        features: [
          "Everything in AI Receptionist",
          "Monthly Voice of Customer report",
          "Google review analysis",
          "Positive and negative themes",
          "Customer complaint trends",
          "Monthly action recommendations",
          "More included AI minutes",
        ],
        highlight:
          "Includes monthly VoC reports (one-off reports are €89 each)",
        savings: {
          separate: "AI Receptionist €179/mo + VoC report €89 one-off",
          bundle: "This plan: €249/mo with monthly VoC included",
          saving: "Best value for calls plus ongoing customer insight",
        },
        cta: "bookDemo",
      },
      custom: {
        name: "Custom Workflow",
        description:
          "For businesses requiring custom workflows and integrations.",
        setup: "Custom",
        monthly: "Custom",
        minutes: "Custom",
        overage: "",
        features: [
          "Custom AI agent setup",
          "Custom workflow design",
          "Required integrations",
          "Business knowledge base",
          "Booking and cancellation logic",
          "Monthly VoC report if included in project scope",
        ],
        highlight: "",
        cta: "contactUs",
      },
    },
    addOns: [
      { title: "Voice of Customer Report", price: "€89 one-off" },
      { title: "WhatsApp Business Integration", price: "€200 one-off" },
      { title: "Table Booking Integration", price: "€200 one-off" },
      { title: "Extra Automation", price: "from €250 setup" },
      { title: "Extra Calendar/User", price: "€200/month" },
      { title: "Extra Phone Number", price: "cost + €25/month" },
    ],
  },
  addOns: {
    title: "Optional add-ons",
    subtitle: "",
    items: [
      { title: "Voice of Customer Report", price: "€89 one-off" },
      { title: "WhatsApp Business Integration", price: "€200 one-off" },
      { title: "Table Booking Integration", price: "€200 one-off" },
      { title: "Extra Automation", price: "from €250 setup" },
      { title: "Extra Calendar/User", price: "€200/month" },
      { title: "Extra Phone Number", price: "cost + €25/month" },
    ],
  },
  about: {
    eyebrow: "About us",
    title: "Family business, based in Spain",
    p1: "RingsAway is built and supported from Manilva, La Chullera on the Costa del Sol. We are a family business, not a faceless call centre. We have a background in UX and technology, and 16 years in the industry making software and services that real people enjoy using.",
    p2: "We set up AI phone reception for shops, salons, clinics, and trades that lose customers when nobody picks up, wherever you are. Every setup is handled in English or Spanish, with clear handover and support from our team (remote onboarding works fine).",
    p3: "If you want your real business number answered properly, without hiring another full-time receptionist, we'd love to hear from you.",
    commonQuestions: "Common questions",
    mapTitle: "RingsAway location, Manilva, La Chullera, Spain",
    locationPrimary: "Manilva, La Chullera",
    locationSecondary: "Málaga, Costa del Sol, Spain",
    openMaps: "Open in Google Maps →",
    facts: ["English & Spanish", "Family business", "16 years in industry", "UX & tech background"],
    tagline:
      "Based in Manilva. Working with phone-first businesses in English and Spanish, near or far.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    introBefore: "Can't find what you need?",
    introLink: "Talk over coffee ☕",
    introAfter: "and we'll walk you through setup.",
    items: [
      {
        id: "item-1",
        question: "Does it use my existing business number?",
        answer:
          "Yes. Customers dial the same number they already use on Google, your website, or shop signage. RingsAway answers that line; it's not a separate app or chat widget.",
      },
      {
        id: "item-2",
        question: "Is it really available 24/7?",
        answer:
          "Your AI receptionist answers whenever you can't: evenings, weekends, and busy periods. You choose when to hand off to a person.",
      },
      {
        id: "item-3",
        question: "How do bookings reach my calendar?",
        answer:
          "Confirmed appointments sync to Google Calendar (and more on higher plans). You and your team get email confirmations with caller details.",
      },
      {
        id: "item-4",
        question: "What is Voice of the Customer (VoC)?",
        answer:
          "VoC means listening to what customers actually say in Google reviews, on your website, in surveys, and after visits, then turning that into insight you can use. Star ratings alone do not tell you whether to fix wait times, staff training, pricing, or your Google listing. A good VoC report answers: what are people saying, why does it matter for my business, and what should I do this month?",
      },
      {
        id: "item-5",
        question: "What is in the monthly report and Google Business plan?",
        answer:
          "Each month our UX research agent prepares your report. We read your Google Business reviews, website feedback, surveys, and satisfaction notes, then send themes, competitor mentions, review reply ideas, a ranked action plan, and practical Google Business guidance (what to post, what to reply to, how to show up better locally).",
      },
      {
        id: "item-6",
        question: "Who is RingsAway for?",
        answer:
          "Phone-first local businesses: salons, clinics, trades, shops, and practices that lose enquiries when no one picks up. We're based in Manilva, Spain, and work with owners in English and Spanish. You don't need to be on the Costa del Sol.",
      },
    ],
  },
  finalCta: {
    title: "One missed call can pay for itself",
    subtitle:
      "Your phone line answered around the clock. Capture more enquiries, improve reviews, and grow your business.",
    viewPricing: "View pricing",
  },
  footer: {
    description:
      "RingsAway answers your business phone line with AI and helps you capture more bookings, plus monthly customer feedback reports (VoC) with clear actions and a Google Business plan.",
    location:
      "Based in Manilva, La Chullera, Spain · English & Spanish · clients worldwide",
    copyright: "All rights reserved.",
    tagline: "Helping local businesses get more customers.",
  },
  reviewCard: {
    author: "Sarah M.",
    source: "Google",
    quote:
      "Called after hours and got booked straight away. Wish they'd done this years ago.",
    tags: ["Booking ease", "After hours"],
  },
  contactForm: {
    eyebrow: "Contact",
    title: "Talk over coffee",
    subtitle:
      "Tell us about your business and what you need — AI reception, VoC reports, or both. We will get back to you by email.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@business.com",
    businessLabel: "Business",
    businessPlaceholder: "Salon, clinic, restaurant…",
    phoneLabel: "Phone (optional)",
    phonePlaceholder: "+34 …",
    messageLabel: "Message",
    messagePlaceholder: "What would you like to discuss?",
    submit: "Send message",
    sending: "Sending…",
    success: "Thanks — your message is on its way. We will reply by email soon.",
    errorGeneric:
      "We could not send your message. Please try again or email christopher.hunt86@gmail.com.",
    privacy: "We only use your details to reply to this enquiry.",
  },
  contact: {
    talkCoffee: "Talk Over Coffee ☕",
    talkCoffeeLink: "Talk over coffee ☕",
    mailSubject: "Talk over coffee - RingsAway",
    mailGreeting: "Hi,",
    mailBodyIntro: "I'd love to talk over coffee and learn more about RingsAway.",
    mailName: "Name:",
    mailBusiness: "Business:",
    mailPhone: "Phone:",
    mailThanks: "Thanks,",
  },
} as const;

/** Shared message tree shape (English or Spanish literals). */
export type Messages = typeof en | typeof import("./es").es;
