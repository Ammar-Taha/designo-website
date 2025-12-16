# Designo - Multi-Page Agency Website

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-00D9FF?style=for-the-badge&logo=vercel&logoColor=white)](https://ammar-taha.github.io/designo-website/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ammar-Taha/designo-website)

![Designo Website Preview](./assets/preview.jpg)

A fully responsive, multi-page website for Designo, a digital agency specializing in web design, app design, and graphic design. Built as a solution to the [Frontend Mentor Designo challenge](https://www.frontendmentor.io/challenges/designo-multipage-website-G0cq5BZd-w).

## ✨ Features

- **Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Multi-Page Navigation** - Seamless routing between 7 different pages
- **Interactive Components** - Hover states, form validation, and dynamic UI elements
- **Component-Based Architecture** - Reusable header, footer, and contact components
- **Modern CSS Architecture** - Organized with CSS layers, custom properties, and utility classes
- **Performance Optimized** - Fast loading times with optimized assets and efficient code structure
- **Accessible** - Semantic HTML and ARIA labels for better accessibility

## 📄 Pages

1. **Home** - Hero section, featured projects, and company characteristics
2. **About** - Company story, world-class talent, and real deal sections
3. **Locations** - Office locations in Canada, Australia, and United Kingdom
4. **Contact** - Contact form with validation
5. **Web Design** - Portfolio showcase of web design projects
6. **App Design** - Portfolio showcase of mobile app design projects
7. **Graphic Design** - Portfolio showcase of graphic design projects

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern CSS features including:
  - CSS Custom Properties (Variables)
  - CSS Layers (`@layer`)
  - CSS Grid & Flexbox
  - Responsive design with clamp() and media queries
- **JavaScript (ES6+)** - Component loading and form validation
- **Vite** - Build tool and development server
- **Normalize.css** - CSS reset for cross-browser consistency

## 📦 Project Structure

```
├── assets/              # Images, icons, and static assets
├── src/
│   ├── components/     # Reusable HTML components (header, footer, contact)
│   ├── pages/          # Individual page HTML files
│   ├── styles/         # CSS files organized by page and purpose
│   │   ├── base.css    # Shared components and utilities
│   │   ├── home.css    # Home page styles
│   │   ├── web-design.css
│   │   ├── app-design.css
│   │   └── ...
│   ├── fonts/          # Custom font files (Jost)
│   ├── utils/          # Utility functions
│   └── main.js         # Main JavaScript entry point
├── index.html          # Home page
└── package.json        # Project dependencies
```

## 🎨 Design System

### Colors

- **Primary**: `hsl(11, 72%, 66%)` - Peach/Coral
- **Primary Light**: `hsl(11, 100%, 80%)`
- **Primary Lighter**: `hsl(11, 100%, 90%)`
- **Dark Gray**: `hsl(260, 6%, 20%)`
- **Light Gray**: `hsl(210, 17%, 95%)`
- **White**: `hsl(0, 0%, 100%)`
- **Black**: `hsl(270, 4%, 11%)`

### Typography

- **Font Family**: Jost (400, 500, 700)
- **Responsive Font Sizes**: Using `clamp()` for fluid typography

### Components

- **Banner** - Hero sections with background patterns
- **Library Card** - Reusable project card component
- **Project Card** - Interactive project showcase cards
- **Contact Section** - Call-to-action component
- **Navigation** - Responsive header with mobile menu

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ammar-Taha/designo-website.git
```

2. Navigate to the project directory:

```bash
cd designo-website
```

3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Desktop**: 976px and above
- **Tablet**: 670px - 975px
- **Mobile**: Below 670px

## 🎯 Key Features Implementation

### Form Validation

- Real-time validation for contact form
- Error messages for empty fields
- Email format validation
- User-friendly error states

### Component Loading

- Dynamic component loading for header, footer, and contact sections
- Maintains consistent navigation across all pages

### Responsive Images

- Picture elements with multiple source sets
- Optimized images for different screen sizes
- Proper lazy loading implementation

## 🔧 CSS Architecture

The project follows a modular CSS architecture:

- **Base Styles** (`base.css`) - Global styles, utilities, and reusable components
- **Page-Specific Styles** - Individual CSS files for each page
- **CSS Layers** - Organized with `@layer` for better cascade control
- **Custom Properties** - Design tokens for colors, spacing, and typography
- **Utility Classes** - Reusable utility classes for common patterns

## 📝 Code Quality

- Semantic HTML5 elements
- BEM-inspired naming convention
- DRY (Don't Repeat Yourself) principles
- Mobile-first responsive design
- Accessible markup and ARIA labels

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is a solution to a Frontend Mentor challenge. The design files are property of Frontend Mentor and should not be shared.

## 🙏 Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for the design challenge
- Design files and assets provided by Frontend Mentor
