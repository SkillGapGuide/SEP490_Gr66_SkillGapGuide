package com.skillgapguide.sgg.Dto;

import com.skillgapguide.sgg.Entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFileHistoryDTO {
    private List<AuditLog> cvFiles;
    private List<AuditLog> jobDesFile;
}
