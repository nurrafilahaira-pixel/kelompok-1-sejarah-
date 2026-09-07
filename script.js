// @ts-nocheck
/* =========================
   MENU MOBILE
   ========================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("active");

    });

}


document.querySelectorAll("#navMenu a").forEach(function (link) {

    link.addEventListener("click", function () {

        navMenu.classList.remove("active");

    });

});


/* =========================
   DATA JALUR
   ========================= */

const route = [
    [38.7223, -9.1393],
    [15.4909, 73.8278],
    [2.1896, 102.2501],
    [-3.6954, 128.1814],
    [0.7907, 127.3842]
];


const places = [
    {
        name: "Portugis",
        coords: [38.7223, -9.1393],
        text: "Asal bangsa Portugis dan titik awal pelayaran menuju Asia."
    },

    {
        name: "Goa, India",
        coords: [15.4909, 73.8278],
        text: "Salah satu wilayah penting dalam jaringan pelayaran Portugis di Samudra Hindia."
    },

    {
        name: "Malaka — 1511",
        coords: [2.1896, 102.2501],
        text: "Portugis berhasil menguasai Malaka pada tahun 1511 di bawah pimpinan Afonso de Albuquerque."
    },

    {
        name: "Maluku — 1512",
        coords: [-3.6954, 128.1814],
        text: "Ekspedisi Portugis mencapai Maluku pada tahun 1512 untuk mendapatkan akses ke perdagangan rempah-rempah."
    },

    {
        name: "Ternate",
        coords: [0.7907, 127.3842],
        text: "Portugis menjalin hubungan perdagangan dan politik dengan Kesultanan Ternate."
    }
];


let map = null;
let shipMarker = null;


/* =========================
   ICON KAPAL
   ========================= */

function createShipIcon() {

    return L.divIcon({

        className: "ship-marker",

        html: "⛵",

        iconSize: [40, 40],

        iconAnchor: [20, 20]

    });

}


/* =========================
   BUAT PETA
   ========================= */

function createMap() {

    const container =
        document.getElementById("map-container");

    if (!container) {
        return;
    }


    /* Cek Leaflet */

    if (typeof L === "undefined") {

        container.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                padding:30px;
                background:#eadbc0;
                color:#5b4030;
                font-family:Arial;
            ">

                <div>

                    <h3>
                        Peta tidak dapat dimuat
                    </h3>

                    <p>
                        Pastikan koneksi internet aktif,
                        lalu buka kembali halaman.
                    </p>

                </div>

            </div>
        `;

        return;
    }


    try {

        map = L.map("map-container");


        /* Peta dasar */

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);


        /* Marker lokasi */

        places.forEach(function (place) {

            const marker =
                L.marker(place.coords)
                .addTo(map);


            marker.bindPopup(`
                <div class="popup-content">

                    <h3>
                        ${place.name}
                    </h3>

                    <p>
                        ${place.text}
                    </p>

                </div>
            `);

        });


        /* Garis jalur */

        const routeLine =
            L.polyline(route, {

                color: "#b43b2f",

                weight: 6,

                opacity: 0.9,

                lineJoin: "round",

                lineCap: "round"

            }).addTo(map);


        /* Klik garis */

        routeLine.on("click", function (e) {

            L.popup()

                .setLatLng(e.latlng)

                .setContent(`
                    <div class="popup-content">

                        <h3>
                            Jalur Pelayaran Portugis
                        </h3>

                        <p>
                            Jalur perjalanan Portugis
                            menuju Nusantara.
                        </p>

                        <strong>
                            Portugal → Goa → Malaka
                            → Maluku → Ternate
                        </strong>

                    </div>
                `)

                .openOn(map);

        });


        /* Marker kapal */

        shipMarker =
            L.marker(

                route[0],

                {
                    icon: createShipIcon(),

                    zIndexOffset: 1000
                }

            ).addTo(map);


        /* Tampilkan seluruh jalur */

        map.fitBounds(
            routeLine.getBounds(),
            {
                padding: [30, 30]
            }
        );


        /* Perbaiki ukuran */

        setTimeout(function () {

            map.invalidateSize();

        }, 500);


    } catch (error) {

        console.log(
            "Peta gagal dimuat:",
            error
        );

    }

}


/* =========================
   ANIMASI KAPAL
   ========================= */

function animateJourney() {

    if (!map || !shipMarker) {
        return;
    }


    let segment = 0;

    /* 7 detik per bagian */

    const duration = 7000;


    function moveSegment() {

        if (segment >= route.length - 1) {

            shipMarker.setLatLng(
                route[route.length - 1]
            );

            return;
        }


        const start = route[segment];

        const end = route[segment + 1];

        const startTime = performance.now();


        function animate(currentTime) {

            const elapsed =
                currentTime - startTime;


            let progress =
                elapsed / duration;


            if (progress > 1) {

                progress = 1;

            }


            /* Gerakan lebih halus */

            const smoothProgress =
                progress < 0.5

                ? 2 * progress * progress

                : 1 -
                  Math.pow(
                      -2 * progress + 2,
                      2
                  ) / 2;


            const lat =
                start[0] +
                (end[0] - start[0]) *
                smoothProgress;


            const lng =
                start[1] +
                (end[1] - start[1]) *
                smoothProgress;


            shipMarker.setLatLng([
                lat,
                lng
            ]);


            if (progress < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                segment++;

                moveSegment();

            }

        }


        requestAnimationFrame(
            animate
        );

    }


    moveSegment();

}


/* =========================
   TOMBOL PERJALANAN
   ========================= */

function startJourney() {

    const mapSection =
        document.getElementById("peta");


    if (mapSection) {

        mapSection.scrollIntoView({
            behavior: "smooth"
        });

    }


    setTimeout(function () {

        animateJourney();

    }, 900);

}


const journeyBtn =
    document.getElementById("journeyBtn");


const heroJourneyBtn =
    document.getElementById("heroJourneyBtn");


if (journeyBtn) {

    journeyBtn.addEventListener(
        "click",
        startJourney
    );

}


if (heroJourneyBtn) {

    heroJourneyBtn.addEventListener(
        "click",
        startJourney
    );

}


/* =========================
   ANIMASI SCROLL
   ========================= */

const fadeElements =
    document.querySelectorAll(".fade-in");


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "show"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


fadeElements.forEach(function (element) {

    observer.observe(element);

});


/* =========================
   BACK TO TOP
   ========================= */

const backTop =
    document.getElementById("backTop");


window.addEventListener(
    "scroll",
    function () {

        if (window.scrollY > 400) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }
);


if (backTop) {

    backTop.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================
   NAVBAR SAAT SCROLL
   ========================= */

const navbar =
    document.querySelector(".navbar");


window.addEventListener(
    "scroll",
    function () {

        if (window.scrollY > 40) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }
);


/* =========================
   MULAIKAN PETA
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createMap();

    }
);