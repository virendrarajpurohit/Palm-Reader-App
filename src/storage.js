const KEYS = {
  leads: 'palmveda.leads',
  referrals: 'palmveda.referrals',
  wallet: 'palmveda.wallet',
};

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const createReferralId = () => {
  const existing = new URLSearchParams(location.search).get('ref');
  if (existing) return existing.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  return `PV${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
};

export const leadRepository = {
  saveLead(lead) {
    const leads = read(KEYS.leads, []);
    const payload = { ...lead, createdAt: new Date().toISOString() };
    leads.unshift(payload);
    write(KEYS.leads, leads.slice(0, 50));
    return payload;
  },
  getLeads() {
    return read(KEYS.leads, []);
  },
};

export const referralRepository = {
  trackVisit(referrerId) {
    if (!referrerId) return;
    const referrals = read(KEYS.referrals, []);
    referrals.unshift({ referrerId, event: 'visit', createdAt: new Date().toISOString() });
    write(KEYS.referrals, referrals.slice(0, 100));
  },
  trackPaidReferral(referrerId, orderId, amount = 50) {
    if (!referrerId) return;
    const referrals = read(KEYS.referrals, []);
    referrals.unshift({ referrerId, orderId, amount, event: 'paid_referral', createdAt: new Date().toISOString() });
    write(KEYS.referrals, referrals.slice(0, 100));
    const wallet = read(KEYS.wallet, {});
    wallet[referrerId] = (wallet[referrerId] || 0) + amount;
    write(KEYS.wallet, wallet);
  },
  getWallet(referrerId) {
    return read(KEYS.wallet, {})[referrerId] || 0;
  },
};
