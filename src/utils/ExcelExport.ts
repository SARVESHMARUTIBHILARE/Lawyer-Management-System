import * as XLSX from 'xlsx';
import { ProductivityMetrics, CaseFile, Invoice, CaseDeadline, TimeEntry } from '../types';

export const exportProductivityExcel = (metrics: ProductivityMetrics) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Staff Productivity
  const staffData = metrics.staffProductivity.map((s) => ({
    'Attorney / Staff Name': s.lawyerName,
    'Title / Role': s.role,
    'Target Hours': s.targetHours,
    'Actual Billed Hours': s.actualHours,
    'Utilization Rate (%)': s.utilizationRate,
    'Total Billed Revenue ($)': s.billedAmount
  }));
  const wsStaff = XLSX.utils.json_to_sheet(staffData);
  XLSX.utils.book_append_sheet(wb, wsStaff, 'Staff Productivity');

  // Sheet 2: Practice Area Performance
  const paData = metrics.practiceAreaBreakdown.map((pa) => ({
    'Practice Area': pa.name,
    'Active Matters Count': pa.count,
    'Monthly Revenue ($)': pa.revenue
  }));
  const wsPA = XLSX.utils.json_to_sheet(paData);
  XLSX.utils.book_append_sheet(wb, wsPA, 'Practice Areas');

  // Sheet 3: Monthly Revenue History
  const revData = metrics.monthlyRevenueHistory.map((m) => ({
    'Month': m.month,
    'Billed Hours': m.billedHours,
    'Revenue Generated ($)': m.revenue
  }));
  const wsRev = XLSX.utils.json_to_sheet(revData);
  XLSX.utils.book_append_sheet(wb, wsRev, 'Revenue History');

  XLSX.writeFile(wb, `JurisPulse_Firm_Productivity_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportCasesExcel = (cases: CaseFile[]) => {
  const wb = XLSX.utils.book_new();

  const data = cases.map((c) => ({
    'Case Number': c.caseNumber,
    'Case Title': c.title,
    'Client Name': c.clientName,
    'Client Email': c.clientEmail,
    'Practice Area': c.practiceArea,
    'Assigned Attorney': c.assignedLawyerName,
    'Status': c.status,
    'Opened Date': c.openedDate,
    'Expected Closure': c.expectedClosureDate,
    'Initial Retainer ($)': c.retainerAmount,
    'Retainer Remaining ($)': c.retainerRemaining,
    'Hourly Rate ($)': c.hourlyRate,
    'Total Billed ($)': c.totalBilled,
    'Tags': c.tags.join(', ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Case Directory');

  XLSX.writeFile(wb, `JurisPulse_Case_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportInvoicesExcel = (invoices: Invoice[]) => {
  const wb = XLSX.utils.book_new();

  const data = invoices.map((inv) => ({
    'Invoice Number': inv.invoiceNumber,
    'Case Title': inv.caseTitle,
    'Client Name': inv.clientName,
    'Client Email': inv.clientEmail,
    'Issue Date': inv.issueDate,
    'Due Date': inv.dueDate,
    'Status': inv.status,
    'Subtotal ($)': inv.subtotal,
    'Total Amount ($)': inv.totalAmount,
    'Amount Paid ($)': inv.amountPaid,
    'Balance Due ($)': inv.totalAmount - inv.amountPaid
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices Ledger');

  XLSX.writeFile(wb, `JurisPulse_Invoices_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportDeadlinesExcel = (deadlines: CaseDeadline[]) => {
  const wb = XLSX.utils.book_new();

  const data = deadlines.map((d) => ({
    'Case Title': d.caseTitle,
    'Deadline Subject': d.title,
    'Due Date & Time': d.dueDate,
    'Deadline Type': d.type,
    'Priority Level': d.priority,
    'Assigned Staff': d.assignedTo,
    'Completed Status': d.completed ? 'Completed' : 'Pending',
    'Notes': d.notes || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Case Deadlines');

  XLSX.writeFile(wb, `JurisPulse_Case_Deadlines_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export interface DateRangeBillingExcelOptions {
  dateRangeLabel: string;
  startDate?: string;
  endDate?: string;
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  cases: CaseFile[];
}

export const exportDateRangeBillingExcel = (options: DateRangeBillingExcelOptions) => {
  const { dateRangeLabel, startDate = '', endDate = '', timeEntries, invoices, cases } = options;
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary KPI Metrics
  const totalHours = timeEntries.reduce((acc, t) => acc + (t.hours || 0), 0);
  const totalTimeFees = timeEntries.reduce((acc, t) => acc + (t.amount || t.hours * t.rate), 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalBalanceDue = invoices.reduce((acc, i) => acc + (i.totalAmount - i.amountPaid), 0);

  const summaryData = [
    { 'Metric': 'Billing Period / Filter', 'Value': dateRangeLabel },
    { 'Metric': 'Start Date', 'Value': startDate || 'All prior dates' },
    { 'Metric': 'End Date', 'Value': endDate || 'Present' },
    { 'Metric': 'Total Billable Hours Logged', 'Value': `${totalHours.toFixed(1)} hrs` },
    { 'Metric': 'Total Timekeeper Fees Accrued ($)', 'Value': `$${totalTimeFees.toLocaleString()}` },
    { 'Metric': 'Total Invoiced Amount ($)', 'Value': `$${totalInvoiced.toLocaleString()}` },
    { 'Metric': 'Total Collections / Paid ($)', 'Value': `$${totalPaid.toLocaleString()}` },
    { 'Metric': 'Net Outstanding Accounts Receivable ($)', 'Value': `$${totalBalanceDue.toLocaleString()}` },
    { 'Metric': 'Report Generated At', 'Value': new Date().toLocaleString() }
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Cycle Summary');

  // Sheet 2: Itemized Time Entries
  const timeData = timeEntries.map((te) => ({
    'Date': te.date,
    'Matter / Case Title': te.caseTitle,
    'Counsel / Staff': te.lawyerName,
    'Hours': te.hours,
    'Hourly Rate ($)': te.rate,
    'Total Amount ($)': te.amount,
    'Billing Status': te.isBilled ? 'Invoiced' : 'Unbilled WIP',
    'Description': te.description
  }));
  const wsTime = XLSX.utils.json_to_sheet(timeData);
  XLSX.utils.book_append_sheet(wb, wsTime, 'Time Entries (WIP & Billed)');

  // Sheet 3: Invoices in Period
  const invData = invoices.map((inv) => ({
    'Invoice Number': inv.invoiceNumber,
    'Case Title': inv.caseTitle,
    'Client Name': inv.clientName,
    'Issue Date': inv.issueDate,
    'Due Date': inv.dueDate,
    'Status': inv.status.toUpperCase(),
    'Subtotal ($)': inv.subtotal,
    'Total Amount ($)': inv.totalAmount,
    'Amount Paid ($)': inv.amountPaid,
    'Balance Due ($)': inv.totalAmount - inv.amountPaid
  }));
  const wsInv = XLSX.utils.json_to_sheet(invData);
  XLSX.utils.book_append_sheet(wb, wsInv, 'Invoices Ledger');

  const fileSlug = dateRangeLabel.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `JurisPulse_Billing_Report_${fileSlug}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
