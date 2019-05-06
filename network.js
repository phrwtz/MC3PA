function saveState() {
    window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, SaveDatFileBro);
}

function SaveDatFileBro(localstorage) {
    localstorage.root.getFile("info.txt", {
        create: true
    }, function (DatFile) {
        DatFile.createWriter(function (DatContent) {
            var blob = new Blob(["Lorem Ipsum"], {
                type: "text/plain"
            });
            DatContent.write(blob);
        });
    });
}
function SaveDatFileBro(localstorage) {
    localstorage.root.getDirectory("demo", {create: true}, function() {});
  }