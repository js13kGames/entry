var jsfxr = window.jsfxr
var AFRAME = window.AFRAME

hand = null;
boxs = [];
boxs_left = [];
in_hand = null;
orders = [];
nb_orders = null;
score = 0;
nb_order_completed = 0;
level = 1;
timer = 120;
timer_countdown = null;
timer_interval = null;
default_countdown = 5;
sound_on = true;
show_airport = true;


AFRAME.registerComponent('play-listener', {
    init: function () {
        countdown = null;
        this.el.addEventListener('click', (evt) => {
            if (countdown != null)
                return;
            document.getElementById('camera').setAttribute('wasd-controls', '');
            document.getElementById('menu').setAttribute('visible', 'false');
            document.getElementById('menu').setAttribute('position', '0 4.75 0.5');
            document.getElementById('menu_home').setAttribute('visible', 'false');
            document.getElementById("menu_home").setAttribute('position', '0 0 0');
            document.getElementById('view_countdown_text').setAttribute('text', 'anchor:align;width:7;color:black;value:' +
                countdown + ';align:center;shader:flat');
            start()
        });
    }
});

AFRAME.registerComponent('instructions-listener', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            playSound("click");
            setTimeout(() => {
                if (menu) {
                    document.getElementById('menu_home').setAttribute('visible', 'false');
                    document.getElementById("menu_home").setAttribute('position', '0 5 0');
                    document.getElementById('menu_instructions').setAttribute('visible', 'true');
                    document.getElementById("menu_instructions").setAttribute('position', '0 0 0.05');
                }
            }, 50);
        });
    }
});

AFRAME.registerComponent('back-listener', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            playSound("click");
            setTimeout(() => {
                document.getElementById('menu_instructions').setAttribute('visible', 'false');
                document.getElementById('menu_instructions').setAttribute('position', '0 5 0');
                document.getElementById('menu_home').setAttribute('visible', 'true');
                document.getElementById('menu_home').setAttribute('position', '0 0 0.05');
            }, 50)
        });


        init();
    }
});

AFRAME.registerComponent('score-listener', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            playSound("click");
            setTimeout(() => {
                timer_countdown > 0 ? start(level++) : start(level);
            }, 50)
        });
    }
});

AFRAME.registerComponent('dock-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            country = this.parentNode.id;
            if (orders.length == 0)
                return;
            if (in_hand != null) {
                box_id = in_hand;
                box_e = document.getElementById(box_id);
                if (box_e.getAttribute('data-numb').toString() !== orders[nb_order_completed].numb.toString()) {
                    playError("Bad order id", 10);
                    return;
                }
                if (box_e.getAttribute('data-key').toString() !== orders[nb_order_completed].key.toString()) {
                    playError("Bad order", 10);
                    return;
                }
                if (box_e.getAttribute("data-country") !== this.parentNode.id) {
                    playError("Bad country", 10);
                    return;
                }
                validOrder(box_id);
                hb = document.getElementById('hb');
                dhbct = document.getElementById('hb_' + country);
                posy = 1.255 + (box_e.getAttribute('data-height') / 2)
                dhbct.setAttribute('position', '0 ' + posy + ' -0.5');
                dhbct.setAttribute('visible', 'true');
                dhbct.setAttribute('animation', 'property: position; to: 0 ' + posy + ' -1.5; dur: 2000');
                hb.setAttribute("visible", "false");
                hb.setAttribute("position", "0 -4.8 -0.3");

                dhbc = document.getElementById('hbc_' + country);
                dhbt1 = document.getElementById('hbt1_' + country);
                dhbt2 = document.getElementById('hbt2_' + country);
                dhbcity = document.getElementById('hbcity_' + country);
                dhbcityt = document.getElementById('hbcityt_' + country);
                dhbc.setAttribute("height", box_e.getAttribute('data-width')); // LARGEUR
                dhbc.setAttribute("width", box_e.getAttribute('data-depth')); // DEPTH
                dhbc.setAttribute("depth", box_e.getAttribute('data-height')); // HAUTEUR
                dhbc.setAttribute("color", box_e.getAttribute('data-color'));
                dhbt1.setAttribute("text", "anchor:align;width:3.3;color:white;value:" + box_e.getAttribute('data-text') + ";align:center;shader:flat");
                dhbt2.setAttribute("text", "anchor:align;width:3.3;color:white;value:" + box_e.getAttribute('data-numb') + ";align:center;shader:flat");

                box_e.setAttribute('visible', 'false')
                city = box_e.getAttribute('data-city')
                if (!show_airport)
                    city = text + " Airport";

                dhbcity.setAttribute("depth", box_e.getAttribute('data-width'));
                dhbcityt.setAttribute("text", "width: 1.5; color: black; value: " + city + "; align: center;shader:flat");

                setTimeout(() => {
                    dhbct.setAttribute('visible', 'false');
                }, 2000)

                in_hand = null;
            }
        });
    }
});


airports = {
    france:
        [
            { code: 'CDG', title: 'Charles de Gaulle International Airport', city: 'Paris' },
            { code: 'NCE', title: 'Nice-Côte d\'Azur Airport', city: 'Nice' },
            { code: 'LYS', title: 'Lyon Saint-Exupery Airport', city: 'Lyon' },
            { code: 'MRS', title: 'Marseille Provence Airport', city: 'Marseille' },
            { code: 'TLS', title: 'Toulouse-Blagnac Airport', city: 'Toulouse/Blagnac' },
            { code: 'ORY', title: 'Paris-Orly Airport', city: 'Paris' },
            { code: 'BSL', title: 'EuroAirport Basel-Mulhouse-Freiburg Airport', city: 'Bale/Mulhouse' },
            { code: 'BOD', title: 'Bordeaux-Merignac Airport', city: 'Bordeaux/Merignac' },
            { code: 'NTE', title: 'Nantes Atlantique Airport', city: 'Nantes' },
            { code: 'SXB', title: 'Strasbourg Airport', city: 'Strasbourg' },
            { code: 'LIL', title: 'Lille-Lesquin Airport', city: 'Lille/Lesquin' },
            { code: 'AJA', title: 'Ajaccio-Napoleon Bonaparte Airport', city: 'Ajaccio/Napoleon Bonaparte' },
            { code: 'BES', title: 'Brest Bretagne Airport', city: 'Brest/Guipavas' },
            { code: 'BIA', title: 'Bastia-Poretta Airport', city: 'Bastia/Poretta' },
            { code: 'MPL', title: 'Montpellier-Mediterranee Airport', city: 'Montpellier/Mediterranee' },
            { code: 'CLY', title: 'Calvi-Sainte-Catherine Airport', city: 'Calvi/Sainte-Catherine' },
            { code: 'FSC', title: 'Figari Sud-Corse Airport', city: 'Figari Sud-Corse' },
            { code: 'RNS', title: 'Rennes-Saint-Jacques Airport', city: 'Rennes/Saint-Jacques' },
            { code: 'BIQ', title: 'Biarritz-Anglet-Bayonne Airport', city: 'Biarritz/Anglet/Bayonne' },
            { code: 'EGC', title: 'Bergerac-Roumanière Airport', city: 'Bergerac/Roumanière' },
            { code: 'LIG', title: 'Limoges Airport', city: 'Limoges/Bellegarde' },
            { code: 'CFE', title: 'Clermont-Ferrand Auvergne Airport', city: 'Clermont-Ferrand/Auvergne' },
            { code: 'LRH', title: 'La Rochelle-Ile de Re Airport', city: 'La Rochelle/Ile de Re' },
            { code: 'PUF', title: 'Pau Pyrenees Airport', city: 'Pau/Pyrenees (Uzein)' },
            { code: 'LDE', title: 'Tarbes-Lourdes-Pyrenees Airport', city: 'Tarbes/Lourdes/Pyrenees' },
            { code: 'BVE', title: 'Brive Souillac Airport', city: 'Brive' },
            { code: 'EBU', title: 'Saint-etienne-Boutheon Airport', city: 'Saint-etienne/Boutheon' },
            { code: 'PGF', title: 'Perpignan-Rivesaltes (Llabanère) Airport', city: 'Perpignan/Rivesaltes' },
            { code: 'BVA', title: 'Paris Beauvais Tille Airport', city: 'Beauvais/Tille' },
            { code: 'PIS', title: 'Poitiers-Biard Airport', city: 'Poitiers/Biard' }
        ],
    germany: [
        { code: 'FRA', title: 'Frankfurt am Main Airport', city: 'Frankfurt am Main' },
        { code: 'MUC', title: 'Munich Airport', city: 'Munich' },
        { code: 'DUS', title: 'Dusseldorf Airport', city: 'Dusseldorf' },
        { code: 'TXL', title: 'Berlin - Tegel Airport', city: 'Berlin' },
        { code: 'HAM', title: 'Hamburg Airport', city: 'Hamburg' },
        { code: 'STR', title: 'Stuttgart Airport', city: 'Stuttgart' },
        { code: 'CGN', title: 'Cologne Bonn Airport', city: 'Cologne' },
        { code: 'HAJ', title: 'Hannover Airport', city: 'Hannover' },
        { code: 'SXF', title: 'Berlin - Schonefeld Airport', city: 'Berlin' },
        { code: 'NUE', title: 'Nuremberg Airport', city: 'Nuremberg' },
        { code: 'LEJ', title: 'Leipzig / Halle Airport', city: 'Leipzig' },
        { code: 'BRE', title: 'Bremen Airport', city: 'Bremen' },
        { code: 'DRS', title: 'Dresden Airport', city: 'Dresden' },
        { code: 'DTM', title: 'Dortmund Airport', city: 'Dortmund' },
        { code: 'FMM', title: 'Memmingen Allgau Airport', city: 'Memmingen' },
        { code: 'FDH', title: 'Friedrichshafen Airport', city: 'Friedrichshafen' },
        { code: 'FKB', title: 'Karlsruhe Baden - Baden Airport', city: 'Baden - Baden' },
        { code: 'FMO', title: 'Munster Osnabrück Airport', city: 'Munster' },
        { code: 'SCN', title: 'Saarbrucken Airport', city: 'Saarbrucken' },
        { code: 'PAD', title: 'Paderborn Lippstadt Airport', city: 'Paderborn' },
        { code: 'GWT', title: 'Westerland Sylt Airport', city: 'Westerland' },
        { code: 'RLG', title: 'Rostock - Laage Airport', city: 'Rostock' },
        { code: 'HHN', title: 'Frankfurt - Hahn Airport', city: 'Frankfurt am Main' },
        { code: 'LBC', title: 'Lubeck Blankensee Airport', city: 'Lubeck' },
        { code: 'KSF', title: 'Kassel - Calden Airport', city: 'Kassel' },
        { code: 'HDF', title: 'Heringsdorf Airport', city: 'Heringsdorf' },
        { code: 'ERF', title: 'Erfurt Airport', city: 'Erfurt' },
        { code: 'MHG', title: 'Mannheim - City Airport', city: 'Mannheim' },
        { code: 'NRN', title: 'Weeze Airport', city: 'Weeze' }
    ],
    italy: [
        { code: 'FCO', title: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome' },
        { code: 'MXP', title: 'Malpensa International Airport', city: 'Milan' },
        { code: 'VCE', title: 'Venice Marco Polo Airport', city: 'Venice' },
        { code: 'BLQ', title: 'Bologna Guglielmo Marconi Airport', city: 'Bologna' },
        { code: 'NAP', title: 'Naples International Airport', city: 'Napoli' },
        { code: 'CTA', title: 'Catania-Fontanarossa Airport', city: 'Catania' },
        { code: 'LIN', title: 'Milano Linate Airport', city: 'Milan' },
        { code: 'TRN', title: 'Turin Airport', city: 'Torino' },
        { code: 'FLR', title: 'Peretola Airport', city: 'Firenze' },
        { code: 'VRN', title: 'Verona Villafranca Airport', city: 'Verona' },
        { code: 'PMO', title: 'Falcone–Borsellino Airport', city: 'Palermo' },
        { code: 'OLB', title: 'Olbia Costa Smeralda Airport', city: 'Olbia (SS)' },
        { code: 'PSA', title: 'Pisa International Airport', city: 'Pisa' },
        { code: 'BRI', title: 'Bari Karol Wojtyła Airport', city: 'Bari' },
        { code: 'GOA', title: 'Genoa Cristoforo Colombo Airport', city: 'Genova' },
        { code: 'CAG', title: 'Cagliari Elmas Airport', city: 'Cagliari' },
        { code: 'SUF', title: 'Lamezia Terme Airport', city: 'Lamezia Terme (CZ)' },
        { code: 'BGY', title: 'Il Caravaggio International Airport', city: 'Bergamo' },
        { code: 'BDS', title: 'Brindisi – Salento Airport', city: 'Brindisi' },
        { code: 'AHO', title: 'Alghero-Fertilia Airport', city: 'Alghero' },
        { code: 'AOI', title: 'Ancona Falconara Airport', city: 'Ancona' },
        { code: 'TSF', title: 'Treviso-Sant\'Angelo Airport', city: 'Treviso' },
        { code: 'CUF', title: 'Cuneo International Airport', city: 'Cuneo' },
        { code: 'TRS', title: 'Trieste–Friuli Venezia Giulia Airport', city: 'Trieste' },
        { code: 'RMI', title: 'Federico Fellini International Airport', city: 'Rimini' },
        { code: 'REG', title: 'Reggio Calabria Airport', city: 'Reggio Calabria' },
        { code: 'BZO', title: 'Bolzano Airport', city: 'Bolzano' },
        { code: 'CIA', title: 'Ciampino–G. B. Pastine International Airport', city: 'Rome' },
        { code: 'EBA', title: 'Marina Di Campo Airport', city: 'Marina Di Campo' },
        { code: 'PEG', title: 'Perugia San Francesco d\'Assisi – Umbria International Airport', city: 'Perugia' }
    ]
}
function createText(type, text, position = null, rotation = null, scale = null) {
    object = document.createElement(type);
    object.setAttribute('text', text);
    object.setAttribute('position', position);
    object.setAttribute('rotation', rotation);
    object.setAttribute('scale', scale);
    return object;
}
function createObject(type, width = 1, height = 1, depth = null, position = null, rotation = null, scale = null, color = null, opacity = null) {
    object = document.createElement(type);
    object.setAttribute('width', width);
    object.setAttribute('height', height);
    object.setAttribute('depth', depth);
    object.setAttribute('position', position);
    object.setAttribute('rotation', rotation);
    object.setAttribute('scale', scale);
    object.setAttribute('color', color);
    object.setAttribute('opacity', opacity != null ? opacity : 1);
    return object;
}

function createAnimation(attribute, to, easing, delay, direction, dur, repeat) {
    animation = document.createElement('a-animation');
    animation.setAttribute('attribute', attribute);
    animation.setAttribute('to', to);
    animation.setAttribute('easing', easing);
    animation.setAttribute('delay', delay);
    animation.setAttribute('direction', direction);
    animation.setAttribute('dur', dur);
    animation.setAttribute('repeat', repeat);
    return animation;
}

function updateBoxs() {
    for (let i = 0; i < (6 * 2 * 3); i++) {
        eb = document.getElementById('box_' + i);
        m = -0.55;
        if (i % 2 !== 0)
            m = 0.55;
        rh = (3.7 + Math.floor(Math.random() * 7.5) + 1) * 0.1;
        rw = (3.2 + Math.floor(Math.random() * 7.5) + 1) * 0.1;
        numb = Math.random().toString().slice(2, 5);
        airport = null;
        while (airport == null || airport.city.length / 30 > rw) {
            airport = randAirport();
            text = airport.code;
            destination = airport.country;
            city = airport.city;
        }
        key = text + numb;
        colors = ["#87775c", "brown", "orange"];
        let color = colors[randArray(colors)];
        eb.innerHTML = "";

        if (!show_airport)
            city = text + " Airport";

        b2 = createObject("a-box", 0.03, 0.3, 0.4, "0.4 0 0", "0 0 0", null, "black");
        b3 = createObject("a-box", 0.03, 0.07, rw, "0.4 0.2 0", "0 0 0", null, "white");
        t2 = createText("a-text", "anchor:align;width:3.3;color:white;value:" + text + ";align:center;shader:flat", "0.02 0.06 0", "0 90 0", "1 1 1");
        t3 = createText("a-text", "anchor:align;width:3.3;color:white;value:" + numb + ";align:center;shader:flat", "0.02 -0.06 0", "0 90 0", "1 1 1");
        t4 = createText("a-text", "anchor:align;width:1.5;color:black;value:" + city + ";align:center;shader:flat", "0.02 0 0", "0 90 0", "1 1 1");
        b3.appendChild(t4);
        b2.appendChild(t2);
        b2.appendChild(t3);

        eb.removeEventListener('click', () => { });
        eb.innerHTML = "";
        eb.appendChild(b2);
        eb.appendChild(b3);
        eb.setAttribute('geometry', 'primitive: box; width: 0.8; height: ' + rh + '; depth: ' + rw + '');
        eb.setAttribute('material', 'color: ' + color + '; opacity: 1; shader: flat');
        eb.setAttribute('position', '0 ' + (rh / 2) + ' ' + m);

        eb.setAttribute('visible', 'true');
        eb.setAttribute('data-text', text);
        eb.setAttribute('data-numb', numb);
        eb.setAttribute('data-height', rh);
        eb.setAttribute('data-width', rw);
        eb.setAttribute('data-depth', 0.8);
        eb.setAttribute('data-color', color);
        eb.setAttribute('data-key', key);
        eb.setAttribute('data-city', airport.city);
        eb.setAttribute('data-country', airport.country);
        eb.setAttribute('data-title', airport.title);
        boxs.push({
            text: text,
            numb: numb,
            country: airport.country,
            city: airport.city,
            title: airport.title,
            key: key
        });
        //END CLICK
    }

    // document.getElementById("raycaster").components.raycaster.refreshObjects();
}
function createEtageres() {


    hl = document.getElementById('hl');
    hr = document.getElementById('hr');
    hb = document.getElementById('hb');
    hbc = document.getElementById('hbc');
    hbt1 = document.getElementById('hbt1');
    hbt2 = document.getElementById('hbt2');
    hbcity = document.getElementById('hbcity');
    hbcityt = document.getElementById('hbcityt');

    if (document.getElementById("etageres"))
        document.getElementById("etageres").innerHTML = "";
    box_id = 0;
    etageres = [['0 0 0', '0 0 0'], ['0 0 0', '0 -180 0'], ['0 0 0', '0 90 0'], ['0 0 2.5', '0 0 0'], ['0 0 -2.5', '0 -180 0'], ['2.5 0 0', '0 90 0']]
    for (let etagere of etageres) {
        //ETAGERE
        e = document.createElement('a-entity');
        e.setAttribute('position', etagere[0]);
        e.setAttribute('rotation', etagere[1]);
        //PIEDS
        ppos = ["-2.6 1.5 -2.4", "-2.6 1.5 -0.1", "-3.9 1.5 -0.1", "-3.9 1.5 -2.4"];
        for (let p of ppos) {
            f = createObject("a-box", 1, 3, 1, p, null, "0.1 1 0.1", "#A27B4B");
            e.appendChild(f);
        }
        //PLAQUE
        hpos = ["0.1", "1.3", "02.5"];
        for (let p of hpos) {
            h = createObject("a-box", 1.5, 0.1, 2.5, "-3.25 " + p + " -1.250", null, "1 1 1", "black");
            e.appendChild(h);
        }
        //CARTONS
        hpos = ["0.1", "1.3", "02.5"];
        for (let p of hpos) {
            h = createObject("a-box", 1.5, 0.1, 2.5, "-3.25 " + p + " -1.250", null, "1 1 1", "black");
            for (let bbox of [0, 1]) {
                eb = document.createElement('a-entity');
                eb.classList.add('clickable');
                eb.setAttribute("mixin", "box");
                eb.id = "box_" + box_id;
                // START CLICK
                eb.addEventListener('click', function (evt) {
                    if (orders.length == 0 || (this.getAttribute("visible") == false))
                        return;
                    key = this.getAttribute("data-key");
                    color = this.getAttribute("data-color");
                    if (in_hand != null) {
                        if (this.id == in_hand) {
                            playSound("click");
                            this.setAttribute('material', 'color: ' + color + '; opacity: 1; shader: flat');
                            this.childNodes[0].setAttribute('visible', 'true')
                            this.childNodes[1].setAttribute('visible', 'true')
                            hb.setAttribute("visible", "false");
                            hb.setAttribute("position", "0 -4.8 -0.3");
                            this.setAttribute('material', 'color: ' + color + '; opacity: 1; shader: flat');
                            in_hand = null;
                        }
                        else {
                            playError("Bad place", 0);
                        }
                    }
                    else {
                        playSound("click");
                        in_hand = this.id;
                        this.setAttribute('material', 'color: ' + color + '; opacity: 0.3; shader: flat');
                        this.childNodes[0].setAttribute('visible', 'false')
                        this.childNodes[1].setAttribute('visible', 'false')
                        hb.setAttribute("visible", "true");
                        hb.setAttribute("position", "0 -0.8 -0.3");
                        hbc.setAttribute("depth", 0.790);
                        //depth = largeur
                        //width = depth
                        //height = height
                        hrl = '-20 0 0';
                        hrr = '-20 0 0';
                        if (this.getAttribute('data-width') < 0.5) {
                            hrl = '-20 -15 0';
                            hrr = '-20 15 0';
                        }
                        else if (this.getAttribute('data-width') < 0.7) {
                            hrl = '-20 -8 0';
                            hrr = '-20 8 0';
                        }
                        else if (this.getAttribute('data-width') > 0.95) {
                            hrl = '-20 8 0';
                            hrr = '-20 -8 0';
                        }

                        city = this.getAttribute('data-city')
                        if (!show_airport)
                            city = this.getAttribute('data-text') + " Airport";

                        hl.setAttribute('rotation', hrl);
                        hr.setAttribute('rotation', hrr);
                        hbc.setAttribute("height", this.getAttribute('data-width')); // LARGEUR
                        hbc.setAttribute("width", this.getAttribute('data-depth')); // DEPTH
                        hbc.setAttribute("depth", this.getAttribute('data-height')); // HAUTEUR
                        hbc.setAttribute("color", this.getAttribute('data-color'));
                        hbcity.setAttribute("depth", this.getAttribute('data-width'));
                        hbt1.setAttribute("text", "anchor:align;width:3.3;color:white;value:" + this.getAttribute('data-text') + ";align:center;shader:flat");
                        hbt2.setAttribute("text", "anchor:align;width:3.3;color:white;value:" + this.getAttribute('data-numb') + ";align:center;shader:flat");
                        hbcityt.setAttribute("text", "width: 1.5; color: black; value: " + city + "; align: center");
                    }
                });
                //END CLICK
                box_id++;
                h.appendChild(eb);
            }
            e.appendChild(h);
        }


        if (document.getElementById("etageres")) {
            document.getElementById("etageres").appendChild(e);
        }
    }

}

function playError(text, points) {
    score -= points;
    updateScore();
    playSound('error');
    document.getElementById("error_text").setAttribute('text', 'anchor:align;width:2.8;color:white;value:' + text + ';align:center;shader:flat');
    document.getElementById("error").setAttribute('visible', 'true');
    setTimeout(() => {
        document.getElementById("error").setAttribute('visible', 'false');
    }, 800);

}

function randArray(myArray) {
    return Math.floor(Math.random() * myArray.length);
}
function randArrayItem(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
function randAirport() {

    let random_airport = Math.floor(Math.random() * 3);
    let random_airport_index;
    let country;
    if (random_airport == 0) {
        country = 'france';
    }
    if (random_airport == 1) {
        country = 'germany';
    }
    if (random_airport == 2) {
        country = 'italy';
    }
    random_airport_index = Math.floor(Math.random() * airports[country].length);

    return {
        country: country,
        code: airports[country][random_airport_index].code,
        title: airports[country][random_airport_index].title,
        city: airports[country][random_airport_index].city
    }
}
function randLetter() {
    return Math.random().toString(36).replace(/[0-9]/g, '').slice(1, 4).toUpperCase()
}

function updateScore() {
    document.getElementById('score').setAttribute("text", "anchor:align;width:1.2;color:white;value:Score : " + score + ";align:center;shader:flat");
}
function updateLevel() {
    document.getElementById('level').setAttribute("text", "anchor:align;width:1.2;color:white;value:Level " + level + ";align:center;shader:flat");
}
function validOrder(box_id) {
    element = document.getElementById(box_id);
    key = element.getAttribute('data-key');
    nb_order_completed++;
    playSound("success");
    score += 20;
    updateScore();

    document.getElementById("order_" + key).childNodes[0].setAttribute("color", "dimgray");
    list = document.getElementById("view_orders_list");
    left = -0.3 * (nb_order_completed);
    list.setAttribute("position", left + " 0 0");
    if (nb_order_completed == nb_orders) {
        timer_element = document.getElementById("timer");
        clearInterval(timer_interval);
        timer_element.setAttribute('visible', 'false');
        finishScreen();
    }
}

function start() {
    orders = [];
    boxs = [];
    boxs_left = [];
    in_hand = null;
    nb_order_completed = 0;
    score = 0;
    updateScore();
    updateLevel();
    updateBoxs();

    document.getElementById('menu').setAttribute('visible', 'false');
    document.getElementById('menu').setAttribute('position', '0 4.75 -0.65');
    document.getElementById('menu_home').setAttribute('visible', 'false');
    document.getElementById('menu_score').setAttribute('visible', 'false');
    document.getElementById('menu_instructions').setAttribute('visible', 'false');

    countdown = default_countdown;
    document.getElementById('view_countdown_text').setAttribute('text', 'anchor:align;width:7;color:black;value:' + countdown + ';align:center;shader:flat');
    document.getElementById('view_countdown').setAttribute('visible', 'true');

    playSound("countdown");
    document.getElementById('camera').setAttribute('wasd-controls', 'acceleration: 180');
    interval_countdown = setInterval(() => {

        countdown--;
        document.getElementById('view_countdown_text').setAttribute('text', 'anchor:align;width:7;color:black;value:' + countdown + ';align:center;shader:flat');

        if (countdown <= 0) {
            playSound("launch");
            clearInterval(interval_countdown);
            document.getElementById('view_countdown').setAttribute('visible', 'false');
            countdown = null;
            launch();
        }
        else {
            playSound("countdown");
        }
    }, 1000);
}
function launch() {
    nb_orders = 0 + (4 * level);
    boxs_left = JSON.parse(JSON.stringify(boxs));
    for (let i = 0; i < nb_orders; i++) {
        addOrder();
    }
    timer_countdown = timer;
    timer_interval = setInterval(() => {
        timer_countdown--;
        width = 0.285 * (timer_countdown / timer);
        left = (width / 2) - 0.1425;
        timer_element = document.getElementById("timer");
        timer_element.setAttribute("position", left + " -0.002 0.002")
        timer_element.setAttribute("width", width);
        timer_element.setAttribute('visible', 'true');
        if (timer_countdown == 0) {
            playError("finished", 0);
            clearInterval(timer_interval);
            timer_element.setAttribute('visible', 'false');
            finishScreen()
        }
    }, 1000)
}

function finishScreen() {

    document.getElementById('view_orders_list').innerHTML = "";
    document.getElementById('view_orders_list').setAttribute('position', '0 0 0');
    document.getElementById("menu").setAttribute('visible', 'true');
    document.getElementById('menu').setAttribute('position', '0 1.75 -0.65');
    document.getElementById("menu_score").setAttribute('visible', 'true');
    document.getElementById("menu_score").setAttribute('position', '0 0 0.05');
    elements = ["menu_score_level", "menu_score_score", "menu_score_timer"];

    title = timer_countdown > 0 ? 'ORDERS COMPLETED !' : (nb_orders - nb_order_completed) + ' ORDERS LEFT !';
    document.getElementById("menu_score_title").setAttribute("text", "anchor:align;width:2.5;color:white;value:" + title + ";align:center;shader:flat")
    for (let element of elements) {
        text = (element == "menu_score_level" ? "Level : " + level : (element == "menu_score_score" ? "Score : " + score : (timer_countdown > 0 ? "Time : " + (timer - timer_countdown) + "/120 sec" : nb_order_completed + "/" + nb_orders + " orders")));
        document.getElementById(element).setAttribute("text", "anchor:align;lineHeight: 40; wrapCount: 30; width:1.3;color:white;value:" + text + ";align:center;shader:flat")
    }

    text = timer_countdown > 0 ? 'Next level ->' : '<- Retry';
    document.getElementById('menu_score_button').setAttribute('text', 'anchor:align;width:2.1;color:white;value:' + text + ';align:center;shader:flat');

    let rotation = document.getElementById('camera').getAttribute('rotation');
    document.getElementById('camera').setAttribute('position', '0 1.52 0');
    document.getElementById('camera').removeAttribute('wasd-controls');
    document.getElementById('rig').setAttribute('rotation', '0 ' + (rotation.y * -1) + ' 0');
}
function addOrder() {
    random_index = randArray(boxs_left);
    box = boxs_left[random_index];
    boxs_left.splice(random_index, 1);
    left = orders.length > 0 ? 0.3 * orders.length : 0;
    oe = document.createElement('a-entity');
    oe.setAttribute('position', left + ' -0.152 0');
    oe.setAttribute('id', "order_" + box.key);
    ob = createObject('a-box', 0.2, 0.150, 0.01, null, null, null, "black");
    obt1 = createText("a-text", "anchor:align;width:1.2;color:white;value:" + box.text + ";align:center;shader:flat", "0 0.03 0.007", null, null);
    obt2 = createText("a-text", "anchor:align;width:1.2;color:white;value:" + box.numb + ";align:center;shader:flat", "0 -0.035 0.007", null, null);

    ob.appendChild(obt1);
    ob.appendChild(obt2);
    oe.appendChild(ob);
    document.getElementById('view_orders_list').appendChild(oe);

    orders.push(box);
}



function init() {
    createEtageres();
    updateBoxs();
    if (document.monetization) {

        document.monetization.addEventListener('monetizationstart', function () {
            if (document.monetization && document.monetization.state === 'started') {
                timer += 20;
                document.getElementById("coil_text").setAttribute("text", "anchor:align;width:1;color:black;value:Coil subscriber : + 20sec;align:center;shader:flat");
            }
        });
    }
}

AFRAME.registerComponent('audio-listener', {
    init: function () {
        this.el.addEventListener('click', () => {
            playSound("click");
            sound_on = !sound_on;
            text = "Sounds ON";
            if (!sound_on)
                text = "Sounds OFF";

            document.getElementById("sound_on").setAttribute("text", "anchor:align;width:1.1;color:white;value:" + text + ";align:center;shader:flat")
        });
    }
})
AFRAME.registerComponent('options-listener', {
    init: function () {
        this.el.addEventListener('click', () => {
            playSound("click");
            show_airport = !show_airport;
            text = "Show Airport City";
            if (!show_airport)
                text = "Hide Airport City";

            document.getElementById("show_airport").setAttribute("text", "anchor:align;width:1.1;color:white;value:" + text + ";align:center;shader:flat")
        });
    }
})

// Audio

var sounds = {}

function addSound(key, settings) {
    var count = 2
    sounds[key] = {
        tick: 0,
        count,
        pools: []
    }
    for (var i = 0; i < count; i++) {
        var audio = new Audio()
        audio.src = jsfxr(settings)
        sounds[key].pools.push(audio)
    }
}

function playSound(key) {
    try {
        if (!sound_on)
            return;

        data = sounds[key];
        data.pools[data.tick].play();
        data.tick = (data.tick + 1) % 2;
    }
    catch (e) {
        console.error('sound error', e);
    }
}

addSound('success', [0, , 0.0305, 0.4912, 0.2806, 0.4048, , , , , , 0.5548, 0.6526, , , , , , 1, , , , , 0.5])
addSound('error', [2, 0.0251, 0.3694, 0.5961, 0.5022, 0.5, , -0.321, , -0.2269, -0.715, -0.1264, -0.4872, 0.2066, -0.8327, , 0.9355, 0.0208, 0.7116, 0.0024, -0.6348, 0.0139, -0.0062, 0.5])
addSound('click', [1, , 0.1524, , 0.0633, 0.5273, , , , , , , , , , , , , 1, , , 0.1, , 0.5])
addSound('countdown', [0, , 0.0642, 0.4522, 0.2075, 0.6923, , , , , , , , , , , , , 1, , , , , 0.5])
addSound('launch', [0, , 0.0169, 0.5534, 0.3706, 0.6179, , , , , , 0.4216, 0.5089, , , , , , 1, , , , , 0.5])