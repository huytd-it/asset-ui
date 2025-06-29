<?php

require_once './reg-form.modal.php';
require_once './history.modal.php';
?>
<link rel="stylesheet" href="\crm\plugin\timepicker\jquery.timepicker.css" />
<style>
  .event-danger.fc-event {
    color: #3788d8 !important;
    background-color: #fff0 !important;
    border-color: #fff0;
  }

  .fc-event.event-primary {
    color: #fff !important;
    background-color: #3788d8 !important;
    border-color: #fff;
  }

  .fc-event.event-warning {
    color: #fff !important;
    background-color: #FF9800 !important;
    border-color: #fff;
  }

  .fc-event.event-primary.lab {
    color: #fff !important;
    background-color: #28a745 !important;
    border-color: #28a745;
  }

  .fc .fc-daygrid-day-number {
    font-size: 1.5rem;
    font-weight: bold;

  }

  .fc-v-event .fc-event-main {
    color: #004085 !important;

  }

  .fc-listWeek-view .fc-event {
    display: revert !important;
  }

  .fc-event.event-primary:hover {
    color: black !important;
  }

  .fc-daygrid-event-dot {
    display: inline-block;
  }

  .fc-direction-ltr .fc-daygrid-event.fc-event-end,
  .fc-direction-rtl .fc-daygrid-event.fc-event-start {
    font-size: .7rem !important;
  }

  .fc-daygrid-dot-event .fc-event-title {
    display: inline;
  }

  .fc-direction-ltr .fc-daygrid-event .fc-event-time {
    display: inline;
  }

  .fc-daygrid-event-dot {
    border: #fff;
  }
</style>
<style>
  .alert-error {
    color: #fff !important;
    background-color: #FF004D !important;
    border-color: #FF004D !important;
  }



  .ui-widget.ui-widget-content {
    min-height: 30rem !important;
  }

  .is_damaged {
    border: none;
    background-color: #f2740573;
  }

  .is_damaged .index-row {
    background-color: #F27405;
    color: #000;
    border: none;
  }
</style>
<section>
  <div class="container-fluid wrapper mt-1">
    <div class="card inner">
      <div class="card-header">
        <div class="grid">
          <div class="grid__item  small--one-whole">
            <div class="row">
              <div class="col-xl-6">
                <div class="section-title lang" vi="ĐĂNG KÝ MƯỢN VẬT TƯ THIẾT BỊ">
                  Equipment Borrowing Form
                </div>

              </div>
              <div class="col-xl-6">
                <div class="custom-checkbox float-right">
                  <input type="checkbox" id="toggle_rows" checked>
                  <label for="toggle_rows">
                    <span class="lang" vi='Mở rộng/Thu gọn'>Expand/Collapse</span>
                  </label>
                </div>
              </div>

            </div>




          </div>
        </div>
      </div>
      <div class="card-body" style="padding: 10px;">
        <div class="row">
          <div class="col-lg-12" <?php echo isset($_REQUEST['form_key']) ? 'hidden' : '' ?>>

          </div>

          <div class="col-lg-12" id="alert">

          </div>
          <div class="col-lg-12" id="alert2">

          </div>
          <div class="col-xl-12 form-group group-button-right">
            <button class="btn btn-green ml-1" id="btn_add_form_type">
              <i class="fa fa-2x fa-plus-circle" aria-hidden="true"></i> <span class="lang" vi='Tạo phiếu mới'>
                Create form</span>
            </button>




          </div>

          <div class="col-xl-12" <?php echo isset($_REQUEST['form_key']) ? 'hidden' : '' ?>>

            <div class="form-row form-group" id="reg_form_filter">
              <div class="col-xl-2 col-lg-6 form-group">
                <label for="receiver" class="lang" vi="Tìm kiếm nhanh">Search</label>
                <input type="text" class="form-control" id="search" name="search" placeholder="">
              </div>
              <div class="col-xl-2 col-lg-6 form-group" data-permission="Asset_Manager|Asset_Admin">
                <label for="" class="lang" vi="Người mượn"> Staff ID</label>
                <select name="staff_id">

                </select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group">
                <label for="" class="lang" vi="Tài sản">Item </label>
                <select name="item_key">

                </select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group">
                <label for="" class="lang" vi="Phòng học">Room </label>
                <select name="room_key">

                </select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group" hidden>
                <label for="" class="lang">Form Key </label>
                <input value="<?php echo isset($_REQUEST['form_key']) ? $_REQUEST['form_key'] : "" ?>" class="form-control" name="form_key">
                <input value="<?php echo isset($_REQUEST['item_key']) ? $_REQUEST['item_key'] : "" ?>" class="form-control" name="item_key_filter">
              </div>

              <div class="col-xl-1 col-lg-6 form-group">
                <label for="" class="lang" vi="Tiêu hao">Damaged</label>
                <select name="has_damaged">
                  <option vi="-- Tất cả --" value="">-- All --</option>
                  <option value="1" vi="Có">Yes</option>
                </select>
              </div>




              <div class="col-xl-2 col-lg-6 form-group collapse show ">
                <label for="receiver" vi="Khoảng ngày đăng ký"> Range </label>
                <div class="d-flex justify-content-between">
                  <input type="text" style="width:49%;" class="form-control" name="borrowing_date_start" placeholder="From">
                  <input type="text" style="width:49%" class="form-control" name="borrowing_date_end" placeholder="To">
                </div>

              </div>

              <div class="col-xl-1 col-lg-6 form-group">
                <label for="receiver" class="lang" vi="Năm học">Academic Year</label>
                <select name="school_year">

                </select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group">
                <label for="receiver" class="lang" vi="Loại phiếu">Form Type</label>
                <select name="type_key">

                </select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group">
                <label for="" class="lang" vi="Tình trạng phiếu">Status </label>
                <select name="status_list" multiple>
                  <option value="" vi="Tất cả"> -- All --</option>
                  <option value="in_progress" vi="Đang xử lý">In Progress</option>
                  <option value="approved" vi="Đã duyệt">Approved</option>
                  <option value="borrowed" vi="Đã mượn">Borrowed</option>
                  <option value="rejected" vi="Đã từ chối">Rejected</option>
                  <option value="pending_return_confirmation" vi="Đã trả">Pending Return Confirmation</option>
                  <option value="completed" vi="Đã hoàn thành">Completed</option>
                  <option value="expired" vi="Quá hạn">Expired</option>

                </select>
                </select>
              </div>

              <div class="col-xl-2 col-lg-6 form-group">
                <label for="" class="lang" vi="Môn học"> Subject </label>
                <select name="subject_key"></select>
              </div>
              <div class="col-xl-2 col-lg-6 form-group" <?php echo !isset($_REQUEST['form_keys']) ? 'hidden' : '' ?>>
                <label for="">&nbsp;</label>
                <textarea rows="1" placeholder="Form Keys" value="<?php echo isset($_REQUEST['form_keys']) ? $_REQUEST['form_keys'] : "" ?>" class="form-control" name="form_keys"><?php echo isset($_REQUEST['form_keys']) ? $_REQUEST['form_keys'] : "" ?></textarea>
              </div>

              <div class="col-xl-6 group-button-right form-group mt-3">

                <button class="btn btn-green" id="btn_filter" vi="Lọc / Tìm kiếm"> <i class="fa fa-2x fa-filter" aria-hidden="true"></i> Filter </button>
                <button class="btn btn-outline-success " vi="Xuất dữ liệu (Excel)" data-permission="Lab_Manager" id="btn_export">
                  Export Excel </button>
                <button class="btn btn-outline-danger " vi="In phiếu tiêu hao (PDF)" data-permission="Lab_Manager" id="btn_export_pdf">
                  <i class="fas fa-2x fa-file-pdf"></i>
                  Print Damaged Records </button>
                <button class="btn btn-outline-danger " id="btn_print_pdf_borrowing_form">
                  <span vi="In phiếu (PDF)">
                    Print Forms
                  </span>
                </button>

              </div>


            </div>







          </div>
          <div class="w-100 alert alert-danger w-100 m-2 alert-dismissible" role="alert" hidden>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <p>
              <b>Lưu ý:</b> <br>
            <ul class="list-group">
              <li>Khi thấy hàng đăng ký có màu đỏ nghĩa là Đăng ký mượn phòng trùng với lịch của giáo viên khác (có
                ghi rõ trong cột <b>"Mượn phòng"</b>),
                vui lòng tự điều chỉnh lại cho phù hợp hoặc liên hệ với Nhân viên quản lý
              </li>
              <li>
                Khi chọn số lượng của hóa chất sẽ có hiện tượng không chọn được nhiều hơn 1 số nhất định là do số
                lượng vật tư trong kho không đủ
              </li>

              <li>Thầy cô có mượn vật tư, hóa chất tài sản vui lòng hoàn thành phiếu bằng cách nhấn nút "Trả đồ" để được tạo phiếu mượn</li>
              <li>Chức năng "Copy/Tạo bản sao" được dùng để tạo phiếu nhanh hơn</li>
              <li>Phản hồi nếu xảy ra lỗi tại đây: <a target="_blank" rel="noopener noreferrer"
                  href="mailto:software@lsts.edu.vn?subject=Báo lỗi phần mềm Tài sản/Phòng thí nghiệm&body=Lý do: ">software@lsts.edu.vn</a></li>

            </ul>
            </p>

          </div>
          <div class="col-xl-12">

            <table id="equipment_table" class="table table-bordered responsive table-hover" style="width: 100%;">
              <thead>
                <tr>
                  <th>#</th>
                  <th data-vi-title="Người mượn">Borrower</th>
                  <th data-vi-title="Danh sách tài sản">Items</th>
                  <th data-vi-title="Danh sách phòng">Rooms</th>
                  <th data-vi-title="Biên bản hư/mất">Damaged Record</th>
                  <th data-vi-title="Lịch sử thay đổi">Changes History</th>
                  <th data-vi-title="Tính năng">Feature</th>
                </tr>
              </thead>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

<script src="js/utilities.js?v=<?PHP echo time() ?>"></script>
<script src="\crm\pages\internal\lab_management\reg-form\reg-form.js?v=<?PHP echo time() ?>"></script>
<script src="\crm\plugin\timepicker\jquery.timepicker.js"></script>