const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mendapatkan alamat IP dan lokasi
app.post('/location', (req, res) => {
    const ip = req.headers['x-real-ip'] || req.ip; // Mengambil IP dari header X-Real-IP atau menggunakan req.ip
    const { latitude, longitude } = req.body;

    console.log(`IP: ${ip}, Latitude: ${latitude}, Longitude: ${longitude}`);

    // Kirim respons
    res.send('Lokasi berhasil diterima');
});

// Endpoint untuk halaman utama
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Get Location</title>
        </head>
        <body>
            <h1>Get Your Location</h1>
            <button id="getLocation">Get Location</button>
            <h2 id="result"></h2> <!-- Elemen untuk menampilkan hasil -->

            <script>
                document.getElementById('getLocation').addEventListener('click', () => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;

                            // Tampilkan hasil di elemen h2
                            document.getElementById('result').innerText = 
                                \`Latitude: \${latitude}, Longitude: \${longitude}\`;

                            fetch('/location', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ latitude, longitude }),
                            })
                            .then(response => response.text())
                            .then(data => console.log(data))
                            .catch(error => console.error('Error:', error));
                        }, (error) => {
                            // Tangani error saat mendapatkan lokasi
                            document.getElementById('result').innerText = 'Error getting location: ' + error.message;
                        });
                    } else {
                        alert('Geolocation is not supported by this browser.');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
