import { Invoice, CaseFile, ReminderTone, InvoiceReminderLog } from '../types';

export interface FirmWireDetails {
  bankName: string;
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  swiftCode: string;
  trustAccountRouting?: string;
  trustAccountNumber?: string;
  referenceFormat: string;
}

export const DEFAULT_FIRM_WIRE: FirmWireDetails = {
  bankName: 'Metropolitan Commercial Bank & Trust',
  accountName: 'Vance, Chen & Sterling LLP - Operating Account',
  routingNumber: '021000089',
  accountNumber: '9482-1092-4410',
  swiftCode: 'METRUS33NYC',
  trustAccountRouting: '021000089',
  trustAccountNumber: '9482-1092-9901 (IOLTA Trust)',
  referenceFormat: 'Matter #{CaseNumber} - Inv #{InvoiceNumber}'
};

export interface DraftEmailOptions {
  invoice: Invoice;
  caseFile?: CaseFile;
  tone: ReminderTone;
  senderName?: string;
  senderTitle?: string;
  senderEmail?: string;
  firmName?: string;
  ccEmails?: string[];
  referenceDate?: string;
  includeWireDetails?: boolean;
  includeLineItems?: boolean;
  includePaymentPortalLink?: boolean;
  includeLatePenaltyWarning?: boolean;
  includeRetainerDepletionNotice?: boolean;
  customDueDateDeadline?: string;
  customNotes?: string;
}

export interface GeneratedEmailDraft {
  to: string;
  cc: string;
  subject: string;
  body: string;
  daysOverdue: number;
  balanceDue: number;
  suggestedTone: ReminderTone;
  noticeLevel: '1st Courtesy Notice' | '2nd Formal Demand' | '3rd Final Notice' | 'Retainer Depletion';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Calculates days overdue relative to reference date (defaults to current app time: 2026-08-23)
 */
export function calculateDaysOverdue(dueDate: string, referenceDate: string = '2026-08-23'): number {
  if (!dueDate) return 0;
  const due = new Date(dueDate).getTime();
  const ref = new Date(referenceDate).getTime();
  const diffDays = Math.floor((ref - due) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Recommends an appropriate tone based on days past due and retainer health
 */
export function getSuggestedTone(
  daysOverdue: number,
  isRetainerDepleted: boolean = false
): ReminderTone {
  if (isRetainerDepleted) return 'retainer_depletion';
  if (daysOverdue > 21) return 'urgent_final';
  if (daysOverdue > 7) return 'formal_standard';
  return 'courteous_first';
}

/**
 * Generates an automated, legally sound email draft with complete itemization and remittance options
 */
export function generateOverdueEmailDraft(options: DraftEmailOptions): GeneratedEmailDraft {
  const {
    invoice,
    caseFile,
    tone,
    senderName = 'Eleanor Vance, Esq.',
    senderTitle = 'Managing Partner, Commercial Litigation',
    senderEmail = 'e.vance@vcs-law.com',
    firmName = 'Vance, Chen & Sterling LLP',
    ccEmails = ['billing@vcs-law.com', 'finance-team@vcs-law.com'],
    referenceDate = '2026-08-23',
    includeWireDetails = true,
    includeLineItems = true,
    includePaymentPortalLink = true,
    includeLatePenaltyWarning = false,
    customDueDateDeadline,
    customNotes
  } = options;

  const daysOverdue = calculateDaysOverdue(invoice.dueDate, referenceDate);
  const balanceDue = invoice.totalAmount - invoice.amountPaid;
  const clientFirstName = invoice.clientName.split(' ')[0] || invoice.clientName;
  const caseNumber = caseFile?.caseNumber || 'MAT-2026';

  let noticeLevel: GeneratedEmailDraft['noticeLevel'] = '1st Courtesy Notice';
  let urgency: GeneratedEmailDraft['urgency'] = 'low';

  if (tone === 'retainer_depletion') {
    noticeLevel = 'Retainer Depletion';
    urgency = 'high';
  } else if (tone === 'urgent_final' || daysOverdue > 21) {
    noticeLevel = '3rd Final Notice';
    urgency = 'critical';
  } else if (tone === 'formal_standard' || daysOverdue > 7) {
    noticeLevel = '2nd Formal Demand';
    urgency = 'medium';
  }

  // Generate Email Subject Line
  let subject = '';
  switch (tone) {
    case 'courteous_first':
      subject = `Courtesy Reminder: Invoice ${invoice.invoiceNumber} for ${invoice.caseTitle}`;
      break;
    case 'formal_standard':
      subject = `Past-Due Notice: Invoice ${invoice.invoiceNumber} ($${balanceDue.toLocaleString()} Due) - ${invoice.caseTitle}`;
      break;
    case 'urgent_final':
      subject = `FINAL NOTICE: Delinquent Balance for Matter ${caseNumber} (${invoice.invoiceNumber}) - Action Required`;
      break;
    case 'retainer_depletion':
      subject = `Urgent Retainer Replenishment Notice: ${caseNumber} - ${invoice.caseTitle}`;
      break;
    case 'custom':
    default:
      subject = `Statement of Account: Invoice ${invoice.invoiceNumber} - ${invoice.clientName}`;
      break;
  }

  // Format line items if requested
  let lineItemsText = '';
  if (includeLineItems && invoice.items && invoice.items.length > 0) {
    lineItemsText = `\n--- Itemized Summary of Services ---\n` +
      invoice.items
        .map(
          (item) =>
            `• ${item.description} (${item.hours > 0 ? `${item.hours} hrs @ $${item.rate}/hr` : 'Disbursement'}): $${item.amount.toLocaleString()}`
        )
        .join('\n') +
      `\nTotal Invoiced: $${invoice.totalAmount.toLocaleString()} | Prior Payments: $${invoice.amountPaid.toLocaleString()} | Outstanding Balance: $${balanceDue.toLocaleString()}\n`;
  }

  // Format Wire Details if requested
  let wireText = '';
  if (includeWireDetails) {
    wireText = `\n--- Electronic Remittance & Wire Instructions ---
Bank: ${DEFAULT_FIRM_WIRE.bankName}
Beneficiary: ${DEFAULT_FIRM_WIRE.accountName}
ABA / Routing Number: ${DEFAULT_FIRM_WIRE.routingNumber}
Account Number: ${DEFAULT_FIRM_WIRE.accountNumber}
SWIFT Code: ${DEFAULT_FIRM_WIRE.swiftCode}
Payment Reference: Matter #${caseNumber} - Inv #${invoice.invoiceNumber}`;
  }

  // Format Payment Portal Link
  let portalText = '';
  if (includePaymentPortalLink) {
    portalText = `\nYou may also view and settle this invoice securely online via our LawPay Client Portal:
https://portal.vcs-law.com/pay/${invoice.id}?client=${encodeURIComponent(invoice.clientName)}`;
  }

  // Penalty / Suspension warning
  let penaltyText = '';
  if (includeLatePenaltyWarning || tone === 'urgent_final') {
    penaltyText = `\nPLEASE NOTE: Pursuant to Section 7 of our legal retainer agreement and applicable ethical guidelines, accounts outstanding past 30 days are subject to a statutory interest charge of 1.5% per month. Continued failure to resolve this open balance may result in the formal suspension of active litigation services and motion filings for Matter ${caseNumber}.`;
  }

  // Build Body Content based on tone
  let bodyIntro = '';
  let bodyClosing = '';

  if (tone === 'courteous_first') {
    bodyIntro = `Dear ${invoice.clientName},

I hope this message finds you well.

We are writing to provide a friendly reminder regarding Invoice ${invoice.invoiceNumber} issued on ${invoice.issueDate} for legal counsel provided in connection with "${invoice.caseTitle}".

According to our accounts ledger, this invoice has a remaining balance due of $${balanceDue.toLocaleString()} which matured on ${invoice.dueDate} (${daysOverdue > 0 ? `${daysOverdue} days past due` : 'due shortly'}).

We understand that administrative oversights happen during busy billing cycles. If payment has already been initiated, please accept our thanks and disregard this notice. Otherwise, we would appreciate it if you could remit payment at your earliest convenience.`;

    bodyClosing = `If you have any questions regarding any of the itemized entries or require updated documentation for your finance department, please do not hesitate to contact me directly.

Thank you for your valued partnership.`;
  } else if (tone === 'formal_standard') {
    bodyIntro = `Dear ${invoice.clientName},

RE: PAST-DUE INVOICE ${invoice.invoiceNumber} | MATTER REF: ${caseNumber}
Matter Title: ${invoice.caseTitle}

Our records indicate that Invoice ${invoice.invoiceNumber}, issued on ${invoice.issueDate} with a due date of ${invoice.dueDate}, currently remains unpaid with an outstanding balance of $${balanceDue.toLocaleString()}. This invoice is now ${daysOverdue} days past due.

Under the terms of our engagement agreement, all legal fees and disbursements are due within 30 days of the invoice date. To ensure uninterrupted legal representation and maintain timely filings on your matter, we respectfully request that this balance be satisfied promptly${customDueDateDeadline ? ` (no later than ${customDueDateDeadline})` : ' within seven (7) business days'}.`;

    bodyClosing = `If there is a temporary constraint or if you would like to discuss structured settlement options for this balance, please reach out to our billing team or me immediately so we can make the appropriate arrangements.

Thank you for your prompt attention to this matter.`;
  } else if (tone === 'urgent_final') {
    bodyIntro = `Dear ${invoice.clientName},

*** FORMAL NOTICE OF DELINQUENT ACCOUNT & PENDING SERVICE SUSPENSION ***
Re: Matter ${caseNumber} - ${invoice.caseTitle}
Invoice Number: ${invoice.invoiceNumber} | Outstanding Balance: $${balanceDue.toLocaleString()}
Days Past Due: ${daysOverdue} Days (Matured on ${invoice.dueDate})

Despite previous correspondence, our accounting records reflect that the balance of $${balanceDue.toLocaleString()} for Invoice ${invoice.invoiceNumber} remains outstanding and significantly past due.

Please be advised that under Section 9 of our Legal Services Engagement Agreement and the applicable Rules of Professional Conduct (Rule 1.16), the firm requires current account standing to proceed with active litigation, court filings, and scheduled expert depositions.

Failure to remit the full delinquent balance of $${balanceDue.toLocaleString()} or execute a written payment plan within five (5) business days${customDueDateDeadline ? ` (by ${customDueDateDeadline})` : ''} will leave us with no choice but to immediately suspend all legal work on Matter ${caseNumber} and initiate appropriate collection proceedings.`;

    bodyClosing = `We strongly value our working relationship and urge you to contact us immediately to resolve this matter without disruption to your pending legal proceedings.

Your immediate remittance is required.`;
  } else if (tone === 'retainer_depletion') {
    bodyIntro = `Dear ${invoice.clientName},

RE: RETAINER DEPLETION & EVERGREEN REPLENISHMENT NOTICE
Matter: ${caseNumber} - ${invoice.caseTitle}
Current Unpaid Balance: $${balanceDue.toLocaleString()}

Please be advised that recent intensive legal proceedings (including discovery, motion drafting, and forensic filings) have fully exhausted the initial retainer pool held in trust for your matter.

In addition to the outstanding balance of $${balanceDue.toLocaleString()} on Invoice ${invoice.invoiceNumber}, our engagement terms require maintaining an active evergreen retainer reserve of $${(caseFile?.retainerAmount || 15000).toLocaleString()} to support upcoming trial preparation and depositions.

We kindly request that you replenish your retainer and settle the open invoice balance at your earliest convenience to ensure uninterrupted attorney staffing.`;

    bodyClosing = `Please remit the requested funds using the IOLTA Trust Account wire details provided below. If you would like an updated matter budget projection, please let me know.

Thank you for your cooperation and continued trust.`;
  } else {
    // Custom tone
    bodyIntro = `Dear ${invoice.clientName},

Please find attached the statement of account for Invoice ${invoice.invoiceNumber} regarding "${invoice.caseTitle}".

The outstanding balance due is $${balanceDue.toLocaleString()}, which was due on ${invoice.dueDate} (${daysOverdue} days past due).`;

    bodyClosing = `Please review and let us know once payment has been remitted. Thank you.`;
  }

  // Append custom notes if provided
  let customNotesBlock = '';
  if (customNotes && customNotes.trim()) {
    customNotesBlock = `\nSpecial Note from Counsel:\n${customNotes.trim()}\n`;
  }

  // Signature Block
  const signatureBlock = `\nSincerely,\n\n${senderName}\n${senderTitle}\n${firmName}\nDirect: ${senderEmail} | Tel: (212) 555-0198\nWebsite: https://www.vcs-law.com`;

  // Combine full body
  const body = `${bodyIntro}${customNotesBlock}${lineItemsText}${wireText}${portalText}${penaltyText}\n\n${bodyClosing}\n${signatureBlock}`;

  return {
    to: invoice.clientEmail,
    cc: ccEmails.join(', '),
    subject,
    body,
    daysOverdue,
    balanceDue,
    suggestedTone: getSuggestedTone(daysOverdue, caseFile ? caseFile.retainerRemaining <= 0 : false),
    noticeLevel,
    urgency
  };
}

/**
 * Generates an RFC compliant `mailto:` link for one-click launching in native mail clients (Outlook, Gmail, Apple Mail)
 */
export function generateMailtoLink(
  to: string,
  cc: string,
  subject: string,
  body: string
): string {
  const params: string[] = [];
  if (cc && cc.trim()) params.push(`cc=${encodeURIComponent(cc.trim())}`);
  if (subject && subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body && body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);

  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${encodeURIComponent(to.trim())}${queryString}`;
}
