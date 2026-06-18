/**
 * Reusable export utility for exporting data lists in CSV, Excel, and PDF.
 */

// Helper to escape values for CSV
const escapeCSVVal = (val) => {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

// 1. Export to CSV
export const exportToCSV = (data, headers, keys, filename = 'export') => {
  const dateStr = new Date().toLocaleDateString();
  const csvRows = [];
  
  // Headers row
  csvRows.push(headers.map(escapeCSVVal).join(','));

  // Data rows
  data.forEach(row => {
    csvRows.push(keys.map(k => escapeCSVVal(row[k])).join(','));
  });

  // Append export metadata
  csvRows.push('');
  csvRows.push(`"Export Date:",${escapeCSVVal(dateStr)}`);
  csvRows.push(`"Source:",${escapeCSVVal('BrickFlow ERP')}`);

  // Create and download file
  const csvContent = '\uFEFF' + csvRows.join('\n'); // Add UTF-8 BOM
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 2. Export to Excel (.xls compatible XML format)
export const exportToExcel = (data, headers, keys, filename = 'export') => {
  const dateStr = new Date().toLocaleDateString();
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>BrickFlow ERP</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Name="Segoe UI"/>
      <Interior ss:Color="#C14618" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CCCCCC"/>
      </Borders>
    </Style>
    <Style ss:ID="Title">
      <Font ss:Size="14" ss:Bold="1" ss:Color="#231C18" ss:Name="Segoe UI"/>
    </Style>
    <Style ss:ID="Meta">
      <Font ss:Italic="1" ss:Color="#7F7F7F" ss:Size="10" ss:Name="Segoe UI"/>
    </Style>
    <Style ss:ID="Normal">
      <Font ss:Name="Segoe UI" ss:Size="10"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Exported List">
    <Table>
      <Column ss:Width="120" ss:Span="${headers.length}"/>
      <Row ss:Height="25">
        <Cell ss:StyleID="Title"><Data ss:Type="String">BrickFlow ERP - Data Export</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="Meta"><Data ss:Type="String">Date of Export: ${dateStr}</Data></Cell>
      </Row>
      <Row ss:Height="10"></Row>
      <Row ss:Height="22">`;

  headers.forEach(h => {
    xml += `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`;
  });
  xml += `</Row>`;

  data.forEach(row => {
    xml += `<Row ss:Height="20">`;
    keys.forEach(k => {
      let val = row[k] === undefined || row[k] === null ? '' : row[k];
      const type = typeof val === 'number' ? 'Number' : 'String';
      xml += `<Cell ss:StyleID="Normal"><Data ss:Type="${type}">${val}</Data></Cell>`;
    });
    xml += `</Row>`;
  });

  xml += `</Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 3. Export to PDF (Via clean, styled printer window that downloads as PDF)
export const exportToPDF = (data, headers, keys, title = 'Export List', filename = 'export') => {
  const dateStr = new Date().toLocaleDateString();
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.bottom = '0px';
  iframe.style.right = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #231c18; padding: 40px; }
          h1 { color: #c14618; margin-bottom: 5px; font-size: 24px; font-weight: bold; }
          .meta { color: #777; font-size: 11px; margin-bottom: 25px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          th { background-color: #c14618; color: white; text-align: left; padding: 10px; font-weight: bold; border: 1px solid #c14618; }
          td { padding: 9px 10px; border-bottom: 1px solid #e5e7eb; border-left: 1px solid #f3f4f6; border-right: 1px solid #f3f4f6; color: #374151; }
          tr:nth-child(even) td { background-color: #f9fafb; }
          @page { size: auto; margin: 20mm; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Exported from BrickFlow ERP on ${dateStr} • Total Records: ${data.length}</div>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${keys.map(k => {
                  const val = row[k] === undefined || row[k] === null ? '' : row[k];
                  return `<td>${String(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          }
        </script>
      </body>
    </html>
  `);
  doc.close();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 3000);
};
