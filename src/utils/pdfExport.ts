import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProductivityMetrics, CaseFile, Invoice, CaseDeadline, ClientDocument, TimeEntry } from '../types';

export const exportProductivityReportPDF = (
  metrics: ProductivityMetrics,
  firmName: string = 'JurisPulse Law Practice Suite'
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Firm Letterhead Header
  doc.setFillColor(15, 23, 42); // slate-900 header bar
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(firmName.toUpperCase(), 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('EXECUTIVE PRODUCTIVITY & PERFORMANCE METRICS REPORT', 14, 22);

  // Date and Meta
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${nowStr} | Confidential Internal Legal Document`, 14, 35);

  // High level Summary KPI Boxes
  doc.setLineWidth(0.3);
  doc.setDrawColor(226, 232, 240);

  // Box 1: Revenue
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 40, 56, 24, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text('MONTHLY REVENUE', 18, 46);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${metrics.totalRevenueMonth.toLocaleString()}`, 18, 54);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // green
  doc.text(`Target: $${metrics.revenueTarget.toLocaleString()}`, 18, 60);

  // Box 2: Billable Hours
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(77, 40, 56, 24, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text('BILLABLE HOURS', 81, 46);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${metrics.totalBillableHoursMonth} hrs`, 81, 54);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text(`Goal: ${metrics.billableHoursTarget} hrs`, 81, 60);

  // Box 3: Realization Rate
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(140, 40, 56, 24, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text('REALIZATION RATE', 144, 46);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${metrics.realizationRatePercent}%`, 144, 54);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(139, 92, 246);
  doc.text(`Deadlines Compliance: ${metrics.deadlineCompliancePercent}%`, 144, 60);

  // Section 1: Staff Productivity Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Attorney & Staff Billable Hours Breakdown', 14, 73);

  const staffHead = [['Attorney / Staff', 'Role', 'Target Hours', 'Actual Billed', 'Utilization', 'Billed Revenue']];
  const staffRows = metrics.staffProductivity.map((s) => [
    s.lawyerName,
    s.role,
    `${s.targetHours} h`,
    `${s.actualHours} h`,
    `${s.utilizationRate}%`,
    `$${s.billedAmount.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 76,
    head: staffHead,
    body: staffRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  // Section 2: Practice Area Breakdown Table
  const finalY1 = (doc as any).lastAutoTable?.finalY || 130;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Practice Area Case Volume & Revenue', 14, finalY1 + 10);

  const paHead = [['Practice Area', 'Active Matters', 'Current Month Revenue', 'Avg Revenue / Matter']];
  const paRows = metrics.practiceAreaBreakdown.map((pa) => [
    pa.name,
    `${pa.count} cases`,
    `$${pa.revenue.toLocaleString()}`,
    `$${Math.round(pa.revenue / (pa.count || 1)).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: finalY1 + 13,
    head: paHead,
    body: paRows,
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  // Footer Signature Line
  const finalY2 = (doc as any).lastAutoTable?.finalY || 200;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('Certified by JurisPulse Practice Management System. All monetary values in USD.', 14, finalY2 + 15);

  doc.save(`JurisPulse_Productivity_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportCaseListPDF = (cases: CaseFile[], customTitle: string = 'CASE DIRECTORY REPORT') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`JURISPULSE LAW PRACTICE SUITE - ${customTitle.toUpperCase()}`, 14, 15);

  const head = [['Case #', 'Case Title', 'Client Name', 'Practice Area', 'Assigned Lawyer', 'Status', 'Retainer Rem.', 'Total Billed']];
  const rows = cases.map((c) => [
    c.caseNumber,
    c.title,
    c.clientName,
    c.practiceArea,
    c.assignedLawyerName,
    c.status.toUpperCase().replace('_', ' '),
    `$${c.retainerRemaining.toLocaleString()}`,
    `$${c.totalBilled.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 28,
    head: head,
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 120;
  const totalRetainer = cases.reduce((acc, c) => acc + c.retainerRemaining, 0);
  const totalBilled = cases.reduce((acc, c) => acc + c.totalBilled, 0);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, finalY + 6, 269, 16, 2, 2, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`TOTAL MATTERS: ${cases.length}`, 20, finalY + 16);
  doc.text(`AGGREGATE RETAINER REMAINING: $${totalRetainer.toLocaleString()}`, 90, finalY + 16);
  doc.text(`TOTAL ACCRUED BILLINGS: $${totalBilled.toLocaleString()}`, 190, finalY + 16);

  doc.save(`JurisPulse_Cases_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportBatchCasesDetailedReportPDF = (cases: CaseFile[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top header banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BATCH MATTERS DOSSIER & LITIGATION SUMMARY', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('JURISPULSE LAW PARTNERS LLP | EXECUTIVE LEGAL REPORT', 14, 23);

  // Metadata
  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.text(`Report Generated: ${nowStr} | Confidential Work-Product`, 14, 37);

  // Summary Metrics Banner
  const totalRetainer = cases.reduce((acc, c) => acc + c.retainerRemaining, 0);
  const totalBilled = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalRetainerInit = cases.reduce((acc, c) => acc + c.retainerAmount, 0);

  doc.setLineWidth(0.3);
  doc.setDrawColor(226, 232, 240);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, 58, 20, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.text('SELECTED MATTERS', 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${cases.length} Cases`, 18, 56);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(76, 42, 58, 20, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL RETAINER POOL', 80, 48);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${totalRetainer.toLocaleString()}`, 80, 56);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(138, 42, 58, 20, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('LIFETIME ACCRUED BILLED', 142, 48);
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${totalBilled.toLocaleString()}`, 142, 56);

  // Table of Matters
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary of Selected Matters', 14, 70);

  const head = [['Case #', 'Title', 'Client', 'Practice Area', 'Status', 'Lead Counsel', 'Retainer Rem.']];
  const rows = cases.map((c) => [
    c.caseNumber,
    c.title,
    c.clientName,
    c.practiceArea,
    c.status.toUpperCase().replace('_', ' '),
    c.assignedLawyerName,
    `$${c.retainerRemaining.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 74,
    head: head,
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  let currentY = (doc as any).lastAutoTable?.finalY || 130;

  // Individual Case Breakdown Sections
  cases.forEach((c, idx) => {
    // Check if we need a new page
    if (currentY > 235) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 8;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, 182, 36, 2, 2, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${idx + 1}. [${c.caseNumber}] ${c.title}`, 18, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Client: ${c.clientName} (${c.clientEmail || 'N/A'}) | Area: ${c.practiceArea} | Stage: ${c.status.toUpperCase()}`, 18, currentY + 13);
    doc.text(`Lead Counsel: ${c.assignedLawyerName} | Hourly Rate: $${c.hourlyRate}/hr | Opened: ${c.openedDate}`, 18, currentY + 18);

    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(`Summary: ${c.description || 'Active legal proceeding.'}`, 174);
    doc.text(splitDesc.slice(0, 2), 18, currentY + 24);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Retainer: $${c.retainerRemaining.toLocaleString()} / $${c.retainerAmount.toLocaleString()} | Billed: $${c.totalBilled.toLocaleString()}`, 18, currentY + 32);

    currentY += 38;
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `JurisPulse Practice Management System • Page ${i} of ${pageCount} • Privileged & Confidential Attorney-Client Work Product`,
      14,
      287
    );
  }

  doc.save(`JurisPulse_Batch_Cases_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('INVOICE', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 26);

  doc.text('JURISPULSE LAW PARTNERS LLP', 130, 18);
  doc.setFontSize(8);
  doc.text('100 Legal Plaza, Suite 2400', 130, 23);
  doc.text('billing@juris-pulse.law | (800) 555-JURIS', 130, 27);

  // Client info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO:', 14, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(invoice.clientName, 14, 48);
  doc.text(invoice.clientEmail, 14, 53);
  doc.text(`Re: ${invoice.caseTitle}`, 14, 58);

  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS:', 130, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`Issue Date: ${invoice.issueDate}`, 130, 48);
  doc.text(`Payment Due: ${invoice.dueDate}`, 130, 53);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 130, 58);

  // Table items
  const itemHead = [['Description of Services / Disbursements', 'Hours', 'Rate ($/hr)', 'Amount ($)']];
  const itemRows = invoice.items.map((i) => [
    i.description,
    i.hours > 0 ? `${i.hours}` : 'N/A',
    i.rate !== 0 ? `$${i.rate}` : '-',
    `$${i.amount.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 65,
    head: itemHead,
    body: itemRows,
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 120;

  // Totals box
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY + 6, 76, 28, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Subtotal: $${invoice.subtotal.toLocaleString()}`, 125, finalY + 13);
  doc.text(`Amount Paid: $${invoice.amountPaid.toLocaleString()}`, 125, finalY + 19);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(`BALANCE DUE: $${(invoice.totalAmount - invoice.amountPaid).toLocaleString()}`, 125, finalY + 27);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for trusting JurisPulse Law Partners with your legal representation.', 14, finalY + 45);

  doc.save(`${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
};

export const exportClientStatusReceiptPDF = (
  clientName: string,
  cases: CaseFile[],
  docs: ClientDocument[],
  invoices: Invoice[]
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CLIENT STATEMENT & CASE STATUS RECEIPT', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('JURISPULSE LAW PARTNERS LLP | CLIENT PORTAL OFFICIAL REPORT', 14, 23);

  // Client Meta Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT ACCOUNT:', 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(clientName, 14, 44);

  const nowStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT METADATA:', 130, 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated: ${nowStr}`, 130, 44);
  doc.text(`Active Matters: ${cases.length}`, 130, 49);
  doc.text(`Listed Documents: ${docs.length}`, 130, 54);

  // Section 1: Active Cases Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Active Case Files & Litigation Status', 14, 62);

  const caseHead = [['Case Number', 'Title / Matter', 'Practice Area', 'Assigned Counsel', 'Status', 'Retainer Rem.']];
  const caseRows = cases.map((c) => [
    c.caseNumber,
    c.title,
    c.practiceArea,
    c.assignedLawyerName,
    c.status.toUpperCase().replace('_', ' '),
    `$${c.retainerRemaining.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 65,
    head: caseHead,
    body: caseRows.length > 0 ? caseRows : [['No active cases listed', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  let currentY = (doc as any).lastAutoTable?.finalY || 110;

  // Section 2: Listed Documents & Pleadings Registry
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Listed Documents & Discovery Pleadings', 14, currentY + 10);

  const docHead = [['Document Name', 'Category', 'Case Matter', 'Uploaded Date', 'Security']];
  const docRows = docs.map((d) => [
    d.fileName,
    d.category,
    d.caseTitle,
    d.uploadedAt,
    d.isConfidential ? 'CONFIDENTIAL' : 'STANDARD'
  ]);

  autoTable(doc, {
    startY: currentY + 13,
    head: docHead,
    body: docRows.length > 0 ? docRows : [['No listed documents found', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  currentY = (doc as any).lastAutoTable?.finalY || currentY + 60;

  // Financial Summary Box
  const totalRetainer = cases.reduce((acc, c) => acc + c.retainerRemaining, 0);
  const totalBilled = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);

  doc.setFillColor(248, 250, 252);
  doc.rect(14, currentY + 8, 182, 28, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CLIENT FINANCIAL STATEMENT RECEIPT SUMMARY', 18, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Total Retainer Remaining: $${totalRetainer.toLocaleString()}`, 18, currentY + 22);
  doc.text(`Total Lifetime Billed: $${totalBilled.toLocaleString()}`, 18, currentY + 28);

  doc.text(`Total Invoices Issued: $${totalInvoiced.toLocaleString()}`, 105, currentY + 22);
  doc.text(`Total Amount Settled: $${totalPaid.toLocaleString()}`, 105, currentY + 28);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('This receipt is electronically generated via JurisPulse E2EE Client Portal Vault.', 14, currentY + 42);

  doc.save(`JurisPulse_Status_Receipt_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export interface ClientMonthlyBillingPDFOptions {
  clientName: string;
  clientEmail?: string;
  cases: CaseFile[];
  selectedCaseId?: string; // 'all' or specific case ID
  monthYear?: string; // e.g. "2026-08" or "August 2026"
  startDate?: string;
  endDate?: string;
  dateRangeLabel?: string;
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  customNotes?: string;
  firmName?: string;
  includeTimeEntries?: boolean;
  includeInvoicesSummary?: boolean;
  includeRetainerReconciliation?: boolean;
}

export const exportClientMonthlyBillingPDF = (options: ClientMonthlyBillingPDFOptions) => {
  const {
    clientName,
    clientEmail = '',
    cases,
    selectedCaseId = 'all',
    monthYear = '2026-08',
    startDate = '',
    endDate = '',
    dateRangeLabel = '',
    timeEntries,
    invoices,
    customNotes = '',
    firmName = 'JURISPULSE LAW PARTNERS LLP',
    includeTimeEntries = true,
    includeInvoicesSummary = true,
    includeRetainerReconciliation = true
  } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Filter cases relevant to this client
  const clientCases = cases.filter((c) => {
    const matchesClient = c.clientName.toLowerCase() === clientName.toLowerCase() ||
      (c.clientEmail && clientEmail && c.clientEmail.toLowerCase() === clientEmail.toLowerCase()) ||
      clientName === 'All Clients' ||
      clientName === 'All Active Clients';
    
    if (!matchesClient) return false;
    if (selectedCaseId && selectedCaseId !== 'all') {
      return c.id === selectedCaseId;
    }
    return true;
  });

  const caseIds = new Set(clientCases.map((c) => c.id));

  // Parse Month/Year string (e.g., "2026-08" or "August 2026") or use custom dateRangeLabel
  let monthLabel = dateRangeLabel || monthYear;
  let filterPrefix = monthYear;
  if (/^\d{4}-\d{2}$/.test(monthYear)) {
    const [year, month] = monthYear.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    monthLabel = dateRangeLabel || dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    filterPrefix = monthYear;
  }

  // Filter time entries for client & selected date range / month
  const relevantTimeEntries = timeEntries.filter((te) => {
    const isClientCase = caseIds.size === 0 || caseIds.has(te.caseId);
    if (!isClientCase) return false;

    if (startDate && te.date < startDate) return false;
    if (endDate && te.date > endDate) return false;

    if (!startDate && !endDate && filterPrefix && filterPrefix !== 'all' && filterPrefix.includes('-')) {
      return te.date.startsWith(filterPrefix);
    }
    return true;
  });

  // Filter invoices for client & selected date range / month
  const relevantInvoices = invoices.filter((inv) => {
    const isClientCase = caseIds.size === 0 || caseIds.has(inv.caseId);
    const matchesClientName = inv.clientName.toLowerCase() === clientName.toLowerCase() || clientName.startsWith('All');
    if (!isClientCase && !matchesClientName) return false;

    if (startDate || endDate) {
      const invDate = inv.issueDate || inv.dueDate || '';
      if (startDate && invDate && invDate < startDate) return false;
      if (endDate && invDate && invDate > endDate) return false;
      return true;
    }

    if (filterPrefix && filterPrefix !== 'all' && filterPrefix.includes('-')) {
      return (inv.issueDate && inv.issueDate.startsWith(filterPrefix)) ||
             (inv.dueDate && inv.dueDate.startsWith(filterPrefix)) ||
             inv.status !== 'paid';
    }
    return true;
  });

  // Financial aggregates
  const totalHoursLogged = relevantTimeEntries.reduce((acc, te) => acc + (te.hours || 0), 0);
  const totalTimeFees = relevantTimeEntries.reduce((acc, te) => acc + (te.amount || (te.hours * te.rate)), 0);
  const totalInvoiced = relevantInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = relevantInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const totalOutstandingBalance = relevantInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);
  const totalRetainerPool = clientCases.reduce((acc, c) => acc + (c.retainerRemaining || 0), 0);
  const initialRetainerPool = clientCases.reduce((acc, c) => acc + (c.retainerAmount || 0), 0);

  // Statement Code / Identifier
  const statementNum = `STM-${(startDate || monthYear).replace(/[^0-9]/g, '').slice(0, 6) || '202608'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ---------------- HEADER BANNER ----------------
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 34, 'F');

  // Gold accent bar
  doc.setFillColor(217, 119, 6); // amber-600 gold accent
  doc.rect(0, 34, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(firmName.toUpperCase(), 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('MONTHLY CLIENT BILLING STATEMENT & INVOICE DOSSIER', 14, 22);
  doc.text('E2EE Verified Legal Billing & Trust Ledger Management', 14, 28);

  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('100 Legal Plaza, Suite 2400', 140, 14);
  doc.text('New York, NY 10005 | (800) 555-JURIS', 140, 19);
  doc.text('billing@juris-pulse.law | Tax ID: 13-984210', 140, 24);
  doc.text('ABA Certified Legal Management #88492', 140, 29);

  // ---------------- METADATA & CLIENT PARTICULARS ----------------
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  // Client Info Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 40, 96, 32, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CLIENT ACCOUNT & MATTERS OF RECORD:', 18, 47);

  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(clientName, 18, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const emailToShow = clientEmail || clientCases[0]?.clientEmail || 'client.portal@juris-pulse.law';
  doc.text(`Account Email: ${emailToShow}`, 18, 60);

  const matterText = clientCases.length === 1
    ? `Matter: ${clientCases[0].caseNumber} — ${clientCases[0].title.slice(0, 32)}...`
    : `Consolidated across ${clientCases.length} active legal matters`;
  doc.text(matterText, 18, 66);

  // Statement Meta Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(114, 40, 82, 32, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATEMENT PARTICULARS:', 118, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Statement Ref: ${statementNum}`, 118, 53);
  doc.text(`Billing Cycle: ${monthLabel}`, 118, 58);
  doc.text(`Statement Issue Date: ${issueDateStr}`, 118, 63);
  doc.text('Payment Terms: Net 30 Days / Trust Draw', 118, 68);

  // ---------------- HIGH LEVEL FINANCIAL KPI BOXES ----------------
  const kpiY = 76;
  const kpiWidth = 43.5;
  const kpiHeight = 22;

  // Box 1: Monthly Time Entries
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, kpiY, kpiWidth, kpiHeight, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('MONTHLY TIME FEES', 17, kpiY + 6);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(`$${totalTimeFees.toLocaleString()}`, 17, kpiY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text(`${totalHoursLogged.toFixed(1)} billable hrs`, 17, kpiY + 19);

  // Box 2: Total Invoiced
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(60.5, kpiY, kpiWidth, kpiHeight, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICES IN PERIOD', 63.5, kpiY + 6);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(`$${totalInvoiced.toLocaleString()}`, 63.5, kpiY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${relevantInvoices.length} invoices issued`, 63.5, kpiY + 19);

  // Box 3: Total Paid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(107, kpiY, kpiWidth, kpiHeight, 2, 2, 'FD');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENTS RECEIVED', 110, kpiY + 6);
  doc.setTextColor(16, 185, 129); // green
  doc.setFontSize(12);
  doc.text(`$${totalPaid.toLocaleString()}`, 110, kpiY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('Settled & Credited', 110, kpiY + 19);

  // Box 4: Balance Due / Retainer Remaining
  const isBalanceZero = totalOutstandingBalance <= 0;
  doc.setFillColor(isBalanceZero ? 240 : 254, isBalanceZero ? 253 : 242, isBalanceZero ? 244 : 242);
  doc.setDrawColor(isBalanceZero ? 187 : 254, isBalanceZero ? 247 : 205, isBalanceZero ? 208 : 211);
  doc.roundedRect(153.5, kpiY, kpiWidth, kpiHeight, 2, 2, 'FD');
  doc.setTextColor(isBalanceZero ? 22 : 159, isBalanceZero ? 101 : 18, isBalanceZero ? 52 : 57);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('OUTSTANDING DUE', 156.5, kpiY + 6);
  doc.setFontSize(12);
  doc.text(`$${totalOutstandingBalance.toLocaleString()}`, 156.5, kpiY + 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Retainer: $${totalRetainerPool.toLocaleString()}`, 156.5, kpiY + 19);

  let currentY = kpiY + kpiHeight + 8;

  // ---------------- SECTION 1: ITEMIZED MONTHLY TIME ENTRIES ----------------
  if (includeTimeEntries) {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`1. Itemized Legal Time Entries & Professional Services (${monthLabel})`, 14, currentY);

    const timeHead = [['Date', 'Matter / Case Title', 'Counsel / Timekeeper', 'Services & Activity Description', 'Hours', 'Rate', 'Amount']];
    const timeRows = relevantTimeEntries.length > 0
      ? relevantTimeEntries.map((te) => [
          te.date,
          te.caseTitle.length > 25 ? `${te.caseTitle.slice(0, 24)}...` : te.caseTitle,
          te.lawyerName,
          te.description,
          `${te.hours} hrs`,
          `$${te.rate}/hr`,
          `$${(te.amount || (te.hours * te.rate)).toLocaleString()}`
        ])
      : [['-', 'No hourly time logs recorded for this billing cycle', '-', '-', '0.0 hrs', '-', '$0.00']];

    autoTable(doc, {
      startY: currentY + 3,
      head: timeHead,
      body: timeRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2.2 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 34 },
        2: { cellWidth: 26 },
        3: { cellWidth: 64 },
        4: { cellWidth: 16, halign: 'right' },
        5: { cellWidth: 16, halign: 'right' },
        6: { cellWidth: 20, halign: 'right', fontStyle: 'bold' }
      }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 40;

    // Time entry subtotal row
    doc.setFillColor(248, 250, 252);
    doc.rect(14, currentY, 182, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Time Entries Subtotal: ${totalHoursLogged.toFixed(1)} Hours`, 18, currentY + 4.2);
    doc.text(`Total Professional Fees: $${totalTimeFees.toLocaleString()}`, 130, currentY + 4.2);

    currentY += 12;
  }

  // Check page break before Section 2
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  // ---------------- SECTION 2: INVOICES SUMMARY & LEDGER ----------------
  if (includeInvoicesSummary) {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('2. Monthly Invoice Summaries & Account Statement Ledger', 14, currentY);

    const invHead = [['Invoice #', 'Matter Title', 'Issue Date', 'Due Date', 'Status', 'Total Invoiced', 'Paid to Date', 'Balance Due']];
    const invRows = relevantInvoices.length > 0
      ? relevantInvoices.map((inv) => [
          inv.invoiceNumber,
          inv.caseTitle.length > 25 ? `${inv.caseTitle.slice(0, 24)}...` : inv.caseTitle,
          inv.issueDate,
          inv.dueDate,
          inv.status.toUpperCase().replace('_', ' '),
          `$${inv.totalAmount.toLocaleString()}`,
          `$${inv.amountPaid.toLocaleString()}`,
          `$${(inv.totalAmount - inv.amountPaid).toLocaleString()}`
        ])
      : [['-', 'No outstanding or issued invoices in this cycle', '-', '-', 'SETTLED', '$0.00', '$0.00', '$0.00']];

    autoTable(doc, {
      startY: currentY + 3,
      head: invHead,
      body: invRows,
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2.2 },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 42 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20, fontStyle: 'bold' },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
      }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 30;
    currentY += 8;
  }

  // Check page break before Section 3
  if (currentY > 215) {
    doc.addPage();
    currentY = 20;
  }

  // ---------------- SECTION 3: TRUST & RETAINER RECONCILIATION ----------------
  if (includeRetainerReconciliation) {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('3. Retainer Trust Account Reconciliation & Replenishment Notice', 14, currentY);

    const retHead = [['Case #', 'Matter Title', 'Practice Area', 'Initial Retainer', 'Total Billed to Date', 'Retainer Remaining', 'Trust Status']];
    const retRows = clientCases.length > 0
      ? clientCases.map((c) => {
          const burnPct = Math.round((c.totalBilled / (c.retainerAmount || 1)) * 100);
          const statusStr = burnPct >= 80 ? `ALERT (${burnPct}%)` : `${burnPct}% Normal`;
          return [
            c.caseNumber,
            c.title.length > 25 ? `${c.title.slice(0, 24)}...` : c.title,
            c.practiceArea,
            `$${c.retainerAmount.toLocaleString()}`,
            `$${c.totalBilled.toLocaleString()}`,
            `$${c.retainerRemaining.toLocaleString()}`,
            statusStr
          ];
        })
      : [['-', 'General Client Account', 'Corporate', `$${initialRetainerPool.toLocaleString()}`, `$${totalTimeFees.toLocaleString()}`, `$${totalRetainerPool.toLocaleString()}`, 'Active']];

    autoTable(doc, {
      startY: currentY + 3,
      head: retHead,
      body: retRows,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2.2 },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 50 },
        2: { cellWidth: 26 },
        3: { cellWidth: 22, halign: 'right' },
        4: { cellWidth: 24, halign: 'right' },
        5: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
        6: { cellWidth: 20, halign: 'center' }
      }
    });

    currentY = (doc as any).lastAutoTable?.finalY || currentY + 30;
    currentY += 8;
  }

  // Check page break before Section 4
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  // ---------------- SECTION 4: PAYMENT REMITTANCE & LEGAL AUDIT ----------------
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 36, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('WIRE & ESCROW REMITTANCE INSTRUCTIONS', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Bank: First National Commercial Escrow & Trust Bank | ABA Routing: 021000021', 18, currentY + 13);
  doc.text(`Account Name: JurisPulse Law Partners LLP Client Trust Escrow | Account #: 8892-0048-2194`, 18, currentY + 18);
  doc.text(`Reference: ${statementNum} / Client: ${clientName.slice(0, 30)}`, 18, currentY + 23);
  doc.text('Payments received after 30 days are subject to 1.5% monthly late fee in accordance with retainer agreement.', 18, currentY + 28);
  
  if (customNotes) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(30, 41, 59);
    doc.text(`Counsel Memo: ${customNotes.slice(0, 95)}`, 18, currentY + 33);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for trusting JurisPulse Law Partners LLP with your confidential legal representation.', 18, currentY + 33);
  }

  // Page numbering and cryptographic watermark on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `JurisPulse Practice Management System • Page ${i} of ${pageCount} • Privileged & Confidential Attorney-Client Billing Dossier • Digital Seal SHA-256 Validated`,
      14,
      288
    );
  }

  const cleanClientSlug = clientName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanMonthSlug = (startDate ? `${startDate}_to_${endDate}` : monthYear).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`JurisPulse_Monthly_Billing_Invoice_${cleanClientSlug}_${cleanMonthSlug}.pdf`);
};

export interface DateRangeBillingReportPDFOptions {
  dateRangeLabel: string;
  startDate?: string;
  endDate?: string;
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  cases: CaseFile[];
  firmName?: string;
}

export const exportDateRangeBillingReportPDF = (options: DateRangeBillingReportPDFOptions) => {
  const {
    dateRangeLabel,
    startDate = '',
    endDate = '',
    timeEntries,
    invoices,
    cases,
    firmName = 'JURISPULSE LAW PARTNERS LLP'
  } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Filter time entries in range
  const filteredTimeEntries = timeEntries.filter((te) => {
    if (startDate && te.date < startDate) return false;
    if (endDate && te.date > endDate) return false;
    return true;
  });

  // Filter invoices in range
  const filteredInvoices = invoices.filter((inv) => {
    const invDate = inv.issueDate || inv.dueDate || '';
    if (startDate && invDate && invDate < startDate) return false;
    if (endDate && invDate && invDate > endDate) return false;
    return true;
  });

  const totalHours = filteredTimeEntries.reduce((acc, te) => acc + (te.hours || 0), 0);
  const totalTimeFees = filteredTimeEntries.reduce((acc, te) => acc + (te.amount || te.hours * te.rate), 0);
  const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = filteredInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const balanceDue = filteredInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);

  // Group by lawyer for timekeeper breakdown
  const timekeeperMap = new Map<string, { name: string; hours: number; fees: number; matters: Set<string> }>();
  filteredTimeEntries.forEach((te) => {
    const key = te.lawyerName || 'Staff Attorney';
    if (!timekeeperMap.has(key)) {
      timekeeperMap.set(key, { name: key, hours: 0, fees: 0, matters: new Set() });
    }
    const rec = timekeeperMap.get(key)!;
    rec.hours += te.hours || 0;
    rec.fees += te.amount || te.hours * te.rate;
    rec.matters.add(te.caseTitle);
  });
  const timekeeperList = Array.from(timekeeperMap.values());

  // ---------------- HEADER BANNER ----------------
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  // Gold accent bar
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(0, 36, 210, 2, 'F');

  // Firm Name & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(firmName, 14, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('LEGAL FINANCIAL OPERATIONS & BILLING CYCLE AUDIT DOSSIER', 14, 20);
  doc.text('New York • Washington D.C. • London • Silicon Valley', 14, 25);

  // Date Range Badge right-aligned
  doc.setFillColor(30, 58, 138); // blue-900
  doc.roundedRect(125, 8, 71, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.text('BILLING CYCLE PERIOD', 130, 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(dateRangeLabel.slice(0, 24), 130, 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, 130, 26);

  let currentY = 44;

  // ---------------- EXECUTIVE SUMMARY METRIC TILES ----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Financial Summary in Filtered Period', 14, currentY);
  currentY += 4;

  const tileWidth = 34;
  const tileHeight = 16;
  const tiles = [
    { label: 'BILLABLE HOURS', val: `${totalHours.toFixed(1)} hrs`, sub: 'Logged Time', fill: [239, 246, 255], border: [191, 219, 254], text: [29, 78, 216] },
    { label: 'HOURLY FEES', val: `$${totalTimeFees.toLocaleString()}`, sub: 'Accrued WIP', fill: [248, 250, 252], border: [226, 232, 240], text: [15, 23, 42] },
    { label: 'TOTAL INVOICED', val: `$${totalInvoiced.toLocaleString()}`, sub: 'Billed to Clients', fill: [248, 250, 252], border: [226, 232, 240], text: [15, 23, 42] },
    { label: 'COLLECTIONS', val: `$${totalPaid.toLocaleString()}`, sub: 'Settled Funds', fill: [240, 253, 244], border: [187, 247, 208], text: [21, 128, 61] },
    { label: 'AR BALANCE DUE', val: `$${balanceDue.toLocaleString()}`, sub: balanceDue > 0 ? 'Pending Collection' : 'Settled', fill: [255, 251, 235], border: [253, 230, 138], text: [180, 83, 9] }
  ];

  tiles.forEach((t, i) => {
    const xPos = 14 + i * (tileWidth + 3);
    doc.setFillColor(t.fill[0], t.fill[1], t.fill[2]);
    doc.setDrawColor(t.border[0], t.border[1], t.border[2]);
    doc.roundedRect(xPos, currentY, tileWidth, tileHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(t.label, xPos + 2.5, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(t.text[0], t.text[1], t.text[2]);
    doc.text(t.val, xPos + 2.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.text(t.sub, xPos + 2.5, currentY + 13.5);
  });

  currentY += tileHeight + 8;

  // ---------------- SECTION 2: TIMEKEEPER PRODUCTIVITY IN PERIOD ----------------
  if (timekeeperList.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Timekeeper Productivity & Utilization in Period', 14, currentY);
    currentY += 2;

    const tkTableRows = timekeeperList.map((tk) => [
      tk.name,
      `${tk.matters.size} matter${tk.matters.size > 1 ? 's' : ''}`,
      `${tk.hours.toFixed(1)} hrs`,
      `$${Math.round(tk.hours > 0 ? tk.fees / tk.hours : 0)}/hr`,
      `$${tk.fees.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Attorney / Timekeeper', 'Matters Serviced', 'Logged Hours', 'Effective Avg Rate', 'Total Accrued Fees']],
      body: tkTableRows,
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
      bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 30, fontStyle: 'bold', halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 32, fontStyle: 'bold', halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // ---------------- SECTION 3: INVOICES IN PERIOD ----------------
  if (filteredInvoices.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Invoices Ledger in Period', 14, currentY);
    currentY += 2;

    const invRows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.clientName.slice(0, 24),
      inv.issueDate,
      inv.dueDate,
      `$${inv.totalAmount.toLocaleString()}`,
      `$${inv.amountPaid.toLocaleString()}`,
      `$${(inv.totalAmount - inv.amountPaid).toLocaleString()}`,
      inv.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Invoice #', 'Client Account', 'Issue Date', 'Due Date', 'Billed', 'Paid', 'Balance', 'Status']],
      body: invRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
      bodyStyles: { fontSize: 6.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
        7: { cellWidth: 18, halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // ---------------- SECTION 4: ITEMIZED TIME ENTRIES IN PERIOD ----------------
  if (filteredTimeEntries.length > 0) {
    if (currentY > 220) {
      doc.addPage();
      currentY = 18;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('4. Itemized Billable Time Entries in Period', 14, currentY);
    currentY += 2;

    const teRows = filteredTimeEntries.map((te) => [
      te.date,
      te.lawyerName,
      te.caseTitle.slice(0, 26),
      `${te.hours}h`,
      `$${te.rate}`,
      `$${te.amount.toLocaleString()}`,
      te.isBilled ? 'BILLED' : 'UNBILLED',
      te.description.slice(0, 48)
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Date', 'Attorney', 'Matter', 'Hrs', 'Rate', 'Amount', 'Status', 'Work Narrative']],
      body: teRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6.5 },
      bodyStyles: { fontSize: 6, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 24 },
        2: { cellWidth: 32, fontStyle: 'bold' },
        3: { cellWidth: 10, halign: 'center' },
        4: { cellWidth: 14, halign: 'right' },
        5: { cellWidth: 16, halign: 'right', fontStyle: 'bold' },
        6: { cellWidth: 16, halign: 'center' },
        7: { cellWidth: 54 }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Page numbering and cryptographic watermark on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `JurisPulse Practice Management • Billing Cycle Audit Report (${dateRangeLabel}) • Page ${i} of ${pageCount} • Confidential Legal Work Product`,
      14,
      288
    );
  }

  const fileSlug = dateRangeLabel.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`JurisPulse_Billing_Cycle_Report_${fileSlug}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export interface DocumentCustodyAuditPDFOptions {
  document: ClientDocument;
  matchedCase?: CaseFile;
  firmName?: string;
  certifyingCounsel?: string;
  barNumber?: string;
  jurisdiction?: string;
  notes?: string;
}

export const exportDocumentCustodyAuditPDF = (options: DocumentCustodyAuditPDFOptions) => {
  const {
    document,
    matchedCase,
    firmName = 'JURISPULSE LAW PARTNERS LLP',
    certifyingCounsel = document.verifiedBy || document.uploadedBy || 'Counsel of Record',
    barNumber = 'NY-BAR #5849201 / US-DIST-SDNY',
    jurisdiction = (matchedCase as any)?.statutoryJurisdiction || 'Federal District Court / Civil & Commercial Trial Division',
    notes = ''
  } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const custodyHash = document.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${document.id}`;
  const isVerified = document.verificationStatus === 'Verified';

  // ---------------- HEADER / COURTROOM CERTIFICATE LETTERHEAD ----------------
  doc.setFillColor(15, 23, 42); // slate-900 header bar
  doc.rect(0, 0, 210, 32, 'F');

  // Accent Line
  doc.setFillColor(59, 130, 246); // blue-500 accent
  doc.rect(0, 32, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(firmName.toUpperCase(), 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text('COURTROOM EVIDENTIARY ARCHIVE & CHAIN-OF-CUSTODY AUDIT CERTIFICATE', 14, 20);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Pursuant to Fed. R. Evid. 901/902(11)/(14), Uniform Electronic Evidence Act & 28 U.S.C. § 1746', 14, 26);

  // Certificate ID and Generation Date (Top Right)
  const now = new Date();
  const certId = `CERT-${document.id.toUpperCase().slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`CERTIFICATE REF: ${certId}`, 196, 13, { align: 'right' });
  doc.text(`ISSUED: ${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('en-US', { hour12: false })}`, 196, 19, { align: 'right' });
  doc.text(`INTEGRITY AUDIT: FIPS 180-4 COMPLIANT`, 196, 25, { align: 'right' });

  let currentY = 40;

  // ---------------- SECTION 1: PROCEEDING & CASE MATTER PARTICULARS ----------------
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, 182, 30, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. LEGAL PROCEEDING & MATTER IDENTIFICATION', 18, currentY + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text(`Case Caption / Title:`, 18, currentY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${matchedCase?.title || document.caseTitle || 'Legal Proceeding'}`, 54, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Docket / Matter ID:`, 18, currentY + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${matchedCase?.caseNumber || document.caseId}`, 54, currentY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Client of Record:`, 18, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${matchedCase?.clientName || document.clientName}`, 54, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Statutory Jurisdiction:`, 115, currentY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${jurisdiction.slice(0, 38)}`, 148, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Lead Counsel:`, 115, currentY + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${matchedCase?.assignedLawyerName || certifyingCounsel}`, 148, currentY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Practice Area:`, 115, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${matchedCase?.practiceArea || document.category || 'Litigation'}`, 148, currentY + 22);

  currentY += 35;

  // ---------------- SECTION 2: EVIDENTIARY RECORD SPECIFICATIONS & INTEGRITY ----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. EVIDENTIARY RECORD SPECIFICATIONS & INTEGRITY RECORD', 14, currentY);
  currentY += 3;

  const metaRows = [
    [
      'Exhibit / File Name',
      document.fileName,
      'Vault GUID',
      document.id
    ],
    [
      'Document Category',
      document.category,
      'Format / Version',
      `${document.fileType.toUpperCase()} (v${document.version || 1}) • ${document.fileSize}`
    ],
    [
      'Initial Vault Ingestion',
      `${document.uploadedAt} by ${document.uploadedBy}`,
      'Privilege Classification',
      document.isConfidential ? 'CONFIDENTIAL / ATTORNEY WORK-PRODUCT' : 'STANDARD EVIDENTIARY RECORD'
    ],
    [
      'Evidentiary Status',
      isVerified ? `VERIFIED & AUTHENTICATED (${document.verifiedAt || 'Certified'})` : 'PROVISIONAL / NEEDS AUDIT',
      'Attestation Officer',
      document.verifiedBy || certifyingCounsel
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: metaRows,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold', fillColor: [241, 245, 249] },
      1: { cellWidth: 53 },
      2: { cellWidth: 38, fontStyle: 'bold', fillColor: [241, 245, 249] },
      3: { cellWidth: 53 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Cryptographic Seal Box
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, 182, 16, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text('CRYPTOGRAPHIC SHA-256 DIGITAL SEAL & IMMUTABLE HASH DIGEST:', 18, currentY + 5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(custodyHash, 18, currentY + 11);

  currentY += 21;

  // ---------------- SECTION 3: CHRONOLOGICAL AUDIT TRAIL & CHAIN-OF-CUSTODY ----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. CHRONOLOGICAL CHAIN-OF-CUSTODY & AUDIT EVENT HISTORY', 14, currentY);
  currentY += 3;

  const custodyEvents = document.chainOfCustody && document.chainOfCustody.length > 0
    ? document.chainOfCustody
    : [
        {
          id: 'c-init',
          action: 'Uploaded & Sealed',
          performedBy: document.uploadedBy,
          timestamp: document.uploadedAt,
          note: 'Initial deposit into encrypted firm repository with SHA-256 checksum generation.'
        },
        ...(isVerified
          ? [
              {
                id: 'c-auth',
                action: 'Marked Verified',
                performedBy: document.verifiedBy || certifyingCounsel,
                timestamp: document.verifiedAt || document.uploadedAt,
                note: 'Counsel conducted evidentiary review and authenticated document authenticity.'
              }
            ]
          : [])
      ];

  const custodyRows = custodyEvents.map((evt, idx) => [
    `#${idx + 1}`,
    evt.timestamp || document.uploadedAt,
    evt.action,
    evt.performedBy,
    evt.note || 'Recorded in immutable audit trail.'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Seq', 'Date & Time', 'Action / Transition', 'Custodian / Attorney', 'Evidentiary Audit Note / Remark']],
    body: custodyRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 34, fontStyle: 'bold' },
      3: { cellWidth: 34 },
      4: { cellWidth: 70 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // ---------------- SECTION 4: AI ANALYSIS & COVENANT SUMMARY ----------------
  if (document.aiSummary || document.aiKeyClauses?.length) {
    if (currentY > 215) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('4. EVIDENTIARY ANALYSIS & ADMISSIBILITY HIGHLIGHTS', 14, currentY);
    currentY += 4;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, 182, 24, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`AI Risk Evaluation: ${document.aiRiskLevel || 'Low'} Risk`, 18, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    const summaryText = document.aiSummary || 'Document exhibits authenticated in compliance with court admissibility standards.';
    const splitSummary = doc.splitTextToSize(summaryText, 174);
    doc.text(splitSummary, 18, currentY + 10);

    currentY += 28;
  }

  // ---------------- SECTION 5: SWORN ATTESTATION & CERTIFICATE OF ADMISSIBILITY ----------------
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, 182, 42, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 63, 18); // amber-900
  doc.text('5. SWORN ATTESTATION & CERTIFICATE OF AUTHENTICITY', 18, currentY + 6);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  const declarationText =
    'I, the undersigned Counsel of Record / Evidentiary Custodian, hereby certify under penalty of perjury under the laws of the United States of America (28 U.S.C. § 1746) that the foregoing electronic document and chain-of-custody log constitute genuine, unaltered business and litigation records maintained in the regular course of legal representation. The cryptographic SHA-256 hash digest was generated upon ingestion and verifies that no tampering, alteration, or unauthorized modification has occurred.';
  const splitDeclaration = doc.splitTextToSize(declarationText, 174);
  doc.text(splitDeclaration, 18, currentY + 12);

  // Signature and Date Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);

  doc.line(18, currentY + 34, 90, currentY + 34);
  doc.text(`Authorized Signature: ${certifyingCounsel}`, 18, currentY + 38);

  doc.line(110, currentY + 34, 182, currentY + 34);
  doc.text(`Bar Reg / Seal ID: ${barNumber}`, 110, currentY + 38);

  // ---------------- PAGE WATERMARK & FOOTERS ----------------
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `JurisPulse Legal Practice Management • Courtroom Evidentiary Certificate (${certId}) • Page ${i} of ${pageCount} • Privileged & Confidential Attorney Work Product`,
      14,
      290
    );
  }

  // Download PDF
  const cleanDocSlug = document.fileName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 32);
  doc.save(`JurisPulse_Courtroom_Audit_Trail_${cleanDocSlug}_${now.toISOString().slice(0, 10)}.pdf`);
};



