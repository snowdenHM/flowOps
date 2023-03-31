/* ======= Custom Tooltip ====== */
const customTooltips = function (context) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.className = "chartjs-tooltip";
        tooltipEl.innerHTML = '<table></table>';
        document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    const tooltipModel = context.tooltip;
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = '<thead>';

        titleLines.forEach(function (title) {
            innerHtml += `<div class='tooltip-title'>${title}</div>`;
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function (body, i) {
            const colors = tooltipModel.labelColors[i];
            let style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            style += "; border-radius: 30px";
            const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
            innerHtml += `<tr><td>${span}${body}</td></tr>`;
        });
        innerHtml += '</tbody>';

        let tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    const toolTip = document.querySelector('.chartjs-tooltip');
    const position = context.chart.canvas.getBoundingClientRect();
    const toolTipHeight = toolTip.clientHeight;
    const rtl = document.querySelector('html[dir="rtl"]');


    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX - (rtl !== null ? toolTip.clientWidth : 0)}px`;
    tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY-(tooltipModel.caretY > 10 ? (toolTipHeight > 100 ? toolTipHeight + 5 : toolTipHeight + 15) : 70)}px`;
    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}

const chartLinearGradient = (canvas, height, color) => {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color.start}`);
    gradient.addColorStop(1, `${color.end}`);
    return gradient;
};

/* Index Page */
/* ======= Line chart ======= */
function chartjsAreaChart(selector, height, labelName1, labelName2) {
    let delayed;
    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart, legend, options) {
            const fitValue = chart.legend.fit;
            chart.legend.fit = function fit() {
                fitValue.bind(chart.legend)();
                return this.height += 24;
            }
        }
    };
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                datasets: [{
                        data: [10, 55, 42, 30, 42, 80, 35, 10, 53, 62, 45, 78],
                        borderColor: "#7811FF",
                        label: labelName1,
                        borderWidth: 2.50,
                        fill: false,
                        backgroundColor: "#7811FF",
                        hoverBackgroundColor: "#7811FF",
                        tension: 0.4,
                        pointHoverBorderColor: 'white',
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHitRadius: 30,
                        pointStyle: 'circle',
                        pointHoverBorderWidth: 2,
                    },
                    {
                        data: [30, 45, 35, 10, 5, 60, 8, 42, 30, 70, 54, 25],
                        borderColor: "#00AAFF",
                        label: labelName2,
                        borderWidth: 2.50,
                        fill: false,
                        backgroundColor: "#00AAFF",
                        hoverBackgroundColor: "#00AAFF",
                        tension: 0.4,
                        pointHoverBorderColor: 'white',
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHitRadius: 30,
                        pointStyle: 'circle',
                        pointHoverBorderWidth: 2,
                    },
                ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "top",
                        align: "center",
                        labels: {
                            usePointStyle: true,
                            color: '#747474',
                            textAlign: 'center',
                            boxWidth: 20,
                            boxHeight: 4,
                            maxHeight: 100,
                            pointStyleWidth: 6,
                            padding: 25,
                            font: {
                                size: 16,
                                weight: 400,
                                family: "'Jost', sans-serif",
                            },
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}K</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: false,
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}K`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
            plugins: [legendMargin]
        });
    }
}
chartjsAreaChart("salesReports", "105", "Total Order", "Total Sale");

/* ======= Bar chart ======= */
function chartjsBarChart(selector, dataCIn, DataCOut, labels, height, labelName1, labelName2) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 1399 ? (window.innerWidth < 575 ? 250 : 100) : height;
        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                        data: dataCIn,
                        backgroundColor: 'rgba(130, 49, 211, .50)',
                        hoverBackgroundColor: '#7811FF',
                        label: labelName1,
                        barPercentage: 0.45,
                        borderRadius: 2,
                        maxBarThickness: 11,
                        minBarLength: 2,
                        barThickness: 15,
                    },
                    {
                        data: DataCOut,
                        backgroundColor: 'rgba(0, 170, 255, .50)',
                        hoverBackgroundColor: '#00AAFF',
                        label: labelName2,
                        barPercentage: 0.45,
                        borderRadius: 2,
                        maxBarThickness: 11,
                        minBarLength: 2,
                        barThickness: 15,
                    },
                ],
            },

            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    y: {
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}k`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}

chartjsBarChart(
    "salesGrowthToday",
    (data = [35, 55, 25, 60, 42, 80, 35]),
    (data = [10, 30, 8, 30, 22, 38, 45]),
    labels = [
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
    ],
    198,
    "Target",
    "Total Sales"
);


$('#salesgrowth2-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "salesGrowthWeek",
        (data = [12, 34, 76, 23, 48, 34, 78]),
        (data = [34, 25, 34, 8, 45, 65, 18]),
        labels = [
            "1-2",
            "2-3",
            "3-4",
            "4-5",
            "5-6",
            "6-7",
            "7-8",
        ],
        198,
        "Target",
        "Total Sales"
    );
    $('#salesgrowth2-tab').off();
});
$('#salesgrowth3-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "salesGrowthMonth",
        (data = [35, 55, 25, 72, 45, 58, 35, 45, 65, 38, 45, 48]),
        (data = [15, 35, 10, 16, 25, 44, 10, 5, 24, 18, 7, 36]),
        labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        198,
        "Target",
        "Total Sales"
    );
    $('#salesgrowth3-tab').off();
});



/* Demo 5 */
$('#salesgrowth-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "salesGrowthNewToday",
        (data = [35, 55, 25, 60, 42, 80, 35]),
        (data = [10, 30, 8, 30, 22, 38, 45]),
        labels = [
            "Sat",
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
        ],
        105,
        "Target",
        "Total Sales"
    );
    $('#salesgrowth-tab').off();
});


$('#salesgrowth2-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "salesGrowthNewWeek",
        (data = [12, 34, 76, 23, 48, 34, 78]),
        (data = [34, 25, 34, 8, 45, 65, 18]),
        labels = [
            "1-2",
            "2-3",
            "3-4",
            "4-5",
            "5-6",
            "6-7",
            "7-8",
        ],
        105,
        "Target",
        "Total Sales"
    );
    $('#salesgrowth2-tab').off();
});

chartjsBarChart(
    "salesGrowthNewMonth",
    (data = [35, 55, 25, 72, 45, 58, 35, 45, 65, 38, 45, 48]),
    (data = [15, 35, 10, 16, 25, 44, 10, 5, 24, 18, 7, 36]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    105,
    "Target",
    "Total Sales"
);


/* demo 3*/
chartjsBarChart(
    "profitGrowthToday",
    (data = [35, 55, 25, 60, 42, 80, 35]),
    (data = [10, 30, 8, 30, 22, 38, 45]),
    labels = [
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
    ],
    145,
    "Order",
    "Sale"
);

function chartjsLineChart(selector, height, dataCur, labels, labelName, fill) {
    let delayed;
    let primaryColorRGB;
    let primaryColor;
    primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    primaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-primary-rgba'
    );
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 1399 ? (window.innerWidth < 575 ? 200 : 150) : height;
        var charts = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    data: dataCur,
                    borderColor: primaryColor,
                    backgroundColor: () =>
                        chartLinearGradient(document.getElementById(selector), 300, {
                            start: `rgba(${primaryColorRGB},0.5)`,
                            end: 'rgba(255,255,255,0.05)'
                        }),
                    fill: fill,
                    label: labelName,
                    tension: 0.4,
                    borderWidth: 3,
                    hoverRadius: '6',
                    pointBackgroundColor: primaryColor,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHitRadius: 30,
                    pointStyle: 'circle',
                    pointHoverBorderWidth: 2,

                }, ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    y: {
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}k`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}
/* Demo 2 */
// Total Revenue Chart
chartjsLineChart(
    "saleRevenueToday",
    "113",
    (data = [0, 28, 30, 45, 40, 50, 25, 70, 35, 40, 26, 58]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    "Current period",
    true
);

$('#tl_revenue-week-tab').on("shown.bs.tab", function () {
    chartjsLineChart(
        "saleRevenueWeek",
        "113",
        (data = [40, 30, 35, 20, 25, 40, 35]),
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "Current period",
        true

    );
    $('#tl_revenue-week-tab').off();
});

$('#tl_revenue-month-tab').on("shown.bs.tab", function () {
    chartjsLineChart(
        "saleRevenueMonth",
        "113",
        (data = [20, 36, 25, 50, 40, 55, 40, 75, 35, 40, 35, 58]),
        labels = ['2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '24h'],
        "Current period",
        true
    );
    $('#tl_revenue-month-tab').off();
});


/* demo 3 */
// Total Revenue Chart
chartjsLineChart(
    "earningRevenueToday",
    "113",
    (data = [0, 28, 30, 45, 40, 50, 25, 70, 35, 40, 26, 58]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    "Monthly Earning",
    true
);

$('#tl_revenue-week-tab').on("shown.bs.tab", function () {
    chartjsLineChart(
        "earningRevenueWeek",
        "113",
        (data = [40, 30, 35, 20, 25, 40, 35]),
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "Monthly Earning",
        true

    );
    $('#tl_revenue-week-tab').off();
});

$('#tl_revenue-month-tab').on("shown.bs.tab", function () {
    chartjsLineChart(
        "earningRevenueMonth",
        "113",
        (data = [20, 36, 25, 50, 40, 55, 40, 75, 35, 40, 35, 58]),
        labels = ['2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '24h'],
        "Monthly Earning",
        true
    );
    $('#tl_revenue-month-tab').off();
});

/* Demo 6 */
// Total Sale Chart
chartjsLineChart(
    "totalSaleMonth",
    "196",
    (data = [0, 26, 15, 50, 40, 55, 40, 55, 35, 80]),
    labels = [
        "Jan",
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
    "Current period",
    false
);

chartjsLineChart(
    "totalSaleDay",
    "196",
    labels = [38, 55, 42, 36, 60, 65, 50],
    (data = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]),
    "Current period",
    false
);

chartjsLineChart(
    "totalSaleYear",
    "196",
    (data = [40, 48, 40, 46, 38, 65, 58, 59]),
    labels = [
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021"
    ],
    "Current period",
    false
);



/* chart Page*/
function exampleBarChart(selector, height, indexing) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }],
            },
            options: {
                indexAxis: indexing,
                scales: {
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
            },
        });
    }
}
exampleBarChart("barChartVertical", "105", false);
exampleBarChart("barChartHorizontal", "105", "y");

function exampleBarStackedChart(selector, height, indexing) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                ],
                datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(255, 99, 132)'
                        ],
                        borderWidth: 1
                    }
                ],
            },
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
            },
        });
    }
}
exampleBarStackedChart("barChartStacked", "105", false);

function exampleLineChart(selector, height, indexing) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                ],
                datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(255, 99, 132)'
                        ],
                        borderWidth: 1
                    }
                ],
            },
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
            },
        });
    }
}
exampleLineChart("lineChartBasic", "105", false);

function exampleAreaChart(selector, height, dataCur, labels, labelName, fill) {
    let delayed;
    let primaryColorRGB;
    let primaryColor;
    primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    primaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-primary-rgba'
    );
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    data: dataCur,
                    borderColor: primaryColor,
                    borderWidth: 3,
                    backgroundColor: () =>
                        chartLinearGradient(document.getElementById(selector), 300, {
                            start: `rgba(${primaryColorRGB},0.5)`,
                            end: 'rgba(255,255,255,0.05)'
                        }),
                    fill: fill,
                    label: labelName,
                    tension: 0.4,
                    hoverRadius: '6',
                    pointBackgroundColor: primaryColor,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHitRadius: 30,
                    pointStyle: 'circle',
                    pointHoverBorderWidth: 2,

                }, ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: true,
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
            },
        });
    }
}
exampleAreaChart("areaChartBasic", "105",
    (data = [0, 28, 30, 45, 40, 50, 25, 70, 35, 40, 26, 58]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    "Current period",
    true);

function exampleRadarChart(selector, height) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        var chart = new Chart(ctx, {
            type: "radar",
            data: {
                labels: [
                    'Eating',
                    'Drinking',
                    'Sleeping',
                    'Designing',
                    'Coding',
                    'Cycling',
                    'Running'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [65, 59, 90, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }, {
                    label: 'My Second Dataset',
                    data: [28, 48, 40, 19, 96, 27, 100],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: true,
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
            },
        });
    }
}
exampleRadarChart("radarChart", "250");


/* Social Profile */
function chartJsBarChartSocial(selector, height, bgColor, hBgColor, label) {
    let delayed;
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : height;
        ctx.width = 130;
        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{
                    label: label,
                    data: [20, 60, 50, 45, 50, 60, 70],
                    backgroundColor: bgColor,
                    hoverBackgroundColor: hBgColor,
                    barPercentage: 1,
                }, ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    y: {
                        display: false,
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}k`;
                            },
                        },
                    },
                    x: {
                        display: false,
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}

chartJsBarChartSocial("mychart8", "105", "#8231D320", "#8231D3", "Order");
chartJsBarChartSocial("mychart9", "105", "#5840FF20", "#5840FF", "Revenue");
chartJsBarChartSocial("mychart10", "105", "#01B81A20", "#01B81A", "Avg. Order");
chartJsBarChartSocial("mychart11", "105", "#FA8B0C20", "#FA8B0C", "Avg. Order");


function chartjsLineChartProfile(selector, bcolor = "#FA8B0C", height = "95", dataCur, dataPrev, labels) {
    var ctxs = document.getElementById(selector);
    let delayed;
    if (ctxs) {
        ctxs.getContext("2d");
        ctxs.height = window.innerWidth <= 575 ? 190 : height;
        var charts = new Chart(ctxs, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                        data: dataCur,
                        borderColor: "#8231D3",
                        borderWidth: 4,
                        fill: true,
                        backgroundColor: () =>
                            chartLinearGradient(ctxs, 400, {
                                start: "#8231D330",
                                end: "#ffffff05",
                            }),
                        label: "Current period",
                        pointStyle: "circle",
                        pointRadius: "0",
                        hoverRadius: "9",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "#8231D3",
                        hoverBorderWidth: 5,
                        tension: 0.4,
                    },
                    {
                        data: dataPrev,
                        borderColor: "#C6D0DC",
                        borderWidth: 2,
                        fill: false,
                        backgroundColor: "#00173750",
                        label: "Previous period",
                        borderDash: [3, 3],
                        pointRadius: "0",
                        hoverRadius: "0",
                        tension: 0.4,
                    },
                ],
            },
            options: {
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                scales: {
                    y: {
                        stacked: false,
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}k`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}
chartjsLineChartProfile(
    "profile-chart",
    (bcolor = "#FA8B0C"),
    (height = "250"),
    (data = [65, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 65]),
    (data = [45, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 55]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
);
chartjsLineChartProfile(
    "myChart6",
    "#FA8B0C",
    "95",
    (data = [65, 35, 45, 42, 65, 60, 42, 45, 35, 55, 40, 65]),
    (data = [45, 20, 35, 32, 50, 45, 32, 35, 25, 40, 30, 55]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]
);

$('#tl_revenue-month-tab').on("shown.bs.tab", function () {
    chartjsLineChartProfile(
        "myChart6M",
        "#FA8B0C",
        "95",
        (data = [55, 25, 45, 42, 40, 45, 42, 45, 35, 55, 40, 30]),
        (data = [45, 30, 35, 32, 35, 50, 32, 35, 25, 40, 30, 25]),
        labels = ["1-5", "6-10", "11-15", "16-20", "21-25", "26-30"]
    );
    $('#tl_revenue-month-tab').off();
});

$('#tl_revenue-week-tab').on("shown.bs.tab", function () {
    chartjsLineChartProfile(
        "myChart6W",
        "#FA8B0C",
        "95",
        (data = [55, 25, 45, 42, 40, 45, 42, 45, 35, 55, 40, 30]),
        (data = [45, 30, 35, 32, 35, 50, 32, 35, 25, 40, 30, 25]),
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    );
    $('#tl_revenue-week-tab').off();
});

chartjsBarChart(
    "ys_barChartOne",
    (data = [35, 55, 25, 60, 42, 80, 35]),
    (data = [10, 30, 8, 30, 22, 38, 45]),
    labels = [
        "Sat",
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
    ],
    198,
    "Target",
    "Total Sales"
);
$('#ys_month-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "ys_barChartTwo",
        dataG = (data = [20, 30, 15, 60, 70, 24]),
        dataL = (data = [70, 60, 40, 20, 15, 65]),
        labels = ["1-5", "6-10", "11-15", "15-20", "21-25", "25-30"],
        198,
        "Target",
        "Total Sales"
    );
    $('#ys_month-tab').off();
});

$('#ys_year-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "ys_barChartThree",
        dataG = (data = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30]),
        dataL = (data = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20]),
        labels = ["Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        198,
        "Target",
        "Total Sales"
    );
    $('#ys_year-tab').off();
});



function chartjsLineChartTwo(selector, height, data) {
    var ctxs = document.getElementById(selector);
    let delayed;
    if (ctxs) {
        ctxs.getContext("2d");
        ctxs.height = window.innerWidth <= 575 ? 190 : height;
        var charts = new Chart(ctxs, {
            type: "line",
            data: {
                labels: [
                    "Jan",
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
                datasets: [{
                    data: data,
                    borderColor: "#C6D0DC",
                    borderWidth: 2,
                    fill: false,
                    pointHoverBackgroundColor: "#20C997",
                    pointHoverRadius: 6,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: [
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "transparent",
                        "#20C997",
                    ],
                }, ],
            },
            options: {
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: 10,
                        top: 0,
                        bottom: 0,
                    },
                },
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    },
                },
            },
        });
    }
}

chartjsLineChartTwo(
    "lineChartSharpOne",
    55,
    (data = [0, 10, 25, 28, 22, 15, 18, 22, 20, 15, 17, 25, ])
);
chartjsLineChartTwo(
    "lineChartSharpTwo",
    55,
    (data = [0, 25, 28, 22, 15, 18, 22, 20, 15, 17, 25, 30])
);

chartjsLineChartTwo(
    "lineChartSharpThree",
    55,
    (data = [0, 15, 10, 18, 20, 15, 10, 7, 15, 8, 10, 30])
);

chartjsLineChartTwo(
    "lineChartSharpFour",
    55,
    (data = [5, 10, 8, 10, 7, 10, 15, 20, 12, 17, 15, 10])
);

chartjsLineChartTwo(
    "lineChartSharpFive",
    55,
    (data = [0, 10, 0, 15, 0, 18, 0, 10, 12, 18, 25, 30])
);

chartjsBarChart(
    "barChartCashflow",
    (data = [35, 55, 25, 72, 45, 58, 35, 45, 65, 38, 45, 48]),
    (data = [15, 35, 10, 16, 25, 44, 10, 5, 24, 18, 7, 36]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    103,
    "Target",
    "Total Sales"
);


$('#t_revenue-week-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "barChartCashflow_W",
        (data = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30]),
        (data = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20]),
        labels = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ],
        103,
        "Target",
        "Total Sales"
    );
    $('#t_revenue-week-tab').off();
});

$('#t_revenue-month-tab').on("shown.bs.tab", function () {
    chartjsBarChart(
        "barChartCashflow_M",
        (data = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30]),
        (data = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20]),
        labels = [
            "1-5",
            "6-10",
            "11-15",
            "16-20",
            "21-25",
            "26-30",
        ],
        103,
        "Target",
        "Total Sales"
    );
    $('#t_revenue-month-tab').off();
});

function chartjsLineChartAccount(selector, bcolor = "#FA8B0C") {
    var ctxs = document.getElementById(selector);
    let delayed;
    if (ctxs) {
        ctxs.getContext("2d");
        ctxs.height = window.innerWidth <= 575 ? 200 : 100;
        var charts = new Chart(ctxs, {
            type: "line",
            data: {
                labels: ["Current", "1-30", "30-60", "60-90", "90"],
                datasets: [{
                    label: 'My First Dataset',
                    data: [105, 145, 95, 149, 90],
                    fill: false,
                    tension: 0.4,
                    borderColor: bcolor,
                    pointBackgroundColor: bcolor,
                    borderWidth: 2,
                }, ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                    y: {
                        display: true,
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}K`;
                            },
                        },
                    }
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
            },
        });
    }
}
chartjsLineChartAccount("lineChartAccountReceive");
chartjsLineChartAccount("lineChartAccountPayable", (bcolor = "#2C99FF"));

function chartjsLineChartOne(
    selector,
    label,
    bgColor = "#20C99710",
    bColor = "#20C997",
    data = [5, 10, 20, 25, 20, 30, 15, 25, 15, 10]
) {
    var ctx = document.querySelectorAll(selector);
    if (ctx) {
        ctx.forEach(function (elm, id) {
            elm.getContext("2d");
            elm.height = 115;
            var chart = new Chart(elm, {
                type: "line",
                data: {
                    labels: ["0", "4", "8", "12", "16", "20", "24"],
                    datasets: [{
                        label: label,
                        backgroundColor: bgColor,
                        borderColor: bColor,
                        data: data,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        hoverRadius: '6',
                        pointBackgroundColor: bgColor,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: bgColor,
                        pointHitRadius: 30,
                        pointStyle: 'circle',
                        pointHoverBorderWidth: 2,
                    }, ],
                },
                options: {
                    maintainAspectRatio: true,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                            position: "bottom",
                            align: "start",
                            labels: {
                                boxWidth: 6,
                                display: true,
                                usePointStyle: true,
                            },
                        },
                        tooltip: {
                            usePointStyle: true,
                            enabled: false,
                            external: customTooltips,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat().format(context.parsed.y);
                                    }
                                    return `<span class="data-label">${label}k</span>`;
                                }
                            },
                        },
                    },
                    layout: {
                        padding: {
                            left: -13,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        },
                    },
                    elements: {
                        point: {
                            radius: 0,
                        },
                    },
                    scales: {
                        y: {
                            display: false,
                            grid: {
                                display: false,
                                color: "#485e9029",
                            },
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10,
                                display: false,
                                stepSize: 20,
                            },
                        },
                        x: {
                            display: false,
                            grid: {
                                display: false,
                            },

                            ticks: {
                                beginAtZero: true,
                                fontSize: 11,
                                display: false,
                            },
                        },
                    },
                },
            });
        });
    }
}
chartjsLineChartOne(
    "#lineChartOne",
    (label = "label"),
    (bgColor = "#20C99710"),
    (bColor = "#20C997"),
    (data = [150, 100, 200, 250, 200, 300, 150])
);

chartjsLineChartOne(
    "#lineChartTwo",
    (label = "Label"),
    (bgColor = "#E34A8710"),
    (bColor = "#FF69A5"),
    (data = [200, 150, 200, 250, 100, 200, 150])
);

chartjsLineChartOne(
    "#lineChartThree",
    (label = "Label"),
    (bgColor = "#0D79DF10"),
    (bColor = "#5F63F2"),
    (data = [150, 100, 200, 250, 200, 300, 150])
);

chartjsLineChartOne(
    "#lineChartFour",
    (label = "Label"),
    (bgColor = "#D4740710"),
    (bColor = "#FA8B0C"),
    (data = [200, 150, 200, 250, 100, 200, 150])
);

$('#f_week-tab').on("shown.bs.tab", function () {
    fOverviewWeek();
    $('#f_week-tab').off();
});

$('#f_month-tab').on("shown.bs.tab", function () {
    fOverviewMonth();
    $('#f_month-tab').off();
});

$('#f_year-tab').on("shown.bs.tab", function () {
    fOverviewYear();
    $('#f_year-tab').off();
});

function fOverviewWeek() {
    chartjsLineChartOne(
        "#lineChartFive",
        (label = "label"),
        (bgColor = "#20C99710"),
        (bColor = "#20C997"),
        (data = [1000, 5000, 1500, 10000, 14000, 24000, 20000])
    );
    chartjsLineChartOne(
        "#lineChartSix",
        (label = "Label"),
        (bgColor = "#E34A8710"),
        (bColor = "#FF69A5"),
        (data = [10000, 15000, 10000, 15000, 14000, 24000, 20000])
    );
    chartjsLineChartOne(
        "#lineChartSeven",
        (label = "Label"),
        (bgColor = "#0D79DF10"),
        (bColor = "#5F63F2"),
        (data = [100, 300, 150, 200, 250, 500, 300])
    );
    chartjsLineChartOne(
        "#lineChartEight",
        (label = "Label"),
        (bgColor = "#D4740710"),
        (bColor = "#FA8B0C"),
        (data = [100, 300, 150, 200, 250, 500, 300])
    );
}

function fOverviewMonth() {
    chartjsLineChartOne(
        "#lineChartNine",
        (label = "label"),
        (bgColor = "#20C99710"),
        (bColor = "#20C997"),
        (data = [15000, 50000, 15000, 15000, 40000, 24000, 20000])
    );
    chartjsLineChartOne(
        "#lineChartTen",
        (label = "Label"),
        (bgColor = "#E34A8710"),
        (bColor = "#FF69A5"),
        (data = [20000, 40000, 16000, 15000, 30000, 23000, 25000])
    );
    chartjsLineChartOne(
        "#lineChartEleven",
        (label = "Label"),
        (bgColor = "#0D79DF10"),
        (bColor = "#5F63F2"),
        (data = [5000, 4000, 16000, 10000, 20000, 13000, 10000, 6000])
    );
    chartjsLineChartOne(
        "#lineChartTwelve",
        (label = "Label"),
        (bgColor = "#D4740710"),
        (bColor = "#FA8B0C"),
        (data = [1100, 2300, 1500, 1900, 500, 1400, 800, 500])
    );
}

function fOverviewYear() {
    chartjsLineChartOne(
        "#lineChartThirteen",
        (label = "label"),
        (bgColor = "#20C99710"),
        (bColor = "#20C997"),
        (data = [95000, 19000, 55000, 90000, 240000, 95000, 55000, 19000, 55000, 66000, 90000, 240000])
    );
    chartjsLineChartOne(
        "#lineChartFourteen",
        (label = "Label"),
        (bgColor = "#E34A8710"),
        (bColor = "#FF69A5"),
        (data = [98000, 20000, 55000, 90000, 240000, 95000, 55000, 19000, 55000, 66000, 90000, 240000])
    );
    chartjsLineChartOne(
        "#lineChartFifteen",
        (label = "Label"),
        (bgColor = "#0D79DF10"),
        (bColor = "#5F63F2"),
        (data = [9500, 1900, 5500, 9000, 24000, 9500, 5500, 1900, 5500, 9000, 10000, 24000])
    );
    chartjsLineChartOne(
        "#lineChartSixteen",
        (label = "Label"),
        (bgColor = "#D4740710"),
        (bColor = "#FA8B0C"),
        (data = [5000, 19000, 15000, 19000, 20000, 35000, 20000, 19000, 27000, 10000, 15000, 20000])
    );
}

function chartjsBarChartInEx(selector, data1, data2, data3, data4, labels, label = "Bar chart Income Expense") {
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 575 ? 180 : 84;
        var chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                        data: data1,
                        backgroundColor: "#5F63F250",
                        hoverBackgroundColor: "#5F63F2",
                        label: "Total Income",
                        barPercentage: 0.6,
                        borderRadius: 2,
                    },
                    {
                        data: data2,
                        backgroundColor: "#FF69A550",
                        hoverBackgroundColor: "#FF69A5",
                        label: "Cost of goods sold",
                        barPercentage: 0.6,
                        borderRadius: 2,
                    },
                    {
                        data: data3,
                        backgroundColor: "#FA8B0C50",
                        hoverBackgroundColor: "#FA8B0C",
                        label: "Total expenses",
                        barPercentage: 0.6,
                        borderRadius: 2,
                    },
                    {
                        data: data4,
                        backgroundColor: "#20C99750",
                        hoverBackgroundColor: "#20C997",
                        label: "Net profit",
                        barPercentage: 0.6,
                        borderRadius: 2,
                    },
                ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                scales: {
                    y: {
                        grid: {
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}K`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}

$('#incExp-week-tab').on("shown.bs.tab", function () {
    chartjsBarChartInEx(
        "barChartInEx_W",
        (data = [20, 45, 50, 60, 70, 40, 45]),
        (data = [10, 40, 60, 55, 45, 35, 30]),
        (data = [20, 45, 50, 60, 70, 40, 45]),
        (data = [10, 40, 60, 55, 45, 35, 30]),
        labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    );
    $('#incExp-week-tab').off();
});

$('#incExp-month-tab').on("shown.bs.tab", function () {
    chartjsBarChartInEx(
        "barChartInEx_M",
        (data = [20, 50, 60, 70, 40, 30]),
        (data = [10, 60, 55, 45, 35, 40]),
        (data = [20, 50, 60, 70, 40, 50]),
        (data = [10, 60, 55, 45, 35, 20]),
        labels = ["1-5", "6-10", "11-15", "16-20", "21-25", "26-30"]
    );
    $('#incExp-month-tab').off();
});

chartjsBarChartInEx(
    "barChartInEx",
    (data = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30]),
    (data = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20]),
    (data = [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30]),
    (data = [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
);

function chartjsLineChartForcast(
    selector,
    label = "",
    startGradient = "#5F63F212",
    endGradient = "#5F63F202",
    bColor = "#20C997",
    data = [30, 10, 20, 25, 20, 30, 15, 25, 15, 10]
) {
    var ctx = document.querySelectorAll(selector);
    if (ctx) {
        ctx.forEach(function (elm, id) {
            elm.getContext("2d");
            elm.height = 95;
            var chart = new Chart(elm, {
                type: "line",
                data: {
                    labels: [
                        "Jan",
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
                    datasets: [{
                        label: label,
                        borderColor: bColor,
                        data: data,
                        tension: 0.4,
                        fill: false,
                        hoverRadius: '6',
                        borderWidth: 3,
                        pointBackgroundColor: bColor,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: bColor,
                        pointHitRadius: 30,
                        pointStyle: 'circle',
                        pointHoverBorderWidth: 2,
                    }, ],
                },
                options: {
                    maintainAspectRatio: true,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                            position: "bottom",
                            align: "start",
                            labels: {
                                boxWidth: 6,
                                display: true,
                                usePointStyle: true,
                            },
                        },
                        tooltip: {
                            usePointStyle: true,
                            enabled: false,
                            external: customTooltips,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat().format(context.parsed.y);
                                    }
                                    return `<span class="data-label">${label}k</span>`;
                                }
                            },
                        },
                    },
                    layout: {
                        padding: {
                            left: -13,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        },
                    },
                    elements: {
                        point: {
                            radius: 0,
                        },
                    },
                    scales: {
                        y: {
                            display: false,
                            grid: {
                                display: false,
                                color: "#485e9029",
                            },
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10,
                                display: false,
                                stepSize: 20,
                            },
                        },
                        x: {
                            display: false,
                            grid: {
                                display: false,
                            },

                            ticks: {
                                beginAtZero: true,
                                fontSize: 11,
                                display: false,
                            },
                        },
                    },
                },
            });
        });
    }
}


chartjsLineChartForcast(
    "#lineChartforcastOne",
    (label = "Line Chart dataset"),
    (startGradient = "#5F63F212"),
    (endGradient = "#5F63F202"),
    (bColor = "#5F63F2"),
    (data = [30, 10, 20, 25, 20, 30, 15, 25, 15, 10])
);

chartjsLineChartForcast(
    "#lineChartforcastTwo",
    (label = "Line Chart dataset"),
    (startGradient = "#20C99712"),
    (endGradient = "#20C99703"),
    (bColor = "#20C997"),
    (data = [5, 15, 15, 10, 15, 25, 15, 25, 20, 10])
);



/* line chart small */
function chartjsLineChartSmall(
    selector,
    label,
    bColor = "#20C997",
    data = [5, 10, 20, 25, 20, 30]
) {
    var ctxs = document.getElementById(selector);
    if (ctxs) {
        ctxs.getContext("2d");
        ctxs.height = 30;
        ctxs.width = "100";
        var chart = new Chart(ctxs, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                    label: label,
                    borderColor: bColor,
                    data: data,
                    borderWidth: 2,
                    fill: false,
                    pointBackgroundColor: bColor,
                    hoverRadius: '6',
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: bColor,
                    pointHitRadius: 30,
                    pointStyle: 'circle',
                    pointHoverBorderWidth: 2,
                    tension:0.4,
                }, ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    },
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
            },
        });
    }
}
chartjsLineChartSmall("lineChartSm1");
chartjsLineChartSmall(
    "lineChartSm2",
    "Line Chart dataset",
    "#FF69A5",
    [0, 10, 8, 14, 7, 10]
);

chartjsLineChartSmall(
    "lineChartSm3",
    "Line Chart dataset",
    "#5F63F2",
    [5, 15, 5, 11, 17, 11]
);

chartjsLineChartSmall(
    "lineChartSm4",
    "Line Chart dataset",
    "#2C99FF",
    [4, 16, 9, 24, 8, 16]
);

chartjsLineChartSmall(
    "lineChartSm5",
    "Line Chart dataset",
    "#FA8B0C",
    [0, 10, 8, 14, 7, 10]
);