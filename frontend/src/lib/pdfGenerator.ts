import type { MenuCategory, Section } from '@/backend';

// Load jsPDF from CDN dynamically
async function loadJsPDF() {
  if (typeof window === 'undefined') return null;
  
  // Check if jsPDF is already loaded
  if ((window as any).jspdf) {
    return (window as any).jspdf.jsPDF;
  }

  // Load jsPDF from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      if ((window as any).jspdf) {
        resolve((window as any).jspdf.jsPDF);
      } else {
        reject(new Error('jsPDF failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });
}

// Convert image URL to base64
async function getImageBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
}

export async function generateMenuPDF(
  categories: MenuCategory[],
  sections: Section[]
): Promise<void> {
  try {
    const jsPDF = await loadJsPDF();
    if (!jsPDF) {
      throw new Error('Failed to load PDF library');
    }

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      fontSize: number,
      isBold = false
    ): number => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * (fontSize * 0.35); // Return height used
    };

    // Load and add enhanced transparent logo
    try {
      const logoBase64 = await getImageBase64('/assets/generated/prashadam-logo-enhanced-transparent.dim_400x400.png');
      if (logoBase64) {
        const logoSize = 35;
        doc.addImage(logoBase64, 'PNG', (pageWidth - logoSize) / 2, yPosition, logoSize, logoSize);
        yPosition += logoSize + 5;
      }
    } catch (error) {
      console.error('Error loading logo:', error);
      yPosition += 10;
    }

    // Add header
    doc.setFillColor(139, 69, 19); // Brown color
    doc.rect(margin, yPosition, contentWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PRASHADAM FOOD', pageWidth / 2, yPosition + 8, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Pure Vegetarian Jain & Vaishnav Cuisine', pageWidth / 2, yPosition + 15, { align: 'center' });
    doc.text('No Onion, No Garlic', pageWidth / 2, yPosition + 21, { align: 'center' });
    
    yPosition += 30;

    // Add contact info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Contact: 8802452190 | support@prashadamfood.com', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Add decorative line
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add categories
    for (const category of categories) {
      checkNewPage(30);

      // Category header
      doc.setFillColor(245, 222, 179); // Wheat color
      doc.rect(margin, yPosition, contentWidth, 12, 'F');
      
      doc.setTextColor(139, 69, 19);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(category.name.toUpperCase(), margin + 3, yPosition + 8);
      yPosition += 15;

      // Category description
      doc.setTextColor(80, 80, 80);
      const descHeight = addWrappedText(category.description, margin, yPosition, contentWidth, 10);
      yPosition += descHeight + 5;

      // Menu items
      for (const item of category.items) {
        checkNewPage(25);

        // Item name and price
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        
        const itemName = item.name;
        const priceText = item.price > 0 ? `Rs. ${item.price.toFixed(0)}/-` : '';
        
        doc.text(itemName, margin + 2, yPosition);
        if (priceText) {
          doc.text(priceText, pageWidth - margin - 2, yPosition, { align: 'right' });
        }
        yPosition += 5;

        // Item description
        if (item.description) {
          doc.setTextColor(80, 80, 80);
          const itemDescHeight = addWrappedText(item.description, margin + 4, yPosition, contentWidth - 8, 9);
          yPosition += itemDescHeight + 2;
        }

        // Tags
        const tags: string[] = [];
        if (item.isJain) tags.push('Jain');
        if (item.isVaishnav) tags.push('Vaishnav');
        if (tags.length > 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(34, 139, 34); // Green
          doc.text(`[${tags.join(', ')}]`, margin + 4, yPosition);
          yPosition += 4;
        }

        yPosition += 3;
      }

      yPosition += 5;
    }

    // Add sections
    for (const section of sections) {
      checkNewPage(30);

      // Section header
      doc.setFillColor(245, 222, 179);
      doc.rect(margin, yPosition, contentWidth, 12, 'F');
      
      doc.setTextColor(139, 69, 19);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${section.icon} ${section.title.toUpperCase()}`, margin + 3, yPosition + 8);
      yPosition += 15;

      // Section description
      doc.setTextColor(80, 80, 80);
      const sectionDescHeight = addWrappedText(section.description, margin, yPosition, contentWidth, 10);
      yPosition += sectionDescHeight + 5;

      // Subsections
      for (const subsection of section.subsections) {
        checkNewPage(20);

        // Subsection title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(subsection.title, margin + 2, yPosition);
        yPosition += 6;

        // Subsection content
        if (subsection.content) {
          doc.setTextColor(80, 80, 80);
          const subContentHeight = addWrappedText(subsection.content, margin + 2, yPosition, contentWidth - 4, 10);
          yPosition += subContentHeight + 3;
        }

        // Subsection items
        for (const item of subsection.items) {
          checkNewPage(15);

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`• ${item.title}`, margin + 4, yPosition);
          yPosition += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const itemDescHeight = addWrappedText(item.description, margin + 8, yPosition, contentWidth - 12, 9);
          yPosition += itemDescHeight + 3;
        }

        yPosition += 3;
      }

      yPosition += 5;
    }

    // Add footer on last page
    checkNewPage(20);
    yPosition = pageHeight - 25;
    
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    doc.setTextColor(139, 69, 19);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing Prashadam Food!', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('www.prashadamfood.com', pageWidth / 2, yPosition, { align: 'center' });

    // Save the PDF
    doc.save('Prashadam-Food-Menu.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
