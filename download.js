function onFs(fs) {

    fs.root.getFile('/temp/log.txt', {create: true}, function(fileEntry) {
  
      // Create a FileWriter object for our FileEntry.
      fileEntry.createWriter(function(fileWriter) {
  
        fileWriter.onwrite = function(e) {
          console.log('Write completed.');
        };
  
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };
  
        var bb = new BlobBuilder(); // Create a new Blob on-the-fly.
        bb.append('Lorem Ipsum');
  
        fileWriter.write(bb.getBlob('text/plain'));
  
      }, onError);
  
    }, onError);
  
  }
  
  window.requestFileSystem(TEMPORARY, 1024*1024 /*1MB*/, onFs, onError);