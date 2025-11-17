# Court Justice Game

A courtroom judgment simulation game where you act as a judge, evaluating evidence, testimonies, and visual clues to determine guilt or innocence.

## Features

- **Case Evaluation**: Review prosecutor arguments, defense arguments, and jury input
- **Visual Detective Work**: Discover hidden body language and appearance clues on characters
- **Economy System**: Earn 50 coins for correct verdicts, lose 10 coins for incorrect verdicts
- **Customization**: Spend coins on courtroom themes, gavel designs, and more
- **Statistics Tracking**: Monitor your performance with detailed statistics
- **Persistent Storage**: Game progress automatically saved using IndexedDB

## Getting Started

### Prerequisites

- Node.js 18+ or npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder, ready for static hosting.

### Preview Production Build

```bash
npm run preview
```

## How to Play

1. **Start a New Case**: Click "New Case" from the main menu
2. **Review Evidence**: Click through the tabs to review:
   - Case Overview and description
   - Physical and documentary evidence
   - Testimonies from prosecution and defense
   - Jury opinions
3. **Find Visual Clues**: Hover over characters in the courtroom to discover hidden clues about their behavior
4. **Render Your Verdict**: When ready, click "Render Verdict" and choose Guilty or Not Guilty
5. **Earn Coins**: Get 50 coins for correct verdicts, lose 10 for incorrect ones
6. **Customize**: Visit the shop to purchase courtroom themes, gavels, robes, and decorations
7. **Track Progress**: Check your statistics to see your win rate and case history

## Game Mechanics

### Evidence System
- Each piece of evidence has a **weight** (1-10) indicating its importance
- Evidence can point to guilt or innocence
- Consider the type: physical, documentary, or testimony

### Testimony Analysis
- Each testimony has a **credibility score** (1-10)
- Look for contradictions that might indicate dishonesty
- Compare prosecution and defense arguments

### Visual Clues
- Hover over characters to discover hidden clues
- Clues may reveal nervousness, confidence, or deception
- The more clues you find, the better your judgment

### Jury Opinion
- The jury isn't always right!
- Use their opinion as one factor among many
- A split jury might indicate a difficult case

## Technical Stack

- **React 18+** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **IndexedDB** for persistent storage
- **localStorage** for settings backup

## Project Structure

```
court.apps.cafe/
├── public/
│   └── data/
│       ├── cases.json              # Case templates
│       └── customizationItems.json # Shop items
├── src/
│   ├── components/
│   │   ├── courtroom/              # Courtroom view components
│   │   ├── game/                   # Game logic components
│   │   ├── layout/                 # Layout components
│   │   ├── menu/                   # Menu screens
│   │   ├── shop/                   # Customization shop
│   │   └── ui/                     # Reusable UI components
│   ├── contexts/                   # React contexts
│   ├── services/                   # Business logic services
│   ├── styles/                     # Global styles
│   └── types/                      # TypeScript definitions
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Adding New Cases

Edit `public/data/cases.json` to add new cases. Each case should include:
- Basic info (title, description, difficulty)
- Correct verdict
- Evidence items
- Testimonies
- Visual clues

Example:
```json
{
  "id": "case_new",
  "title": "Your Case Title",
  "description": "Case description",
  "difficulty": "medium",
  "correctVerdict": "guilty",
  "evidence": [...],
  "testimonies": [...]
}
```

## Deployment

This is a static site that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Simply run `npm run build` and upload the `dist` folder.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

IndexedDB is required for game persistence.

## License

MIT

## Credits

Created following the comprehensive implementation plan in PLAN.md
