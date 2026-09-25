import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Appointment,
  LegalCase,
  Client,
  LawyerProfile,
  Invoice,
  LegalDocument
} from '../types/dashboard';

export interface ReportConfig {
  reportType: 'executive' | 'financial' | 'litigation' | 'attorney' | 'clients';
  timeframe: string;
  selectedAttorney: string;
  includeFinancials: boolean;
  includeConfidentialNotes: boolean;
  notes?: string;
}

export interface ReportDataBundle {
  lawyers: LawyerProfile[];
  currentLawyer: LawyerProfile;
  cases: LegalCase[];
  appointments: Appointment[];
  clients: Client[];
  invoices: Invoice[];
  documents: LegalDocument[];
}

/**
 * Generates an executive legal practice performance report in PDF format.
 */
export function generateExecutivePDF(bundle: ReportDataBundle, config: ReportConfig): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900 / dark navy
  const accentColor: [number, number, number] = [30, 58, 138]; // blue-900
  const goldColor: [number, number, number] = [180, 130, 40]; // warm gold

  const pageWidth = doc.internal.pageSize.getWidth();
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // --- HEADER / LETTERHEAD ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 75, 'F');

  // Gold accent bar
  doc.setFillColor(...goldColor);
  doc.rect(0, 75, pageWidth, 4, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('JURISPULSE LEGAL PARTNERS LLP', 40, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('CHAMBERS OF TRIAL PRACTICE & COMMERCIAL JURISPRUDENCE', 40, 52);
  doc.text(`DATE OF ISSUANCE: ${todayStr.toUpperCase()} • TIMEFRAME: ${config.timeframe.toUpperCase()}`, 40, 64);

  // Subtitle banner
  let currentY = 105;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EXECUTIVE PRACTICE PERFORMANCE & OUTPUT REPORT', 40, currentY);

  currentY += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Prepared for: ${bundle.currentLawyer.name} • ${bundle.currentLawyer.barNumber} • Authorized Official Docket`,
    40,
    currentY
  );

  // --- METRIC HIGHLIGHT BOXES ---
  currentY += 24;
  const totalBilled = bundle.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidBilled = bundle.invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const activeCasesCount = bundle.cases.filter((c) => c.caseStatus !== 'Closed').length;
  const activeClientsCount = bundle.clients.filter((c) => c.status === 'Active').length;

  const boxWidth = (pageWidth - 80 - 36) / 4;
  const boxHeight = 52;
  const metrics = [
    { label: 'ACTIVE MATTERS', value: `${activeCasesCount} Dockets`, sub: 'Federal & State' },
    { label: 'CLIENT NETWORK', value: `${activeClientsCount} Clients`, sub: 'Active Retainers' },
    { label: 'TOTAL INVOICED', value: `$${(totalBilled / 1000).toFixed(1)}k`, sub: `${bundle.invoices.length} Invoices` },
    { label: 'TRUST REALIZATION', value: `$${(paidBilled / 1000).toFixed(1)}k`, sub: `${Math.round((paidBilled / (totalBilled || 1)) * 100)}% Collected` }
  ];

  metrics.forEach((m, idx) => {
    const x = 40 + idx * (boxWidth + 12);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, boxWidth, boxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 10, currentY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...primaryColor);
    doc.text(m.value, x + 10, currentY + 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.sub, x + 10, currentY + 44);
  });

  currentY += boxHeight + 25;

  // --- SECTION: ACTIVE LITIGATION DOCKETS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...accentColor);
  doc.text('I. ACTIVE LITIGATION DOCKETS & PROCEEDINGS', 40, currentY);

  const casesData = bundle.cases.map((c) => [
    c.id,
    c.title,
    c.clientName,
    c.caseType,
    c.courtJurisdiction || 'Federal Court',
    c.caseStatus,
    c.hearingDate || 'Scheduled TBD'
  ]);

  autoTable(doc, {
    startY: currentY + 8,
    head: [['Docket #', 'Matter Title', 'Client', 'Practice Area', 'Jurisdiction', 'Status', 'Hearing / Deadline']],
    body: casesData,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 120 },
      2: { cellWidth: 80 },
      3: { cellWidth: 85 },
      4: { cellWidth: 80 },
      5: { cellWidth: 50 },
      6: { cellWidth: 60 }
    }
  });

  // Get position after first table
  let finalY = (doc as any).lastAutoTable?.finalY || currentY + 150;

  // --- SECTION: FINANCIAL BILLING & RETAINER ESCROW SUMMARY ---
  if (config.includeFinancials) {
    if (finalY > 600) {
      doc.addPage();
      finalY = 50;
    } else {
      finalY += 22;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...accentColor);
    doc.text('II. RETAINER ESCROW & BILLING LEDGER AUDIT', 40, finalY);

    const invoicesData = bundle.invoices.map((inv) => [
      inv.id,
      inv.clientName,
      inv.caseId,
      inv.type,
      inv.issueDate,
      inv.dueDate,
      `$${inv.amount.toLocaleString()}.00`,
      inv.status
    ]);

    autoTable(doc, {
      startY: finalY + 8,
      head: [['Invoice #', 'Client', 'Docket Ref', 'Billing Item', 'Issued', 'Due Date', 'Amount', 'Status']],
      body: invoicesData,
      margin: { left: 40, right: 40 },
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    finalY = (doc as any).lastAutoTable?.finalY || finalY + 120;
  }

  // --- SECTION: PRACTICING ATTORNEYS ROSTER ---
  if (finalY > 620) {
    doc.addPage();
    finalY = 50;
  } else {
    finalY += 22;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...accentColor);
  doc.text('III. ROSTER OF PRACTICING COUNSEL & HOURLY SCHEDULE', 40, finalY);

  const lawyersData = bundle.lawyers.map((l) => [
    l.name,
    l.title,
    l.barNumber,
    l.specialization.slice(0, 2).join(', '),
    `$${l.hourlyRate || 650}/hr`,
    l.officeAddress || 'Main Chambers'
  ]);

  autoTable(doc, {
    startY: finalY + 8,
    head: [['Attorney at Law', 'Title / Rank', 'Bar Admission', 'Primary Focus Areas', 'Hourly Rate', 'Chambers / Office']],
    body: lawyersData,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 4
    }
  });

  finalY = (doc as any).lastAutoTable?.finalY || finalY + 100;

  // --- OFFICIAL CERTIFICATION & SIGNATURE BLOCK ---
  if (finalY > 640) {
    doc.addPage();
    finalY = 50;
  } else {
    finalY += 30;
  }

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.line(40, finalY, pageWidth - 40, finalY);

  finalY += 16;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'I hereby certify that this Practice Performance Report represents an authentic, confidential summary of active dockets, retainer deposits, and lawyer hours as maintained in the JurisPulse Practice Management System.',
    40,
    finalY,
    { maxWidth: pageWidth - 80 }
  );

  finalY += 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Certified and sealed by:', 40, finalY);

  doc.text('Authorized Firm Managing Partner', pageWidth - 220, finalY);

  finalY += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${bundle.currentLawyer.name}`, 40, finalY);
  doc.text('JurisPulse Legal Partners LLP', pageWidth - 220, finalY);

  finalY += 12;
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${bundle.currentLawyer.barNumber}`, 40, finalY);
  doc.text(`Digital Verification Timestamp: ${new Date().toISOString()}`, pageWidth - 220, finalY);

  // Save the PDF
  const filename = `JurisPulse_Executive_Report_${config.timeframe.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Generates an Litigation Court Hearing Docket in PDF format.
 */
export function generateLitigationDocketPDF(bundle: ReportDataBundle): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor: [number, number, number] = [15, 23, 42];

  // Header Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JURISPULSE LITIGATION DOCKET & COURT CALENDAR REPORT', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`FIRM TRIAL CALENDAR • GENERATED ${new Date().toLocaleDateString()}`, 40, 46);

  const docketData = bundle.cases.map((c) => [
    c.id,
    c.title,
    c.clientName,
    c.caseType,
    c.caseStatus,
    c.courtJurisdiction || 'U.S. District Court',
    c.leadCounsel || bundle.currentLawyer.name,
    c.hearingDate || 'Oral Argument TBD',
    c.lastUpdated
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Docket #', 'Case Title', 'Client', 'Type', 'Status', 'Jurisdiction', 'Lead Counsel', 'Next Hearing', 'Last Activity']],
    body: docketData,
    margin: { left: 40, right: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 4.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  doc.save(`JurisPulse_Litigation_Docket_${Date.now()}.pdf`);
}

/**
 * Generates a comprehensive Financial & Practice Audit Workbook in Excel (.xlsx) format.
 */
export function generateFinancialAuditExcel(bundle: ReportDataBundle): void {
  const wb = XLSX.utils.book_new();

  // 1. Invoices & Billing Sheet
  const invoicesData = bundle.invoices.map((inv) => ({
    'Invoice Number': inv.id,
    'Client Name': inv.clientName,
    'Matter Docket': inv.caseId,
    'Billing Category': inv.type,
    'Amount (USD)': inv.amount,
    'Payment Status': inv.status,
    'Issue Date': inv.issueDate,
    'Due Date': inv.dueDate,
    'Payment Method': inv.paymentMethod || 'IOLTA Wire'
  }));
  const wsInvoices = XLSX.utils.json_to_sheet(invoicesData);
  XLSX.utils.book_append_sheet(wb, wsInvoices, 'Billing & Invoices');

  // 2. Active Matters / Cases Sheet
  const casesData = bundle.cases.map((c) => ({
    'Docket ID': c.id,
    'Matter Title': c.title,
    'Client Name': c.clientName,
    'Practice Group': c.caseType,
    'Status': c.caseStatus,
    'Court Jurisdiction': c.courtJurisdiction || 'Federal Court',
    'Lead Attorney': c.leadCounsel || bundle.currentLawyer.name,
    'Next Hearing': c.hearingDate || 'TBD',
    'Last Docket Entry': c.lastUpdated
  }));
  const wsCases = XLSX.utils.json_to_sheet(casesData);
  XLSX.utils.book_append_sheet(wb, wsCases, 'Litigation Dockets');

  // 3. Client Directory Sheet
  const clientsData = bundle.clients.map((cli) => ({
    'Client ID': cli.id,
    'Full Name': cli.name,
    'Corporate Entity': cli.company || 'Private Individual',
    'Email Address': cli.email,
    'Phone': cli.phone,
    'Primary Case Area': cli.caseType,
    'Relationship Status': cli.status,
    'Total Matters': cli.totalMatters,
    'Client Since': cli.joinedDate
  }));
  const wsClients = XLSX.utils.json_to_sheet(clientsData);
  XLSX.utils.book_append_sheet(wb, wsClients, 'Client Directory');

  // 4. Practicing Lawyers Roster
  const lawyersData = bundle.lawyers.map((l) => ({
    'Attorney Name': l.name,
    'Title / Role': l.title,
    'Bar Admission': l.barNumber,
    'Specializations': l.specialization.join('; '),
    'Hourly Rate (USD)': l.hourlyRate || 650,
    'Email': l.email,
    'Phone': l.phone,
    'Chambers Address': l.officeAddress || 'Main Suite'
  }));
  const wsLawyers = XLSX.utils.json_to_sheet(lawyersData);
  XLSX.utils.book_append_sheet(wb, wsLawyers, 'Attorneys Roster');

  // Write file
  XLSX.writeFile(wb, `JurisPulse_Practice_Audit_Master_${Date.now()}.xlsx`);
}

/**
 * Exports CSV representation of any dataset.
 */
export function exportToCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
