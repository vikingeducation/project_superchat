(function() {
  var template = Handlebars.template,
    templates = (Handlebars.templates = Handlebars.templates || {});
  templates["message_form_compiled.js"] = template({
    compiler: [7, ">= 4.0.0"],
    main: function(container, depth0, helpers, partials, data) {
      return "";
    },
    useData: true
  });
  templates["message_form"] = template({
    "1": function(container, depth0, helpers, partials, data, blockParams) {
      var stack1,
        alias1 = container.lambda,
        alias2 = container.escapeExpression;

      return (
        '    <div class="message row">\r\n      <div class="col-xs-12">\r\n        <p>\r\n        <span class="author">' +
        alias2(
          alias1(
            (stack1 = blockParams[0][0]) != null ? stack1.author : stack1,
            depth0
          )
        ) +
        ": </span>\r\n          " +
        alias2(
          alias1(
            (stack1 = blockParams[0][0]) != null ? stack1.body : stack1,
            depth0
          )
        ) +
        "\r\n        </p>\r\n      </div>\r\n    </div>\r\n"
      );
    },
    compiler: [7, ">= 4.0.0"],
    main: function(container, depth0, helpers, partials, data, blockParams) {
      var stack1,
        helper,
        alias1 = depth0 != null ? depth0 : container.nullContext || {},
        alias2 = helpers.helperMissing,
        alias3 = "function",
        alias4 = container.escapeExpression;

      return (
        '<div class="form form-group">\r\n  <form class="messageForm" id="' +
        alias4(
          (
            (helper =
              (helper =
                helpers.room || (depth0 != null ? depth0.room : depth0)) != null
                ? helper
                : alias2),
            typeof helper === alias3
              ? helper.call(alias1, {
                  name: "room",
                  hash: {},
                  data: data,
                  blockParams: blockParams
                })
              : helper
          )
        ) +
        '">\r\n    <div class="form-group">\r\n      <input type="text" name="message" class="form-control"/>\r\n    </div>\r\n    <button class="btn btn-default">Send Message</button>\r\n  </form>\r\n</div>\r\n\r\n<div id="messages' +
        alias4(
          (
            (helper =
              (helper =
                helpers.room || (depth0 != null ? depth0.room : depth0)) != null
                ? helper
                : alias2),
            typeof helper === alias3
              ? helper.call(alias1, {
                  name: "room",
                  hash: {},
                  data: data,
                  blockParams: blockParams
                })
              : helper
          )
        ) +
        '" class="container scrolling">\r\n' +
        ((stack1 = helpers.each.call(
          alias1,
          depth0 != null ? depth0.messages : depth0,
          {
            name: "each",
            hash: {},
            fn: container.program(1, data, 1, blockParams),
            inverse: container.noop,
            data: data,
            blockParams: blockParams
          }
        )) != null
          ? stack1
          : "") +
        "</div>\r\n"
      );
    },
    useData: true,
    useBlockParams: true
  });
})();
