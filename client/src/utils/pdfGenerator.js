import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export const generatePrescription = (consultationData, doctorData) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Header - Doctor Info
  doc.setFontSize(22);
  const docName = doctorData.name?.toLowerCase().startsWith('dr.') ? doctorData.name : `Dr. ${doctorData.name}`;
  doc.text(docName, 14, 20);
  
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

export const generateFullConsultationReport = (consultationData, doctorData) => {
  const doc = new jsPDF();
  const date = consultationData.createdAt 
    ? new Date(consultationData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString();

  // Header - Doctor Info
  doc.setFontSize(20);
  doc.setTextColor(26, 86, 219); // Primary Blue
  const docName = doctorData?.name?.toLowerCase().startsWith('dr.') ? doctorData.name : `Dr. ${doctorData?.name || 'Doctor'}`;
  doc.text(docName, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${doctorData?.specialization || 'Medical Specialist'} | Reg No: ${doctorData?.registrationNumber || 'N/A'}`, 14, 27);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("FULL CLINICAL ENCOUNTER REPORT", 120, 20);

  // Divider
  doc.setDrawColor(200);
  doc.line(14, 33, 196, 33);

  // Patient Info & Vitals Card
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Patient Name: ${consultationData.patientName}`, 14, 42);
  doc.setFont("helvetica", "normal");
  doc.text(`Age/Gender: ${consultationData.patientAge} / ${consultationData.patientGender}`, 14, 48);
  doc.text(`Date of Visit: ${date}`, 140, 42);

  let currentY = 56;

  // Vitals Section
  if (consultationData.vitals) {
    doc.setFont("helvetica", "bold");
    doc.text("Vitals:", 14, currentY);
    doc.setFont("helvetica", "normal");
    const vitalsText = [
      consultationData.vitals.bloodPressure ? `BP: ${consultationData.vitals.bloodPressure}` : null,
      consultationData.vitals.heartRate ? `HR: ${consultationData.vitals.heartRate} bpm` : null,
      consultationData.vitals.temperature ? `Temp: ${consultationData.vitals.temperature}°F` : null,
      consultationData.vitals.weight ? `Weight: ${consultationData.vitals.weight} kg` : null,
    ].filter(Boolean).join('  |  ') || 'Normal';
    doc.text(vitalsText, 35, currentY);
    currentY += 10;
  }

  // Divider
  doc.setDrawColor(220);
  doc.line(14, currentY, 196, currentY);
  currentY += 8;

  // Clinical Summary / Diagnosis
  if (consultationData.diagnosis) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis & Assessment:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(consultationData.diagnosis, 14, currentY + 6);
    currentY += 14;
  }

  // Symptoms
  if (consultationData.symptoms?.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Symptoms Reported:", 14, currentY);
    doc.setFont("helvetica", "normal");
    const symptomsText = consultationData.symptoms.join(', ');
    const splitSymptoms = doc.splitTextToSize(symptomsText, 180);
    doc.text(splitSymptoms, 14, currentY + 5);
    currentY += 8 + (splitSymptoms.length * 5);
  }

  // Prescribed Medicines Table
  if (consultationData.medicines?.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Medications (Rx):", 14, currentY);
    
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

  // Transcript Summary / Voice Log
  if (consultationData.transcript) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Consultation Voice Transcript Log:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    const splitTranscript = doc.splitTextToSize(`"${consultationData.transcript}"`, 180);
    doc.text(splitTranscript, 14, currentY + 5);
    doc.setTextColor(0);
    currentY += 8 + (splitTranscript.length * 4);
  }

  // Advice & Remarks
  if (consultationData.advice) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Advice & Instructions:", 14, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitAdvice = doc.splitTextToSize(consultationData.advice, 180);
    doc.text(splitAdvice, 14, currentY + 5);
    currentY += 8 + (splitAdvice.length * 4);
  }

  // Follow up
  if (consultationData.followUpDate) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Recommended Follow-up: ${consultationData.followUpDate}`, 14, currentY + 4);
  }

  // Footer Signature
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Attending Doctor Signature", 145, 275);
  doc.line(140, 270, 190, 270);

  const fileName = (consultationData.patientName || 'Patient').replace(/\s+/g, '_');
  doc.save(`${fileName}_Clinical_Report.pdf`);
};

