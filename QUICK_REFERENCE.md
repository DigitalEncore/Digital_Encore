# Digital Encore - Quick Reference Guide

## 🚀 **Quick Commands**

### **Git Commands**
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Check status
git status

# View changes
git diff
```

### **Testing Commands**
```bash
# Open website locally
# Just open index.html in browser

# Test form submission
# Fill out any form and submit

# Check console for errors
# F12 → Console tab
```

## 📧 **Form Configuration**

### **EmailJS Settings**
- **Service ID:** `service_lzcfyrv`
- **Public Key:** `b3HVcRXicSj4JkoTl`
- **Template ID:** `template_ruvnjn8`
- **Email:** `vanjerson2@gmail.com`

### **Google Sheets Settings**
- **Web App URL:** `https://script.google.com/macros/s/AKfycbxVGZVgtyD5046yV514p1L1YTNblDI8C4gyJXrXYDcfOWtET6b2Khyw83bWHkDWc12iOQ/exec`
- **Sheet URL:** `https://docs.google.com/spreadsheets/d/1vICIsXnQZt1M4cTQfr3kN_ZdcoSH13rD4wKopzQ5TYk/edit`

## 🎨 **Common Customizations**

### **Change Colors**
Edit `styles.css` - find these lines:
```css
:root {
  --encore-primary-600: #3b82f6;  /* Change this */
  --encore-accent-600: #8b5cf6;   /* Change this */
}
```

### **Update Hero Text**
Edit `index.html` - find this section:
```html
<h1 class="encore-hero-title">
    <span class="encore-hero-highlight">Smarter websites.</span>
    <span class="encore-hero-highlight intelligent-systems">Intelligent systems.</span>
    <span class="encore-hero-highlight">Better customer experiences.</span>
</h1>
```

### **Add New Service**
Edit `services.html` - find services section and add:
```html
<div class="encore-service-card">
    <div class="encore-service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3 class="encore-service-title">Service Name</h3>
    <p class="encore-service-description">Service description...</p>
</div>
```

### **Update Contact Info**
Edit footer in any HTML file:
```html
<a href="mailto:vanjerson2@gmail.com">vanjerson2@gmail.com</a>
<a href="https://facebook.com/profile.php?id=61581463806154">Facebook</a>
```

## 🔧 **Troubleshooting**

### **Form Not Working**
1. **Check browser console** (F12 → Console)
2. **Verify EmailJS is loaded** - should see no errors
3. **Test with simple data** - fill all required fields
4. **Check network tab** - look for failed requests

### **Google Sheets Not Saving**
1. **Check Google Apps Script** - go to script.google.com
2. **View execution logs** - look for errors
3. **Test Web App URL** - visit URL directly
4. **Check sheet permissions** - ensure it's accessible

### **Styling Issues**
1. **Check CSS syntax** - look for missing brackets
2. **Clear browser cache** - Ctrl+F5
3. **Check responsive design** - test different screen sizes
4. **Validate HTML** - ensure proper structure

### **Mobile Issues**
1. **Test on actual device** - not just browser dev tools
2. **Check touch interactions** - buttons should be tappable
3. **Verify navigation** - hamburger menu should work
4. **Test form on mobile** - ensure it's usable

## 📱 **Page URLs**

### **Local Testing**
- **Home:** `file:///path/to/index.html`
- **Services:** `file:///path/to/services.html`
- **Contact:** `file:///path/to/contact.html`
- **Get Started:** `file:///path/to/get-started.html`

### **Live Website**
- **Home:** `https://digitalencore.github.io/Digital_Encore/`
- **Services:** `https://digitalencore.github.io/Digital_Encore/services.html`
- **Contact:** `https://digitalencore.github.io/Digital_Encore/contact.html`
- **Get Started:** `https://digitalencore.github.io/Digital_Encore/get-started.html`

## 🎯 **Form Fields Reference**

### **All Forms Include:**
- **First Name** (required)
- **Last Name** (required)
- **Email** (required)
- **Phone** (required)
- **Country** (required dropdown)
- **Service Interest** (required dropdown)
- **Message** (required)

### **Country Options:**
Philippines, United States, Canada, Australia, United Kingdom, Singapore, Malaysia, Japan, South Korea, Germany, France, Italy, Spain, Netherlands, Sweden, Norway, Denmark, Finland, Switzerland, Austria, Belgium, Ireland, New Zealand, India, China, Hong Kong, Taiwan, Thailand, Vietnam, Indonesia, Brazil, Mexico, Argentina, Chile, Colombia, Peru, South Africa, Egypt, Nigeria, Kenya, Morocco, Israel, United Arab Emirates, Saudi Arabia, Turkey, Russia, Poland, Czech Republic, Hungary, Romania, Bulgaria, Croatia, Greece, Portugal, Other

### **Service Options:**
- Website Solutions
- Business System Automation
- Customer Experience Solutions
- Custom Features & Enhancements
- Multiple Services
- Not Sure Yet

## 🔄 **Update Process**

### **Content Updates**
1. **Edit HTML files** for text changes
2. **Test locally** in browser
3. **Commit and push** to GitHub
4. **Verify live site** updates

### **Styling Updates**
1. **Edit styles.css** for design changes
2. **Test on all devices** (mobile, tablet, desktop)
3. **Check both themes** (light and dark mode)
4. **Commit and push** to GitHub

### **Functionality Updates**
1. **Edit script.js** for behavior changes
2. **Test all forms** and interactions
3. **Check browser console** for errors
4. **Commit and push** to GitHub

## 📊 **Monitoring**

### **Daily Checks**
- [ ] **Form submissions** in Google Sheets
- [ ] **Email notifications** received
- [ ] **Website loads** properly
- [ ] **All pages** accessible

### **Weekly Checks**
- [ ] **Test form submission** manually
- [ ] **Check mobile responsiveness**
- [ ] **Verify all links** work
- [ ] **Review analytics** (if available)

### **Monthly Checks**
- [ ] **Update content** as needed
- [ ] **Check for broken links**
- [ ] **Review performance**
- [ ] **Backup important data**

## 🆘 **Emergency Contacts**

### **Technical Issues**
- **EmailJS Support:** https://www.emailjs.com/support/
- **Google Apps Script:** https://developers.google.com/apps-script
- **GitHub Pages:** https://docs.github.com/en/pages

### **Business Contact**
- **Email:** vanjerson2@gmail.com
- **Facebook:** https://facebook.com/profile.php?id=61581463806154
- **Calendly:** https://calendly.com/vanjerson2/30min

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** January 2025  
**For detailed information, see README.md and TECHNICAL_DOCS.md**
