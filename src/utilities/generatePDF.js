import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAsientosDetallesData } from "../services/AsientoService";

const generatePDF = async (asientoId, fileName) => {
  try {
    const asiento = await getAsientosDetallesData(asientoId);

    // Crear un documento PDF
    const pdf = new jsPDF();

    // Configurar título centrado
    pdf.setFontSize(18);
    pdf.text("Asiento Contable", pdf.internal.pageSize.getWidth() / 2, 22, { align: "center", decoration: "underline" });

    // Configurar datos de usuario y fecha de impresión
    const fechaActual = new Date().toLocaleDateString();
    pdf.setFontSize(12);
    pdf.text(`Usuario: ${asiento[0].usuario}`, pdf.internal.pageSize.getWidth() - 14, 32, { align: "right" });
    pdf.text(`Fecha de impresión: ${fechaActual}`, pdf.internal.pageSize.getWidth() - 14, 42, { align: "right" });

    // Configurar datos del asiento (fecha, código, descripción)
    const fechaAsiento = formatDate(asiento[0].fecha_asiento);
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${fechaAsiento}`, 14, 52);
    pdf.text(`Código: ${asiento[0].id_asiento}`, 14, 62);
    pdf.text(`Descripción: ${asiento[0].descripcion_asiento}`, 14, 72);

    // Configurar tabla de detalles del asiento usando jspdf-autotable
    const columns = ["Cuenta", "Debe", "Haber"];
    const rows = asiento.map(detalle => [
      `${detalle.codigo_cuenta} - ${detalle.nombre_cuenta}`,
      formatCurrency(detalle.debe), // Aplicar formato de moneda a debe
      formatCurrency(detalle.haber) // Aplicar formato de moneda a haber
    ]);

    pdf.autoTable({
      startY: 80,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
    });

    // Configurar total
    const totalRows = [["Total", formatCurrency(asiento[0].total), formatCurrency(asiento[0].total)]];

    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 10,
      body: totalRows,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
        fontStyle: "bold",
      },
    });

    // Guardar el PDF con el nombre especificado
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
};


// Función para formatear montos como moneda peruana (Soles)
const formatCurrency = (value) => {
  return `S/ ${value.toFixed(2)}`; // Asumiendo que value es un número
};
const formatDate = (dateString) => {
    // Eliminar la "T" y todo lo que está después
    const formattedDate = dateString.split('T')[0];
  
    const [year, month, day] = formattedDate.split('-');

    // Retornar la fecha formateada como dd/mm/aa
    return `${month}/${day}/${year.slice(-2)}`;
  };

export default generatePDF;
