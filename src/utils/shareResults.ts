
import { SearchResult } from '@/services/searchService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Function to download results as PDF
export const downloadAsPdf = (result: SearchResult) => {
  if (!result || !result.data) return;
  
  const doc = new jsPDF();
  const portalName = result.portalName || 'Property';
  
  // Add title
  doc.setFontSize(16);
  doc.text(`${portalName} Property Report`, 20, 20);
  
  // Add generation info
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);
  
  // Convert data to array for table
  const tableData = Object.entries(result.data).map(([key, value]) => {
    // Handle nested objects
    if (typeof value === 'object' && value !== null) {
      return [key, JSON.stringify(value)];
    }
    return [key, String(value)];
  });
  
  // Add table
  (doc as any).autoTable({
    startY: 40,
    head: [['Property Attribute', 'Value']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Save the PDF
  doc.save(`${portalName}_Property_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Function to share result via WhatsApp
export const shareViaWhatsApp = (result: SearchResult) => {
  if (!result || !result.data) return;
  
  // Create a formatted string with property details
  let message = `*${result.portalName} Property Report*\n\n`;
  
  // Add property details
  Object.entries(result.data).forEach(([key, value]) => {
    // Skip location object
    if (key !== 'Location' && typeof value !== 'object') {
      message += `*${key}*: ${value}\n`;
    }
  });
  
  // Add footer
  message += `\nGenerated via Bharat Property Nexus on ${new Date().toLocaleDateString()}`;
  
  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
};

// Function to download all results as CSV
export const downloadAllResultsAsCsv = (results: SearchResult[]) => {
  // Filter out results with no data
  const validResults = results.filter(result => result.status === 'found' && result.data);
  if (validResults.length === 0) return;
  
  // Get all unique keys from all results
  const allKeys = new Set<string>();
  validResults.forEach(result => {
    if (result.data) {
      Object.keys(result.data).forEach(key => allKeys.add(key));
    }
  });
  
  // Create CSV header
  let csv = 'Source,' + Array.from(allKeys).join(',') + '\n';
  
  // Add data for each result
  validResults.forEach(result => {
    if (!result.data) return;
    
    let row = result.portalName;
    Array.from(allKeys).forEach(key => {
      const value = result.data && result.data[key];
      // Handle different data types
      if (value === undefined || value === null) {
        row += ',';
      } else if (typeof value === 'object') {
        row += `,"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        row += `,"${String(value).replace(/"/g, '""')}"`;
      }
    });
    csv += row + '\n';
  });
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Property_Report_All_Sources_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
