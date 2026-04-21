# Personal Portfolio Website

A minimal, editorial, fashion-inspired portfolio website with an earthy pastel aesthetic.

## Features

- Clean, spacious layouts with generous white space
- Editorial typography using Playfair Display (serif) and Inter (sans-serif)
- Earthy pastel color palette (beige, sage green, clay, terracotta, dusty rose)
- Gallery-style project display
- Subtle animations and interactions
- Fully responsive design

## Getting Started

Simply open `index.html` in a web browser to view the portfolio.

## Customization

### Adding Your Projects

Replace the placeholder project items in `index.html` with your actual projects. Update the `.project-placeholder` divs with your images:

```html
<div class="project-image">
    <img src="your-image.jpg" alt="Project description">
</div>
```

### Updating Colors

Modify the CSS variables in `styles.css` under `:root` to customize the color palette.

### Typography

Fonts are loaded from Google Fonts. You can change them in the `<head>` section of `index.html` and update the CSS variables accordingly.

## Browser Support

Modern browsers that support CSS Grid, Flexbox, and ES6 JavaScript.
