package com.skillgapguide.sgg.Exception;

import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles IllegalArgumentException and returns a standardized error response.
     *
     * @param ex the exception to handle
     * @return a ResponseEntity containing the error response
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Response<Object>> handleIllegalStateException(IllegalStateException ex) {
        Response<Object> response = new Response<>(
                EHttpStatus.BAD_REQUEST,
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
