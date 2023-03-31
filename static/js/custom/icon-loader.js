
$.getJSON(typeof env !== "undefined" && env.iconLoaderUrl ? env.iconLoaderUrl : "json/icons.json", function (data) {
  const { faIcons } = data;
  const { laIcons } = data;
  const feIcons = data.uniCons;
  const colFa = faIcons.map(
    (icon) =>
      `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <i class="fas fa-${icon}"></i>
                    <span class="icon-text">${icon}</span>
                </div>
            `
  );

  const colLa = laIcons.map(
    (icon) =>
      `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <i class="la la-${icon}"></i>
                    <span class="icon-text">${icon}</span>
                </div>
            `
  );

  $(".faIcon-list-box").append(colFa);
  $(".laIcon-list-box").append(colLa);
  const colFe = feIcons.map(
    (icon) =>
      `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <i class="uil uil-${icon}"></i>
                    <span class="icon-text">${icon}</span>
                </div>
            `
  );

  $(".feIcon-list-box").append(colFe);
});
