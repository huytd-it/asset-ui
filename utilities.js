/**
 * @create_by Trần Đình Huy - Enhanced Version
 * @issue Xử lý get, set, store, delete, alert, auth + URL shortening
 */



// === INITIALIZATION (giữ nguyên) ===
// const styleSheetToRemove = document.querySelector("link[href*='timber.css']");

// if (styleSheetToRemove) {
//   styleSheetToRemove.remove();
//   console.log('Đã xóa thành công file stylesheet: ' + styleSheetToRemove.href);
// } else {
//   console.log('Không tìm thấy stylesheet chứa "timber.css" để xóa.');
// }

// $("#lbClosePopup").attr("style", "");
// $('#style_2025').remove();

// === AUTH MODULE (giữ nguyên hoàn toàn) ===
var Auth = (function () {
  var _permissions = [];
  // _permissions = JSON.parse(
  //   crm_get_localStorge("_user_permissions")
  //     ? crm_get_localStorge("_user_permissions")
  //     : "[]"
  // );
  // var _position = crm_get_localStorge("_user_position");

  return {
    abort: function (description = "") {
      // $("#divPageContent").html(
      //   ' <div class="home-section-body" style="padding: 10px;"><p style="font-size:3rem;font-weight:bold;line-height:1.5;TEXT-ALIGN:center">' +
      //   description +
      //   '</p><br><center> <img src="images/access-denied.png"></center></div>'
      // );
    },
    checkPermissions: function (
      callback = function (res) {
        if (res[0]) {
          $(res[0]).find("a").click();
        } else {
          Auth.abort();
        }
      }
    ) {
      var result = [];
      var hide = [];
      $("[data-permission]").each(function (i, el) {
        var valid = true;
        $(el).hide();
        $(this)
          .attr("data-permission")
          .split("|")
          .map(function (permission) {
            valid = _permissions.includes(permission);

            if (valid) {
              result.push(el);
              $(el).show();
            } else {
              hide.push(el);
            }
          });
      });

      callback(result, hide);
    },
    checkPosition: function (callback = function (res) { }) {
      var result = [];
      $("[data-position]").each(function (i, el) {
        var element = $(this)
          .attr("data-position")
          .split("|")
          .map(function (el) {
            return el.trim();
          });

        if (!element.includes(_position)) {
          $(el).remove();
        } else {
          result.push(el);
        }
      });
      callback(result);
    },
    hasPermission: function (permissions, callback) {
      var valid = false;

      permissions.split("|").forEach(function (el) {
        if (_permissions.includes(el)) {
          valid = true;
          return true;
        }
      });
      return valid;
    },
    hasPosition: function (positions, callback) {
      var valid = false;
      positions.split("|").forEach(function (el) {
        if (_position == el) {
          valid = true;
        }
      });

      return valid;
    },
    setToken: function (token = window.localStorage.getItem("_user_token")) {
      return $.ajaxSetup({
        headers: {
          Authorization: "Bearer " + (token ? token : ""),
        },
      });
    },
    getPermissions: function () {
      return typeof _permissions == "object" ? _permissions : [];
    },
  };
})();

// === ENHANCED TOAST MODULE ===
var Toast = (function () {
  var responseJSON;
  var swalToast;
  var defaultConfig = {
    position: "top-end",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  };

  // Private function để khởi tạo toast với config tùy chỉnh
  function initToast(customConfig = {}) {
    const config = Object.assign({}, defaultConfig, customConfig);
    return Swal.mixin(config);
  }

  // Private function để xử lý response data
  function processResponse(res) {
    if (!res) return { msg: "Unknown message", errors: null };
    
    if (res.responseText && typeof res.responseText === "string") {
      try {
        return JSON.parse(res.responseText);
      } catch (e) {
        return { msg: res.responseText, errors: null };
      }
    }
    
    return res;
  }

  // Private function để format errors
  function formatErrors(errors) {
    if (!errors) return "";
    
    let errorText = "";
    if (typeof errors === "object") {
      for (const [key, value] of Object.entries(errors)) {
        errorText += `• ${value}<br>`;
      }
    } else {
      errorText = errors.toString();
    }
    
    return errorText;
  }

  return {
    // Main set function với nhiều options hơn
    set: function (res, options = {}) {
      responseJSON = processResponse(res);
      
      // Merge default config với options tùy chỉnh
      const toastConfig = Object.assign({}, defaultConfig, options);
      swalToast = initToast(toastConfig);
      
      return this;
    },

    // Success toast
    success: function (customMsg = null, options = {}) {
      const message = customMsg || responseJSON.msg || "Operation successful!";
      
      swalToast.fire(Object.assign({
        icon: "success",
        title: message,
        background: '#f0f9ff',
        iconColor: '#10b981',
      }, options));
      
      return this;
    },

    // Error toast với improved formatting
    error: function (customMsg = null, options = {}) {
      let errors = "";
      let msg = customMsg || "Error occurred";

      if (responseJSON.errors) {
        errors = formatErrors(responseJSON.errors);
      }

      if (responseJSON.msg) {
        msg = responseJSON.msg;
      }

      swalToast.fire(Object.assign({
        icon: "error",
        title: msg,
        html: errors,
        background: '#fef2f2',
        iconColor: '#ef4444',
        timer: 5000, // Error hiển thị lâu hơn
      }, options));
      
      return this;
    },

    // Warning toast (MỚI)
    warning: function (customMsg = null, options = {}) {
      const message = customMsg || responseJSON.msg || "Warning!";
      
      swalToast.fire(Object.assign({
        icon: "warning",
        title: message,
        html: responseJSON.html || "",
        background: '#fffbeb',
        iconColor: '#f59e0b',
        timer: 4000,
      }, options));
      
      return this;
    },

    // Info toast (MỚI)
    info: function (customMsg = null, options = {}) {
      const message = customMsg || responseJSON.msg || "Information";
      
      swalToast.fire(Object.assign({
        icon: "info",
        title: message,
        html: responseJSON.html || "",
        background: '#f0f9ff',
        iconColor: '#3b82f6',
        timer: 3500,
      }, options));
      
      return this;
    },

    // Question toast (MỚI)
    question: function (customMsg = null, options = {}) {
      const message = customMsg || responseJSON.msg || "Question?";
      
      swalToast.fire(Object.assign({
        icon: "question",
        title: message,
        html: responseJSON.html || "",
        background: '#f8fafc',
        iconColor: '#6366f1',
        timer: 4000,
      }, options));
      
      return this;
    },

    // Loading toast (MỚI)
    loading: function (customMsg = "Loading...", options = {}) {
      // Tạo custom icon cho loading
      const loadingIcon = `
        <div style="display: flex; justify-content: center; align-items: center;">
          <div style="
            width: 20px; 
            height: 20px; 
            border: 2px solid #f3f4f6; 
            border-top: 2px solid #3b82f6; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
          "></div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      swalToast.fire(Object.assign({
        title: customMsg,
        html: loadingIcon,
        background: '#f8fafc',
        showConfirmButton: false,
        timer: 0, // Không tự động tắt
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      }, options));
      
      return this;
    },

    // Quick methods cho từng loại (MỚI)
    quick: {
      success: function(msg, timeout = 2000) {
        return Toast.set({ msg: msg }, { timer: timeout }).success();
      },
      
      error: function(msg, timeout = 4000) {
        return Toast.set({ msg: msg }, { timer: timeout }).error();
      },
      
      warning: function(msg, timeout = 3000) {
        return Toast.set({ msg: msg }, { timer: timeout }).warning();
      },
      
      info: function(msg, timeout = 3000) {
        return Toast.set({ msg: msg }, { timer: timeout }).info();
      },
      
      loading: function(msg = "Loading...") {
        return Toast.loading(msg);
      }
    },

    // Utility methods (MỚI)
    
    // Close current toast
    close: function() {
      Swal.close();
      return this;
    },

    // Toast với custom position
    position: function(pos) {
      return {
        success: (msg) => Toast.set({ msg: msg }, { position: pos }).success(),
        error: (msg) => Toast.set({ msg: msg }, { position: pos }).error(),
        warning: (msg) => Toast.set({ msg: msg }, { position: pos }).warning(),
        info: (msg) => Toast.set({ msg: msg }, { position: pos }).info(),
      };
    },

    // Toast cho operations cụ thể (MỚI)
    form: {
      submitted: () => Toast.quick.success("Form đã được gửi thành công!", 2000),
      saved: () => Toast.quick.success("Dữ liệu đã được lưu!", 2000),
      deleted: () => Toast.quick.success("Đã xóa thành công!", 2000),
      updated: () => Toast.quick.success("Cập nhật thành công!", 2000),
      validated: () => Toast.quick.error("Vui lòng kiểm tra lại thông tin!", 3000),
      uploading: () => Toast.loading("Đang tải lên..."),
      processing: () => Toast.loading("Đang xử lý...")
    },

    // Toast cho API operations (MỚI)
    api: {
      loading: (msg = "Đang gửi yêu cầu...") => Toast.loading(msg),
      success: (msg = "Thành công!") => Toast.quick.success(msg, 2000),
      error: (msg = "Có lỗi xảy ra!") => Toast.quick.error(msg, 4000),
      timeout: () => Toast.quick.error("Yêu cầu hết thời gian chờ!", 4000),
      networkError: () => Toast.quick.error("Lỗi kết nối mạng!", 4000)
    },

    // Batch operations toast (MỚI)
    batch: {
      start: (total) => Toast.loading(`Đang xử lý 0/${total} items...`),
      progress: (current, total) => {
        const progressHtml = `
          <div style="margin-top: 10px;">
            <div style="background: #e5e7eb; border-radius: 10px; overflow: hidden; height: 6px;">
              <div style="background: #3b82f6; height: 100%; width: ${(current/total)*100}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="margin-top: 5px; font-size: 12px; color: #6b7280;">
              ${current}/${total} completed (${Math.round((current/total)*100)}%)
            </div>
          </div>
        `;
        
        Swal.update({
          title: `Đang xử lý ${current}/${total} items...`,
          html: progressHtml
        });
      },
      complete: (success, total) => {
        Toast.close();
        if (success === total) {
          Toast.quick.success(`Hoàn thành! Đã xử lý ${total} items thành công.`, 3000);
        } else {
          Toast.quick.warning(`Hoàn thành với ${success}/${total} items thành công.`, 4000);
        }
      }
    }
  };
})();

// === EXAMPLES OF USAGE ===
/*

// 1. Basic usage (như cũ)
Toast.set({ msg: "Success!" }).success();
Toast.set({ msg: "Error!", errors: { field: "Invalid value" } }).error();

// 2. Quick methods (mới)
Toast.quick.success("Saved successfully!");
Toast.quick.error("Something went wrong!");
Toast.quick.warning("Please check your input!");
Toast.quick.info("This is an information message!");

// 3. Form operations (mới)
Toast.form.submitted();
Toast.form.saved();
Toast.form.uploading();

// 4. API operations (mới)
Toast.api.loading();
// ... after API call
Toast.api.success("Data loaded!");

// 5. Custom positions (mới)
Toast.position("top-start").success("Top left toast!");
Toast.position("bottom-end").error("Bottom right error!");

// 6. Batch operations (mới)
Toast.batch.start(100);
// ... trong loop
Toast.batch.progress(50, 100);
// ... khi hoàn thành
Toast.batch.complete(95, 100);

// 7. Custom timeouts
Toast.set({ msg: "Long message" }, { timer: 10000 }).info();

// 8. Manual close
Toast.loading("Processing...");
// ... sau khi xong
Toast.close();

// 9. No auto-close
Toast.set({ msg: "Important!" }, { timer: 0 }).warning();

*/
// === POPUP MODULE (giữ nguyên hoàn toàn) ===
var Popup = (function () {
  var res = {
    msg: "Successful",
  };
  return {
    set: function (
      response = {
        msg: "THÔNG BÁO",
        html: "",
        timer: 3500,
      }
    ) {
      res = response;
      return this;
    },
    success: function () {
      if (res.msg) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.msg,
          html: res.html,
          showConfirmButton: true,
          timer: res.timer ? res.timer : 3500,
        });
      }
    },

    error: function () {
      var errors = "";
      var msg = "ERRORS";

      if (res.responseText) {
        if (typeof res.responseText == "string") {
          res = JSON.parse(res.responseText);
        }
      }

      if (res.errors) {
        for (var value of Object.values(res.errors)) {
          errors += value + "<br>";
        }
      }

      if (res.description) {
        errors = res.description;
      }
      if (res.msg) {
        msg = res.msg;
      }

      //NGOC CODE////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////
      if (msg == "Unauthorized") {
        Auth.setToken();
        try {
          Swal.fire({
            title: msg,
            html: "Tài khoản của bạn có lỗi liên quan tới bảo mật hãy đăng nhập lại để sử dụng tính năng này",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng nhập lại",
          }).then((result) => {
            if (result.isConfirmed) {
              _logout();
            }
          });
        } catch (err) {
          _logout();
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: msg,
          html: errors,
          showConfirmButton: true,
        });
      }
      // END NGOC CODE//////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////
    },
    question: function (
      action = function () { },
      custom = {
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
      }
    ) {
      Swal.fire({
        title: custom.title,
        text: custom.text,
        icon: custom.icon,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          action();
        }
      });
    },
  };
})();

// === URL SHORTENER MODULE (MỚI) ===
var URLShortener = (function () {
  var cache = new Map();
  var MAX_URL_LENGTH = 100; // URLs longer than this will be shortened
  var SHORTEN_API = 'url-shortener/create';

  return {
    /**
     * Intelligent URL handler - decides whether to shorten or use direct
     * @param {string} endpoint - The endpoint/URL to process
     * @param {Object} options - Configuration options
     * @param {boolean} options.forceShorten - Force shortening regardless of length
     * @param {boolean} options.useCache - Use cached shortened URLs
     * @param {number} options.maxLength - Max length before shortening (default: 100)
     * @param {function} options.onSuccess - Success callback
     * @param {function} options.onError - Error callback
     * @returns {Promise<string>} - Returns the final URL to use
     */
    process: function (endpoint, options = {}) {
      var config = Object.assign({
        forceShorten: false,
        useCache: false,
        maxLength: MAX_URL_LENGTH,
        onSuccess: function (url) { console.log('URL processed:', url); },
        onError: function (error) { console.error('URL processing failed:', error); }
      }, options);

      return new Promise(function (resolve, reject) {
        // Build full URL
        var fullUrl = endpoint.indexOf('http') === 0 ?
          endpoint :
          Http().getHost(endpoint);

        // Check if shortening is needed
        var needsShortening = config.forceShorten ||
          fullUrl.length > config.maxLength ||
          URLShortener.shouldShorten(fullUrl);

        if (!needsShortening) {
          resolve(fullUrl);
          config.onSuccess(fullUrl);
          return;
        }

        // Check cache first
        if (config.useCache && cache.has(fullUrl)) {
          var cachedUrl = cache.get(fullUrl);
          resolve(cachedUrl);
          config.onSuccess(cachedUrl);
          return;
        }

        // Create shortened URL
        URLShortener.create(fullUrl)
          .then(function (shortUrl) {
            if (config.useCache) {
              cache.set(fullUrl, shortUrl);
            }
            resolve(shortUrl);
            config.onSuccess(shortUrl);
          })
          .catch(function (error) {
            // Fallback to original URL if shortening fails
            console.warn('URL shortening failed, using original:', error);
            resolve(fullUrl);
            config.onError(error);
          });
      });
    },

    /**
     * Create a shortened URL
     * @param {string} longUrl - The URL to shorten
     * @returns {Promise<string>} - The shortened URL
     */
    create: function (longUrl) {
      return new Promise(function (resolve, reject) {
        Http()
          .api(SHORTEN_API, { long_url: longUrl })
          .save(function (response) {
            if (response.data && response.data.url) {
              resolve(response.data.url);
            } else {
              reject(new Error('Invalid response from shortener service'));
            }
          });
      });
    },

    /**
     * Determine if URL should be shortened based on heuristics
     * @param {string} url - URL to analyze
     * @returns {boolean} - Whether URL should be shortened
     */
    shouldShorten: function (url) {
      try {
        var urlObj = new URL(url);

        // Shorten if has many query parameters
        if (urlObj.search.length > 50) return true;

        // Shorten if path is very deep
        if (urlObj.pathname.split('/').length > 5) return true;

        // Shorten if contains tracking parameters
        var trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
        for (var i = 0; i < trackingParams.length; i++) {
          if (urlObj.searchParams.get(trackingParams[i])) return true;
        }

        return false;
      } catch (e) {
        return false;
      }
    },

    /**
     * Clear cache
     */
    clearCache: function () {
      cache.clear();
    },

    /**
     * Get cache statistics
     */
    getCacheStats: function () {
      var entries = [];
      cache.forEach(function (value, key) {
        entries.push([key, value]);
      });
      return {
        size: cache.size,
        entries: entries
      };
    }
  };
})();

// === HTTP MODULE (giữ nguyên hoàn toàn) ===
var Http = function () {
  var HttpUrl;
  var HttpData = {};
  var errorPopup = function (res) {
    Popup.set(res).error();
  };

  return {
    getHost: function (endpoint = "") {
      return `${window.location.origin}/crm/${endpoint?.trim().replace(/^\/+/, "") || ""}`;
    },
    getApiHost: function (endpoint = "") {
      return `${window.location.origin}/crm/api/v1/${endpoint?.trim().replace(/^\/+/, "") || ""}`;
    },
    api: function (
      api,
      data = {},
      error = function (res) {
        Popup.set(res).error();
      }
    ) {
      HttpUrl = this.getApiHost(api);
      HttpData = data;
      errorPopup = error;
      return this;
    },
    set: function (
      url,
      data = {},
      error = function (res) {
        Popup.set(res).error();
      }
    ) {
      HttpUrl = url;
      HttpData = data;
      errorPopup = error;
      return this;
    },
    get: function (callback = function (res) { }) {
      return $.get(HttpUrl, HttpData, function (data) {
        callback(data);
      }).fail(function (res) {
        Popup.set(res).error();
      });
    },
    getLarge: function (callback = function (res) { }) {
      $.post(HttpUrl, HttpData, function (data) {
        callback(data);
      }).fail(function (res) {
        errorPopup(res);
      });
    },
    save: function (
      callback = function (response) {
        Toast.set(response).success();
      }
    ) {
      return $.ajax({
        method: "POST",
        url: HttpUrl,
        data: HttpData,
        success: function (response) {
          callback(response);
        },
        error: function (response) {
          errorPopup(response);
        },
      });
    },
    delete: function (callback) {
      Popup.question(function () {
        Http().set(HttpUrl, HttpData).save(callback);
      });
    },
    saveForm: function (
      callback = function (res) {
        Popup.set(res).success();
      }
    ) {
      return $.ajax({
        method: "POST",
        url: HttpUrl,
        data: HttpData,
        processData: false,
        contentType: false,
        success: function (response) {
          callback(response);
        },
        error: function (response) {
          errorPopup(response);
        },
      });
    },
    getUrlParam: function (sParam) {
      var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined
            ? true
            : decodeURIComponent(sParameterName[1]);
        }
      }
    },
  };
};
// var host = crm_get_localStorge("_api_host");

// === INPUT TYPE MODULE (giữ nguyên hoàn toàn) ===
var InputType = function (_selector = null, options = {}) {
  var _options = {};
  var _startDate = "",
    _endDate = "";
  var _data;
  _options = Object.assign(_options, options);

  return {
    selector: function () {
      return _selector;
    },
    set: function (JquerySelector = "") {
      _selector = JquerySelector;
      return this;
    },
    setOptions: function (options) {
      _options = options;
      return this;
    },
    getOptions: function () {
      return _options;
    },
    date: function (options = {}) {
      _options = Object.assign(_options, {
        locale: {
          format: "DD/MM/YYYY",
          cancelLabel: "Clear",
        },
        autoUpdateInput: true,
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1991,
        maxYear: parseInt(moment().add(5, "years").format("YYYY"), 10),
      }, options);

      $(_selector).daterangepicker(_options);
      $(_selector).on("cancel.daterangepicker", function (ev, picker) {
        $(this).val("");
      });
      $(_selector).on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("DD/MM/YYYY"));
      });
      return this;
    },
    dateTime: function () {
      _options = {
        locale: {
          format: "DD/MM/YYYY HH:mm:ss",
          cancelLabel: "Clear",
        },
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1990,
        timePicker: true,
        timePicker24Hour: true,
        maxYear: parseInt(moment().format("YYYY"), 10),
      };
      $(_selector).daterangepicker(_options);
      $(_selector).on("cancel.daterangepicker", function (ev, picker) {
        $(this).val("");
      });
      $(_selector).on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("DD/MM/YYYY HH:mm:ss"));
      });
      return this;
    },
    dateRanger: function (options = {}) {
      _options = {
        locale: {
          format: "DD/MM/YYYY",
          cancelLabel: "Clear",
        },
      };
      _options = Object.assign(_options, options);
      $(_selector).daterangepicker(_options);
      $(_selector).on("cancel.daterangepicker", function (ev, picker) {
        $(this).val("");
      });

      return this;
    },
    timeRanger: function (options = {}) {
      _options = {
        locale: {
          format: "HH:mm",
          cancelLabel: "Clear",
        },
        timePicker: true,
        timePicker24Hour: true,
      };
      _options = Object.assign(_options, options);
      $(_selector).daterangepicker(_options);
      $(_selector).on("cancel.daterangepicker", function (ev, picker) {
        $(this).val("");
      });

      return this;
    },
    get: function () {
      _data = $(_selector).data("daterangepicker");
      if ($(_selector).val()) {
        if (_data && _data.startDate) {
          _startDate = moment(_data.startDate).isValid()
            ? moment(_data.startDate).format("YYYY-MM-DD HH:mm:ss")
            : "";
          _endDate = moment(_data.startDate).isValid()
            ? moment(_data.endDate).format("YYYY-MM-DD HH:mm:ss")
            : "";
        }
      } else {
        _endDate = "";
        _startDate = "";
      }

      return {
        startDate: _startDate,
        endDate: _endDate,
      };
    },
    data: function () {
      return this.get();
    },
    apply: function (callback) {
      $(_selector).on("apply.daterangepicker", function (ev, picker) {
        $(this).val(picker.startDate.format("DD/MM/YYYY HH:mm:ss"));
        callback(ev, picker);
      });

      return this;
    },
    change: function (startDate, endDate = null) {
      if (startDate == "" || startDate == null || !startDate) {
        $(_selector).val("");
      } else {
        $(_selector).data("daterangepicker").setStartDate(moment(startDate));
        if (endDate) {
          $(_selector).data("daterangepicker").setEndDate(moment(endDate));
        }
      }
    },
    value: function (value) {
      this.change(value);
    },
  };
};

// === CONVERT DATE MODULE (giữ nguyên hoàn toàn) ===
var ConvertDate = function (dateString) {
  var _date = dateString;
  return {
    get: function () {
      return _date;
    },
    set: function (dateString) {
      _date = dateString;
      return this;
    },
    toVi: function (dateString) {
      if (moment(dateString).isValid()) {
        _date = dateString;
      }

      return moment(_date).format("DD/MM/YYYY") != "Invalid date" && _date
        ? moment(_date).format("DD/MM/YYYY")
        : "";
    },
    toViDateTime: function (dateString) {
      if (moment(dateString).isValid()) {
        _date = dateString;
      }

      return moment(_date).format("DD/MM/YYYY") != "Invalid date" && _date
        ? moment(_date).format("DD/MM/YYYY HH:mm:ss")
        : "";
    },

    toEn: function (dateString) {
      if (moment(dateString).isValid()) {
        _date = dateString;
      }
      return moment(dateString).isValid()
        ? moment(_date).format("MMMM DD, YYYY")
        : "";
    },
    toDate: function (dateString) {
      if (moment(dateString).isValid()) {
        _date = dateString;
      }

      return moment(_date).format("YYYY-MM-DD") != "Invalid date"
        ? moment(_date).format("YYYY-MM-DD")
        : "";
    },
  };
};

// === LSTS TABLE MODULE (giữ nguyên hoàn toàn) ===
var LstsTable = function (selector) {
  var _data = [];
  var _thead = "";
  var _buttons = "";
  var _dataTable = null;
  var _columns = [];
  var _tableId = selector;
  return {
    setData: function (data) {
      _data = data;
      if (_dataTable) {
        _dataTable.clear().rows.add(data).draw();
      }
      return this;
    },
    getData: function () {
      return _dataTable.rows().data().toArray();
    },
    append: function (data) {
      return this;
    },
    setButton: function (data) {
      _buttons = data;
      return this;
    },
    getDataTable: function () {
      return _dataTable;
    },
    setHeader: function (
      header = [{ name: "key của object", title: "Tên của header" }]
    ) {
      _columns = header;
      return this;
    },
    table: function (callback = function () { }) {
      _dataTable = $(_tableId).DataTable({
        processing: true,
        select: true,
        searching: true,
        data: _data,
        layout: {
          topStart: {
            pageLength: true,
            buttons: ["selectAll", "selectNone", "colvis"],
          },
        },
        responsive: true,
        lengthMenu: [
          [10, 25, 100, 500, -1],
          [10, 25, 100, 500, "All"],
        ],
        order: [[5, "asc"]],
        columns: _columns,
        drawCallback: function () {
          callback();
        },
      });
      _dataTable.on("responsive-display", function (e, datatable, columns) {
        callback();
      });

      $(document).on("click", _tableId + " .btn_remove_row_local", function () {
        _dataTable.rows($(this).closest("tr")).remove().draw();
      });
      return this;
    },
  };
};

// === PROGRESS BAR MODULE (giữ nguyên hoàn toàn) ===
var ProgressBar = (function () {
  var _selector = "#progressBarWrapper";
  var _bar = "#import-progress-bar";

  return {
    show: function () {
      $(_selector).css("display", "block");
      this.set(0); // Đặt progress về 0 khi hiển thị
      return this;
    },
    hide: function () {
      $(_selector).css("display", "none");
      return this;
    },
    set: function (progress) {
      var percent = progress.toFixed(2); // Giữ 2 số lẻ
      $(_bar).css("width", percent + "%").text(percent + "%");
    },
  };
})();

// === IMPORT MODULE (giữ nguyên hoàn toàn) ===
var Import = (function () {
  var _time = 300;
  var _errors = [];
  var _success = [];
  var _api = "/:api/:update";
  var _progressBar = null;
  var _callback = () => {
    Popup.set({
      msg: "IMPORT THÀNH CÔNG ",
    }).success();
  };

  var _response = function (res) {
    return res;
  };
  var _responseError = function (res) {
    return res;
  };
  var _responseSuccess = function (res) {
    return res;
  };
  return {
    start: function () {
      _progressBar = ProgressBar.show();
      return this;
    },
    showProgressBar: function () {
      _progressBar = ProgressBar.show();
      return this;
    },
    set: function (option) {
      _time = option.time ? option.time : _time;
      _api = option.api ? option.api : _api;
      return this;
    },
    api: function (api) {
      _api = api;
      return this;
    },
    callback: function (callback = function () { }) {
      _callback = callback;
      _errors = [];
      _success = [];
      return this;
    },
    setTimeout: function (time) {
      _time = time;
      return this;
    },
    setResponse: function (callback = function (data, res) { }) {
      _response = callback;
      return this;
    },
    setResponseError: function (callback = function (data, res) { }) {
      _responseError = callback;
      return this;
    },
    setResponseSuccess: function (callback = function (data, res) { }) {
      _responseSuccess = callback;
      return this;
    },
    importMultiple: function (data = [], _batch = 3, progress = 0, total = data.length) {
      if (data.length > 0) {
        var batch = data.splice(0, _batch); // Lấy 3 item đầu tiên
        var promises = batch.map(item =>
          new Promise(resolve => {
            Http()
              .api(_api, item, function (res) {
                if (res.responseText) {
                  res = JSON.parse(res.responseText);
                  _errors.push(res);
                }
              })
              .save(function (res) {
                _success.push(res);
              })
              .always(function (res) {
                resolve(); // Đánh dấu hoàn thành
              });
          })
        );

        Promise.all(promises).then(() => {
          progress += batch.length;
          _progressBar.set((progress / total) * 100);

          if (data.length > 0) {
            setTimeout(() => Import.importMultiple(data, progress, total), _time);
          } else {
            _progressBar.set(100);
            setTimeout(() => _progressBar.hide(), 1000); // Ẩn sau 1 giây
            _callback({ errors: _errors, success: _success });
            _errors = [];
            _success = [];
          }
        });
      }
    },
    import: function (data = [], progress = 0, total = data.length) {
      if (data.length > 0) {
        Http()
          .api(_api, data[0], function (res) {
            if (res.responseText) {
              res = JSON.parse(res.responseText);
              _responseError(data[0], res);
              _errors.push(res);
            }
          })
          .save(function (res) {
            _responseSuccess(data[0], res);
            _success.push(res);
          })
          .always(function (res) {
            data.shift();
            _response(data[0], res);
            if (data.length > 0) {
              if (_progressBar) {
                progress++;
                _progressBar.set((progress / total) * 100);
              }

              setTimeout(function () {
                Import.import(data, progress, total);
              }, _time);
            } else {
              if (_progressBar) {
                _progressBar.hide();
              }

              _callback({
                errors: _errors,
                success: _success,
              });
              _errors = [];
              _success = [];
            }
          });
      }
    },

    run: function (data = [], progress = 0, total = data.length) {
      this.import(data, progress, total);
    },

  };
})();

// === ALERT BS MODULE (giữ nguyên hoàn toàn) ===
var AlertBs = function (selector) {
  var _template =
    '<div class="alert mt-2 alert-{{type}} alert-dismissible fade show" role="alert">' +
    '<h4 class="alert-heading">{{msg}}</h4><p>{{description}}</p><button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span></button></div>';
  var _selector = selector;
  var _data = {
    description: "",
    msg: "",
  };

  function replaceTemplate(replacement) {
    return (replacedTemplate = _template.replace(
      /{{([^}]+)}}/g,
      function (match, key) {
        return replacement[key.trim()] ? replacement[key.trim()] : match;
      }
    ));
  }
  return {
    set: function (
      data = {
        msg: "THÀNH CÔNG",
        descriptions: [],
      }
    ) {
      var html = "";
      var i = 1;
      if (!data.descriptions) {
        data.descriptions = [];
      }
      data.descriptions.forEach(function (el) {
        html +=
          "<p class='pb-2' style='border-bottom:1px solid;'> <span class='lang' vi='Dòng'> Line </span> " +
          i +
          " : " +
          JSON.stringify(el) +
          "</p><br>";
        i++;
      });

      if (data.descriptions.length == 0) {
        html = "<p></p>";
      }
      _data.description = html;
      _data.msg = data.msg;
      return this;
    },
    success: function () {
      _data.type = "success";
      $(_selector + " .alert-success").remove();
      $(_selector).prepend(replaceTemplate(_data));
      return this;
    },
    error: function () {
      _data.type = "danger";
      $(_selector + " .alert-danger").remove();
      $(_selector).prepend(replaceTemplate(_data));
      return this;
    },
    clear: function (time = 10000) {
      if (time) {
        setTimeout(() => {
          $(_selector).html("");
        }, time);
      }
    },
  };
};

// === LOADER MODULE (giữ nguyên hoàn toàn) ===
var LoaderLsts = (function () {
  var html = `<div id="loaderLsts"> <span class="loader"></span></div>`;
  var style = `<style>
  #loaderLsts {
  width: 100%;
  height: 100vh;
  background-color:#343a407d;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items:center;
  }
  .loader {
  width: 10rem;
  height: 10rem;
  border: .75rem dotted #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 2.5s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>`;
  return {
    show: function () {
      if (!$("div#loaderLsts")[0]) {
        $("body").prepend(html).css({ overflow: "hidden" });
        $("head").prepend(style);
      }
    },
    hide: function () {
      if ($("div#loaderLsts")[0]) {
        $("body").css({ overflow: "auto" });
        $("div#loaderLsts").remove();
      }
    },
  };
})();

// === SELECT AJAX MODULE (giữ nguyên hoàn toàn) ===
var SelectAjax = function (
  options = {
    selector: "#selector",
    api: "api/:controller/:action",
    optionFormat: function (data) {
      return {
        text: data.text,
        id: data.id,
        vi: data.vi ? data.vi : null,
      };
    },
    responseFormat: function (res) {
      return res.data
        ? res.data
        : res
          ? res
          : [{ id: "", text: "-- Choose --", vi: "-- Chọn --" }];
    },
  }
) {
  return SelectType(
    options.selector,
    options.api,
    options.optionFormat,
    options.responseFormat
  );
};

// === SELECT TYPE MODULE (giữ nguyên hoàn toàn) ===
var SelectType = function (
  selector,
  api,
  optionFormat = function (data) {
    return {
      text: data.text,
      id: data.id,
      vi: data.vi ? data.vi : null,
    };
  },
  responseFormat = function (res) {
    return res.data
      ? res.data
      : res
        ? res
        : [{ id: "", text: "-- All --", vi: "-- Tất cả --" }];
  }
) {
  const _selector = selector;
  const _api = api;

  var _params = { search: null };
  var _options = [{ id: "", text: "-- All --", vi: "-- Tất cả --" }];
  var _firstOption = { id: "", text: "-- All --", vi: "-- Tất cả --" };

  //Cấu hình select2
  var _select2Obj = function () {
    return $(_selector).select2({
      ajax: {
        minimumInputLength: 2,
        minimumResultsForSearch: 10,
        url: _api,
        dataType: "json",
        data: function (term) {
          if (term.term || _params.search == null) {
            _params.search = term.term;
          }

          return Object.assign(
            {},
            {
              length: 10,
            },
            _params
          );
        },

        processResults: function (response) {
          response = responseFormat(response);

          response = $.map(response, function (item) {
            return optionFormat(item);
          });

          //Tùy chỉnh giá trị đầu tiên, có thể sử dụng hàm .first(null) để xóa, mặc định là All
          if (_firstOption) {
            response = [_firstOption].concat(response);
          }
          return {
            results: response,
          };
        },
      },
    });
  };

  function generateDataToOptions(
    response = [],
    attributes = {},
    defaultValueIndex = 0,
    onlyResponse = false
  ) {
    response = responseFormat(response);
    //Nếu response là object
    if (typeof response == "object" && !response.length) {
      response = [response];
    }
    if (response.length > 0) {
      var options = $.map(response, function (item) {
        return Object.assign(item, optionFormat(item));
      });
      if (onlyResponse) {
        _options = options;
      } else {
        _options = _options.concat(options);
      }
    }

    var multipleOption = [];
    $(_selector).empty();
    $(_options).each(function (i, el) {
      var option = null;
      if (i == defaultValueIndex) {
        option = new Option(el.text, el.id, true, true);
      } else {
        option = new Option(el.text, el.id, false, false);
      }
      for (const [key, value] of Object.entries(el)) {
        if (key != "value" || key != "id") {
          option.setAttribute("data-" + key, value);
        } else if (key == "vi") {
          option.setAttribute("vi", value);
        }
      }
      if (Object.keys(attributes).length > 0) {
        for (const [key, value] of Object.entries(attributes)) {
          option.setAttribute("data-" + key, value);
        }
      }
      if ($(_selector).attr("multiple")) {
        _select2Obj().append(option);
        multipleOption.push(el.id);
      } else if (i == defaultValueIndex) {
        _select2Obj().append(option);
        _select2Obj().trigger({
          type: "select2:select",
          params: {
            data: el,
          },
        });
      }
    });
    if ($(_selector).attr("multiple")) {
      $(_selector).val(multipleOption).trigger("change");
    }
  }

  function generateDataToOptions_2(
    response = [],
    attributes = {},
    defaultValueIndex = 0,
    onlyResponse = false
  ) {
    response = responseFormat(response);
    //Nếu response là object
    if (typeof response == "object" && !response.length) {
      response = [response];
    }
    if (response.length > 0) {
      var options = $.map(response, function (item) {
        return Object.assign(item, optionFormat(item));
      });
      if (onlyResponse) {
        _options = options;
      } else {
        _options = _options.concat(options);
      }
    }
    $(_selector).empty();
    $(_options).each(function (i, el) {
      var option = null;
      if (i == defaultValueIndex) {
        option = new Option(el.text, el.id, true, true);
      } else {
        option = new Option(el.text, el.id, false, false);
      }
      for (const [key, value] of Object.entries(el)) {
        if (key != "value" || key != "id") {
          option.setAttribute("data-" + key, value);
        } else if (key == "vi") {
          option.setAttribute("vi", value);
        }
      }
      if (Object.keys(attributes).length > 0) {
        for (const [key, value] of Object.entries(attributes)) {
          option.setAttribute("data-" + key, value);
        }
      }

      $(_selector).append(option);
      if (i == defaultValueIndex) {
        $(_selector).val(el.id);
      }
    });
    $(_selector).select2();
  }
  return {
    params: function (params) {
      _params = params;
      return this;
    },

    first: function (
      option = { id: "", text: "-- All --", vi: "-- Tất cả --" }
    ) {
      _firstOption = option;
      if (_options.length > 0) {
        _options[0] = option;
      } else {
        _options.push(option);
      }
    },
    prepend: function (
      data = { id: "", text: "-- All --", vi: "-- Tất cả --" }
    ) {
      _options = _options.concat(data);
      return this;
    },
    set: function (data = {}) {
      generateDataToOptions(data);
      return this;
    },

    get: function (callback = function (res, ajax) { }, defaultValueIndex = 0) {
      var _ajax = this;
      var first = _options[0]
        ? _options[0]
        : { id: "", text: "-- All --", vi: "-- Tất cả --" };
      _options = [first];
      return Http()
        .set(api, _params, function (res) {
          console.error("#error: " + res);
        })
        .get(function (res) {
          generateDataToOptions_2(
            res,
            {},
            defaultValueIndex ? defaultValueIndex : 0
          );
          callback(responseFormat(res), _ajax);
        });
    },

    val: function (data) {
      $(_selector).val(data);
    },

    value: function (
      params,
      attr = {},
      callback = function () { },
      defaultValueIndex = 0
    ) {
      var _ajax = this;
      _params = Object.assign({}, _params, params);

      if (!params) {
        var select2_ = _select2Obj();
        var option = new Option(_firstOption.text, _firstOption.id, true, true);
        option.setAttribute("vi", _firstOption.vi);
        select2_.append(option);
        select2_.trigger({
          type: "select2:select",
          params: {
            data: {},
          },
        });

        if ($(_selector).attr("multiple")) {
          $(_selector).val([]).trigger("change");
        }

        _params = { search: null };
        return select2_;
      }
      return Http()
        .set(api, _params, function (res) {
          console.error("#error: " + res);
        })
        .get(function (res) {
          generateDataToOptions(res, attr, defaultValueIndex, true);
          callback(responseFormat(res), _ajax);
        });
    },

    select2: function () {
      return _select2Obj();
    },

    data: function () {
      var data_2 = {};
      var data = $(_selector).find("option:selected").data();

      if ($(_selector).select2("data")) {
        data_2 = $(_selector).select2("data")[0];
      }
      return Object.assign({}, data, data_2);
    },
    getConfig: function () {
      return _selector;
    },
  };
};

// === TOM SELECT MODULE (giữ nguyên hoàn toàn) ===
function defaultOptionFormat(data) {
  // Nếu đã có key value và text thì trả về luôn
  if (data.hasOwnProperty('value') && data.hasOwnProperty('text')) {
    return data;
  }
  let keys = Object.keys(data);
  if (keys.length >= 2) {
    return {
      value: data[keys[0]],
      text: data[keys[1]],
      ...data // giữ lại các thuộc tính khác nếu cần
    };
  }
  return data;
}

function defaultResponseFormat(response) {
  if (Array.isArray(response)) {
    return response;
  } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

function initAjaxTomSelect(elementInput = '', apiUrl = '', optionFormat = null, responseFormat = null) {
  const _apiUrl = apiUrl;

  responseFormat = responseFormat || defaultResponseFormat;
  optionFormat = optionFormat || defaultOptionFormat;
  var _customParams = {};
  var _firstOption = ({ value: "", text: "-- All --" });

  // Ban đầu, mặc định là 'value' và 'text'
  var field = { valueField: 'value', labelField: 'text' };

  // TODO: trường hợp nhập vào là class (nếu cần xử lý nhiều phần tử)
  const render = {
    option: function (item, escape) {
      // Tạo chuỗi các data attributes từ item
      let dataAttrs = '';
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // Chuyển key về dạng chữ thường và thay các khoảng trắng (nếu có) thành dấu gạch ngang
          const dataKey = key.toLowerCase().replace(/\s+/g, '-');
          if (item[key])
            dataAttrs += ` data-${escape(dataKey)}="${escape(item[key])}"`;
        }
      }
      // Hiển thị option với các data attributes
      return `<div class="option-item" ${dataAttrs}>${escape(item.text)}</div>`;
    },
    item: function (item, escape) {
      // Render cho item đã được chọn: có thể cũng áp dụng data attributes nếu cần
      let dataAttrs = '';
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const dataKey = key.toLowerCase().replace(/\s+/g, '-');
          if (item[key])
            dataAttrs += ` data-${escape(dataKey)}="${escape(item[key])}"`;
        }
      }
      return `<div class="selected-item" ${dataAttrs}>${escape(item.text)}</div>`;
    }
  };

  // Hàm khởi tạo options cho TomSelect
  let initOptions = function () {
    if (apiUrl) {
      return {
        valueField: field.valueField,
        labelField: field.labelField,
        searchField: ['text', 'email'],
        allowEmptyOption: true,
        plugins: {
          remove_button: {
            title: 'Remove this item',
          }
        },
        persist: false,
        load: function (query, callback) {
          if (query) {
            _customParams = Object.assign(_customParams, { search: query });
          }

          $.ajax({
            url: apiUrl,
            method: 'GET',
            data: _customParams,
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('_user_token'),
              'Content-Type': 'application/json'
            },
            dataType: 'json'
          })
            .done(function (res) {
              let dataRaw = responseFormat(res);
              var data = dataRaw;
              if (optionFormat) {
                data = dataRaw.map(function (el) {
                  return optionFormat(el);
                });
              }

              if (_firstOption) {
                data.unshift(_firstOption);
              }
              callback(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.error('Error:', textStatus, errorThrown);
              callback();
            });
        },
        render: render
      };
    } else {
      return {
        allowEmptyOption: true,
        plugins: {
          remove_button: {
            title: 'Remove this item',
          }
        },
        persist: false,
        render: render
      };
    }
  };

  // Xác định phần tử DOM từ input có thể là:
  // - Chuỗi selector (ID, attribute, hay kết hợp nhiều selector)
  // - jQuery object: $(el)[0]
  // - HTMLElement
  let element;
  if (typeof elementInput === 'string' && elementInput) {
    // Nếu là chuỗi selector, sử dụng querySelector để hỗ trợ tất cả các trường hợp
    element = document.querySelector(elementInput);
  } else if (elementInput instanceof jQuery && elementInput.length > 0) {
    element = elementInput[0];
  } else if (elementInput instanceof HTMLElement) {
    element = elementInput;
  } else {
    console.error('Element không hợp lệ');
    return;
  }

  // Nếu không tìm thấy phần tử
  if (!element) {
    console.error('KHÔNG TÌM THẤY phần tử với selector/ID: ', elementInput);
    return;
  }
  let _select;
  // Nếu TomSelect đã được khởi tạo trên phần tử, sử dụng lại instance đó
  if (element.tomselect) {
    _select = element.tomselect;
  } else {
    _select = new TomSelect(element, initOptions());
  }

  element.classList.remove('form-control');

  var _options = [];

  return {
    select2: function () {
      return _select;
    },
    params: function (params) {
      Object.assign(_customParams, params);
      return this;
    },
    first: function (option) {
      if (option) {
        _firstOption = option;
        _options[0] = _firstOption;
        _select.clearOptions();
        _options.forEach(opt => _select.addOption(opt));
        _select.refreshOptions();
      } else {
        _firstOption = false;
      }
      return this;
    },
    prepend: function (data) {
      let newData = optionFormat(data);
      _options = [newData].concat(_options);
      _select.clearOptions();
      _options.forEach(opt => _select.addOption(opt));
      _select.refreshOptions();
      return this;
    },
    set: function (data) {
      let formattedData = data.map(optionFormat);
      if (_firstOption) {
        _options = [_firstOption].concat(formattedData);
      } else {
        _options = formattedData;
      }
      _options.forEach(opt => _select.addOption(opt));
      return this;
    },
    get: function (callback, defaultValueIndex = 0) {
      let url = _apiUrl;
      return $.ajax({
        url: url,
        method: 'GET',
        data: _customParams,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('_user_token'),
          'Content-Type': 'application/json'
        },
        dataType: 'json'
      })
        .done(function (res) {
          let data = responseFormat(res);
          if (data.length > 0) {
            data = data.map(function (el) {
              return Object.assign(el, optionFormat(el));
            });
            this.set(data);
            _select.setValue(_options[defaultValueIndex].value, true);
            if (callback) callback(data, this);

          }

        }.bind(this))
        .fail(function () {
          if (callback) callback([], this);
        }.bind(this));


    },
    value: function (value, callback) {
      if (value) {
        _firstOption = false;

      }

      if (apiUrl) {
        this.params(value);
        this.get(callback);
      } else {
        _select.setValue(value)
      }

    },

    data: function () {

      return $(_select.getItem(_select.getValue())).data();
    },
    find: function (domElement) {
      if (domElement) {
        if (!(domElement instanceof HTMLElement)) {
          throw new Error("Tham số phải là một DOM element.");
        }
        _select = domElement.tomselect;
        return this;
      }
    },
    getConfig: function () {
      return '#' + elementId;
    }
  };
}

// === FORM TYPE MODULE (giữ nguyên hoàn toàn) ===
var FormType = function (_formIdSelector = "#form_id") {
  var _rules = {
    award_name: {
      required: true,
      maxlength: 250,
    },
    award_date: "required",
  };
  var _messages = {
    award_name: "Please enter your award name",
    organization: {
      required: "Please enter organization name",
      maxlength: "No more than 100 characters long",
    },
  };
  var _validator = null;

  return {
    rules: function (
      rules = {
        input_name: {
          required: true,
          maxlength: 250,
        },
      }
    ) {
      _rules = rules;
      return this;
    },

    messages: function (messages = { input_name: {} }) {
      _messages = messages;
      return this;
    },
    clear: function () {
      _validator.resetForm();
      $(_formIdSelector).find(".is-valid").removeClass("is-valid");
      $(_formIdSelector).find(".is-invalid").removeClass("is-invalid");
    },
    valid: function () {
      if ($(_formIdSelector).length) {
        return $(_formIdSelector).valid();
      }

    },
    showErrors: function (data) {
      return _validator.showErrors(data);
    },
    validate: function () {
      var lang = crm_get_localStorge("lang") ? crm_get_localStorge("lang") : "vi";
      _validator = $(_formIdSelector).validate({
        rules: _rules,
        lang: lang,
        messages: _messages,
        errorElement: "em",
        errorPlacement: function (error, element) {

          error.addClass("invalid-feedback");
          element.addClass("is-invalid");

          // Nếu là Tom-Select, đặt lỗi vào div `.invalid-feedback` của nó
          if ($(element).hasClass("ts-hidden-accessible")) {
            $(element).siblings(".ts-wrapper").addClass("is-invalid");
            error.insertAfter(element.next());
            $(element).parent().find(".invalid-feedback").text(error.text());
          } else if (element.prop("type") === "checkbox") {
            error.insertAfter(element.parent("label"));
          } else if (element.next().hasClass("select2")) {
            element.next().find(".select2-selection").addClass("is-invalid");
            error.insertAfter(element.next());
          } else {
            error.insertAfter(element);

          }
        },
        success: function (label, element) {
          if (!$(element).next()) {
            $(element).insertAfter($(label));
          }
          if ($(element).hasClass("ts-hidden-accessible")) {

            $(element).siblings(".ts-wrapper").removeClass("is-invalid").addClass('is-valid');
            $(element).parent().find(".invalid-feedback").text("");
          } else
            if ($(element).next().hasClass("select2")) {
              $(element)
                .next()
                .find(".select2-selection")
                .addClass("is-valid")
                .removeClass("is-invalid");
            }
        },
        highlight: function (element, errorClass, validClass) {
          $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {

          $(element).addClass("is-valid").removeClass("is-invalid");

          if ($(element).hasClass("ts-hidden-accessible")) {
            $(element).siblings(".ts-wrapper").removeClass("is-invalid").addClass('is-valid');
            $(element).parent().find(".invalid-feedback").text("");
          }
          if ($(element).next().hasClass("select2")) {
            $(element)
              .next()
              .find(".select2-selection")
              .addClass("is-valid")
              .removeClass("is-invalid");
          }
        },
      });
      return this;
    },
    getValidator: function () {
      return _validator;
    },
    data: function () {
      return new FormData($(_formIdSelector)[0]);
    },
  };
};

// === UTILITY FUNCTIONS (giữ nguyên hoàn toàn) ===
var changeLanguage = function (lang = "") {
  if (!lang) {
    lang = crm_get_localStorge("lang") ? crm_get_localStorge("lang") : "vi";
  }
  $(".dt-column-title").each(function (i, el) {
    var title = $(el).parent().attr("data-" + lang + "-title");

    if (title) {
      $(el).html(title);
    }
  });
  $("[" + lang + "]").each(function (i, el) {
    if ($(el).attr(lang)) {
      $(el).html($(el).attr(lang));
    }
  });
};

var debounce = function (func, delay) {
  let timeoutId;

  return function () {
    const context = this;
    const args = arguments;

    // Hủy bỏ timeout hiện tại (nếu có)
    clearTimeout(timeoutId);

    // Thiết lập timeout mới
    timeoutId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
};

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    var title = $(button).html();
    $(button)
      .data('title', title)
      .addClass("btn-primary")
      .attr("disabled", true)
      .html('<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> Loading...');
  } else {
    $(button)
      .removeClass("btn-primary")
      .attr("disabled", false)
      .html($(button).data('title')); // Hoặc nội dung ban đầu của button
  }
}

function getTableDataCheckbox(table) {
  var data = table
    .rows(function (idx, data, node) {
      var checkbox = $(node).find(
        'input.dt-checkbox-select'
      );
      return checkbox.prop("checked") && !checkbox.prop("disabled");
    })
    .data()
    .toArray();
  return data;
}

// === DATATABLE PLUGINS (giữ nguyên hoàn toàn) ===
(function ($) {
  try {
    $.fn.dataTable.CheckboxSelect = function (table) {
      table = table.api();

      // 1. Modify colgroup to insert checkbox column
      var $colgroup = $(table.table().node()).find('colgroup');
      if ($colgroup.length) {
        var $newCol = $('<col>')
          .attr('data-dt-column', '0')
          .css('width', '30px');
        $colgroup.prepend($newCol);

        $colgroup.find('col[data-dt-column]').each(function () {
          var currentColumn = parseInt($(this).attr('data-dt-column'));
          $(this).attr('data-dt-column', currentColumn + 1);
        });
      }

      // 2. Add header checkbox for select-all if not exists
      if (!$(table.table().header()).find('th.checkbox-select-header').length) {
        var newId = (new Date).getTime();
        $(table.table().header()).find('tr').each(function () {
          $(this).prepend(
            '<th class="checkbox-select-header text-center" style="width: 30px;">' +
            '<div class="custom-control custom-checkbox checkbox-lg">' +
            '<input type="checkbox" class="custom-control-input dt-checkbox-select-all" id="select_all_' + newId + '">' +
            '<label class="custom-control-label" for="select_all_' + newId + '"></label>' +
            '</div>' +
            '</th>'
          );
        });
      }

      var _tableId = (new Date).getTime();
      // Function to add checkbox to a row if not exists
      function addCheckboxToRow(row) {
        var $row = $(row.node());
        if ($row.find('td.checkbox-select-cell').length === 0) {
          var rowIndex = table.row(row).index();
          var checkboxId = _tableId + 'checkbox_row_' + rowIndex;
          var checkboxHtml =
            '<td class="checkbox-select-cell align-middle text-center" style="width: 30px;">' +
            '<div class="custom-control custom-checkbox checkbox-lg checkbox-circle">' +
            '<input type="checkbox" class="custom-control-input dt-checkbox-select" name="checkbox_item" id="' + checkboxId + '">' +
            '<label class="custom-control-label" for="' + checkboxId + '"></label>' +
            '</div>' +
            '</td>';
          $row.prepend(checkboxHtml);
        }
      }

      // 3. Add checkboxes to existing rows
      table.rows().every(function () {
        addCheckboxToRow(this);
      });

      // 4. On each draw, check and add checkbox column if needed
      table.on('draw.dt', function () {
        table.rows({ filter: 'applied' }).every(function () {
          addCheckboxToRow(this);
        });
      });

      // 5. Handle header checkbox (select all / deselect all) - only affect plugin checkboxes
      $(table.table().header()).on('click', '.dt-checkbox-select-all', function (e) {
        var isChecked = $(this).prop('checked');
        table.$('.dt-checkbox-select').prop('checked', isChecked);
        e.stopPropagation(); // Ngăn sự kiện lan truyền ra ngoài
      });

      // 6. Handle row selection with special handling for Shift and Ctrl/Cmd keys
      var lastChecked = null;
      var isShiftPressed = false;

      $(document).on('keydown', function (e) {
        if (e.key === 'Shift') isShiftPressed = true;
      });

      $(document).on('keyup', function (e) {
        if (e.key === 'Shift') isShiftPressed = false;
      });

      // 7. Click event for rows, excluding checkbox column
      $(table.table().body()).on('click', 'tr', function (e) {
        var $targetCell = $(e.target).closest('td');
        if ($targetCell.hasClass('checkbox-select-cell')) {
          return;
        }

        var $checkbox = $(this).find('.dt-checkbox-select');
        if (isShiftPressed && lastChecked) {
          var rows = table.rows({ filter: 'applied' }).nodes();
          var start = $(rows).index(lastChecked);
          var end = $(rows).index(this);
          var checkStatus = lastChecked.find('.dt-checkbox-select').prop('checked');
          $(rows)
            .slice(Math.min(start, end), Math.max(start, end) + 1)
            .find('.dt-checkbox-select')
            .prop('checked', checkStatus);
        } else if (e.ctrlKey || e.metaKey) {
          $checkbox.prop('checked', !$checkbox.prop('checked'));
        } else {
          table.$('.dt-checkbox-select').prop('checked', false);
          $checkbox.prop('checked', true);
        }
        lastChecked = $(this);
      });

      // 8. Prevent checkbox click from propagating to row - only for plugin checkboxes
      $(table.table().body()).on('click', '.dt-checkbox-select', function (e) {
        e.stopPropagation();
      });

      return this;
    };
  } catch (error) {
    console.log('DataTable Checkbox', error);
  }
})(jQuery);

// === INITIALIZATION (giữ nguyên hoàn toàn) ===
try {
  if ($.fn.select2) {
    $.fn.select2.defaults.set("theme", "bootstrap");
  }

  $(".navbar-crm .nav-link").on("click", function () {
    $(".navbar-crm").find(".active").removeClass("active");
    $(this).addClass("active");
  });
  $(function () { });
} catch (error) { }

$(document).ready(function () {
  $(document).on("show.bs.modal", ".modal", function () {
    if ($(".modal:visible").length) {
      $("body").addClass("modal-open");
    }
  });

  $(document).on("hidden.bs.modal", ".modal", function () {
    if ($(".modal:visible").length === 0) {
      $("body").removeClass("modal-open");
    }
  });
});
