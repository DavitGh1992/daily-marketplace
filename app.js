
// --- MOCK DATA (We will replace this with Firebase later) ---
const mockPricelists = [
    { seller: "Fresh Farms", date: "2026-07-29", items: "Apples: $2/lb\nOranges: $3/lb\nMilk: $4/gal" },
    { seller: "City Bakery", date: "2026-07-29", items: "Sourdough: $6\nCroissant: $3\nBaguette: $4" },
    { seller: "Ocean Catch", date: "2026-07-29", items: "Salmon: $15/lb\nShrimp: $12/lb\nCod: $10/lb" }
];

// --- UI ELEMENTS ---
const buyerViewBtn = document.getElementById('buyerViewBtn');
const sellerViewBtn = document.getElementById('sellerViewBtn');
const buyerSection = document.getElementById('buyerSection');
const sellerSection = document.getElementById('sellerSection');
const pricelistContainer = document.getElementById('pricelistContainer');

// --- VIEW SWITCHING ---
buyerViewBtn.addEventListener('click', () => {
    buyerSection.classList.remove('hidden');
    sellerSection.classList.add('hidden');
    buyerViewBtn.classList.add('active');
    sellerViewBtn.classList.remove('active');
});

sellerViewBtn.addEventListener('click', () => {
    buyerSection.classList.add('hidden');
    sellerSection.classList.remove('hidden');
    sellerViewBtn.classList.add('active');
    buyerViewBtn.classList.remove('active');
});

// --- RENDER BUYER DAT ---
function renderPricelists() {
    pricelistContainer.innerHTML = ''; // Clear existing
    mockPricelists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${list.seller}</h3>
            <p><em>Updated: ${list.date}</em></p>
            <pre style="white-space: pre-wrap; font-family: inherit;">${list.items}</pre>
        `;
        pricelistContainer.appendChild(card);
    });
}

// --- MOCK SELLER ACTIONS ---
document.getElementById('loginBtn').addEventListener('click', () => {
    alert("Login clicked! (We will connect Firebase in the next step)");
    // Simulate login success
    document.getElementById('authForm').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('sellerName').innerText = "DemoSeller";
});

document.getElementById('registerBtn').addEventListener('click', () => {
    alert("Register clicked! (We will connect Firebase in the next step)");
});

document.getElementById('postPricelistBtn').addEventListener('click', () => {
    const text = document.getElementById('pricelistInput').value;
    if(text) {
        alert("Pricelist posted! (Mock success)");
        document.getElementById('pricelistInput').value = '';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('authForm').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
});

// Initialize
renderPricelists();
