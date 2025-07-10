package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.OccupationGroupDTO;
import com.skillgapguide.sgg.Entity.OccupationGroup;
import com.skillgapguide.sgg.Repository.OccupationGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OccupationGroupService {
    private final OccupationGroupRepository occupationGroupRepository;

    public List<OccupationGroupDTO> getAllOccupationGroups() {
        return occupationGroupRepository.findAll().stream().map(group ->
                new OccupationGroupDTO(
                        group.getId(),
                        group.getName(),
                        group.getStatus()
                )
        ).collect(Collectors.toList());
    }

    public List<OccupationGroupDTO> getEnabledOccupationGroups() {
        return occupationGroupRepository.findAllByStatusIgnoreCase("Enable").stream().map(group ->
                new OccupationGroupDTO(
                        group.getId(),
                        group.getName(),
                        group.getStatus()
                )
        ).collect(Collectors.toList());
    }

    public void addOccupationGroup(OccupationGroupDTO dto) {
        //Check co null khong
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên nhóm nghề nghiệp không được để trống");
        }

        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        // Check duplicate
        Optional<OccupationGroup> existing = occupationGroupRepository.findByNameIgnoreCase(dto.getName().trim());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Tên nhóm nghề nghiệp đã tồn tại");
        }

        // Check status
        String status = dto.getStatus().trim();
        if (!"Enable".equalsIgnoreCase(status) && !"Disable".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Trạng thái chỉ được là 'Enable' hoặc 'Disable'");
        }

        // Save entity
        OccupationGroup newGroup = new OccupationGroup();
        newGroup.setName(dto.getName().trim());
        newGroup.setStatus(status);
        occupationGroupRepository.save(newGroup);
    }

    public void editOccupationGroup(OccupationGroupDTO dto) {
        // Check ID null
        if (dto.getId() == null) {
            throw new IllegalArgumentException("ID nhóm nghề nghiệp không được để trống");
        }

        // Tìm theo ID
        Optional<OccupationGroup> optionalGroup = occupationGroupRepository.findById(dto.getId());
        if (optionalGroup.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy nhóm nghề nghiệp với ID: " + dto.getId());
        }

        // Check name null hoặc rỗng
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên nhóm nghề nghiệp không được để trống");
        }

        // Check status null hoặc rỗng
        if (dto.getStatus() == null || dto.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        // Check status chỉ là Enable hoặc Disable
        String status = dto.getStatus().trim();
        if (!status.equalsIgnoreCase("Enable") && !status.equalsIgnoreCase("Disable")) {
            throw new IllegalArgumentException("Trạng thái chỉ được là 'Enable' hoặc 'Disable'");
        }

        // Check duplicate name (khác ID hiện tại)
        Optional<OccupationGroup> existing = occupationGroupRepository.findByNameIgnoreCase(dto.getName().trim());
        if (existing.isPresent() && !existing.get().getId().equals(dto.getId())) {
            throw new IllegalArgumentException("Tên nhóm nghề nghiệp đã tồn tại");
        }

        // Cập nhật
        OccupationGroup group = optionalGroup.get();
        group.setName(dto.getName().trim());
        group.setStatus(status);
        occupationGroupRepository.save(group);
    }

    public boolean toggleOccupationGroupStatus(Integer id) {
        Optional<OccupationGroup> optional = occupationGroupRepository.findById(id);
        if (optional.isPresent()) {
            OccupationGroup group = optional.get();
            String currentStatus = group.getStatus();

            if (currentStatus == null) {
                throw new IllegalStateException("Status không được để trống");
            }

            String normalized = currentStatus.trim().toLowerCase();

            if (!normalized.equals("enable") && !normalized.equals("disable")) {
                throw new IllegalStateException("Status hiện tại không hợp lệ: " + currentStatus);
            }

            String newStatus = normalized.equals("enable") ? "Disable" : "Enable";
            group.setStatus(newStatus);
            occupationGroupRepository.save(group);
            return true;
        }
        return false;
    }
}
