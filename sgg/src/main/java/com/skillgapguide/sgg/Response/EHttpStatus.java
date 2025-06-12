package com.skillgapguide.sgg.Response;

import lombok.Getter;

@Getter
public enum EHttpStatus {
    OK(200, "Thành công"),
    INCORRECT_INFORMATION(300, "Thông tin không chính xác"),
    ALREADY_EXISTS(301, "Thông tin đã tồn tại"),
    INVALID_INFORMATION(302, "Thông tin không hợp lệ"),
    LACK_INFORMATION(303, "Thiếu thông tin"),
    DISABLE_ACCOUNT(304, "Tài khoản bị khóa"),
    NO_RESULT_FOUND(307, "Không tồn tại kết quả tìm kiếm"),
    STATUS_312(312, "message"),
    BAD_REQUEST(400, "Yêu cầu này bị lỗi"),
    UNAUTHORIZED(401, "Không có quyền"),
    FORBIDDEN(403, "Bị cấm truy cập"),
    METHOD_NOT_ALLOWED(405, "Phương thức không được phép"),
    UNSUPPORTED_MEDIA_TYPE(415, "Không hỗ trợ kiểu media này"),
    REQUESTED_RANGE_NOT_SATISFIABLE(416, "Phạm vi yêu cầu không thỏa mãn"),
    INTERNAL_SERVER_ERROR(500, "Lỗi máy chủ nội bộ");

    private final int code;
    private final String message;

    EHttpStatus(int value, String message) {
        this.code = value;
        this.message = message;
    }
}
