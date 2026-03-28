export interface TicketData {
  ticketId: string;
  passengerName: string;
  phone?: string;
  photoUrl?: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  seats: string[];
  vehicleName: string;
  bookingType: string;
  basePrice: number;
  finalPrice: number;
  discountPercentage: number;
  isStudentDiscount: boolean;
  isEarlyUserDiscount: boolean;
  qrData: string;
  vehicleInfo?: Record<string, unknown>;
}

export const generateTicketHTML = (data: TicketData): string => {
  const discountBadges = [];
  if (data.isEarlyUserDiscount) {
    discountBadges.push('<span style="background: #fbbf24; color: #1e3a5f; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🎉 Early User -15%</span>');
  }
  if (data.isStudentDiscount) {
    discountBadges.push('<span style="background: #22d3ee; color: #1e3a5f; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">🎓 Student -10%</span>');
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GO UNIFIED - E-Ticket ${data.ticketId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 50%, #22d3ee 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .ticket { 
      max-width: 500px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 24px; 
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .header { 
      background: linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%);
      padding: 24px; 
      color: white;
    }
    .logo-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .logo { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }
    .logo-icon { 
      width: 40px; 
      height: 40px; 
      background: rgba(255,255,255,0.2); 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
    .passenger-card {
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid #fbbf24;
      object-fit: cover;
      background: #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: #1e3a5f;
    }
    .passenger-info { flex: 1; }
    .passenger-name { font-weight: 600; font-size: 16px; }
    .passenger-phone { opacity: 0.8; font-size: 14px; margin-top: 4px; }
    .student-badge { 
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #22d3ee;
      color: #1e3a5f;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-top: 8px;
    }
    .divider { 
      position: relative; 
      height: 32px; 
      background: white;
    }
    .divider::before, .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 32px;
      background: #f3f4f6;
    }
    .divider::before { left: 0; border-radius: 0 16px 16px 0; }
    .divider::after { right: 0; border-radius: 16px 0 0 16px; }
    .divider-line {
      position: absolute;
      left: 24px;
      right: 24px;
      top: 50%;
      border-top: 2px dashed #e5e7eb;
    }
    .content { padding: 24px; }
    .route {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .city { text-align: center; }
    .city-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; }
    .city-name { font-size: 20px; font-weight: 700; color: #1e3a5f; }
    .route-line {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 16px;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; }
    .line { flex: 1; height: 2px; background: linear-gradient(90deg, #fbbf24, #0ea5e9); }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .detail-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 12px;
    }
    .detail-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; }
    .detail-value { font-size: 14px; font-weight: 600; color: #1e3a5f; margin-top: 4px; }
    .discounts {
      background: linear-gradient(90deg, rgba(251,191,36,0.1), rgba(34,211,238,0.1));
      border: 1px solid rgba(251,191,36,0.3);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .discounts-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #fbbf24;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .discount-badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .qr-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 16px;
      padding: 16px;
      border: 2px solid #e5e7eb;
      margin-bottom: 24px;
    }
    .qr-code {
      width: 80px;
      height: 80px;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #9ca3af;
      text-align: center;
      padding: 8px;
    }
    .price-section { text-align: right; }
    .original-price { 
      font-size: 14px; 
      color: #9ca3af; 
      text-decoration: line-through; 
    }
    .final-price { 
      font-size: 28px; 
      font-weight: 700; 
      color: #0ea5e9; 
    }
    .confirmed-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #22c55e;
      font-size: 12px;
      font-weight: 600;
      margin-top: 4px;
    }
    .sos-section {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sos-icon {
      width: 32px;
      height: 32px;
      background: #ef4444;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
    .sos-text { flex: 1; }
    .sos-title { font-weight: 600; color: #ef4444; font-size: 13px; }
    .sos-numbers { font-size: 11px; color: #9ca3af; }
    .footer {
      background: #f8fafc;
      padding: 16px 24px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="logo-row">
        <div class="logo">
          <div class="logo-icon">G</div>
          <div>
            <div style="font-weight: 700; font-size: 18px;">GO UNIFIED</div>
            <div style="opacity: 0.7; font-size: 12px;">Premium E-Ticket</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="opacity: 0.7; font-size: 11px;">Ticket ID</div>
          <div style="font-family: monospace; font-size: 13px;">${data.ticketId}</div>
        </div>
      </div>
      <div class="passenger-card">
        ${data.photoUrl 
          ? `<img src="${data.photoUrl}" alt="Passenger" class="avatar" />`
          : `<div class="avatar">${data.passengerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</div>`
        }
        <div class="passenger-info">
          <div class="passenger-name">👤 ${data.passengerName}</div>
          ${data.phone ? `<div class="passenger-phone">📞 ${data.phone}</div>` : ''}
          ${data.isStudentDiscount ? '<div class="student-badge">🎓 Verified Student</div>' : ''}
        </div>
      </div>
    </div>
    
    <div class="divider"><div class="divider-line"></div></div>
    
    <div class="content">
      <div class="route">
        <div class="city">
          <div class="city-label">From</div>
          <div class="city-name">${data.from}</div>
        </div>
        <div class="route-line">
          <div class="dot"></div>
          <div class="line"></div>
          <div style="font-size: 16px;">📍</div>
          <div class="line"></div>
          <div class="dot"></div>
        </div>
        <div class="city">
          <div class="city-label">To</div>
          <div class="city-name">${data.to}</div>
        </div>
      </div>
      
      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-label">Date</div>
          <div class="detail-value">${data.date}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Departure</div>
          <div class="detail-value">${data.departure}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">${data.seats.length > 0 ? 'Seats' : 'Passengers'}</div>
          <div class="detail-value">${data.seats.length > 0 ? data.seats.join(', ') : (data.vehicleInfo?.passengers || 1)}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">${data.bookingType === 'bus' ? 'Bus' : data.bookingType === 'cab' ? 'Cab' : data.bookingType === 'flight' ? 'Flight' : 'Vehicle'}</div>
          <div class="detail-value" style="font-size: 12px;">${data.vehicleName}</div>
        </div>
      </div>
      
      ${data.discountPercentage > 0 ? `
      <div class="discounts">
        <div class="discounts-title">⭐ Discounts Applied!</div>
        <div class="discount-badges">
          ${discountBadges.join('')}
        </div>
      </div>
      ` : ''}
      
      <div class="qr-section">
        <canvas id="qrcode"></canvas>
          QR Code<br/>
          <small>Scan at boarding</small>
        </div>
        <div class="price-section">
          ${data.discountPercentage > 0 ? `<div class="original-price">₹${data.basePrice}</div>` : ''}
          <div class="final-price">₹${data.finalPrice.toFixed(0)}</div>
          <div class="confirmed-badge">✓ Confirmed</div>
        </div>
      </div>
      
      <div class="sos-section">
        <div class="sos-icon">SOS</div>
        <div class="sos-text">
          <div class="sos-title">Women Safety SOS</div>
          <div class="sos-numbers">Emergency: 112 | Women Helpline: 181</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      This is an electronically generated ticket. Valid with QR code verification.<br/>
      © ${new Date().getFullYear()} GO UNIFIED Tamil Nadu Transport
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
<script>
  QRCode.toCanvas(document.getElementById('qrcode'), "GOUNIFIED-3B82D5", {
    width: 80
  });
</script>3
</body>
</html>
  `;
};

export const downloadTicket = (data: TicketData) => {
  const html = generateTicketHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `GO-UNIFIED-Ticket-${data.ticketId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

export const printTicket = (data: TicketData) => {
  const html = generateTicketHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
