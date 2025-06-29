const RegFormService = (function () {
  const API_ENDPOINTS = {
    GET_ALL: '/asset:registrationForm/getAll',
    GET: '/asset:registrationForm/get',
    STORE: '/asset:registrationForm/store',
    UPDATE: '/asset:registrationForm/update',
    DELETE: '/asset:registrationForm/delete',
    GET_DETAILS: '/asset:detailForm/get',
    GET_ROOM_DETAILS: '/asset:RoomFormDetail/get',
    DELETE_DETAIL: '/asset:detailForm/delete',
    DELETE_ROOM_DETAIL: '/asset:RoomFormDetail/delete',
    CHANGE_STATUS: '/asset:registration-form/changeStatus',
    GET_TYPES: '/asset:form-type/getAll',
    CHECK_AVAILABILITY: '/asset:registrationForm/checkAvailability',
    GET_HISTORY: '/asset:registration-history/get',
    ADD_COMMENT: '/asset:registration-history/store',
    GET_INVENTORY: '/asset:inventory/getSummary',

    // Additional endpoints for getting assets
    GET_ITEMS: '/asset:item/getAll',
    GET_STORAGE_ITEMS: '/asset:item/getStorageItem',
    GET_ROOMS: '/asset:room/getAll',
    GET_STAFF: '/resource:staff/getAll',
    GET_CLASS_PERIODS: '/resource:classPeriod/getAll',
    GET_CLASSES: '/resource:class/get'
  };

  return {
    /**
     * Get all registration forms with filtering
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getAll: function (params) {
      return Http().api(API_ENDPOINTS.GET_ALL, params).get();
    },

    /**
     * Get a specific registration form by key
     * @param {string} formKey - The form key to get
     * @returns {Promise} - jQuery Promise
     */
    get: function (formKey) {
      return Http().api(API_ENDPOINTS.GET, { form_key: formKey }).get();
    },

    /**
     * Get details for a registration form (items and rooms)
     * @param {string} formKey - The form key to get details for
     * @returns {Promise} - jQuery Promise with both item details and room details
     */
    getDetails: function (formKey) {
      return Http().api(API_ENDPOINTS.GET_DETAILS, { form_key: formKey }).get();
    },

    /**
     * Get room details for a registration form
     * @param {string} formKey - The form key to get room details for
     * @returns {Promise} - jQuery Promise
     */
    getRoomDetails: function (formKey) {
      return Http().api(API_ENDPOINTS.GET_ROOM_DETAILS, { form_key: formKey }).get();
    },

    /**
     * Save a registration form - creates new or updates existing based on form_key
     * @param {FormData} formData - The form data to save
     * @returns {Promise} - jQuery Promise
     */
    save: function (formData, callback) {
      const formKey = formData.get('form_key');
      const api = formKey ? API_ENDPOINTS.UPDATE : API_ENDPOINTS.STORE;
      return Http().api(api, formData).saveForm(callback);
    },

    /**
     * Delete a registration form
     * @param {string} formKey - The form key to delete
     * @returns {Promise} - jQuery Promise
     */
    delete: function (formKey) {
      return Http().api(API_ENDPOINTS.DELETE, { form_key: formKey }).save();
    },

    /**
     * Delete an item detail from a form
     * @param {string} detailKey - The detail key to delete
     * @returns {Promise} - jQuery Promise
     */
    deleteDetail: function (params) {
      if (!params.detail_key) {
        return $.Deferred().reject({
          responseJSON: { msg: "Detail key is required for deletion" }
        }).promise();
      }
      return Http().api(API_ENDPOINTS.DELETE_DETAIL, params).save();
    },

    /**
     * Delete a room detail from a form
     * @param {string} detailKey - The detail key to delete
     * @returns {Promise} - jQuery Promise
     */
    deleteRoomDetail: function (params) {
      if (!params.detail_key) {
        return $.Deferred().reject({
          responseJSON: { msg: "Detail key is required for deletion" }
        }).promise();
      }
      return Http().api(API_ENDPOINTS.DELETE_ROOM_DETAIL, params).save();
    },

    /**
     * Change the status of a registration form
     * @param {Object} params - Parameters including form_key, status, and staff_id
     * @returns {Promise} - jQuery Promise
     */
    changeStatus: function (params) {
      return Http().api(API_ENDPOINTS.CHANGE_STATUS, params).save();
    },

    /**
     * Get all form types
     * @param {Object} params - Optional filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getFormTypes: function (params = { is_damaged_form: 0 }) {
      return Http().api(API_ENDPOINTS.GET_TYPES, params).get();
    },

    /**
     * Check availability for items and rooms
     * @param {Object} params - Parameters with items_json and rooms_json
     * @returns {Promise} - jQuery Promise
     */
    checkAvailability: function (params) {
      return Http().api(API_ENDPOINTS.CHECK_AVAILABILITY, params).get();
    },

    /**
     * Get history for a registration form
     * @param {string} formKey - The form key to get history for
     * @returns {Promise} - jQuery Promise
     */
    getHistory: function (formKey) {
      return Http().api(API_ENDPOINTS.GET_HISTORY, { form_key: formKey }).get();
    },

    /**
     * Add a comment to a registration form's history
     * @param {Object} params - Parameters including form_key and comment
     * @returns {Promise} - jQuery Promise
     */
    addComment: function (params) {
      return Http().api(API_ENDPOINTS.ADD_COMMENT, params).save();
    },

    /**
     * Get inventory summary for items
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getInventory: function (params) {
      return Http().api(API_ENDPOINTS.GET_INVENTORY, params).get();
    },

    /**
     * Get all available items
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getItems: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_ITEMS, params).get();
    },

    /**
     * Get items with storage information
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getStorageItems: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_STORAGE_ITEMS, params).get();
    },

    /**
     * Get all available rooms
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getRooms: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_ROOMS, params).get();
    },

    /**
     * Get all staff
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getStaff: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_STAFF, params).get();
    },

    /**
     * Get all class periods
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getClassPeriods: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_CLASS_PERIODS, params).get();
    },

    /**
     * Get all classes
     * @param {Object} params - Filter parameters
     * @returns {Promise} - jQuery Promise
     */
    getClasses: function (params = {}) {
      return Http().api(API_ENDPOINTS.GET_CLASSES, params).get();
    },

    /**
     * Helper function to convert FormData to JSON for items and rooms
     * @param {FormData} formData - The form data to process
     * @returns {Object} - Object with processedData
     */
    processFormData: function (formData) {
      const result = {
        formFields: {},
        itemsData: [],
        roomsData: []
      };

      // Process main form fields
      for (let [key, value] of formData.entries()) {
        if (!key.includes('[') && !key.includes('_json')) {
          result.formFields[key] = value;
        }
      }

      // Process items
      const itemRows = document.querySelectorAll('#item_borrowing_container .item-row');
      itemRows.forEach(function (row) {
        const rowId = row.getAttribute('id');
        const index = rowId.replace('item_row_', '');
        const itemKey = row.querySelector(`[name="items[${index}][item_key]"]`).value;
        const quantity = row.querySelector(`[name="items[${index}][quantity]"]`).value;
        const notes = row.querySelector(`[name="items[${index}][notes]"]`).value;
        const detailKey = row.getAttribute('data-detail_key') || '';

        // Get selected option to extract data attributes
        const selectedOption = row.querySelector(`[name="items[${index}][item_key]"] option:selected`);
        const storageItemKey = selectedOption ? (selectedOption.getAttribute('data-storage_item_key') || '') : '';
        const serialKey = selectedOption ? (selectedOption.getAttribute('data-serial_key') || '') : '';

        if (itemKey && quantity) {
          result.itemsData.push({
            item_key: itemKey,
            quantity: quantity,
            notes: notes || '',
            detail_key: detailKey,
            storage_item_key: storageItemKey,
            serial_key: serialKey
          });
        }
      });

      // Process rooms
      const roomRows = document.querySelectorAll('#room_booking_container .room-row');
      roomRows.forEach(function (row) {
        const rowId = row.getAttribute('id');
        const index = rowId.replace('room_row_', '');
        const roomKey = row.querySelector(`[name="rooms[${index}][room_key]"]`).value;
        const borrowingDate = row.querySelector(`[name="rooms[${index}][borrowing_date]"]`).value;
        const classPeriodKey = row.querySelector(`[name="rooms[${index}][class_period_key]"]`).value;
        const startTime = row.querySelector(`[name="rooms[${index}][start_time]"]`).value;
        const endTime = row.querySelector(`[name="rooms[${index}][end_time]"]`).value;
        const classKey = row.querySelector(`[name="rooms[${index}][class_key]"]`).value;
        const notes = row.querySelector(`[name="rooms[${index}][notes]"]`).value;
        const detailKey = row.getAttribute('data-detail_key') || '';

        if (roomKey && borrowingDate && startTime && endTime) {
          result.roomsData.push({
            room_key: roomKey,
            borrowing_date: borrowingDate,
            class_period_key: classPeriodKey || null,
            start_time: startTime,
            end_time: endTime,
            class_key: classKey || null,
            notes: notes || '',
            detail_key: detailKey
          });
        }
      });

      return result;
    },

    /**
     * Utility function to format dates in YYYY-MM-DD format
     * @param {Date|string} date - The date to format
     * @returns {string} - Formatted date string
     */
    formatDate: function (date) {
      if (!date) return '';
      return moment(date).format('YYYY-MM-DD');
    },

    /**
     * Utility function to check if a date is a weekend
     * @param {Date|string} date - The date to check
     * @returns {boolean} - True if weekend, false otherwise
     */
    isWeekend: function (date) {
      if (!date) return false;
      const day = moment(date).isoWeekday();
      return day === 6 || day === 7; // 6 = Saturday, 7 = Sunday
    },

    /**
     * Get form tabs configuration
     * @returns {Object} - Configuration for different form tabs
     */
    getFormTabs: function () {
      return {
        "BOTH": { code: "BOTH", showItems: true, showRooms: true },
        "ONLY_ASSET": { code: "ONLY_ASSET", showItems: true, showRooms: false },
        "ONLY_ROOM": { code: "ONLY_ROOM", showItems: false, showRooms: true }
      };
    },

    /**
     * Get status information
     * @returns {Object} - Information about different statuses
     */
    getStatusInfo: function () {
      return {
        'in_progress': { badge: 'secondary', text: 'In Progress', vi: 'Đang xử lý' },
        'approved': { badge: 'primary', text: 'Approved', vi: 'Đã duyệt' },
        'borrowed': { badge: 'info', text: 'Borrowed', vi: 'Đã mượn' },
        'rejected': { badge: 'danger', text: 'Rejected', vi: 'Đã từ chối' },
        'pending_return_confirmation': { badge: 'warning', text: 'Pending Return', vi: 'Đã trả' },
        'completed': { badge: 'success', text: 'Completed', vi: 'Đã hoàn thành' },
        'expired': { badge: 'dark', text: 'Expired', vi: 'Quá hạn' }
      };
    },

    /**
     * Get item type information
     * @returns {Object} - Information about different item types
     */
    getItemTypes: function () {
      return {
        1: { name: 'Fixed Asset', vi: 'Tài sản cố định', class: 'badge-primary' },
        2: { name: 'Consumable', vi: 'Tài sản tiêu hao', class: 'badge-success' },
        3: { name: 'Controlled Consumable', vi: 'Tài sản tiêu hao có kiểm soát', class: 'badge-warning' }
      };
    }
  };
})();