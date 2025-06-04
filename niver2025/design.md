## Design System

### Color Palette
- **Primary Colors**
  - Purple: `theme.colors.purple[500]` - Main brand color
  - Red: `theme.colors.red[500]` - Warning/Alert states
  - Yellow: `theme.colors.yellow[400]` - Caution states
  - Green: `theme.colors.green[500]` - Success states

### Typography
- **Headings**
  - Page Title: `fontSize="xl" fontWeight="600"`
  - Card Headers: `fontSize="md" fontWeight="600"`
  - Metric Values: `fontSize="2xl" fontWeight="bold"`

- **Body Text**
  - Regular: `fontSize="md"`
  - Secondary: `fontSize="sm" color="gray.500"`
  - Small: `fontSize="xs"`

## Components

### 1. Profile Section
```html
<div class="profile-section">
    <img src="..." alt="Profile Image" class="profile-image">
    <h1>Name</h1>
    <p class="subtitle">Subtitle</p>
</div>
```
- Centered profile image with rounded corners
- Large title text
- Subtitle with secondary styling

### 2. Countdown Section
```html
<div class="countdown-section">
    <h2>Faltam</h2>
    <div class="countdown-container">
        <div class="countdown-item">
            <span id="days">00</span>
            <span class="countdown-label">Dias</span>
        </div>
        <!-- Other countdown items -->
    </div>
</div>
```
- Grid layout for countdown items
- Large numbers for time units
- Small labels for time units
- Responsive design

### 3. Form Components
```html
<div class="form-group">
    <label for="input">Label</label>
    <input type="text" id="input" required>
</div>
```
- Clean input fields with labels
- Required field indicators
- Consistent spacing and padding

### 4. Music Search Component
```html
<div class="music-search-container">
    <div class="search-input-wrapper">
        <svg class="search-icon">...</svg>
        <input type="text" id="musicSearch" placeholder="Busque uma música...">
    </div>
    <div id="searchResults" class="search-results"></div>
</div>
```
- Search input with icon
- Dynamic search results display
- Suggested music list

## Layout Patterns

### 1. Container Structure
```html
<div class="container">
    <div class="content">
        <!-- Main content sections -->
    </div>
</div>
```
- Centered container layout
- Consistent padding and margins
- Clear visual hierarchy

### 2. Responsive Design
- Mobile-first approach
- Flexible layouts
- Adaptive content sections

## Interactive Elements

### 1. Buttons
```html
<button type="submit" class="submit-button">
    <span class="button-text">Button Text</span>
    <span class="loading-spinner">Loading...</span>
</button>
```
- Primary action buttons
- Loading states
- Hover effects

### 2. Form Interactions
- Dynamic form fields
- Add/remove name fields
- Real-time validation

## Best Practices

1. **Spacing**
   - Consistent padding and margins
   - Clear section separation
   - Proper form field spacing

2. **Typography**
   - Clear hierarchy
   - Readable font sizes
   - Consistent font weights

3. **Colors**
   - Brand color consistency
   - Semantic color usage
   - Accessible contrast ratios

4. **Responsiveness**
   - Mobile-first design
   - Flexible layouts
   - Adaptive components

5. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## Notes
- Uses Chakra UI for base styling
- Custom CSS for specific components
- Responsive design patterns
- Progressive enhancement
- Modern web standards