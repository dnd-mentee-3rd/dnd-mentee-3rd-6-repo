package org.dnd3.udongsa.neighborcats.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.validation.ConstraintViolationException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler{

  @ExceptionHandler(CustomException.class)
  public ResponseEntity<Object> global(CustomException ex) {
    CustomExceptionResponse response = new CustomExceptionResponse(LocalDateTime.now(), ex.getHttpStatus(),
        ex.getMessage(), ex.getDescription());
    ex.printStackTrace();
    return ResponseEntity.status(ex.getHttpStatus()).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> global(Exception ex) {
    HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    CustomExceptionResponse response = new CustomExceptionResponse(LocalDateTime.now(), httpStatus, ex.getMessage(),
        ExceptionUtils.getStackTrace(ex));
    ex.printStackTrace();
    return ResponseEntity.status(httpStatus).body(response);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
    MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {

    ex.printStackTrace();
    HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
    });
    CustomExceptionResponse response = new CustomExceptionResponse(
        LocalDateTime.now(), 
        httpStatus, 
        "필드 제약조건을 위반하였습니다.",
        errors);

    return ResponseEntity.status(httpStatus).body(response);
}

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<Object> handleValidationExceptions(ConstraintViolationException ex)
      throws JsonProcessingException {
    ex.printStackTrace();
    HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
    Map<String, String> errors = new HashMap<>();
    ex.getLocalizedMessage();
    ex.getConstraintViolations().forEach((violation) -> {
      String fieldName = violation.getPropertyPath().toString();
      String errorMessage = violation.getMessage();
      errors.put(fieldName, errorMessage);
    });
    String json = new ObjectMapper().writeValueAsString(errors);
    CustomExceptionResponse response = new CustomExceptionResponse(
        LocalDateTime.now(), 
        httpStatus, 
        "필드 제약조건을 위반하였습니다.",
        json);
    return ResponseEntity.status(httpStatus).body(response);
  }

  
}