import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export const generatePrescription = (consultationData, doctorData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Header - Doctor Info
  doc.setFontSize(22);
  doc.setTextColor(26, 86, 219); // Primary Blue
  doc.text(`Dr. ${doctorData.name}`, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${doctorData.specialization}`, 14, 27);
  doc.text(`Reg No: ${doctorData.registrationNumber}`, 14, 32);

  // Divider
  doc.setDrawColor(200);
  doc.line(14, 38, 196, 38);

  // Patient Info
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Patient Name: ${consultationData.patientName}`, 14, 48);
  doc.text(`Age/Gender: ${consultationData.patientAge} / ${consultationData.patientGender}`, 14, 54);
  doc.text(`Date: ${date}`, 150, 48);

  // Divider
  doc.line(14, 60, 196, 60);

  // Clinical Notes
  let currentY = 70;
  
  if (consultationData.symptoms?.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Symptoms:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const symptomsText = consultationData.symptoms.join(', ');
    const splitSymptoms = doc.splitTextToSize(symptomsText, 180);
    doc.text(splitSymptoms, 14, currentY + 6);
    currentY += 10 + (splitSymptoms.length * 5);
  }

  if (consultationData.diagnosis) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(consultationData.diagnosis, 14, currentY + 6);
    currentY += 16;
  }

  // Medicines Table
  if (consultationData.medicines?.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Rx (Medicines):", 14, currentY);
    
    const tableData = consultationData.medicines.map(m => [m.name, m.dosage, m.duration]);
    
    autoTable(doc, {
      startY: currentY + 4,
      head: [['Medicine Name', 'Dosage', 'Duration']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [26, 86, 219] },
      margin: { left: 14, right: 14 }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Advice
  if (consultationData.advice) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Advice / Remarks:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(consultationData.advice, 180);
    doc.text(splitAdvice, 14, currentY + 6);
    currentY += 10 + (splitAdvice.length * 5);
  }

  // Follow-up
  if (consultationData.followUpDate) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Follow-up: ${consultationData.followUpDate}`, 14, currentY + 5);
  }

  // Footer Signature
  doc.setFont("helvetica", "normal");
  doc.text("Doctor's Signature", 150, 270);
  doc.line(145, 265, 190, 265);

  const fileName = (consultationData.patientName || 'Patient').replace(/\s+/g, '_');
  doc.save(`${fileName}_Prescription.pdf`);
};
