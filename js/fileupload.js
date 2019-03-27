function dateiauswahl(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var gewaehlteDateien = evt.dataTransfer.files; // FileList Objekt
  var output = [];
  for (var i = 0, f; (f = gewaehlteDateien[i]); i++) {
    output.push(
      '<li><strong>',
      escape(f.name),
      '</strong> (',
      f.type || 'n/a',
      ') - ',
      f.size,
      ' bytes, last modified: ',
      f.lastModifiedDate.toLocaleDateString(),
      '</li>'
    );
  }

  document.getElementById('drop').innerHTML =
    '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

var drop = document.getElementById('drop');
drop.addEventListener('dragover', handleDragOver, false);
drop.addEventListener('drop', dateiauswahl, false);
