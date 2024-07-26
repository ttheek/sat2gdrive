function fetchHimawariImages() {  
  try {
    var currentDate = new Date();
    var folderName = 'Himawari_Images'; // Name of the main folder to store images in Drive
    var mainFolder = DriveApp.getFoldersByName(folderName).hasNext()
      ? DriveApp.getFoldersByName(folderName).next()
      : DriveApp.createFolder(folderName);

    var year = currentDate.getFullYear().toString();
    var month = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), 'MMMM'); // Full name of the month
    var day = ('0' + currentDate.getDate()).slice(-2);

    var formattedDate = year + '-' + month + '-' + day;
    var folderYear = mainFolder.getFoldersByName(year).hasNext()
      ? mainFolder.getFoldersByName(year).next()
      : mainFolder.createFolder(year);

    var folderMonth = folderYear.getFoldersByName(month).hasNext()
      ? folderYear.getFoldersByName(month).next()
      : folderYear.createFolder(month);

    var folderDay = folderMonth.getFoldersByName(day).hasNext()
      ? folderMonth.getFoldersByName(day).next()
      : folderMonth.createFolder(day);

    var baseUrl = 'https://www.data.jma.go.jp/mscweb/data/himawari/img/';
    var areaCode = 'ha5'; // Area code for Sri Lanka

    // Define image types and time intervals
    var imageTypes = ['tre','trm','vir', 'arm','snd','irv'];
    var timeIntervals = ['0000','0100','0200','0300','0400','0500','0600','0700','0800','0900','1000','1100','1200','1300','1400','1500','1600','1700','1800','1900','2000','2100','2200','2300'];
    
    for (var i = 0; i < imageTypes.length; i++) {
      console.log(`Downloading - ${imageTypes[i]}`)
      for (var j = 0; j < timeIntervals.length; j++) {
        var imageUrl = baseUrl + areaCode + '/' + areaCode + '_' + imageTypes[i] + '_' + timeIntervals[j] + '.jpg';

        try {
          // Fetch the image and save it to Drive
          var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();

          // Create subfolder based on image type
          var subfolderName = imageTypes[i];
          var subfolders = folderDay.getFoldersByName(subfolderName);
          var subfolder;
          if (subfolders.hasNext()) {
            subfolder = subfolders.next();
          } else {
            subfolder = folderDay.createFolder(subfolderName);
          }

          // Save image to Drive
          var fileName = areaCode + '_' + imageTypes[i] + '_' + timeIntervals[j] + '_' + formattedDate + '.jpg';
          subfolder.createFile(imageBlob.setName(fileName));
        } catch (fetchError) {
          console.error('Error fetching or creating image:', fetchError);
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }  
}
