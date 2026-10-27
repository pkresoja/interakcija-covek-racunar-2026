export function getPrice(seat: string): number {
    if (seat.startsWith('E')) return 1300
    if (seat.startsWith('D')) return 1200
    if (seat.startsWith('C')) return 1000
    if (seat.startsWith('B')) return 900
    return 800
}

interface AverageColor {
    rgb: string;   // npr. "rgb(255, 99, 71)"
    hex: string;   // npr. "#ff6347"
    r: number;
    g: number;
    b: number;
}

export function getAvgRGB(src: string): Promise<AverageColor> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d');

        if (!context) {
            reject(new Error("Neuspešno kreiranje 2D konteksta canvas-a"));
            return;
        }

        const img = new Image();
        // Omogućava čitanje piksela ako slika dolazi sa drugog domena (CORS)
        img.crossOrigin = "Anonymous";
        img.src = src;

        img.onload = () => {
            context.imageSmoothingEnabled = true;
            // Iscrtava celu sliku sabijenu u 1x1 piksel (ovo automatski računa prosek)
            context.drawImage(img, 0, 0, 1, 1);

            // Uzimanje podataka o jedinom pikselu
            const pixel = context.getImageData(0, 0, 1, 1).data;
            const r = pixel[0];
            const g = pixel[1];
            const b = pixel[2];

            // Pretvaranje u Hex format (hash)
            const toHex = (c: number) => c.toString(16).padStart(2, '0');
            const hex = `#${toHex(r!)}${toHex(g!)}${toHex(b!)}`;

            resolve({
                rgb: `rgb(${r}, ${g}, ${b})`,
                hex: hex,
                r: r!,
                g: g!,
                b: b!
            });
        };

        img.onerror = (err) => {
            reject(new Error("Greška pri učitavanju slike: " + err));
        };
    });
}
