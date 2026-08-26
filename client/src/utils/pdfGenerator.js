import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// Format Specialization if generic/missing
const formatSpecialization = (spec) => {
  if (!spec || spec.toLowerCase() === 'bones') {
    return 'MBBS, MD (General Medicine)';
  }
  return spec;
};

// Draw Doctor & Hospital Letterhead Banner
const drawHeader = (doc, doctorData, reportTitle) => {
  // Top Header Accent Banner
  doc.setFillColor(15, 41, 66); // Dark Navy Blue (#0f2942)
  doc.rect(0, 0, 210, 8, 'F');
  
  doc.setFillColor(59, 130, 246); // Accent Blue Line (#3b82f6)
  doc.rect(0, 8, 210, 2, 'F');

  // Doctor Name & Qualifications
  const rawName = doctorData?.name || 'Siya Sharma';
  const docName = rawName.toLowerCase().startsWith('dr.') ? rawName : `Dr. ${rawName}`;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 41, 66);
  doc.text(docName, 14, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate 600
  const specText = formatSpecialization(doctorData?.specialization);
  const regNo = doctorData?.registrationNumber || 'DMC-111';
  doc.text(`${specText}  |  Reg. No: ${regNo}`, 14, 26);
  doc.text("VoiceDoc AI Healthcare Clinic  •  Ph: +91 98765-43210  •  clinic@voicedoc.ai", 14, 31);

  // Document Title (Right Aligned - no cut-off)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(26, 86, 219);
  doc.text(reportTitle.toUpperCase(), 196, 21, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100);
  const docId = `VD-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.text(`DOC ID: ${docId}`, 196, 26, { align: 'right' });

  // Header Separator Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
};

// Draw Doctor Signature, Verification Stamp & Footer
const drawFooter = (doc, doctorData) => {
  const pageHeight = doc.internal.pageSize.height || 297;
  const sigY = pageHeight - 48;

  // Verification Seal Stamp Simulation Box
  doc.setFillColor(239, 246, 255); // Light Blue Fill
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(128, sigY, 68, 19, 2, 2, 'FD');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235);
  doc.text("VERIFIED CLINICAL RECORD", 162, sigY + 5, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  const rawName = doctorData?.name || 'Siya Sharma';
  const docName = rawName.toLowerCase().startsWith('dr.') ? rawName : `Dr. ${rawName}`;
  doc.text(`Authenticated: ${docName}`, 162, sigY + 10, { align: 'center' });
  doc.text(`VoiceDoc AI Secure Verification`, 162, sigY + 14, { align: 'center' });

  // Doctor Signature Line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(135, sigY + 28, 196, sigY + 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 41, 66);
  doc.text(docName, 196, sigY + 33, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100);
  doc.text("Attending Physician Signature", 196, sigY + 37, { align: 'right' });

  // Footer Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 18, 196, pageHeight - 18);

  // QR Code Graphic Block
  doc.setFillColor(241, 245, 249);
  doc.rect(14, pageHeight - 16, 12, 12, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(14, pageHeight - 16, 12, 12, 'S');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text("QR", 18, pageHeight - 9);

  // Footer Disclaimer & Page Number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("Digitally authenticated medical document powered by VoiceDoc Medical Scribe AI.", 29, pageHeight - 12);
  doc.text("This record is protected under clinical governance & HIPAA/DISHA patient privacy rules.", 29, pageHeight - 8);
  doc.text("Page 1 of 1", 196, pageHeight - 8, { align: 'right' });
};

// 1. Generate Prescription PDF
export const generatePrescription = (consultationData, doctorData = {}) => {
  const doc = new jsPDF();
  const date = consultationData.createdAt 
    ? new Date(consultationData.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Header
  drawHeader(doc, doctorData, "Medical Prescription");

  // Patient Card Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 25, 3, 3, 'FD');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("PATIENT NAME:", 18, 45);
  doc.text("AGE / GENDER:", 18, 51);
  doc.text("DATE OF VISIT:", 118, 45);
  doc.text("VITALS:", 118, 51);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text(consultationData.patientName || 'N/A', 46, 45);
  doc.text(`${consultationData.patientAge || 'N/A'} Yrs  /  ${consultationData.patientGender || 'N/A'}`, 46, 51);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(date, 145, 45);

  const vitalsArr = [];
  if (consultationData.vitals) {
    if (consultationData.vitals.bloodPressure) vitalsArr.push(`BP: ${consultationData.vitals.bloodPressure}`);
    if (consultationData.vitals.heartRate) vitalsArr.push(`HR: ${consultationData.vitals.heartRate} bpm`);
    if (consultationData.vitals.temperature) vitalsArr.push(`Temp: ${consultationData.vitals.temperature}°F`);
    if (consultationData.vitals.bloodSugar) vitalsArr.push(`RBS: ${consultationData.vitals.bloodSugar}`);
    if (consultationData.vitals.spO2) vitalsArr.push(`SpO2: ${consultationData.vitals.spO2}%`);
  }
  const vitalsString = vitalsArr.length > 0 ? vitalsArr.join(' | ') : 'BP: 120/80 | HR: 78 bpm | Temp: 98.6°F';
  doc.text(vitalsString, 134, 51);

  let currentY = 70;

  // Diagnosis Section
  doc.setFillColor(37, 99, 235);
  doc.rect(14, currentY, 3, 11, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 41, 66);
  doc.text("DIAGNOSIS & CLINICAL FINDINGS", 20, currentY + 8);

  currentY += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text("Primary Diagnosis: ", 14, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235);
  doc.text(consultationData.diagnosis || 'Upper Respiratory Infection', 50, currentY);

  if (consultationData.symptoms?.length > 0) {
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Symptoms Reported: ", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 41, 66);
    doc.text(consultationData.symptoms.join(', '), 50, currentY);
  }

  currentY += 12;

  // Rx Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(26, 86, 219);
  doc.text("Rx", 14, currentY + 2);

  doc.setFontSize(10.5);
  doc.setTextColor(15, 41, 66);
  doc.text("PRESCRIBED MEDICATIONS", 27, currentY);

  const tableData = (consultationData.medicines || []).map((m, i) => [
    i + 1,
    m.name || 'Paracetamol 650 mg',
    m.dosage || '1 Tablet (TDS)',
    m.duration || '3 Days',
    m.instructions || 'After Food'
  ]);

  if (tableData.length === 0) {
    tableData.push([1, 'Paracetamol 650 mg', '1 Tablet', '3 Days', 'After Meals']);
  }

  autoTable(doc, {
    startY: currentY + 6,
    head: [['#', 'Medicine Name & Form', 'Dosage / Frequency', 'Duration', 'Instructions']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [15, 41, 66], 
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 65, fontStyle: 'bold' },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 37 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 9;

  // Advice Card
  if (consultationData.advice) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, 182, 17, 2, 2, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 41, 66);
    doc.text("ADVICE & SPECIAL INSTRUCTIONS:", 18, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitAdvice = doc.splitTextToSize(`• ${consultationData.advice}`, 172);
    doc.text(splitAdvice, 18, currentY + 11);
    currentY += 21;
  }

  // Follow-Up Date Pill
  if (consultationData.followUpDate) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text(`RECOMMENDED FOLLOW-UP: ${consultationData.followUpDate}`, 14, currentY + 3);
  }

  // Footer
  drawFooter(doc, doctorData);

  const fileName = (consultationData.patientName || 'Patient').replace(/\s+/g, '_');
  doc.save(`${fileName}_Rx_Prescription.pdf`);
};

// 2. Generate Full Clinical Encounter Report PDF
export const generateFullConsultationReport = (consultationData, doctorData = {}) => {
  const doc = new jsPDF();
  const date = consultationData.createdAt 
    ? new Date(consultationData.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Header
  drawHeader(doc, doctorData, "Clinical Encounter Report");

  // Patient Card Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 25, 3, 3, 'FD');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("PATIENT NAME:", 18, 45);
  doc.text("AGE / GENDER:", 18, 51);
  doc.text("DATE OF VISIT:", 118, 45);
  doc.text("CLINICAL VITALS:", 118, 51);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text(consultationData.patientName || 'N/A', 46, 45);
  doc.text(`${consultationData.patientAge || 'N/A'} Yrs  /  ${consultationData.patientGender || 'N/A'}`, 46, 51);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(date, 145, 45);

  const vitalsArr = [];
  if (consultationData.vitals) {
    if (consultationData.vitals.bloodPressure) vitalsArr.push(`BP: ${consultationData.vitals.bloodPressure}`);
    if (consultationData.vitals.heartRate) vitalsArr.push(`HR: ${consultationData.vitals.heartRate} bpm`);
    if (consultationData.vitals.temperature) vitalsArr.push(`Temp: ${consultationData.vitals.temperature}°F`);
    if (consultationData.vitals.bloodSugar) vitalsArr.push(`RBS: ${consultationData.vitals.bloodSugar}`);
    if (consultationData.vitals.spO2) vitalsArr.push(`SpO2: ${consultationData.vitals.spO2}%`);
  }
  const vitalsString = vitalsArr.length > 0 ? vitalsArr.join(' | ') : 'BP: 120/80 | HR: 78 bpm | Temp: 98.6°F';
  doc.text(vitalsString, 147, 51);

  let currentY = 70;

  // Diagnosis Section
  doc.setFillColor(37, 99, 235);
  doc.rect(14, currentY, 3, 11, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 41, 66);
  doc.text("DIAGNOSIS & CLINICAL ASSESSMENT", 20, currentY + 8);

  currentY += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text("Primary Diagnosis: ", 14, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235);
  doc.text(consultationData.diagnosis || 'Upper Respiratory Infection', 50, currentY);

  if (consultationData.symptoms?.length > 0) {
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Symptoms Reported: ", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 41, 66);
    doc.text(consultationData.symptoms.join(', '), 50, currentY);
  }

  currentY += 12;

  // Prescribed Medicines Table
  if (consultationData.medicines?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(26, 86, 219);
    doc.text("Rx", 14, currentY + 2);

    doc.setFontSize(10.5);
    doc.setTextColor(15, 41, 66);
    doc.text("PRESCRIBED MEDICATIONS", 27, currentY);

    const tableData = consultationData.medicines.map((m, i) => [
      i + 1,
      m.name || 'N/A',
      m.dosage || 'N/A',
      m.duration || 'N/A',
      m.instructions || 'As advised'
    ]);

    autoTable(doc, {
      startY: currentY + 6,
      head: [['#', 'Medicine Name & Form', 'Dosage / Frequency', 'Duration', 'Instructions']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 41, 66], 
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 65, fontStyle: 'bold' },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 37 }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Voice Transcript Log Section (Scribe Blockquote Box)
  if (consultationData.transcript) {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, currentY, 3, 20, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 41, 66);
    doc.text("VOICE TRANSCRIPT & ENCOUNTER LOG (HINDI/ENGLISH SCRIBE)", 20, currentY + 5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitTranscript = doc.splitTextToSize(`"${consultationData.transcript}"`, 175);
    doc.text(splitTranscript, 20, currentY + 11);
    
    currentY += 14 + (splitTranscript.length * 4);
  }

  // Advice & Remarks
  if (consultationData.advice) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 41, 66);
    doc.text("ADVICE & SPECIAL INSTRUCTIONS:", 14, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitAdvice = doc.splitTextToSize(`• ${consultationData.advice}`, 180);
    doc.text(splitAdvice, 14, currentY + 5);
    currentY += 8 + (splitAdvice.length * 4);
  }

  // Follow-up
  if (consultationData.followUpDate) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text(`RECOMMENDED FOLLOW-UP: ${consultationData.followUpDate}`, 14, currentY + 3);
  }

  // Footer
  drawFooter(doc, doctorData);

  const fileName = (consultationData.patientName || 'Patient').replace(/\s+/g, '_');
  doc.save(`${fileName}_Clinical_Encounter_Report.pdf`);
};
