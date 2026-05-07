import { generatePalmReading } from './reading.js';
import { createReferralId, leadRepository, referralRepository } from './storage.js';

const app = document.querySelector('#app');
const referrerId = new URLSearchParams(location.search).get('ref');
const myReferralId = createReferralId();
referralRepository.trackVisit(referrerId);

const state = {
  stream: null,
  cameraError: '',
  photo: '',
  reading: [],
  unlocked: false,
  analysing: false,
  form: { name: '', phone: '', email: '', birthDate: '' },
};

const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const icons = {
  camera: '📷', lock: '🔒', sparkle: '✦', wallet: '₹', shield: '🛡️', star: '★', phone: '☎', mail: '✉', share: '↗', ad: '▶', moon: '☾'
};

const render = () => {
  app.innerHTML = `
    <section class="hero" id="top">
      <nav class="nav">
        <a class="brand" href="#top"><span>${icons.moon}</span> PalmVeda AI</a>
        <div>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </nav>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">AI palm scan • Vedic-inspired insights • mobile first</p>
          <h1>Capture your palm and unlock a beautifully guided life reading.</h1>
          <p class="hero-text">PalmVeda AI opens directly in Chrome, Safari, and in-app browsers. It uses your palm photo to create an entertainment-focused reflection on money, career, relationships, stress, and personal growth.</p>
          <div class="trust-row">
            <span>${icons.shield} Clear privacy controls</span>
            <span>${icons.star} Discounted premium report</span>
            <span>${icons.wallet} Referral wallet tracking</span>
          </div>
        </div>
        <div class="phone-card">
          ${captureTemplate()}
        </div>
      </div>
    </section>
    <section class="analysis-card ${state.analysing ? 'is-visible' : ''}">
      <div class="orbit"><span></span><span></span><span></span></div>
      <div>
        <h2>Advanced AI Astrologer Engine is preparing your reading</h2>
        <p id="tip">Mapping heart line, fate line, life line, and Vedic knowledge signals. This usually takes a few seconds.</p>
      </div>
    </section>
    ${state.reading.length ? readingTemplate() : howItWorksTemplate()}
    ${leadTemplate()}
    ${referralTemplate()}
    ${legalTemplate()}
  `;
  bindEvents();
};

const captureTemplate = () => `
  <div class="camera-shell">
    <div class="camera-preview">
      ${state.photo ? `<img src="${state.photo}" alt="Captured palm preview" />` : '<video id="camera" autoplay playsinline muted></video><div class="scan-frame"><span></span><span></span><span></span><span></span></div>'}
    </div>
    <div class="field-grid">
      <label>Name <input id="name" value="${state.form.name}" autocomplete="name" placeholder="Your name" /></label>
      <label>Birth date <input id="birthDate" value="${state.form.birthDate}" type="date" /></label>
    </div>
    <div class="button-row">
      <button id="startCamera" class="secondary">${icons.camera} Open camera</button>
      <button id="snapPalm" class="primary">Scan palm</button>
    </div>
    ${state.cameraError ? `<p class="error">${state.cameraError}</p>` : ''}
    <p class="microcopy">Tip: use good lighting and keep the palm inside the glowing frame. Camera permission is required and the photo stays in this browser prototype.</p>
  </div>
`;

const howItWorksTemplate = () => `
  <section class="section cards">
    <article><b>1</b><h3>Capture palm</h3><p>Use the browser camera API with Safari/Chrome-friendly controls.</p></article>
    <article><b>2</b><h3>AI-style analysis</h3><p>Animated loading and rotating Vedic tips create a polished, transparent experience.</p></article>
    <article><b>3</b><h3>Preview + unlock</h3><p>Show 7–8 useful lines, blur the rest, and connect Cashfree when credentials arrive.</p></article>
  </section>
`;

const readingTemplate = () => {
  const visible = state.reading.slice(0, 8);
  const locked = state.reading.slice(8);
  return `
    <section class="section reading" id="reading">
      <div class="section-head">
        <p class="eyebrow">Your preview is ready</p>
        <h2>Personal palm reading</h2>
        <p>Positive, relatable guidance across wealth, marriage, jobs, stress, relationships, and daily choices.</p>
      </div>
      <div class="reading-panel">
        ${visible.map((line, index) => `<p><span>${index + 1}</span>${line}</p>`).join('')}
        <div class="locked-zone ${state.unlocked ? 'unlocked' : ''}">
          ${locked.map((line, index) => `<p><span>${index + 9}</span>${line}</p>`).join('')}
          ${state.unlocked ? '' : `<div class="lock-overlay"><strong>${icons.lock} Premium insight locked</strong><p>Unlock the full AI + Vedic reading, detailed daily-life guidance, and astrologer follow-up.</p><div class="price"><s>${rupee.format(999)}</s><b>${rupee.format(99)}</b><em>90% launch discount</em></div><button id="payNow" class="primary">Unlock full report</button><button id="adUnlock" class="secondary">${icons.ad} View partner offers instead</button><button id="shareUnlock" class="ghost">${icons.share} Share with friends</button></div>`}
        </div>
      </div>
    </section>`;
};

const leadTemplate = () => `
  <section class="section lead" id="kundli">
    <div>
      <p class="eyebrow">Detailed horoscope & kundli follow-up</p>
      <h2>Connect with a real astrologer</h2>
      <p>Share your details to receive personalised daily-life guidance, kundli discussion, and premium consultation options.</p>
    </div>
    <form id="leadForm" class="lead-form">
      <label>Phone number <input id="phone" inputmode="tel" autocomplete="tel" value="${state.form.phone}" placeholder="98765 43210" required /></label>
      <label>Email id <input id="email" type="email" autocomplete="email" value="${state.form.email}" placeholder="you@example.com" required /></label>
      <button class="primary" type="submit">Request detailed guidance</button>
      <p id="leadStatus" class="microcopy">By submitting, you agree to receive service messages and consultation follow-up.</p>
    </form>
  </section>`;

const referralTemplate = () => {
  const link = `${location.origin}${location.pathname}?ref=${myReferralId}`;
  return `
    <section class="section referral">
      <div>
        <p class="eyebrow">Refer & earn</p>
        <h2>Earn ${rupee.format(50)} per successful paid palm reading</h2>
        <p>Your wallet is credited only when your referred user completes a paid unlock, not for ad views or unpaid previews.</p>
        <div class="wallet">Wallet estimate for ${myReferralId}: <b>${rupee.format(referralRepository.getWallet(myReferralId))}</b></div>
      </div>
      <div class="share-box">
        <input id="refLink" value="${link}" readonly />
        <button id="copyRef" class="secondary">Copy referral link</button>
        <button id="whatsappRef" class="primary">Share on WhatsApp</button>
      </div>
    </section>`;
};

const legalTemplate = () => `
  <section class="section legal" id="terms">
    <h2>Terms & conditions</h2>
    <p>PalmVeda AI provides entertainment, self-reflection, and spiritual-content experiences. Readings, horoscope tips, palm interpretations, and Vedic-inspired text are not medical, legal, financial, psychological, or guaranteed future advice. Users should make independent decisions and consult qualified professionals where required.</p>
    <p>Payments, refunds, referral eligibility, wallet settlement, affiliate/ad unlocks, and Cashfree checkout rules will follow the final production policy shown before payment. Referral rewards apply only after a referred user completes a successful paid report unlock.</p>
  </section>
  <section class="section legal" id="privacy">
    <h2>Privacy policy</h2>
    <p>Camera access is requested only to capture the palm image. This prototype keeps captured photos in the browser session and stores lead/referral data locally for demo purposes. A production Supabase setup should define retention, deletion, access controls, and consent logs before launch.</p>
    <p>Phone and email are collected to deliver detailed horoscope/kundli follow-up and connect users with astrologer services. Users should be able to request deletion or opt out of marketing messages.</p>
  </section>`;

const bindEvents = () => {
  document.querySelector('#startCamera')?.addEventListener('click', startCamera);
  document.querySelector('#snapPalm')?.addEventListener('click', snapPalm);
  document.querySelector('#payNow')?.addEventListener('click', payNow);
  document.querySelector('#adUnlock')?.addEventListener('click', partnerUnlock);
  document.querySelector('#shareUnlock')?.addEventListener('click', shareReading);
  document.querySelector('#leadForm')?.addEventListener('submit', saveLead);
  document.querySelector('#copyRef')?.addEventListener('click', copyReferral);
  document.querySelector('#whatsappRef')?.addEventListener('click', whatsappReferral);
  for (const id of ['name', 'birthDate', 'phone', 'email']) {
    document.querySelector(`#${id}`)?.addEventListener('input', (event) => {
      state.form[id] = event.target.value;
    });
  }
};

const startCamera = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    state.cameraError = 'Camera access is unavailable in this browser. Please open in Chrome/Safari over HTTPS.';
    render();
    return;
  }
  stopCamera();
  state.cameraError = '';
  const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false };
  state.stream = await navigator.mediaDevices.getUserMedia(constraints).catch((error) => {
    state.cameraError = error?.name === 'NotAllowedError'
      ? 'Camera permission was blocked. Allow camera access to capture your palm.'
      : 'Camera could not start. Try better browser permissions or another mobile browser.';
    render();
    return null;
  });
  if (!state.stream) return;
  const video = document.querySelector('#camera');
  video.srcObject = state.stream;
};

const stopCamera = () => {
  state.stream?.getTracks().forEach((track) => track.stop());
  state.stream = null;
};

const snapPalm = async () => {
  const video = document.querySelector('#camera');
  if (!state.stream || !video?.videoWidth) {
    await startCamera();
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  state.photo = canvas.toDataURL('image/jpeg', 0.82);
  stopCamera();
  runAnalysis(state.photo.slice(-80));
};

const runAnalysis = (imageSignature) => {
  state.analysing = true;
  render();
  const tips = [
    'Checking life line continuity and vitality markers…',
    'Comparing fate line flow with career and money indicators…',
    'Blending Vedic-inspired timing signals with palm texture patterns…',
    'Preparing a positive, practical reading you can act on today…',
  ];
  let i = 0;
  const interval = setInterval(() => {
    const tip = document.querySelector('#tip');
    if (tip) tip.textContent = tips[i++ % tips.length];
  }, 1200);
  setTimeout(() => {
    clearInterval(interval);
    state.reading = generatePalmReading({ ...state.form, imageSignature });
    state.analysing = false;
    render();
    location.hash = 'reading';
  }, 6200);
};

const payNow = () => {
  const orderId = `demo_${Date.now()}`;
  state.unlocked = true;
  referralRepository.trackPaidReferral(referrerId, orderId, 50);
  render();
  alert('Cashfree checkout placeholder: connect your backend order API and Cashfree SDK here. Demo report unlocked.');
};

const partnerUnlock = () => {
  alert('Partner offer placeholder: show 2–3 compliant affiliate ad screens here. Demo report remains locked until a real reward rule is configured.');
};

const shareReading = async () => {
  const text = `I tried PalmVeda AI. Get your palm reading: ${location.origin}${location.pathname}?ref=${myReferralId}`;
  if (navigator.share) await navigator.share({ title: 'PalmVeda AI', text, url: location.href });
  else await navigator.clipboard.writeText(text);
};

const saveLead = (event) => {
  event.preventDefault();
  const lead = leadRepository.saveLead({ ...state.form, referrerId, unlocked: state.unlocked });
  document.querySelector('#leadStatus').textContent = `Saved at ${new Date(lead.createdAt).toLocaleString()}. Our astrologer team can follow up soon.`;
};

const copyReferral = async () => {
  await navigator.clipboard.writeText(document.querySelector('#refLink').value);
  alert('Referral link copied.');
};

const whatsappReferral = () => {
  const link = encodeURIComponent(document.querySelector('#refLink').value);
  const text = encodeURIComponent('Try this AI palm reading and unlock your horoscope preview: ');
  open(`https://wa.me/?text=${text}${link}`, '_blank', 'noopener,noreferrer');
};

render();
