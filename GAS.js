//Type ID Title Text
function doGet(request) {
	var sheet = SpreadsheetApp.openById("1HSJYqJFawMJHxVwLCCRiJjYpeFqDQY1R1TlgFryOeOU").getSheetByName("Sheet1");
	if (request.parameters.type == "Get") {// ?ID=(1~)
      var id = Math.min(Number(request.parameters.ID),2);
		var count = Number(sheet.getRange(2, id).getValue());
		return ContentService.createTextOutput(
				request.parameters.prefix + '(' + JSON.stringify(
					sheet.getRange(3, id, count).getValues()
				) + ');')
			.setMimeType(ContentService.MimeType.JAVASCRIPT);
	} else if (request.parameters.type == "Add") {// ?ID=(1~)&Text=
		var id = Number(request.parameters.ID);
		var count = Number(sheet.getRange(2, id).getValue()) + 1;
		sheet.getRange(2, id).setValue(count);
		sheet.getRange(count+2, id).setValue(request.parameters.Text);
		return ContentService.createTextOutput(
				request.parameters.prefix + '();').setMimeType(ContentService.MimeType.JAVASCRIPT);
	}
}