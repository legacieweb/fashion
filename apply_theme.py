#!/usr/bin/env python3
"""
Script to apply black and pink theme to all category pages
"""

import os
import re

# List of category pages to update
category_pages = [
    'activewear.html', 'bottoms.html', 'dress.html', 'graphics.html',
    'hats.html', 'hoodies.html', 'jacket.html', 'jeans.html',
    'jumpsuites.html', 'lougewear.html', 'matchingsets.html',
    'rompers.html', 'scrubs.html', 'shoulderbag.html', 'skirts.html',
    'sweamwear.html', 'sweaters.html'
]

# The CSS theme to inject
theme_css = '''  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    /* Black and Pink Theme */
    * {
      scrollbar-width: thin;
      scrollbar-color: #ec4899 #000000;
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

    ::-webkit-scrollbar-thumb:hover {
      background: #f472b6;
    }

    body {
      background: #000000 !important;
      color: #ec4899 !important;
    }

    /* Header */
    header {
      background: #000000 !important;
      border-bottom: 3px solid #ec4899 !important;
      box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3) !important;
    }

    header h1 {
      background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800 !important;
    }

    header a, header button {
      background: rgba(236, 72, 153, 0.1) !important;
      color: #ec4899 !important;
      border: 2px solid rgba(236, 72, 153, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    header a:hover, header button:hover {
      background: rgba(236, 72, 153, 0.2) !important;
      border-color: #ec4899 !important;
      transform: translateY(-2px);
    }

    /* Search Bar */
    .bg-white {
      background: #000000 !important;
      border-bottom: 2px solid rgba(236, 72, 153, 0.3) !important;
    }

    input {
      background: rgba(236, 72, 153, 0.05) !important;
      border: 2px solid rgba(236, 72, 153, 0.3) !important;
      color: #ec4899 !important;
    }

    input::placeholder {
      color: rgba(236, 72, 153, 0.5) !important;
    }

    input:focus {
      outline: none !important;
      border-color: #ec4899 !important;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2) !important;
    }

    /* Breadcrumb */
    .bg-gray-100 {
      background: rgba(236, 72, 153, 0.05) !important;
      border-bottom: 2px solid rgba(236, 72, 153, 0.2) !important;
    }

    nav a {
      color: #f472b6 !important;
    }

    nav a:hover {
      color: #ec4899 !important;
    }

    /* Product Grid */
    .bg-gray-50 {
      background: #000000 !important;
    }

    .product-item {
      background: #000000 !important;
      border: 2px solid rgba(236, 72, 153, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .product-item:hover {
      border-color: #ec4899 !important;
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(236, 72, 153, 0.4) !important;
    }

    .product-item h3 {
      color: #f472b6 !important;
    }

    .product-item img {
      border-bottom: 2px solid rgba(236, 72, 153, 0.2);
    }

    .shadow {
      box-shadow: 0 10px 40px rgba(236, 72, 153, 0.2) !important;
    }

    .text-pink-600 {
      color: #f472b6 !important;
    }

    .text-gray-400 {
      color: rgba(236, 72, 153, 0.6) !important;
    }
  </style>'''

base_dir = 'd:/desktop/fashionstore'

for page in category_pages:
    file_path = os.path.join(base_dir, page)
    
    if not os.path.exists(file_path):
        print(f"⚠️  Skipping {page} - file not found")
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Font Awesome is already included
        if 'font-awesome' not in content:
            # Add Font Awesome and theme CSS after the tailwind script
            content = content.replace(
                '<script src="https://cdn.tailwindcss.com"></script>',
                '<script src="https://cdn.tailwindcss.com"></script>\n' + theme_css
            )
        elif '<style>' not in content or 'Black and Pink Theme' not in content:
            # Add only the theme CSS if Font Awesome exists but theme doesn't
            content = content.replace(
                '</head>',
                theme_css + '\n</head>'
            )
        else:
            print(f"✓ {page} already has the theme")
            continue
        
        # Write the updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated {page}")
    
    except Exception as e:
        print(f"✗ Error updating {page}: {str(e)}")

print("\n✨ Theme application complete!")