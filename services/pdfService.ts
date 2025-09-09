
import { LostFoundReport } from '../types';

/**
 * Generates a PDF document for a given lost or found report.
 * @param report - The LostFoundReport object to be converted into a PDF.
 */
export const generateReportPdf = (report: LostFoundReport) => {
    // FIX: Corrected to use the global jsPDF constructor directly, following standard library usage and the compiler hint.
    // The global `jspdf` constructor is provided by the CDN script.
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    let y = 15; // Initial Y position for text

    // --- Document Title ---
    doc.setFontSize(20);
    doc.text("Simhastha Sahayata - Lost & Found Report", 105, y, { align: 'center' });
    y += 15;

    // --- Image Section (if available) ---
    const imageStartX = 135;
    const imageWidth = 60;
    const detailsMaxWidth = imageStartX - 30; // Max width for text next to the image
    if (report.imageUrl) {
        try {
            // Check if it's a base64 URL
            if (report.imageUrl.startsWith('data:image')) {
                 const imgProps = doc.getImageProperties(report.imageUrl);
                 const aspectRatio = imgProps.width / imgProps.height;
                 const imgHeight = imageWidth / aspectRatio;
                 doc.addImage(report.imageUrl, 'JPEG', imageStartX, y, imageWidth, imgHeight);
            }
        } catch (e) {
            console.error("Error adding image to PDF:", e);
            doc.text("Image could not be loaded.", imageStartX, y);
        }
    }

    // --- Details Section ---
    doc.setFontSize(12);

    const addDetail = (label: string, value: string | undefined | null) => {
        if (!value) return;

        // Check for page break
        if (y > 270) {
            doc.addPage();
            y = 15;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, y);
        
        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(value, detailsMaxWidth);
        doc.text(textLines, 65, y);
        
        // Increment Y position based on the number of lines the value took
        y += (textLines.length * 5) + 6;
    };

    addDetail("Report ID:", report.id);
    addDetail("Date:", new Date(report.timestamp).toLocaleString());
    addDetail("Status:", report.status);
    y += 5; // Add extra space before main details

    addDetail("Report Type:", report.type);
    addDetail("Category:", report.category);

    if (report.category === 'Person') {
        addDetail("Person's Name:", report.personName);
        addDetail("Approx. Age:", report.personAge);
        addDetail("Gender:", report.personGender);
        addDetail("Clothing/Appearance:", report.clothingAppearance);
    } else { // Item
        addDetail("Sub-Category:", report.subCategory);
        addDetail("Item Name:", report.itemName);
        addDetail("Brand:", report.itemBrand);
        addDetail("Color:", report.itemColor);
        addDetail("Identifying Marks:", report.identifyingMarks);
    }

    addDetail("Last Seen Location:", report.lastSeen);
    addDetail("Description:", report.description);
    
    y += 10;
    addDetail("Reported By:", report.reportedBy);

    // --- Save Document ---
    doc.save(`Report-${report.id}.pdf`);
};
