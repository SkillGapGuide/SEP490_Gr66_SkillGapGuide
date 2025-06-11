package com.skillgapguide.sgg.Response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<R> {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private String timestamp;
    private Integer status;
    private String message;
    private R result;

    public Response(EHttpStatus status) {
        this.status = status.getCode();
        this.message = status.getMessage();
    }

    public Response(EHttpStatus status, R result) {
        this.status = status.getCode();
        this.message = status.getMessage();
        this.result = result;
    }

    public Response(EHttpStatus status, String message, R result) {
        this.status = status.getCode();
        this.message = message;
        this.result = result;
    }
}
