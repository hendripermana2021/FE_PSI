import jsPDF from 'jspdf'
import 'jspdf-autotable'

const exportToPDF = () => {
  const doc = new jsPDF()

  // Judul dokumen
  doc.text('Data Ajuan', 14, 10)

  // Ambil data tabel
  const tableColumn = [
    'ID',
    'Region',
    'Programs',
    'Jlh Dana',
    'PSI Result',
    'Rank',
    'Commented',
    'Status',
  ]
  const tableRows = []

  ajuan.forEach((programs, index) => {
    const rowData = [
      index + 1,
      programs?.users?.name || '-',
      programs?.program?.name_program || '-',
      formatRupiah(programs.jlh_dana || 0),
      programs?.psi_result || 0,
      programs?.rank || 'N/A',
      programs?.commented || '-',
      programs?.req_status ? 'Belum Disetujui' : 'Disetujui',
    ]
    tableRows.push(rowData)
  })

  // Tambahkan tabel ke PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  })

  // Simpan PDF
  doc.save('Data_Ajuan.pdf')
}
