//para birimlerinin yanına bayrak görselleri eklemek için kullanılacak url ler
const currencyFlags = {
    "TRY": "https://flagcdn.com/w40/tr.png",
    "USD": "us.png",
    "EUR": "https://flagcdn.com/w40/eu.png",
    "GBP": "GB.png",
    "JPY": "jp.png",
    "CAD": "ca.png",
    "AUD": "au.png",
    "CHF": "CH.png",
    "CNY": "CN.png",
    "RUB": "RU.png",
    "AED": "AE.png",
    "AZN": "az.png",
    "BGN": "bg.png",
    "DKK": "dk.png",
    "KWD": "kw.png",
    "NOK": "no.png",
    "PKR": "pk.png",
    "QAR": "qa.png",
    "RON": "ro.png",
    "SAR": "sa.png",
    "SEK": "se.png",
    "XDR": "https://www.imf.org/~/media/Images/IMF/Resources/Images/SDR-Tablet-Phone.ashx?w=40",
    "KRW": "kr.png"
};

// Güncel kur verilerini çekip Dropdownları doldurur
async function loadCurrencies() {
    const response = await fetch("https://exchange.intern.demo.pigasoft.com/api/exchange/today");
    const json = await response.json(); //json formatına çevirir
    const rates = json.data;

    const fromSelect = document.querySelector(".from-input");
    const toSelect = document.querySelector(".to-input");

    fromSelect.innerHTML = ""; // drapdownları temizler
    toSelect.innerHTML = "";

    // TRY birimini manuel ekliyoruz çünkü diğer para birimleri TRY karşısındaki 
    //kuru gösterir.
    addCurrencyOption(fromSelect, "TRY", "TÜRK LİRASI");
    addCurrencyOption(toSelect, "TRY", "TÜRK LİRASI");

    // JSON'daki para birimleri için döngü oluşturuyoruz.
    for (let key in rates) {
        addCurrencyOption(fromSelect, key, rates[key].title);//fromSelect kısmına para birimi ekler
        addCurrencyOption(toSelect, key, rates[key].title);//toSelect kısmına para birimi ekler
    }

    // Fromselect ve toselect için varsayılan değerleri USD ve EUR olarak ayarlıyoruz
    fromSelect.value = "USD";
    toSelect.value = "EUR";

    // Bayrak güncelleyicileri bağla
    attachFlagUpdater(fromSelect);
    attachFlagUpdater(toSelect);

    // İlk grafik değeri
    updateChart(
    document.querySelector(".from-input").value,
    document.querySelector(".to-input").value,
    "Daily"
);

}




// Para birimi seçeneği ekliyoruz 
function addCurrencyOption(selectElement, currencyCode, currencyName) {

    const option = document.createElement("option");
    option.value = currencyCode;


    const flagUrl = currencyFlags[currencyCode]; //önceden tanımladığımız currencyFlags listesinden URL yi alıyoruz. 
    option.dataset.flag = flagUrl;
    option.textContent = `${currencyCode} - ${currencyName}`;

    selectElement.appendChild(option); //seçeneği select kısmına ekliyoruz.
}

// seçilen para birimine göre güncelliyoruz.
function updateSelectFlag(selectElement, currencyCode) { // seçilen para birimine göre bayrak görseli sol tarafta oluşuyor.
    const flagUrl = currencyFlags[currencyCode];
    selectElement.style.backgroundImage = `url(${flagUrl})`;

    selectElement.style.backgroundRepeat = "no-repeat";
    selectElement.style.backgroundSize = "25px"; //bayrağın boyutunu ayarlıyoruz.
    selectElement.style.backgroundPosition = "5px center";
    
    selectElement.style.paddingLeft = "30px"; // bayrak ile yazı arası boşluk
}

//hem from hem to için bayrak güncellemeleri yapılır.
function attachFlagUpdater(selectElement) {
    selectElement.addEventListener("change", function(e) {

        updateSelectFlag(this, e.target.value);

        // Hem from hem to değiştiğinde grafiği günceliyoruz
        if (this.classList.contains("from-input") || this.classList.contains("to-input")) {
            const period = document.querySelector(".drapdown").value || "Daily";

            const from = document.querySelector(".from-input").value;

            const to = document.querySelector(".to-input").value;

            updateChart(from, to, period);
        }
    });

    if (selectElement.value) {
        updateSelectFlag(selectElement, selectElement.value);
    }
}

// Sayfa yüklenince loadCurrencies çalışır.
window.addEventListener("DOMContentLoaded", loadCurrencies);

// Güncel kurları dödürür. çevirme işlemi için kullanılır.
async function getRates() {
    const response = await fetch("https://exchange.intern.demo.pigasoft.com/api/exchange/today");
    const json = await response.json();
    return json.data;
}

// Tarihli kurları döndürür.
async function fetchRateByDate(dateStr) {
    const url = `https://exchange.intern.demo.pigasoft.com/api/exchange/filter?date=${dateStr}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
}



// kullanıcının girdiği değeri alıyor seçilen para birirmlerine göre 
// önce TRY ye çeviriyor sonra seçilen para birimine çevirip sonucu yazıyor.
async function convert() {
    const amount = parseFloat(document.querySelector(".enter-input").value);
    const from = document.querySelector(".from-input").value;
    const to = document.querySelector(".to-input").value;


    // geçerli bir değer girilmediyse uyarı veriyor.
    if (isNaN(amount)) {
        alert("Lütfen geçerli bir sayı giriniz!");
        return;
    }

    const rates = await getRates();
    const fromRate = from === "TRY" ? 1 : parseFloat(rates[from]?.value);
    const toRate = to === "TRY" ? 1 : parseFloat(rates[to]?.value);

    if (!fromRate || !toRate) {
        alert("Bir para biriminin kuru bulunamadı!");
        return;
    }

    const inTRY = amount * fromRate;
    const result = inTRY / toRate;

    document.querySelector(".cnc-input").value = result.toFixed(2);


    // butona bastığımızda grafikte günluk değer çıksın.
    updateChart(from, to, "Daily");

}
// butona basınca convert çalışır.
document.querySelector(".search-btn").addEventListener("click", convert);


// Swap butonu ile from ve to kısmında yazılan para birimlerinin yerini 
// değiştiriyoruz. ardından bayraklar ve grafiği günceller.
document.getElementById("swap-btn").addEventListener("click", () => {

    const fromEl = document.querySelector(".from-input");

    const toEl = document.querySelector(".to-input");

    [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
    updateSelectFlag(fromEl, fromEl.value);
    updateSelectFlag(toEl, toEl.value);

    updateChart(fromEl.value, document.querySelector(".drapdown").value);
});

// zaman aralığı değişince grafik yeniden çiziliyor.
document.querySelector(".drapdown").addEventListener("change", (e) => {
    const from = document.querySelector(".from-input").value;
    const to = document.querySelector(".to-input").value;
    updateChart(from, to, e.target.value);
});



