# Talons Game

Talons Game, 100 oyunluk bir katalog + oynanabilir mini oyun altyapısı sunan modern bir başlangıç projesidir.

## Özellikler
- 100 oyun kartı (5 tanesi anında oynanabilir, kalanlar yol haritasında).
- Kategori ve arama filtreleri.
- Modal içinde çalışan mini oyunlar:
  - Tic Tac Toe
  - Memory Match
  - Snake Arena
  - Rock Paper Scissors
  - Number Guess

## Çalıştırma
```bash
python3 -m http.server 4173
```
Ardından `http://localhost:4173` adresini aç.

## Sonraki adım önerileri
- Her "Yakında" slotunu gerçek oyun modülüne çevirmek.
- Skor tablosu ve kullanıcı profili eklemek.
- Oyunları ayrı dosyalara bölüp modüler yapı kurmak.
