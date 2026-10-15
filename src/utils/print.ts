// Print utility - Only prints receipt, not full screen

export function printReceipt(order: any, restaurantInfo?: any) {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    alert('Please allow popups to print receipt');
    return;
  }

  const restaurant = restaurantInfo || {
    name: 'RestroFlow Restaurant',
    address: 'Main Branch, Lahore',
    phone: '042-35765432',
    strn: 'STRN-1234567890',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          padding: 10px;
          max-width: 300px;
          margin: 0 auto;
        }
        .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
        .header h1 { font-size: 16px; margin-bottom: 5px; }
        .header p { font-size: 11px; }
        .order-info { margin-bottom: 10px; }
        .order-info p { margin: 2px 0; }
        .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 10px 0; }
        .item { display: flex; justify-content: space-between; margin: 5px 0; }
        .item-name { flex: 1; }
        .item-qty { width: 40px; text-align: center; }
        .item-price { width: 80px; text-align: right; }
        .item-detail { font-size: 10px; color: #666; margin-left: 10px; }
        .totals { border-top: 1px dashed #000; padding-top: 10px; }
        .total-row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total-row.grand { font-size: 14px; font-weight: bold; border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; }
        .footer { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; font-size: 11px; }
        @media print {
          body { padding: 0; }
          @page { margin: 10mm; size: 80mm auto; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${restaurant.name}</h1>
        <p>${restaurant.address}</p>
        <p>Phone: ${restaurant.phone}</p>
        <p>STRN: ${restaurant.strn}</p>
      </div>

      <div class="order-info">
        <p><strong>Order #:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Type:</strong> ${order.type.toUpperCase()}</p>
        ${order.table ? `<p><strong>Table:</strong> ${order.table}</p>` : ''}
        ${order.waiter ? `<p><strong>Waiter:</strong> ${order.waiter}</p>` : ''}
        ${order.customer ? `<p><strong>Customer:</strong> ${order.customer}</p>` : ''}
      </div>

      <div class="items">
        ${order.items.map((item: any) => `
          <div class="item">
            <div class="item-name">
              ${item.name}
              ${item.notes ? `<div class="item-detail">Note: ${item.notes}</div>` : ''}
              ${item.modifiers && item.modifiers.length > 0 ? `<div class="item-detail">${item.modifiers.join(', ')}</div>` : ''}
            </div>
            <div class="item-qty">${item.quantity}x</div>
            <div class="item-price">PKR ${(item.price * item.quantity).toLocaleString()}</div>
          </div>
        `).join('')}
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>PKR ${order.subtotal.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Tax (5%):</span>
          <span>PKR ${order.tax.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Service Charge (5%):</span>
          <span>PKR ${order.serviceCharge.toLocaleString()}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="total-row">
            <span>Discount:</span>
            <span>-PKR ${order.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="total-row grand">
          <span>TOTAL:</span>
          <span>PKR ${order.total.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Payment:</span>
          <span>${order.paymentMethod}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for dining with us!</p>
        <p>Powered by RestroFlow</p>
        <p style="margin-top: 10px; font-size: 10px;">${new Date().toLocaleString()}</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Print kitchen ticket
export function printKitchenTicket(order: any) {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    alert('Please allow popups to print kitchen ticket');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kitchen Ticket - ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          padding: 10px;
          max-width: 300px;
          margin: 0 auto;
        }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
        .header h1 { font-size: 20px; margin-bottom: 5px; }
        .order-info { margin-bottom: 15px; font-size: 12px; }
        .items { border: 2px solid #000; padding: 10px; }
        .item { margin: 10px 0; padding: 5px 0; border-bottom: 1px dashed #000; }
        .item:last-child { border-bottom: none; }
        .item-qty { font-size: 18px; font-weight: bold; }
        .item-name { font-size: 16px; font-weight: bold; margin: 5px 0; }
        .item-notes { font-size: 12px; font-style: italic; color: #666; }
        .item-modifiers { font-size: 12px; margin-left: 10px; }
        .footer { text-align: center; margin-top: 15px; font-size: 11px; }
        @media print {
          body { padding: 0; }
          @page { margin: 10mm; size: 80mm auto; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>KITCHEN</h1>
        <p><strong>${order.orderNumber}</strong></p>
      </div>

      <div class="order-info">
        <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString()}</p>
        <p><strong>Type:</strong> ${order.type.toUpperCase()}</p>
        ${order.table ? `<p><strong>Table:</strong> ${order.table}</p>` : ''}
      </div>

      <div class="items">
        ${order.items.map((item: any) => `
          <div class="item">
            <div class="item-qty">${item.quantity}x</div>
            <div class="item-name">${item.name}</div>
            ${item.modifiers && item.modifiers.length > 0 ? `<div class="item-modifiers">→ ${item.modifiers.join(', ')}</div>` : ''}
            ${item.notes ? `<div class="item-notes">NOTE: ${item.notes}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <p>Printed: ${new Date().toLocaleString()}</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
