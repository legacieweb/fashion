# Black and Pink Theme - Quick Reference Guide

## 🎨 Color Variables

### Primary Colors
```css
--black: #000000;
--hot-pink: #ec4899;
--light-pink: #f472b6;
--pink-text: #fce7f3;
```

### Transparent Variations
```css
--pink-bg-light: rgba(236, 72, 153, 0.05);
--pink-bg-medium: rgba(236, 72, 153, 0.1);
--pink-bg-dark: rgba(236, 72, 153, 0.3);
--pink-border: rgba(236, 72, 153, 0.3);
```

### Gradients
```css
--gradient-pink: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
--gradient-bg: linear-gradient(135deg, #000000 0%, #1a0a0f 25%, #2d0a1f 50%, #1a0a0f 75%, #000000 100%);
```

---

## 🎯 Common CSS Patterns

### Header with Gradient Logo
```css
header {
  background: #000000;
  border-bottom: 3px solid #ec4899;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

header h1 {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}
```

### Button Styling
```css
.btn-primary {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(236, 72, 153, 0.5);
}
```

### Card Styling
```css
.card {
  background: #000000;
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #ec4899;
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(236, 72, 153, 0.4);
}
```

### Input Fields
```css
input, textarea {
  background: rgba(236, 72, 153, 0.05);
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-radius: 12px;
  color: #ec4899;
  padding: 1rem;
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  background: rgba(236, 72, 153, 0.08);
}

input::placeholder, textarea::placeholder {
  color: rgba(236, 72, 153, 0.5);
}
```

### Glass Card Effect
```css
.glass-card {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 1px solid rgba(236, 72, 153, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
}
```

---

## 🎬 Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
```

### Slide In
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.5s ease-out forwards;
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) {
  /* Small devices (landscape phones) */
}

@media (min-width: 768px) {
  /* Medium devices (tablets) */
}

@media (min-width: 1024px) {
  /* Large devices (desktops) */
}

@media (min-width: 1280px) {
  /* Extra large devices (large desktops) */
}
```

---

## 🎨 Custom Scrollbar

```css
/* Webkit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #ec4899;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f472b6;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #ec4899 #000000;
}
```

---

## 🔧 Utility Classes

### Text Colors
```css
.text-pink-primary { color: #ec4899; }
.text-pink-light { color: #f472b6; }
.text-pink-lighter { color: #fce7f3; }
```

### Background Colors
```css
.bg-black { background: #000000; }
.bg-pink-transparent { background: rgba(236, 72, 153, 0.05); }
.bg-pink-gradient { background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); }
```

### Border Colors
```css
.border-pink { border-color: #ec4899; }
.border-pink-light { border-color: rgba(236, 72, 153, 0.3); }
```

---

## 💡 Usage Examples

### Product Card
```html
<div class="card">
  <img src="product.jpg" alt="Product" />
  <h3 class="text-pink-light">Product Name</h3>
  <p class="text-pink-primary">$99.99</p>
  <button class="btn-primary">Add to Cart</button>
</div>
```

### Form Input
```html
<div class="form-group">
  <label class="text-pink-primary">
    <i class="fas fa-user"></i> Full Name
  </label>
  <input type="text" placeholder="Enter your name" />
</div>
```

### Navigation Button
```html
<a href="cart.html" class="nav-btn">
  <i class="fas fa-shopping-cart"></i>
  Cart
</a>
```

---

## 🎯 Best Practices

1. **Always use transitions** for smooth interactions
2. **Maintain consistent spacing** using rem units
3. **Use rgba() for transparency** to layer effects
4. **Add hover states** to all interactive elements
5. **Include focus states** for accessibility
6. **Test on multiple devices** for responsiveness
7. **Use Font Awesome icons** for visual consistency
8. **Apply box-shadows** for depth and elevation
9. **Keep animations subtle** (0.3s duration)
10. **Use gradient text** for important headings

---

## 📦 Required Dependencies

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome 6.4.0 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- Google Fonts - Inter -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

---

## 🚀 Quick Start Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title - Iyonic Fashion</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * {
      font-family: 'Inter', sans-serif;
      scrollbar-width: thin;
      scrollbar-color: #ec4899 #000000;
    }

    body {
      background: #000000;
      color: #ec4899;
    }

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      background: #000000;
    }

    ::-webkit-scrollbar-thumb {
      background: #ec4899;
      border-radius: 5px;
    }

    /* Add your custom styles here */
  </style>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

---

*This reference guide provides all the essential CSS patterns and utilities for maintaining the black and pink theme across the Iyonic Fashion Store.*