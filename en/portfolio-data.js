window.HR_CASES = [
  {
    "id": "angebotsoptimierung",
    "projectName": "Bestpreisfinder · Portfolio optimisation",
    "title": "Identifying revenue opportunities and optimising sales quotes",
    "shortTitle": "Identifying revenue opportunities and optimising sales quotes",
    "summary": "I identified new opportunities to increase revenue in sales and across the course portfolio. I developed two optimisation applications that became part of day-to-day operations. They showed which quotes would generate more revenue and which new products were worth developing.",
    "summaryHighlights": [
      "new opportunities to increase revenue"
    ],
    "role": "I worked out the business logic and developed the optimisation applications myself. We later extended the CRM integration as a team.",
    "outcome": "around 6% more revenue through quote and portfolio optimisation.",
    "outcomeHighlights": [],
    "facts": [
      {
        "label": "My role",
        "value": "Concept and hands-on development"
      },
      {
        "label": "Technology",
        "value": "Python, PuLP, Streamlit"
      },
      {
        "label": "Integration",
        "value": "Matrix42 (ESM), Zoho and Microsoft Dynamics"
      },
      {
        "label": "In use",
        "value": "Standard process for creating sales quotes"
      }
    ],
    "sections": [
      {
        "title": "Identifying commercial opportunities",
        "text": "At karriere tutor, a vocational training provider, the sales team created individual quotes based on each customer's selected courses. Existing pricing and certification requirements had to be taken into account. Working with the relevant departments, I recognised that specific combinations could generate more revenue. I developed two optimisation applications to make use of this opportunity.",
        "highlights": [
          "specific combinations could generate more revenue"
        ]
      },
      {
        "title": "Translating business rules into software",
        "text": "The combinatorial complexity made manual optimisation impossible. I translated the business rules into a combinatorial optimisation model and built an application in Python and PuLP that automatically calculated the highest-revenue combination permitted by those rules.",
        "highlights": [
          "combinatorial optimisation model"
        ]
      },
      {
        "title": "Developing the product portfolio",
        "text": "My second application provided specific recommendations for expanding the portfolio. Using mathematical optimisation, it identified the most commercially valuable options within an enormous space of possible combinations. The recommendations helped determine which additions to the course offering justified the effort and cost.",
        "highlights": [
          "specific recommendations for expanding the portfolio"
        ]
      },
      {
        "title": "Automating the quote process",
        "text": "The quote optimisation application used current data from Matrix42 and was connected to Zoho. Sales selected the requested courses through a Streamlit interface. The calculated results were automatically incorporated into the quotes issued to customers. This became the mandatory standard process for sales.",
        "highlights": [
          "mandatory standard process for sales"
        ]
      },
      {
        "title": "Preserving functionality during the CRM migration",
        "text": "During the move to Microsoft Dynamics, an initially proposed solution within the CRM did not meet the calculation and usability requirements. As a team, we adapted the application for Dynamics. Sales could open it from the CRM and write the results directly back into the system.",
        "highlights": [
          "we adapted the application for Dynamics"
        ]
      },
      {
        "title": "Commercial impact",
        "text": "Together, the two applications for quote and portfolio optimisation generated around 6% more revenue.",
        "highlights": [
          "around 6% more revenue"
        ]
      }
    ],
    "markerTone": "blue"
  },
  {
    "id": "contentgen",
    "projectName": "ContentGen",
    "title": "Designing and leading AI-assisted course material production",
    "shortTitle": "Designing and leading AI-assisted course material production",
    "summary": "I recognised how to accelerate and scale course production. I designed a platform combining centralised material management with generative AI and a custom RAG system. I built a development team and took the project from concept to pilot in just a few months.",
    "summaryHighlights": [
      "accelerate and scale course production"
    ],
    "role": "I was responsible for the overall concept and architecture, led five developers and involved instructors in the development process.",
    "outcome": "The first pilot courses were produced in one-third of the previous time, including subject-matter review by instructors.",
    "outcomeHighlights": [],
    "facts": [
      {
        "label": "My role",
        "value": "Overall concept, architecture and project leadership"
      },
      {
        "label": "Team",
        "value": "Five developers"
      },
      {
        "label": "Technology",
        "value": "Custom RAG system and multi-stage LLM workflows"
      },
      {
        "label": "Status",
        "value": "Architecture fully designed, implementation in pilot"
      }
    ],
    "sections": [
      {
        "title": "Identifying opportunities for the business",
        "text": "At karriere tutor, I recognised how to accelerate and scale course production. Creating and updating courses was time-consuming and expensive. Scattered, inconsistent materials also made updates, staff cover and handovers difficult. I designed a platform combining generative AI with a shared infrastructure for teaching materials. The aim was to enable new training products to be developed and tested more quickly.",
        "highlights": [
          "accelerate and scale course production"
        ]
      },
      {
        "title": "Building and leading a development team",
        "text": "I built a development team and led five developers. I was responsible for the overall concept, architecture, and decisions on development and quality. The team handled the programming. Together, we took the project from concept to pilot in just a few months.",
        "highlights": [
          "led five developers"
        ]
      },
      {
        "title": "Designing the complete AI architecture",
        "text": "I designed the complete architecture for creating and updating materials for entire courses. Multi-stage LLM workflows processed inputs such as topic, duration and target audience to generate slides, handouts, interactive learning paths and tests. A custom RAG system supplied relevant content from specialist literature. For texts, images and tables with different structures, we compared methods for preparing the content and dividing it into meaningful chunks. I personally negotiated the licences with the publishers.",
        "highlights": [
          "complete architecture"
        ]
      },
      {
        "title": "Making materials reliable and accessible",
        "text": "For centralised material management, I designed roles, access permissions, versioning and shared standards. The architecture specified an end-to-end workflow to import existing materials from a database, support their revision and return them to the database and learning management system. Consistent structures and practical speaker notes were intended to help substitute instructors get up to speed quickly. In the pilot application, instructors could view materials, revise them with AI, add comments and make manual edits. Export in the company's visual identity was also available.",
        "highlights": [
          "centralised material management"
        ]
      },
      {
        "title": "Turning concerns into product requirements",
        "text": "In one-to-one conversations, I explored the reasons for some instructors' scepticism. Their concerns included extra correction work and losing familiar teaching routines. I translated these concerns into concrete product requirements. We added metadata to what had initially been a purely semantic source search, allowing instructors to specify chapters, pages or examples. We evaluated additional search results together. Some instructors discovered useful additions in the process. Increased participation in tests and use of the application made the change in attitude visible.",
        "highlights": [
          "concrete product requirements"
        ]
      },
      {
        "title": "Evaluating subject-matter quality systematically",
        "text": "Together with instructors, we defined which information the system needed to retrieve for selected questions as the basis for evaluating subject-matter quality. These reference materials became the benchmark for our retrieval tests. We deliberately tested the source search with hard-to-find content, distractors and ambiguous technical terms. A multi-stage evaluation using language models assessed how well the retrieved passages addressed each question. For the generated materials, we also analysed the comments, corrections and further instructions instructors needed to provide.",
        "highlights": [
          "evaluating subject-matter quality"
        ]
      },
      {
        "title": "Preserving the teaching purpose of images",
        "text": "In one test, the system was asked to explain how to create a bar chart in Excel. Instead, the answer compared Alice's and Bob's expenses. We traced the error back to the image description. A multimodal model had described the placeholder data in a screenshot and missed the software operation being demonstrated. We extended the processing pipeline to include the surrounding textbook text so the model could identify the image's teaching purpose. This context informed a structured image description, which was then prepared for the knowledge base alongside the textbook content.",
        "highlights": [
          "image's teaching purpose"
        ]
      },
      {
        "title": "Applying the architecture to further needs",
        "text": "When the company changed its visual identity, we adapted the existing revision pipeline to the new logo, colours, fonts and templates with just a few changes. This also prepared the pipeline to convert existing materials to the new design.",
        "highlights": [
          "existing revision pipeline"
        ]
      },
      {
        "title": "Demonstrating value in the pilot",
        "text": "The first pilot courses were produced in one-third of the previous time. This already included subject-matter review by instructors. The architecture was fully designed. When I left the company, implementation, including writing materials back to the database and LMS, was in the pilot stage.",
        "highlights": [
          "one-third of the previous time"
        ]
      }
    ],
    "markerTone": "yellow"
  },
  {
    "id": "tutorbots",
    "projectName": "TutorBots",
    "title": "Introducing course-specific AI chatbots for learning support",
    "shortTitle": "Introducing course-specific AI chatbots for learning support",
    "summary": "I led the development and introduction of course-specific AI chatbots for learning support. They answer questions using specialist literature and course materials. I was responsible for the technical and educational design, planned testing and the phased rollout, and secured instructors' participation in subject-matter review and further development despite initial reservations.",
    "role": "I led the project, developed the rollout strategy and combined technical implementation with subject-matter review by instructors.",
    "outcome": "Chatbots launched in Microsoft Teams for more than 30 courses.",
    "outcomeHighlights": [],
    "facts": [
      {
        "label": "My role",
        "value": "Project leadership and rollout strategy"
      },
      {
        "label": "Technology",
        "value": "Google Cloud, Vertex AI and a custom RAG system"
      },
      {
        "label": "Integration",
        "value": "Microsoft Teams"
      },
      {
        "label": "In use",
        "value": "Live for more than 30 courses"
      }
    ],
    "sections": [
      {
        "title": "Providing course-specific learning support",
        "text": "I led the development and introduction of course-specific AI chatbots for learning support. Learners could ask questions about their course content, have explanations translated and ask follow-up questions in their own language. The bots complemented the human support available. The goals were better learning support, higher satisfaction and completion rates, and less pressure on instructors.",
        "highlights": [
          "course-specific AI chatbots for learning support"
        ]
      },
      {
        "title": "Reusing the technical foundation",
        "text": "I was responsible for the technical design and reused the existing RAG infrastructure from the AI-assisted material production project. Running on Google Cloud and Vertex AI, it supplied relevant content from specialist literature and course materials to inform the answers. My team implemented the integration into Microsoft Teams, where teaching already took place. This made the learning support available within the familiar course environment.",
        "highlights": [
          "existing RAG infrastructure"
        ]
      },
      {
        "title": "Translating teaching expertise into requirements",
        "text": "Together with instructors, we developed educational guidelines for how the bots should answer questions. We discussed how instructors themselves would respond to learners' questions and translated their approaches into instructions for the bots. Appropriate hints were intended to support learners in finding their own solutions and encourage further thought without giving away the answers. In testing, we checked how the bots applied these guidelines.",
        "highlights": [
          "educational guidelines for how the bots should answer questions"
        ]
      },
      {
        "title": "Securing instructors' participation",
        "text": "Some instructors initially had reservations about the project. In conversations, I listened, asked follow-up questions and explored the professional concerns behind their scepticism. These included their own role and how to handle differences between a bot's answer and an instructor's. I showed how the bots could also support instructors themselves and secured their participation in testing and further development. Their subject-matter expertise was essential to setting quality benchmarks.",
        "highlights": [
          "secured their participation in testing and further development"
        ]
      },
      {
        "title": "Planning the rollout strategically",
        "text": "I developed a phased rollout strategy and launched straightforward and challenging pilots in parallel. We grouped courses by subject area and the structure of their materials. Specialist literature containing many screenshots, for example, placed different demands on knowledge preparation. From these groups, we selected representative courses for the first pilots. This allowed the first bots to go live early while development work on the difficult cases was already under way.",
        "highlights": [
          "straightforward and challenging pilots in parallel"
        ]
      },
      {
        "title": "Evaluating quality in real use",
        "text": "We evaluated subject-matter and educational quality in several stages. Instructors assessed bot answers and answered learning questions themselves so we could compare the responses. After testing and improvements, we trialled the bots with real learners in individual course cohorts. Language models supported the analysis of chat conversations, helping identify topics, potential problems and signs of satisfaction or dissatisfaction. The findings informed further improvements.",
        "highlights": [
          "subject-matter and educational quality"
        ]
      },
      {
        "title": "Going live across more than 30 courses",
        "text": "When I left the company, TutorBots were live in Microsoft Teams for more than 30 courses. After testing and improvements, each new bot was introduced while further courses were already being prepared. Learners could use this additional support directly within their existing teaching environment.",
        "highlights": [
          "live in Microsoft Teams for more than 30 courses"
        ]
      }
    ],
    "summaryHighlights": [
      "course-specific AI chatbots for learning support"
    ],
    "markerTone": "green"
  },
  {
    "id": "belegungsoptimierung",
    "projectName": "Course utilisation optimisation",
    "title": "Optimising course sequences and utilisation",
    "shortTitle": "Optimising course sequences and utilisation",
    "summary": "I designed a combinatorial scheduling solution to improve course utilisation. I combined commercial goals, individual course preferences and educational requirements in a single model. Working with sales and the relevant departments, I established the right balance and led implementation by my team.",
    "role": "I clarified requirements with the relevant departments, designed the architecture and scoring system, and prioritised development stages. My team handled the programming.",
    "outcome": "23% better course utilisation on average, with the number of sales maintained.",
    "outcomeHighlights": [],
    "facts": [
      {
        "label": "My role",
        "value": "Requirements, architecture and prioritisation"
      },
      {
        "label": "Implementation",
        "value": "Programming by my team"
      },
      {
        "label": "Technology",
        "value": "Google OR-Tools and weighted optimisation"
      },
      {
        "label": "Status",
        "value": "Implemented for new enrolments and replanning after course cancellations"
      }
    ],
    "sections": [
      {
        "title": "Identifying the potential of better course scheduling",
        "text": "At karriere tutor, learners took individual combinations of courses with different durations and recurring start dates. I recognised that changing the order of these courses could improve the use of available course places. The aim was to reduce underfilled course cohorts and plan suitable individual course sequences.",
        "highlights": [
          "improve the use of available course places"
        ]
      },
      {
        "title": "Translating operational requirements into scheduling rules",
        "text": "Working with learner support and the relevant departments, I established the rules for individual course sequences. These had to account for the agreed start of a learner's training, uninterrupted course sequences, subject prerequisites and preferred order. Scheduling needed to meet commercial goals while providing an educationally sound sequence. These requirements formed the basis of the optimisation model.",
        "highlights": [
          "rules for individual course sequences"
        ]
      },
      {
        "title": "Distinguishing hard constraints from preferences",
        "text": "Initially, we treated every recorded rule as a hard constraint. In some cases, this left the optimiser unable to find a feasible sequence. I therefore distinguished hard constraints from preferences and developed a weighted scoring system. It balanced better utilisation against deviations from preferred sequences. This gave the optimiser more flexibility while hard constraints still had to be satisfied.",
        "highlights": [
          "distinguished hard constraints from preferences"
        ]
      },
      {
        "title": "Accounting for course preferences and sales goals",
        "text": "Freedom to choose the order of courses was a selling point. The sales team was concerned that restrictions could lead to fewer completed sales. Some learners wanted to take particular courses early in case they left training for a new job. Together with sales, I tested the right balance and incorporated individual course preferences into the scoring. Sales could specify preferred courses for the first three positions. The closer the calculated sequence came to those preferences, the higher its score.",
        "highlights": [
          "incorporated individual course preferences into the scoring"
        ]
      },
      {
        "title": "Taking responsibility for architecture and implementation",
        "text": "I designed the combinatorial scheduling solution, its architecture and scoring system. My team implemented it using Google OR-Tools. I was responsible for the business and technical decisions and refined the concept using practical feedback. The different requirements from sales, learner support and the relevant departments were brought together in the same model.",
        "highlights": [
          "combinatorial scheduling solution"
        ]
      },
      {
        "title": "Extending the solution in stages",
        "text": "I initially prioritised scheduling for new learners before they were booked onto courses and started their training. We then extended the application to replan when a course start was cancelled. This allowed the course sequences of all affected learners to be recalculated. Regular optimisation across all courses and all learners already enrolled remained a planned further stage.",
        "highlights": [
          "scheduling for new learners"
        ]
      },
      {
        "title": "Commercial impact",
        "text": "The solution achieved 23% better course utilisation on average, with the number of sales maintained.",
        "highlights": [
          "23% better course utilisation on average"
        ]
      }
    ],
    "summaryHighlights": [
      "combinatorial scheduling solution"
    ],
    "markerTone": "pink"
  }
];
window.HR_DOG_QUOTES = [
  "This is Sumi, my favourite reinforcement learning project.\nTen years of training. Reward: cheese.\nThese days, she gets the cheese without even sitting.\nThe technical term is reward hacking.",
  "Sumi, Chief Morale Officer. Does a lot of work behind the scenes.\nMore precisely, under my desk.",
  "Yes, this is a strategically placed picture of my dog.\nI know a thing or two about marketing.",
  "For Sumi, there are two kinds of people.\nFriends and the postman.",
  "Sumi, Head of Snacks. Never thinks outside the bowl.\nWhat’s in it is quite enough for her.",
  "My expert in non-verbal communication.\nSumi now uses that look on guests, too.\nTransfer learning works beautifully.",
  "Sumi. Open to any outcome,\nas long as the outcome is cheese.",
  "Our security officer barks when the doorbell rings on TV, too.\nA classic false positive."
];
window.HR_SITE_TITLE = "Hannah Reber · Digital Strategy & Transformation";
window.HR_UI = {"allCases": "All case studies", "motionOff": "Turn colour effects off", "motionOn": "Turn colour effects on"};
