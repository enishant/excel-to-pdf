const fs = require('fs');
const Excel = require('exceljs');
const XlsxPopulate = require('xlsx-populate');
const workbook = new Excel.Workbook();
const original_filename = 'Sample.xlsx';

var report_dir = './reports';
if (!fs.existsSync(report_dir)) {
  fs.mkdirSync(report_dir);
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/excel/:file_id', function (req, res, next) {
  if(req != undefined && req.params != undefined && req.params.file_id != undefined) {
    res.set({
      'Content-Disposition': 'attachment; filename=' + req.params.file_id + '.xlsx',
    });
    res.sendFile(__dirname + '/reports/'  + req.params.file_id + '.xlsx');
  }
});

app.get('/pdf/:file_id', function (req, res, next) {
  if(req != undefined && req.params != undefined && req.params.file_id != undefined) {
    res.set({
      'Content-Disposition': 'attachment; filename=' + req.params.file_id + '.pdf',
    });
    res.sendFile(__dirname + '/reports/'  + req.params.file_id + '.pdf');
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket) {
  io.sockets.emit('messageDefault',{});
  io.sockets.emit('broadcastToAllClients',{});
  socket.on('createReport', function(data) {
    console.log('Creating Report');
  });
});

io.on('connection', function(socket) {
  socket.on('createReport', function(input_data) {
    workbook.xlsx.readFile(original_filename) .then(function() {
      // Modify File Properties
      workbook.creator = 'Nishant Vaity';
      workbook.lastModifiedBy = 'Nishant Vaity';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Get Workbooks  
      var input = workbook.getWorksheet('Input');
      var processing = workbook.getWorksheet('Processing');
      var output = workbook.getWorksheet('Output');

      input.getCell('C2').value = parseFloat(input_data.n1);
      input.getCell('C3').value = parseFloat(input_data.n2);
      input.getCell('C4').value = input_data.s1;
      input.getCell('C5').value = input_data.s2;

      var C2 = input.getCell('C2').value;
      var C3 = input.getCell('C3').value;
      var C4 = input.getCell('C4').value;
      var C5 = input.getCell('C5').value;
      console.log(input_data,C2,C3,C4,C5);

      input.state = 'hidden';

      workbook.xlsx.writeFile('reports/' + input_data.file_id + '.xlsx').then(function() {
        XlsxPopulate.fromFileAsync('reports/' + input_data.file_id + '.xlsx').then(workbook_1 => {
          var pdf_converter = require('office-converter')();
          pdf_converter.generatePdf('reports/' + input_data.file_id + '.xlsx', function(err, result) {
            // Process result if no error
            if(result != undefined  && result.status != undefined && result.status === 0) {
              console.log('Output File located at ' + result.outputFile);
              io.sockets.emit('messageDefault',{'status':'success','file':input_data.file_id});
            }
          });
          return workbook_1.outputAsync();
          // return workbook_1.toFileAsync("out_1.xlsx");
          // return workbook_1.toFileAsync(original_filename);
        });
      });
    });  
  });
});
