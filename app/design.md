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

### 1. Page Header
```tsx
<PageHeader title="Relatórios" icon={<CircleGauge />} />
```
- Uses the common `PageHeader` component
- Includes an icon from Lucide React
- Maintains consistent spacing with `py="26px"`

### 2. Card Components
```tsx
<Card
  cursor="pointer"
  transition="transform 0.3s, box-shadow 0.3s"
  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
>
  <CardHeader bgColor="purple.50">
    {/* Header content */}
  </CardHeader>
  <Divider m="0" color="gray.200" />
  <CardBody py="14px">
    {/* Body content */}
  </CardBody>
</Card>
```
- Interactive cards with hover effects
- Consistent padding and spacing
- Subtle background colors for headers
- Clean dividers between sections

### 3. Grid Layout
```tsx
<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
  {/* Grid items */}
</SimpleGrid>
```
- Responsive grid system
- Adapts to different screen sizes
- Consistent spacing between items

### 4. Data Visualization
```tsx
<Doughnut
  data={doughnutData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  }}
/>
```
- Uses Chart.js for data visualization
- Custom styling for doughnut charts
- Consistent color scheme based on data values

### 5. Status Indicators
```tsx
<Box
  position="absolute"
  top="12px"
  right="12px"
  width="12px"
  height="12px"
  borderRadius="full"
  bg="green.500"
  zIndex="1"
/>
```
- Small circular indicators
- Positioned absolutely within cards
- Color-coded for different states

## Layout Patterns

### 1. Container Structure
```tsx
<Container py="26px">
  <Flex justify="space-between" align="center" mb={4}>
    {/* Header content */}
  </Flex>
  {/* Main content */}
</Container>
```
- Consistent padding and margins
- Flexible layouts using Flex components
- Clear visual hierarchy

### 2. Responsive Design
- Mobile-first approach
- Breakpoints:
  - Base: 1 column
  - SM: 2 columns
  - MD: 4 columns

## Interactive Elements

### 1. Hover States
```tsx
_hover={{ 
  transform: 'translateY(-5px)', 
  boxShadow: 'lg' 
}}
```
- Subtle elevation on hover
- Smooth transitions
- Enhanced shadow for depth

### 2. Clickable Elements
- Cursor pointer for interactive elements
- Clear visual feedback
- Consistent transition effects

## Best Practices

1. **Spacing**
   - Use consistent spacing units
   - Maintain proper padding in cards and containers
   - Clear visual separation between elements

2. **Typography**
   - Clear hierarchy with different font sizes
   - Consistent use of font weights
   - Proper line heights for readability

3. **Colors**
   - Use theme colors for consistency
   - Semantic color usage (success, warning, error)
   - Subtle backgrounds for different sections

4. **Responsiveness**
   - Mobile-first approach
   - Flexible grid system
   - Adaptive layouts

5. **Accessibility**
   - Clear contrast ratios
   - Proper heading hierarchy
   - Semantic HTML structure

## Component Usage Examples

### Metric Card
```tsx
<Flex direction="column">
  <Text fontSize="2xl" fontWeight="bold">
    {value}
  </Text>
  <Text fontSize="sm" color="gray.500">
    {label}
  </Text>
</Flex>
```

### Month Selector
```tsx
<Flex align="center">
  <IconButton
    icon={<ChevronLeft />}
    onClick={() => handleMonthChange('prev')}
  />
  <Text mx={4}>{selectedMonth}</Text>
  <IconButton
    icon={<ChevronRight />}
    onClick={() => handleMonthChange('next')}
  />
</Flex>
```

## Notes
- All components use Chakra UI's built-in styling system
- Maintain consistent spacing using Chakra's spacing scale
- Use theme colors for brand consistency
- Implement responsive design patterns
- Follow accessibility guidelines
`