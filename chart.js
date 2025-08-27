let rateChart = null; // her seferinde yeni grafik oluşturuyoruz eskisi ile üst üste binmesin diye

// Tarihi GG-AA-YYYY formatına çeviriyoruz.
function formatDate(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}-${mm}-${yy}`;
}

// seçilen para birimine ve zaman periyoduna göre grafik verilerini hazırlıyoruz.
async function updateChart(fromCurrency, toCurrency, period) {
    let labels = [];
    let fromValues = [];
    let toValues = [];
    const today = new Date();

    async function getDataForCurrency(currency) {
        let values = [];
        if (period === "Daily") {
            const res = await fetch("https://exchange.intern.demo.pigasoft.com/api/exchange/today");
            const json = await res.json();
            const data = json.data;
            labels = [formatDate(today)];
            values.push(parseFloat(data[currency]?.value || 0));
        }
        else if (period === "Weekly") {
         for (let i = 6; i >= 0; i--) {
             const d = new Date();
                d.setDate(today.getDate() - i);
            const ds = formatDate(d);
                try {
                const data = await fetchRateByDate(ds);
                 if (!labels.includes(ds)) labels.push(ds);
                    values.push(parseFloat(data[currency]?.value || 0));

                    // eğer bir tarihte veri yoksa o gün için null ekleniyor.
          } catch {
                    values.push(null);
                }
            }
        }
        else if (period === "Monthly") {
            for (let i = 29; i >= 0; i--) {
                const d = new Date();

        d.setDate(today.getDate() - i);
                const ds = formatDate(d);

                try {
          const data = await fetchRateByDate(ds);
                    if (!labels.includes(ds)) labels.push(ds);

              values.push(parseFloat(data[currency]?.value || 0));
               } catch {
                    values.push(null);
                }
            }
        }
        else if (period === "Annual") {
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
        d.setMonth(today.getMonth() - i);
       const ds = formatDate(d);
                try {
                    const data = await fetchRateByDate(ds);


                    if (!labels.includes(ds)) labels.push(ds);
     values.push(parseFloat(data[currency]?.value || 0));
                } catch {
          values.push(null);
                }
            }
        }
        return values;
    }

    fromValues = await getDataForCurrency(fromCurrency);
    toValues = await getDataForCurrency(toCurrency);

    // Elde edilen verilerle grafiği oluşturup güncelliyoruz.
    const ctx = document.getElementById("rateChart").getContext("2d");
    if (rateChart) rateChart.destroy();

    rateChart = new Chart(ctx, {
        type: "line", //çizgi grafik
        // kur değeri
        data: {
            labels, //tarih ekseni
            datasets: [
                {
                    label: `${fromCurrency} (${period})`,
                    data: fromValues,
                    borderColor: "rgba(5, 5, 195, 1)",
                    backgroundColor: "rgba(0, 0, 255, 0.11)",
                    fill: true, //çizgi grafiğinin altını doldurur.
                    tension: 0.3
                },
                {
                    label: `${toCurrency} (${period})`,
                    data: toValues,
                    borderColor: "rgba(18, 15, 15, 1)",
                    backgroundColor: "rgba(24, 18, 18, 0.21)",
                    fill: true, //çizgi grafiğinin altını doldurur.
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: `${fromCurrency} vs ${toCurrency} (${period})` } //grafiğin başlığı
            }
        }
    });
}

