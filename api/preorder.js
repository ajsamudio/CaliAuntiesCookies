/* =========================================================
   PREORDER REQUESTS  (Vercel serverless function: POST /api/preorder)

   Emails each preorder request to Cali Aunties through Resend,
   and (once her domain is verified in Resend) sends the customer
   a "we got your request" confirmation.

   Environment variables (Vercel → Settings → Environment Variables):
   - RESEND_API_KEY     required. Without it the form says preorders
                        aren't live yet and nothing is sent.
   - RESEND_FROM_EMAIL  e.g. "Cali Aunties <orders@caliauntiescookies.com>".
                        Leave unset until the domain is verified in
                        Resend: requests then send from Resend's test
                        address, which can only reach the Resend
                        account's own email, and customer
                        confirmations are skipped.
   - ORDER_TO_EMAIL     where requests go. Defaults to her Gmail.
   ========================================================= */

const RESEND_URL = 'https://api.resend.com/emails';
const TEST_FROM = 'Cali Aunties <onboarding@resend.dev>';
const DEFAULT_TO = 'caliauntiescookies@gmail.com';
const MAX_BOXES = 10;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, max);

function prettyDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d) ? iso : d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function readOrder(body) {
  const b = body || {};
  const order = {
    box: clean(b.box, 80),
    quantity: parseInt(b.quantity, 10),
    flavors: (Array.isArray(b.flavors) ? b.flavors : [b.flavors]).map(f => clean(f, 60)).filter(Boolean).slice(0, 40),
    firstName: clean(b.first_name, 60),
    lastName: clean(b.last_name, 60),
    phone: clean(b.phone, 40),
    email: clean(b.email, 120),
    pickupDate: clean(b.pickup_date, 10),
    message: String(b.message || '').trim().slice(0, 2000)
  };
  const problems = [];
  if (!order.box) problems.push('box');
  if (!(order.quantity >= 1 && order.quantity <= MAX_BOXES)) problems.push('quantity');
  if (!order.flavors.length) problems.push('flavors');
  if (!order.firstName) problems.push('first_name');
  if (!order.lastName) problems.push('last_name');
  if (order.phone.replace(/\D/g, '').length < 7) problems.push('phone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) problems.push('email');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(order.pickupDate)) problems.push('pickup_date');
  return { order, problems };
}

function rows(order) {
  return [
    ['Box', `${order.quantity} × ${order.box}`],
    ['Flavors', order.flavors.join(', ')],
    ['Name', `${order.firstName} ${order.lastName}`],
    ['Phone', order.phone],
    ['Email', order.email],
    ['Pickup date', prettyDate(order.pickupDate)],
    ['Notes', order.message || '(none)']
  ];
}

function layout(heading, intro, tableRows, outro) {
  const trs = tableRows.map(([k, v]) => `
    <tr>
      <td style="padding:10px 14px;border-top:1px solid #F1DDE1;color:#B8925A;font:600 11px/1.4 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;vertical-align:top">${esc(k)}</td>
      <td style="padding:10px 14px;border-top:1px solid #F1DDE1;color:#4B2B24;font:15px/1.5 Arial,sans-serif;white-space:pre-wrap">${esc(v)}</td>
    </tr>`).join('');
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#FBF5EE">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;padding:28px;border:1px solid #F1DDE1">
    <h1 style="margin:0 0 8px;color:#B84F69;font:300 28px/1.2 Georgia,serif">${esc(heading)}</h1>
    <p style="margin:0 0 18px;color:#7B544A;font:15px/1.6 Arial,sans-serif">${intro}</p>
    <table style="width:100%;border-collapse:collapse">${trs}</table>
    ${outro ? `<p style="margin:18px 0 0;color:#7B544A;font:15px/1.6 Arial,sans-serif">${outro}</p>` : ''}
  </div>
</body></html>`;
}

async function send(apiKey, payload) {
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (body && body._gotcha) return res.status(200).json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'not_configured' });

  const { order, problems } = readOrder(body);
  if (problems.length) return res.status(400).json({ error: 'invalid', fields: problems });

  const from = process.env.RESEND_FROM_EMAIL || TEST_FROM;
  const to = process.env.ORDER_TO_EMAIL || DEFAULT_TO;
  const list = rows(order);
  const text = list.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    await send(apiKey, {
      from,
      to: [to],
      reply_to: order.email,
      subject: `New preorder: ${order.quantity} × ${order.box} for ${order.firstName} ${order.lastName}`,
      html: layout('New preorder request 🍪', 'Hit reply to answer the customer directly.', list),
      text: `New preorder request\n\n${text}\n\nHit reply to answer the customer directly.`
    });
  } catch (err) {
    console.error('[preorder] notification failed', err);
    return res.status(502).json({ error: 'send_failed' });
  }

  // Customer confirmation needs a verified domain, so only send it once
  // RESEND_FROM_EMAIL is set. A failure here shouldn't fail the request.
  if (process.env.RESEND_FROM_EMAIL) {
    try {
      await send(apiKey, {
        from,
        to: [order.email],
        reply_to: to,
        subject: 'We got your Cali Aunties preorder request! 🍪',
        html: layout(`Thanks, ${order.firstName}!`,
          "Your preorder request is in. We'll get back to you within 1–2 days to confirm availability, pickup and payment. Nothing is final until we confirm.",
          list, 'Questions? Just reply to this email.<br><br>Happiness is Homemade.<br>Cali Aunties'),
        text: `Thanks, ${order.firstName}!\n\nYour preorder request is in. We'll get back to you within 1–2 days to confirm availability, pickup and payment. Nothing is final until we confirm.\n\n${text}\n\nQuestions? Just reply to this email.\n\nHappiness is Homemade.\nCali Aunties`
      });
    } catch (err) {
      console.error('[preorder] customer confirmation failed', err);
    }
  }

  return res.status(200).json({ ok: true });
};
