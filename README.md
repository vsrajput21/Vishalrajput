# Vishal's Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and professional design with smooth animations
- **Sections**: Home, About, Skills, Portfolio, Testimonials, and Contact
- **Interactive Elements**: Animated skill bars, portfolio filtering, testimonial slider
- **Contact Form**: Fully functional contact form with validation
- **Project Details Modal**: Detailed information about projects in modal windows
- **Performance Optimized**: Lazy loading images and optimized animations
- **SEO Ready**: Proper meta tags and semantic HTML

## File Structure

```
├── index.html             # Main HTML file
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
├── images/
│   ├── portfolio/         # Portfolio project images
│   │   └── vishal.svg   # Profile image
│   └── testimonials/      # Testimonial client images
├── assets/
│   └── Uday-Resume.pdf    # Downloadable CV
└── README.md              # Project documentation
```

## Setup Instructions

1. Make sure you have all the files in the correct directory structure.

2. For portfolio images:
   - Add your project images to the `images/portfolio/` directory
   - Add detailed project images with "-details" suffix for modals
   - Recommended size: 600x400px

3. For testimonial images:
   - Add client photos to the `images/testimonials/` directory
   - Name them `client1.jpg`, `client2.jpg`, etc.
   - Recommended size: 200x200px (they will be displayed as circles)

4. Add your resume:
   - Place your resume PDF in the `assets/` directory
   - Name it `Uday-Resume.pdf` or update the link in index.html

5. Open `index.html` in a web browser to view the website.

## Performance Optimizations

- **Lazy Loading**: Images are loaded only when needed
- **Debounced Scroll Events**: Prevents performance issues when scrolling
- **Optimized Animations**: Using will-change and content-visibility properties
- **Reduced Particle Count on Mobile**: Better performance on smaller devices
- **Batched DOM Operations**: Fragment-based DOM updates for better performance

## Customization

### Colors

You can easily change the color scheme by modifying the CSS variables in the `:root` selector in `style.css`:

```css
:root {
    --primary-color: #0078ff;     /* Main accent color */
    --secondary-color: #005fcc;   /* Secondary accent color */
    --dark-color: #222831;        /* Text color */
    --light-color: #f8f9fa;       /* Background color */
    /* Other variables... */
}
```

### Fonts

The website uses Google Fonts:
- 'Poppins' for body text
- 'Playfair Display' for headings

To change the fonts, update the Google Fonts link in the `<head>` of `index.html` and modify the font-family properties in `style.css`.

## Browser Support

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Credits

- Font Awesome for icons
- Google Fonts for typography

## License

This project is available for personal use.