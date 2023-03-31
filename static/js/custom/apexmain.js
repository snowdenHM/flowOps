/* Static Chart */
function storage(idName, series, height) {
    var storage = {
        chart: {
            height: height,
            type: "radialBar"
        },

        series: series,

        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 15,
                    size: "70%",
                },

                dataLabels: {
                    showOn: "always",
                    style: {
                        fontFamily: 'Jost, sans-serif',
                    },
                    name: {
                        show: false,
                    },
                    value: {
                        color: "currentColor",
                        fontSize: "45px",
                        fontWeight: "600",
                        offsetY: 20,
                        show: true,
                        formatter: function (val) {
                            return val + '%'
                        }
                    },
                    track: {
                        background: "rgba(130,49,211, .10)",
                    },
                }
            }
        },

        colors: ["currentColor"],
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "horizontal",
                gradientToColors: ["currentColor"],
                stops: [0, 100]
            }
        },

        grid: {
            padding: {
                top: -23,
                bottom: -16,
            }
        },

        stroke: {
            lineCap: "round",
        },
    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), storage).render();
    }
}
storage('.storage', [90], 271);

/* Apex Page */
storage('.storage2', [90], 310);

/* Pie Chart */
function pieChart(idName, series, width, height = "270") {
    var optionsPie = {
        series: series,
        labels: ['Facebook', 'Twitter', 'Google'],
        colors: ['#8231D3', '#00AAFF', '#5840FF'],
        chart: {
            type: 'pie',
            group: 'social',
            width: width,
            height: 270,
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '15px',
            fontFamily: 'Jost, sans-serif',
            fontWeight: 400,
            labels: {
                colors: '#525768',
            },
            markers: {
                width: 7,
                height: 7,
                radius: 20,
                offsetX: -4,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 10,
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    minAngleToShowLabel: undefined
                },
            }
        },
        responsive: [{
            breakpoint: 1399,
            options: {
                chart: {
                    width: "100%"
                },

            }
        }]
    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionsPie).render();
    }
}

pieChart('.apexPieToday', [20, 20, 60], '100%', 270);

/* Donut Chart */
function DonutChart(idName, series, width, height, label, colors, size) {
    var optionsPie = {
        series: series,
        labels: label,
        colors: colors,
        chart: {
            type: 'donut',
            group: 'social',
            width: width,
            height: height,
        },
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    minAngleToShowLabel: undefined
                },
                donut: {
                    size: size,
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontFamily: 'Jost, sans-serif',
                            color: '#404040',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '30px',
                            fontFamily: 'Jost, sans-serif',
                            color: "black",
                            fontWeight: "bold",
                            offsetY: 10,
                            formatter: function (val) {
                                return +val + "K"
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#404040',
                            fontFamily: 'Jost, sans-serif',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            },
        },
        responsive: [{
            breakpoint: 1399,
            options: {
                chart: {
                    width: "100%"
                },

            }
        }]
    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionsPie).render();
    }
}

DonutChart('.salesDonutToday', [30, 30, 40], '100%', 243, ['Revenue', 'Sales', 'Products'], ['#8231D3', '#00AAFF', '#FA8B0C'], "60%");
DonutChart('.salesDonutWeek', [30, 40, 30], '100%', 243, ['Revenue', 'Sales', 'Products'], ['#8231D3', '#00AAFF', '#FA8B0C'], "60%");
DonutChart('.salesDonutMonth', [40, 30, 30], '100%', 243, ['Revenue', 'Sales', 'Products'], ['#8231D3', '#00AAFF', '#FA8B0C'], "60%");
DonutChart('.performance_overview', [30, 30, 40], '100%', 225, ['Target', 'In Progress', 'Completed'], ['#8231D3', '#00AAFF', '#FA8B0C'], "80%");

/* Radial Chart */
function radialChart(idName, series, width, height = "270") {
    var optionRadial = {
        series: series,
        colors: ['#8231D3', '#00AAFF', '#FA8B0C'],
        chart: {
            width: width,
            height: height,
            type: 'radialBar',
            sparkline: {
                enabled: true
            }
        },
        legend: {
            show: false
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '28%'
                },
                track: {
                    show: true,
                    margin: 11
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: 20
                    },
                    value: {
                        fontSize: '24px',
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 600,
                        offsetY: -21
                    },
                    total: {
                        show: true,
                        label: 'Completed',
                        fontSize: '16px',
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 400,
                        color: '#404040',
                        formatter: function (w) {
                            return '60%';
                        }
                    }
                }
            }
        },
        stroke: {
            lineCap: 'round'
        },
        grid: {
            padding: {
                to: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        labels: ['Target', 'Completed', 'In Progress'],
    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionRadial).render();
    }
}

radialChart('.performanceDetails', [90, 80, 70], '100%', 280);


/* Apex Page */

//basics bar
function barChart(idName, width, height = "270") {
    var optionRadial = {
        series: [{
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }],
        colors: ['#8231D3'],
        chart: {
            width: width,
            height: height,
            type: 'bar',
        },
        legend: {
            show: false
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ["Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
            ],
        }

    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionRadial).render();
    }
}
barChart('.barChart', '100%', 280);

//group bar
function groupBarChart(idName, width, height = "270") {
    var optionRadial = {
        series: [{
            data: [44, 55, 41, 64, 22, 43, 21]
        }, {
            data: [53, 32, 33, 52, 13, 44, 32]
        }],
        colors: ['#8231D3', '#00AAFF'],
        chart: {
            width: width,
            height: height,
            type: 'bar',
        },
        legend: {
            show: false
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },

    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionRadial).render();
    }
}
groupBarChart('.GroupedBarChart', '100%', 280);

//area bar
function areaChart(idName, width, height = "270") {
    var optionRadial = {
        series: [{
            data: [44, 55, 41, 64, 22, 43, 21]
        }],
        colors: ['#8231D3', '#00AAFF'],
        chart: {
            width: width,
            height: height,
            type: 'area',
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },

    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionRadial).render();
    }
}
areaChart('.areaChartBasic', '100%', 267);