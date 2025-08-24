package com.skillgapguide.sgg.Service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendMailSendsEmailSuccessfully() {
        String to = "test@example.com";
        String subject = "Test Subject";
        String text = "Test email content";

        emailService.sendMail(to, subject, text);

        verify(javaMailSender).send(argThat((SimpleMailMessage message) ->
                message.getTo()[0].equals(to) &&
                        message.getSubject().equals(subject) &&
                        message.getText().equals(text)));
    }
}