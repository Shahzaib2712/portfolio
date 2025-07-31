#!/bin/bash
echo "Preparing project for production..."

# Create a production directory
mkdir -p production

# Copy essential files and directories
cp -r css/ production/
cp -r js/ production/
cp -r images/ production/ 2>/dev/null || true
cp index.php production/
cp favicon.png production/
cp robots.txt production/
cp sitemap.xml production/
cp site.webmanifest production/

# Remove any development files from the production directory
find production -name "*.map" -type f -delete
find production -name "*.scss" -type f -delete

# Create a zip file of the production-ready site
zip -r portfolio-production.zip production/

echo "\nProduction files are ready in the 'production' directory."
echo "A zip file 'portfolio-production.zip' has been created for easy transfer."
echo "\nYou can now upload the contents of the 'production' directory to your web server."
