# Brand Rules & Design Guidelines

## Brand Identity

AffordableStuffStore represents accessible, modern e-commerce with a focus on user experience and affordability.

## Design Principles

1. **Simplicity**: Clean, uncluttered interfaces
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Consistency**: Unified design language across all pages
4. **Responsiveness**: Mobile-first design approach
5. **Performance**: Fast loading, smooth animations

## Color Palette

### Primary Colors

The application uses HeroUI's theme system with Tailwind CSS 4. Colors are defined through the theme configuration.

```typescript
// Primary color usage examples
- Primary actions: Button, links
- Interactive elements: Active states, focus indicators
```

### Semantic Colors

- **Success**: Positive actions, confirmations
- **Warning**: Cautionary messages, alerts
- **Danger**: Error states, destructive actions
- **Default**: Neutral elements

### Accessibility

- All color combinations meet WCAG AA contrast ratios (4.5:1 for normal text)
- Color is never the only means of conveying information
- Focus indicators are always visible

## Typography

### Font Family

Uses system fonts for optimal performance and native feel:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Scales

- **Headings**: Use HeroUI's `title()` primitive
- **Body Text**: Default system font size (16px base)
- **Small Text**: Used for captions and metadata

### Font Weights

- **Regular (400)**: Body text
- **Medium (500)**: Emphasized text
- **Semibold (600)**: Subheadings
- **Bold (700)**: Headings

## Spacing

Follows Tailwind CSS spacing scale (based on 0.25rem increments):

- **Extra Small**: `gap-1` (0.25rem)
- **Small**: `gap-2` (0.5rem)
- **Medium**: `gap-4` (1rem)
- **Large**: `gap-8` (2rem)
- **Extra Large**: `gap-12` (3rem)

## Components

### Buttons

- Use HeroUI Button component
- Variants: solid, bordered, light, flat, faded, shadow, ghost
- Sizes: sm, md, lg
- Always include accessible labels

### Navigation

- Consistent navigation across all pages
- Mobile menu for responsive design
- Active state indicators for current page
- Keyboard navigation support

### Forms

- Clear labels for all inputs
- Inline validation messages
- Disabled states clearly indicated
- Error states with helpful messages

### Cards & Containers

- Consistent border radius
- Subtle shadows for elevation
- Adequate padding for content
- Responsive width constraints

## Animation Guidelines

### Timing

- **Fast**: 150ms for micro-interactions
- **Medium**: 300ms for component transitions
- **Slow**: 500ms for page transitions

### Easing

Use Framer Motion's default easing or customize:

```typescript
// Smooth, natural motion
easing: [0.4, 0.0, 0.2, 1]
```

### Performance

- Use GPU-accelerated properties (transform, opacity)
- Avoid animating layout properties
- Reduce motion for users who prefer it (respect `prefers-reduced-motion`)

## Iconography

- Consistent icon style across application
- Appropriate icon size relative to context
- Icons always paired with text labels for clarity
- SVG format for scalability

## Responsive Design

### Breakpoints

Following Tailwind CSS defaults:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach

- Design for mobile screens first
- Progressive enhancement for larger screens
- Touch-friendly tap targets (minimum 44x44px)

## Internationalization

### Text

- Support for multiple languages
- RTL language support (Arabic, Hebrew)
- Dynamic text expansion considerations
- Date, time, and number formatting per locale

### Cultural Considerations

- Avoid culture-specific idioms
- Use universal icons where possible
- Consider regional color meanings

## Accessibility Standards

### WCAG 2.1 AA Compliance

- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Alternative text for images
- ✅ Semantic HTML

### Best Practices

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard-only navigation works
- Test with screen readers
- Support browser zoom up to 200%

## Content Guidelines

### Voice & Tone

- **Clear**: Simple, direct language
- **Friendly**: Approachable and helpful
- **Concise**: Respect user's time
- **Professional**: Trustworthy and reliable

### Writing Style

- Use active voice
- Keep sentences short
- Avoid jargon
- Use consistent terminology

## Logo Usage

*To be defined when brand assets are created*

## Do's and Don'ts

### Do

✅ Use consistent spacing throughout
✅ Follow the established color palette
✅ Ensure all interactive elements are accessible
✅ Test on multiple devices and browsers
✅ Maintain component hierarchy

### Don't

❌ Create custom colors outside the theme
❌ Use absolute positioning unless necessary
❌ Override core component styles arbitrarily
❌ Ignore accessibility guidelines
❌ Mix different design patterns

---

## Unknown Unknowns Radar 🔮

### Potential Risks & Considerations

- **Brand Evolution**: Logo, colors, and brand identity may evolve over time
- **Design System Updates**: HeroUI updates may introduce breaking design changes
- **Accessibility Regulations**: New accessibility laws may require additional compliance
- **Cultural Sensitivities**: Expanding to new markets may require brand adjustments
- **Dark Mode**: No dark mode strategy currently defined
- **Custom Theming**: User-customizable themes not specified
- **Print Styles**: No print stylesheet guidelines defined
- **Animation Performance**: Complex animations on low-end devices
- **Icon Library**: No standardized icon library specified
- **Component Variants**: Need for new component variants as features grow
