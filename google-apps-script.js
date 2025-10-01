/**
 * Google Apps Script for Digital Encore Form Automation
 * This script receives form data and saves it to Google Sheets
 */

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Debug: Log what we received
    console.log('Received data:', data);
    console.log('All data keys:', Object.keys(data));
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Handle both old and new field name formats
    const firstName = data.first_name || data.firstName || '';
    const lastName = data.last_name || data.lastName || '';
    
    console.log('First name (processed):', firstName);
    console.log('Last name (processed):', lastName);
    
    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
      firstName,
      lastName,
      data.email || '',
      data.phone || '',
      data.country || '',
      data.service || '',
      data.message || '',
      data.timestamp || new Date().toLocaleString()
    ];
    
    // Debug: Log what we're saving
    console.log('Row data to save:', rowData);
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        receivedData: data,
        processedData: {
          firstName: firstName,
          lastName: lastName
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error saving data: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Digital Encore Form Handler is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function to create headers if they don't exist
 * Run this once after creating the script
 */
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Check if headers exist
  const headers = sheet.getRange(1, 1, 1, 9).getValues()[0];
  
  if (!headers[0] || headers[0] === '') {
    // Add headers
    const headerRow = [
      'Timestamp',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Country',
      'Service Interest',
      'Message',
      'Form Timestamp'
    ];
    
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headerRow.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f0f0f0');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headerRow.length);
    
    console.log('Sheet headers created successfully!');
  } else {
    console.log('Headers already exist');
  }
}
