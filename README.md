# Döviz Dönüştürücü ve Kur Grafiği Uygulaması

Bu proje, gerçek zamanlı döviz kuru verilerini gösteren 
ve para birimi dönüşümü yapabilen bir web uygulamasıdır.

# Kurulum adımları
gerekli olanlar; Web tarayıcısı , İnternet bağlantısı , Git 

Terminal/komut istemcisinde "git clone https://github.com/Medinesezgin/Currency-Converter.git" komutunu çalıştırarak projeyi klonlayın. Veya GitHub'dan manuel olarak ZIP olarak indirip açın.
cd Currency-Converter komutuyla proje klasörüne erişin.
index.html dosyasını sağ tıklayın
"Birlikte aç" seçeneğinden tercih ettiğiniz web tarayıcısını seçin
Veya dosyayı doğrudan tarayıcı penceresine sürükleyip bırakın.

# Dosya Açıklamaları
## index.html
Uygulamanın ana HTML yapısı, kullanıcı arayüzünü oluşturur. Tüm bileşenleri bir araya getirir.

## style.css
Responsive ve modern tasarım kısmını oluşturur.
2.jpg dosyasıyla arka plan resmi oluşturuldu.

## app.js
Para birimi verilerini API'den çeker, döviz çevirme işlemlerini yönetir, bayrak görsellerini yönetir,
kullanıcı etkileşimlerini işler.

## chart.js
Zaman içinde döviz kuru değişimlerini gösterir.
Günlük, haftalık, aylık ve yıllık seçimlere göre Chart.js kütüphanesi ile
etkileşimli grafik kur değerlerini gösterir.
