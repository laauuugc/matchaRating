# Matcha Quality Rater

A modern, AI-powered web application for assessing matcha tea quality through image analysis. Built with vanilla HTML, CSS, and JavaScript, this single-page application provides an intuitive interface for capturing, analyzing, and tracking matcha quality over time.

## 🌟 Features

### Core Functionality

- **Camera Capture**: Take photos directly using your device's camera
- **File Upload**: Drag & drop or select images from your device
- **AI Analysis**: Simulated AI-powered quality assessment (0-10 scale)
- **Quality Factors**: Analyzes color vibrancy, powder texture, froth quality, and consistency
- **Grade System**: Letter grades (A-F) with detailed explanations

### Gallery Management

- **Photo Gallery**: Grid layout with thumbnails and ratings
- **Search & Filter**: Find images by rating, date, or description
- **Sort Options**: Sort by date (newest/oldest) or rating (highest/lowest)
- **Image Modal**: Click to enlarge and view detailed ratings
- **Delete Function**: Remove individual photos from gallery

### Statistics & Analytics

- **Progress Tracking**: Total photos, average rating, best rating, days active
- **Rating Distribution**: Visual chart showing rating ranges
- **Trend Analysis**: Recent ratings trend chart
- **Quality Tips**: Personalized improvement suggestions based on your data
- **Export Reports**: Download comprehensive assessment reports

### User Experience

- **Responsive Design**: Works seamlessly on mobile and desktop
- **Modern UI**: Matcha-themed color palette with smooth animations
- **Local Storage**: All data saved locally in your browser
- **Loading States**: Visual feedback during image processing
- **Toast Notifications**: Success, error, and info messages
- **Keyboard Shortcuts**: ESC key to close modals and camera

## 🎨 Design

### Color Palette

- **Primary Green**: #2d5a27 (Deep matcha green)
- **Secondary Green**: #4a7c59 (Medium green)
- **Light Green**: #7fb069 (Bright green)
- **Pale Green**: #a7c957 (Soft green)
- **Cream**: #f5f5dc (Warm cream)
- **Earth Tones**: Browns and warm colors for contrast

### UI Components

- **Cards**: Clean, elevated design with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Progress Bars**: Visual representation of quality factors
- **Modals**: Overlay dialogs for image viewing
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Modern web browser with camera access
- No additional software or dependencies required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Grant camera permissions when prompted
4. Start capturing and analyzing matcha photos!

### Browser Compatibility

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Usage Guide

### Taking Photos

1. **Camera Method**:
   - Click "Open Camera" button
   - Position your matcha in the frame
   - Click "Capture Photo" when ready
2. **File Upload**:
   - Drag & drop an image onto the upload area
   - Or click the upload area to select a file
   - Supported formats: JPEG, PNG, WebP

### Analyzing Quality

1. After capturing/uploading an image, click "Analyze Matcha Quality"
2. Wait for the AI analysis (simulated 2-second delay)
3. Review the detailed assessment:
   - Overall score (0-10) and letter grade (A-F)
   - Individual factor scores with progress bars
   - Confidence level indicator
   - Detailed explanation of findings

### Managing Your Gallery

1. **Viewing**: Switch to the Gallery tab to see all your assessments
2. **Searching**: Use the search box to find specific images
3. **Sorting**: Choose from date or rating-based sorting options
4. **Enlarging**: Click any image to view it in full size
5. **Deleting**: Use the trash icon to remove unwanted photos

### Tracking Progress

1. **Statistics**: Visit the Statistics tab for overview metrics
2. **Charts**: View rating distribution and trend analysis
3. **Tips**: Get personalized improvement suggestions
4. **Export**: Download your assessment history as a JSON report

## 🔧 Technical Details

### Architecture

- **Single Page Application**: All functionality in one HTML file
- **Vanilla JavaScript**: No frameworks or external dependencies
- **Local Storage**: Data persistence using browser's localStorage API
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

### Key Technologies

- **HTML5**: Semantic markup with modern features
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript ES6+**: Async/await, modules, modern APIs
- **Web APIs**: MediaDevices, File API, Canvas API, LocalStorage

### Data Structure

```javascript
{
  id: timestamp,
  data: base64ImageData,
  date: ISOString,
  rating: {
    score: number,
    grade: string,
    colorVibrancy: number,
    powderTexture: number,
    frothQuality: number,
    consistency: number,
    confidence: string,
    explanation: string
  }
}
```

## 🎯 Quality Assessment Factors

### Color Vibrancy (0-10)

- **9-10**: Bright, natural green with excellent saturation
- **7-8**: Good green color with slight dullness
- **5-6**: Moderate green, may appear faded
- **0-4**: Dull, brownish, or unnatural color

### Powder Texture (0-10)

- **9-10**: Fine, smooth powder with no clumps
- **7-8**: Mostly fine with minor clumping
- **5-6**: Some clumping, moderate texture
- **0-4**: Coarse, heavily clumped powder

### Froth Quality (0-10)

- **9-10**: Thick, creamy froth with fine bubbles
- **7-8**: Good froth with some larger bubbles
- **5-6**: Moderate froth, may be thin
- **0-4**: Little to no froth formation

### Consistency (0-10)

- **9-10**: Perfectly smooth, no separation
- **7-8**: Mostly smooth with minor inconsistencies
- **5-6**: Some separation or graininess
- **0-4**: Poor consistency, watery or clumpy

## 📊 Rating System

### Score to Grade Conversion

- **9.0-10.0**: A (Excellent)
- **8.0-8.9**: B (Very Good)
- **7.0-7.9**: C (Good)
- **6.0-6.9**: D (Fair)
- **0.0-5.9**: F (Poor)

### Confidence Levels

- **High**: Score ≥ 8.0 or ≤ 2.0
- **Medium**: Score between 4.0-8.0
- **Low**: Score between 2.0-4.0

## 🔒 Privacy & Data

### Local Storage

- All images and ratings are stored locally in your browser
- No data is sent to external servers
- Data persists until browser cache is cleared
- Export feature allows you to backup your data

### Camera Access

- Camera permissions are requested only when needed
- Video stream is stopped immediately after capture
- No video data is stored or transmitted

## 🛠️ Customization

### Styling

- Modify CSS custom properties in `:root` for color changes
- Adjust animations by modifying transition variables
- Customize spacing and layout in the CSS file

### Functionality

- Add new quality factors in the `generateMatchaRatings()` function
- Modify rating algorithms in the analysis functions
- Extend export formats in the `exportReport()` function

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**: Check browser permissions and HTTPS requirement
2. **Images not saving**: Ensure localStorage is enabled in your browser
3. **Slow performance**: Close other tabs to free up memory
4. **Layout issues**: Try refreshing the page or clearing browser cache

### Browser-Specific Notes

- **Safari**: May require HTTPS for camera access
- **Firefox**: File upload may have different behavior
- **Mobile**: Touch interactions optimized for mobile devices

## 🤝 Contributing

This is a demonstration project, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Matcha enthusiasts worldwide for inspiration

---

**Enjoy your matcha journey! 🍵✨**
