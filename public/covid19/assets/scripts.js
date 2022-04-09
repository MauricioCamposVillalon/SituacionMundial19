
$(() => {
    /* funcion para consumir el end point con los paises */
    const url = "http://localhost:3000/api/total";
    const getData = async (pais) => {
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data.data);
        cargarGraficoTotal(data.data); /* Aqui se realiza la llamada del primer grafico*/
        cargarTabla(data.data);

    }

    /* funcion para llamar los enpoint de los paises para modal */
    const llamadaPais = async (urlPais) => {
        const response = await fetch(urlPais);
        const data = await response.json();
        graficoModal(data.data);

    }

    const cargarGraficoTotal = (casosCovid) => {

        const casosFiltrados = casosCovid.filter((item) => item.deaths >= 100000)
        let confirmados = [];
        let fallecidos = [];
        //traspaso de casos sobre 10000 en arreglos
        casosFiltrados.forEach(element => {
            confirmados.push({ label: element.location, y: element.confirmed })
            fallecidos.push({ label: element.location, y: element.deaths })
        });
        let chart = new CanvasJS.Chart("grafico1", { /* Aqui comienza el grafico de barra */
            exportEnabled: true,
            animationEnabled: true,
            theme: "dark1",
            title: {
                text: "Paises con covid 19",
                fontSize: 30,
                fontFamily: "Optima",
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                bevelEnabled: true,
                type: "column",
                color: "blue",
                name: "Casos confirmados",
                legendText: "Casos Activos",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                dataPoints: confirmados
            },
            {
                bevelEnabled: true,
                type: "column",
                color: "red",
                name: "Casos Fallecidos",
                legendText: "Casos Muertos",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                dataPoints: fallecidos
            }]
        });                 /* Fin del  grafico de barra */
        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    }

    //FUNCIÓN QUE PERMITE CARGAR LAS FILAS A LA TABLA
    const cargarTabla = (datos) => {
        let cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ''


        let dataTabla = '';
        // RECORREMOS Y ACUMULAMOS FILAS EN UNA VARIABLE PARA POSTERIORMENTE INYECTARLAS EN EL TBODY
        datos.forEach((pais, index) => {
            dataTabla += `
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td>${pais.location}</td>
                            <td>${pais.confirmed}</td>
                            <td>${pais.deaths}</td>
                            <td><button type='button' class='btn btn-primary' onClick='modalGrafico("${pais.location}")'>Ver detalle</button></td>
                        </tr>
                `
        })

        cuerpoTabla.innerHTML = dataTabla;

    }
    // llamo al modal desde Aqui
    window.modalGrafico = (indice) => {
        const url = 'http://localhost:3000/api/countries/' + indice
        llamadaPais(url);

        $("#modalDetalle").modal("toggle");


    }

    /* Funcion del grafico del Modal */
    const graficoModal = (data) => {
        var chart = new CanvasJS.Chart("graficoDetalle", {
            theme: "dark1", // "light2", "dark1", "dark2"
            animationEnabled: false, // change to true		
            title: {
                text: `Informacion Covid ${data.location}`
            },
            legend: {
                maxWidth: 350,
                itemWidth: 120
            },
            data: [
                {
                    indexLabelPlacement: "outside",
                    explodeOnClick: true,
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} - #percent %",
                    yValueFormatString: "##,###,###.## Personas",
                    legendText: "{indexLabel}",
                    dataPoints: [
                        { y: data.confirmed, indexLabel: "Contagios" },
                        { y: data.deaths, indexLabel: "Muertes" }
                    ]
                }
            ]
        });
        chart.render();
    }




    getData();


})



const tabla = document.querySelector('#btnTabla');
const grafico = document.querySelector('#btnGrafico');

tabla.addEventListener("click", () => {
    //e.preventDefault();
    toggleFormAndTable('grafico', 'tabla-datos');

});

grafico.addEventListener("click", () => {
    //e.preventDefault();
    toggleFormAndTable('grafico', 'tabla-datos');

});

const toggleFormAndTable = (form, table) => {
    $(`#${form}`).toggle()
    $(`#${table}`).toggle()


}

