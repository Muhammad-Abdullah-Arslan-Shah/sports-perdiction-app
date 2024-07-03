// Setting.js
export const generalSettings = {
    withdrawTaxPercentage: 15,
    maxMatches: 3,
    maxMoneyToPlaceBet: 100,
    maxBets:5
   
    }

const settingsUrl = './settings.json';

const fetchSettings = async () => {
  const response = await fetch(settingsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.statusText}`);
  }
  return await response.json();
};

let settings = {};

const loadSettings = async () => {
  try {
    settings = await fetchSettings();
    updateExports(settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

const updateExports = (settings) => {

  navLabels = settings.navLabels;
  countryLabels = settings.countryLabels;
  leagueLabels = settings.leagueLabels; // Ensure correct spelling
  matchLabels = settings.matchLabels;
  betSlipLabels = settings.betSlipLabels;
  myBetsLabels = settings.myBetsLabels;
  resultModalLabels = settings.resultModalLabels;
  confirmationModalLabels = settings.confirmationModalLabels;
  balanceModalLabels = settings.balanceModalLabels;
  PromoModalLabels = settings.PromoModalLabels;
};

loadSettings();

export let navLabels = {};
export let countryLabels = {};
export let leagueLabels = {}; // Ensure correct spelling
export let matchLabels = {};
export let betSlipLabels = {};
export let myBetsLabels = {};
export let resultModalLabels = {};
export let confirmationModalLabels = {};
export let balanceModalLabels = {};
export let PromoModalLabels  = {};

export { loadSettings };
