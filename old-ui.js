/**
 * @version: 4.0
 * @date:
 */
$("#btn_add_form_type").click(function () {
  $("#form_type_modal").modal("show");
});
var _selectEmail = "";
if ($("#_key").val() && $("#_key").val() != 0) {
  $("#reg_form_filter [name=form_key]").val($("#_key").val());
  $("#reg_form_filter").hide();
}
var validatorItemList = {};
var modalItemCustomSelects = [];
var validatorRoomList = {};
var damagedFormValidators = {};
var tableRegForms;
const _user_email = crm_get_localStorge("_user_email");
Auth.setToken();
Auth.checkPermissions(function () { });
changeLanguage();

const expectedDueDate = InputType()
  .set("#formItemDate [name=expected_due_date]")
  .date();
var borrowingDateStartFilter = InputType()
  .set("#reg_form_filter [name=borrowing_date_start]")
  .date();
var borrowingDateEndFilter = InputType()
  .set("#reg_form_filter [name=borrowing_date_end]")
  .date();

borrowingDateEndFilter.change("");

$("#reg_form_filter [name=borrowing_date_start]").change(function () {
  borrowingDateEndFilter = InputType(
    "#reg_form_filter [name=borrowing_date_end]",
    {
      minDate: moment(borrowingDateStartFilter.get().startDate),
    }
  ).date();
  borrowingDateStartFilter = InputType(
    "#reg_form_filter [name=borrowing_date_start]",
    {
      maxDate: moment(borrowingDateEndFilter.get().startDate),
    }
  ).date();
});

const damagedDate = InputType()
  .set("#damaged_record_modal [name=damaged_date]")
  .date();
const dueDate = InputType().set("#formItemDate [name=due_date]").date();
var dateInputOptions = {};
function getWeekendDateRange(currentDate = new Date()) {
  const result = {};
  // Lấy ngày hiện tại
  const today = moment(currentDate);

  // Lấy ngày nhỏ nhất cách ngày hiện tại 2 ngày nhưng không phải là thứ 7 hoặc chủ nhật
  var minDate = today.add(2, "days");

  while (minDate.isoWeekday() === 6 || minDate.isoWeekday() === 7) {
    minDate = minDate.add(1, "days");
  }

  if (moment(currentDate).isoWeekday() === 5) {
    minDate.add(1, "days");
  }
  result.minDate = minDate.format("YYYY-MM-DD");

  // Lấy ngày lớn nhất cách ngày nhỏ nhất đủ 2 tuần trừ đi thứ 7 và chủ nhật
  var maxDate = minDate.add(14, "days");
  while (maxDate.isoWeekday() === 6 || maxDate.isoWeekday() === 7) {
    maxDate = maxDate.add(1, "days");
  }

  result.maxDate = maxDate.format("YYYY-MM-DD");
  return { minDate: moment(result.minDate), maxDate: moment(result.maxDate) };
}
dateInputOptions = getWeekendDateRange();

var borrowingDate = InputType(
  "#formItemDate [name=borrowing_date]",
  dateInputOptions
).date();

const modalSelectStaffKey = initAjaxTomSelect(
  "#modalSelectStaffId",
  Http().getApiHost("/resource:user/get"),
  function (data) {
    return {
      text: data.user_id + " - " + data.user_name,
      value: data.user_id + " - " + data.user_name,
    };
  }
).params({
  "types[]": "lsts_hr_staff"
}).first(null);



const selectFormTypeFilter = initAjaxTomSelect(
  "#reg_form_filter [name=type_key]",
  Http().getApiHost("/asset:formType/getAll"),
  function (data) {
    return {
      text: data.type_name,
      value: data.type_key,
      email: data.email,
    };
  },
  function (res) {
    return res.data;
  }
);
// Function to set selected value based on data-email
function setSelectedByEmail(email) {
  // Get all options from TomSelect
  select = selectFormTypeFilter.select2();
  const options = select.options;

  // Find the option where data-email matches
  for (let key in options) {
    if (options[key].email === email) {
      // Set the value as selected
      select.setValue(key);
      break; // Remove this if you want to allow multiple matches
    }
  }
}


selectFormTypeFilter.get(function () {
  setSelectedByEmail(_user_email)
});
const modalSelectSubjectKey = initAjaxTomSelect(
  "#equip_modal [name=subject_key]",
  Http().getApiHost("/resource:subject/getAll"),
  function (data) {
    return {
      text: data.subject_name + " / " + data.subject_name_en,
      value: data.subject_key,
    };
  },
  function (res) {
    return res.data;
  }
);
modalSelectSubjectKey.first({
  value: "",
  text: " --  Subject --",
  vi: " --  Môn học --",
});
modalSelectSubjectKey.get();

//
const staffKeyFilter = initAjaxTomSelect(
  "#reg_form_filter [name=staff_id]",
  Http().getApiHost("/resource:user/get"),
  function (data) {
    return {
      text: data.user_id + " - " + data.user_name,
      value: data.user_id + " - " + data.user_name,
      email: data.email
    };
  },

).params({
  "types[]": "lsts_hr_staff"
})

staffKeyFilter.value('');



initAjaxTomSelect("#reg_form_filter [name=has_damaged]")

const subjectKey = initAjaxTomSelect(
  "#reg_form_filter [name=subject_key]",
  Http().getApiHost("/resource:subject/getAll"),
  function (data) {
    return {
      text: data.subject_name + " / " + data.subject_name_en,
      value: data.subject_key,
    };
  },
  function (res) {
    return res.data;
  }
).params({
  "types[]": "lsts_hr_staff"
});

subjectKey.get();
const roomKeyFilter = initAjaxTomSelect(
  "#reg_form_filter [name=room_key]",
  Http().getApiHost("/resource:room/get"),
  function (data) {
    var floor = data.room_floor ? " - Tầng " + data.room_floor : " ";
    return {
      text: data.room_id + floor + " - " + data.room_name,
      value: data.room_key,
    };
  }
).params({
  school_key: $("#equip_modal [name=school_key]").val(),
});

const itemKeyFilter = initAjaxTomSelect(
  "#reg_form_filter [name=item_key]",
  Http().getApiHost("/asset:item/getCategory?level[]=2"),
  function (item) {
    return {
      text: item.code + " - [" + item.item_name + "]",
      value: item.item_key,
    };
  }
).params({
  length: 25,
  level: [2],
});

itemKeyFilter.select2();


roomKeyFilter.select2();

roomKeyFilter.value(null);
itemKeyFilter.value(null);

borrowingDateStartFilter.change("");
let editorWindow = null;
function openEditorWindow(formKey = null, formType = null, options = {}) {
  // Đóng window hiện tại nếu đang mở
  if (editorWindow && !editorWindow.closed) {
    editorWindow.close();
    editorWindow = null;
  }

  let url = `/crm/urls/assets/reg-form-new/reg-form-editor`;
  let params = [];

  if (formKey) {
    params.push(`form_key=${formKey}`);
  }

  if (formType) {
    params.push(`form_type=${formType}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  const width = 1200;
  const height = 800;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;

  editorWindow = window.open(url, 'RegistrationFormEditor', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`);

  if (editorWindow) {
    const checkWindowClosed = setInterval(function () {
      if (editorWindow.closed) {
        clearInterval(checkWindowClosed);
        editorWindow = null;
        tableRegForms.ajax.reload(null, false);
      }
    }, 500);
  } else {
    Popup.set({ msg: 'Please allow popups for this website to use the editor.' }).error();
  }
}
//Chứa API thêm, xóa, sửa Form đăng ký
const RegistrationForm = (function () {
  return {
    store: function (
      data,
      callback,
      failure = function (res) {
        Popup.set(res).error();
        hideLoading();
      }
    ) {
      Http()
        .api("/asset:registrationForm/store", data, failure)
        .saveForm(callback);
    },
    update: function (data, callback) {
      Http()
        .api("/asset:registrationForm/update", data, function (res) {
          Popup.set(res).error();
          hideLoading();
        })
        .saveForm(callback);
    },
    delete: function (data, callback) {
      Http().api("/asset:registrationForm/delete", data).save(callback);
    },
    deleteDetail: function (data, callback) {
      Http().api("/asset:detailForm/delete", data).save(callback);
    },
    deleteDateTime: function (data, callback) {
      Http().api("/asset:RoomFormDetail/delete", data).save(callback);
    },
    get: function (data, callback) {
      Http().api("/asset:registrationForm/get", data).get(callback);
    },
    getSummary: function (data, callback) {
      Http()
        .api("/asset:Inventory/getSummary?length=1&start=0", data)
        .get(callback);
    },
    getDetails: function (data, callback) {
      Http().api("/asset:detailForm/get", data).get(callback);
    },
    getRoomFormDetails: function (data, callback) {
      Http().api("/asset:RoomFormDetail/get", data).get(callback);
    },
    getItem: function (data, callback) {
      Http().api("/asset:item/get", data).get(callback);
    },
    getHistory: function (data, callback) {
      Http().api("/asset:registration-history/get", data).get(callback);
    },
    addComment: function (data, callback) {
      Http().api("/asset:registration-history/store", data).get(callback);
    },
    changeStatus: function (data, callback) {
      Http()
        .api("/asset:registration-form/changeStatus", data)
        .save(callback);
    },
    getAll: function (callback = function () { }) {
      var table = $("#equipment_table").DataTable({
        processing: true,
        serverSide: true,
        // select: true,
        searching: false,
        ajax: {
          url: Http().getApiHost("/asset:registrationForm/getAll"),
          data: function (data) {
            data.storage_key = $("#reg_form_filter [name=storage_key]").val();
            data.staff_id = $("#reg_form_filter [name=staff_id]").val();
            data.status = $("#reg_form_filter [name=status]").val();
            data.status_list = $("#reg_form_filter [name=status_list]").val();
            data.item_key = $("#reg_form_filter [name=item_key]").val();
            data.room_key = $("#reg_form_filter [name=room_key]").val();
            data.form_key = $("#reg_form_filter [name=form_key]").val();
            data.form_keys = $("#reg_form_filter [name=form_keys]").val();
            data.type_key = $("#reg_form_filter [name=type_key]").val();
            data.has_damaged = $("#reg_form_filter [name=has_damaged]").val();
            data.school_year = $("#reg_form_filter [name=school_year]").val();
            data.subject_key = $("#reg_form_filter [name=subject_key]").val();

            if (!Auth.hasPermission("Root_Admin")) {
              if (!Auth.hasPermission("Asset_Manager")) {
                data.user_key = crm_get_localStorge("_user_key");
              } else {
                //data.manager_key = crm_get_localStorge("_user_key");
              }
            }
            data.borrowing_date_start =
              borrowingDateStartFilter.get().startDate;
            data.borrowing_date_end = borrowingDateEndFilter.get().startDate;

            data.item_type = itemKeyFilter.data()
              ? itemKeyFilter.data().item_type_key
              : "";

            if (data.staff_id) {
              data.staff_id = data.staff_id.split("-")[0];
            }
            showLoading();
            data.search = $("#reg_form_filter [name=search]").val();
          },
        },
        lengthMenu: [
          [10, 25, 100, 500, -1],
          [10, 25, 100, 500, "All"],
        ],
        order: [[0, "desc"]],
        columns: [
          {
            data: "form_key",
            name: "F.form_key",
            width: 50,
            className: "align-middle text-center",
          },
          {
            data: "form_code",
            name: "form_code",
            width: 250,
            className: "align-middle min-200 text-left",

            render: function (data, meta, row) {
              var status = "";
              if (row.status == "in_progress") {
                status =
                  '<span class="badge h6 d-inline text-left badge-warning" vi="Đang xử lý">' +
                  row.status +
                  "</span>";
              } else if (row.status == "approved") {
                status =
                  '<span class="badge h6 d-inline text-left  badge-success" vi="Đã duyệt">' +
                  row.status +
                  "</span>";
              } else if (row.status == "cancelled") {
                status =
                  '<span class="badge h6 d-inline text-left badge-danger" vi="Đã hủy">' +
                  row.status +
                  "</span>";
              } else if (row.status == "pending_return_confirmation") {
                status =
                  '<span class="badge h6 d-inline text-left badge-info" vi="Đã trả">' +
                  row.status +
                  "</span>";
              } else if (row.status == "completed") {
                status =
                  '<span class="badge h6 d-inline text-left text-white badge-dark" vi="Hoàn thành">' +
                  row.status +
                  "</span>";
              } else if (row.status == "borrowed") {
                status =
                  '<span class="badge h6 d-inline text-left badge-light" vi="Đã mượn">' +
                  row.status +
                  "</span>";
              } else {
                status =
                  '<span class="badge h6 d-inline text-left badge-light">' +
                  row.status +
                  "</span>";
              }
              return `<ul>
                <li ><b class="text-uppercase"> ${row.staff_id}</b></li>
                <li class=""><span vi="Trạng thái">Status</span>: ${status} </li> 
                <li class=""><span vi="Mã phiếu">Code</span>:<b> ${row.form_code} </b></li>
                <li class="mt-1 "><span vi="Tiêu đề">Subject</span>: ${row.subject_name
                }</li>
                <li class="mt-1 "><span vi="Loại">Type</span>: ${row.type_name
                }</li>

                </ul>`;
            },
          },

          {
            data: "item_details",
            width: 300,
            className: " align-middle min-300",
            render: function (data, meta, row) {
              var result = "";

              if (data) {
                var rows = data;

                if (rows.length > 0) {
                  result += `<span class='font-weight-bold'>Tổng số tài sản:${rows.length} </span>`;
                  var itemRow = "";
                  $(rows).each(function (i, el) {
                    itemRow += `<li>${el.item_name} x ${el.quantity}</li>`;
                  });
                  result += `<ul class=''>${itemRow}</ul>`;
                  result += `<span class=' font-weight-bold'>Timeline </span><ul><li class="mt-1 "><span vi="Ngày nhận vật tư">Form Date</span>: ${ConvertDate().toVi(row.borrowing_date)}</li>
                  ${row.due_date ? `<li class="mt-1 "><span vi="Ngày xuất kho">Due Date</span>: ${ConvertDate().toVi(row.due_date)}</li>` : ""} 
                  ${row.expected_due_date ? `<li class="mt-1 "><span vi="Hạn trả (nếu có)">Expected Due Date</span>: ${ConvertDate().toVi(row.expected_due_date)}</li>` : ""}
                  </ul>`
                }
              }


              if (row.item_conflict && row.item_conflict.length > 0) {
                $(this).addClass("alert alert-danger");

                var itemDetails =
                  " <span class='text-danger font-weight-bold'>Tồn kho không đủ, số lượng hiện tại </span><ul>";
                $(row.item_conflict).each(function (i, el) {
                  itemDetails += `<li>${el.item_name} <span> : </span>  ${Number.parseFloat(el.available_quantity)}</li>`;
                });

                result = result + itemDetails + "</ul>";
              }

              return result;
            },
          },

          {
            data: "room_details",
            width: 300,
            className: "align-middle min-300",
            render: function (data, meta, row) {
              var roomDetails = "";

              if (data) {
                var rows = data;
                if (rows.length > 0) {
                  $(rows).each(function (i, el) {
                    roomDetails += `
                      <li>
                        ${el.borrowing_date} / ${el.room_id} / ${el.start_time}-${el.end_time} / ${el.period_name}
                      </li>`;
                  });
                }
              }

              roomDetails = `<ul class=''>${roomDetails}</ul>`;

              if (row.room_conflict && row.room_conflict.length > 0) {
                roomDetails += `
                  <span class='font-weight-bold text-danger'>Xung đột lịch với:</span><br>`;

                $(row.room_conflict).each(function (i, el) {
                  $(this).addClass("alert alert-danger");
                  roomDetails += `<li>
                    ${el.borrowing_date} / ${el.room_id} / ${el.start_time}-${el.end_time}
                    ${el.period_name ? ` / ${el.period_name}` : ''}
                    / ${el.staff_id}
                    ${el.form_key ? `/ Phiếu đăng ký số: ${el.form_key}` : ''}
                    </li>`;
                });
              }

              return roomDetails;

            },
          },
          {
            data: "damaged_records",
            className: "align-middle min-200 ",

            render: function (data, meta, row) {
              var result = "";
              if (data) {
                var rows = data;
                if (rows.length > 0) {
                  $(rows).each(function (i, el) {
                    result +=
                      "<li>" + el.item_name + " : " + el.quantity + "</li>";
                  });
                }
              }
              var btn = "";
              if (row.damaged_records.length > 0) {
                btn += `<button title="" vi="Xem & ký phiếu tổn hao" class="btn btn-danger btn_open_damaged_record  mt-1 mr-1"  data-form_key='${row.form_key}'>
                <i class="fas fa-2x fa-external-link"></i>Print Damaged Record </button>`;
              }
              if (
                ["pending_return_confirmation", "borrowed"].includes(row.status)
              ) {
                btn += `<button title="" vi="Lập/Sửa phiếu tổn hao" class="btn btn-green btn_add_damaged_record  mt-1 mr-1"  data-form_key='${row.form_key}'>
                <i class="fas fa-2x fa-plus-circle"></i>Edit Dmg Record </button>`;
              }
              var info = `<span class="">----------- ---------- -----<br>Ngày lập phiếu: ${row.damaged_date ? ConvertDate().toVi(row.damaged_date) : ""
                }
              <br>Phụ trách PTN xác nhận: <b>${row.manager_name ? row.manager_name : " ....."
                } </b>
              <br>Giáo viên xác nhận:  <b>${row.staff_name ? row.staff_name : " ....."
                } </b>
              <br>Học sinh xác nhận: <b> ${row.student_name ? row.student_name : " ....."
                }</b> <br></span>`;

              if (row.attach_file) {
                info += `<span class="" vi="File đính kèm: "> Attach File: </span><a href="${Http().getHost(
                  row.attach_file
                )}" target="_blank" rel="noopener noreferrer">Xem</a>`;
              }
              info += "<br>----------- -------- -------<br>";
              if (data.length > 0 || row.attach_file) {
                return (
                  "<span class=''>" +
                  result +
                  "</span>" +
                  info +
                  btn
                );
              } else {
                return btn;
              }
            },
          },

          {
            data: "created_at",
            name: "created_at",
            width: 200,
            className: "align-middle min-200 ",
            render: function (data, meta, row) {
              return (
                "<span class=''>Ngày tạo: " +
                ConvertDate().toViDateTime(data) +
                "<br>Người tạo: " +
                row.create_by +
                "<br> -----     ----<br> Ngày sửa: " +
                ConvertDate().toViDateTime(row.updated_at) +
                "<br>Người sửa: " +
                row.update_by +
                "</span>"
              );
            },
          },

          {
            data: null,
            width: 250,

            className: "align-middle ",
            render: function (data, meta, row) {
              var status = "";
              var value = "";

              if (Auth.getPermissions().includes("Lab_Manager")) {
                if (row.status == "in_progress") {
                  row.status = row.default_status;
                }

                if (row.status == "in_progress") {
                  status = "Approve Form";
                  value = "approved";
                  vi = "Duyệt phiếu mượn";
                } else if (row.status == "approved") {
                  status = "Borrow";
                  value = "borrowed";
                  vi = "Xác nhận mượn";
                } else if (row.status == "pending_return_confirmation") {
                  status = "Complete Form";
                  value = "completed";
                  vi = "Xác nhận hoàn thành";
                } else if (row.status == "borrowed") {
                  status = "Return Confirmation";
                  value = "pending_return_confirmation";
                  vi = "Xác nhận trả đồ";
                }
              } else {
                if (row.status == "borrowed") {
                  status = "Return Confirmation";
                  value = "pending_return_confirmation";
                  vi = "Xác nhận trả đồ";
                }
              }

              var btnChangeStatus = '';
              if (status) {
                btnChangeStatus +=
                  '<button vi="' +
                  vi +
                  '" class="btn btn-green shadow btn_change_status  mt-1 mr-1" data-status=' +
                  value +
                  " data-form_key=" +
                  row.form_key +
                  ' data-staff_id="' +
                  row.staff_id +
                  '"> <i class="fas fa-2x fa-check-circle"></i> ' +
                  status +
                  " </button>";
              }
              //      <button class="btn btn-info  btn_form_duplicate  mt-1 mr-1"  data-form_key='${row.form_key}'  > <i class="fal fa-2x fa-clone" ></i> <span >Copy</span>  </button ></div >
              var btn = `<div style="">${btnChangeStatus}<button class="btn btn-warning  btn_edit_reg_form mt-1 mr-1"
               data-form_key='${row.form_key}'><i class="fas fa-2x fa-edit" ></i> <span vi="Sửa">Edit</span></button>             
                <button title=""  class="btn btn-success btn_view_borrowing_form  mt-1 mr-1"  data-form_key='${row.form_key}'>
                <i class="fas fa-2x fa-signature"></i> <span vi="Xem & ký tên">View & Sign</span></button>
                 <button class="btn btn-danger btn_form_delete  mt-1 mr-1"   data-form_key='${row.form_key}'>
                 <i class="fas fa-2x fa-trash-alt"></i> <span vi="Xóa">Delete</span> </button>`;

              if (!Auth.getPermissions().includes("Lab_Manager")) {
                $(".btn_damaged_record_print").hide();
              }


              if (row.is_damaged_form == 1) {
                return ``;
              }
              return btn;
            },
          },
        ],
        createdRow: function (row, data, index) {
          if (data.status == "pending_return_confirmation") {
            $(row).addClass("alert alert-info");
          } else if (data.status == "approved") {
            $(row).addClass("alert alert-success");
          } else if (data.status == "in_progress") {
            $(row).addClass("");
          } else if (data.status == "completed") {
            $(row).addClass("");
          } else if (data.status == "borrowed") {
            $(row).addClass("alert alert-dark");
          } else if (data.status == "rejected") {
            $(row).addClass("alert alert-danger");
          }

          if (data.status == "borrowed") {
            var now = moment();
            var expectedDueDate = moment(data.expected_due_date);

            if (now.isAfter(expectedDueDate) && data.item_details) {
              $(row).addClass("alert alert-error");
            }
          }
          if (data.room_conflict && data.room_conflict.length > 0) {
            $(row).addClass("alert alert-danger");

            $(data.room_conflict).each(function (i, el) { });
          }

          if (data.item_conflict && data.item_conflict.length > 0) {
            $(row).addClass("alert alert-danger");
          }
        },
        initComplete: function () {
          $(".dt-column-title").each(function (i, el) {
            var title = $(el).parent().attr("data-vi-title");
            if (title) {
              $(el).html(title);
            }
          });
          $.fn.dataTable.CheckboxSelect(this); // Kích hoạt plugin
        },
        drawCallback: callback,
      });
      table.on("responsive-display", function (e, datatable, columns) {
        callback();
        
        changeLanguage();
      });
      return table;
    },
    getGroup: function (data, callback) {
      Http().api("/asset:group/get", data).get(callback);
    },
    getTypes: function (data, callback) {
      Http().api("/asset:form-type/getAll", data).get(callback);
    },
    getAllFormType: function (callback = function () { }) {
      var table = $("#form_type_table").DataTable({
        processing: true,
        serverSide: true,
        searching: true,
        pageLength: 10,
        ajax: {
          url: Http().getApiHost("/asset:form-type/getAll"),
          data: function (data) {
            data.is_damaged_form = 0;
            data.search = data.search.value;
          },
        },
        lengthMenu: [
          [10, 25, 100, 500, -1],
          [10, 25, 100, 500, "All"],
        ],
        order: [[0, "asc"]],
        columns: [
          {
            data: "type_key",
            name: "F.type_key",

            className: "align-middle text-center",
          },
          {
            data: "type_name",
            name: "F.type_name",

            className: "align-middle text-left min-200",
          },
          {
            data: "staff_fullname",
            name: "S.staff_fullname",
            className: "align-middle text-left",
            render: function (data, meta, row) {
              return (
                row.staff_id +
                " - " +
                row.staff_fullname +
                "<br>" +
                row.staff_email
              );
            },
          },
          {
            data: null,

            className: "align-middle text-center",
            render: function (data, meta, row) {
              return `<button class="btn btn-default btn_add_form btn-green"
              data-school_key='${row.school_key}'
              data-type_key='${row.type_key}' 
              data-form_tab='${row.form_tab}' 
              data-manage_by="${row.group_id}" 
              data-manager_key="${row.manager_key}" 
              data-manage_by="${row.group_id}" 
              data-processor="${row.email}">
              <i class="fa fa-2x fa-plus-circle" aria-hidden="true"></i> <span class="lang" vi='Tạo phiếu'>
                Create</span>
            </button>`;
            },
          },
        ],
        createdRow: function (row, data, index) { },
        drawCallback: callback,
      });

      table.on("responsive-display", function (e, datatable, columns) {
        callback();
      });
      return table;
    },
    getExpiredUser: function (data, callback) {
      Http().api("/asset:expired-user/get", data).get(callback);
    },
  };
})();

RegistrationForm.getGroup({}, function (res) {
  var options = '<option value="">-- All --</option>';
  $(res).each(function (i, el) {
    options +=
      '<option value="' +
      el.group_id +
      '">' +
      el.group_id +
      " - " +
      el.group_name +
      "</option>";
  });

  $("select[name=manage_by]").html(options);

  if (Auth.getPermissions().includes("Root_Admin")) {
    $("#reg_form_filter [name=manage_by]").val("");
  } else {
    $("#reg_form_filter [name=manage_by]").val("");
    $("#reg_form_filter [name=manage_by]").parent().hide();
  }

  tableRegForms = RegistrationForm.getAll(function () {
    hideLoading();
    changeLanguage();

    //PHÂN QUYỀN: KHÓA PHIẾU MƯỢN
    RegistrationForm.getExpiredUser(
      {
        user_id: crm_get_localStorge("_staff_id"),
      },
      function (res) {
        if (res && res.user_id && res.expried_times >= 3) {
          $("#btn_add_form_type").remove();
          $("#btn_save_item").remove();

          Popup.set({
            msg: "TẠO PHIẾU MƯỢN BỊ KHÓA",
            errors: [
              "Bạn có nhiều phiếu mượn chưa hoàn thành, hãy hoàn thành phiếu mượn và liên hệ Admin để mở khóa",
            ],
          }).error();
        }
      }
    );

    $(".btn_collapse").click(function () {
      $(this).closest("tr").find(".collapse").collapse("toggle");
    });

    $(".btn_open_damaged_record").click(function () {
      const formKey = $(this).attr("data-form_key");
      window.open(
        Http().getHost(
          "/?p=internal.lab_management.damaged-record.print&form_keys=" +
          formKey
        )
      );
    });
    $(".btn_view_borrowing_form").click(function () {
      const formKey = $(this).attr("data-form_key");
      window.open(
        Http().getHost(
          "/urls/assets/reg-form/" +
          formKey
        )
      );
    });

    //PHÂN QUYỀN: QUYỀN ADMIN
    if (!Auth.getPermissions().includes("Lab_Manager")) {
      $("[data-permission=Lab_Manager]").hide();
    }
  });
});
RegistrationForm.getTypes({}, function (res) {
  var option_filter = '<option value="">-- All --</option>';
  var option_modal = '<option value="">-- All --</option>';
  $(res.data).each(function (i, el) {
    if (_selectEmail == el.email || _selectEmail == "") {
      option_filter +=
        '<option value="' + el.type_key + '">' + el.type_name + "</option>";
    }

    option_modal +=
      '<option value="' + el.type_key + '">' + el.type_name + "</option>";
  });
  $("#reg_form_filter [name=type_key]").html(option_filter);
  $("#equip_modal [name=type_key]").html(option_modal);
  $("#equip_modal [name=type_key]").change(function () { });
});

var tableType = RegistrationForm.getAllFormType(function () {
  changeLanguage();
});


/**
 * Module xử lý giao diện, set sự kiện cho các button, input, select
 *
 * Thêm dòng dành cho Form đăng ký
 *
 * @return object
 */
const UIRegForm = (function () {
  var _optionClassPeriod = "";
  function generateClassPeriodSelect(statusOptions, formType) {
    var str = "";
    if (![1, 2].includes(formType)) {
      str += `<option value="">Tùy chỉnh</option>`;
    }
    $(statusOptions).each(function (i, el) {
      const option =
        '<option data-time="' +
        el.start_time +
        " - " +
        el.end_time +
        '" value="' +
        el.class_period_key +
        '">' +
        el.period_name +
        "</option>";

      str += option;
    });

    return str;
  }
  function classPeriodKey(callback = function () { }) {
    Http()
      .api("/resource:classPeriod/getAll", {})
      .get(function (res) {
        callback(res);
      });
  }
  const selectSchoolYear = initAjaxTomSelect(
    "#reg_form_filter [name=school_year]",
    Http().getApiHost("/resource:classYear/getAll"),
    function (data) {
      return {
        value: data.class_year,
        text: data.class_year,
      };
    },
    function (res) {
      return res.data;
    }
  );

  selectSchoolYear.get();

  var modalStatus = initAjaxTomSelect('#equip_modal [name=status]');
  var modalTypeKey = initAjaxTomSelect('#equip_modal [name=type_key]');


  return {
    classPeriodKey: function () {
      return classPeriodKey();
    },
    setSelect2: function () {
      initAjaxTomSelect(
        "#reg_form_filter select[name=status_list]"
      );
    },
    changeStatus: function () {
      const status = $("#equip_modal [name=status]").val();

      if (
        [
          "approved",
          "borrowed",
          "completed",
          "pending_return_confirmation",
        ].includes(status)
      ) {
        $("#btn_add_new_room_form").hide();
        $("#btn_add_new_item_form").hide();
        $("#btn_view_calendar").hide();
        $("#btn_view_items").hide();
        $("#equip_modal #tbody .btn_remove_row_detail").hide();
        $("#equip_modal .btn_copy_row_time").hide();
        $("#equip_modal .btn_remove_row_time ").hide();

        modalSelectStaffKey.select2().disable();
        modalSelectSubjectKey.select2().disable();


        $("#equip_modal [name=class_period_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.disable();
          }
        })
        $("#equip_modal [name=room_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.disable();
          }
        })
        $("#equip_modal [name=class_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.disable();
          }
        })


        for (const value of Object.values(modalItemCustomSelects)) {
          value.select2().lock();
        }
        $("#equip_modal input").attr("disabled", true);
        $("#equip_modal select").not("[name=status]").attr("disabled", true);
        borrowingDate.date({ maxDate: null, minDate: null });
      } else {

        $("#equip_modal input")
          .not("[name=start_time]")
          .not("[data-item_type_key=1]")
          .not("[name=end_time]")
          .not("[name=item_key]")

          .attr("disabled", false);
        $("#equip_modal select")

          .not("[name=item_key]")

          .attr("disabled", false);

        $("#equip_modal #tbody .btn_remove_row_detail").show();
        $("#equip_modal .btn_copy_row_time").show();
        $("#equip_modal .btn_remove_row_time ").show();
        $("#btn_add_new_room_form").show();
        $("#btn_add_new_item_form").show();
        $("#btn_view_calendar").show();
        $("#btn_view_items").show();
        modalSelectSubjectKey.select2().enable();
        for (const value of Object.values(modalItemCustomSelects)) {
          value.select2().unlock();
        }
        $("#equip_modal [name=class_period_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.enable();
          }
        })
        $("#equip_modal [name=room_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.enable();
          }
        })
        $("#equip_modal [name=class_key]").each(function (i, el) {
          var checkSelectPeriod = initAjaxTomSelect(el).select2();
          if (checkSelectPeriod) {
            checkSelectPeriod.enable();
          }
        })
      }

    },
    addItemRow: function (data = null) {
      var rowId = "item_form_" + new Date().getTime();
      var selectItemKey = "select_" + rowId;

      var formType = Number.parseInt($("#equip_form [name=type_key]").val());

      var rows = /* html */ `<div class="card shadow">
        <h4 class="card-header px-3 py-2 bg-secondary text-white"> <span vi="Vật tư ${indexRow}">Item ${indexRow}</span></h4>
        <div class="card-body p-2">
        <form action="#" id='${rowId}'>
        <div class='form-row mb-1'  id='${selectItemKey}'>       
        <div class='col-xl-6 col-lg-6 form-group'><label for='receiver' class='lang' vi='Code - Nơi lưu trữ - Tên vật tư'>Code - Storage - Name</label>
        <select name='item_key'></select></div>
        <div class='col-xl-5 col-lg-6 form-group'><label for='receiver' >
        <span vi='Số lượng'> Quantity</span> 
        <span class="text-danger font-weight-bold" vi=" -- Tối đa"> -- Max: </span>
        <span class='font-weight-bold text-danger max_quantity'></span> 
        <span class="text-danger" vi=" -- Đvt: "> -- Unit: </span>
        <span class="text-danger" name='unit'><span>

        </label>
        <input type='number' id='quantity_${rowId}' min='1' name='quantity' class='form-control'></div>     
        <div class='col-xl-1 col-lg-6 form-group'>
        <label for="form-label">&nbsp;</label>

        <button type="button" class=' btn btn_remove_row_detail btn-danger'>
        <i class='fas fa-times fa-2x'></i><span vi='Xóa bỏ'>Remove</span></button> </div>
        <div class='col-xl-12 col-lg-6 form-group'>
        <textarea type='text' name='note' rows=3 class='form-control' placeholder="Nhập ghi chú của bạn vào đây,enter tiếp tục trả lời không xóa.&#13;&#10;Người mượn:&#13;&#10;NV quản lý: "></textarea></div>
 
        </div></div></div></form></div></div>`;

      $("#tbody").append(rows);

      $("#" + rowId + " [name=quantity]").focus();

      var type = null;
      var paramsDefault = {
        level: [2],
        length: 50,
        manager_key: $("#equip_modal [name=manager_key]").val(),
        form_key: $("#equip_modal [name=form_key]").val(),
        storage_keys: $("#equip_modal [name=storage_keys]").val(),
        storage_item_key: "",
        serial_key: "",

      };

      function summaryCallback(res) {

        if (res.data.length > 0) {
          var inventory = res.data[0];
          if (inventory.last_inventory || inventory.last_inventory == 0) {
            var quantity = Number.parseFloat(inventory.last_inventory);
            $("#" + rowId + " [name=quantity]").attr(
              "placeholder",
              "Số lượng tối đa là: " + quantity
            );

            if (!Auth.getPermissions().includes("Lab_Manager")) {
              $("#" + rowId + " [name=quantity]").attr("max", quantity);
            }

            var label = "Max quantity: ";
            if (crm_get_localStorge("lang") == "vi") {
              label = "Số lượng tối đa: ";
            }
            $("#" + rowId + " .max_quantity").html(quantity);


          }
        }
      }
      //Tạo select2 ajax cho serial_key
      const modalSelectItemKey = initAjaxTomSelect(
        "#" + rowId + " [name=item_key]",
        Http().getApiHost("/asset:item/getStorageItem"),
        function (item) {
          var text = `${item.code} --- [ ${item.storage_name} ] --- [ ${item.item_name} ]`;
          var id = item.storage_item_key;

          if (item.item_type_key == 1) {
            text = `${item.serial_code} --- [ ${item.storage_name} ] --- [ ${item.item_name} ]`;
            id = item.serial_key;
          }

          return {
            text: text,
            value: id,
            item_key: item.item_key,
            unit: item.unit,
            item_type_key: item.item_type_key,
            storage_item_key: item.storage_item_key
              ? item.storage_item_key
              : "",
            serial_key: item.serial_key ? item.serial_key : "",
          };
        }
      ).params(paramsDefault);

      modalSelectItemKey.select2().load('');

      modalItemCustomSelects[selectItemKey] = modalSelectItemKey;


      $("#" + rowId + " select[name=item_key]").change(function () {
        var storageItemSelected = modalSelectItemKey.data();
        if (!storageItemSelected) {
          return 0;
        }

        $("#" + rowId + " [name=unit]").html(storageItemSelected.unit);
        $("#" + rowId + " [name=quantity]").attr(
          "data-item_type_key",
          storageItemSelected.item_type_key
        );

        if (storageItemSelected.item_type_key == 1 || type == 1) {
          //Tài sản cố định
          $("#" + rowId + " [name=quantity]").val(1);
          $("#" + rowId + " [name=quantity]").attr("disabled", true);
        } else {
          //Tài sản tiêu hao và tiêu hao có kiểm soát
          // $("#" + rowId + " [name=quantity]").val(data?.quantity ? Number.parseFloat(data.quantity) : "");
          $("#" + rowId + " [name=quantity]").val("");
          $("#" + rowId + " [name=quantity]").attr("disabled", false);
        }

        if (![18].includes(formType)) {
          RegistrationForm.getSummary(
            {
              item_key: storageItemSelected.item_key,
              serial_key: storageItemSelected.serial_key,
              storage_item_key: storageItemSelected.storage_item_key,
            },
            function (res) {
              summaryCallback(res);
            }
          );
        }

        UIRegForm.changeStatus();

      });
      validatorItemList[rowId] = (
        FormType("#" + rowId)
          .rules({
            quantity: {
              required: true,
              min: 0,
            },
            item_key: {
              required: true,
            },
            note: {
              maxlength: 500,
            },
          })
          .validate()
      );
      //Sự kiện xóa dòng mượn tài sản
      $("#" + rowId + " .btn_remove_row_detail").click(function () {
        var key = $("#" + rowId).attr("data-detail_key");
        var row = $("#" + rowId);

        delete validatorItemList[rowId];

        if (key) {
          RegistrationForm.deleteDetail({ detail_key: key }, function (res) {
            Toast.set(res).success();
            row.remove();
          });
        } else {
          $("#" + rowId).remove();
        }
      });

      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (!['quantity', 'item_key'].includes(key))
            $("#" + rowId + " [name=" + key + "]").val(value);
        }
        $("#" + rowId).attr("data-detail_key", data.detail_key);

        $("#" + rowId + " [name=quantity]").attr(
          "data-item_type_key",
          data.item_type_key
        );
        //Cài giá trị cho ô chọn Tài sản
        modalSelectItemKey.value(
          {
            storage_item_key: data.storage_item_key ? data.storage_item_key : "",
            serial_key: data.serial_key ? data.serial_key : "",
          },
          function (item) {


            $("#" + rowId + " [name=quantity]").val(
              Number.parseFloat(data.quantity)
            );
            if (item[0]) {
              if (item[0].item_type_key == 1) {
                //Tài sản cố định
                $("#" + rowId + " [name=quantity]").val(1);
                $("#" + rowId + " [name=quantity]").attr("disabled", true);

              } else {
                //Tài sản tiêu hao và tiêu hao có kiểm soát
                $("#" + rowId + " [name=quantity]").attr("disabled", false);
              }
              $("#" + rowId + " [name=unit]").html(item[0].unit);

              if (![18].includes(formType)) {
                RegistrationForm.getSummary(
                  {
                    item_key: item[0].item_key,
                    serial_key: item[0].serial_key,
                    storage_item_key: item[0].storage_item_key,
                  },
                  function (res) {
                    summaryCallback(res);
                  }
                );
              }
            }
            UIRegForm.changeStatus();



          }
        );
        //Set up lại
        modalSelectItemKey.params(paramsDefault).select2();

        if (!Auth.getPermissions().includes("Lab_Manager")) {
          $(".custom-control").hide();
        }
      } else {
        modalSelectItemKey.select2().focus();
      }

      changeLanguage();


      indexRow++;
    },
    addRoomRow: function (data = null) {
      var rowId = "time_" + new Date().getTime();
      var formType = Number.parseInt($("#equip_form [name=type_key]").val());

      var row = /* html */ `<div class="card shadow">
      <h4 class="card-header  px-3 py-2 text-white bg-success"> <span vi="Phòng ${indexRoomRow}">Room ${indexRoomRow}</span></h4>
      <div class="card-body p-2">
      <form id="form_${rowId}"> 
      <div id="${rowId}"  class="form-row mb-1">
        <div class="col-xl-2 form-group"><label  vi="Ngày nhận">Date</label><input class="form-control" name="borrowing_date" required></div>
        <div class="col-xl-3 form-group"><label  vi="Phòng dạy">Room</label><select class="" name="room_key" required></select></div>
        <div class="col-xl-2 col-md-3 form-group"><label for="receiver" class="lang" vi="Tiết học" >Class Period </label>
          <select  name="class_period_key" > 
            ${generateClassPeriodSelect(
        _optionClassPeriod,
        formType
      )} </select> 
          </div>
        <div class="col-xl-1 col-md-3 form-group"><label  vi="Từ lúc">Start Time</label><input class="form-control time" name="start_time" required></div>  
        <div class="col-xl-1 col-md-3 col-sm-6 form-group"><label  vi="Tới lúc">End Time</label><input class="form-control time" name="end_time" required></div>
        <div class="col-xl-2 col-md-3 col-sm-6 form-group"><label  vi="Lớp học">Class ID</label><select name="class_key"></select> </div>
        <div class='col-xl-12 form-group group-button-right'>
        <button type="button" class='btn btn_remove_row_time  btn-link-green ' >
        <i class='fas fa-trash-alt fa-2x'></i><span vi='Xóa'>Remove</span> </button>
        <button type="button" class='btn btn_copy_row_time btn-link-green ' ><i class='fas fa-copy fa-2x'></i>
        <span vi='Nhân đôi'>Duplicate</span></button>
        </div> </div></div></div>`;

      $("#detail_borrowing_body").append(row);



      const roomKey = initAjaxTomSelect(
        "#" + rowId + " [name=room_key]",
        Http().getApiHost("/asset:room/get"),
        function (data) {
          var floor = data.room_floor ? " - Tầng " + data.room_floor : " ";
          return {
            text: data.room_id + floor + " - " + data.room_name,
            value: data.room_key,
          };
        }
      );
      roomKey.params({
        school_key: $("#equip_modal [name=school_key]").val(),
        type_key: $("#equip_modal [name=type_key]").val(),
      });

      roomKey.select2().load('');


      //Nhân đôi mục tài sản
      $("#" + rowId + " .btn_copy_row_time").click(function (event) {
        event.preventDefault(); // Chặn form submit
        const row = $("#" + rowId);
        UIRegForm.addRoomRow({
          class_key: row.find("[name=class_key]").val(),
          room_key: row.find("[name=room_key]").val(),
          class_period_key: row.find("[name=class_period_key]").val(),
          borrowing_date: InputType(row.find("[name=borrowing_date]"))
            .date()
            .get().startDate,
        });
      });
      //Remove mục tài sản
      $("#" + rowId + " .btn_remove_row_time").click(function () {
        event.preventDefault(); // Chặn form submit
        var key = $("#" + rowId).attr("data-detail_key");
        var row = $("#" + rowId);
        delete validatorRoomList[rowId];

        if (key) {
          RegistrationForm.deleteDateTime({ detail_key: key }, function (res) {
            Toast.set(res).success();
            row.remove();
          });
        } else {
          $("#" + rowId).remove();
        }
      });
      const classPeriodKey = initAjaxTomSelect("#" + rowId + " [name=class_period_key]");

      classPeriodKey.select2();

      const classKey = initAjaxTomSelect(
        "#" + rowId + " [name=class_key]",
        Http().getApiHost("/resource:class/get"),
        function (data) {
          return {
            text: data.class_name,
            value: data.class_key,
          };
        }
      ).params({
        class_year: $("#equip_modal [name=school_year]").val(),
        class_type: "Lớp CN",
      });
      classKey.select2().load('');

      $("#" + rowId + " [name=start_time]").timepicker({
        timeFormat: "H:i",
        minTime: "7:30am",
        maxTime: "18:30pm",
      });

      $("#" + rowId + " [name=end_time]").timepicker({
        timeFormat: "H:i",
        minTime: "7:30am",
        maxTime: "18:30pm",
      });

      var processor = $("#equip_form [name=processor]").val();
      var _user_email = crm_get_localStorge("_user_email");
      var borrowingDate = getBorrowingDate(
        _user_email,
        processor,
        "#" + rowId + " [name=borrowing_date]"
      );

      $("#" + rowId + " [name=class_period_key]").change(function () {
        var time = initAjaxTomSelect($("#" + rowId + " [name=class_period_key]")[0]).data().time;

        if (time) {
          var timeRange = time.split("-");
          $("#" + rowId + " [name=end_time]").timepicker(
            "setTime",
            moment("1999-1-1" + " " + timeRange[1].trim()).toDate()
          );
          $("#" + rowId + " [name=start_time]").timepicker(
            "setTime",
            moment("1999-1-1" + " " + timeRange[0].trim()).toDate()
          );
          $("#" + rowId + " [name=end_time]").attr("disabled", true);
          $("#" + rowId + " [name=start_time]").attr("disabled", true);
        } else {
          $("#" + rowId + " [name=end_time]").timepicker(
            "setTime",
            moment("1999-1-1" + " 12:30").toDate()
          );
          $("#" + rowId + " [name=start_time]").timepicker(
            "setTime",
            moment("1999-1-1" + " 07:30").toDate()
          );
          $("#" + rowId + " [name=end_time]").attr("disabled", false);
          $("#" + rowId + " [name=start_time]").attr("disabled", false);
        }
      });

      $("#" + rowId + " [name=class_period_key]").trigger("change");




      const timeValidator = FormType("#form_" + rowId)
        .rules({
          room_key: {
            required: true,
          },
          start_time: {
            required: true,
          },
          end_time: {
            required: true,
          },
        })
        .validate();

      validatorRoomList[rowId] = timeValidator;
      $("#equip_modal [name=school_key]").change(function () {
        roomKey.params({
          school_key: $("#equip_modal [name=school_key]").val(),
        });
        classKey.params({
          school_key: $("#equip_modal [name=school_key]").val(),
          class_year: $("#equip_modal [name=school_year]").val(),
        });
      });
      $("#equip_modal [name=school_year]").change(function () {
        classKey.params({
          school_key: $("#equip_modal [name=school_key]").val(),
          class_year: $("#equip_modal [name=school_year]").val(),
        });
      });
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          $("#" + rowId + " [name=" + key + "]").val(value);
        }
        $("#" + rowId).attr("data-detail_key", data.detail_key);
        if (data.class_key) {
          classKey.value({ class_key: data.class_key });
        } else {
          classKey.value(null);
        }


        roomKey.value({ room_key: data.room_key });
        roomKey
          .params({
            school_key: $("#equip_modal [name=school_key]").val(),
            type_key: $("#equip_modal [name=type_key]").val(),
            room_key: ''
          })
          .select2();
        classKey
          .params({
            class_key: "",
            class_year: $("#equip_modal [name=school_year]").val(),
          })
          .select2();

        borrowingDate.change(data.borrowing_date);

        $("#" + rowId + " [name=end_time]").timepicker(
          "setTime",
          moment(data.borrowing_date + " " + data.end_time).toDate()
        );
        $("#" + rowId + " [name=start_time]").timepicker(
          "setTime",
          moment(data.borrowing_date + " " + data.start_time).toDate()
        );

        if (data.class_period_key) {
          classPeriodKey.select2().setValue(data.class_period_key);
          var time = classPeriodKey.data().time;
          if (time) {
            var timeRange = time.split("-");
            $("#" + rowId + " [name=end_time]").timepicker(
              "setTime",
              moment("1999-1-1" + " " + timeRange[1].trim()).toDate()
            );
            $("#" + rowId + " [name=start_time]").timepicker(
              "setTime",
              moment("1999-1-1" + " " + timeRange[0].trim()).toDate()
            );
          }

          $("#" + rowId + " [name=end_time]").attr("disabled", true);
          $("#" + rowId + " [name=start_time]").attr("disabled", true);
        } else {
          $("#" + rowId + " [name=end_time]").attr("disabled", false);
          $("#" + rowId + " [name=start_time]").attr("disabled", false);
        }
      } else {
        roomKey.select2().focus('');
      }
      changeLanguage();
      this.changeStatus();
      indexRoomRow++;
    },
    setEvent: function () {
      classPeriodKey(function (res) {
        _optionClassPeriod = res.data;
        $("#reg_form_schedule_modal [name=class_period_key]")
          .html(generateClassPeriodSelect(_optionClassPeriod, 1));
      });

      //! LƯU PHIẾU MƯỢN
      $("#btn_save_item").click(function () {
        const isWeekend =
          moment(borrowingDate.get().startDate).isoWeekday() === 6 ||
          moment(borrowingDate.get().startDate).isoWeekday() === 7;

        var formIsValid = true;


        //kiểm tra thông tin người mượn
        formIsValid = validatorRegForm.valid() && formIsValid;

        if (Object.keys(validatorItemList).length > 0) {


          if (!validatorFormItemDate.valid()) {
            $("#formItemDate [name=borrowing_date]").focus();
            return;
          }
          if (isWeekend) {
            borrowingDate.change("");
            $("#formItemDate [name=borrowing_date]").focus();
            Popup.set({
              msg: "NGÀY NHẬN TÀI SẢN KHÔNG HỢP LỆ",
              description: 'Ngày mượn phải là ngày làm việc từ từ thứ 2 đến thứ 6'
            }).error();
            return "";
          }
          formIsValid = validatorFormItemDate.valid() && formIsValid;
          for (const [key, value] of Object.entries(validatorItemList)) {
            formIsValid = formIsValid && value.valid();

            if (!value.valid()) {
              $('#' + key + " [name=quantity]").focus();
              break;
            }

          }
        }


        for (const [key, value] of Object.entries(validatorRoomList)) {
          formIsValid = formIsValid && value.valid();
          if (!value.valid()) {
            $('#' + key + " [name=borrowing_date]").focus();
            break;
          }
        }


        if (formIsValid) {
          var formData = new FormData($("#equip_form")[0]);

          $("#equip_form input, #equip_form select").each(function (i, el) {
            formData.set($(el).attr("name"), $(el).val());
          });
          formData.set("due_date", dueDate.get().startDate);
          formData.set("expected_due_date", expectedDueDate.get().startDate);

          formData.set("borrowing_date", borrowingDate.get().startDate);

          formData.set("status", $("#equip_modal [name=status]").val());
          formData.set("staff_id", $("#equip_modal [name=staff_id]").val());

          $("#tbody .form-row").each(function (i, el) {
            var item = modalItemCustomSelects[$(el).attr('id')].data();

            formData.append(
              "form_details[]",
              JSON.stringify({
                serial_key: item && item.serial_key ? item.serial_key : "NULL",
                storage_item_key: item && item.storage_item_key
                  ? item.storage_item_key
                  : "NULL",
                item_key: item && item.item_key ? item.item_key : "NULL",
                quantity: $(el).find("[name=quantity]").val(),
                status: $(el).find("[name=status]").val(),
                note: $(el).find("[name=note]").val(),
                detail_key: $(el).parent().attr("data-detail_key"),
              })
            );
          });

          $("#detail_borrowing_body .form-row").each(function (i, el) {
            formData.append(
              "borrowing_date_details[]",
              JSON.stringify({
                room_key: $(el).find("[name=room_key]").val(),
                borrowing_date: InputType(
                  $(el).find("[name=borrowing_date]")
                ).get().startDate,
                class_key: $(el).find("[name=class_key]").val(),
                class_period_key: $(el).find("[name=class_period_key]").val(),
                note: $(el).find("[name=note]").val(),
                detail_key: $(el).attr("data-detail_key"),
                start_time: $(el).find("[name=start_time]").val(),
                end_time: $(el).find("[name=end_time]").val(),
              })
            );
          });
          $("#alert").empty();

          showLoading();
          if (formData.get("form_key")) {
            RegistrationForm.update(formData, function (res) {
              Popup.set(res).success();
              hideLoading();
              $("#search").val(res.data.form_key);
              $("#form_type_modal").modal("hide");
              $("#equip_modal").modal("hide");
              tableRegForms.ajax.reload(null, false);
              $("#search").val("");
            });
          } else {
            RegistrationForm.store(formData, function (res) {
              hideLoading();

              Popup.set(res).success();
              $("#form_type_modal").modal("hide");
              $("#equip_modal").modal("hide");

              tableRegForms.ajax.reload(null, false);
            });
          }
        } else {
          Popup.set({
            msg: "BẠN ĐÃ ĐIỀN THIẾU THÔNG TIN HÃY KIỂM TRA LẠI",
          }).error();
        }
      });
      $("#formItemDate [name=borrowing_date]").change(function () {
        var brDate = borrowingDate.get();
        if (brDate.startDate) {
          expectedDueDate.change(moment(brDate.startDate).add(14, "days"));
        }
      });

      const searchDebounce = debounce(function () {
        tableRegForms.ajax.reload();
      }, 300);
      $("#reg_form_filter [name=search]").on("input", function () {
        searchDebounce();
      });

      $("#reg_form_filter select").change(function () {
        tableRegForms.ajax.reload();
      });

      $("#btn_filter").click(function () {
        tableRegForms.ajax.reload();
      });

      $("#btn_add_asset_form").click(function () {
        $("#btn_add_detail").show();
        $("#equip_form")[0].reset();
        dueDate.change("");
        expectedDueDate.change("");
        borrowingDate.change("");
        $("#tbody").html("");
        $("#equip_modal").modal("show");

      });
      $("#btn_add_asset_form").click(function () {
        $("#btn_add_detail").show();
        $("#equip_form")[0].reset();
        dueDate.change("");
        expectedDueDate.change("");
        borrowingDate.change("");
        $("#tbody").html("");
        $("#equip_modal").modal("show");

      });

      $("#btn_add_new_room_form").click(function () {
        $("#tab-1").click();
        UIRegForm.addRoomRow();
      });

      $("#btn_add_new_item_form").click(function () {
        $("#tab-2").click();
        UIRegForm.addItemRow(null);

      });
      $("#btn_add_detail_type_2").click(function () {
        UIRegForm.addItemRow(null, 2);

      });
      $("#btn_import_serial").click(function () {
        $("#asset_import_modal").modal("show");
      });

      $("#file_ele_import").change(function () {
        Excel()
          .read("#file_ele_import")
          .autoCheckHeader(["code", "serial_id"])
          .toTable()
          .get(function (data) {
            $("#tb_import").html(Object.values(data)[0]);
          });
      });

      $("#btn_import_file").click(function () {
        Excel()
          .read("#file_ele_import")
          .autoCheckHeader(["item_key"])
          .get(function (data) {
            Import.api("/asset:serial/storeOrUpdate")
              .start()
              .callback(function (res) {
                AlertBs("#alert")
                  .set({
                    msg: "CÓ " + res.success.length + " DÒNG THÀNH CÔNG",
                    descriptions: res.success,
                  })
                  .success();

                AlertBs("#alert")
                  .set({
                    msg: "CÓ " + res.errors.length + " DÒNG BỊ LỖI",
                    descriptions: res.errors,
                  })
                  .error();

                $("#file_ele_import").val("");
                $("#btn_import_file").modal("hide");
              })
              .import(Object.values(data)[0]);
          });
      });

      $("#btn_export").click(function () {
        var data = getTableDataCheckbox(tableRegForms);
        var rows = [];
        $(data).each(function (key, form) {
          var row = {
            "STT Form": form.form_key,
            "Trạng thái Form": form.status,
            "Tiêu đề/Bài học": form.subject_name,
            "Giáo viên/Nhân viên": form.staff_id,
            "Ngày nhận": form.borrowing_date,
            "Ngày dự định trả": form.expected_due_date,
            "Ngày trả thực tế": form.due_date ? form.due_date : "",
            "Cơ sở": form.school_key == 1 ? "MSC" : "HSC",
          };

          var itemDetails = "";
          $(form.item_details).each(function (i, detail) {
            itemDetails +=
              "" +
              detail.item_name +
              " (" +
              detail.code +
              "):  " +
              detail.quantity +
              "  (" +
              detail.unit +
              ")" +
              "\r\n";
          });
          var roomDetails = "";
          $(form.room_details).each(function (i, detail) {
            roomDetails +=
              "" +
              detail.room_name +
              " (" +
              detail.room_id +
              ")  (" +
              detail.start_time +
              " - " +
              detail.end_time +
              ")" +
              "\r\n";
          });
          row["Đăng ký mượn tài sản"] = itemDetails;
          row["Đăng ký mượn phòng"] = roomDetails;
          rows.push(row);
        });

        Excel()
          .data(rows)
          .write(
            [
              {
                value: "DỮ LIỆU MƯỢN THIẾT BỊ",
                name: " ",
                type: "h1",
              },
            ],
            true
          );
      });



    },
    initSelectAndInput() { },
    showModalRegistrationForm: function (data = null) {
      modalSelectStaffKey.select2().disable();
      $('#equip_modal [name=status]').parent().hide();

      var _user_email = crm_get_localStorge("_user_email");
      var formType = $("#form_type_modal [name=type_key]").val();
      //Clear Form
      indexRow = 1;
      indexRoomRow = 1;
      damagedRowIndex = 1;

      $("#btn_add_detail").show();
      $("#equip_form")[0].reset();

      validatorItemList = {};
      validatorRoomList = {};

      modalItemCustomSelects = [];
      validatorRegForm.clear();
      validatorFormItemDate.clear();

      dueDate.change("");
      expectedDueDate.change("");
      borrowingDate.change("");


      var dateInputOptions = getWeekendDateRange();

      $("#tbody").html("");
      $("#detail_borrowing_body").html("");

      $("#reg_form_schedule_modal [name=class_period_key]")
        .html(generateClassPeriodSelect(_optionClassPeriod, formType));

      //ĐIỀU CHỈNH GIAO DIỆN
      if (!Auth.getPermissions().includes("Root_Admin")) {
        if (Auth.getPermissions().includes("Lab_Manager")) {
          //Đây là người quản lý có thể nhập tên bất cứ ai
          if (data.processor == _user_email) {
            modalSelectStaffKey.select2().enable();
            $('#equip_modal [name=status]').parent().show();
            borrowingDate = InputType(
              "#formItemDate [name=borrowing_date]",
              {}
            ).date();

            borrowingDate.change("");
            expectedDueDate.change("");
          } else {

            modalSelectStaffKey.select2().disable();

            borrowingDate = InputType(
              "#formItemDate [name=borrowing_date]",
              dateInputOptions
            ).date();
            borrowingDate.change("");
            expectedDueDate.change("");
          }
        } else {
          modalSelectStaffKey.select2().disable();

        }
      } else {

        modalSelectStaffKey.select2().enable();
        $('#equip_modal [name=status]').parent().show();
      }
      data.status = data.status ? data.status : 'in_progress';


      //Cài đăt dữ liệu
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (!['status'].includes(key))
            $("#equip_modal [name=" + key + "]").val(value);
        }

        borrowingDate = getBorrowingDate(_user_email, data.processor);

        modalStatus.value(data.status);
        modalSelectSubjectKey.value(data.subject_key);

        $('#_formTypeName').text(data.type_name);


        var tabCode = getFormTabs(data.form_tab).code;
        $("#tab-1").show();
        $("#tab-2").show();
        $("#btn_add_new_item_form").attr("disabled", false);
        $("#btn_add_new_room_form").attr("disabled", false);
        $("#btn_view_items").attr("disabled", false);
        $("#btn_view_calendar").attr("disabled", false);

        $("#equip_form [name=manage_by]").val(data.manage_by);
        $("#equip_form [name=processor]").val(data.processor);
        $("#equip_form [name=manager_key]").val(data.manager_key);
        $("#equip_form [name=type_key]").val(data.type_key);
        $("#equip_form [name=school_key]").val(data.school_key);

        if (tabCode == "ONLY_ROOM") {
          $("#tab-2").hide();
          $("#btn_add_new_item_form").attr("disabled", true);
          $("#btn_view_items").attr("disabled", true);
          $("#tab-1").click();
        } else if (tabCode == "ONLY_ASSET") {
          $("#tab-1").hide();
          $("#btn_add_new_room_form").attr("disabled", true);
          $("#btn_view_calendar").attr("disabled", true);
          $("#tab-2").click();
        }

        if (data.form_key_duplicate) {
          data.form_key = data.form_key_duplicate;
        }

        if (data.form_key) {
          RegistrationForm.getDetails(
            { form_key: data.form_key },
            function (res) {
              validatorItemList = {};
              $(res).each(function (i, el) {
                UIRegForm.addItemRow(el);
              });
              hideLoading();
            }
          );
          RegistrationForm.getRoomFormDetails(
            { form_key: data.form_key },
            function (res) {
              hideLoading();
              $(res).each(function (i, el) {
                UIRegForm.addRoomRow(el, borrowingDate);
              });
            }
          );
        }



        if (data.staff_id) {
          setTimeout(() => {
            modalSelectStaffKey.value({ staff_key: data.user_key, 'types[]': 'lsts_hr_staff' });
            modalSelectStaffKey.params({
              'types[]': 'lsts_hr_staff',
              staff_key: "",
              search: ""
            });
            modalSelectStaffKey.select2().load('');
          }, 300);
        } else {
          modalSelectStaffKey.params({
            'types[]': 'lsts_hr_staff',
            staff_key: "",
            search: ""
          });
          modalSelectStaffKey.select2().load('');
        }



        if (data.borrowing_date) {
          borrowingDate.change(data.borrowing_date);
        } else {
          borrowingDate.change("");
        }
        if (data.expected_due_date) {
          expectedDueDate.change(data.expected_due_date);
        }
        if (data.due_date) {
          dueDate.change(data.due_date);
        }


        UIRegForm.changeStatus();
      }
      $("#equip_modal").modal("show");

    },
  };
})();

const ItemsService = (function () {
  var sum = function (...numbers) {
    var total = 0;
    numbers.forEach((element) => {
      total += Number.parseFloat(element);
    });
    return total;
  };
  return {
    store: function (data, callback) {
      Http().api("/asset:inventory/store", data).saveForm(callback);
    },
    update: function (data, callback) {
      Http().api("/asset:inventory/update", data).saveForm(callback);
    },
    import: function (data, callback) {
      Import.api("/asset:inventory/import")
        .start()
        .callback(function (res) {
          AlertBs("#alert")
            .set({
              msg: "CÓ " + res.success.length + " DÒNG THÀNH CÔNG",
              descriptions: res.success,
            })
            .success();

          AlertBs("#alert")
            .set({
              msg: "CÓ " + res.errors.length + " DÒNG BỊ LỖI",
              descriptions: res.errors,
            })
            .error();

          callback(res);
          formSummaryTable.ajax.reload();
          $("#equip_inventory_modal").modal("hide");
        })
        .import(data);
    },
    delete: function (data, callback) {
      Http().api("/asset:inventory/delete", data).save(callback);
    },

    generateInventoryTable: function (callback = function () { }) {
      return $("#table_inventory_reg_form").DataTable({
        //processing: true,
        data: [],
        paging: false,
        lengthMenu: [
          [10, 25, 100, 500, -1],
          [10, 25, 100, 500, "All"],
        ],
        order: [[0, "desc"]],
        columns: [
          // {
          //   data: "input_dates",
          //   name: "input_dates",

          // },
          {
            data: "code",
            width: 400,
            className: "text-left align-middle min-200",

            render: function (data, meta, row) {
              var code = "";

              if (row.code) {
                code =
                  "<span class='badge badge-success '>  " +
                  row.code +
                  "</span>";
              }

              var type = `<span class='badge ${getAssetType(row.item_type_key).class
                }'>${getAssetType(row.item_type_key).name}</span>`;

              return (
                "<b>" +
                row.item_name +
                "</b> - <i>" +
                (row.item_name_en ? row.item_name_en : "") +
                "</i><br>" +
                code +
                " " +
                type
              );
            },
          },

          {
            data: "last_inventory",
            name: "last_inventory",
            className: "text-center align-middle",
            render: function (data, meta, row) {
              return Number.parseFloat(data);
            },
          },
          {
            data: null,
            className: "text-center align-middle",
            render: function (data, meta, row) {
              return "<button class='btn btn_add_item_to_form btn-green'> <i class='fas fa-2x fa-plus-circle'></i>  </button>";
            },
          },
        ],
        drawCallback: callback,
        createdRow: function (row, data, index) {
          if (data.last_inventory < 0) {
            $(row).addClass("bg-danger");
          }
        },
      });
    },
    setTableData: function (data) { },
  };
})();

const DamagedRecordItemService = (function () {
  return {
    storeOrUpdate: function (data, callback) {
      Http()
        .api("/asset:DamagedRecordItem/storeOrUpdate", data)
        .save(callback);
    },
    update: function (data, callback) {
      Http().api("/asset:DamagedRecordItem/update", data).save(callback);
    },
    delete: function (data, callback) {
      Http().api("/asset:DamagedRecordItem/delete", data).save(callback);
    },
    get: function (data, callback) {
      Http().api("/asset:DamagedRecordItem/findAll", data).get(callback);
    },
    attachFile: function (data, callback) {
      Http().api("/asset:damagedRecord/attachFile", data).saveForm(callback);
    },
  };
})();

const UIDamagedRecordItem = (function () {
  function statusOption(status) {
    var statusOptions = [
      {
        text: "Good",
        value: "good",
        vi: "Bình thường",
      },
      {
        text: "Damaged/Lost",
        value: "damaged",
        vi: "Tổn hao/Mất",
      },
      // {
      //   text: "Export",
      //   value: "export",
      //   vi: "Xuất kho"
      // },
    ];

    var str = "";
    $(statusOptions).each(function (i, el) {
      str += `<option vi="${el.vi}" value='${el.value}'>${el.text}</option>`;
    });
    return str;
  }

  function damagedReasonOption(data = null) {
    var statusOptions = [
      {
        text: "1. Học sinh vô ý làm vỡ",
        value: "Học sinh vô ý làm vỡ",
      },
      {
        text: "2. Giáo viên vô ý làm vỡ",
        value: "Giáo viên vô ý làm vỡ",
      },
      {
        text: "3. Khác",
        value: "Khác",
      },
    ];

    var str = "";
    $(statusOptions).each(function (i, el) {
      str += '<option value="' + el.value + '">' + el.text + "</option>";
    });

    return str;
  }
  return {
    setEvent: function () {
      $("#btn_save_damaged_record").click(function () {
        var data = [];
        var isValid = true;

        for (const [key, value] of Object.entries(damagedFormValidators)) {
          isValid = isValid && value.valid();
        }

        if (isValid) {
          $("#damaged_tbody form").each(function (i, el) {
            var quantity = $(el).find("[name=quantity]").val();
            var status = $(el).find("[name=status]").val();
            var itemData = SelectType($(el).find("[name=item_key]")).data();

            if (quantity != "" || quantity != 0) {
              data.push({
                item_key: itemData.item_key,
                serial_key: itemData.serial_key ? itemData.serial_key : "NULL",

                storage_item_key: itemData.storage_item_key
                  ? itemData.storage_item_key
                  : "NULL",
                quantity: quantity,
                processing_method: $(el).find("[name=processing_method]").val(),
                status: status,
                reason: $(el).find("[name=reason]").val(),
                record_key: $(el).find(".form-row").attr("data-record_key"),
                detail: $(el).find("[name=detail]").val(),
                detail_key: $(el).attr("data-detail_key"),
              });
            }
          });
          var formKey = $("#damaged_record_modal [name=form_key]").val();

          if (formKey) {
            DamagedRecordItemService.storeOrUpdate(
              {
                form_key: formKey,
                damaged_date: damagedDate.get().startDate,
                file_attach: $("#file_attach_damaged_record").val(),
                damaged_records: data,
              },
              function (res) {
                Popup.set(res).success();
                $("#damaged_record_modal").modal("hide");
                tableRegForms.ajax.reload();
              }
            );
          } else {
            Popup.set({
              msg: "VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN",
              errors: { error: "Không tìm thấy mã phiếu mượn" },
            }).error();
          }
        } else {
          Popup.set({
            msg: "VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN",
            errors: { error: "Vui lòng nhập số lượng cho tài sản" },
          }).error();
        }
      });
      $("#btn_delete_damaged_record").click(function () {
        var formKey = $("#equip_modal [name=form_key]").val();

        if (formKey) {
          DamagedRecordItemService.delete(
            {
              form_key: formKey,
            },
            function (res) {
              Popup.set(res).success();
              $("#damaged_record_modal").modal("hide");
              tableRegForms.ajax.reload();
            }
          );
        }
      });
      $("#file_attach_damaged_record").change(function () {
        var formData = new FormData();
        var fileInput = $(this);
        formData.set("file_attach", this.files[0]);
        formData.set("damaged_date", damagedDate.get().startDate);
        formData.set(
          "form_key",
          $("#damaged_record_modal [name=form_key]").val()
        );
        DamagedRecordItemService.attachFile(formData, function (res) {
          Popup.set(res).success();

          $("#img_preview_damaged_record").attr("src", res.data.file_attach);
        });
      });
    },
    addDamagedRow: function (data = null) {
      var rowId = "damaged_" + new Date().getTime();
      var rows = `<form id='form_${rowId}' data-detail_key=${data.detail_key ? data.detail_key : ""
        } action=""> 
        <div class='form-row p-3 mb-1' id='${rowId}'>
        <div class='col-xl-2 form-group'><label style="color:red;font-weight:bold;" for='receiver' class='lang' 
        vi='${data.item_type_key == 2 ? "Tài sản tiêu hao" : "Trạng thái"}'>  
        ${data.item_type_key == 2 ? "Tài sản tiêu hao" : "Status"}   </label>
        <select name='status' class='form-control'  ${data.item_type_key == 2 ? "disabled" : ""
        } >${statusOption()} </select></div>
        <div class='col-xl-5 form-group'><label for='receiver' class='lang' vi='Tên thiết bị'>Item</label>
        <select disabled class='form-control' name='item_key'></select></div>      
 
 
        <div class='col-xl-2 form-group'><label for='receiver' class='lang' vi='Số lượng tổn hao'>Damaged Quantity </label>
        <input type='number' id='quantity_${rowId}' min='0'  placeholder='Nhập số lượng ở đây' name='quantity' class='form-control'></div>

        <div class='col-xl-2 form-group' ><label for='receiver' class='lang' vi='Đơn vị'>Unit </label>
        <input disabled class='form-control' name='unit'></div>  

        <div class='col-xl-2 form-group'><label for='receiver' class='lang' vi='Lý do'>Reason</label>
        <select type='text' name='reason' class='form-control'>${damagedReasonOption()}</select></div>
        <div class='col-xl-4 form-group'><label for='receiver' class='lang' vi='Lý do khác'>Other Reason</label>
        <textarea type='text' rows=1 name='detail' class='form-control' placeholder='Nhập lý do khác ở đây'></textarea></div>
        <div class='col-xl-4 form-group'><label for='receiver' class='lang' vi='Hình thức xử lý'>Processing Method</label>
        <select name="processing_method">
          <option value="Lập biên bản">1. Lập biên bản</option>
          <option value="Bồi thường bằng hiện vật">2. Bồi thường bằng hiện vật</option>
          <option value="Bồi thường bằng hiện kim">3. Bồi thường bằng hiện kim</option>
          <option value="Không lập biên bản">4. Không lập biên bản</option>
        </select>
        </div>
        <div class='col-xl-2 form-group'>
        <label>&nbsp;</label><br>
        <button type="button" class="btn btn-danger btn_delete_damaged_record float-right" data-record_key="${data.record_key ? data.record_key : ""
        }" 
        vi="Xóa dòng ${damagedRowIndex}" > Delete row no. ${damagedRowIndex} </button></div>
        </div></form>`;

      $("#damaged_tbody").append(rows);
      changeLanguage();

      $("#" + rowId + " [name=processing_method]").select2();
      var itemKey = SelectType(
        "#" + rowId + " [name=item_key]",
        Http().getApiHost("/asset:item/getStorageItem"),
        function (item) {
          var text = `${item.code} --- [ ${item.storage_name} ] --- [ ${item.item_name} ]`;
          var id = item.storage_item_key;
          if (item.item_type_key == 1) {
            text = `${item.serial_code} --- [ ${item.storage_name} ] --- [ ${item.item_name} ]`;
            id = item.serial_key;
          }

          return {
            text: text,
            id: id,
            item_key: item.item_key,
            unit: item.unit,
            item_type_key: item.item_type_key,
            storage_item_key: item.storage_item_key
              ? item.storage_item_key
              : "",
            serial_key: item.serial_key ? item.serial_key : "",
          };
        }
      ).params({
        level: [2],
        length: 50,
        //manager_key: $("#equip_modal [name=manager_key]").val(),
      });
      itemKey.select2();
      $("#" + rowId + " [name=detail]")
        .parent()
        .hide();

      $("#" + rowId + " [name=quantity]").val(data.quantity);

      $("#" + rowId + " [name=status]").change(function () {
        if ($(this).val() == "damaged") {
          $("#" + rowId + " [name=quantity]").focus();
          if (data.item_type_key == 1) {
            $("#" + rowId + " [name=quantity]").val(1);
            $("#" + rowId + " [name=quantity]").attr("disabled", true);
          }
          damagedFormValidators[rowId] = FormType("#form_" + rowId)
            .rules({
              quantity: {
                required: true,
              },
              reason: {
                required: true,
              },
              processing_method: {
                required: true,
              },
            })
            .validate();
        } else {
          $("#" + rowId + " [name=quantity]").val("");
          damagedFormValidators[rowId] = {
            valid: function () {
              return true;
            },
          };
        }
      });

      $("#" + rowId + " .btn_delete_damaged_record").click(function () {
        const recordKey = $(this).attr("data-record_key");
        DamagedRecordItemService.delete(
          { record_key: recordKey },
          function (res) {
            Toast.set(res).success();
            $("#" + rowId).remove();
          }
        );
      });

      if (data) {
        data.quantity = Number.parseFloat(data.quantity);
        for (const [key, value] of Object.entries(data)) {
          $("#" + rowId + " [name=" + key + "]").val(value);
        }

        $("#" + rowId + " [name=reason]").val(data.reason);

        $("#" + rowId).attr("data-record_key", data.record_key);
        $("#" + rowId).attr("data-item_key", data.item_key);
        $("#" + rowId).attr("data-item_type_key", data.item_type_key);

        $("#" + rowId + " [name=quantity]").attr("max", data.max_quantity);
        itemKey.value({
          //item_key: data.item_key,
          storage_item_key: data.storage_item_key,
          serial_key: data.serial_key,
        });

        if (data.serial_key) {
          // serialKey.value({ serial_key: data.serial_key });

          $("#" + rowId + " [name=quantity]").attr("disabled", true);
          $("#" + rowId + " [name=quantity]").val(1);
        } else {
          $("#" + rowId + " [name=serial_key]")
            .parent()
            .hide();
        }
      }
      $("#" + rowId + " [name=reason]").change(function () {
        if ($(this).val() == "Khác") {
          $("#" + rowId + " [name=detail]")
            .parent()
            .show();
        } else {
          $("#" + rowId + " [name=detail]").val("");
          $("#" + rowId + " [name=detail]")
            .parent()
            .hide();
        }
      });

      $("#" + rowId + " [name=status]").change(function () {
        if ($(this).val() == "damaged") {
          $("#" + rowId).addClass("is_damaged");

          $("#" + rowId + " [name=quantity]").attr("disabled", false);
          if (data.item_type_key == 1) {
            $("#" + rowId + " [name=quantity]").val(1);
            $("#" + rowId + " [name=quantity]").attr("disabled", true);
          }
        } else {
          $("#" + rowId).removeClass("is_damaged");
          $("#" + rowId + " [name=quantity]").attr("disabled", true);
        }

        if (data.item_type_key == 2) {
          //
          $("#" + rowId).addClass("is_damaged");
          $("#" + rowId + " [name=quantity]").val(data.max_quantity);
        }
      });

      $("[name=status], [name=reason]").select2();
      $("#" + rowId + " [name=reason]").change();
      $("#" + rowId + " [name=status]").change();
      damagedRowIndex++;
    },
  };
})();

if ($("#reg_form_filter [name=item_key_filter]").val()) {
  // itemKeyFilter.value(
  //   { item_key: $("#reg_form_filter [name=item_key_filter]").val() },
  //   {},
  //   function () {
  //     tableRegForms.ajax.reload();
  //   }
  // );
}
var indexRow = 1;
var indexRoomRow = 1;
var damagedRowIndex = 1;
var validatorRegForm = FormType("#equip_form")
  .rules({
    staff_id: {
      required: true,
    },
    subject_name: {
      required: true,
      rangelength: [5, 80],
    },
  })
  .validate();
var validatorFormItemDate = FormType('#formItemDate').rules({
  borrowing_date: { required: true },
  expected_due_date: { required: true },
}).validate();

function getBorrowingDate(
  _user_email,
  processor,
  selector = "#formItemDate [name=borrowing_date]"
) {
  var dateInputOptions = getWeekendDateRange();

  const status = $("#equip_modal [name=status]").val();
  const formKey = $("#equip_modal [name=form_key]").val();

  var borrowingDate = InputType(selector, {}).date();

  if (!Auth.getPermissions().includes("Root_Admin")) {
    if (Auth.getPermissions().includes("Lab_Manager")) {
      //Đây là người quản lý => không giới hạn thời gian
      if (processor == _user_email) {
        borrowingDate = InputType(selector, {}).date();
      } else {
        //Nếu chưa approved thì vẫn sửa ngày được
        //Nếu edit và != in_progess => không giới hạn ngày
        if (formKey && status != "in_progress") {
          borrowingDate = InputType(selector, {}).date();
        } else if (status == "in_progress") {
          borrowingDate = InputType(selector, dateInputOptions).date();
        }
      }
    } else {
      if (formKey && status != "in_progress") {
        borrowingDate = InputType(selector, {}).date();
      } else {
        borrowingDate = InputType(selector, dateInputOptions).date();
      }
    }
  }

  return borrowingDate;
}
$('#equipment_table').on('click', '.btn_edit_reg_form', function () {
  const data = $(this).attr("data-form_key");
  openEditorWindow(data);
});


$("#equipment_table").on("click", ".btn_form_duplicate", function () {
  var data = $(this).attr("data-form_key");

  RegistrationForm.get({ form_key: data }, function (res) {
    res.form_key_duplicate = res.form_key;
    delete res.form_key;

    delete res.borrowing_date;
    delete res.expected_due_date;
    res.status = "in_progress";
    delete res.school_year;
    UIRegForm.showModalRegistrationForm(res);
  });

  $("#equip_modal").modal("show");
});
$("#equipment_table").on("click", ".btn_form_delete", function () {
  var data = $(this).attr("data-form_key");

  Popup.question(function () {
    RegistrationForm.delete({ form_key: data }, function (res) {
      Popup.set(res).success();
      tableRegForms.ajax.reload(null, false);
    });
  });
});
$("#equipment_table").on("click", ".btn_change_status", function () {
  var data = $(this).attr("data-form_key");

  RegistrationForm.changeStatus(
    {
      form_key: data,
      status: $(this).data("status"),
      staff_id: $(this).attr("data-staff_id"),
    },
    function (res) {
      Popup.set(res).success();
      tableRegForms.ajax.reload(null, false);
    }
  );
});

$("#equipment_table").on("click", ".btn_add_damaged_record", function () {
  damagedRowIndex = 1;

  $("#damaged_tbody").html("");

  const formKey = $(this).attr("data-form_key");

  const regFormData = tableRegForms.row($(this).closest("tr")).data();

  $("#damaged_record_modal [name=form_key]").val(formKey);
  damagedDate.change(regFormData.damaged_date);
  if (regFormData.attach_file)
    $("#img_preview_damaged_record").attr(
      "src",
      Http().getHost(regFormData.attach_file)
    );
  else {
    $("#img_preview_damaged_record").attr(
      "src",
      Http().getHost("/images/white-background.png")
    );
  }

  damagedFormValidators = {};

  showLoading();
  RegistrationForm.getDetails(
    { form_key: formKey, includes: true },
    function (detailData) {
      hideLoading();
      DamagedRecordItemService.get({ form_key: formKey }, function (res) {
        var damagedData = res.data;

        detailData.forEach(function (detail) {
          var data = {};
          data.item_key = detail.item_key;
          data.storage_item_key = detail.storage_item_key;
          data.serial_key = detail.serial_key;
          data.unit = detail.unit;
          data.detail_key = detail.detail_key;
          data.max_quantity = detail.quantity;
          data.item_type_key = detail.item_type_key;

          if (damagedData && damagedData.length > 0) {
            damagedData.forEach(function (damaged) {
              if (detail.detail_key == damaged.detail_key) {
                data = Object.assign(data, damaged);
              }
            });
          }

          //Ẩn đi tài sản tiêu hao, không cần khai báo

          UIDamagedRecordItem.addDamagedRow(data);
        });
        $("#damaged_record_modal").modal("show");
      });
    }
  );
});
$("#form_type_table").on("click", ".btn_add_form", function () {
  var data = tableType.row($(this).closest("tr")).data();
  data.staff_id = crm_get_localStorge("_staff_id");
  data.user_key = crm_get_localStorge("_user_key");
  data.processor = data.email;
  openEditorWindow(null, data.type_key);
  $("#form_type_modal").modal("hide");
});

$("#form_type_modal").on("shown.bs.modal", function () {
  tableType.ajax.reload();
});

$("#equipment_table").on("click", ".btn_damaged_record_print", function () {
  damagedRowIndex = 1;

  $("#damaged_tbody").html("");

  const formKey = $(this).attr("data-form_key");
  const subject = $(this).attr("data-subject");
  const expectedDueDate = $(this).attr("data-expected_due_date");

  $("#equip_modal [name=form_key]").val(formKey);
  damagedFormValidators = {};

  showLoading();
  // RegistrationForm.getDetails({ form_key: formKey, includes: true }, function (detailData) {

  DamagedRecordItemService.get({ form_key: formKey }, function (res) {
    hideLoading();
    damagedData = res.data;

    var rows = [
      [
        {
          text: "#",
          style: "tableHeader",
        },

        {
          text: "Tên vật tư",
          style: "tableHeader",
        },

        {
          text: "SL",
          style: "tableHeader",
        },
        {
          text: "Lý do",
          style: "tableHeader",
        },
        {
          text: "Hình thức xử lý",
          style: "tableHeader",
        },
      ],
    ];
    var i = 0;

    var createdAt = "";
    damagedData.forEach((el) => {
      var row = [
        {
          text: i + 1,
          style: "tableDataCenter",
        },
        {
          text: el.item_name,
          style: "tableData",
        },

        {
          text: Number.parseFloat(el["quantity"]),
          style: "tableDataCenter",
        },
        {
          text: el.reason,
          style: "tableData",
        },
        {
          text: el.processing_method,
          style: "tableData",
        },
      ];
      rows.push(row);

      i++;
    });

    createdAt = moment(expectedDueDate).format("DD/MM/YYYY");

    var now = moment();
    var docDefinition = {
      // watermark: {
      //   text: "LSTS CRM",
      //   color: "blue",
      //   opacity: 0.3,
      //   bold: true,
      //   italics: false,
      //   fontSize: 40,
      // },
      content: [
        {
          text: "TRƯỜNG THCS VÀ THPT ĐINH THIỆN LÝ",
          bold: true,
        },
        {
          text: crm_get_localStorge("_dept_name").toLocaleUpperCase(),
          margin: [0, 5],
        },
        {
          text: "BIÊN BẢN TÀI SẢN HƯ MẤT",
          style: "subheader",
          bold: true,
          alignment: "center",
        },
        {
          text: "Thời gian: " + createdAt,
          style: "tableData",
        },

        {
          text: "Tên bài/Mục đích sử dụng: " + subject,
          style: "tableData",
        },
        {
          style: "tableExample",
          table: {
            widths: [30, "*", 30, 120, "*"],
            body: rows,
          },
        },
        {
          text: "Ngày   tháng     năm " + now.year(),
          margin: [6, 6],
          alignment: "right",
        },
        {
          columns: [
            {
              alignment: "justify",
              columns: [
                {
                  width: 250,
                  text: "Người quản lý",
                  alignment: "right",
                },

                {
                  width: "*",
                  text: "Người xác nhận - GVBM",
                  margin: [20, 0],
                  alignment: "right",
                },
              ],
            },
          ],
        },
        {
          columns: [
            {
              alignment: "justify",
              columns: [
                {
                  width: 200,
                  text: "",
                },

                {
                  width: "*",
                  text: "",
                  margin: [50, 60],
                  alignment: "right",
                },
              ],
            },
          ],
        },
      ],
      pageMargins: [20, 20, 20, 60],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: "center",
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          margin: [5, 2],
          alignment: "center",
        },
        tableData: {
          fontSize: 11,
          margin: [5, 2],
        },
        tableDataCenter: {
          fontSize: 11,
          margin: [5, 2],
          alignment: "center",
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          fontSize: 13,
          margin: [0, 5, 0, 5],
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    pdfMake.createPdf(docDefinition).open();

  });

  // });
});
$("#btn_add_damaged_record").hide();



$("#equip_modal [name=status]").change(function () {
  UIRegForm.changeStatus();
});

$("#myTabContent").tabs();

$("#toggle_rows").change(function () {
  if ($(this).is(':checked')) {
    // Nếu checkbox được tick, hiển thị tất cả
    $(".collapse").collapse('show');
  } else {
    // Nếu checkbox không được tick, ẩn tất cả
    $(".collapse").not("button").collapse('hide');
  }
});

$("#btn_print_pdf_borrowing_form").click(function () {
  var data = getTableDataCheckbox(tableRegForms);



  var formKeys = data.map(function (el) {
    return el.form_key;
  });
  console.log(formKeys);

  if (formKeys.length >= 50) {
    var url = "pages/internal/lab_management/reg-form/print.php?form_keys=" + formKeys.join(",");
    setButtonLoading('#btn_print_pdf_borrowing_form', true);
    URLShortener.process(url).then(function (short_url) {
      setButtonLoading('#btn_print_pdf_borrowing_form', false);
      window.open(short_url, "_blank");
    });
  } else {
    window.open(Http().getHost('urls/assets/reg-form/') + formKeys.join(","), "_blank");
  }




});
$("#btn_export_pdf").click(function () {
  var data = getTableDataCheckbox(tableRegForms);


  var formKeys = data.map(function (el) {
    return el.form_key;
  });

  window.open(
    Http().getHost(
      "?p=internal.lab_management.damaged-record.print&form_keys="
    ) + formKeys.join(",")
  );
});
const roomKeyScheduler = SelectType(
  "#reg_form_schedule_modal [name=room_key]",
  Http().getApiHost("/asset:room/get"),
  function (data) {
    var floor = data.room_floor ? " - Tầng " + data.room_floor : " ";
    return {
      text: data.room_id + floor + " - " + data.room_name,
      id: data.room_key,
    };
  }
);
//Module Xử lý lịch
const UICalendar = (function () {
  const scheduleStartDate = InputType(
    "#reg_form_schedule_modal [name=borrowing_date]"
  ).date();

  $("#calendar_preview_modal").on("shown.bs.modal", function () {
    UICalendar.refetch();

    roomKeyScheduler.params({
      school_key: $("#equip_modal [name=school_key]").val(),
      type_key: $("#equip_modal [name=type_key]").val(),
    });

    roomKeyScheduler.get();
  });

  var options = borrowingDate.getOptions();
  var maxDate = options.maxDate.format("YYYY-MM-DD");
  var minDate = options.minDate.format("YYYY-MM-DD");

  $("#calendar_preview_modal").on("hide.bs.modal", function () {
    var events = UICalendar.getEvents();

    showLoading();
    events.map(function (el) {
      UIRegForm.addRoomRow(el);
    });
    _currentEvents = [];
    _calendar.refetchEvents();
    hideLoading();
  });

  var _currentEvents = [];
  var _calendar;

  return {
    setEvents(events) {
      _currentEvents = events;
    },
    show: function () {
      $("#calendar_preview_modal").modal("show");
    },
    hide: function () {
      $("#calendar_preview_modal").modal("hide");
    },
    showModal: function () {
      $("#reg_form_schedule_modal").modal("show");
    },
    hideModal: function () {
      roomKeyScheduler.val("");
      $("#reg_form_schedule_modal [name=class_period_key]").val([]);
      $("#reg_form_schedule_modal [name=room_key]").val("");

      $("#reg_form_schedule_modal [name=room_key]").select2();
      $("#reg_form_schedule_modal [name=class_period_key]").select2();
      $("#reg_form_schedule_modal").modal("hide");
    },
    init: function () {
      var calendarEl = document.getElementById("room_calendar");
      _calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        validRange: {
          start: minDate,
          end: maxDate,
        },
        selectable: true,
        contentHeight: "auto",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridDay,listWeek",
        },
        events: function (info, successCallback, failureCallback) {
          successCallback(_currentEvents);

        },

        viewDidMount: function (info) {
          // Call the `refetchEvents` method to reload events when the view changes
          _calendar.refetchEvents();
        },
        eventClick: function (info) { },
        dateClick: function (info) {
          scheduleStartDate.change(info.dateStr);
          UICalendar.showModal();
        },
        select: function (info) { },
      });
      _calendar.render();
    },
    addEvents: function () {
      var borrowingDate = scheduleStartDate.get().startDate;
      borrowingDate = moment(borrowingDate).format("YYYY-MM-DD");
      var roomKey = $("#reg_form_schedule_modal [name=room_key]").select2('data')[0];
      var periodArr = $(
        "#reg_form_schedule_modal [name=class_period_key]"
      ).select2('data');
      var data = [];

      data = periodArr.map(function (el) {
        var event;
        if (el.id) {
          const time = $(el.element).data("time").split(" - ");
          event = {
            start: borrowingDate + "T" + time[0],
            end: borrowingDate + "T" + time[1],
            title: el.text + " - " + roomKey.text,
            room_key: roomKey.id,
            class_period_key: el.id,
            type: "add",
          };
        }
        else {
          event = {
            start: borrowingDate + "T07:30:00",
            end: borrowingDate + "T16:30:00",
            title: el.text + " - " + roomKey.text,
            room_key: roomKey.id,
            class_period_key: 'NULL',
            type: "add",
          };
        }
        return event;
      });

      var originEvents = _calendar.getEvents();

      originEvents = originEvents.map(function (el) {
        return {
          start: el.start,
          end: el.end,
          title: el.title,
          room_key: el.extendedProps.room_key,
          class_period_key: el.extendedProps.class_period_key,
          type: el.extendedProps.type,
        };
      });

      _currentEvents = data.concat(originEvents);
      _calendar.refetchEvents();
      UICalendar.hideModal();
    },
    getCalendar: function () {
      return _calendar;
    },
    getEvents: function () {
      var originEvents = _calendar.getEvents();

      var result = [];
      originEvents.map(function (el) {
        if (
          el.extendedProps.type == "add" &&
          el.extendedProps.room_key &&
          el.extendedProps.class_period_key
        )
          result.push({
            start: moment(el.start).format("YYYY-MM-DD HH:mm:ss"),
            end: moment(el.end).format("YYYY-MM-DD HH:mm:ss"),
            title: el.title,
            room_key: el.extendedProps.room_key,
            type: el.extendedProps.type,
            start_time: moment(el.start).format("HH:mm"),
            end_time: moment(el.end).format("HH:mm"),
            class_period_key: el.extendedProps.class_period_key,
            borrowing_date: moment(el.start).format("YYYY-MM-DD"),
          });
      });

      return result;
    },
    refetch: function () {
      return _calendar.refetchEvents();
    },
  };
})();

$("#btn_save_event").click(function () {
  UICalendar.addEvents();
});

$("#btn_view_calendar").click(function () {
  var events = [];

  $("#detail_borrowing_body .form-row").each(function (i, el) {
    var borrowing_date = moment(
      InputType($(el).find("[name=borrowing_date]")).get().startDate
    ).format("YYYY-MM-DD");
    events.push({
      room_key: $(el).find("[name=room_key]").val(),
      class_period_key: $(el).find("[name=class_period_key]").val(),
      note: $(el).find("[name=note]").val(),
      // title:
      //   $(el).find("[name=class_period_key]").select2("data")[0].text +
      //   " " +
      //   $(el).find("[name=room_key]").select2("data")[0].text,
      start:
        borrowing_date + "T" + $(el).find("[name=start_time]").val() + ":00",
      end: borrowing_date + "T" + $(el).find("[name=end_time]").val() + ":00",
      type: "view",
      className: "event event-warning",
    });
  });

  UICalendar.setEvents(events);
  UICalendar.refetch();
  UICalendar.show();
});
UICalendar.init();
//Module xử lý bảng tồn kho
const uiItems = (function (items) {
  var table = items.generateInventoryTable(function () {
    hideLoading();
    $(".btn_add_item_to_form").click(function () {
      var data = table.row($(this).closest("tr")).data();
      data.quantity = "";
      $("#tab-2").click();
      UIRegForm.addItemRow(data);
    });
  });

  return {
    getTable: function () {
      return table;
    },

    reloadTable: function () {
      LoaderLsts.show();
      Http()
        .api("/asset:inventory/getSummary", {
          manager_key: $("#equip_form [name=manager_key]").val(),
        })
        .get(function (res) {
          table.rows.add(res.data).draw();
          LoaderLsts.hide();
        });
    },
    show: function () {
      uiItems.reloadTable();
      $("#item_preview_modal").modal("show");
    },
    hide: function () {
      $("#item_preview_modal").modal("hide");
    },
  };
})(ItemsService);

$("#btn_view_items").click(function () {
  uiItems.show();
});

$("#btn_export_file_inventory_reg_form").click(function () {
  var data = uiItems.getTable().rows().data().toArray();

  var sum = function (...numbers) {
    var total = 0;
    numbers.forEach((element) => {
      total += Number.parseFloat(element);
    });
    return total;
  };

  data = data.map(function (row) {
    var damaged_total = sum(
      row.current_damaged_item_quantity,
      row.current_lost_item_quantity,
      -row.current_output_item_quantity
    );

    return {
      item_key: row.item_key,
      "Mã vật tư": row.code,
      "Tên vật tư": row.item_name,
      "Đơn vị": row.unit,
      Loại: getAssetType(row.item_type_key).name,
      //"Tên kho": row.storage_name,
      "Tồn đầu": Number.parseFloat(row.first_inventory),
      "Tổng nhập": Number.parseFloat(row.current_input_item_quantity),
      "Tiêu hao": damaged_total,
      "Đang mượn": Number.parseFloat(row.current_borrowing_item_quantity),
      "Tổn cuối": Number.parseFloat(row.last_inventory),
    };
  });
  Excel()
    .data(data)
    .write([{ name: "Dữ liệu tồn kho", value: "" }]);
});
UIDamagedRecordItem.setEvent();
UIRegForm.setEvent();
UIRegForm.setSelect2();

$("#divPageContent").append(
  createFeatureButton([
    {
      name: "In phiếu mượn",
      icon: "fa fa-file-alt",
      action: function () {
        $("#btn_print_pdf_borrowing_form").click();
      },
    },
    {
      name: "In biên bản hư hỏng",
      icon: "fa fa-file-pdf",
      action: function () {
        $("#btn_export_pdf").click();
      },
    },
    {
      name: "Tạo phiếu mới",
      icon: "fa fa-plus-circle",
      action: function () {
        $("#btn_add_form_type").click();
      },
    },
    {
      name: "Trang kế tiếp",
      icon: "fa fa-arrow-right",
      action: function () {
        var pageInfo = tableRegForms.page.info(); // Lấy thông tin trang hiện tại

        if (pageInfo.page < pageInfo.pages - 1) {
          tableRegForms.page("next").draw("page"); // Chuyển đến trang tiếp theo
        }
      },
    },
  ])
);


