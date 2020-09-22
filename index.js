let selectedObject;
let rows = [];
let storeText;
let rect;
let selectedShopID = null;
let selectedPolygon = null;

//////////////////////////////////////

/////////////////////////////////////////
document.getElementById("showAlert").checked = true;

document.getElementById("floor").value = 1;

document.getElementById("plot").addEventListener("click", () => {
    const floor = parseInt(document.getElementById("floor").value);
    mainStuff(floor);
});

document.getElementById("addCampaign").addEventListener("click", () => {
    const tempArray = [
        selectedObject[0],
        selectedObject[1],
        selectedObject[4],
        selectedObject[3],
    ];
    rows.push(tempArray);

    if (document.getElementById("showAlert").checked) {
        alert(
            rows.map((array) => array[2]).join("\n") +
                `\n---------------------\ntotal of ${rows.length} campaigns`
        );
    }
});

document.getElementById("download").addEventListener("click", () => {
    // let csvContent = "data:text/csv;charset=utf-8,";
    /* let csvContent = "data:text/csv;charset=windows-1254,";

    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv". */
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Campaigns",
    };
    wb.SheetNames.push("Test Sheet");
    var ws_data = rows;
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Test Sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf); //create uint8array as viewer
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
    }
    saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "campaigns.xlsx"
    );
});

function mainStuff(selectedFloor) {
    const data = allData;
    const floor = parseInt(document.getElementById("floor").value);
    /* const venueID = parseInt(document.getElementById("venueID").value); */
    let venueID;
    const plotBox = document.getElementById("plotBox");
    plotBox.innerHTML = "";
    // Rest everything
    selectedObject = null;
    storeText = null;
    rect = null;
    selectedShopID = null;
    selectedPolygon = null;
    const clickedInfo = document.getElementById("clickedInfo");
    clickedInfo.innerHTML = "";
    const clickedH = document.createElement("H1"); // Create the H1 element
    const clickedT = document.createTextNode(`Clicked: -`); // Create a text element
    clickedH.appendChild(clickedT); // Append the text node to the H1 element
    clickedInfo.appendChild(clickedH);
    const image = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
    );
    image.setAttribute("id", "floorplan");
    // <image id="floorplan" href="" />

    venueID = data[1][0];
    image.setAttribute(
        "href",
        `https://malliq-static.s3.eu-central-1.amazonaws.com/generic/mall/f${floor}_${venueID}.png`
    );
    plotBox.appendChild(image);
    /*             console.log(data);
            console.log(data[1]);
            console.log(JSON.parse(data[1][10]).coordinates[0]); */
    // console.log(data[0]);
    plotBox.style.cursor = "move";

    function getMeta(url) {
        var img = new Image();
        img.addEventListener("load", function () {
            /* alert(this.naturalWidth + " " + this.naturalHeight); */
            plotBox.setAttribute("width", this.naturalWidth);
            plotBox.setAttribute("height", this.naturalHeight);
        });
        img.src = url;
    }
    getMeta(
        `https://malliq-static.s3.eu-central-1.amazonaws.com/generic/mall/f${floor}_${venueID}.png`
    );
    /* console.log(
            document.getElementById("floorplan").getAttribute("height")
        );
        console.log(document.getElementById("floorplan"));
        console.log(document.getElementById("floorplan").getAttribute("width")); */
    /* plotBox.innerHTML = ""; */
    /* document.querySelector("image").href = "/f1_4089.png"; */
    const storeInfoContainer = document.getElementById("storeInfoContainer");
    for (let i = 1; i < data.length; i++) {
        const floor = parseInt(data[i][1]);
        if (floor !== selectedFloor) {
            continue;
        }
        const arrayCoords = JSON.parse(data[i][10]).coordinates[0];
        const polygon = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polygon"
        );
        // add listeners
        polygon.addEventListener("mouseover", (event) => {
            plotBox.style.cursor = "pointer";
            polygon.setAttribute(
                "style",
                `fill: ${
                    selectedShopID === data[i][2] ? "#5be625" : "orange"
                }; stroke: black; stroke-width: 2; fill-opacity: 0.7`
            );
            storeInfoContainer.innerHTML = "";
            const floorH = document.createElement("H1"); // Create the H1 element
            const floorT = document.createTextNode(`Floor: ${data[i][1]}`); // Create a text element
            floorH.appendChild(floorT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(floorH);
            const brandH = document.createElement("H1"); // Create the H1 element
            const brandT = document.createTextNode(`Brand ID: ${data[i][3]}`); // Create a text element
            brandH.appendChild(brandT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(brandH);
            const storeNameH = document.createElement("H1"); // Create the H1 element
            const storeNameT = document.createTextNode(
                `Store Name: ${data[i][4]}`
            ); // Create a text element
            storeNameH.appendChild(storeNameT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(storeNameH);
            /*                    const hoverText = document.createElement("TITLE");
                        const hoverNameT = document.createTextNode(
                            `${data[i][4]}`
                        );
                        hoverText.appendChild(hoverNameT); // Append the text node to the H1 element
                        polygon.appendChild(hoverText); */
            /* x = event.clientX;
                y = event.clientY; */
            /* console.log(data[i][5]); // center X
                console.log(data[i][6]); // center Y */
            storeText = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );
            tempX = Math.min(
                ...JSON.parse(data[i][10]).coordinates[0].map(
                    (twodArray) => twodArray[0]
                )
            );
            tempY = Math.min(
                ...JSON.parse(data[i][10]).coordinates[0].map(
                    (twodArray) => twodArray[1]
                )
            );
            storeText.setAttribute("id", "nameHover");
            /* storeText.setAttribute("x", data[i][5] - 100);
                storeText.setAttribute("y", data[i][6] - 150); */
            storeText.setAttribute("x", tempX);
            storeText.setAttribute("y", tempY - 20);
            storeText.setAttribute("fill", "blue");
            storeText.textContent =
                data[i][4] === "-" ? "#no brand#" : data[i][4];
            plotBox.appendChild(storeText);
            const ctx = plotBox;
            const textElm = ctx.getElementById("nameHover");
            const SVGRect = textElm.getBBox();

            rect = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            );
            rect.setAttribute("x", SVGRect.x);
            rect.setAttribute("y", SVGRect.y);
            rect.setAttribute("width", SVGRect.width);
            rect.setAttribute("height", SVGRect.height);
            rect.setAttribute("fill", "white");
            ctx.insertBefore(rect, textElm);
            /* console.log(document.getElementById("nameHover").textContent);
                document.getElementById("nameHover").textContent = data[i][4];
                document
                    .getElementById("nameHover")
                    .setAttribute("x", data[i][5]);
                document
                    .getElementById("nameHover")
                    .setAttribute("y", data[i][6]); */
            /* console.log(
                    document.getElementById("nameHover").getAttribute("x")
                ); */
        });
        polygon.addEventListener("mouseout", () => {
            plotBox.style.cursor = "move";
            polygon.setAttribute(
                "style",
                `fill: ${
                    selectedShopID === data[i][2] ? "#5be625" : "#fc9b31"
                }; stroke: black; stroke-width: 2; fill-opacity: 0.5`
            );
            storeInfoContainer.innerHTML = "";
            const floorH = document.createElement("H1"); // Create the H1 element
            const floorT = document.createTextNode(`Floor: -`); // Create a text element
            floorH.appendChild(floorT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(floorH);
            const brandH = document.createElement("H1"); // Create the H1 element
            const brandT = document.createTextNode(`Brand ID: -`); // Create a text element
            brandH.appendChild(brandT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(brandH);
            const storeNameH = document.createElement("H1"); // Create the H1 element
            const storeNameT = document.createTextNode(`Store Name: -`); // Create a text element
            storeNameH.appendChild(storeNameT); // Append the text node to the H1 element
            storeInfoContainer.appendChild(storeNameH);

            storeText.parentNode.removeChild(storeText);
            rect.parentNode.removeChild(rect);
        });
        let moved;
        let mouseDown = false;
        let downListener = () => {
            moved = false;
            mouseDown = true;
        };
        polygon.addEventListener("mousedown", downListener);
        let moveListener = () => {
            moved = true;
            if (moved && mouseDown) {
                plotBox.style.cursor = "move";
            }
            // plotBox.style.cursor = "move";
        };
        polygon.addEventListener("mousemove", moveListener);
        let upListener = () => {
            if (!moved) {
                clickedInfo.innerHTML = "";
                const clickedH = document.createElement("H1"); // Create the H1 element
                const clickedT = document.createTextNode(
                    `Clicked: ${data[i][4]}, ${data[i][3]}`
                ); // Create a text element
                clickedH.appendChild(clickedT); // Append the text node to the H1 element
                clickedInfo.appendChild(clickedH);
                selectedObject = data[i];
                selectedShopID = data[i][2];
                if (selectedPolygon) {
                    selectedPolygon.setAttribute(
                        "style",
                        "fill: #fc9b31; stroke: black; stroke-width: 2; fill-opacity: 0.5"
                    );
                }
                selectedPolygon = polygon;
            }
            move = false;
            mouseDown = false;
            plotBox.style.cursor = "pointer";
        };
        polygon.addEventListener("mouseup", upListener);
        /* polygon.addEventListener("click", () => {
                clickedInfo.innerHTML = "";
                const clickedH = document.createElement("H1"); // Create the H1 element
                const clickedT = document.createTextNode(
                    `Clicked: ${data[i][4]}, ${data[i][3]}`
                ); // Create a text element
                clickedH.appendChild(clickedT); // Append the text node to the H1 element
                clickedInfo.appendChild(clickedH);
                selectedObject = data[i];
                selectedShopID = data[i][2];
                if (selectedPolygon) {
                    selectedPolygon.setAttribute(
                        "style",
                        "fill: #fc9b31; stroke: black; stroke-width: 2; fill-opacity: 0.5"
                    );
                }
                selectedPolygon = polygon;
            }); */
        plotBox.appendChild(polygon);
        let pointString = "";
        arrayCoords.forEach((xyArray) => {
            temp = `${xyArray[0]},${xyArray[1]} `;
            pointString = pointString.concat(temp);
        });
        polygon.setAttribute("points", pointString);
        polygon.setAttribute(
            "style",
            `fill: ${
                selectedShopID === data[i][2] ? "#5be625" : "#fc9b31"
            }; stroke: black; stroke-width: 2; fill-opacity: 0.5`
        );
    }

    // just grab a DOM element
    var element = document.querySelector("#plotBox");

    // And pass it to panzoom
    panzoom(element);
}
