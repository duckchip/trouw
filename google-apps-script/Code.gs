/**
 * Google Apps Script for Wedding RSVP Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new spreadsheet
 * 2. Name the sheet "RSVPs" (or update SHEET_NAME below)
 * 3. Add headers in row 1: Name | Attendance | Dietary | Song 1 | Song 2 | Song 3 | Submitted At
 * 4. Go to Extensions > Apps Script
 * 5. Paste this entire code into the script editor
 * 6. Click Deploy > New deployment
 * 7. Select "Web app" as the type
 * 8. Set "Execute as" to "Me"
 * 9. Set "Who has access" to "Anyone"
 * 10. Click Deploy and copy the Web App URL
 * 11. Paste the URL into your React app's GOOGLE_SCRIPT_URL constant
 */

const SHEET_NAME = 'RSVPs';

/**
 * Handle POST requests from the wedding website
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Name',
        'Attendance',
        'Dietary Restrictions',
        'Song 1',
        'Song 2',
        'Song 3',
        'Submitted At'
      ]]);
      // Style the header row
      sheet.getRange(1, 1, 1, 7)
        .setFontWeight('bold')
        .setBackground('#1e3a8a')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Extract song data (handle up to 3 songs)
    const songs = data.songs || [];
    const song1 = songs[0] || '';
    const song2 = songs[1] || '';
    const song3 = songs[2] || '';
    
    // Prepare the row data
    const rowData = [
      data.name || '',
      data.attendance || '',
      data.dietary || '',
      song1,
      song2,
      song3,
      data.submittedAt || new Date().toISOString()
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, 7);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'RSVP saved successfully!',
        data: data
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing RSVP:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error saving RSVP: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (useful for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Wedding RSVP API is running!',
      message: 'Use POST to submit RSVP data',
      expectedFormat: {
        name: 'Guest Name',
        attendance: 'Ja/Nee',
        dietary: 'Dietary restrictions',
        songs: ['Song 1 - Artist 1', 'Song 2 - Artist 2', 'Song 3 - Artist 3'],
        submittedAt: 'ISO date string'
      }
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the script works
 */
function testScript() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Guest',
        attendance: 'Ja',
        dietary: 'Vegetarian',
        songs: ['Perfect - Ed Sheeran', 'All of Me - John Legend'],
        submittedAt: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

