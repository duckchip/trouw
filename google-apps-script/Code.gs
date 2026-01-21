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
 * 
 * EMAIL NOTIFICATIONS:
 * - After deploying, you MUST authorize the script to send emails:
 *   1. Run the testScript() function manually once (Run > Run function > testScript)
 *   2. Click "Review Permissions" when prompted
 *   3. Sign in with your Google account
 *   4. Click "Advanced" > "Go to [script name] (unsafe)" 
 *   5. Click "Allow" to grant email permissions
 * - If you update the script, create a NEW deployment (not edit existing)
 */

const SHEET_NAME = 'RSVPs';
const NOTIFICATION_EMAIL = 'hannaentristangaantrouwen@gmail.com';

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
      sheet.getRange(1, 1, 1, 8).setValues([[
        'Name',
        'Attendance',
        'Event Type',
        'Dietary Restrictions',
        'Song 1',
        'Song 2',
        'Song 3',
        'Submitted At'
      ]]);
      // Style the header row
      sheet.getRange(1, 1, 1, 8)
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
    
    // Format timestamp in Belgian format (21/1/2026, 17:38:47)
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, 'Europe/Brussels', 'd/M/yyyy, HH:mm:ss');
    
    // Prepare the row data
    const rowData = [
      data.name || '',
      data.attendance || '',
      data.eventType || 'N.v.t.',
      data.dietary || '',
      song1,
      song2,
      song3,
      formattedDate
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, 8);
    
    // Send email notification
    sendNotificationEmail(data);
    
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
 * Send email notification for new RSVP
 */
function sendNotificationEmail(data) {
  try {
    const isAttending = data.attendance === 'Ja';
    const emoji = isAttending ? '🎉' : '😢';
    const status = isAttending ? 'komt naar het feest!' : 'kan helaas niet komen';
    
    const subject = `${emoji} RSVP: ${data.name} ${status}`;
    
    let body = `Nieuwe RSVP ontvangen!\n\n`;
    body += `👤 Naam: ${data.name}\n`;
    body += `✅ Aanwezig: ${data.attendance}\n`;
    
    if (data.eventType && data.eventType !== 'N.v.t.') {
      body += `🕐 Moment: ${data.eventType}\n`;
    }
    
    if (data.dietary) {
      body += `🍽️ Dieetwensen: ${data.dietary}\n`;
    }
    
    const songs = data.songs || [];
    if (songs.length > 0 && songs.some(s => s)) {
      body += `\n🎵 Muziekwensen:\n`;
      songs.forEach((song, i) => {
        if (song) body += `   ${i + 1}. ${song}\n`;
      });
    }
    
    body += `\n📅 Ingediend: ${new Date().toLocaleString('nl-BE')}\n`;
    body += `\n---\nBekijk alle RSVPs in de Google Sheet.`;
    
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: body
    });
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw - we don't want email failure to break the RSVP
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
        eventType: 'Receptie (17:00) / Diner (19:00) / Feest (21:00)',
        dietary: 'Dietary restrictions',
        songs: ['Song 1 - Artist 1', 'Song 2 - Artist 2', 'Song 3 - Artist 3'],
        submittedAt: 'ISO date string'
      }
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the script works AND authorize email permissions
 * Select this function and click Run to trigger authorization
 */
function testScript() {
  // This will trigger the authorization popup for email permissions
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: '✅ Test: Wedding RSVP Email Works!',
    body: 'If you received this email, the notification system is working correctly!\n\nYou can now create a new deployment.'
  });
  
  console.log('✅ Test email sent successfully to ' + NOTIFICATION_EMAIL);
  console.log('Now create a NEW deployment: Deploy > New deployment');
}

/**
 * Full test - saves a test RSVP and sends notification
 */
function testFullRSVP() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test Guest',
        attendance: 'Ja',
        eventType: 'Diner (19:00)',
        dietary: 'Vegetarian',
        songs: ['Perfect - Ed Sheeran', 'All of Me - John Legend'],
        submittedAt: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

